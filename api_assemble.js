// ════════════════════════════════════════════════════════════════
// LEADER COHERENCE SNAPSHOT — CONTENT ASSEMBLY ENGINE
// Vercel Serverless Function (api/assemble.js)
// ════════════════════════════════════════════════════════════════
//
// PURPOSE: Receives scored variables from Zoho Flow webhook,
// selects the correct content blocks, wraps in HTML,
// returns merge-ready content for Zoho Writer.
//
// ENDPOINT: POST /api/assemble
// INPUT: JSON body with all scoring variables
// OUTPUT: JSON with sec01_html through sec10_html
//
// DEPLOYMENT: Push to GitHub repo → auto-deploys on Vercel
// ════════════════════════════════════════════════════════════════

// ─── HTML STYLE FRAGMENTS ───
const ps = "<p style='font-family:Georgia,serif;font-size:11pt;color:#4A4A5A;line-height:1.7;margin-bottom:14px;'>";
const pe = "</p>";
const ac = "<span style='color:#D4A843;font-weight:bold;'>";
const sc = "</span>";
const bld = "<strong style='color:#1A1A2E;'>";
const be = "</strong>";

function wrap(text) {
  // Wrap plain text in styled paragraph HTML
  return ps + text + pe;
}


// ════════════════════════════════════════════════════════════════
// CONTENT BLOCKS — ALL 112 BLOCKS
// ════════════════════════════════════════════════════════════════

// ─── SECTION 01: OPENING FRAME (6 versions) ───
const SEC01 = {
  "FRACTURED": `{{leader_name}}, this is your Leader Coherence Snapshot, taken {{snapshot_date}}. Your system reads as Fractured — carrying comprehensive structural load across most operational domains, with a significant felt distance between where you are operating and where you know you are capable of operating. This is not a judgement. It is a reading of current conditions — conditions that are identifiable, structural, and responsive to precise intervention. What follows names the pattern with the specificity it requires.`,
  "STRAINED": `{{leader_name}}, this is your Leader Coherence Snapshot, taken {{snapshot_date}}. Your system reads as Strained — carrying distributed load across multiple domains, with a clear awareness that current conditions do not reflect the leadership you know you are capable of. You are not in denial about the friction. The diagnostic question is not whether it exists — you already know it does — but where it originates and what it is structurally costing you.`,
  "DRIFTING": `{{leader_name}}, this is your Leader Coherence Snapshot, taken {{snapshot_date}}. Your system reads as Drifting — carrying a diffuse, felt-level load that has not concentrated into structural crisis. The friction you are experiencing is present but difficult to locate with precision. This pattern often describes a leader between chapters — the one that is ending and the one that has not yet begun.`,
  "DRIVEN": `{{leader_name}}, this is your Leader Coherence Snapshot, taken {{snapshot_date}}. Your system reads as Driven — performing well by external measures while carrying structural load that has not yet registered at the felt level. This is a reading that warrants careful attention. The distance between your felt alignment and your system’s actual load is the most important signal in this report.`,
  "COHERENT": `{{leader_name}}, this is your Leader Coherence Snapshot, taken {{snapshot_date}}. Your system reads as Coherent — low structural friction across operational domains, with strong felt alignment between where you are operating and where you know you are capable of operating. This reading confirms a current state, not a permanent one. What follows gives you the structural frame to understand what this means and how to read the changes when they come.`,
  "QUALIFIED": `{{leader_name}}, this is your Leader Coherence Snapshot, taken {{snapshot_date}}. Your system produces the cleanest possible reading across all operational domains. This report addresses what that means — and what it may not mean — with the same precision it would bring to any other reading.`,
};

// ─── SECTION 02: COHERENCE STATE ───
// Universal intro (Block 007)
const SEC02_INTRO = `The Coherence Framework reads five operating states. These are not personality types. They are not permanent categories. They are readings of how you are currently operating — and they are designed to change. A leader who reads as Strained today may read as Driven in three months and Coherent in six. The state is a signal of current conditions, not a definition of who you are.`;

