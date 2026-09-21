import { useEffect, useRef, useState } from 'react';
import { MicrophoneSlash, PhoneDisconnect, PhoneIncoming, VideoCameraSlash } from '@phosphor-icons/react';
import { CALL_AUDIO, CALL_AVATARS } from '../assets';
import { CALL_CUES, CALL_DURATION, CALL_JOINS, CALL_MUTED, CALL_PARTICIPANTS, type CallSpeaker } from '../sim/crisisCall';
import { useFilmMusicPause } from '../sound';
import { CaptionsIcon, VolumeIcon } from './Icons';
import { useNarration } from './Narration';
import { prefersReducedMotion } from './Reveal';

// The emergency Board call before the Crisis Decision. Camera-off tiles with each person's photo; the one
// speaking lights up with their voice. One pre-mixed recording, so interruptions and pauses land as written.

const clock = (t: number) => {
  const m = 4 + Math.floor(t / 60);
  return `07:${String(m).padStart(2, '0')}`;
};

const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('') || 'CS';

export function CrisisCall({ learnerName, onEnd, autoJoin = false }: { learnerName: string; onEnd: () => void; autoJoin?: boolean }) {
  useFilmMusicPause();
  const { audio, setAudio, captions, setCaptions } = useNarration();
  const el = useRef<HTMLAudioElement>(null);
  const tiles = useRef<Partial<Record<CallSpeaker, HTMLDivElement | null>>>({});
  const [joined, setJoined] = useState(autoJoin);
  const [time, setTime] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const ended = useRef(false);

  const finish = () => {
    if (ended.current) return;
    ended.current = true;
    el.current?.pause();
    setLeaving(true);
    window.setTimeout(onEnd, 450);
  };

  const join = () => {
    const a = el.current;
    if (!a) return;
    setJoined(true);
    void a.play().catch(() => setJoined(false));
  };

  useEffect(() => {
    if (el.current) el.current.muted = !audio;
  }, [audio]);

  // Joined from the notification: the call starts at once (falls back to the join screen if the browser refuses).
  useEffect(() => {
    if (!autoJoin) return;
    void el.current?.play().catch(() => setJoined(false));
  }, [autoJoin]);

  // Follow the recording: who is speaking, and how loudly (drives the ring around their photo).
  // The level meter routes the call through Web Audio only once an audio context is confirmed running:
  // an element tied to a suspended context would stall, so otherwise the call plays directly and the
  // speaking ring keeps a steady pulse instead.
  useEffect(() => {
    if (!joined) return;
    const a = el.current;
    if (!a) return;
    let cancelled = false;
    let analyser: AnalyserNode | null = null;
    let ctx: AudioContext | null = null;
    let data = new Uint8Array(0);
    if (!prefersReducedMotion()) {
      try {
        const c = new AudioContext();
        const timeout = new Promise((r) => window.setTimeout(r, 400));
        void Promise.race([c.resume(), timeout]).then(() => {
          if (cancelled || c.state !== 'running') {
            void c.close();
            return;
          }
          ctx = c;
          const source = c.createMediaElementSource(a);
          analyser = c.createAnalyser();
          analyser.fftSize = 512;
          source.connect(analyser);
          analyser.connect(c.destination);
          data = new Uint8Array(analyser.fftSize);
        });
      } catch {
        analyser = null;
      }
    }
    let raf = 0;
    let smooth = 0;
    const tick = () => {
      const t = a.currentTime;
      setTime(t);
      let level = 0.55;
      if (analyser) {
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) sum += ((data[i] - 128) / 128) ** 2;
        level = Math.min(1, Math.sqrt(sum / data.length) * 6);
      }
      smooth = smooth * 0.7 + level * 0.3;
      for (const p of CALL_PARTICIPANTS) tiles.current[p.id]?.style.setProperty('--level', smooth.toFixed(3));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      void (ctx as AudioContext | null)?.close();
    };
  }, [joined]);

  const speaking = new Set(CALL_CUES.filter((c) => time >= c.start && time < c.end).map((c) => c.speaker));
  const mutedTalking = joined && time >= CALL_MUTED.start && time < CALL_MUTED.end;
  const chidiMuted = !joined || time < CALL_MUTED.end + 0.4;
  const line = [...CALL_CUES].reverse().find((c) => time >= c.start && time < c.end + 0.6);
  const lineName = line ? CALL_PARTICIPANTS.find((p) => p.id === line.speaker)?.name : '';

  return (
    <div className={`call${leaving ? ' is-leaving' : ''}`} role="dialog" aria-modal="true" aria-label="Emergency Board call">
      <audio ref={el} preload="auto" onEnded={finish}>
        <source src={CALL_AUDIO.webm} type="audio/webm" />
        <source src={CALL_AUDIO.mp3} type="audio/mpeg" />
      </audio>

      <header className="call__bar">
        <span className="call__live" aria-hidden="true" />
        <span className="call__title">DIN Board · Emergency session</span>
        <span className="call__clock">{clock(time)}</span>
      </header>

      <div className="call__grid">
        {CALL_PARTICIPANTS.map((p) => {
          const joinAt = CALL_JOINS[p.id];
          const connecting = joinAt !== undefined && (!joined || time < joinAt);
          const isSpeaking = speaking.has(p.id) || (p.id === CALL_MUTED.speaker && mutedTalking);
          const muted = p.id === 'okafor' && chidiMuted;
          return (
            <div
              key={p.id}
              ref={(node) => {
                tiles.current[p.id] = node;
              }}
              className={`call__tile${isSpeaking ? ' is-speaking' : ''}${connecting ? ' is-connecting' : ''}${isSpeaking && muted ? ' is-muted-talking' : ''}`}
            >
              <div className="call__avatar">
                <img src={CALL_AVATARS[p.id]} alt="" decoding="async" />
              </div>
              {connecting && <span className="call__connecting">Connecting…</span>}
              {isSpeaking && muted && <span className="call__muted-note">You’re on mute</span>}
              <span className="call__name">
                {muted && <MicrophoneSlash size={14} weight="fill" aria-label="Muted" />}
                {p.name}
              </span>
            </div>
          );
        })}
      </div>

      <div className="call__self" aria-hidden="true">
        <span className="call__initials">{initials(learnerName)}</span>
        <span className="call__self-name">
          <VideoCameraSlash size={13} weight="fill" /> You · Company Secretary
        </span>
      </div>

      {(captions || !audio) && joined && line && (
        <p className="call__caption" aria-hidden="true">
          <span className="call__caption-name">{lineName}</span>
          {line.text}
        </p>
      )}
      <p className="sr-only" aria-live="polite">
        {line ? `${lineName}: ${line.text}` : ''}
      </p>

      {!joined && (
        <div className="call__join">
          <p className="call__join-kicker">Incoming · 07:04 · one hour before the Board convenes</p>
          <h2 className="call__join-title">The Board is on a call</h2>
          <p className="call__join-text">Listen in before you advise them.</p>
          <button type="button" className="call__join-btn" onClick={join} autoFocus>
            <PhoneIncoming size={20} weight="fill" />
            Join the call
          </button>
          <button type="button" className="call__join-skip" onClick={finish}>
            Skip the call
          </button>
        </div>
      )}

      <div className="call__controls">
        <div className="call__progress" aria-hidden="true">
          <span style={{ width: `${Math.min(time / CALL_DURATION, 1) * 100}%` }} />
        </div>
        <button type="button" className="icon-btn" aria-pressed={audio} aria-label={audio ? 'Audio on' : 'Audio off'} onClick={() => setAudio(!audio)}>
          <VolumeIcon muted={!audio} />
        </button>
        <button type="button" className="icon-btn" aria-pressed={captions} aria-label={captions ? 'Captions on' : 'Captions off'} onClick={() => setCaptions(!captions)}>
          <CaptionsIcon off={!captions} />
        </button>
        <button type="button" className="call__leave" onClick={finish}>
          <PhoneDisconnect size={18} weight="fill" />
          Leave call
        </button>
      </div>
    </div>
  );
}

