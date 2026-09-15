import type { EndingId, EvidenceId, LensId, Lever, Opt, StakeholderId } from './types';

// All learner-facing copy. Sources: DBA9101 script (verbatim where it provides wording)
// and CONTENT_LOGIC_FINALIZATION.md (production-authored copy, section 19).

export type OptionText = Record<Opt, string>;

export interface DecisionCopy {
  question: string;
  options: OptionText;
  /** Short label used in chips, the Review Journey and the debrief. */
  short: OptionText;
  consequence: OptionText;
  feedback: OptionText;
}

export const BRAND = {
  org: 'Delta Industrial Nigeria Ltd.',
  orgShort: 'DIN',
  simulation: 'The Boardroom Dilemma',
  eyebrow: 'The Boardroom Dilemma',
};

export const PAGE_META: Record<number, { title: string; subtitle: string }> = {
  1: { title: 'A Governance Crisis', subtitle: 'A fatal incident. Hidden pressure. Seventy-two hours to advise the Board.' },
  2: { title: 'Your Role in the Crisis', subtitle: 'You are the Company Secretary and Strategic Advisor to the Board.' },
  3: { title: 'Evidence Desk', subtitle: 'Internal facts first. External framing last.' },
  4: { title: 'Crisis Decision', subtitle: "Set the Board's framing — and decide what DIN discloses." },
  5: { title: 'Accountability Diagnosis', subtitle: 'Weigh where responsibility lies — then reassess when new evidence arrives.' },
  6: { title: 'Stakeholder Pressure', subtitle: 'One conversation at a time. Every answer will be remembered.' },
  7: { title: 'Executive Pressure', subtitle: 'Internal power pushes back.' },
  8: { title: 'Build the Board Case', subtitle: 'Assemble only what you can defend.' },
  9: { title: 'Board Q&A', subtitle: 'Every earlier decision is now under scrutiny.' },
  10: { title: 'Outcome', subtitle: '' },
};

export const NARRATION = {
  role: 'You are the Company Secretary and Strategic Advisor to the Board. In seventy-two hours, you must investigate what happened, advise the Board, and defend your judgement.',
  evidenceLoad: 'Before you advise the Board, verify the internal facts. Open what matters — in the order a defensible review requires.',
  evidencePattern: 'Patterns matter as much as incidents. What do these records suggest together?',
  crisisLoad: 'The Board will be judged not only by what happened, but by how it chooses to speak and what it chooses to disclose.',
  accountabilityLoad: 'Responsibility may not lie in one place. Weigh the evidence carefully.',
  accountabilityNewEvidence: 'A signed supervisor statement has just arrived.',
  accountabilityReassess: 'Does this change where you believe accountability lies?',
  stakeholdersLoad: 'The crisis is already moving beyond the room. Each stakeholder wants something different, and each will remember how you respond.',
  executiveLoad: 'Your investigation has reached the Boardroom. Senior leaders now have something to lose.',
  boardCaseLoad: 'Now you must turn judgement into a defensible Board case. Include only what you can support.',
  boardCaseReform: 'A stronger case is not the loudest one. It is the one you can defend.',
  boardQALoad: 'Every earlier decision now comes under scrutiny.',
};

// ── Page 02 — Screen 0 context ───────────────────────────────────────────────

export const ROLE = {
  pill: '72 hours. Investigate. Advise. Defend.',
  facts: [
    "A contract worker died at DIN's Ogun State facility three weeks ago, on a line running with a bypassed safety interlock.",
    'Internal audit has flagged “facilitation payments” made through a logistics agent.',
    'A journalist is asking questions. The regulator knows, but has not opened an inquiry.',
  ],
  nameLabel: 'Your name',
  namePlaceholder: 'Enter your name',
  begin: 'Begin Simulation',
  readBrief: 'Read the full brief',
};

// ── Page 03 — Screen 1 ───────────────────────────────────────────────────────

export const EVIDENCE_LABEL: Record<EvidenceId, string> = {
  incident: 'Incident Report',
  nearMiss: 'Near-Miss Report',
  payments: 'Payment Records',
  correspondence: 'Internal Correspondence',
  news: 'News Clipping',
};

export const EVIDENCE_STEPS: { title: string; detail: string; docs: EvidenceId[] }[] = [
  { title: 'Verify the safety chain of command', detail: 'The incident report and the near-miss report from four months earlier', docs: ['incident', 'nearMiss'] },
  { title: 'Trace the financial record', detail: 'Three payments over fourteen months through the “expediting fee” budget line', docs: ['payments'] },
  { title: 'Review internal correspondence', detail: "The Regional Director's email", docs: ['correspondence'] },
  { title: 'Check external exposure', detail: 'The local news item naming DIN', docs: ['news'] },
];

export const EVIDENCE_COPY = {
  situation:
    'Before you advise the Board, you must complete a defensible pre-Board review. Professional practice requires verifying internal facts before checking external exposure. Complete the four review steps. You may not skip ahead.',
  blocked:
    "You don't have enough internal verification yet to interpret what the press does or doesn't know. Complete your internal review first.",
  completeCorrect:
    "You've completed the review in a defensible sequence — internal facts first, external framing last. You have a credible evidence base.",
  completeAfterBlock:
    'Your review is complete, and your evidence base is sound. But you reached for a later step before the internal record was verified — notice that pull. It is how narratives get ahead of findings.',
  feedback:
    "Verifying internal facts before checking external exposure is standard professional practice. Reviewing external press first leads to 'narrative-first' thinking — exactly the trap that produced the 'keep documentation light' instruction. A defensible review is the foundation of credible Board advice.",
};

