import type { EvidenceId } from './types';

// Guided-experience copy: chapter cards between pages, the task line on each page, the opening
// briefing and short evidence hints. Production-authored (not in the DBA9101 script) — for SME review.

export interface Chapter {
  hoursLeft: number;
  title: string;
  /** One narrated line linking what the player just did to what comes next. */
  bridge: string;
  /** Major transitions open with the DBA logo animation before the chapter text. */
  sting?: boolean;
}

export const CHAPTERS: Record<number, Chapter> = {
  2: { hoursLeft: 72, title: 'Your Role', bridge: 'Before the Board meets, you need to understand your place in this story.' },
  3: { hoursLeft: 70, title: 'The Evidence Desk', bridge: 'Every defensible answer starts in the same place: with the record.', sting: true },
  4: { hoursLeft: 64, title: 'The Crisis Decision', bridge: 'You know what the records show. Now the Board needs a position.' },
  5: { hoursLeft: 52, title: 'Accountability', bridge: 'A position is not a diagnosis. Where does responsibility really lie?' },
  6: { hoursLeft: 40, title: 'Stakeholder Pressure', bridge: 'Outside the boardroom, people are already asking questions.', sting: true },
  7: { hoursLeft: 28, title: 'Executive Pressure', bridge: 'Inside the company, someone powerful would rather this went away.' },
  8: { hoursLeft: 14, title: 'The Board Case', bridge: 'Everything you have decided now has to become one case you can defend.' },
  9: { hoursLeft: 2, title: 'Facing the Board', bridge: 'The Board is seated. Every choice you made is on the table.', sting: true },
  10: { hoursLeft: 0, title: "The Board's Decision", bridge: 'The Board has heard you. This is what your decisions set in motion.', sting: true },
};

/** The single "what am I doing here" line typed under each page title. */
export const OBJECTIVES: Record<number, string> = {
  1: 'Watch how the crisis began. Then it becomes yours.',
  3: 'Your task: open the evidence in the order a defensible review requires.',
  4: "Your task: read each document, then set the Board's position and what DIN discloses.",
  5: 'Your task: weigh responsibility across three failures, then reassess when new evidence arrives.',
  6: 'Your task: answer four stakeholders. Each will remember what you promise.',
  7: 'Your task: decide how to answer the Group Commercial Director.',
  8: 'Your task: build the four sections of your Board case, then lock it.',
  9: "Your task: answer the Board's questions in your own words, then with the reasoning closest to them.",
  10: "See how the Board's decision played out, then review the journey that led here.",
};

/** The mission map: every stage of the 72 hours, shown in the briefing and from the progress bar. */
export const MISSION: { page: number; title: string; text: string }[] = [
  { page: 3, title: 'Evidence Desk', text: 'Verify the record before anything else.' },
  { page: 4, title: 'Crisis Decision', text: "Set the Board's position and what DIN discloses." },
  { page: 5, title: 'Accountability', text: 'Diagnose where responsibility lies.' },
  { page: 6, title: 'Stakeholders', text: 'The regulator, the workers, the press and the family.' },
  { page: 7, title: 'Executive Pressure', text: 'Hold your ground with a powerful director.' },
  { page: 8, title: 'Board Case', text: 'Turn your judgement into a case you can defend.' },
  { page: 9, title: 'Board Q&A', text: 'Defend it under questioning.' },
  { page: 10, title: 'Outcome', text: 'See what your decisions set in motion.' },
];

export const BRIEFING = {
  beats: [
    {
      kicker: 'Who you are',
      title: 'You are the Company Secretary',
      text: 'Strategic Advisor to the Board of Delta Industrial Nigeria Ltd. (DIN). The Board will act on your advice.',
    },
    {
      kicker: 'What happened',
      title: 'Three problems, one crisis',
      text: '',
    },
    {
      kicker: 'What you will do',
      title: 'Seventy-two hours to the Board',
      text: 'Eight stages. Every decision carries forward, and the Board will test all of them.',
    },
  ],
  facts: [
    { title: 'A worker died', text: 'Three weeks ago, on a production line running with a bypassed safety interlock.' },
    { title: 'Money is unaccounted for', text: 'Internal audit has flagged “facilitation payments” made through a logistics agent.' },
    { title: 'The outside world is watching', text: 'A journalist is asking questions. The regulator knows, but has not opened an inquiry.' },
  ],
  narrationFacts:
    'Three weeks ago, a contract worker died on a line with a bypassed safety interlock. Internal audit has found payments no one can explain. And people outside the company are starting to ask questions.',
  narrationMission:
    'You have seventy-two hours. Review the evidence, make the hard calls, answer the people affected, and defend your case in front of the Board.',
  signPrompt: 'Sign the brief to begin.',
  next: 'Continue',
};

/**
 * Narrator lines after an action — what just happened, why it matters and what to do next —
 * in full sentences. Replace the script's short cue lines at these moments.
 */
export const GUIDE = {
  evidencePattern:
    'Read these records together, not one at a time. A bypassed interlock, an earlier near miss on the same line, and months of unexplained payments point to a pattern. A pattern is much harder to explain away than a single incident.',
  newEvidence:
    'Your first diagnosis is locked in. A signed statement from the shift supervisor has just arrived. Open it and read it carefully before you decide whether your weighting still holds.',
  reassess:
    'The supervisor’s statement shows the bypass was approved in writing by the Regional Director, not decided on the plant floor alone. Reassess your weighting now, and keep or change it based on what the evidence shows.',
  caseReform:
    'This is the last section of your case. Choose a reform that fixes the failure you diagnosed as primary. The Board will check that your diagnosis and your reform tell the same story.',
  caseAdded: [
    'Your recommendation and the evidence behind it are now in the Board pack. The Board will test that recommendation against your reasoning, so next, choose three ethical lenses and explain how each one supports it.',
    'Your ethical reasoning is in the pack. This is what separates governance judgement from simple compliance. Next, add your accountability diagnosis, carried forward from the weighting you gave earlier.',
    'Your diagnosis is in the pack. The Board will cross-check it against the evidence you selected and the weighting you gave earlier. One section remains: the governance reform.',
    'All four sections of your case are complete. Review them once more, then lock the case. Once it is locked, it cannot be changed, and the Board will question you on exactly what it says.',
  ],
  caseAddedMismatch:
    'All four sections are complete, but your reform does not address the failure you diagnosed as primary, and the Board will ask you why. You can change the reform now, or lock the case and be ready to defend it.',
  caseLocked:
    'Your Board case is locked and in the directors’ hands. When you face the Board, they will question the choices it contains, so be ready to explain your reasoning in your own words.',
  qaLoad:
    'The Board is ready to question you, and every decision you made over the last seventy-two hours is now under scrutiny. Listen to each question, answer in your own words, then choose the reasoning closest to what you said.',
  qaAnswered: [
    'Your first answer is on the record. Stay consistent with the case you built, because the Board has more to ask before it reaches a decision.',
    'That was the Board’s final question. The directors will now weigh your answers against everything you did over the last seventy-two hours, and decide what happens next.',
  ],
};

/** One-line hint shown when a folder is hovered or focused. */
export const EVIDENCE_HINT: Record<EvidenceId, string> = {
  incident: 'The fatal incident on 1 June: what the first inspection found.',
  nearMiss: 'Four months earlier, the same interlock failed to stop the line.',
  payments: 'Fourteen months of “expediting fees” through one agent.',
  correspondence: "The Regional Director's email about what goes in writing.",
  news: 'What the local press is already reporting.',
};
