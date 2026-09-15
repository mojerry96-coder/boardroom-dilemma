import { useState, type ReactNode } from 'react';
import { SCENES } from '../assets';
import { ChoicePicker, OutcomeCard } from '../components/Choices';
import { ContextView, DockHeader, MediaQuote, Prompt } from '../components/Dock';
import { ArrowIcon } from '../components/Icons';
import { useNarrateOnce, useSpeakOnce } from '../components/Narration';
import { Stage } from '../components/Stage';
import { VoiceField } from '../components/VoiceField';
import { isSingleCause } from '../sim/accountability';
import {
  EXECUTIVE,
  FRAMING,
  LEVER_COPY,
  NARRATION,
  PAGE_META,
  Q1_COMPLIANCE,
  Q1_RELATIONSHIP,
  Q2,
  QA_FOLLOW_UPS,
  QA_SITUATION,
  SELF_REPORT,
  UI,
} from '../sim/content';
import { fill, mapOptions, primaryFailureText, reformTitleText, singleCauseLine } from '../sim/derive';
import { useSim } from '../sim/store';

// Screen 8 — the Board's question lives on the media; the dock holds the answer.

type QStage = 'q1' | 'q1-feedback' | 'followups' | 'q2' | 'q2-feedback';

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

  const [stage, setStage] = useState<QStage>(() =>
    sim.boardQA.q2 ? 'q2-feedback' : sim.boardQA.q1 ? (followUps.length ? 'followups' : 'q2') : 'q1',
  );
  const [followIndex, setFollowIndex] = useState(0);
  const [ownOpen, setOwnOpen] = useState(false);
  const [ctx, setCtx] = useState(false);

  const loadDone = useNarrateOnce('qa-load', NARRATION.boardQALoad, stage === 'q1');
  useSpeakOnce('qa-q1', Q1.question, stage === 'q1' && loadDone);
  useSpeakOnce(`qa-follow-${followIndex}`, followUps[followIndex]?.text ?? null, stage === 'followups');
  useSpeakOnce('qa-q2', Q2.question, stage === 'q2');

  const exec = sim.executiveResponse;
  const sr = sim.selfReportDecision;
  const fr = sim.boardFraming;
  const q1Chips = [
    rc && exec ? `Your reply to ${EXECUTIVE.name}: ${EXECUTIVE.short[exec]}` : sr ? `Self-report: ${SELF_REPORT.short[sr]}` : '',
    `Primary failure: ${tokens.primaryFailure}`,
  ].filter(Boolean);
  const q2Chips = [sr ? `Self-report: ${SELF_REPORT.short[sr]}` : '', fr ? `Framing: ${FRAMING.short[fr]}` : ''].filter(Boolean);

  const onQ2 = stage === 'q2' || stage === 'q2-feedback';
  const question = onQ2 ? Q2 : Q1;
  const ownKey = onQ2 ? 'q2' : 'q1';

  const finish = () => {
    dispatch({ type: 'RESOLVE_ENDING' });
    dispatch({ type: 'GO', page: 10 });
  };

  let body: ReactNode;
  if (ctx) {
    body = (
      <ContextView onBack={() => setCtx(false)}>
        <p>{QA_SITUATION}</p>
        <p>{QA_FOLLOW_UPS.closing}</p>
      </ContextView>
    );
  } else if (ownOpen) {
    body = (
      <>
        <Prompt step="Optional · not scored">{UI.ownWords}</Prompt>
        <VoiceField
          label={QA_FOLLOW_UPS.ownWordsLabel}
          showLabel={false}
          value={sim.boardQA.ownWords[ownKey] ?? ''}
          onChange={(text) => dispatch({ type: 'SET_OWN_WORDS', question: ownKey, text })}
          rows={3}
        />
        <div className="row">
          <button type="button" className="btn btn--quiet" onClick={() => setOwnOpen(false)}>
            Done
          </button>
        </div>
      </>
    );
  } else if (stage === 'q1') {
    body = (
      <ChoicePicker
        prompt={UI.answer}
        labels={Q1.short}
        options={mapOptions(Q1.options, (t) => fill(t, tokens))}
        seed={sim.seed}
        shuffleKey={rc ? 'q1-relationship' : 'q1-compliance'}
        confirmLabel="Answer the Board"
        onConfirm={(opt) => {
          dispatch({ type: 'CHOOSE_Q1', opt });
          setStage('q1-feedback');
        }}
      />
    );
  } else if (stage === 'q1-feedback' && sim.boardQA.q1) {
    body = (
      <OutcomeCard
        chosen={Q1.short[sim.boardQA.q1]}
        text={Q1.feedback[sim.boardQA.q1]}
        continueLabel={followUps.length ? 'Continue' : 'Next question'}
        onContinue={() => setStage(followUps.length ? 'followups' : 'q2')}
        actions={
          <button type="button" className="btn btn--link btn--small" onClick={() => setOwnOpen(true)}>
            {UI.ownWords}
          </button>
        }
      />
    );
  } else if (stage === 'followups') {
    const last = followIndex + 1 >= followUps.length;
    body = (
      <>
        <Prompt tone="accent">{UI.followUpNote}</Prompt>
        <button
          type="button"
          className="btn btn--primary"
          autoFocus
          onClick={() => (last ? setStage('q2') : setFollowIndex(followIndex + 1))}
        >
          {last ? 'Next question' : 'Next'}
          <ArrowIcon />
        </button>
      </>
    );
  } else if (stage === 'q2') {
    body = (
      <ChoicePicker
        prompt={UI.answer}
        labels={Q2.short}
        options={Q2.options}
        seed={sim.seed}
        shuffleKey="q2"
        confirmLabel="Answer the Board"
        onConfirm={(opt) => {
          dispatch({ type: 'CHOOSE_Q2', opt });
          setStage('q2-feedback');
        }}
      />
    );
  } else if (sim.boardQA.q2) {
    body = (
      <OutcomeCard
        chosen={Q2.short[sim.boardQA.q2]}
        text={Q2.feedback[sim.boardQA.q2]}
        continueLabel="Hear the Board's decision"
        onContinue={finish}
        actions={
          <button type="button" className="btn btn--link btn--small" onClick={() => setOwnOpen(true)}>
            {UI.ownWords}
          </button>
        }
      />
    );
  }

  const quote =
    stage === 'followups' && followUps[followIndex] ? (
      <MediaQuote key={`follow-${followIndex}`} follow speaker={Q2.speaker} text={followUps[followIndex].text} />
    ) : (
      <MediaQuote
        key={onQ2 ? 'q2' : 'q1'}
        speaker={question.speaker}
        text={question.question}
        chips={onQ2 ? q2Chips : q1Chips}
        warnChips={onQ2 ? followUps.map((f) => f.chip) : []}
      />
    );

  return (
    <Stage
      image={SCENES.boardQA}
      label="Board Q&A"
      quote={ctx ? undefined : quote}
      chapter={stage === 'q1' ? { title: PAGE_META[9].title, subtitle: PAGE_META[9].subtitle } : undefined}
    >
      <DockHeader page={9} title={PAGE_META[9].title} steps={2} current={sim.boardQA.q2 ? 2 : sim.boardQA.q1 ? 1 : 0} onContext={() => setCtx((c) => !c)} contextOpen={ctx} />
      {body}
    </Stage>
  );
}