// State descriptions (Blocks 008-013)
const SEC02_DESC = {
  "FRACTURED": `A Fractured state is a system under comprehensive load. The friction is not localised — it is present across most of the domains this diagnostic reads. The felt distance between your core operating capacity and your current reality is at its widest. This is not a description of you as a leader. It is a description of the conditions you are currently navigating. Fractured is not failure. It is a signal that the current conditions require urgent attention to the source design — not the symptoms, and not increased effort. The conditions generating this state are identifiable, and they respond to structural intervention.`,
  "STRAINED": `A Strained state is a system carrying real load with real awareness. You are not in denial about the friction — you can feel it, and in most domains you can see it. The question this reading surfaces is not whether things are difficult. You already know they are. The question is whether the effort you are applying is addressing the source of the friction or compensating for it. Strained systems often respond to increased effort with increased output — temporarily. The structural condition underneath does not change until the design changes. You are working hard. The diagnostic question is whether the work is aimed at the right level.`,
  "DRIFTING": `A Drifting state is a system that has lost its primary signal. The friction is not acute — it is diffuse. You feel it more than you can see it. In most domains, you sense that something is off without being able to name the structural cause. This pattern typically originates at the foundational level — in the relationship between your sense of purpose and your daily operating reality — rather than in any specific structural failure. Drifting is not a crisis. It is the quiet withdrawal of energy from a reality that has lost its connection to the reason it exists. It responds not to more effort but to a recalibration of direction.`,
  "DRIVEN": `A Driven state is the most structurally complex reading this diagnostic produces. Your felt alignment is high — you experience yourself as operating close to your centre of gravity. At the same time, your system is carrying significant structural load in domains that carry real consequence. This combination is the signature of a leader whose adapted self is performing at peak — externally rewarded, delivering results, while internally the distance from the core self is widening in ways that are not yet felt. Driven is not a compliment. It is a signal that the gap between who you are and how you are operating is at its widest precisely when it is least visible to you.`,
  "COHERENT": `A Coherent state is a system in alignment. The friction load is low. The felt distance between your core operating capacity and your daily reality is minimal. Your selections indicate that most operational domains are functioning without significant strain. This is not a permanent condition — it is a reading of now. Coherent systems are not frictionless. They are systems where the friction that exists is being navigated rather than avoided, managed rather than suppressed. The value of this reading is not in confirming this state but in providing a baseline — a point of comparison you can return to when conditions change.`,
  "QUALIFIED": `This reading requires a different kind of honesty from the diagnostic. Your system produces minimal friction across all operational domains, and your felt alignment is at or near its maximum. In any system operating under real-world conditions, this is the rarest possible reading. It has two structurally opposite interpretations. The first is genuine coherence — the conditions of your leadership are aligned at a level that produces no detectable friction. The second is that the diagnostic has reached the boundary of what self-report can detect. Some operating conditions — particularly those that have become so thoroughly normalised that they no longer register as friction — are invisible to any instrument that relies on the leader’s own recognition. This report names both possibilities with equal weight.`,
};

