// ════════════════════════════════════════════════════════════════
// LEADER COHERENCE SNAPSHOT — CONTENT ASSEMBLY ENGINE v2
// Vercel Serverless Function (api/assemble.js)
// ════════════════════════════════════════════════════════════════
//
// CHANGES FROM v1:
//   - sec02 (Coherence State) removed — absorbed into gap_spectrum_reading
//   - sec03 (Primal Gap) removed — replaced by territory readings
//   - Territory states from scoring engine, not calculated client-side
//   - New fields: gap_spectrum_reading, gap_being_reading,
//     gap_relating_reading, gap_creating_reading, gap_bridge
//   - Fonts: Inter (body), Montserrat (headings)
//   - Combo check updated for "D" and "BLANK"
//   - blind_spot_distribution removed
// ════════════════════════════════════════════════════════════════

// ─── HTML STYLE FRAGMENTS ───
const ps = "<p style='font-family:Inter,sans-serif;font-size:10pt;color:#2E2E2C;line-height:1.2;margin-bottom:11px;'>";
const pe = "</p>";
const bld = "<strong style='color:#1A1A2E;'>";
const be = "</strong>";

function wrap(text) {
  return ps + text + pe;
}

const stateStyle = {
  'Coherent':  "color:#2A6B6A;font-weight:bold;",
  'Driven':    "color:#4A6FA5;font-weight:bold;",
  'Strained':  "color:#D4A843;font-weight:bold;",
  'Drifting':  "color:#7B2D8E;font-weight:bold;",
  'Fractured': "color:#A82828;font-weight:bold;",
};

function stSpan(state) {
  return "<span style='" + (stateStyle[state] || "") + "'>" + state + "</span>";
}

function displayState(raw) {
  const map = {
    'COHERENT':'Coherent','DRIVEN':'Driven','STRAINED':'Strained',
    'DRIFTING':'Drifting','FRACTURED':'Fractured','QUALIFIED':'Coherent'
  };
  return map[raw] || raw;
}
const TERRITORY_SUBTITLES = {
  "Being": {
    "Coherent": "The signal from your core is arriving and you are responding to it",
    "Driven": "The signal is arriving but being overridden by a self that performs too well to question",
    "Strained": "You know what is true — the cost of acting on it is what holds you",
    "Drifting": "The internal reference point that should orient everything else has become unreliable",
    "Fractured": "What you are operating from may no longer be connected to who you actually are",
  },
  "Relating": {
    "Coherent": "Truth is moving freely between you and the people around you",
    "Driven": "The signal is being edited before it reaches the surface — and no one around you knows",
    "Strained": "You know who needs to hear what — the cost of saying it is what holds you",
    "Drifting": "You may no longer be certain what the people around you actually think or need",
    "Fractured": "What moves between you and others is no longer carrying truth",
  },
  "Creating": {
    "Coherent": "What you intend and what you produce are aligned",
    "Driven": "The output is strong but the connection between the work and who you are is maintained by force",
    "Strained": "The gap between what you set out to build and what actually gets produced has widened enough to register",
    "Drifting": "The link between what you are building and the signal that should guide it has become unreliable",
    "Fractured": "What you are producing in the world is no longer connected to who you actually are",
  },
};
function buildPortraitFrame(state, diagPct) {
  const ds = displayState(state);
  return wrap("This is your Coherence Portrait — the Primal Gap as it exists in you right now. Your Coherent Core sits at the centre, always intact. Your Operating Surface — where you actually function in the world — sits at the "
    + bld + stSpan(ds) + be + " threshold, indicated as a "
    + bld + diagPct + "%" + be + " resistance to your core signal. Your core signal is filtered through three territories of your whole operating self — Being, Relating, and Creating. The readings that follow show how each territory is carrying that resistance.");
}
function buildTerritoryReading(territory, state, prose) {
  const stColor = stateStyle[state] || "color:#1A1A2E;font-weight:bold;";
  const subtitle = TERRITORY_SUBTITLES[territory][state];
  let out = "<h3 style='font-family:Montserrat,sans-serif;font-size:13pt;margin-top:22px;margin-bottom:4px;'>"
    + "<span style='color:#D4A843;font-weight:bold;'>" + territory + "</span>"
    + "<span style='color:#D4A843;font-weight:normal;'> — </span>"
    + "<span style='" + stColor + "'>" + state + "</span>"
    + "</h3>";
  out += "<p style='font-family:Inter,sans-serif;font-size:9pt;color:#8A8A9A;font-style:italic;margin-top:0;margin-bottom:14px;'>"
    + subtitle + "</p>";
  out += wrap(prose);
  return out;
}


// ════════════════════════════════════════════════════════════════
// SECTION 01: OPENING FRAME (6 versions)
// ════════════════════════════════════════════════════════════════

const SEC01 = {
  "FRACTURED": `{{leader_name}}, this is your Leader Coherence Snapshot, taken {{snapshot_date}}. Your system reads as Fractured — carrying comprehensive structural load across most operational domains, with a significant felt distance between where you are operating and where you know you are capable of operating. This is not a judgement. It is a reading of current conditions — conditions that are identifiable, structural, and responsive to precise intervention. What follows names the pattern with the specificity it requires.`,
  "STRAINED": `{{leader_name}}, this is your Leader Coherence Snapshot, taken {{snapshot_date}}. Your system reads as Strained — carrying distributed load across multiple domains, with a clear awareness that current conditions do not reflect the leadership you know you are capable of. You are not in denial about the friction. The diagnostic question is not whether it exists — you already know it does — but where it originates and what it is structurally costing you.`,
  "DRIFTING": `{{leader_name}}, this is your Leader Coherence Snapshot, taken {{snapshot_date}}. Your system reads as Drifting — carrying a diffuse, felt-level load that has not concentrated into structural crisis. The friction you are experiencing is present but difficult to locate with precision. This pattern often describes a leader between chapters — the one that is ending and the one that has not yet begun.`,
  "DRIVEN": `{{leader_name}}, this is your Leader Coherence Snapshot, taken {{snapshot_date}}. Your system reads as Driven — performing well by external measures while carrying structural load that has not yet registered at the felt level. This is a reading that warrants careful attention. The distance between your felt alignment and your system's actual load is the most important signal in this report.`,
  "COHERENT": `{{leader_name}}, this is your Leader Coherence Snapshot, taken {{snapshot_date}}. Your system reads as Coherent — low structural friction across operational domains, with strong felt alignment between where you are operating and where you know you are capable of operating. This reading confirms a current state, not a permanent one. What follows gives you the structural frame to understand what this means and how to read the changes when they come.`,
  "QUALIFIED": `{{leader_name}}, this is your Leader Coherence Snapshot, taken {{snapshot_date}}. Your system produces the cleanest possible reading across all operational domains. This report addresses what that means — and what it may not mean — with the same precision it would bring to any other reading.`,
};


// ════════════════════════════════════════════════════════════════
// GAP SPECTRUM READING
// Sits beneath the resistance spectrum graphic
// Absorbs old sec02 content — names state + full explanation
// ════════════════════════════════════════════════════════════════

const GAP_SPECTRUM_INTRO = `The five operating states — Coherent, Driven, Strained, Drifting, and Fractured — are not personality types. They are not permanent categories. They are readings of how you are currently operating, and they are designed to change. A leader who reads as Strained today may read as Driven in three months and Coherent in six. The state is a signal of current conditions, not a definition of who you are.`;

