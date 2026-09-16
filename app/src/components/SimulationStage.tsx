import { useState, type CSSProperties, type ReactNode } from 'react';
import { SkipForward } from '@phosphor-icons/react';
import type { SceneImage } from '../assets';
import { SCENE_PLACEHOLDERS } from '../scenePlaceholders';
import { Picture } from './Picture';
import { CHAPTERS } from '../sim/experience';
import { MissionMap } from './Experience';
import { CaptionsIcon, MusicIcon, VolumeIcon } from './Icons';
import { useNarration } from './Narration';
import type { PageIntro } from './Reveal';

// Shared stage (spec §6–7): full-bleed scene, left wash, progress top-right.
// While a page's opening narration plays, only the scene, progress and a Skip control show.

interface SimulationStageProps {
  page: number;
  total?: number;
  image?: SceneImage;
  /** Extra layers drawn over the background but under the controls (e.g. portrait cards). */
  backdrop?: ReactNode;
  imageFilter?: string;
  wash?: boolean | 'strong';
  label: string;
  className?: string;
  intro?: PageIntro;
  children: ReactNode;
}

/** The scene photo, with a tiny blurred preview underneath until the full image has loaded. */
function SceneBackdrop({ image, style }: { image: SceneImage; style: CSSProperties }) {
  const [loaded, setLoaded] = useState(false);
  const placeholder = SCENE_PLACEHOLDERS[image.src.replace(/^.*\//, '').replace(/\.\w+$/, '')];
  return (
    <>
      {placeholder && !loaded && (
        <div
          className="sim-stage__placeholder"
          style={{ backgroundImage: `url(${placeholder})`, backgroundPosition: String(style.objectPosition ?? 'center'), filter: `blur(22px) ${style.filter ?? ''}` }}
          aria-hidden="true"
        />
      )}
      <Picture
        className={`sim-stage__bg${loaded ? ' is-loaded' : ''}`}
        src={image.src}
        alt={image.alt}
        style={style}
        ref={(el) => {
          if (el?.complete && el.naturalWidth) setLoaded(true);
        }}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />
    </>
  );
}

export function SimulationStage({ page, total = 10, image, backdrop, imageFilter, wash = true, label, className, intro, children }: SimulationStageProps) {
  const { audio, captions, music, setAudio, setCaptions, setMusic } = useNarration();
  const [mapOpen, setMapOpen] = useState(false);
  const bgStyle: CSSProperties = { objectPosition: image?.position ?? 'center center', filter: imageFilter };
  const chapter = CHAPTERS[page];

  return (
    <main className={`sim-stage${className ? ` ${className}` : ''}${intro && !intro.ready ? ' is-intro' : ''}`} aria-label={label}>
      {image && <SceneBackdrop key={image.src} image={image} style={bgStyle} />}
      {backdrop}
      {wash && <div className={`sim-stage__wash${wash === 'strong' ? ' sim-stage__wash--strong' : ''}`} aria-hidden="true" />}

      <div className="sim-stage__content">
        <div className="sim-stage__top-right">
          <div className="sim-stage__audio">
            <button
              type="button"
              className="icon-btn"
              aria-pressed={audio}
              aria-label={audio ? 'Narration audio on' : 'Narration audio off'}
              title={audio ? 'Turn narration audio off' : 'Turn narration audio on'}
              onClick={() => setAudio(!audio)}
            >
              <VolumeIcon muted={!audio} size={18} />
            </button>
            <button
              type="button"
              className="icon-btn"
              aria-pressed={music}
              aria-label={music ? 'Background music on' : 'Background music off'}
              title={music ? 'Turn the background music off' : 'Turn the background music on'}
              onClick={() => setMusic(!music)}
            >
              <MusicIcon off={!music} size={18} />
            </button>
            <button
              type="button"
              className="icon-btn"
              aria-pressed={captions}
              aria-label={captions ? 'Captions on' : 'Captions off'}
              title={captions ? 'Turn captions off' : 'Turn captions on'}
              onClick={() => setCaptions(!captions)}
            >
              <CaptionsIcon off={!captions} size={18} />
            </button>
          </div>
          {chapter && (
            <button type="button" className="sim-stage__mission" onClick={() => setMapOpen(true)} title="Show your mission">
              {chapter.hoursLeft > 0 ? `${chapter.hoursLeft}h left` : 'Board met'} · {chapter.title}
            </button>
          )}
          <div className="sim-stage__progress" role="img" aria-label={`Page ${page} of ${total}`}>
            <span className="sim-stage__track" aria-hidden="true">
              <span className="sim-stage__progress-fill" style={{ width: `${(page / total) * 100}%` }} />
            </span>
            <span aria-hidden="true">
              {String(page).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
          </div>
        </div>

        {children}

        {intro && !intro.ready && (
          <button type="button" className="skip-intro" onClick={intro.skip}>
            Skip narration
            <SkipForward size={16} aria-hidden="true" />
          </button>
        )}
      </div>
      <MissionMap open={mapOpen} onClose={() => setMapOpen(false)} page={page} />
    </main>
  );
}
