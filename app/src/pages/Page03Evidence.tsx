import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { FolderOpen } from '@phosphor-icons/react';
import { FOLDER_ART, SCENES } from '../assets';
import { DocumentDialog } from '../components/Documents';
import { LockIcon } from '../components/Icons';
import { usePageIntro } from '../components/Experience';
import { useNarration } from '../components/Narration';
import { revealTiming } from '../components/Reveal';
import { EVIDENCE_HINT, GUIDE, OBJECTIVES } from '../sim/experience';
import { SimulationStage } from '../components/SimulationStage';
import { OutcomePanel, PillButton, StageCopy } from '../components/ui';
import { BRAND, EVIDENCE_COPY, EVIDENCE_LABEL, EVIDENCE_STEPS, NARRATION, PAGE_META, UI } from '../sim/content';
import { DOCUMENTS } from '../sim/documents';
import { useSim } from '../sim/store';
import type { EvidenceId } from '../sim/types';

// Page 03 — Evidence Desk (spec §14). Five separate folder artifacts on the top-view table.
// The review must follow the script's order: safety chain → financial record → correspondence → press.

const ORDER: EvidenceId[] = ['incident', 'nearMiss', 'payments', 'correspondence', 'news'];
const SUBTITLE = 'Open what matters. Build your view.';
/** Shorter labels used when the folders are small (phones), so no word is cut on the label panel. */
const SHORT_LABEL: Record<EvidenceId, string> = {
  incident: 'Incident Report',
  nearMiss: 'Near-Miss Report',
  payments: 'Payment Records',
  correspondence: 'Email',
  news: 'News Clipping',
};
const stepIndex = (id: EvidenceId) => EVIDENCE_STEPS.findIndex((s) => s.docs.includes(id));

type FolderState = 'locked' | 'active' | 'reviewed';

export function Page03Evidence() {
  const { sim, dispatch } = useSim();
  const { say } = useNarration();
  const reviewed = sim.evidence.reviewed;
  const [entered, setEntered] = useState(reviewed.length > 0 || sim.evidence.complete);
  const [open, setOpen] = useState<EvidenceId | null>(null);
  const [blocked, setBlocked] = useState(false);
  const current = EVIDENCE_STEPS.findIndex((s) => !s.docs.every((d) => reviewed.includes(d)));
  const allReviewed = current === -1;

  const intro = usePageIntro('evidence', NARRATION.evidenceLoad, reviewed.length === 0 && !sim.evidence.complete);
  const timing = revealTiming(PAGE_META[3].title, SUBTITLE, OBJECTIVES[3]);
  const patternSaid = useRef(false);
  useEffect(() => {
    if (!patternSaid.current && reviewed.includes('payments') && !allReviewed) {
      patternSaid.current = true;
      say(GUIDE.evidencePattern);
    }
  }, [reviewed, allReviewed, say]);

  useEffect(() => {
    if (allReviewed && !sim.evidence.complete) dispatch({ type: 'EVIDENCE_COMPLETE' });
  }, [allReviewed, sim.evidence.complete, dispatch]);

  const stateOf = (id: EvidenceId): FolderState => (reviewed.includes(id) ? 'reviewed' : stepIndex(id) === current ? 'active' : 'locked');

  const enter = () => {
    setEntered(true);
    window.setTimeout(() => document.querySelector<HTMLElement>('.desk-folder.is-active')?.focus(), 60);
  };

  const onFolder = (id: EvidenceId) => {
    // A folder clicked before entering starts the review too (and opens it, if it is the first step).
    if (!entered) setEntered(true);
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
    const id = open;
    setOpen(null);
    // Focus returns to the same folder on the table.
    window.setTimeout(() => document.querySelector<HTMLElement>(`.desk-folder--${id}`)?.focus(), 60);
  };

  const step = allReviewed ? null : EVIDENCE_STEPS[current];
  const opened = step ? step.docs.filter((d) => reviewed.includes(d)).length : 0;

  return (
    <>
      <SimulationStage page={3} image={SCENES.desk} label="Evidence Desk" className="page03" intro={intro}>
        <StageCopy className="page03__intro" eyebrow={BRAND.eyebrow} title={PAGE_META[3].title} subtitle={SUBTITLE} objective={OBJECTIVES[3]} intro={intro}>
          {!entered ? (
            <div className="stage-actions page03__start">
              <PillButton className="is-calling" icon={<FolderOpen size={22} />} onClick={enter}>
                Enter the Evidence Desk
              </PillButton>
              <p className="page03__start-hint">Start here. The five folders unlock, one step at a time, once you enter.</p>
            </div>
          ) : (
            <div className="page03__status" id="controls">
              {sim.evidence.complete ? (
                <OutcomePanel
                  text={sim.reviewOrderCorrect ? EVIDENCE_COPY.completeCorrect : EVIDENCE_COPY.completeAfterBlock}
                  feedback={EVIDENCE_COPY.feedback}
                  onContinue={() => dispatch({ type: 'GO', page: 4 })}
                />
              ) : step ? (
                <>
                  <p className="step-line" aria-live="polite">
                    <span className="step-line__kicker">
                      Step {current + 1} of 4{step.docs.length > 1 ? ` · ${opened} of ${step.docs.length} opened` : ''}
                    </span>
                    {UI.evidenceSteps[current]}
                  </p>
                  {blocked && (
                    <p className="stage-note stage-note--warn" role="alert">
                      {EVIDENCE_COPY.blocked}
                    </p>
                  )}
                </>
              ) : null}
            </div>
          )}
        </StageCopy>

        {intro.ready && (
        <div
          className={`page03__desk ${entered ? 'is-open' : 'is-closed'}${intro.animate ? ' stagger' : ''}`}
          style={{ '--stagger-base': `${timing.controlsAt + 250}ms` } as CSSProperties}
          role="group"
          aria-label="Evidence on the table"
        >
          {ORDER.map((id, i) => {
            const state = stateOf(id);
            const status = state === 'reviewed' ? ', reviewed' : state === 'locked' ? ', not yet available' : '';
            return (
              <button
                key={id}
                type="button"
                className={`desk-folder desk-folder--${id} is-${state}`}
                style={{ '--i': i } as CSSProperties}
                tabIndex={entered ? 0 : -1}
                aria-hidden={entered ? undefined : true}
                aria-disabled={state === 'locked' || undefined}
                aria-label={`Step ${stepIndex(id) + 1}: open ${EVIDENCE_LABEL[id]}${status}. ${EVIDENCE_HINT[id]}`}
                onClick={() => onFolder(id)}
              >
                <img className="desk-folder__art" src={FOLDER_ART[id]} alt="" draggable={false} />
                <span aria-hidden="true">
                  <span className="desk-folder__step">{stepIndex(id) + 1}</span>
                  <span className="desk-folder__label">
                    <span className="desk-folder__label-full">{EVIDENCE_LABEL[id]}</span>
                    <span className="desk-folder__label-short">{SHORT_LABEL[id]}</span>
                  </span>
                  {state === 'locked' && (
                    <span className="desk-folder__lock">
                      <LockIcon size={16} />
                    </span>
                  )}
                  {state === 'reviewed' && <span className="interactive-artifact__reviewed">Reviewed ✓</span>}
                  {entered && <span className="desk-folder__hint">{EVIDENCE_HINT[id]}</span>}
                </span>
              </button>
            );
          })}
        </div>
        )}
      </SimulationStage>
      <DocumentDialog doc={open ? DOCUMENTS[open] : null} onClose={onClose} closeLabel="Close and mark reviewed" />
    </>
  );
}