const GAP_SPECTRUM_STATE = {
  "COHERENT": `A Coherent reading does not mean the absence of friction. It means the friction that exists is being metabolised — absorbed by the system without accumulating as structural load. The signal from your coherent core is reaching your operating surface with minimal delay. What you know and what you do are close enough that the gap between them is not generating measurable cost. This is the driven-dissipative balance — the state where resistance is present but structurally involved in maintaining coherence rather than eroding it.`
  + pe + ps
  + `This reading requires a particular kind of honesty from the diagnostic. Your system produces minimal friction across all operational domains, and your felt alignment is at or near its maximum. In any system operating under real-world conditions, this is the rarest possible reading. It has two structurally opposite interpretations. The first is genuine coherence — the conditions of your leadership are aligned at a level that produces no detectable friction. The second is that the diagnostic has reached the boundary of what self-report can detect. Some operating conditions — particularly those that have become so thoroughly normalised that they no longer register as friction — are invisible to any instrument that relies on the leader's own recognition. This report names both possibilities with equal weight.`,

  "DRIVEN": `A Driven state is the most structurally complex reading this diagnostic produces. Your felt alignment is high — you experience yourself as operating close to your centre of gravity. At the same time, your system is carrying significant structural load in domains that carry real consequence. This combination is the signature of a leader whose adapted self is performing at peak — externally rewarded, delivering results, while internally the distance from the core self is widening in ways that are not yet felt. Driven is not a compliment. It is a signal that the gap between who you are and how you are operating is at its widest precisely when it is least visible to you.`
  + pe + ps
  + `The structural danger of a Driven reading is that the external signals — performance, recognition, reward — actively reinforce the adapted self's operating mode. The better it performs, the less reason there is to examine the cost. The load accumulates in domains the leader is not attending to, often in the foundational and relational territories that sit upstream of visible output. The gap between core self and operating self widens precisely because the operating self is succeeding. This is the state where the cost is highest and the felt signal is weakest.`,

  "STRAINED": `A Strained state means the load across your system has exceeded what the structure was designed to carry sustainably. You are holding — decisions are being made, output is being produced, relationships are being maintained — but the effort required to sustain this has quietly exceeded what the system can absorb without cost. The resistance the diagnostic found is not background noise. It is active friction drawing real energy across enough of your operational domains to create measurable drag between your coherent core and how you operate. The signal from your core is arriving, but it is arriving late and filtered through layers of adaptation that are themselves consuming the energy they were designed to protect.`
  + pe + ps
  + `The structural signature of a Strained reading is that the leader knows something needs to change but the cost of changing it — in disruption, in discomfort, in the uncertainty of what comes next — feels larger than the cost of continuing. The system is being sustained by effort rather than by design. This is not yet a crisis. But it is the state in which crises quietly assemble themselves, in the domains the leader is not yet attending to, using the energy the leader does not yet realise is being consumed.`,

  "DRIFTING": `A Drifting state means structural decoherence is actively occurring across your system. The signal from your coherent core is breaking up before it reaches your operating surface. Direction may still be present — you may still be making decisions, delivering work, maintaining commitments — but the connection between those actions and the source that should be guiding them has become unreliable. The adapted self is no longer filtering the core signal. It is substituting for it. What you are operating from in key domains is not alignment but momentum — the residual force of prior decisions carrying you forward in the absence of current signal.`
  + pe + ps
  + `The structural signature of a Drifting reading is that the leader senses something is fundamentally off but cannot locate it in any single domain. The disorientation is systemic, not local. Individual problems can be named but they do not explain the felt experience. The friction is spread across enough territories at enough intensity that the system has lost its capacity to self-correct — the mechanism that would normally restore coherence is itself operating under load. This is not a state that resolves through attention to any single issue. It is a structural condition that requires the leader to stop, reassess the ground they are standing on, and rebuild the connection between who they are and how they are operating from the foundation up.`,

  "FRACTURED": `A Fractured state means your operating surface is substantially separated from your coherent core. The resistance is dense, high-intensity, and present across most territories. The signal from your core may not be arriving at all — or if it is, the delay between signal and response has extended to the point where the signal is no longer actionable in the context that generated it. The adapted self has not merely filtered the core signal. It has effectively replaced it. What you are operating from is not your coherent core. It is a construction — assembled from necessity, from learned survival, from what has been rewarded — that may bear little resemblance to who you actually are.`
  + pe + ps
  + `This is not a judgement. It is a structural reading of a system under comprehensive load. The path from a Fractured state is not motivational. It does not begin with trying harder, thinking differently, or recommitting to goals. It begins with stopping. The system cannot be repaired from inside its own operating logic because that logic is itself the product of the fracture. What is required is an external read — a perspective that can see the structure the leader is standing inside but cannot see from within it. That is what the deeper layers of the Coherence Framework are designed to provide.`,

  "QUALIFIED": `This reading requires a different kind of honesty from the diagnostic. Your system produces minimal friction across all operational domains, and your felt alignment is at or near its maximum. In any system operating under real-world conditions, this is the rarest possible reading. It has two structurally opposite interpretations. The first is genuine coherence — the conditions of your leadership are aligned at a level that produces no detectable friction. The second is that the diagnostic has reached the boundary of what self-report can detect. Some operating conditions — particularly those that have become so thoroughly normalised that they no longer register as friction — are invisible to any instrument that relies on the leader's own recognition. This report names both possibilities with equal weight.`,
};

function buildGapSpectrumReading(state, diagPct) {
  const ds = displayState(state);
  let out = wrap("Your system reads at " + bld + diagPct + "%" + be + " resistance to your coherent core. The Coherence Framework names this a " + bld + ds + be + " state.");
  out += wrap(GAP_SPECTRUM_INTRO);
  out += wrap(GAP_SPECTRUM_STATE[state] || GAP_SPECTRUM_STATE["COHERENT"]);
  return out;
}


// ════════════════════════════════════════════════════════════════
// GAP TERRITORY READINGS — Being, Relating, Creating
// Each has 5 versions keyed by territory state (display form)
// ════════════════════════════════════════════════════════════════

const GAP_BEING = {
  "Coherent": `In your relationship with yourself — your internal integrity, the capacity to know your own truth — the signal is arriving and you are responding. The friction the diagnostic detected here is minimal. What you know about yourself and what you act on are close enough that the gap between them is not generating measurable cost. This is not the absence of challenge. It is the presence of alignment between your felt truth and your enacted reality.`,
  "Driven": `In your relationship with yourself — your internal integrity, your sense of what is true — you are functioning, but at a cost you may not yet be measuring. The signal from your core is arriving but it is being overridden. The adapted self is performing too well in this territory for the signal to compete. You may not experience this as distance — it may feel like clarity, like discipline, like knowing what needs to be done. But the knowing that is driving you and the knowing that lives in your core may not be the same thing. Driven in Being can hold for years. It does not announce itself. It compounds silently beneath a surface that keeps delivering.`,
  "Strained": `Your internal integrity is carrying real load. The relationship between you and your own truth — what you know, what you sense, what you are unwilling to look at directly — is under strain. The signal from your core is arriving and you recognise it. But the cost of acting on it feels larger than the cost of continuing as you are. There are things you have known about yourself — about what needs to change, about what you are tolerating, about where your energy is actually going — that you have not yet translated into action. This is not a failure of awareness. It is a structural condition in which the price of honesty has exceeded what the adapted self is willing to pay.`,
  "Drifting": `Your internal integrity is losing structural coherence. The relationship between you and your own truth has become unreliable. The signal from your core is breaking up — you sense something but cannot consistently distinguish it from noise, from anxiety, from the accumulated interference of everything you are carrying. This is not confusion about external circumstances. It is a loss of contact with the internal reference point that should be orienting everything else. When Being drifts, every other territory operates without a stable foundation. What you build and how you relate may still function — but they are functioning on ground that is shifting beneath them.`,
  "Fractured": `Your internal integrity has separated from your operating reality. The signal from your coherent core — the part of you that knows who you are, what is true, what matters — may not be reaching your operating self at all. What you are running on is not alignment. It is a constructed position — assembled from necessity, from what has been rewarded, from what has kept things moving — that may bear little resemblance to who you actually are. This is the territory where the gap is most consequential and most invisible. The adapted self does not experience this as fracture. It experiences it as normal. Recognition, if it comes, typically arrives through the body, through relationships, or through a collapse significant enough to break the operating logic the adapted self has built.`,
};

