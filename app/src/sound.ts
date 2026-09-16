import { useEffect } from 'react';

// The score: where music plays, how loud, and when it steps aside.
//
// Levels are gains on a bed mastered to −26 LUFS with a dip through the speech frequencies
// (see media/README.md), so 0.5 sits about 6 dB below that — present, never competing.
// Reading, listening and writing pages stay quietest; the opening, the crisis and the Board carry more.

const base = import.meta.env.BASE_URL;

export const MUSIC = {
  /** Opus where it plays, MP3 everywhere else. */
  src: (opus: boolean) => `${base}music/${opus ? 'score.webm' : 'score.mp3'}`,
  bed: {
    1: 0.55, // opening: cinematic
    2: 0.4, // briefing
    3: 0.26, // evidence desk: reading
    4: 0.44, // crisis decision
    5: 0.3, // accountability: weighing
    6: 0.22, // stakeholders: their voices carry the scene
    7: 0.44, // executive pressure
    8: 0.2, // board case: writing
    9: 0.5, // facing the Board
    10: 0.58, // outcome
  } as Record<number, number>,
  /** Chapter cards lift briefly, so each act break lands. */
  chapterSwell: 1.25,
  /** Narration and character voices push the bed down about 10 dB. */
  speakingDuck: 0.32,
  fadeMs: { in: 1800, change: 600, out: 900 },
  /** How long the silent bed keeps running before it is paused (covers page and film transitions). */
  idlePauseMs: 5000,
};

let openFilms = 0;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((listen) => listen());

export const subscribeFilmOpen = (onChange: () => void) => {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
};

export const getFilmOpen = () => openFilms > 0;

/** While a film is on screen the score stops — the film carries its own sound. */
export function useFilmMusicPause() {
  useEffect(() => {
    openFilms++;
    emit();
    return () => {
      openFilms--;
      emit();
    };
  }, []);
}
