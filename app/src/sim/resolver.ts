import type { EndingId, Vars } from './types';

// Ending resolver — CONTENT_LOGIC_FINALIZATION.md section 9 (corrected).

export interface EndingResult {
  ending: EndingId;
  /** True when no source threshold matched and a fallback rule decided the ending. */
  variant: boolean;
}

export function resolveEnding({ RT, BC, EM, MN }: Vars): EndingResult {
  if (RT < 40 || BC < 40) return { ending: 'END-C', variant: false };
  if (RT >= 65 && BC >= 55 && EM >= 55 && MN >= 55) return { ending: 'END-A', variant: false };
  if (MN >= 60 && (RT < 50 || EM < 45)) return { ending: 'END-B', variant: false };
  if (RT >= 65 && BC >= 55) return { ending: 'END-A', variant: true };
  return { ending: 'END-B', variant: true };
}

/** Who still needs convincing in the END-A variant opening. */
export function unconvincedAudience({ EM, MN }: Vars): string {
  if (EM < 55 && MN < 55) return 'employees and the public';
  if (EM < 55) return 'employees';
  return 'the public';
}

/** Word-only outcome indicator (numbers are never shown). */
export function indicatorWord(value: number): 'Strengthened' | 'Holding' | 'Strained' | 'Damaged' {
  if (value >= 65) return 'Strengthened';
  if (value >= 50) return 'Holding';
  if (value >= 40) return 'Strained';
  return 'Damaged';
}