const GAP_RELATING = {
  "Coherent": `In the field between you and others — the people, systems, and conditions you operate within — truth is moving freely. What you sense in a conversation, you can name. What others need to tell you, they do. The relational field is not frictionless — but the friction that exists is being processed in the moment rather than accumulating as unspoken weight. Feedback reaches you. Disagreement is possible without cost. The gap between what is known and what can be said is small enough that the signal from your core passes through your relationships without significant distortion.`,
  "Driven": `In the field between you and others, things are moving — but they are being managed on the way through. The people around you are receiving a version of you that is functional and responsive, but it is costing you energy to maintain that version. What you are not saying in your relationships may be more significant than what you are. The signal from your core is arriving in the relational space but the adapted self is editing it before it reaches the surface — deciding what is safe to share, what would create disruption, what is better held. This is not deception. It is management. And it is so effective that the people around you may not know they are receiving a filtered signal. Driven in Relating can sustain itself for as long as the leader has the energy to maintain the edit.`,
  "Strained": `The field between you and others is under real load. There are conversations you are aware of not having. There is feedback you are not receiving — not because people are withholding it, but because the conditions you have created or inherited do not make it safe enough to arrive. The signal from your core is reaching the relational space, and you recognise what needs to happen — but the cost of acting on it in relationship feels larger than the cost of continuing. You know who needs to hear what. You know what needs to be said. The gap is not in recognition. It is in the structural willingness to let truth move at the speed the situation requires, knowing that what it disrupts on the way through may not reassemble in a form you can control.`,
  "Drifting": `The field between you and others has become unreliable. Truth is not moving freely — and you may no longer be certain what the people around you actually think, feel, or need. The signal from your core is breaking up before it reaches the relational surface. What you express may not match what you sense. What others express may not match what they mean. The gap between what is known and what can be said has widened to the point where the relational field is generating its own noise — misreadings, assumptions, protective positioning — that compounds the original interference. When Relating drifts, isolation increases even in the presence of people. The leader is surrounded but not reached.`,
  "Fractured": `The field between you and others has structurally separated from the signal your core is transmitting. The relationships you are operating within — professional, personal, or both — are no longer carrying truth. What moves between you and others is managed, performed, or entirely disconnected from what is actually happening beneath the surface. This is not a failure of social skill. It is a structural collapse of the conditions required for honest contact. The adapted self has built a relational architecture that functions — meetings happen, decisions are made, communication flows — but what flows through it is not the signal from your coherent core. It is a substitute. The cost of this fracture is rarely visible in the relationships themselves. It is visible in the leader — in the exhaustion of maintaining a relational reality that does not match the felt truth, and in the growing sense that no one around you knows who you actually are.`,
};

const GAP_CREATING = {
  "Coherent": `In your relationship with what you are building in the world — the work you produce, the structures you create, the legacy you are assembling — the signal from your core is arriving intact. What you intend and what you produce are aligned. The changes you have attempted are holding. The gap between your vision and your output is small enough that the work itself feels like an honest expression of who you are, not a performance maintained by effort. This is the territory where coherence becomes visible to others — not through what you say, but through what you build.`,
  "Driven": `In your relationship with what you are building in the world, effort is producing — but the connection between what you produce and who you actually are is being maintained by force rather than by alignment. The output is strong. It may be externally recognised, even rewarded. But the signal from your core that should be guiding what you build is being overridden by the adapted self's version of what needs to happen. You may not experience this as disconnection — it may feel like focus, like execution, like getting things done. But there is a difference between building from alignment and building from momentum. Driven in Creating can produce impressive results for a long time. What it cannot produce is work that sustains the person making it.`,
  "Strained": `Your relationship with what you are building is carrying real load. The gap between what you intend and what actually gets produced has widened enough to register. You can feel it — the work is not landing the way it should, the structures are not holding the way they were designed to, the changes you attempt do not stick the way they need to. The signal from your core is arriving in this territory but by the time it reaches the work, it has been filtered through enough resistance that what emerges is a compromised version of what you set out to build. You recognise the compromise. But the cost of rebuilding — of stopping what is in motion and redesigning it from a more honest foundation — feels larger than the cost of continuing to produce from the current arrangement.`,
  "Drifting": `Your relationship with what you are building has lost its structural connection to who you are. The work continues — output is being produced, commitments are being met, things are being built — but the link between that activity and the signal from your coherent core has become unreliable. You may find yourself unable to explain why the work matters in terms that feel true. You may notice that what you are building no longer reflects what you set out to create — but you cannot point to the moment it diverged. When Creating drifts, the leader becomes a producer rather than a creator. The difference is not visible in the output. It is visible in the relationship between the person and what they are making — a relationship that has quietly shifted from expression to obligation.`,
  "Fractured": `Your relationship with what you are building has separated from your coherent core entirely. What you are producing in the world — the structures, the work, the legacy — is no longer connected to the signal that should be guiding it. The adapted self is building, but it is building from its own logic — from market pressure, from obligation, from the momentum of prior commitments — not from alignment with who you actually are. The output may still function. It may even succeed. But it will not sustain you, and at some level you already know that. The fracture in Creating is often the last to be felt and the first to be visible to others. The people around you may see the disconnection before you do — in the quality of what is being produced, in the decisions being made, in the gap between what you say the work is for and what it actually delivers.`,
};

const GAP_BRIDGE = `The sections that follow examine the specific operational domains the diagnostic read within each territory — the eight clusters that sit between your coherent core and your operating surface, each one a point where the signal is either passing through or being filtered.`;


// ════════════════════════════════════════════════════════════════
// SECTION 04: CLUSTER PROFILE
// ════════════════════════════════════════════════════════════════

// ════════════════════════════════════════════════════════════════
// SECTION 04: CLUSTER PROFILE — NEW ARCHITECTURE
// State-driven readings with combo detail layered in
// ════════════════════════════════════════════════════════════════

const SEC04_INTRO = `The three territory readings above \u2014 Being, Relating, and Creating \u2014 each contain operational domains where the diagnostic reads specific friction. These are the eight domains that sit between your coherent core and your operating surface. Each one was tested for structural resistance, and each carries its own coherence state. The profile below shows where your system is carrying load and where it reads as clear, grouped by the territory it belongs to.`;

const SEC04_BLINDSPOT = `Several operational domains read as clear \u2014 no recognisable friction was selected. In combination with the load present in other domains, this pattern raises a structural question. Systems do not typically develop concentrated friction in downstream domains from a clean foundation. The domains reading as clear may reflect genuine alignment \u2014 or they may reflect conditions so deeply embedded in how you operate that they have become invisible as normal. The absence of recognised friction is not the same as the absence of friction. It may simply mean the friction has become the water you swim in.`;

const clusterMeta = {
  "01": { name: "Openness", subtitle: "How you receive what is new" },
  "02": { name: "Structure", subtitle: "How you hold your leadership" },
  "03": { name: "Direction", subtitle: "How you choose under competing demands" },
  "04": { name: "Vitality", subtitle: "What fuels you and what depletes you" },
  "05": { name: "Transition", subtitle: "What you are holding past its time" },
  "06": { name: "Exposure", subtitle: "Where you are trapped or fragile" },
  "07": { name: "Clarity", subtitle: "How accurately you see your situation" },
  "08": { name: "Integration", subtitle: "Whether your changes have held" },
};

// ─── STATE-LEVEL READINGS ───
// Each cluster has 5 state readings: headline + core paragraph + question
// Combo detail is appended dynamically based on the combo value

