import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import type { SceneImage } from '../assets';

// Media-first stage. The scene fills the screen; interaction lives in one compact dock
// that only holds the current moment (desktop/tablet: bottom-left card; phone portrait:
// short bottom sheet; phone landscape: left rail). Dialogue sits on the media as a subtitle.

interface StageProps {
  image?: SceneImage;
  /** Custom hero content (e.g. the top-view evidence table). */
  hero?: ReactNode;
  /** Interactive artifacts placed in the visible media area, clear of the dock. */
  overlay?: ReactNode;
  /** Dialogue shown on the media (MediaQuote). */
  quote?: ReactNode;
  /** Large chapter title shown briefly over the media on arrival. */
  chapter?: { title: string; subtitle?: string };
  children?: ReactNode;
  dockHidden?: boolean;
  heroFilter?: string;
  label: string;
}

export function Stage({ image, hero, overlay, quote, chapter, children, dockHidden, heroFilter, label }: StageProps) {
  const dockRef = useRef<HTMLElement>(null);

  // Publish the dock height so media overlays, subtitles and captions sit just above it on phones.
  useEffect(() => {
    const root = document.documentElement;
    const el = dockRef.current;
    if (!el) {
      root.style.setProperty('--dock-h', '0px');
      return;
    }
    const update = () => root.style.setProperty('--dock-h', `${Math.round(el.getBoundingClientRect().height)}px`);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [dockHidden]);

  const imgStyle: CSSProperties = { objectPosition: image?.position ?? '60% 42%', filter: heroFilter };

  return (
    <main className="stage" aria-label={label}>
      <div className="stage__hero">
        {image && <img className="stage__img" src={image.src} alt={image.alt} style={imgStyle} />}
        {hero}
        <div className="stage__scrim" aria-hidden="true" />
      </div>
      {image?.standIn && <span className="standin-tag">Temporary image</span>}
      {chapter && (
        <div className="chapter" aria-hidden="true">
          <p className="chapter__title">{chapter.title}</p>
          {chapter.subtitle && <p className="chapter__sub">{chapter.subtitle}</p>}
        </div>
      )}
      {overlay && <div className="stage__overlay">{overlay}</div>}
      {quote}
      {!dockHidden && children && (
        <section id="controls" ref={dockRef} className="dock" aria-label={`${label} controls`}>
          {children}
        </section>
      )}
    </main>
  );
}
