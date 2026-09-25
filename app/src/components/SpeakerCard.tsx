import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { SpeakerClip } from '../assets';
import { prefersReducedMotion } from './Reveal';

// Presence beats: a short, silent clip of a character that plays once as their recorded line begins
// (the voice carries the words), then holds on them looking at the player. A talking clip is the character
// saying the line itself; it stays muted (the recording is its soundtrack) and starts the moment `play` turns true.

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
    const id = window.setTimeout(() => void el.play().catch(() => {}), clip.talking ? 0 : 350);
    return () => window.clearTimeout(id);
  }, [play, clip.talking]);

  if (still) return <img className={className} style={style} src={clip.end} alt="" decoding="async" />;
  return <video ref={video} className={className} style={style} src={clip.video} poster={clip.start} muted playsInline preload="auto" disablePictureInPicture aria-hidden="true" />;
}
