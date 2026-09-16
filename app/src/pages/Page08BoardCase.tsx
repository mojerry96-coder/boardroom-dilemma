import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { CaretRight, ChartBar, Check, FileText, Lock, Scales, ShieldCheck } from '@phosphor-icons/react';
import { PROPS, SCENES } from '../assets';
import { DiagnosisSection, EvidenceSection, LensSection, ReformSection } from '../components/BoardPackSections';
import { DeltaMark } from '../components/Icons';
import { usePageIntro } from '../components/Experience';
import { useNarration } from '../components/Narration';
import { primaryLevers } from '../sim/accountability';
import { Reveal, revealTiming } from '../components/Reveal';
import { SimulationStage } from '../components/SimulationStage';
import { OutcomePanel, PillButton, StageCopy } from '../components/ui';
import { BOARD_CASE_COPY, BRAND, NARRATION, PAGE_META, RECOMMENDATION_BY_SELF_REPORT, UI } from '../sim/content';
import { GUIDE, OBJECTIVES } from '../sim/experience';
import { useSim } from '../sim/store';
import type { BoardCase, EvidenceId, LensId } from '../sim/types';

// Page 08 — Build the Board Case (spec §19). The open Board pack is the interface:
// four section tabs on the left page, the working page on the right. Sections complete in order.

const TABS: { label: string; icon: ReactNode; color: string }[] = [
  { label: 'Selected Evidence', icon: <FileText size={20} />, color: '#6c8db4' },
  { label: 'Ethical Lens', icon: <Scales size={20} />, color: '#3f8f73' },
  { label: 'Diagnosis', icon: <ChartBar size={20} />, color: '#c2a14f' },
  { label: 'Governance Reform', icon: <ShieldCheck size={20} />, color: '#7d63b0' },
];

