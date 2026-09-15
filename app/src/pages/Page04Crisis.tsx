import { useState, type CSSProperties, type ReactNode } from 'react';
import { SCENES } from '../assets';
import { ChoicePicker, OutcomeCard } from '../components/Choices';
import { ContextView, DockHeader, Prompt } from '../components/Dock';
import { DocumentDialog, TableDocument } from '../components/Documents';
import { DocIcon } from '../components/Icons';
import { useNarrateOnce } from '../components/Narration';
import { Stage } from '../components/Stage';
import { FRAMING, NARRATION, PAGE_META, SELF_REPORT, UI } from '../sim/content';
import { DOCUMENTS } from '../sim/documents';
import { useSim } from '../sim/store';

// Screens 2 and 3 — each decision emerges from a document on the table.

type DocKey = 'talkingPoints' | 'briefing';

export function Page04Crisis() {
  const { sim, dispatch } = useSim();
  const [open, setOpen] = useState<DocKey | null>(null);
  const [talkingPointsRead, setTalkingPointsRead] = useState(sim.boardFraming !== null);
  const [briefingRead, setBriefingRead] = useState(sim.selfReportDecision !== null);
  const [step, setStep] = useState<1 | 2>(sim.selfReportDecision !== null ? 2 : 1);
  const [hint, setHint] = useState<string | null>(null);
  const [ctx, setCtx] = useState(false);
  useNarrateOnce('crisis-load', NARRATION.crisisLoad);

  const openDoc = (key: DocKey) => {
    setCtx(false);
    if (key === 'briefing' && step === 1) {
      setHint(UI.framingFirst);
      return;
    }
    setHint(null);
    setOpen(key);
  };

  const close = () => {
    if (open === 'talkingPoints') setTalkingPointsRead(true);
    if (open === 'briefing') setBriefingRead(true);
    setOpen(null);
  };

  const framing = sim.boardFraming;
  const selfReport = sim.selfReportDecision;
  const done = step === 1 ? 0 : selfReport ? 2 : 1;

  let body: ReactNode;
  if (ctx) {
    body = (
      <ContextView onBack={() => setCtx(false)}>
        <p>{step === 1 ? UI.framingSituation : UI.selfReportSituation}</p>
      </ContextView>
    );
  } else if (step === 1) {
    if (!talkingPointsRead) {
      body = (
        <>
          <Prompt step="Decision 1 of 2 · Board framing">{UI.framingOpen}</Prompt>
          <div className="row">
            <button type="button" className="btn btn--quiet btn--small" onClick={() => openDoc('talkingPoints')}>
              <DocIcon width={16} height={16} />
              Open talking points
            </button>
          </div>
        </>
      );
    } else if (!framing) {
      body = (
        <ChoicePicker
          prompt={UI.framingPrompt}
          labels={FRAMING.short}
          options={FRAMING.options}
          seed={sim.seed}
          shuffleKey="framing"
          confirmLabel="Confirm framing"
          onConfirm={(opt) => dispatch({ type: 'CHOOSE_FRAMING', opt })}
        />
      );
    } else {
      body = (
        <OutcomeCard
          chosen={FRAMING.short[framing]}
          text={FRAMING.consequence[framing]}
          feedback={FRAMING.feedback[framing]}
          continueLabel="Next decision"
          onContinue={() => {
            setStep(2);
            setHint(null);
          }}
        />
      );
    }
  } else if (!briefingRead) {
    body = (
      <>
        <Prompt step="Decision 2 of 2 · Self-report">{UI.selfReportOpen}</Prompt>
        <div className="row">
          <button type="button" className="btn btn--quiet btn--small" onClick={() => openDoc('briefing')}>
            <DocIcon width={16} height={16} />
            Open briefing note
          </button>
        </div>
      </>
    );
  } else if (!selfReport) {
    body = (
      <ChoicePicker
        prompt={UI.selfReportPrompt}
        labels={SELF_REPORT.short}
        options={SELF_REPORT.options}
        seed={sim.seed}
        shuffleKey="selfReport"
        confirmLabel="Confirm decision"
        onConfirm={(opt) => dispatch({ type: 'CHOOSE_SELF_REPORT', opt })}
      />
    );
  } else {
    body = (
      <OutcomeCard
        chosen={SELF_REPORT.short[selfReport]}
        text={SELF_REPORT.consequence[selfReport]}
        feedback={SELF_REPORT.feedback[selfReport]}
        onContinue={() => dispatch({ type: 'GO', page: 5 })}
      />
    );
  }

  const overlay = (
    <div className="docs-on-table">
      <TableDocument
        title="MD's Draft Talking Points"
        kicker="Open"
        state={talkingPointsRead ? 'reviewed' : 'active'}
        onOpen={() => openDoc('talkingPoints')}
      />
      <span style={{ '--rot': '4deg' } as CSSProperties}>
        <TableDocument
          title="Crisis Briefing Note"
          kicker={step === 1 ? 'After framing' : 'Open'}
          state={step === 1 ? 'locked' : briefingRead ? 'reviewed' : 'active'}
          onOpen={() => openDoc('briefing')}
        />
      </span>
    </div>
  );

  return (
    <>
      <Stage
        image={SCENES.crisis}
        label="Crisis decision"
        overlay={overlay}
        chapter={{ title: PAGE_META[4].title, subtitle: PAGE_META[4].subtitle }}
      >
        <DockHeader page={4} title={PAGE_META[4].title} steps={2} current={done} onContext={() => setCtx((c) => !c)} contextOpen={ctx} />
        {hint && !ctx && <Prompt tone="warn">{hint}</Prompt>}
        {body}
      </Stage>
      <DocumentDialog doc={open ? DOCUMENTS[open] : null} onClose={close} />
    </>
  );
}