/**
 * The call as an optional incoming-call notification in the top right, the way a video-call app announces one.
 * Joining opens the call; "Not now" dismisses it and the page carries on.
 */
export function CallNotification({ onJoin, onDismiss }: { onJoin: () => void; onDismiss: () => void }) {
  return (
    <aside className="call-toast" role="alertdialog" aria-labelledby="call-toast-title" aria-describedby="call-toast-text">
      <div className="call-toast__head">
        <span className="call-toast__live" aria-hidden="true" />
        <span className="call-toast__kicker">Incoming call</span>
        <span className="call-toast__optional">Optional</span>
      </div>
      <div className="call-toast__body">
        <div className="call-toast__faces" aria-hidden="true">
          {CALL_PARTICIPANTS.map((p) => (
            <img key={p.id} src={CALL_AVATARS[p.id]} alt="" decoding="async" />
          ))}
        </div>
        <div>
          <p className="call-toast__title" id="call-toast-title">
            DIN Board · Emergency session
          </p>
          <p className="call-toast__text" id="call-toast-text">
            The Chair, the Independent Director, the MD and Chidi Okafor are talking before the Board convenes. Listen in, or carry on.
          </p>
        </div>
      </div>
      <div className="call-toast__actions">
        <button type="button" className="call-toast__join" onClick={onJoin}>
          <PhoneIncoming size={18} weight="fill" />
          Join
        </button>
        <button type="button" className="call-toast__dismiss" onClick={onDismiss}>
          Not now
        </button>
      </div>
    </aside>
  );
}
