import type { Delta, Opt, StakeholderId, Vars, VarKey } from './types';

// Scoring for every decision, taken from each script screen's own "State change"
// line, plus the clarifications in CONTENT_LOGIC_FINALIZATION.md section 19.6.

export const START_VARS: Vars = { RT: 50, BC: 50, EM: 50, MN: 50 };

const clamp = (n: number) => Math.max(0, Math.min(100, n));

export function applyDelta(vars: Vars, delta: Delta): Vars {
  const next = { ...vars };
  for (const key of Object.keys(delta) as VarKey[]) {
    next[key] = clamp(next[key] + (delta[key] ?? 0));
  }
  return next;
}

export function mergeDeltas(...deltas: Delta[]): Delta {
  const out: Delta = {};
  for (const d of deltas) {
    for (const key of Object.keys(d) as VarKey[]) {
      out[key] = (out[key] ?? 0) + (d[key] ?? 0);
    }
  }
  return out;
}

/** Screen 2 — Initial Framing to the Board. */
export function framingDelta(opt: Opt): Delta {
  return {
    A: { RT: -5, MN: -5 },
    B: { RT: 5, BC: 5 },
    C: { RT: 5, BC: 5, MN: 5 },
    D: { BC: -5, EM: -10 },
  }[opt];
}

/** Screen 3 — The Self-Report Decision. */
export function selfReportDelta(opt: Opt): Delta {
  return {
    A: { RT: 15, MN: 10, BC: -5 },
    B: { RT: 10, BC: 5, MN: 5, EM: 5 },
    C: { RT: -10, MN: -5, BC: -5 },
    D: { RT: -20, MN: -15, BC: -10, EM: -10 },
  }[opt];
}

export interface StakeholderResult {
  delta: Delta;
  /** 5a: the regulator remarks on the team's composure (BC +5). */
  composure?: boolean;
  /** 5a option A after an immediate self-report, or 5c option C after framing B/C. */
  contradiction?: boolean;
}

/** Screen 5a — Regulator. */
export function regulatorResult(opt: Opt, selfReport: Opt | null, reviewOrderCorrect: boolean): StakeholderResult {
  const composure = reviewOrderCorrect && (opt === 'A' || opt === 'B');
  const bonus: Delta = composure ? { BC: 5 } : {};
  switch (opt) {
    case 'A': {
      const contradiction = selfReport === 'A';
      return { delta: mergeDeltas(contradiction ? { RT: -5 } : {}, bonus), composure, contradiction };
    }
    case 'B':
      return { delta: mergeDeltas({ RT: 10 }, bonus), composure };
    case 'C':
      return { delta: { RT: -15 } };
    case 'D':
      return { delta: { RT: -15, MN: -10 } };
  }
}

/** Screen 5b — Employee representatives. */
export function employeeResult(opt: Opt): StakeholderResult {
  return {
    delta: {
      A: { EM: -5 },
      B: { EM: 15 },
      C: { EM: -15 },
      D: { EM: -10, BC: -5 },
    }[opt],
  };
}

/** Screen 5c — Journalist. */
export function journalistResult(opt: Opt, framing: Opt | null): StakeholderResult {
  switch (opt) {
    case 'A':
      return { delta: { MN: -10 } };
    case 'B':
      return { delta: { MN: 10, RT: 5 } };
    case 'C': {
      const contradiction = framing === 'B' || framing === 'C';
      return { delta: contradiction ? { MN: -20, RT: -15 } : { MN: -20 }, contradiction };
    }
    case 'D':
      return { delta: { MN: -15 } };
  }
}

/** Screen 5d — Victim's family. */
export function familyResult(opt: Opt): StakeholderResult {
  return {
    delta: {
      A: { EM: -5 },
      B: { EM: 10, MN: 10 },
      C: { EM: -15, MN: -10 },
      D: {},
    }[opt],
  };
}

export function stakeholderResult(
  id: StakeholderId,
  opt: Opt,
  ctx: { selfReport: Opt | null; framing: Opt | null; reviewOrderCorrect: boolean },
): StakeholderResult {
  switch (id) {
    case 'regulator':
      return regulatorResult(opt, ctx.selfReport, ctx.reviewOrderCorrect);
    case 'employee':
      return employeeResult(opt);
    case 'journalist':
      return journalistResult(opt, ctx.framing);
    case 'family':
      return familyResult(opt);
  }
}

/** Screen 6 — Executive Narrative Resistance. */
export function executiveResult(opt: Opt): { delta: Delta; relationshipCost: boolean } {
  return {
    A: { delta: { BC: -15, EM: -15 }, relationshipCost: false },
    B: { delta: { BC: 10, EM: 5 }, relationshipCost: false },
    C: { delta: { BC: -5, EM: 5 }, relationshipCost: true },
    D: { delta: { BC: -5 }, relationshipCost: false },
  }[opt];
}

/** Screen 8 — Board Question 1 (branches on relationship_cost). */
export function q1Delta(opt: Opt, relationshipCost: boolean): Delta {
  if (relationshipCost) {
    return { A: { BC: 10, EM: 5 }, B: { BC: 5 }, C: { BC: -10, EM: -5 }, D: { BC: -5 } }[opt];
  }
  return { A: { BC: 10, RT: 5 }, B: { BC: 5 }, C: { BC: -10, EM: -5 }, D: { MN: 5, BC: -5 } }[opt];
}

/** Screen 8 — Board Question 2 (Q2-B consistency bonus when Screen 3 = B). */
export function q2Delta(opt: Opt, selfReport: Opt | null): Delta {
  switch (opt) {
    case 'A':
      return { RT: 10, BC: 5 };
    case 'B':
      return selfReport === 'B' ? { RT: 5, BC: 5 } : { RT: 5 };
    case 'C':
      return { MN: 5, BC: -5 };
    case 'D':
      return { RT: -10, BC: -5, MN: -5 };
  }
}
