import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { ChatCircle, FileText, Newspaper, Pulse, Scales, Warning } from '@phosphor-icons/react';
import { SCENES, SPEAKER_CLIPS } from '../assets';
import { usePageIntro } from '../components/Experience';
import { useNarration, useSpeakOnce } from '../components/Narration';
import { RadioPanel } from '../components/RadioPanel';
import { revealTiming, TYPE_SPEED, TypeText, useDelayed } from '../components/Reveal';
import { PresenceClip } from '../components/SpeakerCard';
import { SimulationStage } from '../components/SimulationStage';
import { PillButton, StageCopy, TextLink } from '../components/ui';
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
  type QuestionCopy,
} from '../sim/content';
import { fill, mapOptions, primaryFailureText, reformTitleText, singleCauseLine } from '../sim/derive';
import { GUIDE, OBJECTIVES } from '../sim/experience';
import { useSim } from '../sim/store';
import type { Opt } from '../sim/types';

// Page 09 — Board Q&A (spec §20), as a run of one-to-one confrontations inside the Board meeting.
// The room blurs; one Board member comes forward, asks, hears the learner's answer (typed or spoken),
// has them pick the reasoning closest to it (scored), reacts in their own voice, then steps back for the next.

/** Where the current Board member is in their turn. */
type BoardQAState = 'entering' | 'asking' | 'awaiting-response' | 'submitting' | 'feedback' | 'exiting';

interface Turn {
  key: string;
  speaker: string;
  role: string;
  text: string;
  /** Scored questions take an answer; follow-ups are noted and carried into the final answer. */
  scored?: { id: 'q1' | 'q2'; copy: QuestionCopy; shuffleKey: string };
}

interface MemoryChip {
  label: string;
  detail: string;
  icon: ReactNode;
  warn?: boolean;
}

const ROLES: Record<string, string> = {
  'Board Chair': 'Chair of the Board',
  'Independent Non-Executive Director': 'Independent Non-Executive Director',
};
/** A spoken question starts this long after it is shown (see useSpeakOnce). */
const VOICE_LEAD_MS = 400;
const ENTER_MS = 560;
const EXIT_MS = 420;