export function Page08BoardCase() {
  const { sim, dispatch } = useSim();
  const bc = sim.boardCase;
  const allDone = bc.stepsComplete >= 4;
  const [section, setSection] = useState<number | null>(bc.locked ? null : Math.min(bc.stepsComplete + 1, 4));
  const [message, setMessage] = useState<string | null>(null);

  const intro = usePageIntro('case', NARRATION.boardCaseLoad, bc.stepsComplete === 0 && !bc.locked);
  const timing = revealTiming(PAGE_META[8].title, PAGE_META[8].subtitle, OBJECTIVES[8]);
  const { say } = useNarration();
  const r2 = sim.accountability.round2;
  const reformMisses = bc.reformTarget !== null && r2 !== null && !primaryLevers(r2).includes(bc.reformTarget);

  useEffect(() => {
    if (bc.recommendation === null) {
      dispatch({ type: 'UPDATE_BOARD_CASE', patch: { recommendation: RECOMMENDATION_BY_SELF_REPORT[sim.selfReportDecision ?? 'B'] } });
    }
  }, [bc.recommendation, sim.selfReportDecision, dispatch]);

  const update = (patch: Partial<BoardCase>) => dispatch({ type: 'UPDATE_BOARD_CASE', patch });

  const openSection = (n: number) => {
    if (bc.locked || n <= bc.stepsComplete + 1) {
      setSection(n);
      setMessage(null);
      return;
    }
    setMessage(n === 4 && bc.stepsComplete < 2 ? BOARD_CASE_COPY.skipStep2 : BOARD_CASE_COPY.earlyStep);
  };

  const done = (n: number) => {
    dispatch({ type: 'COMPLETE_CASE_STEP', step: n });
    // After each section, the narrator says what it adds to the case and what comes next.
    if (n === 3) say([GUIDE.caseAdded[2], GUIDE.caseReform]);
    else if (n === 4) say(reformMisses ? GUIDE.caseAddedMismatch : GUIDE.caseAdded[3]);
    else say(GUIDE.caseAdded[n - 1]);
    setSection(n < 4 ? Math.max(n + 1, Math.min(bc.stepsComplete + 1, 4)) : null);
    setMessage(null);
  };

  const sectionProps = {
    sim,
    update,
    toggleEvidence: (id: EvidenceId) => dispatch({ type: 'TOGGLE_CASE_EVIDENCE', id }),
    toggleLens: (id: LensId) => dispatch({ type: 'TOGGLE_CASE_LENS', id }),
    readOnly: bc.locked,
  };
  const workspace =
    section === 1 ? (
      <EvidenceSection {...sectionProps} onDone={() => done(1)} />
    ) : section === 2 ? (
      <LensSection {...sectionProps} onDone={() => done(2)} />
    ) : section === 3 ? (
      <DiagnosisSection {...sectionProps} onDone={() => done(3)} />
    ) : section === 4 ? (
      <ReformSection key={bc.locked ? 'locked' : 'open'} {...sectionProps} onDone={() => done(4)} />
    ) : (
      <div className="pack-cover">
        <p className="pack-cover__org">
          <DeltaMark size={22} /> {BRAND.orgShort}
        </p>
        <p className="pack-cover__title">Board Case</p>
        <p className="pack-cover__meta">Prepared by {sim.learnerName.trim() || 'the Company Secretary'}</p>
        <p className="pack-cover__meta">{bc.stepsComplete} of 4 sections complete</p>
        {bc.locked ? (
          <span className="pack-cover__locked">
            <img className="pack-cover__seal" src={PROPS.lockedSeal} alt="" />
            <span className="pack-cover__stamp">Locked for the Board</span>
          </span>
        ) : (
          <p className="pack-cover__note">Better questions. Stronger decisions.</p>
        )}
      </div>
    );

  return (
    <SimulationStage page={8} image={SCENES.boardCase} label="Build the Board Case" wash="strong" intro={intro}>
      <StageCopy className="page08__copy" title={PAGE_META[8].title} subtitle={PAGE_META[8].subtitle} objective={OBJECTIVES[8]} intro={intro}>
        <div className="page08__actions">
          {bc.locked ? (
            <OutcomePanel
              className="page08__outcome"
              text={bc.reformMismatch ? `${UI.caseLocked} ${BOARD_CASE_COPY.mismatch}` : UI.caseLocked}
              feedback={BOARD_CASE_COPY.stepFeedback[3]}
              continueLabel="Face the Board"
              onContinue={() => dispatch({ type: 'GO', page: 9 })}
            />
          ) : (
            <>
              <PillButton
                disabled={!allDone}
                onClick={() => {
                  dispatch({ type: 'LOCK_BOARD_CASE' });
                  say(GUIDE.caseLocked);
                }}
              >
                {BOARD_CASE_COPY.lock}
              </PillButton>
              {!allDone && <p className="page08__progress">{bc.stepsComplete} of 4 sections added</p>}
              {message && (
                <p className="stage-note stage-note--warn" role="alert">
                  {message}
                </p>
              )}
            </>
          )}
        </div>
      </StageCopy>

      <Reveal
        show={intro.ready}
        animate={intro.animate}
        delay={timing.controlsAt}
        as="section"
        className="page08__pack board-pack-hotspot"
        style={{ '--pack-photo': `url(${PROPS.packOpen})`, '--pack-cover': `url(${PROPS.packCover})` } as CSSProperties}
        id="controls"
        aria-label="Board pack"
      >
        <div className="pack-page pack-page--tabs">
          <p className="pack-org">
            <DeltaMark size={16} /> {BRAND.org}
          </p>
          <div className={`pack-tabs${intro.animate ? ' stagger' : ''}`} style={{ '--stagger-base': `${timing.controlsAt + 300}ms` } as CSSProperties}>
            {TABS.map((tab, i) => {
              const n = i + 1;
              const complete = bc.stepsComplete >= n;
              const available = bc.locked || n <= bc.stepsComplete + 1;
              return (
                <button
                  key={tab.label}
                  type="button"
                  className={`pack-tab${section === n ? ' is-open' : ''}${complete ? ' is-done' : ''}`}
                  style={{ '--tab': tab.color, '--i': i } as CSSProperties}
                  aria-current={section === n ? 'step' : undefined}
                  aria-label={`${tab.label}${complete ? ', added' : available ? '' : ', not yet available'}`}
                  onClick={() => openSection(n)}
                >
                  <span className="pack-tab__icon" aria-hidden="true">
                    {tab.icon}
                  </span>
                  <span className="pack-tab__label">{tab.label}</span>
                  <span className="pack-tab__state" aria-hidden="true">
                    {complete ? <Check size={16} /> : available ? <CaretRight size={16} /> : <Lock size={14} />}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="pack-spine" aria-hidden="true" />
        <div className="pack-page pack-page--work" key={section ?? 'cover'}>
          {workspace}
        </div>
      </Reveal>
    </SimulationStage>
  );
}