// Structural meanings (Blocks 014-019)
const SEC02_MEANING = {
  "FRACTURED": `When a system reads as Fractured, the friction has typically cascaded across multiple levels. What began as a single misalignment — often at the foundational level, in the relationship between felt truth and daily action — has compounded through interaction, structure, and decision-making until it saturates the operating environment. The diagnostic challenge is separating the primary condition from its downstream consequences. The intervention that addresses a symptom will not shift a source. Identifying which layer carries the origin condition is the structural work that determines where intervention has leverage.`,
  "STRAINED": `A Strained reading typically indicates a gap between effort and design. You are working hard — and the work may be sustaining output. But effort applied to a misaligned design produces temporary relief, not structural change. The source of the strain is not motivational. It is architectural. Something about how your leadership is currently organised — the standards you hold, the commitments you carry, the way you allocate energy — is not congruent with what the current conditions actually require. The strain is the felt experience of that incongruence.`,
  "DRIFTING": `A Drifting reading typically originates at Level 0 or Level 1 of the coherence architecture — the existential and individual layers. The disconnection is not between you and your organisation or between you and your market. It is between you and the signal that tells you why any of it matters. The system has not broken. The signal driving it has faded. This is not a structural failure that effort can repair. It is a foundational recalibration that begins with the relationship between your sense of purpose and your daily reality.`,
  "DRIVEN": `The structural danger of a Driven reading is that the external signals — performance, recognition, reward — actively reinforce the adapted self’s operating mode. The better it performs, the less reason there is to examine the cost. The load accumulates in domains the leader is not attending to, often in the foundational and relational territories that sit upstream of visible output. The gap between core self and operating self widens precisely because the operating self is succeeding. This is the state where the cost is highest and the felt signal is weakest.`,
  "COHERENT": `A Coherent reading reflects a current alignment that has structural integrity. The conditions sustaining this alignment — clarity of purpose, congruence between felt truth and daily action, navigated rather than avoided friction — are themselves dynamic. They require maintenance, not complacency. The structural question a Coherent leader carries is: what would need to change in my conditions for this reading to shift, and would I recognise the early signals of that shift? Coherence that is not monitored becomes coherence that is assumed. Assumption is the first step toward drift.`,
  "QUALIFIED": `The diagnostic boundary a Qualified reading reveals is structural, not personal. Self-report instruments — all of them, not just this one — are limited by the respondent’s capacity to recognise what is happening in their own system. When that capacity is high, the instrument produces a clear signal. When the operating conditions have been normalised to the point where friction no longer registers as friction, the instrument produces silence — which can mean either genuine coherence or comprehensive management of reality. The distinction between these two conditions cannot be resolved by the leader alone. It requires an external read.`,
};

// ─── SECTION 03: PRIMAL GAP READING (4 versions) ───
const SEC03 = {
  "CONSISTENT_LOW": `Your felt alignment and your structural load are consistent. The distance between where you are operating and where you know you are capable of operating is small, and the friction across your operational domains confirms this. This is a reading of current alignment — a baseline you can measure future readings against.`,
  "CONSISTENT_HIGH": `Your felt distance from your own centre of gravity is significant, and the friction across your operational domains is consistent with this. You are not in denial about the current conditions. The alignment between your felt state and your structural read means the diagnostic has a clear signal to work with — the pattern is visible and can be addressed structurally.`,
  "CONTRADICTION_DRIVEN": `Your felt alignment is high — you experience yourself as operating close to your centre of gravity. Your structural load tells a different story. The friction across your operational domains is significant, concentrated in domains that carry real consequence. This gap between felt alignment and structural reality is the most important signal in this report. It does not mean your felt experience is wrong. It means there is a cost accumulating in your system that has not yet reached the level where you feel it. That cost does not wait for permission to compound.`,
  "CONTRADICTION_INTERNAL": `Your felt distance from your own centre of gravity is significant, but the friction across your operational domains is minimal. The source of the distance is not structural — it is not embedded in how you operate day to day. It is more likely to originate at the foundational level: in the relationship between your sense of purpose and your daily reality. The friction is internal. The system is not in crisis. But the felt distance you carry is real, and it will eventually express structurally if it remains unaddressed.`,
};

// ─── SECTION 04: CLUSTER PROFILE ───
// Intro (Block 024)
const SEC04_INTRO = `The Snapshot reads your current state across eight operational domains — from how you receive new information through to whether changes you have attempted have become permanent. The heatmap below shows where your system is carrying load and where it reads as clear. The darker the reading, the more concentrated the friction in that domain.`;

