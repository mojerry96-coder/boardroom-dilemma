import { useCallback, useEffect, useRef, useState } from 'react';
import { FILM_IMAGES, type FilmSource } from '../assets';
import { isConstrainedNetwork, markSlowNetwork } from '../media';
import { useFilmMusicPause } from '../sound';
import type { FilmCue } from '../sim/content';
import { CaptionsIcon, PauseIcon, PlayIcon, SkipIcon, VolumeIcon } from './Icons';
import { LogoSting } from './LogoSting';
import { useNarration } from './Narration';

// Full-screen film player. Plays the final video when a source exists; otherwise it
// plays a timed storyboard of stills and captions. Always pausable, captioned and skippable.
// Video captions come from the WebVTT track but are drawn in the app's own caption style.

interface FilmPlayerProps {
  title: string;
  cues: FilmCue[];
  video?: FilmSource | null;
  onEnd: () => void;
  skipLabel?: string;
  /** Seconds of animated countdown while the film loads, before playback starts. */
  countdown?: number;
}

interface LiveCue {
  speaker?: string;
  text: string;
}

const parseCue = (raw: string): LiveCue => {
  const m = /^<v ([^>]+)>([\s\S]*)$/.exec(raw.trim());
  return m ? { speaker: m[1], text: m[2] } : { text: raw };
};

export function FilmPlayer({ title, cues, video, onEnd, skipLabel = 'Skip', countdown = 0 }: FilmPlayerProps) {
  const [count, setCount] = useState(countdown);
  const [canPlay, setCanPlay] = useState(!video);
  const [waitedTooLong, setWaitedTooLong] = useState(false);
  useFilmMusicPause();
  // 720p by default; the 480p rendition on slow connections or once the 720p film has struggled.
  const [useLow, setUseLow] = useState(isConstrainedNetwork);
  const src = video ? (useLow && video.low ? video.low : video.src) : undefined;
  // Only a film opened with a countdown waits behind the loader. One that should start at once (a reaction
  // to the player's choice, a replay) shows its poster frame and begins as soon as it can play.
  const counting = count > 0 || (countdown > 0 && !canPlay && !waitedTooLong);

  useEffect(() => {
    if (count <= 0) return;
    const id = window.setTimeout(() => setCount((c) => c - 1), 1000);
    return () => window.clearTimeout(id);
  }, [count]);

  // Never hold a player on the loader forever. A film slow to buffer switches to the lighter rendition first
  // (remembered for the session), then starts anyway.
  useEffect(() => {
    if (count > 0 || canPlay) return;
    const id = window.setTimeout(() => {
      if (video?.low && !useLow) {
        markSlowNetwork();
        setUseLow(true);
      } else {
        setWaitedTooLong(true);
      }
    }, 5000);
    return () => window.clearTimeout(id);
  }, [count, canPlay, useLow, video]);
  const duration = cues.length ? cues[cues.length - 1].until : 0;
  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(true);
  /** The browser refused to start playback on its own (e.g. Safari after the countdown). */
  const [blocked, setBlocked] = useState(false);
  const [videoCue, setVideoCue] = useState<LiveCue | null>(null);
  const [videoProgress, setVideoProgress] = useState(0);
  const { captions, setCaptions, audio, setAudio, speakOnly } = useNarration();
  const ended = useRef(false);
  const last = useRef<number | null>(null);
  const spoken = useRef<number>(-1);
  const dialogRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const stallTimer = useRef<number | undefined>(undefined);
  const resumeAt = useRef<number | null>(null);

  // Mid-film, a stall of three seconds on 720p switches to 480p and carries on from the same moment.
  const onStall = () => {
    window.clearTimeout(stallTimer.current);
    if (!video?.low || useLow) return;
    stallTimer.current = window.setTimeout(() => {
      resumeAt.current = videoRef.current?.currentTime ?? 0;
      markSlowNetwork();
      setUseLow(true);
    }, 3000);
  };
  useEffect(() => () => window.clearTimeout(stallTimer.current), []);

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
  const videoSrc = src;
  useEffect(() => {
    if (!videoSrc || counting) return;
    videoRef.current?.play().catch(() => {
      setPlaying(false);
      setBlocked(true);
    });
  }, [videoSrc, counting]);

  useEffect(() => {
    const v = videoRef.current;
    if (!videoSrc || !v) return;
    if (v.readyState >= 3) setCanPlay(true);
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
    if (video || !playing || counting) {
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
  }, [playing, duration, finish, video, counting]);

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
          src={src}
          poster={video.poster}
          onWaiting={onStall}
          onPlaying={() => window.clearTimeout(stallTimer.current)}
          onLoadedMetadata={(e) => {
            if (resumeAt.current === null) return;
            e.currentTarget.currentTime = resumeAt.current;
            resumeAt.current = null;
          }}
          playsInline
          preload="auto"
          onCanPlay={() => setCanPlay(true)}
          onEnded={finish}
          onPause={() => setPlaying(false)}
          onPlay={() => {
            setPlaying(true);
            setBlocked(false);
          }}
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

      {!video && <p className="film__tag">Storyboard preview. Final film in production</p>}
      {captions && live && (
        <p className="film__caption" aria-hidden="true">
          {live.speaker && <span className="film__speaker">{live.speaker}</span>}
          {live.text}
        </p>
      )}
      <p className="sr-only" aria-live="polite">
        {live ? `${live.speaker ? `${live.speaker}: ` : ''}${live.text}` : ''}
      </p>

      {blocked && !counting && (
        <button type="button" className="film__start" onClick={toggle} autoFocus>
          <PlayIcon />
          <span>Play the film</span>
        </button>
      )}

      {counting && (
        <div className="film-countdown" aria-live="polite">
          <LogoSting className="film-countdown__sting" />
          <p className="film-countdown__title">{title}</p>
          <div className="film-countdown__ring">
            <svg viewBox="0 0 120 120" aria-hidden="true">
              <circle className="film-countdown__track" cx="60" cy="60" r="52" />
              <circle key={count} className={`film-countdown__arc${count > 0 ? ' is-counting' : ' is-loading'}`} cx="60" cy="60" r="52" />
            </svg>
            {count > 0 ? (
              <span key={count} className="film-countdown__num">
                {count}
              </span>
            ) : (
              <span className="film-countdown__loading">Loading</span>
            )}
          </div>
          <p className="film-countdown__hint">Captions, pause and skip are available while the film plays.</p>
        </div>
      )}

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
          <SkipIcon size={16} />
        </button>
      </div>
    </div>
  );
}