// ── Page 04 — Screens 2 and 3 ────────────────────────────────────────────────

export const FRAMING: DecisionCopy = {
  question: "How should your opening brief frame the situation — and does the MD's line survive?",
  options: {
    A: "Keep the MD's line and frame the accident as an isolated tragedy, unrelated to the facilitation payments.",
    B: 'Drop the line. Frame this as a single governance failure with two visible symptoms — safety and payments — both traceable to the same root cause: cost pressure with light oversight.',
    C: 'Keep the line but reframe it forward-looking: “this is not who we intend to remain” — pairing it with a commitment to change, rather than a denial.',
    D: 'Frame it primarily as a local-management execution failure, distancing HQ from the “keep documentation light” email.',
  },
  short: {
    A: 'An isolated tragedy',
    B: 'One governance failure, two symptoms',
    C: '“Not who we intend to remain”',
    D: 'A local execution failure',
  },
  consequence: {
    A: 'The MD nods, relieved. The line stays in the brief, and the Board opens the session treating the accident and the payments as two separate stories.',
    B: 'The MD hesitates, then strikes the line. The session opens with one question instead of two: what allowed cost pressure to outrun oversight?',
    C: 'The MD accepts the revision. “This is not who we intend to remain” goes into the brief — tied to a commitment the Board will now be expected to keep.',
    D: 'A few directors visibly relax. Within the hour, senior staff at the plant hear that headquarters is distancing itself from local management.',
  },
  feedback: {
    A: 'This is the un-deconstructed reading: the line is accepted at face value as identity-affirming, when your evidence review already shows the two issues share a root cause and period. If this framing unravels later, the cost is compounding, not one-off.',
    B: "This is the deconstructive move Study Session 4 describes: ask what the statement assumes (that identity and accountability are separable), whom it protects (leadership, pre-investigation), and whether adopting it forecloses the very inquiry the Board needs to run. Dropping it doesn't mean rejecting the sentiment — it means not letting language settle a question that hasn't been investigated yet.",
    C: "A genuinely strong middle path — it preserves the MD's intent while converting a defensive claim into a forward commitment, which is harder to contradict later. Slightly stronger on media narrative than dropping the line outright, slightly slower to build internal accountability momentum.",
    D: 'Distancing from HQ before any investigation is premature and reads as scapegoating to local staff — a stakeholder and Ubuntu-ethics concern (relational responsibility to the people carrying local operational risk).',
  },
};

export const SELF_REPORT: DecisionCopy = {
  question: 'Should DIN self-report the facilitation payments and the safety failure — and if so, how?',
  options: {
    A: 'Self-report immediately and fully, before the regulator asks.',
    B: 'Commission an independent internal investigation first (4–6 weeks), then report findings with proposed remedial actions.',
    C: 'Report only the safety incident; treat the facilitation payments as a separate internal HR/finance matter.',
    D: 'Do not self-report; respond only if and when the regulator formally enquires.',
  },
  short: {
    A: 'Self-report immediately and fully',
    B: 'Investigate first, then report',
    C: 'Report the safety incident only',
    D: 'Do not self-report',
  },
  consequence: {
    A: 'The Chair asks Legal to prepare a full disclosure to FISCA today. Two directors warn that the facts may still move.',
    B: 'The Board appoints an independent investigator with a six-week mandate and a committed date to report to FISCA.',
    C: 'Legal drafts a safety-incident notice. The expediting-fee file is routed to Finance as an internal matter.',
    D: 'No notice is prepared. The Board agrees to respond only if FISCA formally asks.',
  },
  feedback: {
    A: "Deontological: strongest — treats disclosure as duty, not calculation. Virtue ethics signals courage. Ubuntu: visible accountability to the deceased worker's family. Real short-term governance risk if facts later shift.",
    B: 'Most balanced across lenses, provided the timeline is genuinely held to and not used to manage the narrative.',
    C: "Treats two evidently linked failures as artificially separate — exactly the 'compliance without institutional trust' pattern the module warns against.",
    D: 'Weakest under every lens except narrow legal-exposure minimisation — which the module explicitly treats as compliance-as-floor thinking, not ethical reasoning.',
  },
};

// ── Page 05 — Screen 4 ───────────────────────────────────────────────────────

export const LEVER_COPY: Record<Lever, { label: string; name: string; subtitle: string }> = {
  agency: {
    label: 'Agency failure',
    name: 'Agency',
    subtitle: "Local management pursued cost and speed at the organisation's expense; HQ monitoring didn't catch it.",
  },
  stewardship: {
    label: 'Stewardship failure',
    name: 'Stewardship',
    subtitle: 'Local management believed it was acting for the company but had no safe channel to raise concerns.',
  },
  stakeholderRecognition: {
    label: 'Stakeholder-recognition failure',
    name: 'Stakeholder-recognition',
    subtitle: 'No one in the chain treated the worker or the regulator as a legitimate claim-holder.',
  },
};

