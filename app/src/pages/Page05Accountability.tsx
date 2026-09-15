import { useState, type ReactNode } from 'react';
import { SCENES } from '../assets';
import { AllocationSliders, Readouts } from '../components/Allocation';
import { OutcomeCard } from '../components/Choices';
import { ContextView, DockHeader, MediaNotice, Prompt } from '../components/Dock';
import { DocumentDialog, TableDocument } from '../components/Documents';
import { ArrowIcon } from '../components/Icons';
import { useNarrateOnce, useNarration } from '../components/Narration';
import { Stage } from '../components/Stage';
import { START_ALLOCATION, governanceRiskIndex, isSingleCause, redistribute, reformCredibilityScore } from '../sim/accountability';
import { ACCOUNTABILITY_COPY, LEVER_COPY, NARRATION, PAGE_META, UI } from '../sim/content';
import { round2Message } from '../sim/derive';
import { DOCUMENTS } from '../sim/documents';
import { useSim } from '../sim/store';
import { LEVERS, type Allocation } from '../sim/types';

// Screen 4 — two-round systems model. Sliders and readouts only appear while allocating;
// the single-cause warning appears on the media only while it applies.

export function Page05Accountability() {
  const { sim, dispatch } = useSim();
  const { say } = useNarration();
  const acc = sim.accountability;
  const [alloc1, setAlloc1] = useState<Allocation>(acc.round1 ?? START_ALLOCATION);
  const [alloc2, setAlloc2] = useState<Allocation>(acc.round2 ?? acc.round1 ?? START_ALLOCATION);
  const [open, setOpen] = useState(false);
  const [ctx, setCtx] = useState(false);

  const phase = !acc.round1 ? 'r1' : !acc.statementRead ? 'evidence' : !acc.round2 ? 'r2' : 'done';
  useNarrateOnce('accountability-load', NARRATION.accountabilityLoad, phase === 'r1');

  const round: 1 | 2 = phase === 'r1' || phase === 'evidence' ? 1 : 2;
  const allocating = phase === 'r1' || phase === 'r2';
  const shown: Allocation = phase === 'r1' ? alloc1 : alloc2;
  const gri = governanceRiskIndex(shown, round);
  const rcs = reformCredibilityScore(shown, round, round === 2 ? acc.round1 : null);
  const single = allocating && isSingleCause(shown);

  const lockRound1 = () => {
    dispatch({ type: 'LOCK_ROUND1', allocation: alloc1 });
    setAlloc2(alloc1);
    say(NARRATION.accountabilityNewEvidence);
  };

  const closeStatement = () => {
    setOpen(false);
    if (!acc.statementRead) {
      dispatch({ type: 'STATEMENT_READ' });
      say(NARRATION.accountabilityReassess);
    }
  };

  let body: ReactNode;
  if (ctx) {
    body = (
      <ContextView
        onBack={() => setCtx(false)}
        pages={[
          <>
            <p>{round === 1 ? ACCOUNTABILITY_COPY.round1Situation : ACCOUNTABILITY_COPY.round2Situation}</p>
            {acc.statementRead && (
              <div className="row">
                <button
                  type="button"
                  className="btn btn--quiet btn--small"
                  onClick={() => {
                    setCtx(false);
                    setOpen(true);
                  }}
                >
                  Re-read the statement
                </button>
              </div>
            )}
          </>,
          <>
            <ul className="context-list">
              {LEVERS.map((l) => (
                <li key={l}>
                  <b>{LEVER_COPY[l].label}</b> — {LEVER_COPY[l].subtitle}
                </li>
              ))}
            </ul>
            <p>{UI.accScoresHelp}</p>
          </>,
        ]}
      />
    );
  } else if (phase === 'evidence') {
    body = (
      <>
        <Prompt tone="accent">{UI.accEvidence}</Prompt>
        <button type="button" className="btn btn--primary" onClick={() => setOpen(true)} autoFocus>
          {ACCOUNTABILITY_COPY.openStatement}
          <ArrowIcon />
        </button>
      </>
    );
  } else if (phase === 'done' && acc.round1 && acc.round2) {
    body = (
      <OutcomeCard
        text={round2Message(acc.round1, acc.round2)}
        feedback={ACCOUNTABILITY_COPY.feedback}
        onContinue={() => dispatch({ type: 'GO', page: 6 })}
      />
    );
  } else {
    body = (
      <>
        <Prompt>{round === 1 ? UI.accRound1 : UI.accRound2}</Prompt>
        <AllocationSliders
          value={shown}
          compareTo={round === 2 ? acc.round1 : null}
          onChange={(lever, v) => (phase === 'r1' ? setAlloc1((a) => redistribute(a, lever, v)) : setAlloc2((a) => redistribute(a, lever, v)))}
        />
        <Readouts gri={gri} rcs={rcs} />
        {phase === 'r1' ? (
          <button type="button" className="btn btn--primary" onClick={lockRound1}>
            {ACCOUNTABILITY_COPY.lockRound1}
          </button>
        ) : (
          <button type="button" className="btn btn--primary" onClick={() => dispatch({ type: 'SUBMIT_ROUND2', allocation: alloc2 })}>
            {ACCOUNTABILITY_COPY.submitRound2}
          </button>
        )}
      </>
    );
  }

  const overlay =
    phase !== 'r1' ? (
      <div className="docs-on-table">
        <TableDocument
          title="Supervisor Statement"
          kicker={acc.statementRead ? 'Re-read' : 'New evidence — open'}
          state={acc.statementRead ? 'reviewed' : 'active'}
          onOpen={() => setOpen(true)}
        />
      </div>
    ) : undefined;

  const stepsDone = phase === 'r1' ? 0 : phase === 'done' ? 2 : 1;

  return (
    <>
      <Stage
        image={SCENES.accountability}
        label="Accountability diagnosis"
        overlay={overlay}
        quote={single && !ctx ? <MediaNotice text={ACCOUNTABILITY_COPY.singleCause} /> : undefined}
        chapter={{ title: PAGE_META[5].title, subtitle: PAGE_META[5].subtitle }}
      >
        <DockHeader page={5} title="Accountability" steps={2} current={stepsDone} onContext={() => setCtx((c) => !c)} contextOpen={ctx} />
        {body}
      </Stage>
      <DocumentDialog doc={open ? DOCUMENTS.supervisor : null} onClose={closeStatement} />
    </>
  );
}
