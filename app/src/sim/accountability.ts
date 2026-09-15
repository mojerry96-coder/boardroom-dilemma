import { LEVERS, type Allocation, type Lever } from './types';

// Screen 4 systems model — CONTENT_LOGIC_FINALIZATION.md section 19.3.

export const START_ALLOCATION: Allocation = { agency: 34, stewardship: 33, stakeholderRecognition: 33 };

export const EVIDENCE_PROFILE: Record<1 | 2, Allocation> = {
  1: { agency: 35, stewardship: 30, stakeholderRecognition: 35 },
  2: { agency: 45, stewardship: 20, stakeholderRecognition: 35 },
};

const clamp = (n: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, n));

/** Sets one lever and redistributes the remainder across the other two, proportionally. */
export function redistribute(current: Allocation, lever: Lever, value: number): Allocation {
  const v = clamp(Math.round(value));
  const [a, b] = LEVERS.filter((l) => l !== lever);
  const remaining = 100 - v;
  const others = current[a] + current[b];
  const nextA = others === 0 ? Math.floor(remaining / 2) : Math.round((remaining * current[a]) / others);
  return { [lever]: v, [a]: nextA, [b]: remaining - nextA } as Allocation;
}

export function distance(allocation: Allocation, round: 1 | 2): number {
  const profile = EVIDENCE_PROFILE[round];
  return LEVERS.reduce((sum, l) => sum + Math.abs(allocation[l] - profile[l]), 0) / 2;
}

export const isSingleCause = (allocation: Allocation) => LEVERS.some((l) => allocation[l] === 0 || allocation[l] === 100);

export const sameAllocation = (x: Allocation, y: Allocation) => LEVERS.every((l) => x[l] === y[l]);

export function governanceRiskIndex(allocation: Allocation, round: 1 | 2): number {
  return clamp(Math.round(25 + 0.9 * distance(allocation, round) + (isSingleCause(allocation) ? 20 : 0)));
}

export function reformCredibilityScore(allocation: Allocation, round: 1 | 2, round1?: Allocation | null): number {
  const unchanged = round === 2 && !!round1 && sameAllocation(allocation, round1);
  return clamp(
    Math.round(100 - 1.1 * distance(allocation, round) - (isSingleCause(allocation) ? 15 : 0) - (unchanged ? 10 : 0)),
  );
}

export const griBand = (gri: number) => (gri < 40 ? 'Contained' : gri < 65 ? 'Elevated' : 'Severe');
export const rcsBand = (rcs: number) => (rcs >= 70 ? 'Credible' : rcs >= 45 ? 'Contestable' : 'Weak');

export function boardCredibilityAward(round1: Allocation, round2: Allocation): 5 | 10 | 15 {
  const respondsToEvidence = round2.agency - round1.agency >= 5;
  if (!respondsToEvidence) return 5;
  const d = distance(round2, 2);
  const single = isSingleCause(round2);
  if (d <= 15 && !single) return 15;
  if (d <= 30 && !single) return 10;
  return 5;
}

export function primaryLevers(allocation: Allocation): Lever[] {
  const max = Math.max(...LEVERS.map((l) => allocation[l]));
  return LEVERS.filter((l) => allocation[l] === max);
}

export type DeltaKind = 'responded' | 'unchanged' | 'notResponded';

export function round2DeltaKind(round1: Allocation, round2: Allocation): DeltaKind {
  if (sameAllocation(round1, round2)) return 'unchanged';
  return round2.agency - round1.agency >= 5 ? 'responded' : 'notResponded';
}