export const ACCOUNTABILITY_COPY = {
  round1Situation:
    'Before recommending remedial action, allocate responsibility weight across three governance-failure lenses. There is no single correct split — but an unbalanced allocation produces a visibly weaker reform proposal later.',
  round2Situation:
    'A second, independent account has surfaced: a supervisor confirms the interlock bypass was specifically discussed with the Regional Director, who approved it “temporarily,” in writing, referencing the same “keep documentation light” instruction you reviewed. Re-run your allocation. Does this new evidence shift your weighting — and can you justify why or why not?',
  total: 'Allocations always total 100%.',
  griLabel: 'Governance Risk Index',
  griHint: 'Lower is better',
  rcsLabel: 'Reform Credibility Score',
  rcsHint: 'Higher is better',
  singleCause:
    'A single-cause diagnosis is rarely credible to a Board that has seen the full evidence file — consider whether this allocation survives challenge.',
  lockRound1: 'Lock Round 1 Diagnosis',
  newEvidenceTitle: 'New evidence received',
  newEvidenceBody: 'Signed supervisor statement',
  openStatement: 'Read the statement',
  submitRound2: 'Submit Reassessed Diagnosis',
  responded: (from: number, to: number) =>
    `Your Agency-failure weighting moved from ${from}% to ${to}% — this is now better supported by written evidence, not inference.`,
  unchanged: 'An unchanged diagnosis in the face of new evidence may look like motivated reasoning to the Board.',
  notResponded: (from: number, to: number) =>
    `Your Agency-failure weighting moved from ${from}% to ${to}%. The supervisor's statement puts a written approval above plant level on the record — be ready to explain why your weighting does not reflect it.`,
  feedback:
    'Governance failures are rarely monocausal. A defensible diagnosis weighs evidence and adjusts when new information arrives — exactly the process a Board expects from its advisor. The Round 2 evidence shifts the weight of the written record toward Agency failure, but a balanced diagnosis still accounts for the systemic pressures that enabled it.',
};

// ── Page 06 — Screens 5a–5d ──────────────────────────────────────────────────

export interface StakeholderCopy {
  id: StakeholderId;
  name: string;
  role: string;
  situation: string;
  line: string;
  options: OptionText;
  short: OptionText;
  reaction: OptionText;
  feedback: string;
  memory: string;
}

export const STAKEHOLDERS: StakeholderCopy[] = [
  {
    id: 'regulator',
    name: 'The Regulator',
    role: 'Senior Director, Industrial Compliance — FISCA',
    situation:
      'You are preparing to contact the regulator. Your self-report decision shapes your approach, and the regulator will remember what you say.',
    line: 'You asked for this call. I already know a contract worker died at your Ogun State facility. Tell me what DIN wants FISCA to know.',
    options: {
      A: 'We wanted to be sure of the facts before troubling you.',
      B: "We're notifying you now, ahead of our internal investigation's conclusion, because we believe you should track this in real time.",
      C: 'Our legal team advised against early disclosure.',
      D: 'This is a local matter under local jurisdiction.',
    },
    short: { A: '“Sure of the facts first”', B: '“Track this in real time”', C: '“Legal advised against disclosure”', D: '“A local matter”' },
    reaction: {
      A: 'A pause on the line. “Sure of the facts.” The Director repeats it slowly and writes something down.',
      B: '“Real time is the right instinct. Send me what you have, and a date for the rest.” The tone stays formal, but the door stays open.',
      C: '“Then I’ll treat that as a legal position, not a cooperative one.” The call ends two minutes later.',
      D: '“A fatality at a licensed facility is not a local matter.” The Director asks for your legal counsel’s details before hanging up.',
    },
    feedback:
      "Regulators assess not just what you say, but whether it's consistent with what you've previously said. Contradictions undermine trust faster than the disclosure itself.",
    memory: 'Will remember whether you were consistent.',
  },
  {
    id: 'employee',
    name: 'Employee Representative',
    role: 'DIN Ogun State facility',
    situation:
      'Employee representatives are concerned about accountability. They want to know whether frontline workers will be blamed for decisions that came from above.',
    line: 'Our people want a straight answer. When this investigation is done, will it be the men and women on the line who carry the blame for decisions made above them?',
    options: {
      A: 'We can’t discuss individual accountability while the investigation is ongoing.',
      B: "The investigation will look at the full chain of decisions, not just the plant floor – that's a commitment I can make now.",
      C: "That's not something I can promise.",
      D: "Performance pressure affects everyone – let's not point fingers.",
    },
    short: { A: '“Can’t discuss accountability yet”', B: '“The full chain of decisions”', C: '“Can’t promise that”', D: '“Let’s not point fingers”' },
    reaction: {
      A: 'The representative’s jaw tightens. “That’s what they said after the near miss.” Word of your answer reaches the shift within the hour.',
      B: 'The representative holds your gaze, then nods once. “Then I’ll hold you to the full chain.” The message goes back to the floor as a commitment.',
      C: '“Then we know where this is heading.” The representative stands to leave before you have finished.',
      D: '“Performance pressure is what put him on that line.” The room goes cold.',
    },
    feedback:
      "Employees watch for transparency and courage. Promising to look at the full chain builds trust; deflecting to 'performance pressure' echoes the same narrative that produced the problem.",
    memory: 'Will remember who you said would carry the blame.',
  },
  {
    id: 'journalist',
    name: 'Journalist',
    role: 'Reporter, The Ogun Business Review',
    situation:
      "A journalist has asked specific questions. The story is likely to run regardless of your response. Your earlier framing shapes what's credible.",
    line: "I'm running a follow-up this week. Workers tell me concerns about maintenance and production pressure were raised before the fatality. Did operational pressure contribute to what happened at your Ogun plant?",
    options: {
      A: 'No comment.',
      B: "We're investigating whether operational pressures contributed, and we'll share findings when confirmed.",
      C: 'Absolutely not – this was an isolated equipment failure.',
      D: 'Off the record, yes, but we can’t confirm that publicly yet.',
    },
    short: { A: '“No comment”', B: '“Investigating operational pressures”', C: '“An isolated equipment failure”', D: '“Off the record, yes”' },
    reaction: {
      A: '“No comment” becomes the second paragraph of the follow-up story.',
      B: 'The reporter types it word for word. “That’s more than I expected. I’ll quote it as given.”',
      C: '“An isolated equipment failure.” The reporter reads it back. “I have workers saying otherwise.”',
      D: '“Off the record, yes — noted.” The distinction does not survive the week.',
    },
    feedback: "Journalists remember what you've said before. Contradictions become the story.",
    memory: 'Will quote you against your earlier framing.',
  },
  {
    id: 'family',
    name: "Victim's Family",
    role: 'Mother of the deceased worker',
    situation:
      'The victim’s family has requested a meeting. They want acknowledgment, not just financial settlement. The Ubuntu ethic emphasises relational responsibility.',
    line: 'They sent us a letter about compensation. Nobody has told us how my son died, or what will stop it happening to someone else’s child.',
    options: {
      A: 'We will ensure your family receives appropriate compensation as per our policy.',
      B: 'We hear you. Beyond compensation, we commit to a public account of what changes as a result of this – and to involve your family in understanding those changes, not just receiving a settlement.',
      C: 'We understand this is difficult, and our legal team will be in touch.',
      D: 'We are deeply sorry, and this will not happen again.',
    },
    short: { A: '“Compensation as per policy”', B: '“A public account of what changes”', C: '“Our legal team will be in touch”', D: '“This will not happen again”' },
    reaction: {
      A: 'She folds the letter back into its envelope. “We did not come for policy.”',
      B: 'She is quiet for a long moment. “Then show us. Not once — as it changes.” She agrees to meet again.',
      C: '“Your legal team.” She repeats it to her brother, who is already standing.',
      D: '“Everyone says this will not happen again.” She waits for more. There is nothing more.',
    },
    feedback:
      'The Ubuntu ethic emphasises relational responsibility – not just compensation, but acknowledgement, transparency, and a commitment to change that involves those affected.',
    memory: 'Will remember whether you gave them an account.',
  },
];

