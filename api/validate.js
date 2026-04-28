// ════════════════════════════════════════════════════════════════
// LEADER COHERENCE SNAPSHOT — VALIDATION ENGINE v4
// Vercel Serverless Function (api/validate.js)
//
// Receives scoring engine outputs + form fields.
// Returns validation_status, validation_polarity,
// validation_flags_json, validation_confirmations_json,
// blank_clusters_count.
//
// v4 changes (paired with cf_scoring_engine_v7):
//
//   FIX A — STATE_MISMATCH calibration
//            v3 fired when: isResistancePath && amp > 0 && renderedState === "COHERENT"
//            This produced 26 false-positive flags in the pre-production cohort
//            (LS-193 through LS-202). A single resistance selection at amplitude=1
//            produces cluster_score=1, which is correctly COHERENT (0–1 band).
//            The flag logic was treating correct engine output as an error.
//            Fix: change threshold from amp > 0 to clusterScore >= 2.
//            STATE_MISMATCH now only fires when the scored cluster_score is ≥ 2
//            but the rendered state is still COHERENT — which is a genuine engine error.
//            Implementation: reads c{nn}_score from the scoring engine payload
//            (available as v.c01_score … v.c08_score).
//
//   FIX B — SEMANTIC_INVERSION marker list extended to all three Q8 statements
//            v3 markers only covered c08_A ("reverted to prior patterns" → "reverted").
//            c08_B ("haven't become part of how I actually operate") and
//            c08_C ("re-starting shifts that should have already been embedded")
//            had no matching marker and would not trigger SEMANTIC_INVERSION.
//            Fix: added "haven't become part" (c08_B) and "re-starting shifts" (c08_C).
//            Note: after cf_scoring_engine_v7 deployment, Q8 Integration is hard-floored
//            to minimum DRIVEN when any resistance statement is selected, so
//            SEMANTIC_INVERSION should never fire on valid readings. It is retained
//            as a safety net — if it fires, the scoring engine has a regression.
//
// v3 additions retained:
//   - MISSING_PRESENCE_LEVEL across all 8 clusters
//   - OVERALL_VS_DOMAIN_INCONSISTENCY (case A and B)
//   - MECHANICAL_MATCH skips flagged domains
//   - All checks unified into per-cluster loop
// ════════════════════════════════════════════════════════════════

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  try {
    const v = req.body;
    const flags = [];
    const confirmations = [];
    const now = new Date().toISOString();

    const clusterKeys    = ["01","02","03","04","05","06","07","08"];
    const domainLabels   = ["openness","structure","direction","vitality","transition","exposure","clarity","integration"];
    const domainStateFields = [
      v.domain_openness_state,
      v.domain_structure_state,
      v.domain_direction_state,
      v.domain_vitality_state,
      v.domain_transition_state,
      v.domain_exposure_state,
      v.domain_clarity_state,
      v.domain_integration_state,
    ];
    const qStatements = [
      v.q1_statement_text, v.q2_statement_text, v.q3_statement_text, v.q4_statement_text,
      v.q5_statement_text, v.q6_statement_text, v.q7_statement_text, v.q8_statement_text,
    ];
    const qPresenceLevels = [
      v.q1_presence_level, v.q2_presence_level, v.q3_presence_level, v.q4_presence_level,
      v.q5_presence_level, v.q6_presence_level, v.q7_presence_level, v.q8_presence_level,
    ];

    // ── BLANK_CLUSTER — CRITICAL ──────────────────────────────────
    // Clusters where no statement was selected at all. Form error.
    const trueBlankClusters = parseInt(v.true_blank_clusters) || 0;
    if (trueBlankClusters > 0) {
      flags.push({
        severity: "CRITICAL",
        type: "BLANK_CLUSTER",
        count: trueBlankClusters,
        notes: "One or more clusters received no selection. This is a form submission error, not a valid coherence reading. Row must be corrected before use.",
        detected_at: now,
        detected_by: "auto_v4"
      });
    }

    // ── PER-CLUSTER CHECKS ────────────────────────────────────────
    // Runs AMPLITUDE_MISMATCH, STATE_MISMATCH, MISSING_PRESENCE_LEVEL,
    // SEMANTIC_INVERSION, and MECHANICAL_MATCH for each of the 8 domains.

    // FIX B: Extended reversion markers covering all three Q8 statements:
    //   c08_A — "reverted to prior patterns"          → "reverted"
    //   c08_B — "haven't become part of how I..."     → "haven't become part"
    //   c08_C — "re-starting shifts that should..."   → "re-starting shifts"
    // The original v3 markers are retained; three new markers added below.
    const reversionMarkers = [
      "not held",
      "reverted",
      "didn't stick",
      "fell back",
      "did not hold",
      "haven't held",
      "haven't become part",   // FIX B: covers c08_B
      "re-starting shifts",    // FIX B: covers c08_C
    ];

    for (let i = 0; i < clusterKeys.length; i++) {
      const cn            = clusterKeys[i];
      const domain        = domainLabels[i];
      const combo         = (v[`c${cn}_combo`] || "").toUpperCase().trim();
      const amp           = parseInt(v[`v_amp_${cn}`]) || 0;
      // FIX A: read cluster score directly from scoring engine output
      const clusterScore  = parseInt(v[`c${cn}_score`]) || 0;
      const renderedState = (domainStateFields[i] || "").toUpperCase().trim();
      const statementText = (qStatements[i] || "").trim();
      const presenceLevel = (qPresenceLevels[i] || "").trim();

      const isResistancePath = combo !== "" && combo !== "D" && combo !== "BLANK";
      const domainFlagsBeforeThisCluster = flags.length;

      // ── AMPLITUDE_MISMATCH — HIGH ───────────────────────────────
      // Resistance path selected but amplitude = 0.
      // Amplitude 0 is only valid on D-path (no resistance selected).
      if (isResistancePath && amp === 0) {
        flags.push({
          severity: "HIGH",
          type: "AMPLITUDE_MISMATCH",
          domain: domain,
          combo: combo,
          amplitude_received: amp,
          notes: "Resistance statement(s) selected but amplitude = 0. Amplitude 0 is D-path only. Engine scored this cluster as 0 — treated as COHERENT. Verify whether leader left the amplitude blank.",
          detected_at: now,
          detected_by: "auto_v4"
        });
      }

      // ── STATE_MISMATCH — HIGH ───────────────────────────────────
      // FIX A: threshold changed from amp > 0 to clusterScore >= 2.
      //
      // Previous logic (v3): isResistancePath && amp > 0 && renderedState === "COHERENT"
      //   → fired on score=1 (1 resistance × amp=1 = 1), which IS correctly COHERENT.
      //   → produced 26 false positives in the pre-production cohort.
      //
      // Corrected logic (v4): isResistancePath && clusterScore >= 2 && renderedState === "COHERENT"
      //   → score=1 no longer triggers the flag (correct, coherent by design).
      //   → score≥2 rendering COHERENT is a genuine engine error (threshold is 0–1=COHERENT).
      //   → clusterScore read from v.c{nn}_score (scoring engine output field).
      if (isResistancePath && clusterScore >= 2 && renderedState === "COHERENT") {
        flags.push({
          severity: "HIGH",
          type: "STATE_MISMATCH",
          domain: domain,
          combo: combo,
          amplitude_received: amp,
          cluster_score: clusterScore,
          rendered_state: renderedState,
          notes: `Resistance statements selected with cluster_score=${clusterScore} (≥2), but domain rendered as COHERENT. COHERENT band is 0–1 only. Scoring engine calculation error in this cluster.`,
          detected_at: now,
          detected_by: "auto_v4"
        });
      }

      // ── MISSING_PRESENCE_LEVEL — MEDIUM ────────────────────────
      // Resistance path selected but no presence level recorded.
      // Without a presence level, amplitude may have defaulted incorrectly.
      if (isResistancePath && presenceLevel === "") {
        flags.push({
          severity: "MEDIUM",
          type: "MISSING_PRESENCE_LEVEL",
          domain: domain,
          notes: `${domain.charAt(0).toUpperCase() + domain.slice(1)}: resistance statement selected but presence level is blank. Amplitude may have defaulted; scoring validity uncertain.`,
          detected_at: now,
          detected_by: "auto_v4"
        });
      }

      // ── SEMANTIC_INVERSION — CRITICAL (integration / Q8 only) ──
      // Reversion statement confirmed for integration, but rendered COHERENT.
      //
      // After cf_scoring_engine_v7 deployment, Integration is hard-floored to
      // minimum DRIVEN (score=2) whenever any Q8 resistance statement is selected.
      // This check should therefore never fire on valid v7 readings.
      // It is retained as a safety net: if it fires, the scoring engine has a
      // regression and Integration is incorrectly scoring COHERENT again.
      //
      // FIX B: marker list extended to cover c08_B and c08_C (see top of loop).
      if (domain === "integration" && statementText !== "") {
        const q8Lower = statementText.toLowerCase();
        const isInversion = reversionMarkers.some(m => q8Lower.includes(m)) && renderedState === "COHERENT";
        if (isInversion) {
          flags.push({
            severity: "CRITICAL",
            type: "SEMANTIC_INVERSION",
            domain: "integration",
            input_signal: statementText,
            rendered_state: renderedState,
            notes: "Q8 reversion statement confirmed but Integration rendered as COHERENT. This should not occur with cf_scoring_engine_v7 (Q8 hard-floor). Indicates a scoring engine regression — rendered prose will directly contradict input semantics.",
            detected_at: now,
            detected_by: "auto_v4"
          });
        }
      }

      // ── MECHANICAL_MATCH — WEAK confirmation ────────────────────
      // Only fires if this cluster has no flags. Confirming a flagged
      // domain is misleading — the match is not trustworthy.
      const thisDomainFlagged = flags.length > domainFlagsBeforeThisCluster;
      if (!thisDomainFlagged && renderedState !== "") {
        confirmations.push({
          domain: domain,
          strength: "WEAK",
          type: "MECHANICAL_MATCH",
          rendered_state: renderedState,
          detected_at: now,
          detected_by: "auto_v4"
        });
      }
    }

    // ── OVERALL_VS_DOMAIN_INCONSISTENCY ───────────────────────────
    // Checks whether the overall state is consistent with domain states.
    // Two failure modes:
    //   (A) Overall = COHERENT but one or more domains are non-COHERENT.
    //       Unusual but possible if overall calculation has a bug.
    //   (B) Overall = non-COHERENT but ALL domains are COHERENT.
    //       Should never happen — the overall state is derived from domains.
    const overallState = (v.overall_coherence_state || "").toUpperCase().trim();
    const nonCoherentStates = ["DRIVEN", "STRAINED", "DRIFTING", "FRACTURED"];

    if (overallState) {
      const domainStatesClean = domainStateFields.map(s => (s || "").toUpperCase().trim());
      const nonCoherentDomains = domainLabels.filter((d, i) => nonCoherentStates.includes(domainStatesClean[i]));
      const allDomainsCoherent = nonCoherentDomains.length === 0;

      // Case A: Overall COHERENT but domains show resistance
      if (overallState === "COHERENT" && !allDomainsCoherent) {
        flags.push({
          severity: "MEDIUM",
          type: "OVERALL_VS_DOMAIN_INCONSISTENCY",
          overall_state: overallState,
          non_coherent_domains: nonCoherentDomains,
          notes: "Overall state is COHERENT but one or more domains read as non-COHERENT. Overall state calculation may have an error.",
          detected_at: now,
          detected_by: "auto_v4"
        });
      }

      // Case B: Overall non-COHERENT but all domains COHERENT
      if (nonCoherentStates.includes(overallState) && allDomainsCoherent) {
        flags.push({
          severity: "HIGH",
          type: "OVERALL_VS_DOMAIN_INCONSISTENCY",
          overall_state: overallState,
          notes: "Overall state is non-COHERENT but all 8 domains read as COHERENT. The overall state is derived from domain states — this combination is impossible without a scoring engine error.",
          detected_at: now,
          detected_by: "auto_v4"
        });
      }
    }

    // ── Status and polarity ───────────────────────────────────────
    let validationStatus   = "UNREVIEWED";
    let validationPolarity = "";

    if (flags.length > 0 && confirmations.length > 0) {
      validationStatus   = "MIXED";
      validationPolarity = "MIXED";
    } else if (flags.length > 0) {
      validationStatus   = "FLAGGED";
      validationPolarity = "FLAG";
    } else if (confirmations.length > 0) {
      validationPolarity = "CONFIRMATION";
      // validationStatus stays UNREVIEWED — auto confirmations still
      // need human review before being promoted to CONFIRMED.
    }

    return res.status(200).json({
      validation_status:             validationStatus,
      validation_polarity:           validationPolarity,
      validation_flags_json:         JSON.stringify(flags),
      validation_confirmations_json: JSON.stringify(confirmations),
      blank_clusters_count:          trueBlankClusters
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
