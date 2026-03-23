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
const ps = "<p style='font-family:Inter,sans-serif;font-size:10pt;color:#4A4A5A;line-height:1.7;margin-bottom:14px;'>";
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

const SEC04_INTRO = `The Snapshot reads your current state across eight operational domains — from how you receive new information through to whether changes you have attempted have become permanent. The heatmap below shows where your system is carrying load and where it reads as clear. The darker the reading, the more concentrated the friction in that domain.`;

const SEC04_CLUSTERS = {
  "01_A": `In the domain of how you receive new information, you can see the pattern clearly — decisions are being shaped by what you already know rather than by what the situation is asking for. You recognise this as happening. What is notable is that this recognition has not yet produced a felt response or registered as a cost. The pattern is visible to you analytically, which means it is available for conscious correction — if you choose to act on what you can see.`,
  "01_B": `In the domain of how you receive new information, something is registering below the surface. You sense a resistance to what is trying to enter — a new direction, a shift, an insight — but you cannot yet point to where that resistance is showing up in your decisions or what it is costing you. This is a signal that has not yet found its structural expression. It is worth paying attention to precisely because it exists in the felt register before the evidence arrives.`,
  "01_C": `In the domain of how you receive new information, what registers most clearly is the energy expenditure. Something is consuming energy in this territory — a defence of the current frame, a resistance to updating — but you cannot yet see the specific pattern or feel its presence directly. The cost is real. The source is not yet identified. This is the signature of a process happening below conscious awareness that is nonetheless drawing from your operating capacity.`,
  "01_AB": `In the domain of how you receive new information, you can both see and feel the pattern. You recognise that decisions are being filtered through what you already know, and you sense the resistance to letting something new in. What has not yet registered is the cost of this pattern — what it is taking from you to maintain the current frame. The awareness is present on two levels. The accounting of what it costs has not yet begun.`,
  "01_AC": `In the domain of how you receive new information, you can see the pattern and you know it is costing you energy — but you are not feeling it in the way that would make it urgent. The filtering is visible. The drain is measurable. But the felt connection to what this means for you personally has not yet landed. This is an operational read — clear, analytical, and potentially missing the deeper signal that would turn awareness into action.`,
  "01_BC": `In the domain of how you receive new information, you feel something and you are paying for it — but you cannot point to where it is showing up in your decisions or behaviour. The resistance is present as a felt sense and as an energy drain, without observable evidence you could name. This combination carries the most weight in this domain. The fact that you feel it and it is costing you, but you cannot see the mechanism, suggests a filtering process that operates below your current line of sight.`,
  "01_ABC": `In the domain of how you receive new information, the pattern is fully visible to you. You can see the filtering, you can feel the resistance, and you know what it is costing you. This is the clearest possible read in this domain — there is no hidden signal here. The question is not awareness. It is action. You are seeing, feeling, and paying for a pattern that is within your capacity to change. Whether you change it depends on what you encounter when you try.`,
  "02_A": `In the domain of how you structure your own leadership, the pattern is visible — more time is going into managing the organisation of your work than into the work itself. You can see the overhead. What has not yet registered is a felt sense of misfit or a recognisable energy cost. The structural drag is observable but has not yet become personal. This often means the pattern is recent enough that it still feels like a temporary condition rather than a design problem.`,
  "02_B": `In the domain of how you structure your own leadership, something feels off but you cannot locate it precisely. The way you are running things does not match what is needed — you sense that — but the specific misalignment has not surfaced as something you could name or point to. This is the felt experience of a structural mismatch that has not yet declared itself. The dissonance is real. The diagnosis is not yet available to you.`,
  "02_C": `In the domain of how you structure your own leadership, the cost is what registers. You know there are things that should be delegated, released, or redesigned — and the effort of making those changes feels larger than the effort of living with the current arrangement. The cost here is not the structure itself. It is the ongoing expenditure of operating inside a structure you have already recognised as inadequate. That expenditure compounds quietly.`,
  "02_AB": `In the domain of how you structure your own leadership, you can see the overhead and you feel the misfit. Administration is consuming the work, and something about how you are holding your leadership does not match what the current conditions require. What has not yet registered is the cost — what this arrangement is actually taking from you. The pattern is visible and felt, which means it is ready to be addressed. What may be missing is the urgency that comes from recognising the price.`,
  "02_AC": `In the domain of how you structure your own leadership, you can see the structural drag and you know it is costing you — but you are not feeling it as a personal misalignment. The overhead is observable. The drain is real. But the deeper question of whether the way you hold your leadership actually fits where you are now has not yet become a felt experience. This is a functional read — efficient, clear, and potentially missing the signal that would prompt a redesign rather than an optimisation.`,
  "02_BC": `In the domain of how you structure your own leadership, you feel the misfit and you are paying for it — but you cannot point to the specific structural problem. Something about how you are running things is wrong and it is draining your energy, but if someone asked you to name what needs to change, you would not have a clear answer. This combination is the most significant in this domain. The cost of a structural problem you cannot identify is a cost that cannot be addressed through effort — only through diagnosis.`,
  "02_ABC": `In the domain of how you structure your own leadership, the full picture is visible to you. You can see the overhead, you feel the misfit, and you know what it is costing you. The structure you built to support your leadership has become a constraint on it — and you are aware of this on every level. The question is no longer awareness. It is whether you will redesign the structure or continue to operate inside one you have outgrown. The longer the gap between knowing and acting, the higher the cost compounds.`,
  "03_A": `In the domain of how you navigate competing demands, the pattern is visible — momentum is substituting for direction. You are moving fast, and you can see that the movement is not being steered with the clarity the situation requires. What has not yet registered is a felt sense of the specific deferred choice, or a recognition of what this pace is costing you. The activity is observable. The underlying avoidance has not yet surfaced.`,
  "03_B": `In the domain of how you navigate competing demands, what registers is a specific deferred choice. You know there is a decision that needs to be made — one where the honest answer would create discomfort — and you are aware that you are deferring it. You cannot yet see how this deferral is showing up in your broader pattern, and you have not yet calculated its cost. But the felt truth of the unmade choice is present and it is not going away.`,
  "03_C": `In the domain of how you navigate competing demands, the cost is what you feel most clearly. Energy is being consumed holding incompatible commitments in place — but you have not yet identified the specific choice you are avoiding or connected to the felt experience of carrying that contradiction. The drain is real and measurable. What is generating it remains below the surface.`,
  "03_AB": `In the domain of how you navigate competing demands, you can see the unsteered momentum and you can feel the specific choice you are deferring. The pace is visible. The avoidance is felt. What has not yet registered is the cost of this arrangement — what it is actually taking from you to hold incompatible commitments simultaneously while deferring the decision that would resolve them. The awareness is present. The accounting has not yet begun.`,
  "03_AC": `In the domain of how you navigate competing demands, the pattern is visible and the cost is clear — activity substituting for clarity, energy consumed by competing commitments. But the specific deferred decision — the choice where the honest answer would create discomfort — has not yet surfaced as a felt experience. You are managing the friction operationally without connecting to the personal truth underneath it. This is functional leadership under strain. It works until the deferred choice makes itself undeferrable.`,
  "03_BC": `In the domain of how you navigate competing demands, you feel the deferred choice and you are paying for it — but the pattern is not yet visible in your behaviour in a way you can point to. You know the honest answer to something would create discomfort. You know the cost of not giving that answer is real. But you cannot yet see how the deferral is shaping your decisions, your pace, or your direction. The felt truth and the cost are aligned. The structural evidence has not yet surfaced — or has not yet been recognised.`,
  "03_ABC": `In the domain of how you navigate competing demands, the full pattern is present. You can see the unsteered momentum, you feel the specific choice you are deferring, and you know the cost of holding incompatible commitments in place. There is nothing hidden here. The question is direct: will you make the choice you have been deferring, or will you continue to pay the compounding cost of not making it? The diagnostic has nothing more to reveal in this domain. What remains is the decision.`,
  "04_A": `In the domain of your energy and connection to your work, the pattern is observable — the effort required to sustain your current output has quietly increased. You can see it in the hours, in the recovery time, in the incremental escalation of what it takes to deliver what once came more naturally. What has not yet registered is a felt disconnection from the work itself, or a recognition that you are operating on discipline rather than genuine connection. The trend is visible. The deeper signal has not yet arrived.`,
  "04_B": `In the domain of your energy and connection to your work, what registers is a growing distance between what you spend your days doing and what you believe actually matters. You feel the gap. You cannot yet point to observable evidence of it in your output or performance, and you have not yet recognised it as costing you energy in a way you can measure. The disconnection is felt, not structural — which means it is operating at the foundational level, in the relationship between purpose and daily reality.`,
  "04_C": `In the domain of your energy and connection to your work, the cost is what registers most clearly. You are sustaining your current pace through discipline and routine rather than through any genuine connection to what you are building. The energy equation has inverted — more going out than coming back — but you have not yet connected this to a specific observable pattern or a felt sense of what has changed. The depletion is real. Its source has not yet been named.`,
  "04_AB": `In the domain of your energy and connection to your work, you can see the increasing effort and you feel the growing distance from what matters. The output is being maintained at higher cost, and the reason it costs more is that the connection between the work and the purpose has thinned. What has not yet registered is the full cost of this arrangement — what you are actually spending to sustain a pace driven by discipline rather than alignment. The trend and the disconnection are both visible to you. The price tag is not.`,
  "04_AC": `In the domain of your energy and connection to your work, the observable trend and the cost are both clear — effort increasing, energy equation inverted. But the felt experience of disconnection from purpose has not registered. You see the numbers and you feel the drain, but the deeper question — whether the work itself still means what it once meant to you — has not yet become a felt reality. This is the pattern of a leader managing sustainability as a logistics problem rather than a meaning problem.`,
  "04_BC": `In the domain of your energy and connection to your work, you feel the disconnection and you are paying for it — but you cannot point to where it shows up in your observable output or behaviour. The growing distance between what you do and what matters is real. The depletion is real. But from the outside, and perhaps even in your own assessment of your performance, the evidence has not yet appeared. This is the pattern where the internal condition is furthest ahead of the external evidence — and where the risk of continuing without intervention is highest, precisely because nothing visible forces the issue.`,
  "04_ABC": `In the domain of your energy and connection to your work, the full picture is present. The effort is increasing, the connection to purpose is thinning, and you are sustaining your pace through discipline rather than meaning. There is no hidden signal here — you are seeing, feeling, and paying for a pattern that is unsustainable in its current form. The structural question is not whether this needs to change. It is what it would take to reconnect the daily reality to the thing that made it worth doing in the first place. That question may be simple. It may be foundational. This reading cannot tell you which.`,
  "05_A": `In the domain of endings and transitions, you can name the specific thing that should have ended or changed by now. It is identifiable. You could point to it. But you have not yet felt the weight of its continued presence, or recognised what it is costing you. The recognition is analytical — you know it should have changed. The felt experience of what holding on is doing to you has not yet landed.`,
  "05_B": `In the domain of endings and transitions, what registers is a felt sense that something fundamental is shifting — a chapter closing, a way of operating reaching its natural end — but you have not named it and you have not begun the transition. You cannot point to a specific thing that should have stopped. The feeling is more diffuse than that. Something is ending and you know it in your body before you know it in your plans. This is the signal that precedes the structural change, not the change itself.`,
  "05_C": `In the domain of endings and transitions, the cost is what registers. You would release what is no longer working if you could see what comes next — but you cannot, so you maintain the status quo. The energy is going into sustaining an arrangement you have already outgrown, not because you believe in it but because the alternative is a void you have not yet learned to navigate. The cost is not the thing you are holding. It is the absence of what would replace it.`,
  "05_AB": `In the domain of endings and transitions, you can name the thing that should have changed and you can feel the broader shift underneath it. The specific and the diffuse are both present — a nameable item that has outstayed its relevance, and a deeper felt sense that a whole chapter is closing. What has not yet registered is the cost. The awareness is on two levels but the accounting of what this extended holding pattern is taking from you has not yet been done.`,
  "05_AC": `In the domain of endings and transitions, you can name what should have ended and you know the cost of maintaining it — but the felt experience of the transition has not yet arrived. The analysis is complete: you know what should go and you know what it costs to keep it. But the embodied experience of release — the willingness to cross the threshold — has not yet become available. This is the pattern of a leader who has done the thinking but not the letting go.`,
  "05_BC": `In the domain of endings and transitions, you feel the ending and you are paying for the suspended state — but you cannot name the specific thing that needs to change. Something is shifting, the in-between is consuming your energy, and you cannot yet point to what would resolve it. This is the most consequential combination in this domain. The felt truth and the cost are both real, but without an identifiable object, the transition has nowhere to land. What you are carrying is the weight of a threshold you can feel but cannot yet cross.`,
  "05_ABC": `In the domain of endings and transitions, the full pattern is present. You can name what should have ended, you feel the broader shift underneath, and you know the cost of the suspended state between what was and what has not yet begun. Nothing is hidden here. The question is whether you will cross the threshold you can now fully see — or whether the clarity itself becomes another thing you carry without acting on. The diagnostic cannot make the move for you. It can only confirm that the move is overdue.`,
  "06_A": `In the domain of entrapment and structural exposure, you can identify a specific dependency that has disproportionate power over your decisions. A relationship, a revenue source, a commitment, a person — something has more influence over how you operate than you are comfortable with. You can name it. You have not yet felt the vulnerability underneath it, and you have not yet recognised the cost of navigating around it. The lock is visible. Its structural consequences have not yet landed.`,
  "06_B": `In the domain of entrapment and structural exposure, what registers is a felt sense of vulnerability. Something underneath your current position feels less stable than it appears from the outside. You cannot point to a specific dependency or a structural crack — the feeling is more diffuse than that. The ground feels uncertain. This is a signal worth taking seriously precisely because it exists in the felt register before the evidence arrives. The instinct that something could break often precedes the break itself.`,
  "06_C": `In the domain of entrapment and structural exposure, the cost is what registers most clearly. You have lost confidence in your direction but you are still moving — because stopping feels more dangerous than continuing. The energy is going into forward motion driven by the absence of an alternative rather than the presence of clarity. This is the crisis pattern in its purest form: movement sustained by fear of stillness rather than by any conviction about where the movement leads.`,
  "06_AB": `In the domain of entrapment and structural exposure, you can identify the dependency that constrains you and you feel the instability underneath your position. The lock is visible and the ground feels uncertain. What has not yet registered is the combined cost of navigating a constrained position on unstable foundations. The awareness is on two levels — structural and felt — but the energy expenditure of this arrangement has not yet been accounted for.`,
  "06_AC": `In the domain of entrapment and structural exposure, you can see the dependency and you know the cost — you are locked into something and the absence of direction is dictating your choices. But the felt sense of vulnerability has not registered. The crisis is being managed analytically: the constraint is identified, the cost is measured, but the deeper experience of what it means to be structurally trapped has not yet been allowed in. This is a functional response to a crisis that may require a more fundamental one.`,
  "06_BC": `In the domain of entrapment and structural exposure, you feel the instability and you are paying for it — but you cannot name the specific dependency or structural crack that is generating it. The ground feels uncertain, the direction is unclear, and the energy cost of continuing without resolution is real. But the specific mechanism — what exactly has you trapped, or what exactly is fragile — remains below the level of what you can currently identify. This is the combination that carries the most weight in this domain. The vulnerability and the cost are both real. The source is not yet visible.`,
  "06_ABC": `In the domain of entrapment and structural exposure, the full picture is present. You can name what has you locked in, you feel the instability underneath, and you know the cost of continuing without resolution. This is a crisis-level reading in the most literal sense — the foundations are not holding, the constraints are real, and the absence of direction is consuming energy that should be going into the next chapter. Nothing is hidden here. What is needed is not more awareness. It is structural intervention at the level where the foundations are set.`,
  "07_A": `In the domain of perceptual accuracy, you can see that you are making decisions based on assumptions you have not tested against current conditions. The pattern is identifiable — you know the assumptions are stale or unverified. What has not yet registered is a felt sense that your overall picture of reality may be incomplete, or a recognition of the energy being spent to avoid finding out. The outdated assumptions are visible. The deeper question of whether your map matches the territory has not yet become personal.`,
  "07_B": `In the domain of perceptual accuracy, what registers is a quiet awareness that the version of reality you are operating from may not be the complete picture. You cannot point to specific untested assumptions or outdated data — the sense is more diffuse than that. Something about how you are seeing your situation feels partial or provisional. This is a significant signal. The awareness that your map might not match the territory — even without knowing where the distortion lies — is the precondition for updating it.`,
  "07_C": `In the domain of perceptual accuracy, the cost is what registers. Energy is being spent managing anxiety about what might be true rather than finding out what actually is. You are not yet aware of specific untested assumptions, and the felt sense of an incomplete picture has not surfaced — but the drain of not-knowing is real and present. The anxiety is not about a specific fear. It is about the territory you have not yet been willing to look at directly.`,
  "07_AB": `In the domain of perceptual accuracy, you can see the untested assumptions and you sense that your overall picture may be incomplete. The stale data is identifiable and the felt awareness of a partial view is present. What has not yet registered is the cost — the energy being consumed by operating on an unverified map. The awareness is clear. The price of the uncertainty has not yet been counted.`,
  "07_AC": `In the domain of perceptual accuracy, you can identify the untested assumptions and you know the cost — energy going into managing uncertainty rather than resolving it. But the deeper felt sense that your picture of reality is fundamentally incomplete has not yet landed. You are managing the problem operationally: identifying the stale data, measuring the anxiety cost. The possibility that the distortion goes deeper than specific assumptions — that the frame itself may need updating — has not yet become a felt reality.`,
  "07_BC": `In the domain of perceptual accuracy, you sense the incompleteness and you are paying for it — but you cannot identify the specific assumptions that are distorted or outdated. The awareness that your map may not match the territory is present as a felt sense and as an energy drain, without the structural specificity that would allow you to correct course. This is the combination that carries the most weight in this domain. You know something is off. It is costing you energy. And the specific nature of the distortion is not yet visible — which means the corrections you are making may themselves be based on the flawed map.`,
  "07_ABC": `In the domain of perceptual accuracy, the full pattern is visible. You can identify untested assumptions, you sense the picture is incomplete, and you know the cost of operating in this condition. The question this domain raises when all three registers are active is whether you are willing to do the work of finding out what is actually true — even if what you find challenges the version of reality you have been operating from. Full awareness in this domain is not the end of the inquiry. It is the beginning of a more honest one.`,
  "08_A": `In the domain of integration, the pattern is observable — changes you initiated reverted once the urgency passed. You can point to specific instances where new patterns, commitments, or ways of operating returned to their prior state when your attention moved elsewhere. What has not yet registered is a felt sense that the changes never truly took hold, or a recognition of the energy being spent re-initiating what should already be embedded. The reversion is visible. Its deeper meaning has not yet landed.`,
  "08_B": `In the domain of integration, what registers is a felt sense that the changes you made were real in the moment but have not become part of how you actually operate. You cannot point to a specific reversion — it is not that dramatic. It is more subtle: a quiet awareness that the new pattern did not take root, that what you intended to become has not yet become. This is the felt experience of non-integration — the gap between the change you initiated and the change that held.`,
  "08_C": `In the domain of integration, the cost is what registers. Energy is going into re-starting shifts that should have already been embedded. The repetition itself is the drain — initiating the same change, making the same commitment, setting the same intention, and finding yourself back at the starting point. You have not yet identified the specific reversion pattern or connected to the felt experience of non-integration. What you know is that the effort is circular. That circularity is the cost.`,
  "08_AB": `In the domain of integration, you can see the reversion and you feel the non-integration. Changes reverted when urgency passed, and underneath that, there is a deeper sense that the shifts you attempted never truly became part of how you operate. What has not yet registered is the cost — the energy consumed by the cycle of initiating, reverting, and re-initiating. The pattern and the feeling are both clear. The toll of the cycle has not yet been counted.`,
  "08_AC": `In the domain of integration, you can see the reversion and you know the cost of re-initiation — but the deeper felt sense of non-integration has not registered. You are managing the problem practically: identifying what reverted, measuring the energy spent re-starting. The possibility that the changes did not hold because something more foundational was missing — not effort, but the structural conditions required for the change to become permanent — has not yet become a felt reality.`,
  "08_BC": `In the domain of integration, you feel the non-integration and you are paying for it — but you cannot point to specific reversions or identify exactly where the changes failed to hold. The sense that nothing quite took root is present, and the cost of the circular pattern is real, but the structural evidence that would tell you what went wrong is not yet visible. This combination suggests that the conditions required for integration — not the changes themselves but the environment in which they were attempted — may be the missing element. Changes that do not hold often fail not because the change was wrong but because the ground it was planted in was not ready.`,
  "08_ABC": `In the domain of integration, the full pattern is present. You can see the reversions, you feel the non-integration, and you know the cost of the circular pattern. This is the capstone reading of the entire diagnostic — because integration is where everything else either holds or doesn't. The friction identified across all other domains will persist until the changes made to address it become structurally permanent. The question this domain raises is not what needs to change — earlier sections of this report have named that. The question is what conditions are required for change to actually hold in your system. That question may be the most important one this reading leaves you with.`,
};

