import { useId, useMemo, useState, type ReactNode } from 'react';
import { shuffled } from '../sim/shuffle';
import { OPTS, type Opt } from '../sim/types';
import { ArrowIcon } from './Icons';

// Decision pattern: short option buttons → the selected option's full wording → confirm.
// After confirming, the dock shows the in-world consequence, with "why" on request.

interface ChoicePickerProps {
  prompt?: string;
  /** Short labels shown on the buttons. */
  labels: Record<Opt, string>;
  /** Full wording, shown for the selected option only. */
  options: Record<Opt, string>;
  seed: number;
  shuffleKey: string;
  onConfirm: (opt: Opt) => void;
  confirmLabel?: string;
}

// Keeps a learner's unconfirmed selection when the picker briefly unmounts (e.g. while context is open).
const pendingSelection = new Map<string, Opt>();

export function ChoicePicker({ prompt, labels, options, seed, shuffleKey, onConfirm, confirmLabel = 'Confirm' }: ChoicePickerProps) {
  const order = useMemo(() => shuffled(OPTS, seed, shuffleKey), [seed, shuffleKey]);
  const memoryKey = `${seed}:${shuffleKey}`;
  const [selected, setSelectedState] = useState<Opt | null>(() => pendingSelection.get(memoryKey) ?? null);
  const setSelected = (opt: Opt | null) => {
    if (opt) pendingSelection.set(memoryKey, opt);
    else pendingSelection.delete(memoryKey);
    setSelectedState(opt);
  };
  const id = useId();

  return (
    <div className={`picker${selected ? ' has-selection' : ''}`}>
      {prompt && (
        <p className="picker__prompt" id={`${id}-prompt`}>
          {prompt}
        </p>
      )}
      <div className="picker__grid" role="group" aria-labelledby={prompt ? `${id}-prompt` : undefined}>
        {order.map((opt) => (
          <button
            key={opt}
            type="button"
            className={`opt${selected === opt ? ' is-selected' : ''}`}
            aria-pressed={selected === opt}
            aria-controls={`${id}-preview`}
            onClick={() => setSelected(opt)}
          >
            {labels[opt]}
          </button>
        ))}
      </div>
      {selected && (
        <div className="picker__selected">
          <span className="chip chip--done">{labels[selected]}</span>
          <button type="button" className="btn btn--link btn--tiny" onClick={() => setSelected(null)}>
            Change
          </button>
        </div>
      )}
      <p id={`${id}-preview`} className={`picker__preview${selected ? '' : ' is-empty'}`} aria-live="polite">
        {selected ? options[selected] : 'Select an option to read it in full.'}
      </p>
      <button type="button" className="btn btn--primary" disabled={!selected} onClick={() => selected && onConfirm(selected)}>
        {confirmLabel}
        <ArrowIcon />
      </button>
    </div>
  );
}

export function OutcomeCard({
  chosen,
  text,
  extra,
  feedback,
  whyLabel = 'Why it matters',
  continueLabel = 'Continue',
  onContinue,
  actions,
}: {
  chosen?: string;
  text: string;
  extra?: string[];
  feedback?: string;
  whyLabel?: string;
  continueLabel?: string;
  onContinue?: () => void;
  actions?: ReactNode;
}) {
  const [why, setWhy] = useState(false);
  return (
    <div className="outcome">
      {chosen && <p className="kicker">You chose · {chosen}</p>}
      <div aria-live="polite">
        {why && feedback ? (
          <p className="outcome__why">{feedback}</p>
        ) : (
          <p className="outcome__text">
            {text}
            {extra?.map((e) => (
              <span key={e}> {e}</span>
            ))}
          </p>
        )}
      </div>
      <div className="row">
        {onContinue && (
          <button type="button" className="btn btn--primary" onClick={onContinue} autoFocus>
            {continueLabel}
            <ArrowIcon />
          </button>
        )}
        {feedback && (
          <button type="button" className="btn btn--quiet" aria-pressed={why} onClick={() => setWhy((w) => !w)}>
            {why ? 'Back' : whyLabel}
          </button>
        )}
        {actions}
      </div>
    </div>
  );
}

export function Chip({ children, tone }: { children: ReactNode; tone?: 'warn' | 'done' }) {
  return <span className={`chip${tone ? ` chip--${tone}` : ''}`}>{children}</span>;
}
