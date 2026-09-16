import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { SPEAKER_CLIPS, type SpeakerClip } from '../assets';
import { prefersReducedMotion } from './Reveal';

// A speaker steps forward: their card pops in as they begin to speak and a short, silent presence beat
// plays once (the recorded voice carries the words), then it holds on them looking at the player.
// Returning to a question, or reduced motion, shows the final frame as a still.

export function useNarrow(query = '(max-width: 819px)') {
  const [narrow, setNarrow] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setNarrow(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);
  return narrow;
}

export function SpeakerCard({ speaker, fresh, compact = false }: { speaker: string; fresh: boolean; compact?: boolean }) {
  const clip = SPEAKER_CLIPS[speaker];
  const video = useRef<HTMLVideoElement>(null);
  // Decided on arrival: a question heard before shows its final frame instead of replaying.
  const [still] = useState(() => !fresh || prefersReducedMotion());

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    el.muted = true;
    // Starts with the voice (which begins ~400ms after the question appears).
    const id = window.setTimeout(() => void el.play().catch(() => {}), 350);
    return () => window.clearTimeout(id);
  }, []);

  if (!clip) return null;
  return (
    <figure className={`speaker-card${compact ? ' speaker-card--compact' : ''}`} aria-hidden="true">
      {still ? (
        <img src={clip.end} alt="" decoding="async" />
      ) : (
        <video ref={video} src={clip.video} poster={clip.start} muted playsInline preload="auto" disablePictureInPicture />
      )}
      {!compact && <figcaption className="speaker-card__name">{clip.label ?? speaker}</figcaption>}
    </figure>
  );
}

/**
 * A presence beat shown in place of a photo (Page 6). It holds on the first frame until `play` turns true
 * (when the recorded line begins), plays once and keeps the last frame. `still` shows the last frame instead.
 */
export function PresenceClip({ clip, play, still: showStill, className, style }: { clip: SpeakerClip; play: boolean; still: boolean; className?: string; style?: CSSProperties }) {
  const video = useRef<HTMLVideoElement>(null);
  // Decided on arrival, so answering does not swap the video for the still.
  const [still] = useState(() => showStill || prefersReducedMotion());

  useEffect(() => {
    const el = video.current;
    if (!el || !play) return;
    el.muted = true;
    const id = window.setTimeout(() => void el.play().catch(() => {}), 350);
    return () => window.clearTimeout(id);
  }, [play]);

  if (still) return <img className={className} style={style} src={clip.end} alt="" decoding="async" />;
  return <video ref={video} className={className} style={style} src={clip.video} poster={clip.start} muted playsInline preload="auto" disablePictureInPicture aria-hidden="true" />;
}
