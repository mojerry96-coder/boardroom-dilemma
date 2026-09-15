import { Fragment, useEffect, useRef, type ReactNode } from 'react';
import { BRAND } from '../sim/content';
import type { Block, DocDef } from '../sim/documents';
import { CloseIcon, DeltaMark } from './Icons';

/** Renders **bold** and ==highlight== markers. */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|==[^=]+==)/g).filter(Boolean);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
        if (part.startsWith('==')) {
          return (
            <mark key={i} className="doc-mark">
              <Rich text={part.slice(2, -2)} />
            </mark>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

function renderBlock(b: Block, i: number): ReactNode {
  switch (b.t) {
    case 'h':
      return <h3 key={i}>{b.text}</h3>;
    case 'p':
      return (
        <p key={i}>
          <Rich text={b.text} />
        </p>
      );
    case 'meta':
      return (
        <dl key={i} className="doc-meta">
          {b.rows.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>
                <Rich text={v} />
              </dd>
            </div>
          ))}
        </dl>
      );
    case 'list': {
      const Tag = b.ordered ? 'ol' : 'ul';
      return (
        <Tag key={i}>
          {b.items.map((item) => (
            <li key={item}>
              <Rich text={item} />
            </li>
          ))}
        </Tag>
      );
    }
    case 'quote':
      return (
        <blockquote key={i}>
          <Rich text={`“${b.text}”`} />
        </blockquote>
      );
    case 'table':
      return (
        <div key={i} className="doc-table-wrap" tabIndex={0} role="region" aria-label="Payment table">
          <table className="doc-table">
            <thead>
              <tr>
                {b.head.map((h) => (
                  <th key={h} scope="col">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((row) => (
                <tr key={row.join('|')}>
                  {row.map((cell, c) => (
                    <td key={c} className={b.numeric?.includes(c) ? 'num' : undefined}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'sign':
      return (
        <div key={i} className="doc-sign">
          {b.lines.map((l) => (
            <p key={l}>
              <Rich text={l} />
            </p>
          ))}
        </div>
      );
    case 'note':
      return (
        <p key={i} className="doc-note">
          {b.text}
        </p>
      );
    case 'headline':
      return (
        <div key={i} className="doc-headline">
          <h2>{b.text}</h2>
          {b.standfirst && <p className="doc-standfirst">{b.standfirst}</p>}
        </div>
      );
  }
}

export function Paper({ doc, headingId }: { doc: DocDef; headingId?: string }) {
  if (doc.kind === 'news') {
    return (
      <article className="paper paper--news" aria-labelledby={headingId}>
        <header className="news-masthead">
          <p className="news-masthead__name">{doc.masthead}</p>
          <p className="news-masthead__meta">{doc.footer}</p>
        </header>
        <h2 id={headingId} className="sr-only">
          {doc.title}
        </h2>
        <div className="paper__body paper__body--columns">{doc.blocks.map(renderBlock)}</div>
      </article>
    );
  }
  return (
    <article className={`paper paper--${doc.kind}`} aria-labelledby={headingId}>
      <header className="paper__header">
        <div className="paper__org">
          <DeltaMark size={26} />
          <span>{BRAND.org}</span>
        </div>
        {doc.classification && <span className="paper__stamp">{doc.classification}</span>}
      </header>
      <h2 id={headingId} className="paper__title">
        {doc.heading}
      </h2>
      <div className="paper__body">{doc.blocks.map(renderBlock)}</div>
      {doc.footer && <footer className="paper__footer">{doc.footer}</footer>}
    </article>
  );
}

interface DocumentDialogProps {
  doc: DocDef | null;
  onClose: () => void;
  closeLabel?: string;
  footer?: ReactNode;
}

/** Accessible document viewer using the native modal dialog (focus trap, Escape, focus return). */
export function DocumentDialog({ doc, onClose, closeLabel = 'Close document', footer }: DocumentDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  // The native "close" event is queued, so after we close the dialog ourselves it can arrive
  // after the next document has opened. Ignore closes we initiated.
  const selfClosed = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (doc && !el.open) el.showModal();
    if (!doc && el.open) {
      selfClosed.current = true;
      el.close();
    }
  }, [doc]);

  return (
    <dialog
      ref={ref}
      className="doc-dialog"
      aria-labelledby="doc-dialog-title"
      onClose={() => {
        if (selfClosed.current) {
          selfClosed.current = false;
          return;
        }
        if (doc) onClose();
      }}
      onCancel={(e) => {
        e.preventDefault();
        if (doc) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          if (doc) onClose();
        }
      }}
      onClick={(e) => {
        if (e.target === ref.current && doc) onClose();
      }}
    >
      {doc && (
        <div className="doc-dialog__frame">
          <div className="doc-dialog__bar">
            <p className="doc-dialog__label">{doc.title}</p>
            <button type="button" className="btn btn--light btn--small" onClick={onClose} autoFocus>
              <CloseIcon width={16} height={16} />
              {closeLabel}
            </button>
          </div>
          <div className="doc-dialog__scroll">
            <Paper doc={doc} headingId="doc-dialog-title" />
          </div>
          {footer && <div className="doc-dialog__footer">{footer}</div>}
        </div>
      )}
    </dialog>
  );
}

/** A document lying on the table in a scene — opens the dialog. */
export function TableDocument({
  title,
  kicker,
  onOpen,
  state,
  className,
}: {
  title: string;
  kicker: string;
  onOpen: () => void;
  state: 'waiting' | 'active' | 'reviewed' | 'locked';
  className?: string;
}) {
  return (
    <button
      type="button"
      className={`table-doc table-doc--${state}${className ? ` ${className}` : ''}`}
      onClick={onOpen}
      aria-disabled={state === 'locked' || undefined}
      aria-label={`${title}${state === 'reviewed' ? ' (reviewed)' : state === 'locked' ? ' (not yet available)' : ''}`}
    >
      <span className="table-doc__sheet" aria-hidden="true">
        <span className="table-doc__org">
          <DeltaMark size={14} /> {BRAND.org}
        </span>
        <span className="table-doc__title">{title}</span>
        <span className="table-doc__lines">
          <i />
          <i />
          <i />
          <i />
        </span>
      </span>
      <span className="table-doc__label">
        {state === 'reviewed' ? 'Reviewed' : kicker}
      </span>
    </button>
  );
}
