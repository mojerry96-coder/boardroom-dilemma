import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { SCENES } from '../assets';
import { OutcomeCard } from '../components/Choices';
import { ContextView, DockHeader, MediaNotice, Prompt } from '../components/Dock';
import { ArrowIcon, CheckIcon, DeltaMark } from '../components/Icons';
import { useNarrateOnce } from '../components/Narration';
import { Stage } from '../components/Stage';
import { VoiceField } from '../components/VoiceField';
import { primaryLevers } from '../sim/accountability';
import {
  BOARD_CASE_COPY,
  BRAND,
  FRAMING,
  LENSES,
  LEVER_COPY,
  NARRATION,
  PAGE_META,
  RECOMMENDATION_BY_SELF_REPORT,
  REFORM_CARDS,
  SELF_REPORT,
  UI,
} from '../sim/content';
import { primaryFailureText } from '../sim/derive';
import { useSim } from '../sim/store';
import { LEVERS, type BoardCase, type LensId } from '../sim/types';

// Screen 7 — the script's four ordered sections, one small task at a time.
// The board pack on the media fills as sections complete.

const TAB_COLORS = ['#4f7cac', '#3f9e6e', '#c9a24a', '#8a63b5'];

export function Page08BoardCase() {
  const { sim, dispatch } = useSim();
  const bc = sim.boardCase;
  const { round1: r1, round2: r2 } = sim.accountability;
  const primary = r2 ? primaryLevers(r2) : [];
  const min = BOARD_CASE_COPY.minChars;
  const current = bc.locked ? 5 : Math.min(bc.stepsComplete + 1, 4);
  const [view, setView] = useState<number | null>(null);
  const shown = view ?? current;
  const [lensIndex, setLensIndex] = useState<number | null>(null);
  const [reformStage, setReformStage] = useState<'target' | 'text'>(bc.reformTarget ? 'text' : 'target');
  const [noteOpen, setNoteOpen] = useState(bc.diagnosisNotes.trim().length > 0);
  const [message, setMessage] = useState<string | null>(null);
  const [ctx, setCtx] = useState(false);

  useNarrateOnce('case-load', NARRATION.boardCaseLoad);
  useNarrateOnce('case-reform', NARRATION.boardCaseReform, shown === 4 && !bc.locked);

  useEffect(() => {
    if (bc.recommendation === null) {
      dispatch({ type: 'UPDATE_BOARD_CASE', patch: { recommendation: RECOMMENDATION_BY_SELF_REPORT[sim.selfReportDecision ?? 'B'] } });
    }
  }, [bc.recommendation, sim.selfReportDecision, dispatch]);

  const update = (patch: Partial<BoardCase>) => dispatch({ type: 'UPDATE_BOARD_CASE', patch });
  const lensTitle = (id: LensId) => LENSES.find((l) => l.id === id)?.title ?? id;
  const recommendationValid = (bc.recommendation ?? '').trim().length >= 20;
  const lensesValid = bc.lenses.length === 3 && bc.lenses.every((l) => (bc.justifications[l] ?? '').trim().length >= min);
  const reformValid = bc.reformTarget !== null && bc.reformText.trim().length >= min;
  const mismatch = bc.reformTarget !== null && r2 !== null && !primary.includes(bc.reformTarget);

  const finishSection = (n: number) => {
    setMessage(null);
    setCtx(false);
    if (view !== null) {
      setView(null);
      return;
    }
    dispatch({ type: 'COMPLETE_CASE_STEP', step: n });
  };

  const goSection = (n: number) => {
    setCtx(false);
    if (bc.locked) return;
    if (n === current) {
      setView(null);
      setMessage(null);
      return;
    }
    if (n < current) {
      setView(n);
      setMessage(null);
      if (n === 2) setLensIndex(null);
      return;
    }
    setMessage(n === 4 && bc.stepsComplete < 2 ? BOARD_CASE_COPY.skipStep2 : BOARD_CASE_COPY.earlyStep);
  };

  const toggleLens = (id: LensId) => {
    const on = bc.lenses.includes(id);
    if (!on && bc.lenses.length >= 3) return;
    update({ lenses: on ? bc.lenses.filter((l) => l !== id) : [...bc.lenses, id] });
  };

  const lock = () => {
    if (!recommendationValid || !lensesValid || !r2) {
      setMessage(UI.caseIncomplete);
      return;
    }
    dispatch({ type: 'LOCK_BOARD_CASE' });
  };

  const sectionIndex = Math.min(shown, 4) - 1;
  let body: ReactNode;

  if (ctx) {
    const intro = (
      <>
        <p className="context-title">{BOARD_CASE_COPY.steps[sectionIndex]}</p>
        <p>
          {shown === 3 && r1 ? `Round 1 allocation was ${r1.agency}% / ${r1.stewardship}% / ${r1.stakeholderRecognition}%. ` : ''}
          {BOARD_CASE_COPY.stepFeedback[sectionIndex]}
        </p>
      </>
    );
    const lensList = (
      <ul className="context-list">
        {LENSES.map((l) => (
          <li key={l.id}>
            <b>{l.title}</b> — {l.description}
          </li>
        ))}
      </ul>
    );
    body = <ContextView onBack={() => setCtx(false)} pages={shown === 2 ? [intro, lensList] : [intro]} />;
  } else if (shown === 5) {
    body = (
      <OutcomeCard
        text={bc.reformMismatch ? `${UI.caseLocked} ${BOARD_CASE_COPY.mismatch}` : UI.caseLocked}
        feedback={BOARD_CASE_COPY.stepFeedback[3]}
        continueLabel="Face the Board"
        onContinue={() => dispatch({ type: 'GO', page: 9 })}
      />
    );
  } else if (shown === 1) {
    body = (
      <>
        <Prompt step="Section 1 of 4 · Recommendation">{UI.caseRecommendation}</Prompt>
        <VoiceField label="Recommendation" showLabel={false} value={bc.recommendation ?? ''} onChange={(v) => update({ recommendation: v })} rows={4} />
        <button type="button" className="btn btn--primary" disabled={!recommendationValid} onClick={() => finishSection(1)}>
          Continue
          <ArrowIcon />
        </button>
      </>
    );
  } else if (shown === 2 && lensIndex === null) {
    body = (
      <>
        <Prompt step={`Section 2 of 4 · ${bc.lenses.length} of 3 chosen`}>{UI.caseLenses}</Prompt>
        <div className="picker__grid" role="group" aria-label={UI.caseLenses}>
          {LENSES.map((l) => {
            const on = bc.lenses.includes(l.id);
            return (
              <button
                key={l.id}
                type="button"
                className={`opt${on ? ' is-selected' : ''}`}
                aria-pressed={on}
                disabled={!on && bc.lenses.length >= 3}
                title={l.description}
                onClick={() => toggleLens(l.id)}
              >
                {l.title}
              </button>
            );
          })}
        </div>
        <button type="button" className="btn btn--primary" disabled={bc.lenses.length !== 3} onClick={() => setLensIndex(0)}>
          Justify your lenses
          <ArrowIcon />
        </button>
      </>
    );
  } else if (shown === 2 && lensIndex !== null) {
    const id = bc.lenses[lensIndex];
    const value = bc.justifications[id] ?? '';
    body = (
      <>
        <Prompt step={UI.caseLensJustify(lensIndex + 1, lensTitle(id))}>{UI.caseLensQuestion}</Prompt>
        <p className="ref-line">
          Your framing: {sim.boardFraming ? FRAMING.short[sim.boardFraming] : '—'} · Self-report:{' '}
          {sim.selfReportDecision ? SELF_REPORT.short[sim.selfReportDecision] : '—'}
        </p>
        <VoiceField
          key={id}
          label={`Justification for the ${lensTitle(id)} lens`}
          showLabel={false}
          value={value}
          onChange={(v) => update({ justifications: { ...bc.justifications, [id]: v } })}
          placeholder={UI.caseLensPlaceholder}
          minChars={min}
          rows={3}
        />
        <div className="row">
          <button
            type="button"
            className="btn btn--primary"
            disabled={value.trim().length < min}
            onClick={() => {
              if (lensIndex < 2) setLensIndex(lensIndex + 1);
              else {
                setLensIndex(null);
                finishSection(2);
              }
            }}
          >
            {lensIndex < 2 ? 'Next lens' : 'Continue'}
            <ArrowIcon />
          </button>
          <button type="button" className="btn btn--quiet" onClick={() => setLensIndex(lensIndex > 0 ? lensIndex - 1 : null)}>
            Back
          </button>
        </div>
      </>
    );
  } else if (shown === 3) {
    body = (
      <>
        <Prompt step="Section 3 of 4 · Diagnosis">
          {r2
            ? `Agency ${r2.agency}% · Stewardship ${r2.stewardship}% · Stakeholder-recognition ${r2.stakeholderRecognition}%. Primary failure: ${primaryFailureText(r2)}.`
            : 'Complete the accountability diagnosis first.'}
        </Prompt>
        {noteOpen && (
          <VoiceField
            label={BOARD_CASE_COPY.notesLabel}
            showLabel={false}
            placeholder="Optional note for the Board…"
            value={bc.diagnosisNotes}
            onChange={(v) => update({ diagnosisNotes: v })}
            rows={2}
          />
        )}
        <div className="row">
          <button type="button" className="btn btn--primary" disabled={!r2} onClick={() => finishSection(3)}>
            Continue
            <ArrowIcon />
          </button>
          {!noteOpen && (
            <button type="button" className="btn btn--quiet" onClick={() => setNoteOpen(true)}>
              {UI.caseNote}
            </button>
          )}
        </div>
      </>
    );
  } else if (reformStage === 'target') {
    body = (
      <>
        <Prompt step="Section 4 of 4 · Governance reform">{UI.caseTarget}</Prompt>
        <div className="picker__grid picker__grid--single" role="group" aria-label={UI.caseTarget}>
          {LEVERS.map((l) => (
            <button
              key={l}
              type="button"
              className={`opt${bc.reformTarget === l ? ' is-selected' : ''}`}
              aria-pressed={bc.reformTarget === l}
              onClick={() => update({ reformTarget: l })}
            >
              {LEVER_COPY[l].label}
              {primary.includes(l) && <span className="tag">Your primary diagnosis</span>}
            </button>
          ))}
        </div>
        <button type="button" className="btn btn--primary" disabled={!bc.reformTarget} onClick={() => setReformStage('text')}>
          Continue
          <ArrowIcon />
        </button>
      </>
    );
  } else {
    const target = bc.reformTarget;
    body = (
      <>
        <div className="target-line">
          <span className="prompt__step">Reform · {target ? LEVER_COPY[target].label : ''}</span>
          <button type="button" className="btn btn--link btn--tiny" onClick={() => setReformStage('target')}>
            {UI.caseChangeTarget}
          </button>
        </div>
        <VoiceField
          label="Your reform"
          showLabel={false}
          value={bc.reformText}
          onChange={(v) => update({ reformText: v })}
          placeholder={UI.caseReform}
          minChars={min}
          rows={3}
        />
        <div className="row">
          <button type="button" className="btn btn--accent" disabled={!reformValid} onClick={lock}>
            {BOARD_CASE_COPY.lock}
          </button>
          {target && (
            <button
              type="button"
              className="btn btn--quiet btn--small"
              onClick={() => update({ reformText: REFORM_CARDS[target].text, reformCard: target })}
            >
              {UI.caseSuggested}
            </button>
          )}
        </div>
      </>
    );
  }

  const overlay = (
    <div className="boardpack" aria-hidden="true">
      <div className="boardpack__page">
        <span className="boardpack__org">
          <DeltaMark size={12} /> {BRAND.org}
        </span>
        {BOARD_CASE_COPY.steps.map((title, i) => {
          const n = i + 1;
          const done = bc.stepsComplete >= n;
          return (
            <button
              key={title}
              type="button"
              tabIndex={-1}
              className={`boardpack__tab${done ? ' is-done' : ''}${Math.min(shown, 4) === n && !bc.locked ? ' is-open' : ''}`}
              style={{ '--tab': TAB_COLORS[i] } as CSSProperties}
              onClick={() => goSection(n)}
            >
              {title}
              <span className="boardpack__tick">{done && <CheckIcon width={11} height={11} />}</span>
            </button>
          );
        })}
      </div>
      <div className="boardpack__page">
        <p className="boardpack__heading">Board Case</p>
        <p className="boardpack__meta">Prepared by {sim.learnerName.trim() || 'the Company Secretary'}</p>
        <p className="boardpack__meta">{bc.stepsComplete} of 4 sections complete</p>
        <div className="boardpack__bar">
          <span style={{ width: `${bc.stepsComplete * 25}%` }} />
        </div>
        {bc.locked && <span className="boardpack__stamp">LOCKED FOR BOARD</span>}
      </div>
    </div>
  );

  return (
    <Stage
      image={SCENES.boardCase}
      label="Build the Board case"
      overlay={overlay}
      quote={!ctx && shown === 4 && reformStage === 'text' && mismatch ? <MediaNotice text={BOARD_CASE_COPY.mismatch} /> : undefined}
      chapter={{ title: PAGE_META[8].title, subtitle: PAGE_META[8].subtitle }}
    >
      <DockHeader page={8} title="Board Case" steps={4} current={Math.min(bc.stepsComplete, 4)} onContext={() => setCtx((c) => !c)} contextOpen={ctx} />
      {message && !ctx && <Prompt tone="warn">{message}</Prompt>}
      {body}
    </Stage>
  );
}