// Cluster paragraphs (Blocks 025-080)
// Key format: 'XX_COMBO' e.g. '01_A', '01_AB', '03_ABC'
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
  "08_ABC": `In the domain of integration, the full pattern is present. You can see the reversions, you feel the non-integration, and you know the cost of the circular pattern. This is the capstone reading of the entire diagnostic — because integration is where everything else either holds or doesn’t. The friction identified across all other domains will persist until the changes made to address it become structurally permanent. The question this domain raises is not what needs to change — earlier sections of this report have named that. The question is what conditions are required for change to actually hold in your system. That question may be the most important one this reading leaves you with.`,
};

// Empty clusters narrative (Block 081)
const SEC04_BLINDSPOT = `Several operational domains read as clear — no recognisable friction was selected. In combination with the load present in other domains, this pattern raises a structural question. Systems do not typically develop concentrated friction in downstream domains from a clean foundation. The domains reading as clear may reflect genuine alignment — or they may reflect conditions so deeply embedded in how you operate that they have become invisible as normal. The absence of recognised friction is not the same as the absence of friction. It may simply mean the friction has become the water you swim in.`;

// ─── SECTION 05: THE PATTERN ───
// Educational frame (Block 082)
const SEC05_FRAME = `The Snapshot reads three registers: what you can see and name, what you feel but cannot yet articulate, and where your energy is going. The pattern across these three registers — across all eight domains — reveals how you are currently processing your own reality.`;

// Dominance narratives (Blocks 083-086)
const SEC05_DOMINANCE = {
  "A_DOMINANT": `Your selections concentrate in the observable register. The friction in your system is not hidden from you — it is visible, identifiable, and in most domains you could point to specific evidence of it. The question this pattern raises is not whether you see the friction but whether seeing it has translated into structural change. Observable friction that persists despite awareness is often friction that is being managed rather than resolved — worked around rather than redesigned. Seeing clearly is a necessary condition for change. It is not a sufficient one.`,
  "B_DOMINANT": `Your selections concentrate in the felt register. In most domains, the friction registers as an instinct, an unease, a recognition that something is present — without the kind of structural evidence you could point to or prove. This is the pattern of a leader whose internal signal is active and accurate but whose reality has not yet produced the observable data to confirm it. The felt truth is ahead of the visible reality. This is not imprecision in your perception. It is a signal that the structural expression of what you are sensing may not have surfaced yet — or may be present in a form you have not yet learned to recognise.`,
  "C_DOMINANT": `Your selections concentrate in the cost register. Across most domains, what registers most clearly is not the specific friction or the felt experience underneath it, but the toll — the drain, the effort, the sense that more energy is going out than is coming back. This pattern often describes a leader who has carried the load long enough that the specific causes have blurred into a general condition of depletion. The cost is undeniable. The source of the cost is not yet clear. This is the pattern where structural diagnosis has the highest immediate impact — because naming the specific source of the drain is the first condition for stopping it.`,
  "MIXED": `Your selections do not concentrate in a single register. Across your operational domains, you recognise some friction as visible and nameable, some as felt but not yet articulated, and some primarily through what it costs you in energy. This pattern suggests a leader who is processing their current reality through multiple channels simultaneously — seeing some things with clarity, sensing others without being able to name them, and registering others only through their toll. The diagnostic value of this pattern is in the specific distribution: which domains are you seeing clearly, which are you feeling, and which are you only registering through what they cost?`,
};

// Structural observation (Block 087)
const SEC05_OBSERVATION = `The register through which you recognise friction is itself diagnostic information. What you see clearly is available for structural change — the question is whether you will act on it. What you feel but cannot name is signalling ahead of your conscious understanding — the question is what would need to change for that signal to become visible and actionable. What you register only through its cost is being maintained by something you have not yet identified — the question is what that cost is protecting you from seeing.`;

