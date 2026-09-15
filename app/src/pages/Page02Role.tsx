import { useState } from 'react';
import { SCENES } from '../assets';
import { DockHeader } from '../components/Dock';
import { DocumentDialog } from '../components/Documents';
import { ArrowIcon, ClockIcon, DocIcon } from '../components/Icons';
import { useNarrateOnce } from '../components/Narration';
import { Stage } from '../components/Stage';
import { NARRATION, PAGE_META, ROLE, UI } from '../sim/content';
import { DOCUMENTS } from '../sim/documents';
import { useSim } from '../sim/store';

export function Page02Role() {
  const { sim, dispatch } = useSim();
  const [brief, setBrief] = useState(false);
  useNarrateOnce('role', NARRATION.role);
  const ready = sim.learnerName.trim().length > 0;

  return (
    <>
      <Stage image={SCENES.role} label="Your role" chapter={{ title: PAGE_META[2].title }}>
        <DockHeader page={2} title="Your Role" />
        <p className="dock__lead">{UI.roleLine}</p>
        <p className="pill">
          <ClockIcon />
          {ROLE.pill}
        </p>
        <form
          className="name-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (ready) dispatch({ type: 'GO', page: 3 });
          }}
        >
          <label htmlFor="learner-name" className="sr-only">
            {ROLE.nameLabel}
          </label>
          <input
            id="learner-name"
            className="text-input"
            autoComplete="name"
            placeholder={ROLE.namePlaceholder}
            value={sim.learnerName}
            onChange={(e) => dispatch({ type: 'SET_NAME', name: e.target.value })}
          />
          <button type="submit" className="btn btn--accent" disabled={!ready}>
            Begin
            <ArrowIcon />
          </button>
        </form>
        <div className="row">
          <button type="button" className="btn btn--quiet btn--small" onClick={() => setBrief(true)}>
            <DocIcon width={16} height={16} />
            {UI.readBrief}
          </button>
        </div>
      </Stage>
      <DocumentDialog doc={brief ? DOCUMENTS.brief : null} onClose={() => setBrief(false)} />
    </>
  );
}
