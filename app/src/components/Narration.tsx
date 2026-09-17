import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { loadClip } from '../media';
import { voiceSourcesFor } from '../voice';

// Page narration with captions. Lines with a recording play in the films' narrator voice
// (see voice.ts); anything else falls back to speech synthesis. Captions always carry the words.

interface Prefs {
  audio: boolean;
  captions: boolean;
  /** Background score (levels live in src/sound.ts). */
  music: boolean;
}

interface NarrationValue extends Prefs {
  caption: string | null;
  /** True while a narrated or spoken line is playing, so the score can step back. */
  speaking: boolean;
  setMusic: (on: boolean) => void;
  /** Narrate with captions; onDone runs when the whole queue has finished (not when interrupted). */
  say: (text: string | string[], onDone?: () => void) => void;
  stop: () => void;
  setAudio: (on: boolean) => void;
  setCaptions: (on: boolean) => void;
  /** Speak a single line without touching the caption (the line is already on screen). */
  speakOnly: (text: string, onDone?: () => void) => void;
}

// v2: captions became opt-in. Audio and music choices carry over from the earlier key; captions start off.
const PREFS_KEY = 'boardroom-dilemma:prefs:v2';
const LEGACY_PREFS_KEY = 'boardroom-dilemma:prefs';
const DEFAULT_PREFS: Prefs = { audio: true, captions: false, music: true };

function loadPrefs(): Prefs {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (raw) return { ...DEFAULT_PREFS, ...(JSON.parse(raw) as Partial<Prefs>) };
    const legacy = localStorage.getItem(LEGACY_PREFS_KEY);
    if (legacy) {
      const { audio, music } = JSON.parse(legacy) as Partial<Prefs>;
      return { ...DEFAULT_PREFS, ...(audio !== undefined && { audio }), ...(music !== undefined && { music }) };
    }
  } catch {
    /* ignore */
  }
  return DEFAULT_PREFS;
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
  /** Lines spoken without a caption (characters, Board questions), counted so the score ducks for them too. */
  const [voices, setVoices] = useState(0);
  const queue = useRef<string[]>([]);
  const queueDone = useRef<(() => void) | undefined>(undefined);
  const timer = useRef<number | undefined>(undefined);
  const player = useRef<HTMLAudioElement | null>(null);
  /** Bumped whenever playback is silenced, so a clip that finishes downloading late never starts. */
  const playToken = useRef(0);
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
    playToken.current++;
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
    const sources = voiceSourcesFor(line);
    if (sources.length) {
      const a = (player.current ??= new Audio());
      const token = playToken.current;
      const current = () => token === playToken.current;
      // Opus first; if it will not download or decode, fall back to the MP3; if nothing plays, move on.
      const attempt = (i: number) => {
        if (!current()) return;
        if (i >= sources.length) return onDone?.();
        loadClip(sources[i]).then(
          (url) => {
            if (!current()) return;
            a.onended = () => onDone?.();
            a.onerror = () => attempt(i + 1);
            a.src = url;
            a.play().catch((err: DOMException) => {
              if (!current()) return;
              if (err?.name === 'NotAllowedError') onDone?.();
              else attempt(i + 1);
            });
          },
          () => attempt(i + 1),
        );
      };
      attempt(0);
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
        timer.current = window.setTimeout(next, 250);
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
    setVoices(0);
  }, [clear]);

  const speakOnly = useCallback(
    (text: string, onDone?: () => void) => {
      if (!prefsRef.current.audio) {
        // Without audio, allow roughly the time it takes to read the line.
        if (onDone) window.setTimeout(onDone, Math.max(1800, text.split(/\s+/).length * 330));
        return;
      }
      silence();
      let done = false;
      setVoices((n) => n + 1);
      const finish = () => {
        if (done) return;
        done = true;
        setVoices((n) => Math.max(0, n - 1));
        onDone?.();
      };
      speak(text, finish);
      if (onDone) window.setTimeout(finish, Math.max(4000, text.split(/\s+/).length * 520));
    },
    [silence, speak],
  );

  useEffect(() => () => clear(), [clear]);

  const value = useMemo<NarrationValue>(
    () => ({
      ...prefs,
      caption,
      speaking: caption !== null || voices > 0,
      say,
      stop,
      speakOnly,
      setAudio: (audio) => {
        if (!audio) silence();
        setPrefs((p) => ({ ...p, audio }));
      },
      setCaptions: (captions) => setPrefs((p) => ({ ...p, captions })),
      setMusic: (music) => setPrefs((p) => ({ ...p, music })),
    }),
    [prefs, caption, voices, say, stop, speakOnly, silence],
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

/** Speaks a line that is already shown on screen (no caption). Returns true once it has been spoken. */
export function useSpeakOnce(key: string, text: string | null, enabled = true): boolean {
  const { speakOnly } = useNarration();
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
      if (textRef.current) speakOnly(textRef.current, () => setDoneKey(key));
      else setDoneKey(key);
    }, 400);
    return () => {
      if (!fired) window.clearTimeout(id);
    };
  }, [key, enabled, speakOnly]);
  return doneKey === key;
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
