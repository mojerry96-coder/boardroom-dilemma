import { useState, type ReactNode } from 'react';
import { FILMS, SCENES } from '../assets';
import { ChoicePicker, OutcomeCard } from '../components/Choices';
import { ContextView, DockHeader, MediaQuote } from '../components/Dock';
import { FilmPlayer } from '../components/FilmPlayer';
import { PlayIcon } from '../components/Icons';
import { useNarration } from '../components/Narration';
import { Stage } from '../components/Stage';
import { EXEC_SETUP_FILM, EXECUTIVE, PAGE_META, UI, execBranchFilm } from '../sim/content';
import { useSim } from '../sim/store';

// Screen 6 — setup clip → held frame with his line on the media → reply → branch clip → outcome.

type Phase = 'setup' | 'choose' | 'branch' | 'done';

export function Page07Executive() {
  const { sim, dispatch } = useSim();
  const { say } = useNarration();
  const chosen = sim.executiveResponse;
  const [phase, setPhase] = useState<Phase>(chosen ? 'done' : 'setup');
  const [ctx, setCtx] = useState(false);

  let body: ReactNode = null;
  if (ctx) {
    body = (
      <ContextView onBack={() => setCtx(false)}>
        <p>{EXECUTIVE.situation}</p>
      </ContextView>
    );
  } else if (phase === 'choose') {
    body = (
      <>
        <ChoicePicker
          prompt={UI.execPrompt}
          labels={EXECUTIVE.short}
          options={EXECUTIVE.options}
          seed={sim.seed}
          shuffleKey="executive"
          confirmLabel="Respond"
          onConfirm={(opt) => {
            dispatch({ type: 'CHOOSE_EXECUTIVE', opt });
            setPhase('branch');
          }}
        />
        <div className="row">
          <button type="button" className="btn btn--link btn--small" onClick={() => setPhase('setup')}>
            <PlayIcon width={14} height={14} />
            Replay scene
          </button>
        </div>
      </>
    );
  } else if (phase === 'done' && chosen) {
    body = (
      <OutcomeCard
        chosen={EXECUTIVE.short[chosen]}
        text={EXECUTIVE.reaction[chosen]}
        feedback={EXECUTIVE.feedback[chosen]}
        onContinue={() => dispatch({ type: 'GO', page: 8 })}
      />
    );
  }

  return (
    <>
      <Stage
        image={SCENES.executive}
        label="Executive pressure"
        dockHidden={phase === 'setup' || phase === 'branch'}
        quote={phase === 'choose' && !ctx ? <MediaQuote speaker={`${EXECUTIVE.name} · ${EXECUTIVE.role}`} text={EXECUTIVE.line} /> : undefined}
      >
        <DockHeader page={7} title={PAGE_META[7].title} onContext={() => setCtx((c) => !c)} contextOpen={ctx} />
        {body}
      </Stage>

      {phase === 'setup' && (
        <FilmPlayer
          title="Executive Pressure — the corridor"
          cues={EXEC_SETUP_FILM}
          video={FILMS.executiveSetup}
          skipLabel="Skip scene"
          onEnd={() => setPhase(chosen ? 'done' : 'choose')}
        />
      )}
      {phase === 'branch' && chosen && (
        <FilmPlayer
          title="Executive Pressure — his reaction"
          cues={execBranchFilm(chosen)}
          video={FILMS.executiveBranch[chosen]}
          skipLabel="Skip"
          onEnd={() => {
            setPhase('done');
            say(EXECUTIVE.bridge[chosen]);
          }}
        />
      )}
    </>
  );
}