const SEC04_STATE = {
  // ════ 01: OPENNESS ════
  "01_Coherent": {
    headline: `Your system is open to new information. Decisions are being shaped by what the situation is asking for, not filtered through what you already know.`,
    body: `This is what coherence in this domain feels like \u2014 new signal arrives and you respond to it without defending the current frame. The energy that would otherwise go into maintaining your existing position is available for the work itself.`,
    question: `What is sustaining this openness \u2014 and would you notice the early signs of it closing?`,
  },
  "01_Driven": {
    headline: `You experience yourself as open \u2014 receptive, adaptive, willing to take in new information. The diagnostic question is whether you are genuinely receiving what is new, or efficiently processing it through a frame you have not examined.`,
    body: `Driven in this domain often feels like clarity. Decisions are fast, positions are confident, information is absorbed quickly. But speed of processing is not the same as openness to what the information is actually saying. A leader operating from coherence here doesn\u2019t just process new information \u2014 they allow it to change the frame.`,
    question: `Are you receiving what is new \u2014 or defending what you already know?`,
  },
  "01_Strained": {
    headline: `You know you are filtering. New information is arriving and you are aware that your response to it is shaped more by what you are protecting than by what the situation requires.`,
    body: `The resistance is not hidden from you. You can see or feel or measure the cost of holding the current frame against what is trying to change it. A leader operating from coherence here lets new information reshape the frame. The energy you are spending to maintain yours is energy that could be going into the work.`,
    question: `What are you protecting that is no longer worth the cost of defending it?`,
  },
  "01_Drifting": {
    headline: `Your capacity to take in new information has become unreliable. You may not be able to distinguish between genuine signal and noise.`,
    body: `The frame through which you receive new information has loosened. This isn\u2019t resistance \u2014 it\u2019s a loss of the reference point that would tell you what is worth letting in. A leader operating from coherence here has a stable frame that bends when it needs to. What you are experiencing is a frame that has lost its shape.`,
    question: `What would it take to rebuild the reference point that tells you what is worth receiving?`,
  },
  "01_Fractured": {
    headline: `New information is no longer reaching your operating self in a usable form. The system has closed \u2014 not as a conscious choice, but as a structural consequence of the load it is carrying.`,
    body: `This is not stubbornness or rigidity. It is a system that has consumed its capacity to receive. A leader operating from coherence here is open because the system has capacity. Yours does not, and restoring that capacity is not a matter of willingness \u2014 it is a matter of reducing the load to a level where reception becomes possible again.`,
    question: `This domain does not resolve by trying to be more open. It resolves by addressing the load that closed the system.`,
  },

  // ════ 02: STRUCTURE ════
  "02_Coherent": {
    headline: `The way you hold your leadership fits. The structure supports the work rather than consuming it.`,
    body: `This is what coherence in this domain feels like \u2014 the design matches the conditions, and the energy flows outward into the work rather than upward into maintaining the arrangement. This reading is the reference point against which future shifts in this domain will be measured.`,
    question: `What is sustaining this alignment \u2014 and would you recognise the early signal if it began to shift?`,
  },
  "02_Driven": {
    headline: `The way you hold your leadership feels right \u2014 and it may be. The diagnostic question is whether the structure still matches the conditions, or whether it\u2019s performing well enough that you haven\u2019t needed to check.`,
    body: `A leader operating from coherence in this domain doesn\u2019t maintain the structure through effort. The structure maintains itself. The difference is invisible from inside Driven \u2014 but it\u2019s the difference between leading and managing your own leadership.`,
    question: `Is the structure serving you, or are you sustaining it?`,
  },
  "02_Strained": {
    headline: `The way you hold your leadership is no longer matching what the conditions require \u2014 and you know it.`,
    body: `The misfit is not hidden from you. You sense or see that the structure you built has been outgrown, but the cost of redesigning it feels larger than the cost of continuing. That calculation is the strain. A leader operating from coherence in this domain does not carry this weight \u2014 the structure fits, and the energy you are spending to sustain a misaligned design is simply not being consumed.`,
    question: `You already know this needs to change. What is the cost of another quarter without changing it?`,
  },
  "02_Drifting": {
    headline: `You are holding your leadership in a way that no longer connects to a clear reason \u2014 and you may not be able to tell whether the structure is right or wrong because the reference point has become unreliable.`,
    body: `The signal that would tell you whether the design fits has broken up. You may still be running things competently, but the link between how you hold your role and why you hold it that way has loosened. A leader operating from coherence in this domain knows why the structure exists and can feel when it stops fitting. That signal is what has faded.`,
    question: `If you redesigned how you hold your leadership from scratch today \u2014 would it look like what you currently have?`,
  },
  "02_Fractured": {
    headline: `The way you hold your leadership has separated from who you actually are. The structure is running, but it is running on its own logic \u2014 not yours.`,
    body: `What you are maintaining is not a design that serves your leadership. It is an arrangement that persists because dismantling it feels more dangerous than continuing. A leader operating from coherence in this domain experiences the structure as an extension of themselves. What you are experiencing is the opposite \u2014 a structure that has replaced the signal it was built to carry.`,
    question: `This domain does not resolve through optimisation. It requires rebuilding from the foundation.`,
  },

  // ════ 03: DIRECTION ════
  "03_Coherent": {
    headline: `Your choices are clear. Competing demands exist but they are being navigated through genuine prioritisation, not deferred through avoidance.`,
    body: `This is what coherence in this domain feels like \u2014 the honest answer is available and you are giving it, even when it creates short-term discomfort. The energy that would otherwise go into holding incompatible commitments is available for execution.`,
    question: `What is making clear choice possible right now \u2014 and would you recognise the conditions that make it harder?`,
  },
  "03_Driven": {
    headline: `You experience yourself as decisive \u2014 moving fast, managing multiple commitments, keeping things in motion. The diagnostic question is whether you are choosing clearly, or moving fast enough that the deferred choice hasn\u2019t caught up with you yet.`,
    body: `Driven in this domain often feels like productivity. But pace is not the same as direction. A leader operating from coherence here is not moving faster \u2014 they are moving with less friction because the competing commitments have been resolved rather than held simultaneously.`,
    question: `Are you choosing \u2014 or are you moving fast enough to avoid choosing?`,
  },
  "03_Strained": {
    headline: `There is a choice you know needs to be made \u2014 and you are aware that you are deferring it. The cost of the deferral is real and you can feel it.`,
    body: `You know the honest answer. You know it would create disruption. The strain is in the gap between knowing and acting. A leader operating from coherence here has made the choice \u2014 and the energy you are spending to hold the contradiction is simply not being consumed.`,
    question: `You already know the honest answer. What is preventing you from giving it?`,
  },
  "03_Drifting": {
    headline: `The ability to distinguish between competing demands has become unreliable. You may not be certain which commitments are still aligned and which are residual.`,
    body: `Direction has become diffuse. You are still moving, but the basis for choosing one path over another has loosened. A leader operating from coherence here chooses from a clear reference point. That reference point is what has faded.`,
    question: `If you stopped everything and rebuilt your commitments from scratch \u2014 which ones would you choose again?`,
  },
  "03_Fractured": {
    headline: `Choice has been replaced by reaction. What is driving your decisions is not alignment \u2014 it is whichever demand has the most immediate consequence.`,
    body: `The capacity to step back and choose from a coherent position has been consumed by the load. A leader operating from coherence here makes decisions from centre. What you are experiencing is decisions being made by circumstances.`,
    question: `This domain does not resolve by making better choices. It resolves by rebuilding the conditions that make genuine choice possible.`,
  },

  // ════ 04: VITALITY ════
  "04_Coherent": {
    headline: `Your energy equation is balanced. More is coming back from the work than is going out to sustain it.`,
    body: `This is what coherence in this domain feels like \u2014 the connection between what you spend your days doing and what genuinely matters to you is intact. The work fuels the person doing it. This is not about workload \u2014 it is about alignment between effort and meaning.`,
    question: `What is sustaining this connection \u2014 and would you notice the early signal if it began to thin?`,
  },
  "04_Driven": {
    headline: `Your energy feels sustainable \u2014 and it may be. The diagnostic question is whether you are running on genuine connection to the work, or on discipline and momentum that have not yet shown their cost.`,
    body: `Driven in this domain often feels like stamina. You deliver, you recover, you deliver again. But there is a difference between energy that comes from alignment and energy that comes from habit. A leader operating from coherence here doesn\u2019t sustain their pace through discipline \u2014 they sustain it because the work itself replenishes what it consumes.`,
    question: `Is your energy coming from the work \u2014 or from the discipline you\u2019re applying to get through it?`,
  },
  "04_Strained": {
    headline: `The energy equation has tipped \u2014 and you know it. More is going out than is coming back, and the gap between effort and meaning has widened enough to register.`,
    body: `You are sustaining your pace through will rather than alignment. A leader operating from coherence here does not carry this cost \u2014 the work returns what it takes. What you are experiencing is the structural condition in which depletion becomes self-reinforcing: the less the work replenishes, the more discipline is required, and the more discipline is required, the less the work can replenish.`,
    question: `What would need to change for the work to give energy back instead of consuming it?`,
  },
  "04_Drifting": {
    headline: `The connection between your energy and your work has become unreliable. You may not be able to tell whether the depletion is coming from the volume, the content, or the loss of purpose underneath both.`,
    body: `The source of the drain has become diffuse. A leader operating from coherence here knows what fuels them and what depletes them with precision. That precision is what has faded.`,
    question: `If you removed everything from your week that depletes without replenishing \u2014 would you know what to keep?`,
  },
  "04_Fractured": {
    headline: `Your energy system has separated from the work. What you are running on is not connection or meaning \u2014 it is the residual force of commitments made before the disconnection occurred.`,
    body: `A leader operating from coherence here is sustained by the work. What you are experiencing is the opposite \u2014 the work is consuming you and there is nothing in the current arrangement that is putting energy back. This does not resolve through rest. It resolves through reconnection to the source \u2014 and that source may not be found inside the current structure.`,
    question: `This domain requires honest assessment of whether the work itself \u2014 not the pace of it \u2014 is still the right work.`,
  },

  // ════ 05: TRANSITION ════
  "05_Coherent": {
    headline: `Nothing is being held past its time. Endings that needed to happen have happened, or are actively in progress.`,
    body: `This is what coherence in this domain feels like \u2014 the capacity to release what is finished without replacing it with something before the next thing is clear. The energy that goes into sustaining expired arrangements is not being consumed.`,
    question: `What made it possible to let go \u2014 and would you recognise the signal that something new has outstayed its relevance?`,
  },
  "05_Driven": {
    headline: `Everything feels current \u2014 and it may be. The diagnostic question is whether you have genuinely completed the transitions that need completing, or whether the pace of your operating life has made it unnecessary to confront what should have ended.`,
    body: `Driven in this domain is the state where things persist not because you\u2019ve decided to keep them, but because nothing has forced the question. A leader operating from coherence here has actively examined what stays and what goes. The absence of that examination is what Driven looks like in this domain.`,
    question: `Is everything you are carrying still current \u2014 or is something persisting because you haven\u2019t been forced to let it go?`,
  },
  "05_Strained": {
    headline: `Something should have ended by now \u2014 and you know it. The cost of the holding pattern is real and felt.`,
    body: `The transition is overdue. You can sense or see or measure what is being held past its time, but the cost of letting go \u2014 the void, the disruption, the uncertainty \u2014 feels larger than the cost of continuing. A leader operating from coherence here has crossed the threshold. The energy you are spending in the in-between is the strain.`,
    question: `What is the cost of another quarter in the holding pattern?`,
  },
  "05_Drifting": {
    headline: `Something is ending and you know it in your body before you know it in your plans \u2014 but you cannot name what it is or what comes next.`,
    body: `The transition has no object. The felt sense of a chapter closing is real, but it hasn\u2019t attached to anything specific enough to act on. A leader operating from coherence here can name what is ending and has begun to move. What you are carrying is the weight of a threshold you can feel but cannot yet cross.`,
    question: `What would need to become clear before you could begin the transition?`,
  },
  "05_Fractured": {
    headline: `Multiple things have been held past their time for so long that the holding pattern itself has become the structure. What should have ended is now what you are operating from.`,
    body: `The expired arrangements are no longer items to release \u2014 they are the architecture. A leader operating from coherence here operates from structures that are current. What you are experiencing is a life built on foundations that were meant to be temporary.`,
    question: `This domain does not resolve by releasing one thing. It requires examining which of the structures you are standing on were meant to be permanent \u2014 and which were meant to have been replaced by now.`,
  },

  // ════ 06: EXPOSURE ════
  "06_Coherent": {
    headline: `No structural dependencies or vulnerabilities were detected that carry disproportionate power over your decisions.`,
    body: `This is what coherence in this domain feels like \u2014 your position is stable, your direction is not being dictated by a single dependency, and the ground you are standing on supports the weight you are placing on it.`,
    question: `What is sustaining this stability \u2014 and would you recognise the signal if a new dependency began to form?`,
  },
  "06_Driven": {
    headline: `Your position feels stable \u2014 and it may be. The diagnostic question is whether your foundations are genuinely secure, or whether the pace of performance has made it unnecessary to look at what you are standing on.`,
    body: `Driven in this domain is the state where dependencies and structural vulnerabilities persist unexamined \u2014 not because they are hidden, but because everything is working well enough that looking underneath feels unnecessary. A leader operating from coherence here has examined the foundations. The absence of that examination is the risk.`,
    question: `Is your position genuinely stable \u2014 or has the pace of your performance made it unnecessary to check?`,
  },
  "06_Strained": {
    headline: `You know there is a structural vulnerability in your position \u2014 and the cost of navigating around it is real.`,
    body: `The dependency or fragility is not hidden. You are managing it, working around it, sustaining your position despite it. A leader operating from coherence here does not carry this weight \u2014 their foundations support them rather than constraining them. The energy you are spending to navigate the constraint is the strain.`,
    question: `What would need to change at the structural level for the constraint to dissolve rather than be managed?`,
  },
  "06_Drifting": {
    headline: `The ground underneath your position has become uncertain \u2014 and you may not be able to tell whether the instability is in the foundations or in your perception of them.`,
    body: `You sense vulnerability but cannot locate its source. A leader operating from coherence here knows what they are standing on. That knowledge is what has become unreliable.`,
    question: `What would it take to get an honest read on the stability of your current foundations?`,
  },
  "06_Fractured": {
    headline: `Your position is structurally trapped. The foundations are not holding, the constraints are real, and the direction you are moving in is dictated by what you are locked into rather than what you are choosing.`,
    body: `This is a crisis-level reading. A leader operating from coherence here is free to choose their direction. What you are experiencing is the absence of that freedom \u2014 sustained by force of will rather than by any conviction about where the movement leads.`,
    question: `This domain does not resolve through effort. It requires intervention at the level where the foundations are set.`,
  },

  // ════ 07: CLARITY ════
  "07_Coherent": {
    headline: `Your picture of reality is current. The assumptions you are operating from have been tested against present conditions.`,
    body: `This is what coherence in this domain feels like \u2014 your map matches the territory. The energy that would otherwise go into managing uncertainty or defending outdated positions is available for the work.`,
    question: `What is keeping your map current \u2014 and would you notice the moment it began to drift from the territory?`,
  },
  "07_Driven": {
    headline: `You experience your picture as clear \u2014 and it may be. The diagnostic question is whether your assumptions have been tested against current conditions, or whether your confidence in the picture is itself the thing that has not been tested.`,
    body: `Driven in this domain is the most consequential. A leader who is certain their map is accurate has no reason to update it. A leader operating from coherence here holds their picture of reality as provisional \u2014 accurate until tested, not accurate until proven wrong. The difference is invisible from inside Driven, but it determines whether you are navigating from a current map or a confident one.`,
    question: `Is your picture of reality current \u2014 or is your confidence in it the thing that needs examining?`,
  },
  "07_Strained": {
    headline: `Your picture of reality is incomplete \u2014 and you know it. The cost of operating on an unverified map is real.`,
    body: `You are aware that assumptions are stale or untested. A leader operating from coherence here has done the work of finding out what is true. The energy you are spending to manage uncertainty is the strain.`,
    question: `What would it cost to find out what is actually true \u2014 and is that cost larger or smaller than what you\u2019re spending to avoid finding out?`,
  },
  "07_Drifting": {
    headline: `Your picture of reality has become unreliable \u2014 and you may not be able to tell which parts are current and which are residual.`,
    body: `The map and the territory have diverged, but the divergence is diffuse rather than specific. A leader operating from coherence here knows where the distortions are. What you are experiencing is a loss of confidence in the picture without knowing where it\u2019s wrong.`,
    question: `What would a fresh, honest read of your actual situation reveal \u2014 and are you willing to find out?`,
  },
  "07_Fractured": {
    headline: `The picture of reality you are operating from may bear little resemblance to what is actually happening. The map has separated from the territory.`,
    body: `This is not a failure of intelligence. It is a structural consequence of operating under comprehensive load \u2014 the system has consumed its capacity to update. A leader operating from coherence here sees clearly because the system has capacity. Yours does not.`,
    question: `This domain requires external perspective \u2014 someone who can see the territory you are standing in but cannot see from inside it.`,
  },

  // ════ 08: INTEGRATION ════
  "08_Coherent": {
    headline: `Changes you have made are holding. New patterns have become embedded in how you operate rather than reverting when attention moves elsewhere.`,
    body: `This is what coherence in this domain feels like \u2014 the ground holds what you plant in it. The energy that would go into re-initiating changes that didn\u2019t stick is not being consumed.`,
    question: `What conditions made integration possible \u2014 and would you recognise the signal if a new change was failing to hold?`,
  },
  "08_Driven": {
    headline: `Your changes feel embedded \u2014 and they may be. The diagnostic question is whether the new patterns have genuinely taken root, or whether your sustained attention is what\u2019s keeping them in place.`,
    body: `Driven in this domain is the state where changes persist because the leader is still actively maintaining them \u2014 not because they have become structural. A leader operating from coherence here can move their attention elsewhere and the change holds. The test of integration is not whether the change is present while you\u2019re watching \u2014 it\u2019s whether it\u2019s present when you stop.`,
    question: `Are your changes holding because they\u2019ve taken root \u2014 or because you haven\u2019t stopped watching them yet?`,
  },
  "08_Strained": {
    headline: `Changes you\u2019ve made are not holding \u2014 and you know it. The cycle of initiating, reverting, and re-initiating is consuming real energy.`,
    body: `The non-integration is visible. A leader operating from coherence here plants changes in ground that holds them. The strain is in the circularity \u2014 repeating the same shift because the conditions required for permanence are not yet in place.`,
    question: `What conditions would need to exist for the change to hold without your sustained effort?`,
  },
  "08_Drifting": {
    headline: `You are no longer certain which changes held and which didn\u2019t \u2014 the line between your old patterns and the new ones you intended has blurred.`,
    body: `The non-integration has become diffuse. A leader operating from coherence here can clearly distinguish between what changed and what reverted. That clarity is what has faded.`,
    question: `If you assessed your operating patterns against your intentions from six months ago \u2014 how many of the intended changes would you actually find?`,
  },
  "08_Fractured": {
    headline: `The capacity for change to hold has been structurally compromised. Changes do not fail because they are wrong \u2014 they fail because the system cannot currently sustain anything new.`,
    body: `This is not a failure of commitment. It is a system operating at a level of load where integration is structurally impossible. A leader operating from coherence here has capacity for new patterns to take root. Your system does not \u2014 and restoring that capacity is the precondition for any change to hold.`,
    question: `This domain does not resolve by trying harder. It resolves by reducing the load to a level where the system can absorb something new.`,
  },
};