export function Page09BoardQA() {
  const { sim, dispatch } = useSim();
  const { speakOnly, say } = useNarration();
  const rc = sim.relationshipCost;
  const Q1 = rc ? Q1_RELATIONSHIP : Q1_COMPLIANCE;
  const r2 = sim.accountability.round2;
  const bc = sim.boardCase;
  const tokens = {
    primaryFailure: primaryFailureText(r2),
    reformTitle: reformTitleText(bc),
    reformTarget: bc.reformTarget ? LEVER_COPY[bc.reformTarget].label : 'a different failure type',
  };

  // Follow-ups the Board raises from the learner's own case (not scored; carried into the final answer).
  const follow = useMemo(
    () => [
      ...(bc.reformMismatch ? [{ text: fill(QA_FOLLOW_UPS.mismatch, tokens), chip: QA_FOLLOW_UPS.mismatchChip }] : []),
      ...(r2 && isSingleCause(r2) ? [{ text: singleCauseLine(r2), chip: QA_FOLLOW_UPS.singleCauseChip }] : []),
    ],
    // Fixed for the visit: the case is locked before the Board meets.
    [],
  );
  // The Board's questions, in order. Consecutive turns by the same person stay on screen together.
  const turns: Turn[] = [
    { key: 'q1', speaker: Q1.speaker, role: ROLES[Q1.speaker], text: Q1.question, scored: { id: 'q1', copy: Q1, shuffleKey: rc ? 'q1-relationship' : 'q1-compliance' } },
    ...follow.map((f, i): Turn => ({ key: `follow-${i}`, speaker: Q2.speaker, role: ROLES[Q2.speaker], text: f.text })),
    { key: 'q2', speaker: Q2.speaker, role: ROLES[Q2.speaker], text: Q2.question, scored: { id: 'q2', copy: Q2, shuffleKey: 'q2' } },
  ];
  const followChips = follow.map((f) => f.chip);

  // Resume where the learner left off.
  const [index, setIndex] = useState(() => (sim.boardQA.q2 ? turns.length - 1 : sim.boardQA.q1 ? 1 : 0));
  const [state, setState] = useState<BoardQAState>(() => (sim.boardQA.q2 ? 'feedback' : 'entering'));
  const [openChip, setOpenChip] = useState<string | null>(null);
  const turn = turns[index];
  const answer = turn.scored ? sim.boardQA[turn.scored.id] : null;
  const isLast = index === turns.length - 1;

  const intro = usePageIntro('qa', GUIDE.qaLoad, index === 0 && !sim.boardQA.q1);
  const timing = revealTiming(PAGE_META[9].title, PAGE_META[9].subtitle, OBJECTIVES[9]);
  // Once the page title has had its moment, the room blurs and the first Board member comes forward.
  const inSession = useDelayed(intro.ready, intro.animate ? timing.controlsAt + 600 : 0);

  // entering → asking once the member has settled.
  useEffect(() => {
    if (!inSession || state !== 'entering') return;
    const id = window.setTimeout(() => setState('asking'), ENTER_MS);
    return () => window.clearTimeout(id);
  }, [inSession, state]);

  // asking: the question is spoken as it types in; a short beat after it ends, the learner may answer.
  const heard = useSpeakOnce(`qa-${turn.key}`, turn.text, inSession && state === 'asking');
  useEffect(() => {
    if (state !== 'asking' || !heard) return;
    const id = window.setTimeout(() => setState('awaiting-response'), 400);
    return () => window.clearTimeout(id);
  }, [state, heard]);

  // A member appears fresh (their presence beat plays) only the first time they come forward.
  const introduced = useRef(new Set<string>());
  const fresh = !introduced.current.has(turn.speaker) && state !== 'feedback';
  useEffect(() => {
    if (inSession) introduced.current.add(turn.speaker);
  }, [inSession, turn.speaker]);

  const advance = () => {
    if (isLast) {
      dispatch({ type: 'RESOLVE_ENDING' });
      dispatch({ type: 'GO', page: 10 });
      return;
    }
    setOpenChip(null);
    const next = turns[index + 1];
    if (next.speaker === turn.speaker) {
      // Same person keeps questioning: only the question changes.
      setIndex(index + 1);
      setState('asking');
      return;
    }
    setState('exiting');
    window.setTimeout(() => {
      setIndex(index + 1);
      setState('entering');
    }, EXIT_MS);
  };

  const confirm = (opt: Opt) => {
    if (!turn.scored) return;
    dispatch({ type: turn.scored.id === 'q1' ? 'CHOOSE_Q1' : 'CHOOSE_Q2', opt });
    setState('feedback');
    const reaction = turn.scored.copy.reaction[opt];
    // The Board member answers first; after the final question the narrator closes the session.
    speakOnly(reaction, isLast ? () => say(GUIDE.qaAnswered[1]) : undefined);
  };

  // Only the earlier decisions this person is pressing on.
  const journalist = sim.stakeholderResponses.journalist;
  const exec = sim.executiveResponse;
  const sr = sim.selfReportDecision;
  const fr = sim.boardFraming;
  const candidates: (MemoryChip | null)[] =
    turn.key === 'q1'
      ? [
          rc && exec ? { label: `Reply to ${EXECUTIVE.name}`, detail: EXECUTIVE.short[exec], icon: <ChatCircle size={20} /> } : null,
          { label: 'Accountability diagnosis', detail: `Primary failure: ${tokens.primaryFailure}`, icon: <Pulse size={20} /> },
          !rc && sr ? { label: 'Disclosure choice', detail: SELF_REPORT.short[sr], icon: <Scales size={20} /> } : null,
        ]
      : turn.key === 'q2'
        ? [
            sr ? { label: 'Disclosure choice', detail: SELF_REPORT.short[sr], icon: <Scales size={20} /> } : null,
            fr ? { label: 'Board framing', detail: FRAMING.short[fr], icon: <FileText size={20} /> } : null,
            journalist ? { label: 'Media response', detail: STAKEHOLDERS[2].short[journalist], icon: <Newspaper size={20} /> } : null,
            ...followChips.map((label) => ({ label, detail: UI.followUpNote, icon: <Warning size={20} />, warn: true })),
          ]
        : [{ label: 'Accountability diagnosis', detail: `Primary failure: ${tokens.primaryFailure}`, icon: <Pulse size={20} /> }];
  const chips = candidates.filter((c): c is MemoryChip => c !== null);

  const clip = SPEAKER_CLIPS[turn.speaker];
  const focused = inSession && state !== 'exiting';

  let interaction: ReactNode = null;
  if (state === 'awaiting-response' && turn.scored) {
    const id = turn.scored.id;
    interaction = (
      <div className="qa-respond">
        <VoiceField
          label={`Your answer to the ${turn.speaker}`}
          showLabel={false}
          value={sim.boardQA.ownWords[id] ?? ''}
          onChange={(text) => dispatch({ type: 'SET_OWN_WORDS', question: id, text })}
          placeholder="Answer in your own words, or speak…"
          hint="Type, or use the microphone. Nothing is sent until you submit."
          rows={4}
          variant="area"
        />
        {chips.length > 0 && <Recall chips={chips} open={openChip} onToggle={setOpenChip} />}
        <div className="qa-actions">
          <PillButton size="small" onClick={() => setState('submitting')}>
            Submit answer
          </PillButton>
        </div>
      </div>
    );
  } else if (state === 'awaiting-response') {
    interaction = (
      <div className="qa-respond">
        <p className="qa-note">{UI.followUpNote}</p>
        {chips.length > 0 && <Recall chips={chips} open={openChip} onToggle={setOpenChip} />}
        <div className="qa-actions">
          <PillButton size="small" onClick={advance} autoFocus>
            Noted
          </PillButton>
        </div>
      </div>
    );
  } else if (state === 'submitting' && turn.scored) {
    const { copy, shuffleKey } = turn.scored;
    interaction = (
      <RadioPanel
        className="qa-choose"
        title="Which reasoning is closest to what you said?"
        titles={copy.short}
        texts={copy === Q2 ? Q2.options : mapOptions(copy.options, (t) => fill(t, tokens))}
        seed={sim.seed}
        shuffleKey={shuffleKey}
        confirmLabel="Answer the Board"
        onConfirm={confirm}
        footer={<TextLink onClick={() => setState('awaiting-response')}>Back to my answer</TextLink>}
      />
    );
  } else if (state === 'feedback' && turn.scored && answer) {
    interaction = (
      <div className="qa-feedback" aria-live="polite">
        <blockquote className="qa-reaction">
          <span className="qa-reaction__who">{turn.speaker === 'Board Chair' ? 'The Chair' : 'The Director'}</span>“{turn.scored.copy.reaction[answer]}”
        </blockquote>
        <p className="qa-feedback__chosen">You answered: {turn.scored.copy.short[answer]}</p>
        <p className="qa-feedback__text">{turn.scored.copy.feedback[answer]}</p>
        <div className="qa-actions">
          <PillButton size="small" onClick={advance} autoFocus>
            {isLast ? 'Hear the Board’s decision' : 'Continue'}
          </PillButton>
        </div>
      </div>
    );
  }

  return (
    <SimulationStage
      page={9}
      image={SCENES.boardQA}
      label="Board Q&A"
      wash={focused ? false : 'strong'}
      intro={intro}
      className={`page09${inSession ? ' is-session' : ''}${state === 'exiting' ? ' is-between' : ''}`}
      backdrop={
        inSession && clip ? (
          <figure key={turn.speaker} className={`qa-hero is-${state === 'exiting' ? 'exiting' : 'in'}`} aria-hidden="true">
            <PresenceClip clip={clip} play={state === 'asking' || state === 'awaiting-response'} still={!fresh} />
          </figure>
        ) : undefined
      }
    >
      <StageCopy className="page09__copy" title={PAGE_META[9].title} subtitle={PAGE_META[9].subtitle} objective={OBJECTIVES[9]} intro={intro} />

      {inSession && (
        <section key={turn.speaker} className={`qa-panel${state === 'exiting' ? ' is-exiting' : ''}`} aria-label={`${turn.speaker} is questioning you`}>
          <header className="qa-who">
            <span className="qa-who__name">{turn.speaker === 'Independent Non-Executive Director' ? 'Independent Director' : turn.speaker}</span>
            <span className="qa-who__role">{turn.role}</span>
          </header>
          {state !== 'entering' && (
            <blockquote className="qa-question" key={turn.key}>
              <TypeText text={`“${turn.text}”`} perChar={TYPE_SPEED.quote} delay={VOICE_LEAD_MS} animate={state === 'asking' && !answer} />
            </blockquote>
          )}
          {interaction}
        </section>
      )}
    </SimulationStage>
  );
}

/** Earlier decisions the Board member is pressing on; each opens a short recall note. */
function Recall({ chips, open, onToggle }: { chips: MemoryChip[]; open: string | null; onToggle: (label: string | null) => void }) {
  const detail = chips.find((c) => c.label === open)?.detail;
  return (
    <div className="qa-recall">
      <div className="qa-recall__chips" role="group" aria-label="What the Board remembers">
        {chips.map((c) => (
          <button
            key={c.label}
            type="button"
            className={`memory-chip${c.warn ? ' memory-chip--warn' : ''}`}
            aria-expanded={open === c.label}
            onClick={() => onToggle(open === c.label ? null : c.label)}
          >
            {c.icon}
            {c.label}
          </button>
        ))}
      </div>
      {detail && (
        <p className="qa-recall__detail" aria-live="polite">
          {detail}
        </p>
      )}
    </div>
  );
}