// ─── SECTION 06: THE FRAMEWORK ───
// Educational content (Blocks 088-091)
const SEC06_PRIMAL_GAP_EDU = `At the foundation of this diagnostic is a single structural concept: the Primal Gap. This is the distance between your felt truth — what you actually know, sense, and experience — and your daily actions. Every leader carries this gap. It is not a flaw. It is a structural condition created by the adapted self — a collection of behaviours, patterns, and strategies formed over a lifetime to navigate situations where the full truth felt too costly or too dangerous to act on. These adaptive behaviours were once necessary. They become a diagnostic problem when they persist beyond the conditions that created them — when the survival strategy runs long after the threat has passed. The Snapshot reads how wide this gap is right now.`;
const SEC06_FRACTAL_EDU = `Your individual operating state does not stay contained within you. It projects outward — into your relationships, into the teams you lead or belong to, into the systems you design and the culture you create, into how your work meets the market, and into the broader impact of what you build. The Coherence Framework calls this the fractal principle: the same pattern that operates at the individual level reappears at every level of scale. A leader whose adapted self avoids difficult conversations will build a team that avoids difficult conversations, inside an organisation whose culture punishes difficult conversations. The pattern is not coincidence. It is structural projection. This Snapshot reads Level 1 — your individual operating state. The same framework reads all six levels.`;
const SEC06_MATRIX_EDU_P1 = `The Knowing/Unknowing Matrix maps the four territories of your reality. The Shared Reality is what is conscious and known — the facts everyone agrees on, the visible operating conditions. The Inquiry is what is conscious but unknown — the questions you are actively trying to answer, the problems you know exist but have not yet solved. The Felt Truth is what is known but unconscious — the intuition, the gut sense, the signal you carry in your body that has not yet been translated into language or action. The Blind Spot is what is both unknown and unconscious — the conditions you cannot see from where you are currently standing, the architectural assumptions your reality is built on that are invisible precisely because they are foundational. At the centre sits Systemic Avoidance — the energy spent keeping material in the lower quadrants from rising into conscious awareness.`;
const SEC06_MATRIX_EDU_P2 = `The Snapshot has moved some of what sat in the lower quadrants into the upper ones. It has given language to patterns you may have felt but not named. It has made structural conditions visible that may have been operating below your conscious attention. What remains below the line — the felt truths you have not yet spoken and the blind spots you cannot see from your current position — is beyond the reach of any instrument that relies on your own recognition. That territory is the geography of deeper inquiry.`;

// Matrix connections (Blocks 092-095)
const SEC06_CONNECTION = {
  "A_DOMINANT": `Your selections suggest your attention currently lives in the upper half of this map — the Shared Reality and Inquiry quadrants. You are operating from conscious, known territory. The structural question is what sits below: the Felt Truth that your system is carrying but you have not yet given voice to, and the Blind Spot that is, by definition, invisible from the vantage point you currently occupy.`,
  "B_DOMINANT": `Your selections suggest your attention currently lives in the Felt Truth quadrant. You are sensing what is happening in your system before it becomes visible or provable. The structural question is what would need to change for that felt truth to cross the line into the Shared Reality — into the conscious, known territory where it can be named, examined, and acted on.`,
  "C_DOMINANT": `Your selections suggest your attention is registering the cost of your current conditions without being fully connected to either the observable cause or the felt experience underneath. The structural question is what the cost is protecting you from confronting — what truth, named or unnamed, would become visible if the energy currently spent maintaining the status quo were released.`,
  "MIXED": `Your selections are distributed across the map. Some domains sit in the Shared Reality — visible, conscious, available for action. Others sit in the Felt Truth — sensed but not yet named. Others register only through their cost, suggesting material that is being actively maintained below the surface. The pattern across these territories is itself the diagnostic — the gaps between what you see, what you feel, and what is costing you energy are where the unexamined material sits.`,
};