// ─── COMBO DETAIL STRINGS (keyed by cluster + combo) ───
// These add one sentence of register-specific detail within the state reading

const SEC04_COMBO = {
  // 01: OPENNESS
  "01_A": `You can see the filtering \u2014 decisions shaped by what you already know rather than what is arriving. It hasn\u2019t registered as a problem because the filtering is producing good results.`,
  "01_B": `Something is resisting what is trying to enter \u2014 a new direction, a shift \u2014 but you cannot point to where it shows up in your decisions. The resistance is felt, not visible.`,
  "01_C": `Energy is being consumed defending the current frame, but you haven\u2019t connected the cost to a specific pattern or felt it directly. The drain is real. The source is below the surface.`,
  "01_AB": `The filtering is visible and the resistance is felt. What hasn\u2019t arrived is the cost \u2014 which is why this doesn\u2019t feel urgent.`,
  "01_AC": `The filtering is visible and the cost is real. But the felt experience of what you are resisting hasn\u2019t landed \u2014 you\u2019re managing this analytically.`,
  "01_BC": `You feel the resistance and you\u2019re paying for it \u2014 but you cannot see where it\u2019s showing up in your decisions. A filtering process you cannot see but can feel and are paying for is one operating below your current line of sight.`,
  "01_ABC": `The full pattern is present. You can see the filtering, feel the resistance, and measure the cost. The question is not awareness \u2014 it is whether you will let what is trying to enter actually change the frame.`,

  // 02: STRUCTURE
  "02_A": `You can see that more energy is going into managing the structure than into the work itself \u2014 but it hasn\u2019t registered as a problem.`,
  "02_B": `You sense something in this domain but cannot point to where it shows up. The misfit exists in the felt register only.`,
  "02_C": `The energy cost of maintaining the current arrangement is real, though you haven\u2019t connected it to a specific cause.`,
  "02_AB": `You can see the overhead and you sense the misfit. Both signals are present. What hasn\u2019t arrived is the cost.`,
  "02_AC": `The overhead is visible and the energy cost is real. But the deeper question of whether the structure fits hasn\u2019t become a felt experience.`,
  "02_BC": `You feel something is off and it\u2019s costing you energy \u2014 but you cannot name the specific structural problem. The cost of a problem you cannot identify cannot be addressed through effort \u2014 only through diagnosis.`,
  "02_ABC": `You can see the overhead, feel the misfit, and measure the cost. Nothing is hidden here. The question is whether you will redesign the structure or continue operating inside one you can fully see has been outgrown.`,

  // 03: DIRECTION
  "03_A": `You can see that momentum is substituting for direction \u2014 activity is high but steering is unclear.`,
  "03_B": `You know there is a specific choice you are deferring \u2014 one where the honest answer would create discomfort.`,
  "03_C": `Energy is being consumed holding incompatible commitments in place, but you haven\u2019t identified the specific choice or connected to the felt experience of carrying it.`,
  "03_AB": `The unsteered momentum is visible and the deferred choice is felt. The cost hasn\u2019t been counted.`,
  "03_AC": `The pattern is visible and the cost is clear, but the specific deferred decision hasn\u2019t surfaced as a felt experience.`,
  "03_BC": `You feel the deferred choice and you\u2019re paying for it, but the pattern isn\u2019t visible in your behaviour yet.`,
  "03_ABC": `Full visibility. You can see, feel, and measure the cost of the deferred choice. What remains is the decision itself.`,

  // 04: VITALITY
  "04_A": `The effort required to sustain output has quietly increased \u2014 you can see it in the hours and recovery time. It hasn\u2019t registered as a disconnection from the work.`,
  "04_B": `A growing distance between what you spend your days doing and what you believe actually matters. The gap is felt, not structural.`,
  "04_C": `The energy equation has inverted \u2014 more going out than coming back \u2014 but you haven\u2019t connected this to a specific pattern or felt sense.`,
  "04_AB": `The increasing effort and the distance from meaning are both present. The cost hasn\u2019t been counted.`,
  "04_AC": `The trend is visible and the drain is real, but the deeper question of whether the work still means what it once meant hasn\u2019t become felt.`,
  "04_BC": `You feel the disconnection and you\u2019re paying for it, but from the outside the evidence hasn\u2019t appeared. This is where the risk of continuing without intervention is highest.`,
  "04_ABC": `Full visibility. The effort is increasing, the connection to purpose is thinning, and you know it. The question is what it would take to reconnect the daily reality to the thing that made it worth doing.`,

  // 05: TRANSITION
  "05_A": `You can name something that should have ended by now. It hasn\u2019t registered as costing you.`,
  "05_B": `You feel a broader shift \u2014 a chapter closing \u2014 but you haven\u2019t named it or begun the transition.`,
  "05_C": `The energy cost of sustaining something past its time is real, but you can\u2019t see what comes next, so you maintain the status quo.`,
  "05_AB": `The specific and the diffuse are both present \u2014 a nameable item and a deeper felt shift. The cost hasn\u2019t been counted.`,
  "05_AC": `You can name what should have ended and you know the cost \u2014 but the embodied willingness to let go hasn\u2019t arrived.`,
  "05_BC": `You feel the ending and you\u2019re paying for the suspended state \u2014 but you can\u2019t name what needs to change. This is the most consequential combination here.`,
  "05_ABC": `Full visibility. You can see it, feel it, and measure the cost of the holding pattern. What remains is crossing the threshold.`,

  // 06: EXPOSURE
  "06_A": `You can identify a specific dependency that has disproportionate power. It hasn\u2019t registered as a vulnerability.`,
  "06_B": `The ground feels less stable than it appears from the outside. You can\u2019t point to why.`,
  "06_C": `Energy is going into forward motion driven by the absence of an alternative rather than the presence of clarity.`,
  "06_AB": `The dependency is visible and the instability is felt. The combined cost hasn\u2019t been counted.`,
  "06_AC": `The dependency is visible and the cost is real, but the felt vulnerability hasn\u2019t registered.`,
  "06_BC": `You feel the instability and you\u2019re paying for it, but you can\u2019t name what\u2019s generating it. This combination carries the most weight in this domain.`,
  "06_ABC": `Full visibility. The dependency, the vulnerability, and the cost are all present. What is needed is not more awareness \u2014 it is structural intervention at the foundation.`,

  // 07: CLARITY
  "07_A": `You can see that decisions are based on untested assumptions. It hasn\u2019t registered as a risk.`,
  "07_B": `Something about how you see your situation feels partial or provisional \u2014 but you can\u2019t point to the specific distortion.`,
  "07_C": `Energy is being spent managing anxiety about what might be true rather than finding out what is.`,
  "07_AB": `The untested assumptions are visible and the incompleteness is felt. The cost hasn\u2019t been counted.`,
  "07_AC": `The assumptions are visible and the anxiety cost is real, but the deeper sense that the frame might need updating hasn\u2019t landed.`,
  "07_BC": `You sense the incompleteness and you\u2019re paying for it, but you can\u2019t identify the specific distortions. The corrections you are making may themselves be based on the flawed map.`,
  "07_ABC": `Full visibility. You can identify the distortions, sense the incompleteness, and measure the cost. The question is whether you will find out what is actually true \u2014 even if it challenges your current picture.`,

  // 08: INTEGRATION
  "08_A": `You can point to specific changes that reverted once the urgency passed.`,
  "08_B": `You feel that the changes never truly took hold \u2014 a quiet sense that what you intended to become has not yet become.`,
  "08_C": `The energy cost of re-initiating the same changes is the clearest signal. The circularity is the drain.`,
  "08_AB": `The reversions are visible and the non-integration is felt. The cost of the cycle hasn\u2019t been counted.`,
  "08_AC": `The reversions are visible and the re-initiation cost is real, but the deeper sense that something foundational was missing hasn\u2019t landed.`,
  "08_BC": `You feel the non-integration and you\u2019re paying for it, but you can\u2019t point to where the changes failed. This suggests the conditions for integration \u2014 not the changes themselves \u2014 may be the missing element.`,
  "08_ABC": `Full visibility. The reversions, the non-integration, and the circular cost are all present. This is the capstone of the entire diagnostic \u2014 because everything else holds or doesn\u2019t based on whether change can become permanent in your system.`,
};


