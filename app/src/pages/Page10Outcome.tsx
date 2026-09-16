import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { ChartBar, Newspaper, Shield, Users } from '@phosphor-icons/react';
import { SCENES } from '../assets';
import { usePageIntro } from '../components/Experience';
import { JourneyDialog } from '../components/Journey';
import { revealTiming } from '../components/Reveal';
import { SimulationStage } from '../components/SimulationStage';
import { PillButton, StageCopy, TextLink } from '../components/ui';
import { VoiceField } from '../components/VoiceField';
import { ENDING_FEEDBACK, ENDING_OKAFOR, ENDINGS, EXECUTIVE, FRAMING, INDICATORS, REFLECTION, STAKEHOLDERS } from '../sim/content';
import { allocationShort, buildResult, fill } from '../sim/derive';
import { OBJECTIVES } from '../sim/experience';
import { persistence } from '../sim/persistence';
import { indicatorWord, unconvincedAudience } from '../sim/resolver';
import { useSim } from '../sim/store';
import type { EndingId, VarKey } from '../sim/types';

// Page 10 — Outcome (spec §21). Resolves to one of three endings; never hard-coded positive.

const VISUAL: Record<EndingId, { title: string; subtitle: string; filter?: string }> = {
  'END-A': { title: 'Credibility Preserved', subtitle: 'The Board accepted a difficult truth — and a stronger path forward.' },
  'END-B': { title: 'Legitimacy Fragile', subtitle: 'The organisation avoids immediate collapse, but trust remains uneven.', filter: 'saturate(0.72) brightness(0.9)' },
  'END-C': {
    title: 'Credibility Collapses',
    subtitle: 'Contradictions and delay have turned the Board’s decisions into part of the crisis.',
    filter: 'brightness(0.7) saturate(0.75)',
  },
};

const ICONS: Record<VarKey, ReactNode> = {
  RT: <Shield size={28} />,
  BC: <Users size={28} />,
  EM: <ChartBar size={28} />,
  MN: <Newspaper size={28} />,
};

const WORDING: Record<ReturnType<typeof indicatorWord>, string> = {
  Strengthened: 'The Board’s response built confidence here.',
  Holding: 'Steady, but not yet secure.',
  Strained: 'Choices along the way wore it down.',
  Damaged: 'Trust here now has to be rebuilt.',
};

type View = 'summary' | 'story' | 'reflect';

