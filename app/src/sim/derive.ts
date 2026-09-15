import { primaryLevers, round2DeltaKind } from './accountability';
import { ACCOUNTABILITY_COPY, LEVER_COPY, QA_FOLLOW_UPS, REFORM_CARDS, STAKEHOLDER_EXTRA } from './content';
import { stakeholderResult } from './engine';
import type { SimulationResult } from './persistence';
import { LEVERS, type Allocation, type BoardCase, type Lever, type Opt, type SimState, type StakeholderId } from './types';

export const fill = (text: string, tokens: Record<string, string>) => text.replace(/\{(\w+)\}/g, (m, k: string) => tokens[k] ?? m);

export const mapOptions = (options: Record<Opt, string>, fn: (t: string) => string): Record<Opt, string> => ({
  A: fn(options.A),
  B: fn(options.B),
  C: fn(options.C),
  D: fn(options.D),
});

export function leverList(levers: Lever[]): string {
  const names = levers.map((l) => LEVER_COPY[l].label);
  if (names.length <= 1) return names[0] ?? '';
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}

export const primaryFailureText = (r2: Allocation | null) => (r2 ? leverList(primaryLevers(r2)) : 'the primary failure');

export function reformTitleText(bc: BoardCase): string {
  if (!bc.reformTarget) return 'my proposed reform';
  if (bc.reformCard === bc.reformTarget) return REFORM_CARDS[bc.reformTarget].title;
  return `a reform targeting ${LEVER_COPY[bc.reformTarget].label}`;
}

export const allocationText = (a: Allocation) => `Agency ${a.agency}% · Stewardship ${a.stewardship}% · Stakeholder-recognition ${a.stakeholderRecognition}%`;

export const allocationShort = (a: Allocation) => `${a.agency} / ${a.stewardship} / ${a.stakeholderRecognition}`;

export function round2Message(r1: Allocation, r2: Allocation): string {
  const kind = round2DeltaKind(r1, r2);
  if (kind === 'responded') return ACCOUNTABILITY_COPY.responded(r1.agency, r2.agency);
  if (kind === 'unchanged') return ACCOUNTABILITY_COPY.unchanged;
  return ACCOUNTABILITY_COPY.notResponded(r1.agency, r2.agency);
}

export function stakeholderExtras(id: StakeholderId, opt: Opt, sim: SimState): string[] {
  const result = stakeholderResult(id, opt, {
    selfReport: sim.selfReportDecision,
    framing: sim.boardFraming,
    reviewOrderCorrect: sim.reviewOrderCorrect,
  });
  const extras: string[] = [];
  if (result.contradiction && id === 'regulator') extras.push(STAKEHOLDER_EXTRA.regulatorContradiction);
  if (result.contradiction && id === 'journalist') extras.push(STAKEHOLDER_EXTRA.journalistContradiction);
  if (result.composure) extras.push(STAKEHOLDER_EXTRA.regulatorComposure);
  return extras;
}

export function singleCauseLine(a: Allocation): string {
  const full = LEVERS.find((l) => a[l] === 100);
  if (full) return fill(QA_FOLLOW_UPS.singleCause, { lever: LEVER_COPY[full].label });
  return fill(QA_FOLLOW_UPS.singleCauseZero, { lever: leverList(LEVERS.filter((l) => a[l] === 0)) });
}

export function buildResult(sim: SimState): SimulationResult {
  return {
    runId: sim.runId,
    learnerName: sim.learnerName,
    completedAt: sim.completedAt ?? new Date().toISOString(),
    ending: sim.ending,
    endingVariant: sim.endingVariant,
    state: sim.state,
    flags: {
      reviewOrderCorrect: sim.reviewOrderCorrect,
      relationshipCost: sim.relationshipCost,
      reformMismatch: sim.boardCase.reformMismatch,
    },
    choices: sim.log,
    accountability: sim.accountability,
    boardCase: sim.boardCase,
    boardQA: sim.boardQA,
    reflection: sim.reflection,
  };
}