// ════════════════════════════════════════════════════════════════
// CLUSTER STATE MAP — converts cluster score to display state
// Uses same thresholds as scoring engine: 0-1=Coherent, 2=Driven,
// 3-4=Strained, 5-6=Drifting, 7-9=Fractured
// ════════════════════════════════════════════════════════════════

function clusterState(score) {
  const s = parseInt(score) || 0;
  if (s <= 1) return "Coherent";
  if (s === 2) return "Driven";
  if (s <= 4) return "Strained";
  if (s <= 6) return "Drifting";
  return "Fractured";
}


// ════════════════════════════════════════════════════════════════
// BUILD SEC04 — replaces the old loop in assembleReport
// ════════════════════════════════════════════════════════════════
// Call this from assembleReport with:
//   const sec04 = buildSec04(combos, clusterScores);
// where clusterScores = { "01": v.c01_score, "02": v.c02_score, ... }

  let blindspot_note = "";
  let bsHasLoad = false;
  let bsClearCount = 0;
  for (const cn of ["01","02","03","04","05","06","07","08"]) {
    const combo = combos[cn];
    if (combo && combo !== "NONE" && combo !== "BLANK" && combo !== "D") {
      bsHasLoad = true;
    } else {
      bsClearCount++;
    }
  }
  if (bsHasLoad && bsClearCount >= 3) {
    blindspot_note = wrap("Several operational domains read as clear \u2014 no recognisable friction was identified. In combination with the load present in other domains, this pattern raises a structural question. Systems do not typically develop concentrated friction in downstream domains from a clean foundation. The domains reading as clear may reflect genuine alignment \u2014 or they may reflect conditions so deeply embedded in how you operate that they have become invisible as normal. The absence of recognised friction is not the same as the absence of friction. It may simply mean the friction has become the water you swim in.");
  }

