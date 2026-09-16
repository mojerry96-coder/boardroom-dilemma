import { useMemo, useState, type CSSProperties } from 'react';
import { Quotes } from '@phosphor-icons/react';
import { PORTRAIT_BACKDROPS, PORTRAITS, SCENES, STAKEHOLDER_CLIPS } from '../assets';
import { usePageIntro } from '../components/Experience';
import { Picture } from '../components/Picture';
import { PresenceClip } from '../components/SpeakerCard';
import { useSpeakOnce } from '../components/Narration';
import { revealTiming, TYPE_SPEED, TypeText, useDelayed } from '../components/Reveal';
import { SimulationStage } from '../components/SimulationStage';
import { OutcomePanel, PillButton, StageCopy } from '../components/ui';
import { BRAND, NARRATION, PAGE_META, STAKEHOLDERS } from '../sim/content';
import { stakeholderExtras } from '../sim/derive';
import { OBJECTIVES } from '../sim/experience';
import { shuffled } from '../sim/shuffle';
import { useSim } from '../sim/store';
import { OPTS, type Opt, type StakeholderId } from '../sim/types';

// Page 06 — Stakeholder Pressure (spec §17). One stakeholder in the hero at a time;
// answered stakeholders move into the "They'll remember" strip.

const SUBTITLE = 'One conversation at a time. Every promise will be remembered.';
/** The voice starts this long after a stakeholder is shown (see useSpeakOnce). */
const VOICE_LEAD_MS = 400;

const imageOf = (id: StakeholderId) => (id === 'regulator' ? SCENES.regulator.src : PORTRAITS[id].src);

export function Page06Stakeholders() {
  const { sim, dispatch } = useSim();
  const [showing, setShowing] = useState<StakeholderId | null>(null);
  const [selected, setSelected] = useState<Opt | null>(null);
  const firstOpen = STAKEHOLDERS.find((s) => !sim.stakeholderResponses[s.id]);
  const active = STAKEHOLDERS.find((s) => s.id === showing) ?? firstOpen ?? STAKEHOLDERS[STAKEHOLDERS.length - 1];
  const answer = sim.stakeholderResponses[active.id];
  const order = useMemo(() => shuffled(OPTS, sim.seed, `stakeholder-${active.id}`), [sim.seed, active.id]);

  const intro = usePageIntro('stakeholders', NARRATION.stakeholdersLoad, firstOpen === STAKEHOLDERS[0]);
  const timing = revealTiming(PAGE_META[6].title, SUBTITLE, OBJECTIVES[6]);
  const [firstShown] = useState(active.id);
  const openingDelay = intro.animate ? timing.controlsAt : 0;
  const onStage = useDelayed(intro.ready, openingDelay);

  // The stakeholder speaks once they are on screen; their words type in with the voice, then the choices appear.
  const spoken = useSpeakOnce(`stakeholder-${active.id}`, active.line, !answer && onStage);
  const quoteDelay = (active.id === firstShown ? openingDelay : 0) + VOICE_LEAD_MS;

  const remembered = STAKEHOLDERS.filter((s) => s.id !== active.id && sim.stakeholderResponses[s.id]);
  const isRegulator = active.id === 'regulator';
  const quoteSize = active.line.length > 150 ? 'is-long' : active.line.length > 100 ? 'is-medium' : '';

  const respond = () => {
    if (!selected) return;
    dispatch({ type: 'CHOOSE_STAKEHOLDER', id: active.id, opt: selected });
    setShowing(active.id);
    setSelected(null);
  };

  return (
    <SimulationStage
      page={6}
      image={isRegulator ? SCENES.regulator : PORTRAIT_BACKDROPS[active.id as Exclude<StakeholderId, 'regulator'>]}
      label="Stakeholder Pressure"
      wash="strong"
      intro={intro}
      backdrop={
        // The stakeholder holds still until their line begins, then moves once and keeps looking at the player.
        isRegulator ? (
          <PresenceClip
            key={active.id}
            className="sim-stage__bg is-loaded page06__scene-clip"
            style={{ objectPosition: SCENES.regulator.position }}
            clip={STAKEHOLDER_CLIPS.regulator}
            play={onStage && !answer}
            still={!!answer}
          />
        ) : (
          <figure className="page06__portrait" key={active.id} role="img" aria-label={PORTRAITS[active.id as Exclude<StakeholderId, 'regulator'>].alt}>
            <PresenceClip clip={STAKEHOLDER_CLIPS[active.id]} play={onStage && !answer} still={!!answer} />
          </figure>
        )
      }
    >
      <StageCopy className="page06__copy" eyebrow={BRAND.eyebrow} title={PAGE_META[6].title} subtitle={SUBTITLE} objective={OBJECTIVES[6]} intro={intro}>
        <div className="page06__quote" key={active.id}>
          <p className="page06__quote-label">
            {active.name}
            <span className="page06__quote-role"> · {active.role}</span>
          </p>
          <blockquote className={`page06__quote-text ${quoteSize}`}>
            <Quotes className="page06__quote-mark" size={30} weight="fill" aria-hidden="true" />
            <TypeText text={`${active.line}”`} perChar={TYPE_SPEED.quote} delay={quoteDelay} animate={!answer} />
          </blockquote>
        </div>

        <div id="controls">
          {answer ? (
            <OutcomePanel
              className="page06__outcome"
              chosen={active.short[answer]}
              text={active.reaction[answer]}
              extra={stakeholderExtras(active.id, answer, sim)}
              feedback={active.feedback}
              continueLabel={firstOpen ? `Next: ${firstOpen.name}` : 'Continue'}
              onContinue={() => {
                if (firstOpen) setShowing(null);
                else dispatch({ type: 'GO', page: 7 });
              }}
            />
          ) : spoken ? (
            <div className="page06__choices stagger" role="group" aria-label={`Your response to ${active.name}`} key={active.id}>
              {order.map((opt, i) => (
                <button
                  key={opt}
                  type="button"
                  className="choice-row choice-row--light choice-row--numbered"
                  style={{ '--i': i } as CSSProperties}
                  aria-pressed={selected === opt}
                  onClick={() => setSelected(opt)}
                >
                  <span className="choice-row__num" aria-hidden="true">
                    {i + 1}
                  </span>
                  <span className="choice-row__body">
                    <span>{active.short[opt]}</span>
                    {selected === opt ? <span className="choice-row__full">{active.options[opt]}</span> : <span className="sr-only">. {active.options[opt]}</span>}
                  </span>
                </button>
              ))}
              {selected && (
                <div className="page06__respond">
                  <PillButton size="small" variant="blue" onClick={respond}>
                    Respond
                  </PillButton>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </StageCopy>

      {remembered.length > 0 && intro.ready && (
        <section className={`page06__memory${answer ? '' : ' is-choosing'}`} aria-label="They'll remember">
          <h2 className="page06__memory-title">They’ll remember</h2>
          <div className="page06__memory-grid">
            {remembered.map((s) => {
              const opt = sim.stakeholderResponses[s.id];
              return (
                <figure key={s.id} className="page06__memory-card">
                  <Picture src={imageOf(s.id)} alt="" sizes="160px" />
                  <figcaption>
                    <span className="page06__memory-name">{s.name}</span>
                    <span className="page06__memory-quote">You: {opt ? s.short[opt] : ''}</span>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </section>
      )}
    </SimulationStage>
  );
}
