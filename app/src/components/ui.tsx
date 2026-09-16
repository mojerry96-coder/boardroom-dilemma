import { useState, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Check, Play } from '@phosphor-icons/react';
import { BRAND } from '../sim/content';
import { Reveal, revealTiming, TYPE_SPEED, TypeText, type PageIntro } from './Reveal';

// Small building blocks from the replacement spec: title block, pill buttons, text links,
// glass panels and the consequence card shown after a decision.

/**
 * The page title block. With an `intro`, nothing shows until the opening narration is done;
 * then the title and task line type in and the controls follow.
 */
export function StageCopy({
  // Every page carries the same eyebrow, so titles sit at the same height from page to page.
  eyebrow = BRAND.eyebrow,
  title,
  subtitle,
  objective,
  intro,
  className,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  objective?: string;
  intro?: PageIntro;
  className?: string;
  children?: ReactNode;
}) {
  const ready = intro ? intro.ready : true;
  const animate = intro ? intro.animate : false;
  const timing = revealTiming(title, subtitle, objective);
  return (
    <section className={`stage-copy${className ? ` ${className}` : ''}`}>
      {ready && (
        <>
          {eyebrow && (
            <Reveal show animate={animate} as="span" className="stage-eyebrow">
              {eyebrow}
            </Reveal>
          )}
          <h1 className="stage-title" tabIndex={-1} data-page-title>
            <TypeText text={title} perChar={TYPE_SPEED.title} animate={animate} />
          </h1>
          {subtitle && (
            <Reveal show animate={animate} delay={timing.subtitleAt} as="p" className="stage-subtitle">
              {subtitle}
            </Reveal>
          )}
          {objective && (
            <p className="stage-objective">
              <TypeText text={objective} perChar={TYPE_SPEED.line} delay={timing.objectiveAt} animate={animate} />
            </p>
          )}
          {children && (
            <Reveal show animate={animate} delay={timing.controlsAt} className="stage-copy__controls">
              {children}
            </Reveal>
          )}
        </>
      )}
    </section>
  );
}

interface PillProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'white' | 'green' | 'blue';
  size?: 'default' | 'small';
  icon?: ReactNode | 'play' | 'none';
}

export function PillButton({ variant = 'white', size = 'default', icon = 'play', children, className, type = 'button', ...rest }: PillProps) {
  const glyph = icon === 'play' ? <Play size={size === 'small' ? 16 : 20} weight="fill" /> : icon === 'none' ? null : icon;
  return (
    <button
      type={type}
      className={`primary-pill primary-pill--${variant}${size === 'small' ? ' primary-pill--small' : ''}${className ? ` ${className}` : ''}`}
      {...rest}
    >
      {glyph}
      <span>{children}</span>
    </button>
  );
}

export function TextLink({ children, dark, className, type = 'button', ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { dark?: boolean }) {
  return (
    <button type={type} className={`text-link${dark ? ' text-link--dark' : ''}${className ? ` ${className}` : ''}`} {...rest}>
      {children}
    </button>
  );
}

export function GlassPanel({ tone = 'dark', className, children, label }: { tone?: 'dark' | 'light'; className?: string; children: ReactNode; label?: string }) {
  return (
    <div className={`glass-panel--${tone}${className ? ` ${className}` : ''}`} role={label ? 'group' : undefined} aria-label={label}>
      {children}
    </div>
  );
}

/** In-world consequence of a decision, with the teaching feedback behind "Why it matters". */
export function OutcomePanel({
  chosen,
  text,
  extra,
  feedback,
  continueLabel = 'Continue',
  onContinue,
  actions,
  className,
}: {
  chosen?: string;
  text: string;
  extra?: string[];
  feedback?: string;
  continueLabel?: string;
  onContinue?: () => void;
  actions?: ReactNode;
  className?: string;
}) {
  const [why, setWhy] = useState(false);
  return (
    <div className={`outcome glass-panel--dark${className ? ` ${className}` : ''}`}>
      {chosen && (
        <p className="outcome__chosen">
          <Check size={15} />
          {chosen}
        </p>
      )}
      <div aria-live="polite">
        {why && feedback ? (
          <p className="outcome__why">{feedback}</p>
        ) : (
          <TypeText as="p" className="outcome__text" text={[text, ...(extra ?? [])].join(' ')} perChar={TYPE_SPEED.prose} />
        )}
      </div>
      <div className="panel-actions">
        {onContinue && (
          <PillButton size="small" onClick={onContinue} autoFocus>
            {continueLabel}
          </PillButton>
        )}
        {feedback && (
          <TextLink aria-pressed={why} onClick={() => setWhy((w) => !w)}>
            {why ? 'Back to the outcome' : 'Why it matters'}
          </TextLink>
        )}
        {actions}
      </div>
    </div>
  );
}
