import { Fragment, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { ArrowRight, X } from '@phosphor-icons/react';
import { NEWSPRINT, PROPS, type TableSheet } from '../assets';
import { BRAND } from '../sim/content';
import type { Block, DocDef } from '../sim/documents';
import { DeltaMark } from './Icons';
import { Picture } from './Picture';

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
    case 'photo':
      return (
        <figure key={i} className="doc-photo">
          <Picture src={b.src} alt={b.alt} sizes="(max-width: 819px) 92vw, 720px" />
          {b.caption && <figcaption>{b.caption}</figcaption>}
        </figure>
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
      <article className="paper paper--news" aria-labelledby={headingId} style={{ backgroundImage: `url(${NEWSPRINT})` }}>
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
    <article
      className={`paper paper--${doc.kind}${doc.letterhead ? ' paper--letterhead' : ''}`}
      aria-labelledby={headingId}
      style={doc.letterhead ? { backgroundImage: `url(${PROPS.docPaper})` } : undefined}
    >
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

/** Opens a native modal dialog while `open` is true; handles Escape, backdrop clicks and stale close events. */
export function useModal(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDialogElement>(null);
  // The native "close" event is queued, so after we close the dialog ourselves it can arrive
  // after the next document has opened. Ignore closes we initiated.
  const selfClosed = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) {
      selfClosed.current = true;
      el.close();
    }
  }, [open]);

  const props = {
    ref,
    onClose: () => {
      if (selfClosed.current) {
        selfClosed.current = false;
        return;
      }
      if (open) onClose();
    },
    onCancel: (e: { preventDefault: () => void }) => {
      e.preventDefault();
      if (open) onClose();
    },
    onKeyDown: (e: { key: string; preventDefault: () => void }) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (open) onClose();
      }
    },
    onClick: (e: { target: EventTarget }) => {
      if (e.target === ref.current && open) onClose();
    },
  };
  return props;
}

interface DocumentDialogProps {
  doc: DocDef | null;
  onClose: () => void;
  closeLabel?: string;
  footer?: ReactNode;
}

/** Artifact viewer (spec §10): the document expands over a blurred scene and returns to the table on close. */
export function DocumentDialog({ doc, onClose, closeLabel = 'Close document', footer }: DocumentDialogProps) {
  const modal = useModal(!!doc, onClose);
  return (
    <dialog {...modal} className="doc-dialog" aria-labelledby="doc-dialog-title">
      {doc && (
        <div className="doc-dialog__frame">
          <button type="button" className="doc-dialog__close" onClick={onClose} aria-label={closeLabel} title={closeLabel} autoFocus>
            <X size={22} />
          </button>
          <div className="doc-dialog__scroll">
            <DocumentBody key={doc.id} doc={doc} />
          </div>
          {footer && <div className="doc-dialog__footer">{footer}</div>}
        </div>
      )}
    </dialog>
  );
}

/** Key facts first (with the document's photo), then the full text on request. */
function DocumentBody({ doc }: { doc: DocDef }) {
  const [full, setFull] = useState(!doc.keyFacts?.length);
  const bodyRef = useRef<HTMLDivElement>(null);
  if (full || !doc.keyFacts) return <Paper doc={doc} headingId="doc-dialog-title" />;

  const photo = doc.blocks.find((b): b is Extract<Block, { t: 'photo' }> => b.t === 'photo');
  const news = doc.kind === 'news';
  return (
    <article
      ref={bodyRef}
      className={`paper doc-summary${news ? ' paper--news' : ''}${doc.letterhead ? ' paper--letterhead' : ''}`}
      aria-labelledby="doc-dialog-title"
      style={news ? { backgroundImage: `url(${NEWSPRINT})` } : doc.letterhead ? { backgroundImage: `url(${PROPS.docPaper})` } : undefined}
    >
      {news ? (
        <header className="news-masthead">
          <p className="news-masthead__name">{doc.masthead}</p>
          <p className="news-masthead__meta">{doc.footer}</p>
        </header>
      ) : (
        <header className="paper__header">
          <div className="paper__org">
            <DeltaMark size={26} />
            <span>{BRAND.org}</span>
          </div>
          {doc.classification && <span className="paper__stamp">{doc.classification}</span>}
        </header>
      )}
      <h2 id="doc-dialog-title" className="paper__title">
        {doc.heading}
      </h2>
      {photo && (
        <figure className="doc-photo doc-summary__photo">
          <Picture src={photo.src} alt={photo.alt} sizes="(max-width: 819px) 92vw, 720px" />
        </figure>
      )}
      <p className="doc-summary__kicker">Key facts</p>
      <ul className="doc-summary__facts stagger">
        {doc.keyFacts.map((fact, i) => (
          <li key={fact} style={{ '--i': i } as CSSProperties}>
            <Rich text={fact} />
          </li>
        ))}
      </ul>
      <button type="button" className="doc-summary__more" onClick={() => setFull(true)}>
        Read the full document
        <ArrowRight size={18} aria-hidden="true" />
      </button>
    </article>
  );
}

/** A typeset document lying on the table (spec §9 interactive artifact). */
export function TableArtifact({
  title,
  label,
  stamp,
  reviewed,
  disabled,
  glow,
  folio,
  photo,
  rotate = -2,
  style,
  className,
  onOpen,
}: {
  title: string;
  label: string;
  stamp?: string;
  reviewed?: boolean;
  disabled?: boolean;
  glow?: boolean;
  folio?: boolean;
  /** A photographed sheet to show instead of the typeset one. */
  photo?: TableSheet;
  rotate?: number;
  style?: CSSProperties;
  className?: string;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      className={`interactive-artifact${glow ? ' artifact-glow' : ''}${className ? ` ${className}` : ''}`}
      style={{ ...style, '--rot': `${rotate}deg` } as CSSProperties}
      onClick={onOpen}
      aria-disabled={disabled || undefined}
      aria-label={`${label}${reviewed ? ', reviewed' : disabled ? ', not yet available' : ''}`}
    >
      {photo ? (
        <span className={`table-photo${folio ? ' table-photo--folio' : ''}`} aria-hidden="true">
          <span className="table-photo__sheet">
            <img src={photo.src} alt="" draggable={false} />
            <span
              className="table-photo__title"
              style={{ top: `${photo.band[0] * 100}%`, height: `${(photo.band[1] - photo.band[0]) * 100}%`, left: `${photo.titleX * 100}%` }}
            >
              {title}
            </span>
            {stamp && <span className="table-sheet__stamp table-photo__stamp">{stamp}</span>}
          </span>
        </span>
      ) : (
        <span className={`table-sheet${folio ? ' table-sheet--folio' : ''}`} aria-hidden="true">
          <span className="table-sheet__org">
            <DeltaMark size={12} /> {BRAND.org}
          </span>
          <span className="table-sheet__title">{title}</span>
          <span className="table-sheet__lines">
            <i />
            <i />
            <i />
            <i />
          </span>
          {stamp && <span className="table-sheet__stamp">{stamp}</span>}
        </span>
      )}
      {reviewed && <span className="interactive-artifact__reviewed">Reviewed ✓</span>}
    </button>
  );
}