function buildSec04(combos, clusterScores) {
let sec04 = "";


  // Domain readings
  for (const cn of ["01","02","03","04","05","06","07","08"]) {
    const combo = combos[cn];
    const score = clusterScores[cn];
    const cState = clusterState(score);
    const meta = clusterMeta[cn];
    const stateKey = cn + "_" + cState;
    const reading = SEC04_STATE[stateKey];
 
    if (!reading) continue;
 
    // Heading: cluster name (gold) — state (state colour) with colon
    const stColor = stateStyle[cState] || "color:#1A1A2E;font-weight:bold;";
    sec04 += "<h3 style='font-family:Montserrat,sans-serif;font-size:11pt;margin-top:22px;margin-bottom:4px;'>"
      + "<span style='color:#D4A843;font-weight:bold;'>" + meta.name + "</span>"
      + "<span style='color:#D4A843;font-weight:normal;'> \u2014 </span>"
      + "<span style='" + stColor + "'>" + cState + ":</span>"
      + "</h3>";
 
    // Subtitle
    sec04 += "<p style='font-family:Inter,sans-serif;font-size:9pt;color:#8A8A9A;font-style:italic;margin-top:0;margin-bottom:10px;'>"
      + meta.subtitle + "</p>";
 
    // Headline (bold)
    sec04 += "<p style='font-family:Inter,sans-serif;font-size:10pt;color:#1A1A2E;line-height:1.2;margin-bottom:8px;font-weight:bold;'>"
      + reading.headline + "</p>";
 
    // Body
    sec04 += wrap(reading.body);
 
    // Combo detail — only if friction was selected (not D/NONE/BLANK)
    if (combo && combo !== "NONE" && combo !== "BLANK" && combo !== "D") {
      const comboKey = cn + "_" + combo;
      const comboText = SEC04_COMBO[comboKey];
      if (comboText) {
        sec04 += wrap(comboText);
      }
    }
 
    // Question (italic)
    sec04 += "<p style='font-family:Inter,sans-serif;font-size:9.5pt;color:#7A756D;font-style:italic;line-height:1.2;margin-bottom:16px;'>"
      + reading.question + "</p>";
  }
 
  return sec04;
}

// ════════════════════════════════════════════════════════════════
// SECTION 05: THE PATTERN
// ════════════════════════════════════════════════════════════════

const SEC05_FRAME = `The Snapshot reads three registers: what you can see and name, what you feel but cannot yet articulate, and where your energy is going. The pattern across these three registers — across all eight domains — reveals how you are currently processing your own reality.`;

const SEC05_DOMINANCE = {
  "A_DOMINANT": `Your selections concentrate in the observable register. The friction in your system is not hidden from you — it is visible, identifiable, and in most domains you could point to specific evidence of it. The question this pattern raises is not whether you see the friction but whether seeing it has translated into structural change. Observable friction that persists despite awareness is often friction that is being managed rather than resolved — worked around rather than redesigned. Seeing clearly is a necessary condition for change. It is not a sufficient one.`,
  "B_DOMINANT": `Your selections concentrate in the felt register. In most domains, the friction registers as an instinct, an unease, a recognition that something is present — without the kind of structural evidence you could point to or prove. This is the pattern of a leader whose internal signal is active and accurate but whose reality has not yet produced the observable data to confirm it. The felt truth is ahead of the visible reality. This is not imprecision in your perception. It is a signal that the structural expression of what you are sensing may not have surfaced yet — or may be present in a form you have not yet learned to recognise.`,
  "C_DOMINANT": `Your selections concentrate in the cost register. Across most domains, what registers most clearly is not the specific friction or the felt experience underneath it, but the toll — the drain, the effort, the sense that more energy is going out than is coming back. This pattern often describes a leader who has carried the load long enough that the specific causes have blurred into a general condition of depletion. The cost is undeniable. The source of the cost is not yet clear. This is the pattern where structural diagnosis has the highest immediate impact — because naming the specific source of the drain is the first condition for stopping it.`,
  "MIXED": `Your selections do not concentrate in a single register. Across your operational domains, you recognise some friction as visible and nameable, some as felt but not yet articulated, and some primarily through what it costs you in energy. This pattern suggests a leader who is processing their current reality through multiple channels simultaneously — seeing some things with clarity, sensing others without being able to name them, and registering others only through their toll. The diagnostic value of this pattern is in the specific distribution: which domains are you seeing clearly, which are you feeling, and which are you only registering through what they cost?`,
};

