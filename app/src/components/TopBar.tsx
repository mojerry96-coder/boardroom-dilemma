import { BRAND } from '../sim/content';
import { useNarration } from './Narration';
import { CaptionsIcon, VolumeIcon } from './Icons';

export function TopBar({ page }: { page: number }) {
  const { audio, captions, setAudio, setCaptions } = useNarration();
  const pct = `${(page / 10) * 100}%`;
  return (
    <div className="topbar">
      <p className="topbar__brand">
        <span className="brand-long">{BRAND.org}</span>
        <span className="brand-short" aria-hidden="true">
          Delta · {BRAND.orgShort}
        </span>
      </p>
      <div className="topbar__right">
        <button
          type="button"
          className="icon-btn"
          aria-pressed={audio}
          aria-label={audio ? 'Narration audio on' : 'Narration audio off'}
          title={audio ? 'Turn narration audio off' : 'Turn narration audio on'}
          onClick={() => setAudio(!audio)}
        >
          <VolumeIcon muted={!audio} />
        </button>
        <button
          type="button"
          className="icon-btn"
          aria-pressed={captions}
          aria-label={captions ? 'Captions on' : 'Captions off'}
          title={captions ? 'Turn captions off' : 'Turn captions on'}
          onClick={() => setCaptions(!captions)}
        >
          <CaptionsIcon off={!captions} />
        </button>
        <div className="progress" role="progressbar" aria-valuemin={1} aria-valuemax={10} aria-valuenow={page} aria-label="Simulation progress">
          <span className="progress__track">
            <span className="progress__fill" style={{ width: pct }} />
          </span>
          <span className="progress__label">
            {String(page).padStart(2, '0')} / 10
          </span>
        </div>
      </div>
    </div>
  );
}