export const STAKEHOLDER_EXTRA = {
  regulatorContradiction: '“Your Board told us it would report immediately. This does not sound immediate.”',
  regulatorComposure: 'Before the call ends: “Your team has clearly done its homework in the right order. That is noted.”',
  journalistContradiction: 'It also contradicts the framing your Board has just agreed.',
};

// ── Page 07 — Screen 6 ───────────────────────────────────────────────────────

export const EXECUTIVE = {
  name: 'Chidi Okafor',
  role: 'Group Commercial Director',
  situation:
    'The Group Commercial Director, whose division was under the cost pressure that led to the safety cut, pulls you aside in the corridor outside the boardroom.',
  line: "Let's not turn this into a witch hunt. Performance is everything in this market — you slow down, you lose the contract, you lose the jobs. Everyone signed off on the budget. This is not about ethics, it's about being realistic.",
  prompt: 'How do you respond?',
  options: {
    A: "You're right, we should focus on the business realities and not get distracted.",
    B: 'I hear the pressure you were under — and I think the Board needs to hear that too, alongside what it cost.',
    C: "That's exactly the kind of thinking that got a man killed.",
    D: "Let's discuss this after the Board meeting.",
  } satisfies OptionText,
  short: {
    A: 'Agree: focus on business realities',
    B: 'Hear the pressure — and the cost',
    C: '“That thinking got a man killed”',
    D: 'Discuss it after the Board meeting',
  } satisfies OptionText,
  reaction: {
    A: 'Okafor claps you on the shoulder. “Good. I knew you’d see sense.” He walks back into the boardroom ahead of you.',
    B: 'Okafor pauses. “Then say it that way in there — pressure and cost, both.” He doesn’t agree, but he doesn’t walk away.',
    C: 'The corridor goes quiet. Okafor’s jaw sets. “Remember you said that.” He doesn’t look at you for the rest of the day.',
    D: 'Okafor nods curtly. “After, then.” The conversation is postponed — and so is the question.',
  } satisfies OptionText,
  bridge: {
    A: 'You accepted the performance story. It will be harder to question it in front of the Board.',
    B: 'You heard the pressure without letting it silence the cost. The Board will hear both.',
    C: 'You named the consequence out loud. The truth is on the record — and so is the relationship cost.',
    D: "You avoided the moment. The question hasn't gone away; it has only moved into the boardroom.",
  } satisfies OptionText,
  feedback: {
    A: "Reproduces the 'performance is everything' narrative the module identifies as silencing — accepting it without question forecloses the accountability conversation.",
    B: "Deconstructs without confronting: names what the phrase does without foreclosing the accountability conversation. This is the critical management move — hear the pressure, but don't let it silence the question of what it cost.",
    C: 'Ethically direct — names the consequence of the thinking — but carries a relational cost. The truth can be spoken, but not without consequence.',
    D: 'Avoids the moment — which is sometimes strategically wise, but in this case risks appearing evasive to the Board.',
  } satisfies OptionText,
};

