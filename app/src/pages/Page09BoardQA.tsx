import { useState, type ReactNode } from 'react';
import { ChatCircle, FileText, Newspaper, Pulse, Scales, Warning } from '@phosphor-icons/react';
import { SCENES } from '../assets';
import { usePageIntro } from '../components/Experience';
import { useNarration, useSpeakOnce } from '../components/Narration';
import { RadioPanel } from '../components/RadioPanel';
import { Reveal, revealTiming, TYPE_SPEED, TypeText, useDelayed } from '../components/Reveal';
import { SimulationStage } from '../components/SimulationStage';
import { OutcomePanel, PillButton, StageCopy, TextLink } from '../components/ui';
import { VoiceField } from '../components/VoiceField';
import { isSingleCause } from '../sim/accountability';
import {
  EXECUTIVE,
  FRAMING,
  LEVER_COPY,
  PAGE_META,
  Q1_COMPLIANCE,
  Q1_RELATIONSHIP,
  Q2,
  QA_FOLLOW_UPS,
  SELF_REPORT,
  STAKEHOLDERS,
  UI,
} from '../sim/content';
import { fill, mapOptions, primaryFailureText, reformTitleText, singleCauseLine } from '../sim/derive';
import { GUIDE, OBJECTIVES } from '../sim/experience';
import { useSim } from '../sim/store';

// Page 09 — Board Q&A (spec §20). The Board asks; relevant memory chips appear; the learner may
// type or speak an answer first, then confirms the authored reasoning closest to it (scored).

type QStage = 'q1' | 'q1-choose' | 'q1-feedback' | 'followups' | 'q2' | 'q2-choose' | 'q2-feedback';
/** A spoken question starts this long after it is shown (see useSpeakOnce). */
const VOICE_LEAD_MS = 400;

interface MemoryChip {
  label: string;
  detail: string;
  icon: ReactNode;
  warn?: boolean;
}

