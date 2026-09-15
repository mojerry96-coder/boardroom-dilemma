import { describe, expect, it } from 'vitest';
import {
  START_VARS,
  applyDelta,
  executiveResult,
  framingDelta,
  journalistResult,
  q1Delta,
  q2Delta,
  regulatorResult,
  selfReportDelta,
  stakeholderResult,
} from './engine';
import {
  boardCredibilityAward,
  distance,
  governanceRiskIndex,
  isSingleCause,
  primaryLevers,
  redistribute,
  reformCredibilityScore,
  round2DeltaKind,
} from './accountability';
import { indicatorWord, resolveEnding, unconvincedAudience } from './resolver';
import { OPTS, type Opt, type StakeholderId, type Vars } from './types';

describe('script scoring', () => {
  it('matches Screen 2 and Screen 3 state changes', () => {
    expect(framingDelta('C')).toEqual({ RT: 5, BC: 5, MN: 5 });
    expect(framingDelta('D')).toEqual({ BC: -5, EM: -10 });
    expect(selfReportDelta('A')).toEqual({ RT: 15, MN: 10, BC: -5 });
    expect(selfReportDelta('D')).toEqual({ RT: -20, MN: -15, BC: -10, EM: -10 });
  });

  it('applies the regulator consistency rule and composure bonus', () => {
    expect(regulatorResult('A', 'A', false).delta).toEqual({ RT: -5 });
    expect(regulatorResult('A', 'B', false).delta).toEqual({});
    expect(regulatorResult('A', 'D', false).delta).toEqual({});
    expect(regulatorResult('B', 'B', true).delta).toEqual({ RT: 10, BC: 5 });
    expect(regulatorResult('C', 'B', true).delta).toEqual({ RT: -15 });
  });

  it('applies the journalist framing-consistency rule', () => {
    expect(journalistResult('C', 'A').delta).toEqual({ MN: -20 });
    expect(journalistResult('C', 'B').delta).toEqual({ MN: -20, RT: -15 });
  });

  it('sets relationship_cost only for Screen 6 option C', () => {
    expect(OPTS.filter((o) => executiveResult(o).relationshipCost)).toEqual(['C']);
  });

  it('branches Board Q1 and applies the Q2-B consistency bonus', () => {
    expect(q1Delta('A', true)).toEqual({ BC: 10, EM: 5 });
    expect(q1Delta('A', false)).toEqual({ BC: 10, RT: 5 });
    expect(q2Delta('B', 'B')).toEqual({ RT: 5, BC: 5 });
    expect(q2Delta('B', 'A')).toEqual({ RT: 5 });
  });

  it('clamps variables to 0–100', () => {
    expect(applyDelta({ RT: 98, BC: 2, EM: 50, MN: 50 }, { RT: 10, BC: -10 })).toEqual({ RT: 100, BC: 0, EM: 50, MN: 50 });
  });
});

describe('accountability model', () => {
  it('always keeps allocations at 100%', () => {
    let a = { agency: 34, stewardship: 33, stakeholderRecognition: 33 };
    for (const [lever, v] of [['agency', 80], ['stewardship', 0], ['stakeholderRecognition', 55], ['agency', 100], ['stewardship', 12]] as const) {
      a = redistribute(a, lever, v);
      expect(a.agency + a.stewardship + a.stakeholderRecognition).toBe(100);
      expect(a[lever]).toBe(v);
    }
  });

  it('splits evenly when the other two levers are both zero', () => {
    expect(redistribute({ agency: 100, stewardship: 0, stakeholderRecognition: 0 }, 'agency', 40)).toEqual({
      agency: 40,
      stewardship: 30,
      stakeholderRecognition: 30,
    });
  });

  it('computes GRI and RCS from distance and single-cause', () => {
    const profile2 = { agency: 45, stewardship: 20, stakeholderRecognition: 35 };
    expect(distance(profile2, 2)).toBe(0);
    expect(governanceRiskIndex(profile2, 2)).toBe(25);
    expect(reformCredibilityScore(profile2, 2)).toBe(100);
    const single = { agency: 100, stewardship: 0, stakeholderRecognition: 0 };
    expect(isSingleCause(single)).toBe(true);
    // d = (55 + 20 + 35) / 2 = 55 → GRI 25 + 49.5 + 20 → 95; RCS 100 − 60.5 − 15 = 24.5 (24.4999… in floating point) → 24
    expect(governanceRiskIndex(single, 2)).toBe(95);
    expect(reformCredibilityScore(single, 2)).toBe(24);
    expect(reformCredibilityScore(profile2, 2, profile2)).toBe(90);
  });

  it('awards Board Credibility per section 19.3', () => {
    const r1 = { agency: 34, stewardship: 33, stakeholderRecognition: 33 };
    expect(boardCredibilityAward(r1, r1)).toBe(5);
    expect(boardCredibilityAward(r1, { agency: 45, stewardship: 22, stakeholderRecognition: 33 })).toBe(15);
    expect(boardCredibilityAward(r1, { agency: 70, stewardship: 10, stakeholderRecognition: 20 })).toBe(10);
    expect(boardCredibilityAward(r1, { agency: 100, stewardship: 0, stakeholderRecognition: 0 })).toBe(5);
    expect(round2DeltaKind(r1, r1)).toBe('unchanged');
    expect(round2DeltaKind(r1, { agency: 36, stewardship: 30, stakeholderRecognition: 34 })).toBe('notResponded');
  });

  it('treats ties as multiple primary failures', () => {
    expect(primaryLevers({ agency: 40, stewardship: 20, stakeholderRecognition: 40 })).toEqual(['agency', 'stakeholderRecognition']);
  });
});