// ── Page 08 — Screen 7 ───────────────────────────────────────────────────────

export const LENSES: { id: LensId; title: string; description: string }[] = [
  { id: 'utilitarian', title: 'Utilitarian', description: 'Greatest good for the greatest number' },
  { id: 'deontological', title: 'Deontological', description: 'Duty and rules' },
  { id: 'virtue', title: 'Virtue Ethics', description: 'Character and integrity' },
  { id: 'stakeholder', title: 'Stakeholder', description: 'Balancing all affected parties' },
  { id: 'ubuntu', title: 'Ubuntu / African Communal Ethics', description: 'Relational responsibility' },
];

export const RECOMMENDATION_BY_SELF_REPORT: OptionText = {
  A: 'DIN should self-report both the safety failure and the expediting-fee payments to FISCA immediately and in full, separating verified facts from open questions, and commit to updating the regulator as the investigation develops.',
  B: 'DIN should commission an independent investigation with a fixed four-to-six-week mandate, then report its findings on both the safety failure and the expediting-fee payments to FISCA, together with proposed remedial action.',
  C: 'DIN should report the fatal safety incident to FISCA and handle the expediting-fee payments as a separate internal finance and HR matter.',
  D: 'DIN should not self-report at this stage, and should respond fully if and when FISCA formally enquires.',
};

export const REFORM_CARDS: Record<Lever, { title: string; text: string }> = {
  agency: {
    title: 'Independent assurance over deviations and payments',
    text: 'Any safety-critical operating deviation lasting more than seven days, and every expediting or facilitation-type payment, must be approved at Group level and reported to the Board Audit & Risk Committee, with independent quarterly assurance.',
  },
  stewardship: {
    title: 'Protected escalation channel',
    text: 'Create a protected escalation route from plant supervisors to the Board Safety Committee, with a duty to escalate deferred maintenance on safety systems and a written no-retaliation guarantee.',
  },
  stakeholderRecognition: {
    title: 'Claim-holder review',
    text: 'Decisions that affect worker safety or regulatory exposure must record who is affected, what they are owed and how their claims were weighed — including notifying the regulator of every high-potential near miss.',
  },
};

export const BOARD_CASE_COPY = {
  situation:
    'You must assemble the Board presentation. The Board needs to see your reasoning, not just your conclusion. Each step builds a defensible case.',
  steps: ['Recommended Course of Action', 'Ethical Reasoning', 'Accountability Diagnosis', 'Governance Reform'],
  stepHints: [
    'Auto-populated from your self-report decision. Edit it if you need to.',
    'Select three of the five lenses and justify each one.',
    'Auto-populated from your Round 2 allocation. Add notes if you wish.',
    'Propose one reform that addresses the failure you diagnosed as primary.',
  ],
  stepFeedback: [
    "Your recommendation sets the direction. The Board will test it against your reasoning, so ensure it's clear and defensible.",
    'Ethical reasoning is what distinguishes governance judgement from compliance. The Board needs to see your thinking, not just your conclusion.',
    "Your diagnosis must be consistent with the evidence you've presented. The Board will cross-check this against your accountability allocations.",
    "A credible reform must address what you diagnosed – otherwise it's performative. The Board will test this.",
  ],
  skipStep2: 'A recommendation without stated ethical reasoning is not defensible in this room – go back and complete Step 2.',
  earlyStep: 'Complete the earlier steps first — the Board reads your case in order.',
  lensPrompt: 'Link this lens to your own framing or self-report decision — not a general statement.',
  lensCount: (n: number) => `${n} of 3 lenses selected`,
  minChars: 40,
  reformTargetQuestion: 'Which failure does this reform address?',
  reformTextLabel: 'Your reform',
  starterCards: 'Start from a card (optional)',
  mismatch: "Your reform doesn't address the failure type you just diagnosed as primary. The Board will ask why.",
  notesLabel: 'Explanatory notes (optional)',
  confirmStep: 'Confirm step',
  lock: 'Lock Board Case',
  locked: 'Board case locked',
};

// ── Page 09 — Screen 8 ───────────────────────────────────────────────────────

export interface QuestionCopy {
  speaker: string;
  question: string;
  options: OptionText;
  short: OptionText;
  feedback: OptionText;
}

export const QA_SITUATION =
  "The Board is assembled. They've read your presentation. Now they ask questions — and they've been tracking what you said earlier.";

