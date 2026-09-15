import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { SCENES } from '../assets';
import { OutcomeCard } from '../components/Choices';
import { ContextView, DockHeader, Prompt } from '../components/Dock';
import { DocumentDialog } from '../components/Documents';
import { CheckIcon, DeltaMark, LockIcon } from '../components/Icons';
import { useNarrateOnce, useNarration } from '../components/Narration';
import { Stage } from '../components/Stage';
import { EVIDENCE_COPY, EVIDENCE_LABEL, EVIDENCE_STEPS, NARRATION, PAGE_META, UI } from '../sim/content';
import { DOCUMENTS } from '../sim/documents';
import { useSim } from '../sim/store';
import type { EvidenceId } from '../sim/types';

// Screen 1 — Due Diligence Review on a top-view table. The folders are the interface;
// the dock carries one line: what to do next.

const ORDER: EvidenceId[] = ['incident', 'nearMiss', 'payments', 'correspondence', 'news'];
const ROTATION: Record<EvidenceId, string> = {
  incident: '-3deg',
  nearMiss: '2.5deg',
  payments: '-2deg',
  correspondence: '3.5deg',
  news: '-4.5deg',
};
const stepIndex = (id: EvidenceId) => EVIDENCE_STEPS.findIndex((s) => s.docs.includes(id));

type FolderState = 'locked' | 'active' | 'reviewed';

function Folder({ id, state, onClick }: { id: EvidenceId; state: FolderState; onClick: () => void }) {
  const step = stepIndex(id) + 1;
  const status = state === 'reviewed' ? ', reviewed' : state === 'locked' ? ', not yet available' : '';
  return (
    <button
      type="button"
      className={`folder is-${state}`}
      style={{ '--rot': ROTATION[id] } as CSSProperties}
      onClick={onClick}
      aria-disabled={state === 'locked' || undefined}
      aria-label={`Step ${step}: open ${EVIDENCE_LABEL[id]}${status}`}
    >
      <span className="folder__tab" aria-hidden="true" />
      {id === 'news' && <span className="folder__clip" aria-hidden="true" />}
      <span className="folder__cover" aria-hidden="true">
        <span className="folder__step">{step}</span>
        <DeltaMark size={30} />
        <span className="folder__label">{EVIDENCE_LABEL[id]}</span>
        {state === 'reviewed' && (
          <span className="folder__check">
            <CheckIcon width={13} height={13} />
          </span>
        )}
        {state === 'locked' && (
          <span className="folder__lock">
            <LockIcon width={16} height={16} />
          </span>
        )}
      </span>
    </button>
  );
}

export function Page03Evidence() {
  const { sim, dispatch } = useSim();
  const { say } = useNarration();
  const [open, setOpen] = useState<EvidenceId | null>(null);
  const [blocked, setBlocked] = useState(false);
  const [ctx, setCtx] = useState(false);
  const reviewed = sim.evidence.reviewed;
  const current = EVIDENCE_STEPS.findIndex((s) => !s.docs.every((d) => reviewed.includes(d)));
  const allReviewed = current === -1;

  useNarrateOnce('evidence-load', NARRATION.evidenceLoad);
  const patternSaid = useRef(false);
  useEffect(() => {
    if (!patternSaid.current && reviewed.includes('payments') && !allReviewed) {
      patternSaid.current = true;
      say(NARRATION.evidencePattern);
    }
  }, [reviewed, allReviewed, say]);

  useEffect(() => {
    if (allReviewed && !sim.evidence.complete) dispatch({ type: 'EVIDENCE_COMPLETE' });
  }, [allReviewed, sim.evidence.complete, dispatch]);

  const stateOf = (id: EvidenceId): FolderState => (reviewed.includes(id) ? 'reviewed' : stepIndex(id) === current ? 'active' : 'locked');

  const onFolder = (id: EvidenceId) => {
    setCtx(false);
    if (stateOf(id) === 'locked') {
      dispatch({ type: 'EVIDENCE_BLOCKED' });
      setBlocked(true);
      return;
    }
    setBlocked(false);
    setOpen(id);
  };

  const onClose = () => {
    if (open) dispatch({ type: 'EVIDENCE_REVIEWED', id: open });
    setOpen(null);
    // The next available folder (or Continue) takes focus.
    window.setTimeout(() => document.querySelector<HTMLElement>('.folder.is-active, #controls .btn--primary')?.focus(), 80);
  };

  const step = allReviewed ? null : EVIDENCE_STEPS[current];
  const opened = step ? step.docs.filter((d) => reviewed.includes(d)).length : 0;

  return (
    <>
      <Stage
        image={SCENES.tabletop}
        label="Evidence desk"
        chapter={{ title: PAGE_META[3].title, subtitle: PAGE_META[3].subtitle }}
        overlay={
          <div className="folders">
            {ORDER.map((id) => (
              <Folder key={id} id={id} state={stateOf(id)} onClick={() => onFolder(id)} />
            ))}
          </div>
        }
      >
        <DockHeader
          page={3}
          title={PAGE_META[3].title}
          steps={4}
          current={allReviewed ? 4 : current}
          onContext={() => setCtx((c) => !c)}
          contextOpen={ctx}
        />
        {ctx ? (
          <ContextView onBack={() => setCtx(false)}>
            <p>{EVIDENCE_COPY.situation}</p>
          </ContextView>
        ) : sim.evidence.complete ? (
          <OutcomeCard
            text={sim.reviewOrderCorrect ? EVIDENCE_COPY.completeCorrect : EVIDENCE_COPY.completeAfterBlock}
            feedback={EVIDENCE_COPY.feedback}
            onContinue={() => dispatch({ type: 'GO', page: 4 })}
          />
        ) : step ? (
          <>
            {blocked && <Prompt tone="warn">{EVIDENCE_COPY.blocked}</Prompt>}
            <Prompt step={`Step ${current + 1} of 4${step.docs.length > 1 ? ` · ${opened} of ${step.docs.length} opened` : ''}`}>
              {UI.evidenceSteps[current]}
            </Prompt>
          </>
        ) : null}
      </Stage>
      <DocumentDialog doc={open ? DOCUMENTS[open] : null} onClose={onClose} closeLabel="Close and mark reviewed" />
    </>
  );
}
