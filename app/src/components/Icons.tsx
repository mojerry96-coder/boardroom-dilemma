import type { SVGProps } from 'react';

const base = (props: SVGProps<SVGSVGElement>) => ({
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
  ...props,
});

export const PlayIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M7 5.5v13l11-6.5z" fill="currentColor" stroke="none" />
  </svg>
);
export const PauseIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M8 5v14M16 5v14" strokeWidth={2.6} />
  </svg>
);
export const SkipIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M5 6l8 6-8 6zM17 6v12" />
  </svg>
);
export const VolumeIcon = ({ muted, ...p }: SVGProps<SVGSVGElement> & { muted?: boolean }) => (
  <svg {...base(p)}>
    <path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z" />
    {muted ? <path d="M16 9.5l5 5M21 9.5l-5 5" /> : <path d="M16 9a4.5 4.5 0 010 6M18.5 6.5a8 8 0 010 11" />}
  </svg>
);
export const CaptionsIcon = ({ off, ...p }: SVGProps<SVGSVGElement> & { off?: boolean }) => (
  <svg {...base(p)}>
    <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
    <path d="M10.5 10.2a2 2 0 100 3.6M16.5 10.2a2 2 0 100 3.6" />
    {off && <path d="M4 20L20 4" />}
  </svg>
);
export const CheckIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M5 12.5l4.5 4.5L19 7.5" strokeWidth={2.4} />
  </svg>
);
export const LockIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <rect x="5" y="10.5" width="14" height="9.5" rx="2" />
    <path d="M8 10.5V8a4 4 0 018 0v2.5" />
  </svg>
);
export const MicIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <rect x="9" y="3.5" width="6" height="11" rx="3" />
    <path d="M5.5 11.5a6.5 6.5 0 0013 0M12 18v3" />
  </svg>
);
export const StopIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <rect x="6.5" y="6.5" width="11" height="11" rx="2" fill="currentColor" stroke="none" />
  </svg>
);
export const CloseIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);
export const DocIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M7 3.5h7l4 4V20a.5.5 0 01-.5.5h-10A.5.5 0 017 20z" />
    <path d="M14 3.5V8h4M9.5 12h6M9.5 15.5h6" />
  </svg>
);
export const ArrowIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M5 12h13M13 6.5l5.5 5.5-5.5 5.5" />
  </svg>
);
export const AlertIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M12 4l9 16H3z" />
    <path d="M12 10v4.5M12 17.2v.3" />
  </svg>
);
export const InfoIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 11v5.2M12 7.8v.2" strokeWidth={2.2} />
  </svg>
);
export const ClockIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);

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