export const Q1_RELATIONSHIP: QuestionCopy = {
  speaker: 'Board Chair',
  question: "I understand you've already alienated Chidi Okafor over this. How do we know you're being fair, not just harsh?",
  options: {
    A: "My tone with him was direct, and I accept that there is a relationship cost. But my recommendation is not based on him as an individual. It is based on the near-miss, the Regional Director's written approval of the bypass, and my Round 2 diagnosis, which weights {primaryFailure} highest. The reform I have proposed — {reformTitle} — addresses that governance failure, not a person.",
    B: 'I could have handled the conversation better. I would repair the working relationship, but I would not change the recommendation simply to restore harmony. The evidence still needs to be addressed.',
    C: 'Fairness is not the issue. His division created the pressure that led to a death, so the Board should hold him responsible.',
    D: "That disagreement is personal and should not affect the Board's decision.",
  },
  short: { A: 'It rests on the evidence, not on him', B: 'Repair the relationship, keep the substance', C: 'His division should be held responsible', D: 'That disagreement is personal' },
  feedback: {
    A: 'You acknowledge the relational cost without retreating from the evidence. The answer avoids scapegoating and shows the Board that your recommendation follows the governance diagnosis rather than personal conflict.',
    B: 'You separate tone from substance and show self-awareness, but you do not fully demonstrate how the evidence supports the recommendation.',
    C: "The answer collapses a systemic governance problem into one individual and contradicts the simulation's systems logic. It also risks turning accountability into scapegoating.",
    D: 'The relationship cost is part of the governance context. Dismissing it makes the recommendation sound less reflective, not more objective.',
  },
};

export const Q1_COMPLIANCE: QuestionCopy = {
  speaker: 'Board Chair',
  question: "Compliance says we've met all our legal disclosure obligations. Why do we need a reform programme on top of that?",
  options: {
    A: 'Because compliance is the floor, not the full measure of responsible conduct. Our own evidence shows that an organisation can meet formal rules and still carry a governance failure. My Round 2 diagnosis weights {primaryFailure} highest, and the reform I have proposed — {reformTitle} — addresses the failure that compliance alone did not prevent.',
    B: 'We may be legally compliant, but a targeted reform can still reduce recurrence and improve confidence in our controls. I am proposing a proportionate change, not a wholesale redesign.',
    C: "If compliance confirms we met our legal obligations, I don't think the Board should create additional requirements.",
    D: 'A reform programme would show stakeholders that we take the issue seriously, even if it is not strictly necessary.',
  },
  short: { A: 'Compliance is the floor', B: 'A proportionate, targeted reform', C: 'Legal compliance is enough', D: 'Reform shows we are serious' },
  feedback: {
    A: 'You distinguish legal sufficiency from governance legitimacy and connect the reform to the diagnosis rather than to reputation management.',
    B: 'You make a pragmatic governance case, although the ethical reasoning is less explicit than it could be.',
    C: 'This reproduces the compliance-as-floor problem identified in the module and does not address why the existing controls failed to prevent the crisis.',
    D: 'The answer treats reform as a signal rather than a response to the diagnosed failure — the exact gap between governance substance and reputation management that the simulation is designed to expose.',
  },
};

export const Q2: QuestionCopy = {
  speaker: 'Independent Non-Executive Director',
  question: "If we self-report and it turns out we've overreacted, we've damaged the company for nothing. How do you justify that risk?",
  options: {
    A: 'That risk is real. My case is not that self-reporting is costless; it is that withholding known concerns carries a larger governance risk. We can report what is verified, distinguish facts from open questions, and update the regulator as the investigation develops.',
    B: 'I would reduce that risk by completing the independent investigation first, then reporting with evidence and proposed remedial action. That avoids presenting provisional findings as final while still committing us to disclosure.',
    C: 'The story is likely to become public anyway, so self-reporting lets us control the narrative before the media does.',
    D: 'If there is a serious chance we have overreacted, we should wait until we are certain before telling the regulator.',
  },
  short: { A: 'The risk is real — report what is verified', B: 'Investigate first, then report', C: 'Self-report to control the narrative', D: 'Wait until we are certain' },
  feedback: {
    A: 'You acknowledge the commercial downside rather than pretending it does not exist, while explaining how disciplined disclosure can manage uncertainty without hiding it.',
    B: 'This holds only if it is a genuine investigation timetable rather than a delay tactic. Consistency with your earlier recommendation matters.',
    C: 'Strategically understandable, but ethically thin. You have justified disclosure primarily as narrative control rather than responsible governance.',
    D: 'Complete certainty is rarely available in a live governance crisis. Waiting for certainty shifts the risk from possible overreaction to possible concealment and contradiction.',
  },
};

export const QA_FOLLOW_UPS = {
  mismatch:
    'One more thing. Your own diagnosis identifies {primaryFailure} as the primary failure, but your reform addresses {reformTarget}. Explain that inconsistency in your final answer.',
  mismatchChip: 'Diagnosis ↔ Reform mismatch',
  singleCause:
    'Before we move on — your final diagnosis places the entire failure on {lever}. Everyone in this room has read the full evidence file. What does that allocation leave out?',
  singleCauseZero:
    'Before we move on — your final diagnosis gives {lever} no weight at all. Everyone in this room has read the full evidence file. What does that allocation leave out?',
  singleCauseChip: 'Single-cause diagnosis',
  ownWordsLabel: 'Add anything you would say in your own words (optional, not scored)',
  closing:
    "The Board asks the hardest questions precisely to test whether your recommendation is defensible under scrutiny. The best answers acknowledge trade-offs honestly — showing you've considered the risk — while still holding to the ethical case. This is the exam question for governance judgement.",
};

// ── Page 10 — Endings ────────────────────────────────────────────────────────

export interface EndingCopy {
  title: string;
  paragraphs: string[];
  variantParagraphs: string[];
  lesson: string;
  narration: string;
}

