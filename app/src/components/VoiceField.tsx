import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import { MicIcon } from './Icons';
import { useNarration } from './Narration';

// Text field with optional speech input (master 4.3, content file section 14).
// Typing always works; the transcript lands in the editable field; nothing auto-submits.
// Voice is the default: a field starts listening when it appears (once the narrator has finished),
// and the microphone button turns listening off everywhere until it is pressed again.
// Browsers without speech recognition simply don't show the microphone. A server
// TranscriptionProvider can be added later without changing this component's contract.

export interface TranscriptionProvider {
  transcribe(audio: Blob): Promise<string>;
}

type Recognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((e: { resultIndex: number; results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }> }) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: { error: string }) => void) | null;
};

function getRecognition(): (new () => Recognition) | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

const VOICE_PREF_KEY = 'boardroom-dilemma:voice-input';
const prefListeners = new Set<() => void>();
let voicePref = (() => {
  try {
    return localStorage.getItem(VOICE_PREF_KEY) !== 'off';
  } catch {
    return true;
  }
})();

function setVoicePref(on: boolean) {
  voicePref = on;
  try {
    localStorage.setItem(VOICE_PREF_KEY, on ? 'on' : 'off');
  } catch {
    /* storage unavailable — the choice lasts for this visit */
  }
  prefListeners.forEach((fn) => fn());
}

function useVoicePref() {
  return useSyncExternalStore(
    (fn) => {
      prefListeners.add(fn);
      return () => prefListeners.delete(fn);
    },
    () => voicePref,
  );
}

/** Only one field listens at a time. */
let listening: Recognition | null = null;

interface VoiceFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  minChars?: number;
  hint?: string;
  disabled?: boolean;
  showLabel?: boolean;
  /** compact: single-line pill; area: multi-line box; onPaper: help text styled for light surfaces. */
  variant?: 'default' | 'compact' | 'area';
  onPaper?: boolean;
}

export function VoiceField({ label, value, onChange, placeholder, rows = 3, minChars, hint, disabled, showLabel = true, variant = 'default', onPaper }: VoiceFieldProps) {
  const id = useId();
  const [recording, setRecording] = useState(false);
  const [interim, setInterim] = useState('');
  const [error, setError] = useState<string | null>(null);
  const rec = useRef<Recognition | null>(null);
  const field = useRef<HTMLTextAreaElement>(null);
  const valueRef = useRef(value);
  valueRef.current = value;
  const Ctor = getRecognition();

  const voiceOn = useVoicePref();
  const { speaking } = useNarration();
  // Set when the browser refuses the microphone or keeps failing, so the field stops retrying on its own.
  const [blocked, setBlocked] = useState(false);
  const quickEnds = useRef(0);

  useEffect(
    () => () => {
      if (listening === rec.current) listening = null;
      rec.current?.stop();
    },
    [],
  );

  const start = () => {
    if (!Ctor) return;
    setError(null);
    if (listening && listening !== rec.current) listening.stop();
    const r = new Ctor();
    const startedAt = Date.now();
    r.lang = 'en-GB';
    r.continuous = true;
    r.interimResults = true;
    r.onresult = (e) => {
      quickEnds.current = 0;
      let finalText = '';
      let interimText = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        if (res.isFinal) finalText += res[0].transcript;
        else interimText += res[0].transcript;
      }
      if (finalText) {
        const current = valueRef.current;
        onChange(`${current}${current && !current.endsWith(' ') ? ' ' : ''}${finalText.trim()}`);
      }
      setInterim(interimText);
    };
    r.onerror = (e) => {
      // Silence and our own stops are normal; listening simply resumes.
      if (e.error === 'no-speech' || e.error === 'aborted') return;
      setBlocked(true);
      setError(e.error === 'not-allowed' || e.error === 'service-not-allowed' ? 'Microphone permission was not granted. You can keep typing.' : 'Voice input stopped. You can keep typing.');
    };
    r.onend = () => {
      if (listening === r) listening = null;
      if (Date.now() - startedAt < 1500 && ++quickEnds.current >= 3) setBlocked(true);
      setRecording(false);
      setInterim('');
    };
    rec.current = r;
    try {
      r.start();
      listening = r;
      setRecording(true);
    } catch {
      setBlocked(true);
      setError('Voice input is unavailable right now. You can keep typing.');
    }
  };

  const stop = () => rec.current?.stop();

  // Listen by default, but never over the narrator (it would transcribe the voice-over).
  // …and only once the field has actually appeared (fields can mount while still fading in, or off-screen).
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (shown) return;
    const id = window.setInterval(() => {
      const el = field.current as (HTMLTextAreaElement & { checkVisibility?: (o: object) => boolean }) | null;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const onScreen = r.width > 0 && r.bottom > 0 && r.top < window.innerHeight;
      const visible = el.checkVisibility ? el.checkVisibility({ opacityProperty: true, visibilityProperty: true }) : true;
      if (onScreen && visible && Number(getComputedStyle(el.closest('.reveal') ?? el).opacity) > 0.9) setShown(true);
    }, 300);
    return () => window.clearInterval(id);
  }, [shown]);
  const autoListen = shown && voiceOn && !!Ctor && !disabled && !blocked && !speaking;
  useEffect(() => {
    if (!autoListen) {
      if (recording) stop();
      return;
    }
    if (recording) return;
    const id = window.setTimeout(start, 350);
    return () => window.clearTimeout(id);
  }, [autoListen, recording]);

  const toggle = () => {
    if (recording || voiceOn) {
      setVoicePref(false);
      setError(null);
      stop();
    } else {
      setBlocked(false);
      quickEnds.current = 0;
      setVoicePref(true);
    }
  };

  const count = value.trim().length;
  const short = minChars !== undefined && count < minChars;

  return (
    <div className={`voice-field${variant !== 'default' ? ` voice-field--${variant}` : ''}${onPaper ? ' on-paper' : ''}${recording ? ' is-recording' : ''}`}>
      <label htmlFor={id} className={showLabel ? 'field-label' : 'sr-only'}>
        {label}
      </label>
      <div className="voice-field__box">
        <textarea
          ref={field}
          id={id}
          rows={rows}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          aria-describedby={`${id}-help`}
          onChange={(e) => onChange(e.target.value)}
        />
        {Ctor && !disabled && (
          <button
            type="button"
            className={`mic-btn${recording ? ' is-on' : voiceOn && !blocked ? ' is-armed' : ''}`}
            aria-pressed={voiceOn}
            aria-label={voiceOn ? 'Voice input on — turn it off' : 'Voice input off — speak your answer'}
            title={voiceOn ? 'Turn voice input off' : 'Turn voice input on'}
            onClick={toggle}
          >
            <MicIcon off={!voiceOn} />
          </button>
        )}
      </div>
      <div id={`${id}-help`} className="voice-field__help">
        {recording && (
          <span className="rec-indicator">
            <span className="rec-dot" aria-hidden="true" /> Listening{interim ? ` — ${interim}` : '…'}
          </span>
        )}
        {error && <span className="field-error">{error}</span>}
        {!recording && !error && voiceOn && speaking && Ctor && !disabled && <span>Voice is on. Listening starts when the narrator finishes.</span>}
        {!recording && !error && !(voiceOn && speaking && Ctor && !disabled) && hint && <span>{hint}</span>}
        {minChars !== undefined && (
          <span className={`char-count${short ? ' is-short' : ''}`}>{short ? `${minChars - count} more characters needed` : 'Enough detail'}</span>
        )}
      </div>
    </div>
  );
}
