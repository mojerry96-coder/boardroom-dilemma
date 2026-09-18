import { createContext, useCallback, useContext, useEffect, useRef, useState, type CSSProperties } from 'react';
import { Check } from '@phosphor-icons/react';
import { EXECUTIVE, FRAMING, SELF_REPORT } from '../sim/content';
import { primaryFailureText } from '../sim/derive';
import { CHAPTERS, MISSION } from '../sim/experience';
import { useSim } from '../sim/store';
import type { SimState } from '../sim/types';
import { LOGO_STING } from '../assets';
import { useModal } from './Documents';
import { LogoSting } from './LogoSting';
import { useNarration } from './Narration';
import { prefersReducedMotion, TypeText, type PageIntro } from './Reveal';

// The guided layer: chapter cards between pages, the narration-first page opening, and the mission map.

interface ExperienceValue {
  chapterActive: boolean;
}

export const ExperienceContext = createContext<ExperienceValue>({ chapterActive: false });

export const useExperience = () => useContext(ExperienceContext);

/**
 * Narration first, interface second. The page's UI is hidden until its opening line has been
 * spoken (or skipped). `fresh` is false when a player returns to a page they have already started.
 */
export function usePageIntro(key: string, narration: string | string[] | null, fresh = true): PageIntro {
  const { say, stop } = useNarration();
  const { chapterActive } = useExperience();
  // Freshness is decided on arrival; the first choice on a page must not cancel the reveal already running.
  const [arrivedFresh] = useState(fresh);
  const [ready, setReady] = useState(!fresh || !narration);
  const narrationRef = useRef(narration);
  narrationRef.current = narration;

  useEffect(() => {
    if (ready || chapterActive || !narrationRef.current) return;
    const id = window.setTimeout(() => say(narrationRef.current as string | string[], () => setReady(true)), 350);
    return () => window.clearTimeout(id);
  }, [key, ready, chapterActive, say]);

  const skip = useCallback(() => {
    stop();
    setReady(true);
  }, [stop]);

  return { ready: ready && !chapterActive, animate: arrivedFresh, skip };
}

/** "Previously…" — what the player just did, in one line. */
function previouslyLine(sim: SimState, page: number): string | null {
  switch (page) {
    case 3:
      return sim.learnerName.trim() ? `${sim.learnerName.trim()}, you have signed the brief.` : 'You have signed the brief.';
    case 4:
      return sim.evidence.complete
        ? sim.reviewOrderCorrect
          ? 'You verified the record in a defensible order.'
          : 'You reviewed the record, after reaching ahead once.'
        : null;
    case 5:
      return sim.boardFraming && sim.selfReportDecision
        ? `You framed it as “${FRAMING.short[sim.boardFraming]}” and chose: ${SELF_REPORT.short[sim.selfReportDecision].toLowerCase()}.`
        : null;
    case 6:
      return sim.accountability.round2 ? `Your diagnosis weights ${primaryFailureText(sim.accountability.round2)} highest.` : null;
    case 7:
      return 'You answered the regulator, the workers, the press and the family.';
    case 8:
      return sim.executiveResponse ? `You told Chidi Okafor: ${EXECUTIVE.short[sim.executiveResponse]}.` : null;
    case 9:
      return sim.boardCase.locked ? 'Your Board case is locked.' : null;
    case 10:
      return 'You have answered the Board.';
    default:
      return null;
  }
}

function HoursCounter({ from, to, delay = 0 }: { from: number; to: number; delay?: number }) {
  const [value, setValue] = useState(from);
  useEffect(() => {
    let raf = 0;
    const start = performance.now() + 250 + delay;
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - start) / 900));
      setValue(Math.round(from + (to - from) * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [from, to, delay]);
  return <span className="chapter-card__hours">{value}</span>;
}

