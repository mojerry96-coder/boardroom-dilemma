import { useEffect, useRef, useState } from 'react';
import { LOGO_STING } from '../assets';
import { prefersReducedMotion } from './Reveal';

// The DBA · MIVA Open University logo animation: it opens the simulation and marks its major transitions.

const isSafari = typeof navigator !== 'undefined' && /^((?!chrome|chromium|android|crios|fxios|edg).)*safari/i.test(navigator.userAgent);

/** The animated mark. Reduced motion (or a video that fails to load) shows the finished mark instead. */
export function LogoSting({ className }: { className?: string }) {
  const [still, setStill] = useState(prefersReducedMotion);
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    // Muted must be set as a property for autoplay to be allowed everywhere.
    v.muted = true;
    v.defaultMuted = true;
    v.play().catch(() => {});
    // Browsers pause muted video while the page is hidden; carry on when it is shown again.
    const resume = () => {
      if (!document.hidden && v.paused && !v.ended) v.play().catch(() => {});
    };
    document.addEventListener('visibilitychange', resume);
    return () => document.removeEventListener('visibilitychange', resume);
  }, [still]);

  const cls = `logo-sting${className ? ` ${className}` : ''}`;
  if (still) return <img className={cls} src={LOGO_STING.still} alt="" aria-hidden="true" />;
  return (
    <video
      ref={ref}
      className={cls}
      src={isSafari ? LOGO_STING.hevc : LOGO_STING.webm}
      autoPlay
      muted
      playsInline
      preload="auto"
      aria-hidden="true"
      onError={() => setStill(true)}
    />
  );
}

/** Full-screen opening: the logo builds while the app loads, holds briefly, then fades into the simulation. */
export function LogoSplash({ ready, onDone }: { ready: boolean; onDone: () => void }) {
  const [held, setHeld] = useState(false);
  const leaving = held && ready;

  useEffect(() => {
    const id = window.setTimeout(() => setHeld(true), prefersReducedMotion() ? 1200 : LOGO_STING.buildMs + 1500);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!leaving) return;
    const id = window.setTimeout(onDone, 600);
    return () => window.clearTimeout(id);
  }, [leaving, onDone]);

  return (
    <div className={`logo-splash${leaving ? ' is-leaving' : ''}`} role="img" aria-label="DBA, Miva Open University. The Boardroom Dilemma is loading.">
      <LogoSting className="logo-splash__mark" />
      <p className="logo-splash__title" aria-hidden="true">
        The Boardroom Dilemma
      </p>
      {!held && (
        <button type="button" className="chapter-card__skip" onClick={() => setHeld(true)}>
          Skip
        </button>
      )}
    </div>
  );
}
