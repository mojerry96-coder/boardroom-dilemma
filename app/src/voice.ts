import {
  ENDINGS,
  EXECUTIVE,
  LEVER_COPY,
  NARRATION,
  Q1_COMPLIANCE,
  Q1_RELATIONSHIP,
  Q2,
  QA_FOLLOW_UPS,
  STAKEHOLDERS,
} from './sim/content';
import { fill, leverList } from './sim/derive';
import { LEVERS, type Lever } from './sim/types';

// Recorded voice lines (ElevenLabs), mapped by exact text. Files live in public/voice.
// Lines without a recording fall back to browser speech synthesis.
//
// Narrator — "Victor Hopo – Narrative African Voice" (neMPCpWtBwWZhxEC8qpe), same as the films.
// Characters — see media/README.md for the voice used for each speaker.

const base = import.meta.env.BASE_URL;
const clip = (file: string) => `${base}voice/${file}.mp3`;

const NARRATOR: [string, string][] = [
  [NARRATION.role, 'narr_role'],
  [NARRATION.evidenceLoad, 'narr_evidence_load'],
  [NARRATION.evidencePattern, 'narr_evidence_pattern'],
  [NARRATION.crisisLoad, 'narr_crisis_load'],
  [NARRATION.accountabilityLoad, 'narr_accountability_load'],
  [NARRATION.accountabilityNewEvidence, 'narr_accountability_new_evidence'],
  [NARRATION.accountabilityReassess, 'narr_accountability_reassess'],
  [NARRATION.stakeholdersLoad, 'narr_stakeholders_load'],
  [NARRATION.executiveLoad, 'narr_executive_load'],
  [NARRATION.boardCaseLoad, 'narr_board_case_load'],
  [NARRATION.boardCaseReform, 'narr_board_case_reform'],
  [NARRATION.boardQALoad, 'narr_board_qa_load'],
  [EXECUTIVE.bridge.A, 'bridge_a'],
  [EXECUTIVE.bridge.B, 'bridge_b'],
  [EXECUTIVE.bridge.C, 'bridge_c'],
  [EXECUTIVE.bridge.D, 'bridge_d'],
  ...Object.entries(ENDINGS).map(([id, e]): [string, string] => [e.narration, `ending_${id}`]),
];

// Board follow-ups are filled from the learner's diagnosis, so every reachable variant is recorded.
const CODE: Record<Lever, string> = { agency: 'ag', stewardship: 'st', stakeholderRecognition: 'sr' };
const code = (levers: Lever[]) => levers.map((l) => CODE[l]).join('+');
const PRIMARY_SETS: Lever[][] = [...LEVERS.map((l) => [l]), ...LEVERS.flatMap((a, i) => LEVERS.slice(i + 1).map((b) => [a, b]))];

const FOLLOW_UPS: [string, string][] = [
  ...PRIMARY_SETS.flatMap((primary) =>
    LEVERS.map((target): [string, string] => [
      fill(QA_FOLLOW_UPS.mismatch, { primaryFailure: leverList(primary), reformTarget: LEVER_COPY[target].label }),
      `qa_mismatch_${code(primary)}_${CODE[target]}`,
    ]),
  ),
  ...LEVERS.map((l): [string, string] => [fill(QA_FOLLOW_UPS.singleCause, { lever: LEVER_COPY[l].label }), `qa_single_${CODE[l]}`]),
  ...LEVERS.map((l): [string, string] => [fill(QA_FOLLOW_UPS.singleCauseZero, { lever: LEVER_COPY[l].label }), `qa_singlezero_${CODE[l]}`]),
];

const CHARACTERS: [string, string][] = [
  ...STAKEHOLDERS.map((s): [string, string] => [s.line, `char_${s.id}`]),
  [Q1_RELATIONSHIP.question, 'qa_q1_relationship'],
  [Q1_COMPLIANCE.question, 'qa_q1_compliance'],
  [Q2.question, 'qa_q2'],
  ...FOLLOW_UPS,
];

export const VOICE_LINES: readonly [text: string, file: string][] = [...NARRATOR, ...CHARACTERS];

const VOICE = new Map(VOICE_LINES.map(([text, file]) => [text, clip(file)]));

/** URL of the recorded voice for an exact line, if one exists. */
export const voiceFor = (text: string): string | undefined => VOICE.get(text);
