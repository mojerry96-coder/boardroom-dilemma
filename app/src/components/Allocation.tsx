import type { CSSProperties } from 'react';
import { griBand, rcsBand } from '../sim/accountability';
import { LEVER_COPY } from '../sim/content';
import { LEVERS, type Allocation, type Lever } from '../sim/types';

interface AllocationSlidersProps {
  value: Allocation;
  onChange: (lever: Lever, v: number) => void;
  disabled?: boolean;
  compareTo?: Allocation | null;
}

/** Three responsibility sliders that always total 100% (spec §16 slider rows). */
export function AllocationSliders({ value, onChange, disabled, compareTo }: AllocationSlidersProps) {
  return (
    <div className="sliders">
      {LEVERS.map((lever) => {
        const copy = LEVER_COPY[lever];
        const id = `lever-${lever}`;
        return (
          <div className="slider-row" key={lever}>
            <div className="slider-row__header">
              <label htmlFor={id} title={copy.subtitle}>
                {copy.label}
              </label>
              <output htmlFor={id} className="slider-row__value">
                {compareTo && compareTo[lever] !== value[lever] && <span className="slider-row__was">was {compareTo[lever]}% · </span>}
                {value[lever]}%
              </output>
            </div>
            <input
              id={id}
              type="range"
              min={0}
              max={100}
              step={1}
              value={value[lever]}
              disabled={disabled}
              aria-valuetext={`${copy.label}: ${value[lever]} percent`}
              style={{ '--fill': `${value[lever]}%` } as CSSProperties}
              onChange={(e) => onChange(lever, Number(e.target.value))}
            />
          </div>
        );
      })}
    </div>
  );
}

/** Live Governance Risk Index and Reform Credibility Score. */
export function Readouts({ gri, rcs }: { gri: number; rcs: number }) {
  const griTone = gri < 40 ? 'good' : gri < 65 ? 'mid' : 'bad';
  const rcsTone = rcs >= 70 ? 'good' : rcs >= 45 ? 'mid' : 'bad';
  return (
    <p className="readouts" aria-live="polite">
      <span className={`readout readout--${griTone}`} title="Governance Risk Index — lower is better">
        Governance risk <b>{gri}</b> <span className="readout__band">{griBand(gri)}</span>
      </span>
      <span className={`readout readout--${rcsTone}`} title="Reform Credibility Score — higher is better">
        Reform credibility <b>{rcs}</b> <span className="readout__band">{rcsBand(rcs)}</span>
      </span>
    </p>
  );
}
