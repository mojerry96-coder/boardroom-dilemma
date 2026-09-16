import {
  Lock,
  Microphone,
  MusicNotes,
  MusicNotesMinus,
  Pause,
  Play,
  SkipForward,
  SpeakerHigh,
  SpeakerSlash,
  Stop,
  Subtitles,
  SubtitlesSlash,
  type IconProps,
} from '@phosphor-icons/react';

// Interface icons are Phosphor (one family; default size and weight are set once in main.tsx).
// These wrappers pair icons that switch with state. The brand marks below are drawn here.

export const PlayIcon = (p: IconProps) => <Play weight="fill" {...p} />;
export const PauseIcon = (p: IconProps) => <Pause weight="fill" {...p} />;
export const SkipIcon = (p: IconProps) => <SkipForward {...p} />;
export const StopIcon = (p: IconProps) => <Stop weight="fill" {...p} />;
export const LockIcon = (p: IconProps) => <Lock {...p} />;
export const MicIcon = (p: IconProps) => <Microphone {...p} />;

export const VolumeIcon = ({ muted, ...p }: IconProps & { muted?: boolean }) => (muted ? <SpeakerSlash {...p} /> : <SpeakerHigh {...p} />);

export const CaptionsIcon = ({ off, ...p }: IconProps & { off?: boolean }) => (off ? <SubtitlesSlash {...p} /> : <Subtitles {...p} />);

export const MusicIcon = ({ off, ...p }: IconProps & { off?: boolean }) => (off ? <MusicNotesMinus {...p} /> : <MusicNotes {...p} />);

export function DeltaMark({ size = 28, title }: { size?: number; title?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" role={title ? 'img' : undefined} aria-hidden={title ? undefined : true}>
      {title && <title>{title}</title>}
      <path d="M20 3L37 35H3z" fill="#2f6b52" />
      <path d="M20 13l9.5 17h-19z" fill="#e9efe9" />
      <path d="M22.5 19.5L28 30h-8.5z" fill="#3a4b5c" />
    </svg>
  );
}

export function FiscaSeal({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r="22" fill="#1f5a3d" />
      <circle cx="24" cy="24" r="17" fill="none" stroke="#e8f0ea" strokeWidth="2" strokeDasharray="3 2.2" />
      <path d="M24 12l9 4v7c0 6-4 10-9 12-5-2-9-6-9-12v-7z" fill="#e8f0ea" />
      <path d="M18.5 22h11M24 19v10M20 22l-1.8 4h3.6zM28 22l-1.8 4h3.6z" stroke="#1f5a3d" strokeWidth="1.3" fill="none" />
    </svg>
  );
}
