import { createContext, useContext, useEffect, useReducer, useRef, useState, type ReactNode } from 'react';
import { boardCredibilityAward, primaryLevers } from './accountability';
import {
  START_VARS,
  applyDelta,
  executiveResult,
  framingDelta,
  q1Delta,
  q2Delta,
  selfReportDelta,
  stakeholderResult,
} from './engine';
import { persistence } from './persistence';
import { resolveEnding } from './resolver';
import { newSeed } from './shuffle';
import type { Allocation, BoardCase, Delta, EvidenceId, LogEntry, Opt, SimState, StakeholderId } from './types';

export function initialState(): SimState {
  return {
    version: 1,
    runId: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : String(Date.now()),
    seed: newSeed(),
    page: 1,
    learnerName: '',
    evidence: { reviewed: [], blockedAttempts: 0, complete: false },
    reviewOrderCorrect: false,
    boardFraming: null,
    selfReportDecision: null,
    accountability: { round1: null, round2: null, statementRead: false, bcAward: null },
    stakeholderResponses: { regulator: null, employee: null, journalist: null, family: null },
    executiveResponse: null,
    relationshipCost: false,
    boardCase: {
      recommendation: null,
      lenses: [],
      justifications: {},
      diagnosisNotes: '',
      reformTarget: null,
      reformText: '',
      reformCard: null,
      stepsComplete: 0,
      reformMismatch: false,
      locked: false,
    },
    boardQA: { q1: null, q2: null, ownWords: {} },
    state: { ...START_VARS },
    log: [],
    ending: null,
    endingVariant: false,
    reflection: {},
    completedAt: null,
  };
}

export type Action =
  | { type: 'LOAD'; state: SimState }
  | { type: 'RESET' }
  | { type: 'GO'; page: number }
  | { type: 'SET_NAME'; name: string }
  | { type: 'EVIDENCE_REVIEWED'; id: EvidenceId }
  | { type: 'EVIDENCE_BLOCKED' }
  | { type: 'EVIDENCE_COMPLETE' }
  | { type: 'CHOOSE_FRAMING'; opt: Opt }
  | { type: 'CHOOSE_SELF_REPORT'; opt: Opt }
  | { type: 'LOCK_ROUND1'; allocation: Allocation }
  | { type: 'STATEMENT_READ' }
  | { type: 'SUBMIT_ROUND2'; allocation: Allocation }
  | { type: 'CHOOSE_STAKEHOLDER'; id: StakeholderId; opt: Opt }
  | { type: 'CHOOSE_EXECUTIVE'; opt: Opt }
  | { type: 'UPDATE_BOARD_CASE'; patch: Partial<BoardCase> }
  | { type: 'COMPLETE_CASE_STEP'; step: number }
  | { type: 'LOCK_BOARD_CASE' }
  | { type: 'CHOOSE_Q1'; opt: Opt }
  | { type: 'CHOOSE_Q2'; opt: Opt }
  | { type: 'SET_OWN_WORDS'; question: 'q1' | 'q2'; text: string }
  | { type: 'RESOLVE_ENDING' }
  | { type: 'SET_REFLECTION'; index: number; text: string }
  | { type: 'COMPLETE' };

function record(s: SimState, key: string, page: number, choice: string, delta: Delta): SimState {
  const entry: LogEntry = { key, page, choice, delta };
  return { ...s, state: applyDelta(s.state, delta), log: [...s.log.filter((e) => e.key !== key), entry] };
}

