import { useState, type ReactNode } from 'react';
import { InfoIcon } from './Icons';

export function DockHeader({
  page,
  title,
  steps,
  current = 0,
  onContext,
  contextOpen,
  aside,
}: {
  page: number;
  title: string;
  steps?: number;
  /** Number of completed steps (the next one is highlighted). */
  current?: number;
  onContext?: () => void;
  contextOpen?: boolean;
  aside?: ReactNode;
}) {
  return (
    <div className="dock__head">
      <h1 className="dock__title" tabIndex={-1} data-page-title>
        <span className="dock__num" aria-hidden="true">
          {String(page).padStart(2, '0')}
        </span>
        {title}
      </h1>
      <div className="dock__head-right">
        {aside}
        {steps ? (
          <span className="dots" role="img" aria-label={current >= steps ? `All ${steps} steps complete` : `Step ${current + 1} of ${steps}`}>
            {Array.from({ length: steps }, (_, i) => (
              <i key={i} className={i < current ? 'is-done' : i === current ? 'is-current' : undefined} />
            ))}
          </span>
        ) : null}
        {onContext && (
          <button
            type="button"
            className="icon-btn icon-btn--small"
            aria-pressed={!!contextOpen}
            aria-label={contextOpen ? 'Hide context' : 'Show context'}
            title="Context"
            onClick={onContext}
          >
            <InfoIcon width={18} height={18} />
          </button>
        )}
      </div>
    </div>
  );
}

/** Background information on request. Longer context is split into short pages, never a scroll. */
export function ContextView({ children, pages, onBack }: { children?: ReactNode; pages?: ReactNode[]; onBack: () => void }) {
  const [page, setPage] = useState(0);
  const list = pages && pages.length ? pages : [children];
  const last = page >= list.length - 1;
  return (
    <div className="context-view">
      <div className="context-view__body" key={page}>
        {list[page]}
      </div>
      <div className="row">
        <button type="button" className="btn btn--quiet btn--small" onClick={onBack} autoFocus>
          Back
        </button>
        {list.length > 1 &&
          (last ? (
            <button type="button" className="btn btn--link btn--small" onClick={() => setPage(page - 1)}>
              Previous
            </button>
          ) : (
            <button type="button" className="btn btn--link btn--small" onClick={() => setPage(page + 1)}>
              More
            </button>
          ))}
        {list.length > 1 && (
          <span className="hint" aria-live="polite">
            {page + 1} / {list.length}
          </span>
        )}
      </div>
    </div>
  );
}

export function Prompt({ children, tone, step }: { children: ReactNode; tone?: 'warn' | 'accent'; step?: string }) {
  return (
    <p className={`prompt${tone ? ` prompt--${tone}` : ''}`} role={tone === 'warn' ? 'alert' : undefined}>
      {step && <span className="prompt__step">{step}</span>}
      {children}
    </p>
  );
}

/** Dialogue as a subtitle on the media. */
export function MediaQuote({
  speaker,
  text,
  chips = [],
  warnChips = [],
  follow,
}: {
  speaker: string;
  text: string;
  chips?: string[];
  warnChips?: string[];
  follow?: boolean;
}) {
  return (
    <figure className={`media-quote${follow ? ' media-quote--follow' : ''}`}>
      <blockquote>
        <span className="media-quote__who">{speaker}</span>“{text}”
      </blockquote>
      {(chips.length > 0 || warnChips.length > 0) && (
        <div className="media-quote__chips">
          {chips.map((c) => (
            <span key={c} className="chip chip--media">
              {c}
            </span>
          ))}
          {warnChips.map((c) => (
            <span key={c} className="chip chip--media chip--warn">
              {c}
            </span>
          ))}
        </div>
      )}
    </figure>
  );
}

/** A warning that appears on the media only while it applies, keeping the dock small. */
export function MediaNotice({ text }: { text: string }) {
  return (
    <figure className="media-quote media-quote--notice" role="status">
      <blockquote>{text}</blockquote>
    </figure>
  );
}