const SEC04_BLINDSPOT = `Several operational domains read as clear — no recognisable friction was selected. In combination with the load present in other domains, this pattern raises a structural question. Systems do not typically develop concentrated friction in downstream domains from a clean foundation. The domains reading as clear may reflect genuine alignment — or they may reflect conditions so deeply embedded in how you operate that they have become invisible as normal. The absence of recognised friction is not the same as the absence of friction. It may simply mean the friction has become the water you swim in.`;


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
const gap_being_reading = buildTerritoryReading("Being", bState, GAP_BEING[bState]);
const gap_relating_reading = buildTerritoryReading("Relating", rState, GAP_RELATING[rState]);
const gap_creating_reading = buildTerritoryReading("Creating", cState, GAP_CREATING[cState]);
const gap_bridge = wrap(GAP_BRIDGE);

  // ─── SEC 04: CLUSTER PROFILE ───
  let sec04 = wrap(SEC04_INTRO);
  const clusterNames = {
    "01": "Inception", "02": "Construction", "03": "Interaction", "04": "Internalisation",
    "05": "Turning Point", "06": "The Crisis", "07": "Emergence", "08": "Completion"
  };

  let hasLoad = false;
  let clearCount = 0;
  for (const cn of ["01","02","03","04","05","06","07","08"]) {
    const combo = combos[cn];
    if (combo && combo !== "NONE" && combo !== "BLANK" && combo !== "D") {
      const key = cn + "_" + combo;
      const text = SEC04_CLUSTERS[key];
      if (text) {
        sec04 += "<h3 style='font-family:Montserrat,sans-serif;font-size:11pt;color:#D4A843;font-weight:bold;margin-top:22px;margin-bottom:10px;'>" + clusterNames[cn] + "</h3>";
        sec04 += wrap(text);
        hasLoad = true;
      }
    } else {
      clearCount++;
    }
  }

  // Blind spot narrative — if loaded clusters exist alongside clear ones
  if (hasLoad && clearCount >= 3) {
    sec04 += wrap(SEC04_BLINDSPOT);
  }

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
    gap_bridge: gap_bridge,
    sec04_html: sec04,
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