// ─── SECTION 07: YOUR BASELINE (universal) ───
const SEC07_BASELINE = `This reading is dated {{snapshot_date}}. It is a structural snapshot of your operating state at this specific moment. It is designed to change — and it is designed to be returned to. The framework’s diagnostic value increases with repetition because each reading generates a point of comparison against the last. What shifts between readings — which domains load or clear, whether the Primal Gap widens or narrows, whether the Coherence State moves — is itself the most powerful data the framework produces. This is your baseline. The next reading measures movement.`;
const SEC07_WHAT_CHANGES = `Conditions that typically produce a different reading: a significant decision made or deferred, a structural change in your role or responsibilities, the end of a quarter of deliberate work on what this reading has surfaced, a transition in a key relationship, or a shift in the external conditions your leadership operates within. The Snapshot is built for these moments — not as an annual exercise but as a live diagnostic returned to whenever the ground shifts.`;

// ─── SECTION 08: THREE QUESTIONS (universal) ───
const SEC08_FRAME = `This reading has named what the Snapshot can see. The following three questions test what you can do with what it has shown you.`;
const SEC08_Q1 = `Question 1: “Can you name the single deepest source of the friction this reading has identified — not the symptoms, but the origin condition?”`;
const SEC08_Q2 = `Question 2: “Do you know what would need to structurally change — in you, not in your circumstances — for this reading to be different in 90 days?”`;
const SEC08_Q3 = `Question 3: “Are you currently able to make that change, or is something preventing you from acting on what you now see?”`;
const SEC08_THRESHOLD_A = `If you answered all three with clarity and conviction, this reading has done its work. You have the language, the structural frame, and the capacity to act on what has been surfaced. Return in 90 days for your next reading and measure the movement against this baseline.`;
const SEC08_THRESHOLD_B = `If you could answer the first but not the second — you can see the source but not the structural shift required — the diagnostic has reached a depth that self-reflection alone may not resolve. The origin conditions of the patterns this reading has identified often operate below the level of conscious design. The transition from seeing the source to knowing what must structurally change is where facilitated diagnostic inquiry begins to matter.`;
const SEC08_THRESHOLD_C = `If you could not clearly answer the first — if the source of the friction remains felt but unnamed — then what the Snapshot has surfaced is the boundary of what self-report can reach. The material underneath exists in the territory this report has mapped as Q3 and Q4 — the Felt Truth and the Blind Spot. That material requires a different kind of inquiry, one that operates below the line of what you can currently see on your own.`;

// ─── SECTION 09: TEXT FIELD REFLECTION ───
const SEC09_LABEL = `You named this as the pattern most present in your leadership:`;
const SEC09_CONTEXT = `The diagnostic reads this alongside the structural pattern it has identified. What you chose to name — and what you chose not to — both carry weight. The relationship between your words and the instrument’s reading is itself a signal. If they align, the diagnostic has confirmed what you already know. If they diverge, the space between what you named and what the Snapshot surfaced may be the most important territory in this report.`;

