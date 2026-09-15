import { useEffect, useState } from 'react';
import { SCENES } from '../assets';
import { DockHeader, Prompt } from '../components/Dock';
import { ArrowIcon } from '../components/Icons';
import { JourneyDialog } from '../components/Journey';
import { useNarrateOnce } from '../components/Narration';
import { Stage } from '../components/Stage';
import { VoiceField } from '../components/VoiceField';
import { ENDING_FEEDBACK, ENDING_OKAFOR, ENDINGS, EXECUTIVE, FRAMING, INDICATORS, REFLECTION, STAKEHOLDERS, UI } from '../sim/content';
import { allocationShort, buildResult, fill } from '../sim/derive';
import { persistence } from '../sim/persistence';
import { indicatorWord, unconvincedAudience } from '../sim/resolver';
import { useSim } from '../sim/store';
import type { EndingId } from '../sim/types';

// Ending — a short summary first; the full account and reflection only when asked for.

const HERO_FILTER: Record<EndingId, string | undefined> = {
  'END-A': undefined,
  'END-B': 'saturate(0.7) brightness(0.9)',
  'END-C': 'brightness(0.68) saturate(0.75) sepia(0.14)',
};

type View = 'summary' | 'story' | 'reflect';

export function Page10Outcome() {
  const { sim, dispatch } = useSim();
  const [view, setView] = useState<View>('summary');
  const [whyOpen, setWhyOpen] = useState(false);
  const [reflectIndex, setReflectIndex] = useState(0);
  const [journey, setJourney] = useState(false);
  const [confirmRestart, setConfirmRestart] = useState(false);

  useEffect(() => {
    if (!sim.ending) dispatch({ type: 'RESOLVE_ENDING' });
    else if (!sim.completedAt) dispatch({ type: 'COMPLETE' });
  }, [sim.ending, sim.completedAt, dispatch]);

  useEffect(() => {
    if (sim.ending && sim.completedAt) void persistence.submitResult(buildResult(sim));
    // Re-submit when reflections change so the stored result stays current.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sim.ending, sim.completedAt, sim.reflection]);

  const copy = sim.ending ? ENDINGS[sim.ending] : null;
  useNarrateOnce('ending', copy?.narration ?? null, !!copy);

  if (!sim.ending || !copy) return <div className="loading">Resolving the Board's decision…</div>;

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
      <Stage image={SCENES.outcome} heroFilter={HERO_FILTER[sim.ending]} label="Outcome" chapter={{ title: copy.title }}>
        <DockHeader page={10} title="The Board's decision" />

        {view === 'summary' && (
          <>
            <h2 className="ending-title">{copy.title}</h2>
            <p className="lesson">{copy.lesson}</p>
            <ul className="indicators" aria-label="Where DIN stands">
              {INDICATORS.map((ind) => {
                const word = indicatorWord(sim.state[ind.key]);
                return (
                  <li key={ind.key} className={`indicator indicator--${word}`}>
                    <span className="indicator__label">{ind.label}</span>
                    <span className="indicator__word">{word}</span>
                  </li>
                );
              })}
            </ul>
            {confirmRestart ? (
              <div className="row">
                <span className="hint">Start a new run? This run's result stays saved.</span>
                <button
                  type="button"
                  className="btn btn--quiet btn--small"
                  onClick={async () => {
                    await persistence.clearSession();
                    dispatch({ type: 'RESET' });
                  }}
                >
                  Yes, restart
                </button>
                <button type="button" className="btn btn--link btn--small" onClick={() => setConfirmRestart(false)}>
                  Cancel
                </button>
              </div>
            ) : (
              <div className="row">
                <button type="button" className="btn btn--primary" onClick={() => setView('story')}>
                  {UI.endingWhat}
                  <ArrowIcon />
                </button>
                <button type="button" className="btn btn--quiet" onClick={() => setView('reflect')}>
                  {UI.endingReflect}
                </button>
                <button type="button" className="btn btn--quiet" onClick={() => setJourney(true)}>
                  {UI.endingJourney}
                </button>
                <button type="button" className="btn btn--link btn--small" onClick={() => setConfirmRestart(true)}>
                  {UI.endingRestart}
                </button>
              </div>
            )}
          </>
        )}

        {view === 'story' && (
          <>
            <div className="story" aria-live="polite">
              {whyOpen ? <p>{ENDING_FEEDBACK}</p> : paragraphs.map((p) => <p key={p}>{p}</p>)}
            </div>
            <div className="row">
              <button type="button" className="btn btn--primary" onClick={() => setView('summary')} autoFocus>
                Back
              </button>
              <button type="button" className="btn btn--quiet" aria-pressed={whyOpen} onClick={() => setWhyOpen((w) => !w)}>
                {whyOpen ? 'What happened' : 'Why this ending'}
              </button>
            </div>
          </>
        )}

        {view === 'reflect' && (
          <>
            <Prompt step={`Reflection ${reflectIndex + 1} of ${prompts.length} · optional, not scored`}>{prompts[reflectIndex]}</Prompt>
            <VoiceField
              key={reflectIndex}
              label={`Reflection ${reflectIndex + 1}`}
              showLabel={false}
              value={sim.reflection[reflectIndex] ?? ''}
              onChange={(text) => dispatch({ type: 'SET_REFLECTION', index: reflectIndex, text })}
              rows={3}
            />
            <div className="row">
              {reflectIndex < prompts.length - 1 ? (
                <button type="button" className="btn btn--primary" onClick={() => setReflectIndex(reflectIndex + 1)}>
                  Next
                  <ArrowIcon />
                </button>
              ) : (
                <button type="button" className="btn btn--primary" onClick={() => setView('summary')}>
                  Done
                </button>
              )}
              {reflectIndex > 0 && (
                <button type="button" className="btn btn--quiet" onClick={() => setReflectIndex(reflectIndex - 1)}>
                  Previous
                </button>
              )}
              <button type="button" className="btn btn--link btn--small" onClick={() => setView('summary')}>
                Close
              </button>
            </div>
          </>
        )}
      </Stage>
      <JourneyDialog open={journey} onClose={() => setJourney(false)} sim={sim} />
    </>
  );
}
