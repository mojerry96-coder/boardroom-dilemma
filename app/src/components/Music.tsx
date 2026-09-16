import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { saveData } from '../media';
import { getFilmOpen, MUSIC, subscribeFilmOpen } from '../sound';
import { useNarration } from './Narration';

// Background score. One looping bed whose level follows the page, ducks under any spoken line,
// lifts on chapter cards and stops for films. It only ever starts after the player has interacted
// with the page, and it pauses when the tab is hidden.

const canOpus = typeof Audio !== 'undefined' && new Audio().canPlayType('audio/webm; codecs="opus"') !== '';

/** Slides the volume to `to` over `ms`; returns a cancel function. */
function ramp(el: HTMLAudioElement, to: number, ms: number) {
  const from = el.volume;
  const start = performance.now();
  let raf = requestAnimationFrame(function step(now) {
    const t = ms <= 0 ? 1 : Math.min(1, (now - start) / ms);
    el.volume = Math.max(0, Math.min(1, from + (to - from) * t));
    if (t < 1) raf = requestAnimationFrame(step);
  });
  return () => cancelAnimationFrame(raf);
}

export function BackgroundMusic({ page, chapterActive }: { page: number; chapterActive: boolean }) {
  // The score has its own switch: the volume button controls narration and character voices only.
  const { music, speaking } = useNarration();
  const filmOpen = useSyncExternalStore(subscribeFilmOpen, getFilmOpen, () => false);
  const player = useRef<HTMLAudioElement | null>(null);
  const [interacted, setInteracted] = useState(false);
  const [hidden, setHidden] = useState(() => typeof document !== 'undefined' && document.hidden);

  // Browsers only allow sound after the player interacts with the page, and a first attempt can still
  // be refused. Keep trying on every click or key until the score is actually playing.
  const wanted = useRef(0);
  useEffect(() => {
    const onGesture = () => {
      setInteracted(true);
      const el = player.current;
      if (el && el.paused && wanted.current > 0) {
        void el.play().then(() => ramp(el, wanted.current, MUSIC.fadeMs.in)).catch(() => {});
      }
    };
    window.addEventListener('pointerdown', onGesture);
    window.addEventListener('keydown', onGesture);
    return () => {
      window.removeEventListener('pointerdown', onGesture);
      window.removeEventListener('keydown', onGesture);
    };
  }, []);

  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  // Data saver skips the score altogether — it is a 1.4 MB download that the simulation works without.
  let target = music && interacted && !hidden && !saveData() ? (MUSIC.bed[page] ?? 0) : 0;
  if (filmOpen) target = 0;
  else if (chapterActive) target = Math.min(1, target * MUSIC.chapterSwell);
  if (speaking) target *= MUSIC.speakingDuck;
  wanted.current = target;

  useEffect(() => {
    const el = player.current;
    if (!el || (target <= 0 && el.paused)) return;
    if (target > 0) {
      const fade = el.paused ? MUSIC.fadeMs.in : MUSIC.fadeMs.change;
      if (el.paused) void el.play().catch(() => {});
      return ramp(el, target, fade);
    }
    // Fade out, but keep the element running for a few seconds: page changes and films come and go,
    // and pausing immediately would make the score stop and restart during a transition.
    const cancel = ramp(el, 0, MUSIC.fadeMs.out);
    const id = window.setTimeout(() => el.pause(), MUSIC.fadeMs.out + MUSIC.idlePauseMs);
    return () => {
      cancel();
      window.clearTimeout(id);
    };
  }, [target]);

  useEffect(
    () => () => {
      player.current?.pause();
    },
    [],
  );

  // A real element (silent until it plays) rather than a detached one: nothing downloads while
  // preload is "none", and the score can be inspected like any other media on the page.
  return (
    <audio
      ref={(el) => {
        player.current = el;
        // Elements start at full volume; the score always fades up from silence.
        if (el && !el.dataset.ready) {
          el.dataset.ready = 'yes';
          el.volume = 0;
        }
      }}
      src={MUSIC.src(canOpus)}
      loop
      preload="none"
      aria-hidden="true"
    />
  );
}