const SEC05_OBSERVATION = `The register through which you recognise friction is itself diagnostic information. What you see clearly is available for structural change — the question is whether you will act on it. What you feel but cannot name is signalling ahead of your conscious understanding — the question is what would need to change for that signal to become visible and actionable. What you register only through its cost is being maintained by something you have not yet identified — the question is what that cost is protecting you from seeing.`;


// ════════════════════════════════════════════════════════════════
// SECTION 06: FRAMEWORK
// ════════════════════════════════════════════════════════════════

const SEC06_CONNECTION = {
  "A_DOMINANT": `Your selections suggest your attention currently lives in the upper half of this map — the Shared Reality and Inquiry quadrants. You are operating from conscious, known territory. The structural question is what sits below: the Felt Truth that your system is carrying but you have not yet given voice to, and the Blind Spot that is, by definition, invisible from the vantage point you currently occupy.`,
  "B_DOMINANT": `Your selections suggest your attention currently lives in the Felt Truth quadrant. You are sensing what is happening in your system before it becomes visible or provable. The structural question is what would need to change for that felt truth to cross the line into the Shared Reality — into the conscious, known territory where it can be named, examined, and acted on.`,
  "C_DOMINANT": `Your selections suggest your attention is registering the cost of your current conditions without being fully connected to either the observable cause or the felt experience underneath. The structural question is what the cost is protecting you from confronting — what truth, named or unnamed, would become visible if the energy currently spent maintaining the status quo were released.`,
  "MIXED": `Your selections are distributed across the map. Some domains sit in the Shared Reality — visible, conscious, available for action. Others sit in the Felt Truth — sensed but not yet named. Others register only through their cost, suggesting material that is being actively maintained below the surface. The pattern across these territories is itself the diagnostic — the gaps between what you see, what you feel, and what is costing you energy are where the unexamined material sits.`,
};


// ════════════════════════════════════════════════════════════════
// SECTION 09: TEXT FIELD REFLECTION
// ════════════════════════════════════════════════════════════════

const SEC09_CONTEXT = `The diagnostic reads this alongside the structural pattern it has identified. What you chose to name — and what you chose not to — both carry weight. The relationship between your words and the instrument's reading is itself a signal. If they align, the diagnostic has confirmed what you already know. If they diverge, the space between what you named and what the Snapshot surfaced may be the most important territory in this report.`;


// ════════════════════════════════════════════════════════════════
// SECTION 10: THE OPEN LOOP
// ════════════════════════════════════════════════════════════════

const SEC10 = {
  "FRACTURED": `This reading has named the breadth and depth of the load your system is carrying. What it cannot name is which conditions are primary and which are downstream consequences. That distinction changes everything about where intervention begins.`,
  "STRAINED": `This reading has confirmed what you already sense — the load is real, the friction is structural, and effort alone is not resolving it. What it cannot tell you is whether the source of the friction is at the level you think it is, or one level deeper.`,
  "DRIFTING": `This reading has named a condition that is easier to feel than to see. What it cannot tell you is what reconnection looks like for you specifically — whether the signal you have lost is one of direction, of purpose, or of something more foundational that sits underneath both.`,
  "DRIVEN": `This reading has surfaced a gap between your felt alignment and your structural reality. What it cannot tell you is what that gap is costing — not in energy, which you may not yet feel, but in the capacity that is being quietly consumed to maintain the current arrangement.`,
  "COHERENT": `This reading confirms your current alignment. What it cannot tell you is how durable that alignment is under changing conditions — or whether you would recognise the early signals of a shift before the shift had already taken hold.`,
  "QUALIFIED": `This reading has named two possibilities with equal weight. What it cannot do is determine which one is true. That distinction requires a different kind of inquiry — one that reads below the surface of what self-report can detect.`,
};


// ════════════════════════════════════════════════════════════════
// ASSEMBLY FUNCTION
// ════════════════════════════════════════════════════════════════

function assembleReport(v) {
  const state = v.coherence_state;
  const gap = v.gap_type;
  const dom = v.pattern_dominance;
  const name = v.leader_name;
  const date = v.snapshot_date;
  const textField = v.text_field_response || "";

  // Territory states from scoring engine — single source of truth
  const bState = displayState(v.being_state || 'COHERENT');
  const rState = displayState(v.relating_state || 'COHERENT');
  const cState = displayState(v.creating_state || 'COHERENT');
  const diagPct = parseInt(v.overall_pct || '0');

  // Cluster combos
  const combos = {
    "01": v.c01_combo, "02": v.c02_combo, "03": v.c03_combo, "04": v.c04_combo,
    "05": v.c05_combo, "06": v.c06_combo, "07": v.c07_combo, "08": v.c08_combo,
  };

  // ─── SEC 01: OPENING FRAME ───
  let sec01 = SEC01[state] || "";
  sec01 = sec01.replace(/\{\{leader_name\}\}/g, name);
  sec01 = sec01.replace(/\{\{snapshot_date\}\}/g, date);
  sec01 = wrap(sec01);

  // ─── GAP SPECTRUM READING (replaces old sec02) ───
  const gap_spectrum_reading = buildGapSpectrumReading(state, diagPct);

  // ─── GAP TERRITORY READINGS (replaces old sec03) ───
const portrait_frame = buildPortraitFrame(state, diagPct);
const gap_being_reading = buildTerritoryReading("Being", bState, GAP_BEING[bState]);
const gap_relating_reading = buildTerritoryReading("Relating", rState, GAP_RELATING[rState]);
const gap_creating_reading = buildTerritoryReading("Creating", cState, GAP_CREATING[cState]);
const gap_bridge = "<p style='font-family:Inter,sans-serif;font-size:10pt;color:#2E2E2C;line-height:1.2;margin-bottom:11px;'>The sections that follow examine the specific operational domains the diagnostic read within each territory — the eight clusters that sit between your coherent core and your operating surface, each one a point where the signal is either passing through or being filtered.</p>";
  // ─── SEC 04: CLUSTER PROFILE ───
const clusterScores = {
"01": v.c01_score, "02": v.c02_score, "03": v.c03_score, "04": v.c04_score,
"05": v.c05_score, "06": v.c06_score, "07": v.c07_score, "08": v.c08_score,
};
const sec04 = buildSec04(combos, clusterScores);

  // ─── SEC 05: THE PATTERN ───
  let sec05 = wrap(SEC05_FRAME);
  sec05 += wrap(SEC05_DOMINANCE[dom] || SEC05_DOMINANCE["MIXED"]);
  sec05 += wrap(SEC05_OBSERVATION);

  // ─── SEC 06: FRAMEWORK ───
  const sec06 = wrap(SEC06_CONNECTION[dom] || SEC06_CONNECTION["MIXED"]);

  // ─── SEC 09: TEXT FIELD REFLECTION ───
  let sec09 = "";
  if (textField && textField.trim() !== "") {
    sec09 = "<blockquote style='font-family:Inter,sans-serif;font-size:11pt;color:#1A1A2E;font-style:italic;border-left:3px solid #D4A843;padding-left:16px;margin:16px 0;line-height:1.7;'>"
      + textField + "</blockquote>";
    sec09 += wrap(SEC09_CONTEXT);
  }

  // ─── SEC 10: OPEN LOOP ───
  const sec10 = wrap(SEC10[state] || "");

  // ─── RETURN ALL MERGE FIELDS ───
  return {
    sec01_html: sec01,
    gap_spectrum_reading: gap_spectrum_reading,
    gap_being_reading: gap_being_reading,
    gap_relating_reading: gap_relating_reading,
    gap_creating_reading: gap_creating_reading,
    portrait_frame: portrait_frame,
    gap_bridge: gap_bridge,
    sec04_html: sec04,
    blindspot_note: blindspot_note,
    sec05_html: sec05,
    sec06_html: sec06,
    sec09_html: sec09,
    sec10_html: sec10,
  };
}


// ════════════════════════════════════════════════════════════════
// VERCEL SERVERLESS HANDLER
// ════════════════════════════════════════════════════════════════

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  try {
    const v = req.body;
    if (!v.coherence_state || !v.gap_type || !v.pattern_dominance) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const result = assembleReport(v);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
