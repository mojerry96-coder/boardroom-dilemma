import { useEffect, useId, useRef, useState } from 'react';
import { MicIcon, StopIcon } from './Icons';

// Text field with optional speech input (master 4.3, content file section 14).
// Typing always works; the transcript lands in the editable field; nothing auto-submits.
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
  const valueRef = useRef(value);
  valueRef.current = value;
  const Ctor = getRecognition();

  useEffect(() => () => rec.current?.stop(), []);

  const start = () => {
    if (!Ctor) return;
    setError(null);
    const r = new Ctor();
    r.lang = 'en-GB';
    r.continuous = true;
    r.interimResults = true;
    r.onresult = (e) => {
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
      setError(e.error === 'not-allowed' ? 'Microphone permission was not granted. You can keep typing.' : 'Voice input stopped. You can keep typing.');
    };
    r.onend = () => {
      setRecording(false);
      setInterim('');
    };
    rec.current = r;
    try {
      r.start();
      setRecording(true);
    } catch {
      setError('Voice input is unavailable right now. You can keep typing.');
    }
  };

  const stop = () => rec.current?.stop();
  const count = value.trim().length;
  const short = minChars !== undefined && count < minChars;

  return (
    <div className={`voice-field${variant !== 'default' ? ` voice-field--${variant}` : ''}${onPaper ? ' on-paper' : ''}${recording ? ' is-recording' : ''}`}>
      <label htmlFor={id} className={showLabel ? 'field-label' : 'sr-only'}>
        {label}
      </label>
      <div className="voice-field__box">
        <textarea
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
            className={`mic-btn${recording ? ' is-on' : ''}`}
            aria-pressed={recording}
            aria-label={recording ? 'Stop voice input' : 'Speak your answer'}
            onClick={recording ? stop : start}
          >
            {recording ? <StopIcon size={16} /> : <MicIcon />}
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
        {!recording && !error && hint && <span>{hint}</span>}
        {minChars !== undefined && (
          <span className={`char-count${short ? ' is-short' : ''}`}>{short ? `${minChars - count} more characters needed` : 'Enough detail'}</span>
        )}
      </div>
    </div>
  );
}