export function Page09BoardQA() {
  const { sim, dispatch } = useSim();
  const rc = sim.relationshipCost;
  const Q1 = rc ? Q1_RELATIONSHIP : Q1_COMPLIANCE;
  const r2 = sim.accountability.round2;
  const bc = sim.boardCase;
  const tokens = {
    primaryFailure: primaryFailureText(r2),
    reformTitle: reformTitleText(bc),
    reformTarget: bc.reformTarget ? LEVER_COPY[bc.reformTarget].label : 'a different failure type',
  };

  const followUps = [
    ...(bc.reformMismatch ? [{ text: fill(QA_FOLLOW_UPS.mismatch, tokens), chip: QA_FOLLOW_UPS.mismatchChip }] : []),
    ...(r2 && isSingleCause(r2) ? [{ text: singleCauseLine(r2), chip: QA_FOLLOW_UPS.singleCauseChip }] : []),
  ];

  const [stage, setStage] = useState<QStage>(() => (sim.boardQA.q2 ? 'q2-feedback' : sim.boardQA.q1 ? (followUps.length ? 'followups' : 'q2') : 'q1'));
  const [followIndex, setFollowIndex] = useState(0);
  const [firstQuestionKey] = useState(() => (stage === 'followups' ? 'follow-0' : stage.startsWith('q2') ? 'q2' : 'q1'));
  const [openChip, setOpenChip] = useState<string | null>(null);

  const onQ2 = stage.startsWith('q2');
  const question = onQ2 ? Q2 : Q1;
  const ownKey = onQ2 ? 'q2' : 'q1';

  const { say } = useNarration();
  const intro = usePageIntro('qa', GUIDE.qaLoad, stage === 'q1' && !sim.boardQA.q1);
  const timing = revealTiming(PAGE_META[9].title, PAGE_META[9].subtitle, OBJECTIVES[9]);
  const openingDelay = intro.animate ? timing.controlsAt : 0;
  const onStage = useDelayed(intro.ready, openingDelay);

  // Each question is spoken as it types in; the response zone appears once it has been asked.
  const q1Heard = useSpeakOnce('qa-q1', Q1.question, stage === 'q1' && onStage);
  const followHeard = useSpeakOnce(`qa-follow-${followIndex}`, followUps[followIndex]?.text ?? null, stage === 'followups' && onStage);
  const q2Heard = useSpeakOnce('qa-q2', Q2.question, stage === 'q2' && onStage);
  const heard = stage === 'q1' ? q1Heard : stage === 'q2' ? q2Heard : stage === 'followups' ? followHeard : true;

  const journalist = sim.stakeholderResponses.journalist;
  const exec = sim.executiveResponse;
  const sr = sim.selfReportDecision;
  const fr = sim.boardFraming;
  const diagnosisChip: MemoryChip = { label: 'Diagnosis', detail: `Primary failure: ${tokens.primaryFailure}`, icon: <Pulse size={22} /> };
  const disclosureChip: MemoryChip | null = sr ? { label: 'Disclosure choice', detail: SELF_REPORT.short[sr], icon: <Scales size={22} /> } : null;
  const chips: MemoryChip[] = (
    onQ2
      ? [
          disclosureChip,
          fr ? { label: 'Board framing', detail: FRAMING.short[fr], icon: <FileText size={22} /> } : null,
          journalist ? { label: 'Media response', detail: STAKEHOLDERS[2].short[journalist], icon: <Newspaper size={22} /> } : null,
          ...followUps.map((f) => ({ label: f.chip, detail: UI.followUpNote, icon: <Warning size={22} />, warn: true })),
        ]
      : [rc && exec ? { label: `Reply to ${EXECUTIVE.name}`, detail: EXECUTIVE.short[exec], icon: <ChatCircle size={22} /> } : null, diagnosisChip, disclosureChip]
  ).filter((c): c is MemoryChip => c !== null);

  const finish = () => {
    dispatch({ type: 'RESOLVE_ENDING' });
    dispatch({ type: 'GO', page: 10 });
  };

  const speaker = stage === 'followups' ? Q2.speaker : question.speaker;
  const questionText = stage === 'followups' ? followUps[followIndex]?.text ?? '' : question.question;
  // One key per question, so moving from answering to choosing does not retype it.
  const questionKey = stage === 'followups' ? `follow-${followIndex}` : ownKey;
  const questionDelay = (questionKey === firstQuestionKey ? openingDelay : 0) + VOICE_LEAD_MS;

  let zone: ReactNode;
  if (stage === 'q1' || stage === 'q2') {
    zone = (
      <>
        <VoiceField
          label={`Your answer to the ${question.speaker}`}
          showLabel={false}
          value={sim.boardQA.ownWords[ownKey] ?? ''}
          onChange={(text) => dispatch({ type: 'SET_OWN_WORDS', question: ownKey, text })}
          placeholder="Type your response or speak…"
          hint="You can type or use your microphone to answer."
          rows={1}
        />
        {chips.length > 0 && (
          <div className="page09__chips" role="group" aria-label="What the Board remembers">
            {chips.map((c) => (
              <button
                key={c.label}
                type="button"
                className={`memory-chip${c.warn ? ' memory-chip--warn' : ''}`}
                aria-expanded={openChip === c.label}
                onClick={() => setOpenChip(openChip === c.label ? null : c.label)}
              >
                {c.icon}
                {c.label}
              </button>
            ))}
          </div>
        )}
        {openChip && (
          <p className="page09__chip-detail" aria-live="polite">
            {chips.find((c) => c.label === openChip)?.detail}
          </p>
        )}
        <div className="page09__next">
          <PillButton size="small" onClick={() => setStage(onQ2 ? 'q2-choose' : 'q1-choose')}>
            Submit answer
          </PillButton>
        </div>
      </>
    );
  } else if (stage === 'q1-choose' || stage === 'q2-choose') {
    const Q = onQ2 ? Q2 : Q1;
    zone = (
      <RadioPanel
        className="page09__sheet"
        title="Which reasoning is closest to your answer?"
        titles={Q.short}
        texts={onQ2 ? Q2.options : mapOptions(Q1.options, (t) => fill(t, tokens))}
        seed={sim.seed}
        shuffleKey={onQ2 ? 'q2' : rc ? 'q1-relationship' : 'q1-compliance'}
        confirmLabel="Answer the Board"
        onConfirm={(opt) => {
          dispatch({ type: onQ2 ? 'CHOOSE_Q2' : 'CHOOSE_Q1', opt });
          say(GUIDE.qaAnswered[onQ2 ? 1 : 0]);
          setStage(onQ2 ? 'q2-feedback' : 'q1-feedback');
        }}
        footer={<TextLink onClick={() => setStage(onQ2 ? 'q2' : 'q1')}>Back to my answer</TextLink>}
      />
    );
  } else if (stage === 'q1-feedback' && sim.boardQA.q1) {
    zone = (
      <OutcomePanel
        chosen={Q1.short[sim.boardQA.q1]}
        text={Q1.feedback[sim.boardQA.q1]}
        continueLabel={followUps.length ? 'Continue' : 'Next question'}
        onContinue={() => setStage(followUps.length ? 'followups' : 'q2')}
      />
    );
  } else if (stage === 'followups') {
    const last = followIndex + 1 >= followUps.length;
    zone = (
      <div className="page09__follow glass-panel--dark">
        <p className="panel-note">{UI.followUpNote}</p>
        <div className="panel-actions">
          <PillButton size="small" onClick={() => (last ? setStage('q2') : setFollowIndex(followIndex + 1))} autoFocus>
            {last ? 'Next question' : 'Next'}
          </PillButton>
        </div>
      </div>
    );
  } else if (sim.boardQA.q2) {
    zone = (
      <OutcomePanel chosen={Q2.short[sim.boardQA.q2]} text={Q2.feedback[sim.boardQA.q2]} continueLabel="Hear the Board's decision" onContinue={finish} />
    );
  }

  return (
    <SimulationStage page={9} image={SCENES.boardQA} label="Board Q&A" wash="strong" intro={intro}>
      <StageCopy className="page09__copy" title={PAGE_META[9].title} subtitle={PAGE_META[9].subtitle} objective={OBJECTIVES[9]} intro={intro}>
        <figure className={`page09__question${stage === 'followups' ? ' is-follow' : ''}`} key={questionKey}>
          <figcaption className="page09__speaker">{stage === 'followups' ? `${speaker} · Follow-up` : speaker}</figcaption>
          <TypeText as="blockquote" text={`“${questionText}”`} perChar={TYPE_SPEED.quote} delay={questionDelay} animate={!heard} />
        </figure>
      </StageCopy>
      <Reveal show={intro.ready && heard} className="page09__response-zone" id="controls" as="section" aria-label="Your response">
        {zone}
      </Reveal>
    </SimulationStage>
  );
}