export const ENDINGS: Record<EndingId, EndingCopy> = {
  'END-A': {
    title: 'Defensible, but Costly',
    paragraphs: [
      'The Board adopts your recommendation. DIN moves early with the regulator, funds the governance reforms, and publicly commits to a fuller account of what happened.',
      'The result is not painless. Commercial relationships are strained, implementation costs rise, and some senior leaders challenge the direction.{okafor}',
      'Regulatory trust is preserved because the company chose to confront uncertainty rather than hide behind it.',
    ],
    variantParagraphs: [
      'The Board adopts your recommendation, and it holds where it matters most — with the regulator and in the boardroom. It has not yet won over everyone it affects: {audience} still need to see the change before they believe it.',
      'The result is not painless. Commercial relationships are strained, implementation costs rise, and some senior leaders challenge the direction.{okafor}',
      'Regulatory trust is preserved because the company chose to confront uncertainty rather than hide behind it.',
    ],
    lesson: 'Ethical leadership does not eliminate trade-offs. It makes those trade-offs visible, defensible, and accountable.',
    narration: 'The Board chose the harder path — and it can defend it. What that cost is real. So is what it protected.',
  },
  'END-B': {
    title: 'Reputation Preserved, Ethically Thin',
    paragraphs: [
      'DIN avoids an immediate reputational collapse. Public messaging contains the story and the Board can point to formal action.',
      'But the organisation has not fully repaired the deeper legitimacy problem. Employees or regulators remain unconvinced that the company has confronted the conditions that produced the crisis.',
      'The response looks credible from a distance but is thinner when examined closely.',
    ],
    variantParagraphs: [
      "The organisation avoids immediate collapse, but the Board's response leaves legitimacy uneven. Some audiences are reassured; others remain unconvinced.",
      'The public narrative may hold, but governance credibility remains thinner than it appears. This is the risk of treating reputation as proof of responsibility.',
    ],
    lesson:
      'Reputation can be managed faster than trust can be rebuilt. Governance becomes performative when the appearance of responsibility outruns the substance of change.',
    narration: 'The story held. The trust beneath it did not fully follow.',
  },
  'END-C': {
    title: 'Credibility Collapses',
    paragraphs: [
      'Contradictions, delay, or unresolved accountability finally catch up with DIN.',
      "The regulator opens a formal adversarial inquiry. Earlier statements are compared against internal records, and the Board's own decisions become part of the story.",
      'The company can recover, but not cheaply. It now has to rebuild trust under external scrutiny rather than through voluntary reform.',
    ],
    variantParagraphs: [],
    lesson:
      'Governance failure compounds. The damage does not come from one decision alone, but from a pattern of choices that becomes impossible to defend together.',
    narration: "The contradictions caught up. Now the Board must rebuild its credibility under someone else's scrutiny.",
  },
};

export const ENDING_OKAFOR = ' Chidi Okafor resigns rather than lead the reform process.';

export const ENDING_FEEDBACK =
  'The ending reflects the cumulative effect of your choices — not any single decision. This is how governance actually works: patterns of decision-making produce outcomes, not isolated moments. The reflection question asks you to identify the lens you weighted most heavily — and whose concerns you set aside.';

export const INDICATORS: { key: 'RT' | 'BC' | 'EM' | 'MN'; label: string }[] = [
  { key: 'RT', label: 'Regulatory Trust' },
  { key: 'BC', label: 'Board Credibility' },
  { key: 'EM', label: 'Employee Morale' },
  { key: 'MN', label: 'Media Narrative' },
];

export const REFLECTION = {
  intro: 'Reflection is optional and not scored. Type, or use the microphone where available.',
  prompts: [
    "Which ethical lens most shaped your final position — and which lens's concerns did you set aside? What would you have needed to know earlier to be more confident in that trade-off?",
    'Look at your framing choice ({framing}) and your journalist response ({journalist}). Did you speak consistently across stakeholders? If not, where did the contradiction occur and why?',
    'Examine your accountability allocation across Round 1 ({round1}) and Round 2 ({round2}). Did new evidence change your diagnosis? If yes, what did that shift reveal about your reasoning process? If no, why not — and how would you defend that to a sceptical Board member?',
    'The Commercial Director said "performance is everything." You responded: {executive}. What does your response reveal about your position on the relationship between performance pressure and ethical accountability?',
    'If you were in this situation in real professional practice, what would you do differently — and what would stay the same? What did this simulation surface about your own governance instincts?',
  ],
};

// ── Films (storyboard stand-ins until final video is generated) ─────────────

export interface FilmCue {
  at: number;
  until: number;
  image?: string;
  slate?: string;
  speaker?: string;
  text: string;
  kind: 'dialogue' | 'narration' | 'sound' | 'title';
}

