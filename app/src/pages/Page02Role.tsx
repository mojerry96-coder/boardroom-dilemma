import { useEffect, useState, type CSSProperties } from 'react';
import { CaretRight, HeartBreak, Money, Newspaper, User } from '@phosphor-icons/react';
import { SCENES } from '../assets';
import { DocumentDialog } from '../components/Documents';
import { MissionList, usePageIntro } from '../components/Experience';
import { useNarration } from '../components/Narration';
import { Reveal, TypeText } from '../components/Reveal';
import { SimulationStage } from '../components/SimulationStage';
import { PillButton, StageCopy, TextLink } from '../components/ui';
import { NARRATION, PAGE_META, ROLE, UI } from '../sim/content';
import { BRIEFING } from '../sim/experience';
import { DOCUMENTS } from '../sim/documents';
import { useSim } from '../sim/store';

// Page 02 — the guided briefing: who you are → what happened → what you'll do → sign in.
// Each beat is narrated; its Continue appears once the narration has finished.

type Beat = 0 | 1 | 2 | 3;

const FACT_ICONS = [<HeartBreak key="a" size={22} />, <Money key="b" size={22} />, <Newspaper key="c" size={22} />];
const BEAT_NARRATION = [NARRATION.role, BRIEFING.narrationFacts, BRIEFING.narrationMission];

export function Page02Role() {
  const { sim, dispatch } = useSim();
  const { say, stop } = useNarration();
  const [beat, setBeat] = useState<Beat>(sim.learnerName.trim().length >= 2 ? 3 : 0);
  const [spoken, setSpoken] = useState<number>(-1);
  const [brief, setBrief] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const intro = usePageIntro('role', null);
  const ready = sim.learnerName.trim().length >= 2;

  // Narrate the current beat once the chapter card has cleared.
  useEffect(() => {
    if (!intro.ready || beat > 2 || spoken >= beat) return;
    const current = beat;
    const id = window.setTimeout(() => say(BEAT_NARRATION[current], () => setSpoken(current)), 500);
    return () => window.clearTimeout(id);
  }, [intro.ready, beat, spoken, say]);

  const advance = () => {
    stop();
    setSpoken(beat);
    setBeat((b) => Math.min(3, b + 1) as Beat);
  };
  const beatDone = spoken >= beat;
  const copy = beat < 3 ? BRIEFING.beats[beat] : null;

  return (
    <>
      <SimulationStage page={2} image={SCENES.role} label="Your Role in the Crisis">
        <StageCopy className="page02__copy" title={PAGE_META[2].title} subtitle={PAGE_META[2].subtitle} intro={intro}>
          {copy && (
            <section className="briefing" id="controls" aria-live="polite">
              <div className="briefing__card glass-panel--dark" key={beat}>
                <div className="briefing__steps" aria-label={`Briefing ${beat + 1} of 3`}>
                  {[0, 1, 2].map((i) => (
                    <i key={i} className={i <= beat ? 'is-on' : undefined} />
                  ))}
                </div>
                <p className="briefing__kicker">{copy.kicker}</p>
                <h2 className="briefing__title">
                  <TypeText text={copy.title} perChar={34} />
                </h2>
                {copy.text && (
                  <Reveal show delay={copy.title.length * 34 + 150} as="p" className="briefing__text">
                    {copy.text}
                  </Reveal>
                )}
                {beat === 1 && (
                  <ul className="briefing__facts stagger" style={{ '--stagger-base': '600ms' } as CSSProperties}>
                    {BRIEFING.facts.map((fact, i) => (
                      <li key={fact.title} className="briefing__fact" style={{ '--i': i * 3 } as CSSProperties}>
                        <span className="briefing__fact-icon" aria-hidden="true">
                          {FACT_ICONS[i]}
                        </span>
                        <span>
                          <span className="briefing__fact-title">{fact.title}</span>
                          <span className="briefing__fact-text">{fact.text}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                {beat === 2 && <MissionList page={2} animate />}
                <Reveal show={beatDone} className="briefing__actions">
                  <PillButton size="small" icon="none" onClick={advance} autoFocus>
                    {BRIEFING.next}
                    <CaretRight size={16} aria-hidden="true" />
                  </PillButton>
                  <TextLink onClick={() => setBrief(true)}>{UI.readBrief}</TextLink>
                </Reveal>
                {!beatDone && (
                  <div className="briefing__actions">
                    <TextLink onClick={advance}>Skip narration</TextLink>
                  </div>
                )}
              </div>
            </section>
          )}
        </StageCopy>

        {beat === 3 && intro.ready && (
          <form
            className="page02__form reveal"
            id="controls"
            onSubmit={(e) => {
              e.preventDefault();
              setAttempted(true);
              if (ready) dispatch({ type: 'GO', page: 3 });
            }}
          >
            <p className="page02__sign">{BRIEFING.signPrompt}</p>
            <label className="page02__field">
              <User size={20} aria-hidden="true" />
              <span className="sr-only">{ROLE.nameLabel}</span>
              <input
                className="page02__input"
                autoComplete="name"
                placeholder={ROLE.namePlaceholder}
                value={sim.learnerName}
                autoFocus
                aria-invalid={attempted && !ready ? true : undefined}
                aria-describedby={attempted && !ready ? 'name-error' : undefined}
                onChange={(e) => dispatch({ type: 'SET_NAME', name: e.target.value })}
              />
            </label>
            {attempted && !ready && (
              <p className="page02__error" id="name-error" role="alert">
                Enter at least two characters to begin.
              </p>
            )}
            <PillButton type="submit" variant="green" icon="none" aria-disabled={!ready || undefined} className={ready ? undefined : 'is-waiting'}>
              {ROLE.begin}
              <CaretRight size={18} aria-hidden="true" />
            </PillButton>
            <TextLink onClick={() => setBeat(0)}>Replay the briefing</TextLink>
          </form>
        )}
      </SimulationStage>
      <DocumentDialog doc={brief ? DOCUMENTS.brief : null} onClose={() => setBrief(false)} />
    </>
  );
}