describe('ending resolver', () => {
  const v = (RT: number, BC: number, EM: number, MN: number): Vars => ({ RT, BC, EM, MN });

  it('uses source thresholds first', () => {
    expect(resolveEnding(v(30, 90, 90, 90))).toEqual({ ending: 'END-C', variant: false });
    expect(resolveEnding(v(70, 60, 60, 60))).toEqual({ ending: 'END-A', variant: false });
    expect(resolveEnding(v(45, 60, 60, 70))).toEqual({ ending: 'END-B', variant: false });
  });

  it('routes unmatched runs by what they earned', () => {
    expect(resolveEnding(v(85, 80, 50, 65))).toEqual({ ending: 'END-A', variant: true });
    expect(resolveEnding(v(55, 55, 50, 50))).toEqual({ ending: 'END-B', variant: true });
    expect(unconvincedAudience(v(85, 80, 50, 65))).toBe('employees');
    expect(indicatorWord(64)).toBe('Holding');
  });

  it('resolves every possible run, with the documented distribution', () => {
    const counts: Record<string, number> = {};
    let n = 0;
    const stakeholders: StakeholderId[] = ['regulator', 'employee', 'journalist', 'family'];
    for (const flag of [true, false])
      for (const s2 of OPTS)
        for (const s3 of OPTS)
          for (const award of [5, 10, 15])
            for (const a of OPTS)
              for (const b of OPTS)
                for (const c of OPTS)
                  for (const d of OPTS)
                    for (const s6 of OPTS)
                      for (const q1 of OPTS)
                        for (const q2 of OPTS) {
                          let vars = applyDelta(START_VARS, framingDelta(s2));
                          vars = applyDelta(vars, selfReportDelta(s3));
                          vars = applyDelta(vars, { BC: award });
                          const answers: Opt[] = [a, b, c, d];
                          stakeholders.forEach((id, i) => {
                            vars = applyDelta(vars, stakeholderResult(id, answers[i], { selfReport: s3, framing: s2, reviewOrderCorrect: flag }).delta);
                          });
                          const exec = executiveResult(s6);
                          vars = applyDelta(vars, exec.delta);
                          vars = applyDelta(vars, q1Delta(q1, exec.relationshipCost));
                          vars = applyDelta(vars, q2Delta(q2, s3));
                          const r = resolveEnding(vars);
                          const key = r.ending + (r.variant ? ' variant' : '');
                          counts[key] = (counts[key] ?? 0) + 1;
                          n++;
                        }
    const pct = (k: string) => Math.round((1000 * (counts[k] ?? 0)) / n) / 10;
    expect(n).toBe(1572864);
    expect(pct('END-A')).toBeCloseTo(2.6, 0);
    expect(pct('END-A variant')).toBeCloseTo(10.3, 0);
    expect(pct('END-B')).toBeCloseTo(5.8, 0);
    expect(pct('END-B variant')).toBeCloseTo(39.8, 0);
    expect(pct('END-C')).toBeCloseTo(41.4, 0);
  });
});
