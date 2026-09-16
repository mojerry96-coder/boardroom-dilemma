import { useEffect, useRef, useState, type CSSProperties, type ElementType, type HTMLAttributes, type ReactNode } from 'react';

// Progressive reveal: text that types itself in, and blocks that appear in order.
// Screen readers always receive the full text immediately; reduced motion shows everything at once.

/** A page's opening: narration first, then the interface. `animate` is false when returning mid-page. */
export interface PageIntro {
  ready: boolean;
  animate: boolean;
  skip: () => void;
}

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

/** Milliseconds per character for the typing animation. */
export const TYPE_SPEED = { title: 32, line: 20, quote: 62, prose: 14 };

export function typingMs(text: string | undefined, perChar: number) {
  return text ? text.length * perChar : 0;
}

export function TypeText({
  text,
  as: Tag = 'span',
  perChar = TYPE_SPEED.line,
  delay = 0,
  animate = true,
  className,
  onDone,
}: {
  text: string;
  as?: ElementType;
  perChar?: number;
  delay?: number;
  animate?: boolean;
  className?: string;
  onDone?: () => void;
}) {
  const instant = !animate || prefersReducedMotion();
  const [count, setCount] = useState(instant ? text.length : 0);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    if (instant) {
      setCount(text.length);
      doneRef.current?.();
      return;
    }
    setCount(0);
    let raf = 0;
    const start = performance.now() + delay;
    const tick = (now: number) => {
      const n = Math.max(0, Math.min(text.length, Math.floor((now - start) / perChar)));
      setCount(n);
      if (n < text.length) raf = requestAnimationFrame(tick);
      else doneRef.current?.();
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, perChar, delay, instant]);

  const typing = count < text.length;
  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className={typing ? 'is-typing' : undefined}>
        {text.slice(0, count)}
        {typing && <span className="type-caret" />}
        <span className="type-ghost">{text.slice(count)}</span>
      </span>
    </Tag>
  );
}

/** Renders children only once `show` is true, fading them up after `delay` ms. */
export function Reveal({
  show,
  delay = 0,
  animate = true,
  as: Tag = 'div',
  className,
  style,
  children,
  ...rest
}: {
  show: boolean;
  delay?: number;
  animate?: boolean;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
} & Omit<HTMLAttributes<HTMLElement>, 'className' | 'style' | 'children'>) {
  if (!show) return null;
  const instant = !animate || prefersReducedMotion();
  return (
    <Tag
      {...rest}
      className={`${instant ? '' : 'reveal'}${className ? ` ${className}` : ''}`}
      style={instant ? style : ({ ...style, '--reveal-delay': `${delay}ms` } as CSSProperties)}
    >
      {children}
    </Tag>
  );
}

/** True once `ms` have passed since `when` became true. Stays true after that. */
export function useDelayed(when: boolean, ms: number) {
  const [done, setDone] = useState(when && ms <= 0);
  useEffect(() => {
    if (!when || done) return;
    const id = window.setTimeout(() => setDone(true), Math.max(0, ms));
    return () => window.clearTimeout(id);
  }, [when, ms, done]);
  return done;
}

/** Timing for a page's title block, so controls outside it can appear right after it. */
export function revealTiming(title: string, subtitle?: string, objective?: string) {
  const titleMs = typingMs(title, TYPE_SPEED.title);
  const subtitleAt = titleMs + 120;
  const objectiveAt = subtitleAt + (subtitle ? 380 : 0);
  const objectiveMs = typingMs(objective, TYPE_SPEED.line);
  return { titleMs, subtitleAt, objectiveAt, controlsAt: objectiveAt + objectiveMs + 260 };
}