export function reducer(s: SimState, a: Action): SimState {
  switch (a.type) {
    case 'LOAD':
      return a.state;
    case 'RESET':
      return initialState();
    case 'GO':
      return { ...s, page: Math.max(1, Math.min(10, a.page)) };
    case 'SET_NAME':
      return { ...s, learnerName: a.name.slice(0, 80) };

    case 'EVIDENCE_REVIEWED':
      if (s.evidence.reviewed.includes(a.id)) return s;
      return { ...s, evidence: { ...s.evidence, reviewed: [...s.evidence.reviewed, a.id] } };
    case 'EVIDENCE_BLOCKED':
      if (s.evidence.complete) return s;
      return { ...s, evidence: { ...s.evidence, blockedAttempts: s.evidence.blockedAttempts + 1 } };
    case 'EVIDENCE_COMPLETE': {
      if (s.evidence.complete) return s;
      const correct = s.evidence.blockedAttempts === 0;
      const next = { ...s, evidence: { ...s.evidence, complete: true }, reviewOrderCorrect: correct };
      return record(next, 'evidence', 3, correct ? 'correct' : 'blocked', {});
    }

    case 'CHOOSE_FRAMING':
      if (s.boardFraming) return s;
      return record({ ...s, boardFraming: a.opt }, 'framing', 4, a.opt, framingDelta(a.opt));
    case 'CHOOSE_SELF_REPORT':
      if (s.selfReportDecision) return s;
      return record({ ...s, selfReportDecision: a.opt }, 'selfReport', 4, a.opt, selfReportDelta(a.opt));

    case 'LOCK_ROUND1':
      if (s.accountability.round1) return s;
      return { ...s, accountability: { ...s.accountability, round1: a.allocation } };
    case 'STATEMENT_READ':
      return { ...s, accountability: { ...s.accountability, statementRead: true } };
    case 'SUBMIT_ROUND2': {
      const { round1, round2 } = s.accountability;
      if (!round1 || round2) return s;
      const award = boardCredibilityAward(round1, a.allocation);
      const next = { ...s, accountability: { ...s.accountability, round2: a.allocation, bcAward: award } };
      return record(next, 'accountability', 5, `+${award}`, { BC: award });
    }

    case 'CHOOSE_STAKEHOLDER': {
      if (s.stakeholderResponses[a.id]) return s;
      const result = stakeholderResult(a.id, a.opt, {
        selfReport: s.selfReportDecision,
        framing: s.boardFraming,
        reviewOrderCorrect: s.reviewOrderCorrect,
      });
      const next = { ...s, stakeholderResponses: { ...s.stakeholderResponses, [a.id]: a.opt } };
      return record(next, `stakeholder.${a.id}`, 6, a.opt, result.delta);
    }

    case 'CHOOSE_EXECUTIVE': {
      if (s.executiveResponse) return s;
      const result = executiveResult(a.opt);
      const next = { ...s, executiveResponse: a.opt, relationshipCost: result.relationshipCost };
      return record(next, 'executive', 7, a.opt, result.delta);
    }

    case 'UPDATE_BOARD_CASE':
      if (s.boardCase.locked) return s;
      return { ...s, boardCase: { ...s.boardCase, ...a.patch } };
    case 'COMPLETE_CASE_STEP':
      if (s.boardCase.locked) return s;
      return { ...s, boardCase: { ...s.boardCase, stepsComplete: Math.max(s.boardCase.stepsComplete, a.step) } };
    case 'LOCK_BOARD_CASE': {
      const r2 = s.accountability.round2;
      if (s.boardCase.locked || !r2 || !s.boardCase.reformTarget) return s;
      const mismatch = !primaryLevers(r2).includes(s.boardCase.reformTarget);
      const next = { ...s, boardCase: { ...s.boardCase, locked: true, reformMismatch: mismatch, stepsComplete: 4 } };
      return record(next, 'boardCase', 8, mismatch ? 'mismatch' : 'aligned', {});
    }

    case 'CHOOSE_Q1':
      if (s.boardQA.q1) return s;
      return record({ ...s, boardQA: { ...s.boardQA, q1: a.opt } }, 'q1', 9, a.opt, q1Delta(a.opt, s.relationshipCost));
    case 'CHOOSE_Q2':
      if (s.boardQA.q2) return s;
      return record({ ...s, boardQA: { ...s.boardQA, q2: a.opt } }, 'q2', 9, a.opt, q2Delta(a.opt, s.selfReportDecision));
    case 'SET_OWN_WORDS':
      return { ...s, boardQA: { ...s.boardQA, ownWords: { ...s.boardQA.ownWords, [a.question]: a.text } } };

    case 'RESOLVE_ENDING': {
      if (s.ending) return s;
      const r = resolveEnding(s.state);
      return { ...s, ending: r.ending, endingVariant: r.variant };
    }
    case 'SET_REFLECTION':
      return { ...s, reflection: { ...s.reflection, [a.index]: a.text } };
    case 'COMPLETE':
      return s.completedAt ? s : { ...s, completedAt: new Date().toISOString() };
  }
}

interface SimContextValue {
  sim: SimState;
  dispatch: (a: Action) => void;
  ready: boolean;
}

const SimContext = createContext<SimContextValue | null>(null);

export function SimProvider({ children }: { children: ReactNode }) {
  const [sim, dispatch] = useReducer(reducer, undefined, initialState);
  const [ready, setReady] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const restart = params.has('reset');
    if (restart) {
      // One-shot: a later reload should resume the run, not wipe it.
      params.delete('reset');
      const qs = params.toString();
      window.history.replaceState(null, '', `${window.location.pathname}${qs ? `?${qs}` : ''}${window.location.hash}`);
    }
    (async () => {
      if (restart) await persistence.clearSession();
      const saved = restart ? null : await persistence.loadSession();
      if (saved) dispatch({ type: 'LOAD', state: saved });
      loaded.current = true;
      setReady(true);
    })();
  }, []);

  useEffect(() => {
    if (loaded.current) void persistence.saveSession(sim);
  }, [sim]);

  return <SimContext.Provider value={{ sim, dispatch, ready }}>{children}</SimContext.Provider>;
}

export function useSim() {
  const ctx = useContext(SimContext);
  if (!ctx) throw new Error('useSim must be used inside SimProvider');
  return ctx;
}
