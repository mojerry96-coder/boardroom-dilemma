import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { voiceFor } from '../voice';

// Page narration with captions. Lines with a recording play in the films' narrator voice
// (see voice.ts); anything else falls back to speech synthesis. Captions always carry the words.

interface Prefs {
  audio: boolean;
  captions: boolean;
}

interface NarrationValue extends Prefs {
  caption: string | null;
  /** Narrate with captions; onDone runs when the whole queue has finished (not when interrupted). */
  say: (text: string | string[], onDone?: () => void) => void;
  stop: () => void;
  setAudio: (on: boolean) => void;
  setCaptions: (on: boolean) => void;
  /** Speak a single line without touching the caption (films render their own captions). */
  speakOnly: (text: string) => void;
}

const PREFS_KEY = 'boardroom-dilemma:prefs';

function loadPrefs(): Prefs {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (raw) return { audio: true, captions: true, ...(JSON.parse(raw) as Partial<Prefs>) };
  } catch {
    /* ignore */
  }
  return { audio: true, captions: true };
}

const NarrationContext = createContext<NarrationValue | null>(null);

const synth = () => (typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null);

function pickVoice(): SpeechSynthesisVoice | undefined {
  const voices = synth()?.getVoices() ?? [];
  return voices.find((v) => v.lang === 'en-GB') ?? voices.find((v) => v.lang.startsWith('en'));
}

export function NarrationProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<Prefs>(loadPrefs);
  const [caption, setCaption] = useState<string | null>(null);
  const queue = useRef<string[]>([]);
  const queueDone = useRef<(() => void) | undefined>(undefined);
  const timer = useRef<number | undefined>(undefined);
  const player = useRef<HTMLAudioElement | null>(null);
  const prefsRef = useRef(prefs);
  prefsRef.current = prefs;

  useEffect(() => {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    } catch {
      /* ignore */
    }
  }, [prefs]);

  const silence = useCallback(() => {
    const a = player.current;
    if (a) {
      a.onended = null;
      a.onerror = null;
      a.pause();
    }
    synth()?.cancel();
  }, []);

  const clear = useCallback(() => {
    window.clearTimeout(timer.current);
    silence();
  }, [silence]);

  /** Speak one line in the recorded voice (or synthesis as a fallback); calls onDone when finished. */
  const speak = useCallback((line: string, onDone?: () => void) => {
    const url = voiceFor(line);
    if (url) {
      const a = (player.current ??= new Audio());
      a.onended = () => onDone?.();
      a.onerror = () => onDone?.();
      a.src = url;
      a.play().catch(() => onDone?.());
      return;
    }
    const s = synth();
    if (!s) return onDone?.();
    s.cancel();
    const u = new SpeechSynthesisUtterance(line);
    const voice = pickVoice();
    if (voice) u.voice = voice;
    u.rate = 0.98;
    u.onend = () => onDone?.();
    u.onerror = () => onDone?.();
    s.speak(u);
  }, []);

  const next = useCallback(() => {
    const line = queue.current.shift();
    if (line === undefined) {
      setCaption(null);
      const done = queueDone.current;
      queueDone.current = undefined;
      done?.();
      return;
    }
    setCaption(line);
    const readingMs = Math.max(2600, line.split(/\s+/).length * 380 + 900);
    if (prefsRef.current.audio) {
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(next, 500);
      };
      speak(line, finish);
      // Safety net if playback never reports an end (or is blocked without a user gesture).
      timer.current = window.setTimeout(finish, readingMs + 6000);
    } else {
      timer.current = window.setTimeout(next, readingMs);
    }
  }, [speak]);

  const say = useCallback(
    (text: string | string[], onDone?: () => void) => {
      clear();
      queue.current = Array.isArray(text) ? [...text] : [text];
      queueDone.current = onDone;
      next();
    },
    [clear, next],
  );

  const stop = useCallback(() => {
    clear();
    queue.current = [];
    queueDone.current = undefined;
    setCaption(null);
  }, [clear]);

  const speakOnly = useCallback(
    (text: string) => {
      if (!prefsRef.current.audio) return;
      silence();
      speak(text);
    },
    [silence, speak],
  );

  useEffect(() => () => clear(), [clear]);

  const value = useMemo<NarrationValue>(
    () => ({
      ...prefs,
      caption,
      say,
      stop,
      speakOnly,
      setAudio: (audio) => {
        if (!audio) silence();
        setPrefs((p) => ({ ...p, audio }));
      },
      setCaptions: (captions) => setPrefs((p) => ({ ...p, captions })),
    }),
    [prefs, caption, say, stop, speakOnly, silence],
  );

  return <NarrationContext.Provider value={value}>{children}</NarrationContext.Provider>;
}

export function useNarration() {
  const ctx = useContext(NarrationContext);
  if (!ctx) throw new Error('useNarration must be used inside NarrationProvider');
  return ctx;
}

/** Narrates once per mount (safe under StrictMode double-invocation). Returns true once it has finished. */
export function useNarrateOnce(key: string, text: string | string[] | null, enabled = true): boolean {
  const { say } = useNarration();
  const said = useRef<string | null>(null);
  const [doneKey, setDoneKey] = useState<string | null>(null);
  const textRef = useRef(text);
  textRef.current = text;
  useEffect(() => {
    if (!enabled || said.current === key) return;
    let fired = false;
    const id = window.setTimeout(() => {
      fired = true;
      said.current = key;
      if (textRef.current) say(textRef.current, () => setDoneKey(key));
      else setDoneKey(key);
    }, 350);
    return () => {
      if (!fired) window.clearTimeout(id);
    };
  }, [key, enabled, say]);
  return doneKey === key;
}

/** Speaks a line that is already shown on screen (no caption, to avoid duplicating the subtitle). */
export function useSpeakOnce(key: string, text: string | null, enabled = true) {
  const { speakOnly } = useNarration();
  const said = useRef<string | null>(null);
  const textRef = useRef(text);
  textRef.current = text;
  useEffect(() => {
    if (!enabled || said.current === key) return;
    let fired = false;
    const id = window.setTimeout(() => {
      fired = true;
      said.current = key;
      if (textRef.current) speakOnly(textRef.current);
    }, 500);
    return () => {
      if (!fired) window.clearTimeout(id);
    };
  }, [key, enabled, speakOnly]);
}

export function CaptionBar() {
  const { caption, captions } = useNarration();
  if (!captions || !caption) return null;
  return (
    <div className="caption-bar" aria-hidden="true">
      <span>{caption}</span>
    </div>
  );
}

/** Screen-reader live region for narration (always on, independent of visual captions). */
export function NarrationLive() {
  const { caption } = useNarration();
  return (
    <div className="sr-only" aria-live="polite">
      {caption ?? ''}
    </div>
  );
}
