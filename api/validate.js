// ════════════════════════════════════════════════════════════════
// LEADER COHERENCE SNAPSHOT — VALIDATION ENGINE
// Vercel Serverless Function (api/validate.js)
//
// Receives scoring engine outputs + form fields.
// Returns validation_status, validation_polarity,
// validation_flags_json, validation_confirmations_json,
// blank_clusters_count.
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

    // ── BLANK_CLUSTER — CRITICAL ──────────────────────────────────
    // true_blank_clusters: count of clusters where no statement was selected (combo = BLANK)
    const trueBlankClusters = parseInt(v.true_blank_clusters) || 0;
    if (trueBlankClusters > 0) {
      flags.push({
        severity: "CRITICAL",
        type: "BLANK_CLUSTER",
        count: trueBlankClusters,
        notes: "One or more clusters received no selection. This is a form submission error, not a valid coherence reading. Row must be corrected before use.",
        detected_at: now,
        detected_by: "auto_v2"
      });
    }

    // ── AMPLITUDE_MISMATCH — HIGH ─────────────────────────────────
    // Fires when a resistance-path cluster (combo = A, B, or C) has amplitude = 0.
    // Amplitude 0 is only valid on the D-path ("clear throughout").
    const clusterKeys = ["01","02","03","04","05","06","07","08"];
    const domainLabels = ["openness","structure","direction","vitality","transition","exposure","clarity","integration"];

    for (let i = 0; i < clusterKeys.length; i++) {
      const cn = clusterKeys[i];
      const combo = (v[`c${cn}_combo`] || "").toUpperCase().trim();
      const amp = parseInt(v[`v_amp_${cn}`]) || 0;
      if (combo !== "BLANK" && combo !== "D" && combo !== "" && amp === 0) {
        flags.push({
          severity: "HIGH",
          type: "AMPLITUDE_MISMATCH",
          domain: domainLabels[i],
          combo: combo,
          amplitude_received: amp,
          notes: "Resistance statement(s) selected but amplitude = 0. Amplitude 0 is D-path only. Engine scored this cluster as 0 — treated as COHERENT. Verify whether leader left the amplitude blank.",
          detected_at: now,
          detected_by: "auto_v2"
        });
      }
    }

    // ── SEMANTIC_INVERSION — CRITICAL ─────────────────────────────
    // Q8 reversion statement selected but integration state = COHERENT.
    const reversionMarkers = [
      "not held", "reverted", "didn't stick", "fell back",
      "did not hold", "haven't held"
    ];
    const q8Text = (v.q8_statement_text || "").toLowerCase();
    const integrationState = (v.domain_integration_state || "").toUpperCase();
    const q8Inversion = reversionMarkers.some(m => q8Text.includes(m)) && integrationState === "COHERENT";

    if (q8Inversion) {
      flags.push({
        severity: "CRITICAL",
        type: "SEMANTIC_INVERSION",
        domain: "integration",
        input_signal: v.q8_statement_text,
        rendered_state: v.domain_integration_state,
        detected_at: now,
        detected_by: "auto_v2"
      });
    }

    // ── MISSING_PRESENCE_LEVEL — MEDIUM ──────────────────────────
    // Q8 statement confirmed but presence level blank.
    if (v.q8_statement_text && v.q8_statement_text.trim() !== "" &&
        (!v.q8_presence_level || v.q8_presence_level.trim() === "")) {
      flags.push({
        severity: "MEDIUM",
        type: "MISSING_PRESENCE_LEVEL",
        domain: "integration",
        notes: "Q8 confirmed signal but no presence level recorded.",
        detected_at: now,
        detected_by: "auto_v2"
      });
    }

    // ── MECHANICAL_MATCH confirmations — WEAK ────────────────────
    const domainStateFields = [
      ["openness",   v.domain_openness_state],
      ["structure",  v.domain_structure_state],
      ["direction",  v.domain_direction_state],
      ["vitality",   v.domain_vitality_state],
      ["transition", v.domain_transition_state],
      ["exposure",   v.domain_exposure_state],
      ["clarity",    v.domain_clarity_state],
    ];

    for (const [domain, state] of domainStateFields) {
      if (state && state.trim() !== "") {
        confirmations.push({
          domain: domain,
          strength: "WEAK",
          type: "MECHANICAL_MATCH",
          rendered_state: state,
          detected_at: now,
          detected_by: "auto_v2"
        });
      }
    }

    if (!q8Inversion && integrationState !== "") {
      confirmations.push({
        domain: "integration",
        strength: "WEAK",
        type: "MECHANICAL_MATCH",
        rendered_state: v.domain_integration_state,
        detected_at: now,
        detected_by: "auto_v2"
      });
    }

    // ── Status and polarity ───────────────────────────────────────
    let validationStatus = "UNREVIEWED";
    let validationPolarity = "";

    if (flags.length > 0 && confirmations.length > 0) {
      validationStatus = "MIXED";
      validationPolarity = "MIXED";
    } else if (flags.length > 0) {
      validationStatus = "FLAGGED";
      validationPolarity = "FLAG";
    } else if (confirmations.length > 0) {
      validationPolarity = "CONFIRMATION";
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