export function Page10Outcome() {
  const { sim, dispatch } = useSim();

  useEffect(() => {
    if (!sim.ending) dispatch({ type: 'RESOLVE_ENDING' });
    else if (!sim.completedAt) dispatch({ type: 'COMPLETE' });
  }, [sim.ending, sim.completedAt, dispatch]);

  useEffect(() => {
    if (sim.ending && sim.completedAt) void persistence.submitResult(buildResult(sim));
    // Re-submit when reflections change so the stored result stays current.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sim.ending, sim.completedAt, sim.reflection]);

  if (!sim.ending) return <div className="loading">Resolving the Board's decision…</div>;
  return <Outcome ending={sim.ending} />;
}

function Outcome({ ending }: { ending: EndingId }) {
  const { sim, dispatch } = useSim();
  const [view, setView] = useState<View>('summary');
  const [leftSummary, setLeftSummary] = useState(false);
  const [whyOpen, setWhyOpen] = useState(false);
  const [reflectIndex, setReflectIndex] = useState(0);
  const [journey, setJourney] = useState(false);
  const [confirmRestart, setConfirmRestart] = useState(false);

  const copy = ENDINGS[ending];
  const visual = VISUAL[ending];
  // The ending is narrated first; the verdict and the four indicators follow.
  const intro = usePageIntro('ending', copy.narration);
  const timing = revealTiming(visual.title, visual.subtitle, OBJECTIVES[10]);

  const show = (next: View) => {
    if (next !== 'summary') setLeftSummary(true);
    setView(next);
  };

  const tokens = { okafor: sim.relationshipCost ? ENDING_OKAFOR : '', audience: unconvincedAudience(sim.state) };
  const paragraphs = (sim.endingVariant && copy.variantParagraphs.length ? copy.variantParagraphs : copy.paragraphs).map((p) => fill(p, tokens));

  const journalist = sim.stakeholderResponses.journalist;
  const { round1, round2 } = sim.accountability;
  const prompts = REFLECTION.prompts.map((p) =>
    fill(p, {
      framing: sim.boardFraming ? `“${FRAMING.short[sim.boardFraming]}”` : 'not recorded',
      journalist: journalist ? STAKEHOLDERS[2].short[journalist] : 'not recorded',
      round1: round1 ? allocationShort(round1) : 'not recorded',
      round2: round2 ? allocationShort(round2) : 'not recorded',
      executive: sim.executiveResponse ? `“${EXECUTIVE.short[sim.executiveResponse]}”` : 'not recorded',
    }),
  );

  return (
    <>
      <SimulationStage page={10} image={SCENES.outcome} imageFilter={visual.filter} label="Outcome" wash="strong" className={`ending-${ending}`} intro={intro}>
        <StageCopy className="page10__copy" title={visual.title} subtitle={visual.subtitle} objective={OBJECTIVES[10]} intro={intro}>
          <div id="controls">
            {view === 'summary' && (
              <>
                <ul
                  className={`page10__metrics${intro.animate && !leftSummary ? ' stagger' : ''}`}
                  style={{ '--stagger-base': `${timing.controlsAt}ms` } as CSSProperties}
                  aria-label="Where DIN stands"
                >
                  {INDICATORS.map((ind, i) => {
                    const word = indicatorWord(sim.state[ind.key]);
                    return (
                      <li key={ind.key} className={`page10__metric is-${word.toLowerCase()}`} style={{ '--i': i } as CSSProperties}>
                        <span className="page10__metric-icon" aria-hidden="true">
                          {ICONS[ind.key]}
                        </span>
                        <div>
                          <h3>{ind.label}</h3>
                          <p>
                            <b>{word}.</b> {WORDING[word]}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <div className="page10__actions">
                  <PillButton onClick={() => setJourney(true)}>Review Journey</PillButton>
                  {confirmRestart ? (
                    <div className="link-row">
                      <span className="page10__confirm">Start a new run? This run's result stays saved.</span>
                      <TextLink
                        onClick={async () => {
                          await persistence.clearSession();
                          dispatch({ type: 'RESET' });
                        }}
                      >
                        Yes, restart
                      </TextLink>
                      <TextLink onClick={() => setConfirmRestart(false)}>Cancel</TextLink>
                    </div>
                  ) : (
                    <div className="link-row">
                      <TextLink onClick={() => show('story')}>What happened</TextLink>
                      <TextLink onClick={() => show('reflect')}>Reflect</TextLink>
                      <TextLink onClick={() => setConfirmRestart(true)}>Restart</TextLink>
                    </div>
                  )}
                </div>
              </>
            )}

            {view === 'story' && (
              <div className="page10__panel glass-panel--dark">
                <p className="panel-kicker">{copy.title}</p>
                <div className="page10__story" aria-live="polite">
                  {whyOpen ? <p>{ENDING_FEEDBACK}</p> : paragraphs.map((p) => <p key={p}>{p}</p>)}
                  {!whyOpen && <p className="page10__lesson">{copy.lesson}</p>}
                </div>
                <div className="panel-actions">
                  <PillButton size="small" onClick={() => show('summary')} autoFocus>
                    Back
                  </PillButton>
                  <TextLink aria-pressed={whyOpen} onClick={() => setWhyOpen((w) => !w)}>
                    {whyOpen ? 'What happened' : 'Why this ending'}
                  </TextLink>
                </div>
              </div>
            )}

            {view === 'reflect' && (
              <div className="page10__panel glass-panel--dark">
                <p className="panel-kicker">
                  Reflection {reflectIndex + 1} of {prompts.length} · optional, not scored
                </p>
                <p className="page10__prompt">{prompts[reflectIndex]}</p>
                <VoiceField
                  key={reflectIndex}
                  label={`Reflection ${reflectIndex + 1}`}
                  showLabel={false}
                  value={sim.reflection[reflectIndex] ?? ''}
                  onChange={(text) => dispatch({ type: 'SET_REFLECTION', index: reflectIndex, text })}
                  rows={3}
                  variant="area"
                />
                <div className="panel-actions">
                  {reflectIndex < prompts.length - 1 ? (
                    <PillButton size="small" onClick={() => setReflectIndex(reflectIndex + 1)}>
                      Next
                    </PillButton>
                  ) : (
                    <PillButton size="small" onClick={() => show('summary')}>
                      Done
                    </PillButton>
                  )}
                  {reflectIndex > 0 && <TextLink onClick={() => setReflectIndex(reflectIndex - 1)}>Previous</TextLink>}
                  <TextLink onClick={() => show('summary')}>Close</TextLink>
                </div>
              </div>
            )}
          </div>
        </StageCopy>
      </SimulationStage>
      <JourneyDialog open={journey} onClose={() => setJourney(false)} sim={sim} />
    </>
  );
}
