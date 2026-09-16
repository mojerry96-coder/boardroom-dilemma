import { useId, useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { shuffled } from '../sim/shuffle';
import { OPTS, type Opt } from '../sim/types';
import { PillButton } from './ui';

// A decision panel with radio options (spec Page 04 panels). Options are shuffled per run;
// the selection only counts once confirmed, because choices are final.

export function RadioPanel({
  title,
  titles,
  texts,
  seed,
  shuffleKey,
  confirmLabel,
  onConfirm,
  footer,
  className = 'page04__panel',
}: {
  className?: string;
  title: string;
  titles?: Record<Opt, string>;
  texts: Record<Opt, string>;
  seed: number;
  shuffleKey: string;
  confirmLabel: string;
  onConfirm: (opt: Opt) => void;
  footer?: ReactNode;
}) {
  const order = useMemo(() => shuffled(OPTS, seed, shuffleKey), [seed, shuffleKey]);
  const [selected, setSelected] = useState<Opt | null>(null);
  const id = useId();

  return (
    <div className={`${className} glass-panel--dark`}>
      <h2 className="panel-title" id={`${id}-title`}>
        {title}
      </h2>
      <div className="radio-list stagger" role="radiogroup" aria-labelledby={`${id}-title`}>
        {order.map((opt, i) => (
          <button
            key={opt}
            type="button"
            role="radio"
            aria-checked={selected === opt}
            className={`radio-option${titles ? '' : ' radio-option--plain'}`}
            style={{ '--i': i } as CSSProperties}
            onClick={() => setSelected(opt)}
          >
            <span className="radio-option__dot" aria-hidden="true" />
            <span>
              {titles && <span className="radio-option__title">{titles[opt]}</span>}
              {(!titles || selected === opt) && <span className="radio-option__text">{texts[opt]}</span>}
            </span>
          </button>
        ))}
      </div>
      <div className="panel-actions">
        <PillButton size="small" disabled={!selected} onClick={() => selected && onConfirm(selected)}>
          {confirmLabel}
        </PillButton>
        {footer}
      </div>
    </div>
  );
}
