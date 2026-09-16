import { useState } from 'react';
import { Check } from '@phosphor-icons/react';
import { SCENES, TABLE_SHEETS } from '../assets';
import { DocumentDialog, TableArtifact } from '../components/Documents';
import { usePageIntro } from '../components/Experience';
import { Reveal, revealTiming } from '../components/Reveal';
import { OBJECTIVES } from '../sim/experience';
import { RadioPanel } from '../components/RadioPanel';
import { SimulationStage } from '../components/SimulationStage';
import { PillButton, StageCopy, TextLink } from '../components/ui';
import { FRAMING, NARRATION, PAGE_META, SELF_REPORT, UI } from '../sim/content';
import { DOCUMENTS } from '../sim/documents';
import { useSim } from '../sim/store';

// Page 04 — Crisis Decision (spec §15). Each decision is revealed by inspecting a document:
// talking points → Board Position → briefing note → Disclosure Approach → Continue.

type DocKey = 'talkingPoints' | 'briefing';
const SUBTITLE = 'Set the tone before the emergency meeting.';

function DecisionSummary({ title, chosen, consequence, feedback, expanded }: { title: string; chosen: string; consequence: string; feedback: string; expanded: boolean }) {
  const [why, setWhy] = useState(false);
  return (
    <div className="page04__panel glass-panel--dark">
      <div className="page04__chosen">
        <h2 className="panel-title">{title}</h2>
        <p className="outcome__chosen">
          <Check size={15} />
          {chosen}
        </p>
      </div>
      {expanded && (
        <>
          <div aria-live="polite">{why ? <p className="page04__why">{feedback}</p> : <p className="page04__consequence">{consequence}</p>}</div>
          <div className="panel-actions">
            <TextLink aria-pressed={why} onClick={() => setWhy((w) => !w)}>
              {why ? 'Back to the outcome' : 'Why it matters'}
            </TextLink>
          </div>
        </>
      )}
    </div>
  );
}

function StepLine({ kicker, children }: { kicker: string; children: string }) {
  return (
    <p className="step-line" aria-live="polite">
      <span className="step-line__kicker">{kicker}</span>
      {children}
    </p>
  );
}

export function Page04Crisis() {
  const { sim, dispatch } = useSim();
  const framing = sim.boardFraming;
  const selfReport = sim.selfReportDecision;
  const [open, setOpen] = useState<DocKey | null>(null);
  const [talkingPointsRead, setTalkingPointsRead] = useState(framing !== null);
  const [briefingRead, setBriefingRead] = useState(selfReport !== null);
  const [hint, setHint] = useState(false);
  const intro = usePageIntro('crisis', NARRATION.crisisLoad, !framing);
  const timing = revealTiming(PAGE_META[4].title, SUBTITLE, OBJECTIVES[4]);

  const openDoc = (key: DocKey) => {
    if (key === 'briefing' && !framing) {
      setHint(true);
      return;
    }
    setHint(false);
    setOpen(key);
  };

  const close = () => {
    if (open === 'talkingPoints') setTalkingPointsRead(true);
    if (open === 'briefing') setBriefingRead(true);
    setOpen(null);
    window.setTimeout(() => document.querySelector<HTMLElement>('.page04__question-stack button, .page04__question-stack .primary-pill')?.focus(), 80);
  };

  return (
    <>
      <SimulationStage page={4} image={SCENES.crisis} label="Crisis Decision" wash="strong" intro={intro}>
        <StageCopy className="page04__copy" title={PAGE_META[4].title} subtitle={SUBTITLE} objective={OBJECTIVES[4]} intro={intro}>
          <div className="page04__question-stack" id="controls">
            {!talkingPointsRead ? (
              <StepLine kicker="Decision 1 of 2 · Board Position">{UI.framingOpen}</StepLine>
            ) : !framing ? (
              <RadioPanel
                title="Board Position"
                titles={FRAMING.short}
                texts={FRAMING.options}
                seed={sim.seed}
                shuffleKey="framing"
                confirmLabel="Confirm position"
                onConfirm={(opt) => dispatch({ type: 'CHOOSE_FRAMING', opt })}
              />
            ) : (
              <DecisionSummary
                title="Board Position"
                chosen={FRAMING.short[framing]}
                consequence={FRAMING.consequence[framing]}
                feedback={FRAMING.feedback[framing]}
                expanded={!briefingRead}
              />
            )}

            {framing &&
              (!briefingRead ? (
                <StepLine kicker="Decision 2 of 2 · Disclosure Approach">{UI.selfReportOpen}</StepLine>
              ) : !selfReport ? (
                <RadioPanel
                  title="Disclosure Approach"
                  texts={SELF_REPORT.options}
                  seed={sim.seed}
                  shuffleKey="selfReport"
                  confirmLabel="Confirm approach"
                  onConfirm={(opt) => dispatch({ type: 'CHOOSE_SELF_REPORT', opt })}
                />
              ) : (
                <DecisionSummary
                  title="Disclosure Approach"
                  chosen={SELF_REPORT.short[selfReport]}
                  consequence={SELF_REPORT.consequence[selfReport]}
                  feedback={SELF_REPORT.feedback[selfReport]}
                  expanded
                />
              ))}

            {hint && (
              <p className="stage-note stage-note--warn" role="alert">
                {UI.framingFirst}
              </p>
            )}

            {selfReport && (
              <div>
                <PillButton onClick={() => dispatch({ type: 'GO', page: 5 })}>Continue</PillButton>
              </div>
            )}
          </div>
        </StageCopy>

        <Reveal show={intro.ready} animate={intro.animate} delay={timing.controlsAt + 200} className="page04__docs">
          <TableArtifact
            className="page04__doc--statement"
            photo={TABLE_SHEETS.talkingPoints}
            title={DOCUMENTS.talkingPoints.title}
            label={`Open ${DOCUMENTS.talkingPoints.title}`}
            stamp="DRAFT"
            folio
            rotate={-2}
            reviewed={talkingPointsRead}
            glow={!talkingPointsRead}
            onOpen={() => openDoc('talkingPoints')}
          />
          <TableArtifact
            className="page04__doc--briefing"
            photo={TABLE_SHEETS.briefing}
            folio
            title={DOCUMENTS.briefing.title}
            label={`Open ${DOCUMENTS.briefing.title}`}
            stamp="CONFIDENTIAL"
            rotate={4}
            disabled={!framing}
            reviewed={briefingRead}
            glow={!!framing && !briefingRead}
            onOpen={() => openDoc('briefing')}
          />
        </Reveal>
      </SimulationStage>
      <DocumentDialog doc={open ? DOCUMENTS[open] : null} onClose={close} />
    </>
  );
}
