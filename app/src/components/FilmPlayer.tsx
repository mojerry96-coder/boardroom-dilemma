import { useCallback, useEffect, useRef, useState } from 'react';
import { FILM_IMAGES } from '../assets';
import type { FilmCue } from '../sim/content';
import { useNarration } from './Narration';
import { CaptionsIcon, PauseIcon, PlayIcon, SkipIcon, VolumeIcon } from './Icons';

// Full-screen film player. Plays the final video when a source exists; otherwise it
// plays a timed storyboard of stills and captions. Always pausable, captioned and skippable.
// Video captions come from the WebVTT track but are drawn in the app's own caption style.

interface FilmPlayerProps {
  title: string;
  cues: FilmCue[];
  video?: { src: string; captions: string } | null;
  onEnd: () => void;
  skipLabel?: string;
}

interface LiveCue {
  speaker?: string;
  text: string;
}

const parseCue = (raw: string): LiveCue => {
  const m = /^<v ([^>]+)>([\s\S]*)$/.exec(raw.trim());
  return m ? { speaker: m[1], text: m[2] } : { text: raw };
};

export function FilmPlayer({ title, cues, video, onEnd, skipLabel = 'Skip' }: FilmPlayerProps) {
  const duration = cues.length ? cues[cues.length - 1].until : 0;
  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [videoCue, setVideoCue] = useState<LiveCue | null>(null);
  const [videoProgress, setVideoProgress] = useState(0);
  const { captions, setCaptions, audio, setAudio, speakOnly } = useNarration();
  const ended = useRef(false);
  const last = useRef<number | null>(null);
  const spoken = useRef<number>(-1);
  const dialogRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const finish = useCallback(() => {
    if (ended.current) return;
    ended.current = true;
    window.speechSynthesis?.cancel();
    onEnd();
  }, [onEnd]);

  useEffect(() => {
    dialogRef.current?.focus();
    return () => window.speechSynthesis?.cancel();
  }, []);

  // Video: start playback (show Play if the browser blocks autoplay) and read caption cues.
  const videoSrc = video?.src;
  useEffect(() => {
    const v = videoRef.current;
    if (!videoSrc || !v) return;
    v.play().catch(() => setPlaying(false));
    const track = v.textTracks[0];
    if (!track) return;
    track.mode = 'hidden';
    const onCueChange = () => {
      const active = track.activeCues?.[0] as VTTCue | undefined;
      setVideoCue(active ? parseCue(active.text) : null);
    };
    track.addEventListener('cuechange', onCueChange);
    return () => track.removeEventListener('cuechange', onCueChange);
  }, [videoSrc]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = !audio;
  }, [audio, videoSrc]);

  // Storyboard clock
  useEffect(() => {
    if (video || !playing) {
      last.current = null;
      return;
    }
    let raf = 0;
    const tick = (t: number) => {
      if (last.current !== null) {
        setElapsed((e) => {
          const next = e + (t - (last.current as number)) / 1000;
          if (next >= duration) {
            window.setTimeout(finish, 0);
            return duration;
          }
          return next;
        });
      }
      last.current = t;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, duration, finish, video]);

  const index = Math.max(
    0,
    cues.findIndex((c) => elapsed >= c.at && elapsed < c.until),
  );
  const cue = cues[Math.min(index, cues.length - 1)];

  useEffect(() => {
    if (video || !playing || spoken.current === index) return;
    spoken.current = index;
    if (cue.kind !== 'sound') speakOnly(cue.text);
  }, [index, cue, playing, speakOnly, video]);

  const toggle = () => {
    if (video && videoRef.current) {
      if (videoRef.current.paused) void videoRef.current.play();
      else videoRef.current.pause();
      setPlaying(!videoRef.current.paused);
      return;
    }
    if (playing) window.speechSynthesis?.cancel();
    else spoken.current = -1;
    setPlaying((p) => !p);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ' && (e.target as HTMLElement)?.tagName !== 'BUTTON') {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const image = cue.image ? FILM_IMAGES[cue.image] : undefined;
  const live: LiveCue | null = video ? videoCue : cue.kind === 'title' ? null : { speaker: cue.speaker, text: cue.text };
  const progress = video ? videoProgress : duration ? elapsed / duration : 0;

  return (
    <div className="film" role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} ref={dialogRef}>
      {video ? (
        <video
          ref={videoRef}
          className="film__video"
          src={video.src}
          playsInline
          preload="auto"
          onEnded={finish}
          onPause={() => setPlaying(false)}
          onPlay={() => setPlaying(true)}
          onTimeUpdate={(e) => setVideoProgress(e.currentTarget.currentTime / (e.currentTarget.duration || 1))}
        >
          <track kind="captions" src={video.captions} srcLang="en" label="English" />
        </video>
      ) : (
        <div className="film__frame" aria-hidden="true">
          {image ? <img key={image} className="film__still" src={image} alt="" /> : null}
          {cue.slate && (
            <div className={`film__slate${cue.kind === 'title' ? ' film__slate--title' : ''}${image ? ' film__slate--over' : ''}`}>
              <span>{cue.slate}</span>
            </div>
          )}
          <div className="film__vignette" />
        </div>
      )}

      {!video && <p className="film__tag">Storyboard preview — final film in production</p>}
      {captions && live && (
        <p className="film__caption" aria-hidden="true">
          {live.speaker && <span className="film__speaker">{live.speaker}</span>}
          {live.text}
        </p>
      )}
      <p className="sr-only" aria-live="polite">
        {live ? `${live.speaker ? `${live.speaker}: ` : ''}${live.text}` : ''}
      </p>

      <div className="film__controls">
        <button type="button" className="icon-btn icon-btn--solid" onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}>
          {playing ? <PauseIcon /> : <PlayIcon />}
        </button>
        <div className="film__progress" aria-hidden="true">
          <span style={{ width: `${Math.min(progress, 1) * 100}%` }} />
        </div>
        <button type="button" className="icon-btn" aria-pressed={audio} aria-label={audio ? 'Audio on' : 'Audio off'} onClick={() => setAudio(!audio)}>
          <VolumeIcon muted={!audio} />
        </button>
        <button type="button" className="icon-btn" aria-pressed={captions} aria-label={captions ? 'Captions on' : 'Captions off'} onClick={() => setCaptions(!captions)}>
          <CaptionsIcon off={!captions} />
        </button>
        <button type="button" className="btn btn--ghost btn--small" onClick={finish}>
          {skipLabel}
          <SkipIcon width={16} height={16} />
        </button>
      </div>
    </div>
  );
}