/** Full-screen card between pages: time left, chapter title and one narrated bridge line. */
export function ChapterCard({ page, onDone }: { page: number; onDone: () => void }) {
  const chapter = CHAPTERS[page];
  const { sim } = useSim();
  const { say, stop } = useNarration();
  const [leaving, setLeaving] = useState(false);
  const finished = useRef(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    setLeaving(true);
    window.setTimeout(() => onDoneRef.current(), 480);
  }, []);

  // On major transitions the logo builds first; everything else waits for it.
  const lead = chapter.sting && !prefersReducedMotion() ? LOGO_STING.buildMs : 0;

  useEffect(() => {
    const shownAt = performance.now();
    const id = window.setTimeout(
      () =>
        say(chapter.bridge, () => {
          const remaining = Math.max(0, 3200 + lead - (performance.now() - shownAt));
          window.setTimeout(finish, remaining + 600);
        }),
      900 + lead,
    );
    return () => window.clearTimeout(id);
  }, [chapter.bridge, lead, say, finish]);

  const previously = previouslyLine(sim, page);
  const fromHours = CHAPTERS[page - 1]?.hoursLeft ?? chapter.hoursLeft;

  return (
    <div
      className={`chapter-card${chapter.sting ? ' has-sting' : ''}${leaving ? ' is-leaving' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={`${chapter.title}. ${chapter.bridge}`}
    >
      <div className="chapter-card__inner" style={{ '--lead': `${lead}ms` } as CSSProperties}>
        {chapter.sting && <LogoSting className="chapter-card__sting" />}
        {previously && <p className="chapter-card__previously">Previously · {previously}</p>}
        <p className="chapter-card__clock" aria-hidden="true">
          {chapter.hoursLeft > 0 ? (
            <>
              <HoursCounter from={fromHours} to={chapter.hoursLeft} delay={lead} /> hours to the Board
            </>
          ) : (
            'The Board has met'
          )}
        </p>
        <h2 className="chapter-card__title">
          <TypeText text={chapter.title} perChar={55} delay={350 + lead} />
        </h2>
        <p className="chapter-card__bridge">
          <TypeText text={chapter.bridge} perChar={62} delay={1000 + lead} />
        </p>
      </div>
      <button
        type="button"
        className="chapter-card__skip"
        onClick={() => {
          stop();
          finish();
        }}
        autoFocus
      >
        Continue
      </button>
    </div>
  );
}

/** Where am I, what's done and what's next. */
export function MissionMap({ open, onClose, page }: { open: boolean; onClose: () => void; page: number }) {
  const modal = useModal(open, onClose);
  return (
    <dialog {...modal} className="doc-dialog mission-dialog" aria-labelledby="mission-title">
      {open && (
        <div className="doc-dialog__frame">
          <div className="mission">
            <p className="mission__kicker">{CHAPTERS[page] ? `${CHAPTERS[page].hoursLeft} hours to the Board` : 'Seventy-two hours to the Board'}</p>
            <h2 id="mission-title" className="mission__title">
              Your mission
            </h2>
            <MissionList page={page} />
            <button type="button" className="primary-pill primary-pill--white primary-pill--small mission__close" onClick={onClose} autoFocus>
              <span>Back to the simulation</span>
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}

export function MissionList({ page, animate = false }: { page: number; animate?: boolean }) {
  return (
    <ol className={`mission__list${animate ? ' stagger' : ''}`}>
      {MISSION.map((stage, i) => {
        const state = stage.page < page ? 'done' : stage.page === page ? 'current' : 'next';
        return (
          <li key={stage.page} className={`mission__stage is-${state}`} style={{ '--i': i } as CSSProperties}>
            <span className="mission__dot" aria-hidden="true">
              {state === 'done' ? <Check size={14} /> : i + 1}
            </span>
            <span>
              <span className="mission__stage-title">
                {stage.title}
                {state === 'current' && <span className="mission__here"> · You are here</span>}
              </span>
              <span className="mission__stage-text">{stage.text}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