// ─── SECTION 10: THE OPEN LOOP (6 versions) ───
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
  // v = scored variables from Zoho Flow scoring engine
  // Returns object with all merge field HTML strings

  const state = v.coherence_state;
  const gap = v.gap_type;
  const dom = v.pattern_dominance;
  const name = v.leader_name;
  const date = v.snapshot_date;
  const primalGap = v.primal_gap;
  const textField = v.text_field_response || "";
  const blindSpot = v.blind_spot_distribution;

  // Cluster combo codes
  const combos = {
    "01": v.c01_combo,
    "02": v.c02_combo,
    "03": v.c03_combo,
    "04": v.c04_combo,
    "05": v.c05_combo,
    "06": v.c06_combo,
    "07": v.c07_combo,
    "08": v.c08_combo,
  };


  // ─── SEC 01: OPENING FRAME ───
  let sec01 = SEC01[state] || "";
  // Replace merge tokens
  sec01 = sec01.replace(/\{\{leader_name\}\}/g, name);
  sec01 = sec01.replace(/\{\{snapshot_date\}\}/g, date);
  sec01 = wrap(sec01);


  // ─── SEC 02: COHERENCE STATE ───
  // Universal intro + state description + structural meaning
  const sec02_intro = wrap(SEC02_INTRO);
  const sec02_desc = wrap(SEC02_DESC[state] || "");
  const sec02_meaning = wrap(SEC02_MEANING[state] || "");
  const sec02 = sec02_intro + sec02_desc + sec02_meaning;


  // ─── SEC 03: PRIMAL GAP ───
  const sec03_score = wrap("Your Primal Gap Score: " + bld + primalGap + " / 10" + be);
  const sec03_reading = wrap(SEC03[gap] || "");
  const sec03 = sec03_score + sec03_reading;


  // ─── SEC 04: CLUSTER PROFILE ───
  let sec04 = wrap(SEC04_INTRO);

  // Cluster names for headings
  const clusterNames = {
    "01": "Inception",
    "02": "Construction",
    "03": "Interaction",
    "04": "Internalisation",
    "05": "Turning Point",
    "06": "The Crisis",
    "07": "Emergence",
    "08": "Completion"
  };

  for (const cn of ["01","02","03","04","05","06","07","08"]) {
    const combo = combos[cn];
    if (combo && combo !== "NONE") {
      const key = cn + "_" + combo;
      const text = SEC04_CLUSTERS[key];
      if (text) {
        sec04 += "<h3 style='font-family:Georgia,serif;font-size:12pt;color:#D4A843;font-weight:bold;margin-top:22px;margin-bottom:10px;'>" + clusterNames[cn] + "</h3>";
        sec04 += wrap(text);
      }
    }
  }

  // Blind spot narrative
  if (blindSpot) {
    sec04 += wrap(SEC04_BLINDSPOT);
  }


  // ─── SEC 05: THE PATTERN ───
  let sec05 = wrap(SEC05_FRAME);
  sec05 += wrap(SEC05_DOMINANCE[dom] || SEC05_DOMINANCE["MIXED"]);
  sec05 += wrap(SEC05_OBSERVATION);


  // ─── SEC 06: FRAMEWORK ───
  // Educational content is STATIC in Writer template.
  // This merge field contains ONLY the matrix connection paragraph.
  const sec06 = wrap(SEC06_CONNECTION[dom] || SEC06_CONNECTION["MIXED"]);


  // ─── SEC 07: BASELINE (static in Writer template) ───
  // Not in a merge field. But included here for completeness
  // if you decide to make it dynamic later.
  // const sec07 = wrap(SEC07_BASELINE) + wrap(SEC07_WHAT_CHANGES);


  // ─── SEC 08: THREE QUESTIONS (static in Writer template) ───
  // Not in a merge field.


  // ─── SEC 09: TEXT FIELD REFLECTION ───
  let sec09 = "";
  if (textField && textField.trim() !== "") {
    sec09 = "<blockquote style='font-family:Georgia,serif;font-size:12pt;color:#1A1A2E;font-style:italic;border-left:3px solid #D4A843;padding-left:16px;margin:16px 0;line-height:1.7;'>"
      + textField
      + "</blockquote>";
    sec09 += wrap(SEC09_CONTEXT);
  }


  // ─── SEC 10: OPEN LOOP ───
  const sec10 = wrap(SEC10[state] || "");


  // ─── RETURN ALL MERGE FIELDS ───
  return {
    sec01_html: sec01,
    sec02_html: sec02,
    sec03_html: sec03,
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
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  try {
    const v = req.body;

    // Validate required fields
    if (!v.coherence_state || !v.gap_type || !v.pattern_dominance) {
      return res.status(400).json({ 
        error: "Missing required fields",
        required: ["coherence_state", "gap_type", "pattern_dominance", 
                   "leader_name", "snapshot_date", "primal_gap",
                   "c01_combo", "c02_combo", "c03_combo", "c04_combo",
                   "c05_combo", "c06_combo", "c07_combo", "c08_combo",
                   "blind_spot_distribution", "text_field_response"]
      });
    }

    const result = assembleReport(v);
    return res.status(200).json(result);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
