import { useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { ChatCircle, Clock, Shield, Users } from '@phosphor-icons/react';
import { FILMS, SCENES } from '../assets';
import { useExperience } from '../components/Experience';
import { FilmPlayer } from '../components/FilmPlayer';
import { useNarration } from '../components/Narration';
import { revealTiming, type PageIntro } from '../components/Reveal';
import { OBJECTIVES } from '../sim/experience';
import { SimulationStage } from '../components/SimulationStage';
import { OutcomePanel, PillButton, StageCopy, TextLink } from '../components/ui';
import { BRAND, EXEC_SETUP_FILM, EXECUTIVE, PAGE_META, execBranchFilm } from '../sim/content';
import { shuffled } from '../sim/shuffle';
import { useSim } from '../sim/store';
import { OPTS, type Opt } from '../sim/types';

// Page 07 — Executive Pressure (spec §18): setup clip → choices fade in → branch clip → bridge.
// Keeps the script's four responses, one film per branch.

type Phase = 'setup' | 'choose' | 'branch' | 'done';

const ICONS: Record<Opt, ReactNode> = {
  A: <Users size={22} />,
  B: <Shield size={22} />,
  C: <ChatCircle size={22} />,
  D: <Clock size={22} />,
};

const SUBTITLE = 'Internal power now pushes back against the truth.';
const noop = () => {};

export function Page07Executive() {
  const { sim, dispatch } = useSim();
  const { say } = useNarration();
  const { chapterActive } = useExperience();
  const chosen = sim.executiveResponse;
  const [phase, setPhase] = useState<Phase>(chosen ? 'done' : 'setup');
  const [selected, setSelected] = useState<Opt | null>(null);
  const [filmPlayed, setFilmPlayed] = useState(false);
  const order = useMemo(() => shuffled(OPTS, sim.seed, 'executive'), [sim.seed]);

  // The film is this page's opening; the title and choices reveal as it ends.
  const intro: PageIntro = { ready: true, animate: filmPlayed, skip: noop };
  const timing = revealTiming(PAGE_META[7].title, SUBTITLE, OBJECTIVES[7]);
  const endFilm = (next: Phase) => {
    setFilmPlayed(true);
    setPhase(next);
  };

  return (
    <>
      <SimulationStage page={7} image={SCENES.executive} label="Executive Pressure" wash="strong">
        {phase !== 'setup' && phase !== 'branch' && (
          <StageCopy className="page07__copy" eyebrow={BRAND.eyebrow} title={PAGE_META[7].title} subtitle={SUBTITLE} objective={OBJECTIVES[7]} intro={intro}>
            <div id="controls">
              {phase === 'done' && chosen ? (
                <OutcomePanel
                  className="page07__outcome"
                  chosen={EXECUTIVE.short[chosen]}
                  text={EXECUTIVE.reaction[chosen]}
                  feedback={EXECUTIVE.feedback[chosen]}
                  onContinue={() => dispatch({ type: 'GO', page: 8 })}
                />
              ) : (
                <>
                  <div
                    className={`page07__choice-stack${filmPlayed ? ' stagger' : ''}`}
                    style={{ '--stagger-base': `${timing.controlsAt}ms` } as CSSProperties}
                    role="group"
                    aria-label={`Your response to ${EXECUTIVE.name}`}
                  >
                    {order.map((opt, i) => (
                      <button
                        key={opt}
                        type="button"
                        className="choice-row choice-row--light"
                        style={{ '--i': i } as CSSProperties}
                        aria-pressed={selected === opt}
                        title={EXECUTIVE.options[opt]}
                        onClick={() => setSelected(opt)}
                      >
                        <span className="choice-row__icon" aria-hidden="true">
                          {ICONS[opt]}
                        </span>
                        {EXECUTIVE.short[opt]}
                      </button>
                    ))}
                  </div>
                  <p className="page07__said" aria-live="polite">
                    {selected ? `You’ll say: “${EXECUTIVE.options[selected]}”` : ''}
                  </p>
                  <div className="page07__continue">
                    <PillButton
                      variant="blue"
                      disabled={!selected}
                      onClick={() => {
                        if (!selected) return;
                        dispatch({ type: 'CHOOSE_EXECUTIVE', opt: selected });
                        setPhase('branch');
                      }}
                    >
                      Continue Scenario
                    </PillButton>
                    <TextLink onClick={() => setPhase('setup')}>Replay scene</TextLink>
                  </div>
                </>
              )}
            </div>
          </StageCopy>
        )}
      </SimulationStage>

      {phase === 'setup' && !chapterActive && (
        <FilmPlayer
          title="Executive Pressure — the corridor"
          cues={EXEC_SETUP_FILM}
          video={FILMS.executiveSetup}
          skipLabel="Skip scene"
          countdown={filmPlayed ? 0 : 3}
          onEnd={() => endFilm(chosen ? 'done' : 'choose')}
        />
      )}
      {phase === 'branch' && chosen && (
        <FilmPlayer
          title="Executive Pressure — his reaction"
          cues={execBranchFilm(chosen)}
          video={FILMS.executiveBranch[chosen]}
          skipLabel="Skip"
          onEnd={() => {
            endFilm('done');
            say(EXECUTIVE.bridge[chosen]);
          }}
        />
      )}
    </>
  );
}
