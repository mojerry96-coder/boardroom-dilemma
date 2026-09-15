export type Opt = 'A' | 'B' | 'C' | 'D';
export const OPTS: Opt[] = ['A', 'B', 'C', 'D'];

export type VarKey = 'RT' | 'BC' | 'EM' | 'MN';
export type Vars = Record<VarKey, number>;
export type Delta = Partial<Vars>;

export type Lever = 'agency' | 'stewardship' | 'stakeholderRecognition';
export const LEVERS: Lever[] = ['agency', 'stewardship', 'stakeholderRecognition'];
export type Allocation = Record<Lever, number>;

export type EvidenceId = 'incident' | 'nearMiss' | 'payments' | 'correspondence' | 'news';
export type LensId = 'utilitarian' | 'deontological' | 'virtue' | 'stakeholder' | 'ubuntu';
export type StakeholderId = 'regulator' | 'employee' | 'journalist' | 'family';
export type EndingId = 'END-A' | 'END-B' | 'END-C';

export interface LogEntry {
  /** Stable key such as "framing" or "stakeholder.regulator". */
  key: string;
  page: number;
  choice: string;
  delta: Delta;
}

export interface BoardCase {
  recommendation: string | null;
  lenses: LensId[];
  justifications: Partial<Record<LensId, string>>;
  diagnosisNotes: string;
  reformTarget: Lever | null;
  reformText: string;
  reformCard: Lever | null;
  stepsComplete: number;
  reformMismatch: boolean;
  locked: boolean;
}

export interface SimState {
  version: 1;
  runId: string;
  seed: number;
  page: number;
  learnerName: string;

  evidence: {
    reviewed: EvidenceId[];
    blockedAttempts: number;
    complete: boolean;
  };
  reviewOrderCorrect: boolean;

  boardFraming: Opt | null;
  selfReportDecision: Opt | null;

  accountability: {
    round1: Allocation | null;
    round2: Allocation | null;
    statementRead: boolean;
    bcAward: number | null;
  };

  stakeholderResponses: Record<StakeholderId, Opt | null>;

  executiveResponse: Opt | null;
  relationshipCost: boolean;

  boardCase: BoardCase;

  boardQA: { q1: Opt | null; q2: Opt | null; ownWords: { q1?: string; q2?: string } };

  state: Vars;
  log: LogEntry[];

  ending: EndingId | null;
  endingVariant: boolean;
  reflection: Record<number, string>;
  completedAt: string | null;
}
