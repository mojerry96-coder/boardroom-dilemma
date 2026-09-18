import { useState } from 'react';
import { FileText } from '@phosphor-icons/react';
import { SCENES, TABLE_SHEETS } from '../assets';
import { AllocationSliders, Readouts } from '../components/Allocation';
import { DocumentDialog, TableArtifact } from '../components/Documents';
import { usePageIntro } from '../components/Experience';
import { useNarration } from '../components/Narration';
import { GUIDE, OBJECTIVES } from '../sim/experience';
import { SimulationStage } from '../components/SimulationStage';
import { OutcomePanel, PillButton, StageCopy } from '../components/ui';
import { START_ALLOCATION, governanceRiskIndex, isSingleCause, redistribute, reformCredibilityScore } from '../sim/accountability';
import { ACCOUNTABILITY_COPY, BRAND, NARRATION, PAGE_META } from '../sim/content';
import { round2Message } from '../sim/derive';
import { DOCUMENTS } from '../sim/documents';
import { useSim } from '../sim/store';
import type { Allocation } from '../sim/types';

// Page 05 — Accountability Diagnosis (spec §16): Round 1 → new evidence on the table → Round 2.

export function Page05Accountability() {
  const { sim, dispatch } = useSim();
  const { say } = useNarration();
  const acc = sim.accountability;
  const [alloc1, setAlloc1] = useState<Allocation>(acc.round1 ?? START_ALLOCATION);
  const [alloc2, setAlloc2] = useState<Allocation>(acc.round2 ?? acc.round1 ?? START_ALLOCATION);
  const [open, setOpen] = useState(false);

  const phase = !acc.round1 ? 'r1' : !acc.statementRead ? 'evidence' : !acc.round2 ? 'r2' : 'done';
  const intro = usePageIntro('accountability', NARRATION.accountabilityLoad, phase === 'r1');

  const round: 1 | 2 = phase === 'r1' || phase === 'evidence' ? 1 : 2;
  const shown: Allocation = phase === 'r1' ? alloc1 : alloc2;
  const gri = governanceRiskIndex(shown, round);
  const rcs = reformCredibilityScore(shown, round, round === 2 ? acc.round1 : null);
  const allocating = phase === 'r1' || phase === 'r2';
  const single = allocating && isSingleCause(shown);

  const lockRound1 = () => {
    dispatch({ type: 'LOCK_ROUND1', allocation: alloc1 });
    setAlloc2(alloc1);
    say(GUIDE.newEvidence);
  };

  const closeStatement = () => {
    setOpen(false);
    if (!acc.statementRead) {
      dispatch({ type: 'STATEMENT_READ' });
      say(GUIDE.reassess);
    }
    window.setTimeout(() => document.querySelector<HTMLElement>('#lever-agency')?.focus(), 80);
  };

  return (
    <>
      <SimulationStage page={5} image={SCENES.accountability} label="Accountability Diagnosis" wash="strong" intro={intro}>
        <StageCopy
          className="page05__copy"
          eyebrow={BRAND.eyebrow}
          title={PAGE_META[5].title}
          subtitle={PAGE_META[5].subtitle}
          objective={OBJECTIVES[5]}
          intro={intro}
        >
          <div className="page05__controls" id="controls">
            {phase === 'done' && acc.round1 && acc.round2 ? (
              <OutcomePanel
                className="page05__outcome"
                text={round2Message(acc.round1, acc.round2)}
                feedback={ACCOUNTABILITY_COPY.feedback}
                onContinue={() => dispatch({ type: 'GO', page: 6 })}
              />
            ) : (
              <>
                <div className={`page05__sliders${phase === 'evidence' ? ' is-muted' : ''}`}>
                  <p className="page05__round">{round === 1 ? 'Round 1 · Weigh where responsibility lies' : 'Round 2 · Does the new evidence change your weighting?'}</p>
                  <AllocationSliders
                    value={shown}
                    disabled={!allocating}
                    compareTo={round === 2 ? acc.round1 : null}
                    onChange={(lever, v) => (phase === 'r1' ? setAlloc1((a) => redistribute(a, lever, v)) : setAlloc2((a) => redistribute(a, lever, v)))}
                  />
                  <Readouts gri={gri} rcs={rcs} />
                  {single && (
                    <p className="page05__single" role="status">
                      {ACCOUNTABILITY_COPY.singleCause}
                    </p>
                  )}
                </div>

                {phase !== 'r1' && (
                  <button type="button" className={`page05__evidence-alert${acc.statementRead ? ' is-read' : ''}`} onClick={() => setOpen(true)}>
                    <span className="page05__alert-icon" aria-hidden="true">
                      <FileText size={22} />
                    </span>
                    <span className="page05__alert-text">
                      {ACCOUNTABILITY_COPY.newEvidenceTitle}:<br />
                      <b>Supervisor statement</b>
                    </span>
                    {!acc.statementRead && <span className="page05__alert-dot" aria-label="Unread" />}
                  </button>
                )}

                <div>
                  {phase === 'r1' && <PillButton onClick={lockRound1}>{ACCOUNTABILITY_COPY.lockRound1}</PillButton>}
                  {phase === 'evidence' && <PillButton onClick={() => setOpen(true)}>{ACCOUNTABILITY_COPY.openStatement}</PillButton>}
                  {phase === 'r2' && <PillButton onClick={() => dispatch({ type: 'SUBMIT_ROUND2', allocation: alloc2 })}>Reassess Diagnosis</PillButton>}
                </div>
              </>
            )}
          </div>
        </StageCopy>

        {phase !== 'r1' && intro.ready && (
          <div className="page05__docs">
            <TableArtifact
              className="page05__doc"
              photo={TABLE_SHEETS.talkingPoints}
              title={DOCUMENTS.supervisor.title}
              label={`Open ${DOCUMENTS.supervisor.title}`}
              folio
              reviewed={acc.statementRead}
              glow={!acc.statementRead}
              onOpen={() => setOpen(true)}
            />
          </div>
        )}
      </SimulationStage>
      <DocumentDialog doc={open ? DOCUMENTS.supervisor : null} onClose={closeStatement} />
    </>
  );
}