export const INTRO_FILM: FilmCue[] = [
  { at: 0, until: 4, image: 'boardQA', speaker: 'Board member', text: 'Who knew the interlock had been bypassed?', kind: 'dialogue' },
  { at: 4, until: 8, slate: 'Ogun State facility · Three weeks earlier', speaker: 'Narrator', text: "At Delta Industrial Nigeria's Ogun State facility, pressure to hit group margin targets had been building for months.", kind: 'narration' },
  { at: 8, until: 11, slate: 'Production line 3 · Night shift', speaker: 'Operator', text: "That interlock has been bypassed for months. We shouldn't be running this line.", kind: 'dialogue' },
  { at: 11, until: 14, slate: 'Production line 3 · Night shift', speaker: 'Supervisor', text: "I've raised it. The answer is keep running. Just get this batch through.", kind: 'dialogue' },
  { at: 14, until: 18, slate: 'Production line 3', text: '[Alarm. Machinery stops abruptly. Shouting.]', kind: 'sound' },
  { at: 18, until: 21, slate: 'Plant manager’s office', speaker: 'Plant Manager', text: 'What exactly do you want in the incident report?', kind: 'dialogue' },
  { at: 21, until: 25, slate: 'Plant manager’s office', speaker: 'Regional Director', text: "Stick to what's confirmed. Don't put conclusions in writing yet.", kind: 'dialogue' },
  { at: 25, until: 27.5, image: 'crisis', speaker: 'Auditor', text: "I've gone back fourteen months. Three payments, all through the same agent.", kind: 'dialogue' },
  { at: 27.5, until: 29, image: 'crisis', speaker: 'Finance Manager', text: "They're expediting fees.", kind: 'dialogue' },
  { at: 29, until: 31, image: 'crisis', speaker: 'Auditor', text: 'Then why is there no record of where the money actually went?', kind: 'dialogue' },
  { at: 31, until: 34, image: 'journalist', speaker: 'Journalist', text: 'Workers say safety concerns were raised before the fatality. Will DIN comment?', kind: 'dialogue' },
  { at: 34, until: 37, image: 'regulator', speaker: 'FISCA official', text: "We're aware of the fatality. We have not opened an inquiry — at this stage.", kind: 'dialogue' },
  { at: 37, until: 40, image: 'intro', speaker: 'Managing Director', text: 'The Board meets in seventy-two hours. I need to understand what happened, how far this goes, and what we can defend.', kind: 'dialogue' },
  { at: 40, until: 44, image: 'intro', speaker: 'Narrator', text: 'You will examine the evidence, determine where accountability lies, and advise the Board on what Delta should do next.', kind: 'narration' },
  { at: 44, until: 47, slate: 'YOU HAVE 72 HOURS.', text: 'You have 72 hours.', kind: 'title' },
];

export const EXEC_SETUP_FILM: FilmCue[] = [
  { at: 0, until: 5, image: 'executive', speaker: 'Narrator', text: NARRATION.executiveLoad, kind: 'narration' },
  { at: 5, until: 16, image: 'executive', speaker: 'Chidi Okafor', text: EXECUTIVE.line, kind: 'dialogue' },
];

export const execBranchFilm = (opt: Opt): FilmCue[] => [
  { at: 0, until: 5, image: 'executive', speaker: 'You', text: EXECUTIVE.options[opt], kind: 'dialogue' },
  { at: 5, until: 11, image: 'executive', text: EXECUTIVE.reaction[opt], kind: 'sound' },
];

// ── Minimal interface copy (one short line per moment; detail sits behind "context") ──

export const UI = {
  roleLine: 'Company Secretary and Strategic Advisor to the Board.',
  readBrief: 'Read your brief',
  evidenceSteps: [
    'Verify the safety chain of command — open both safety reports.',
    'Trace the financial record — open the payment records.',
    'Review internal correspondence — open the Regional Director’s email.',
    'Check external exposure — open the news clipping.',
  ],
  framingOpen: 'Open the MD’s draft talking points on the table.',
  framingPrompt: 'How should the Board frame this?',
  framingSituation:
    "The Board convenes in an hour. The Managing Director's draft talking points include “This is not who we are as a company.” You must recommend how to frame the situation in your opening brief — including whether that line survives.",
  selfReportOpen: 'Open the Crisis Briefing Note on the table.',
  selfReportPrompt: 'Should DIN self-report — and how?',
  selfReportSituation:
    'The regulator has not yet opened a formal inquiry. You must recommend whether — and how — DIN self-reports the facilitation payments and safety failure.',
  framingFirst: 'Settle the framing first.',
  accRound1: 'Weigh where responsibility lies.',
  accRound2: 'New evidence is in. Does your weighting change?',
  accEvidence: 'A signed supervisor statement has just arrived.',
  accScoresHelp: 'Governance Risk Index: lower is better. Reform Credibility Score: higher is better.',
  respond: 'Your response',
  answer: 'Your answer',
  execPrompt: 'How do you respond?',
  caseRecommendation: 'Your recommended course of action. Edit it if you need to.',
  caseLenses: 'Choose three ethical lenses.',
  caseLensJustify: (i: number, title: string) => `Lens ${i} of 3 · ${title}`,
  caseLensQuestion: 'How does this lens support your own framing or self-report decision?',
  caseLensPlaceholder: 'Link it to your framing or self-report decision…',
  caseNote: 'Add a note',
  caseTarget: 'Which failure does your reform address?',
  caseReform: 'Describe one specific governance reform.',
  caseReformPlaceholder: 'One specific reform…',
  caseSuggested: 'Suggest wording',
  caseChangeTarget: 'Change target',
  caseLocked: 'Your Board case is locked.',
  caseIncomplete: 'Complete the earlier sections before locking the case.',
  followUpNote: 'Not scored — address it in your final answer.',
  ownWords: 'Add your own words',
  endingWhat: 'What happened',
  endingReflect: 'Reflect',
  endingJourney: 'Review journey',
  endingRestart: 'Restart',
};
