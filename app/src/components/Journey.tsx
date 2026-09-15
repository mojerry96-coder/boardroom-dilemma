import { useEffect, useRef } from 'react';
import {
  BOARD_CASE_COPY,
  EVIDENCE_COPY,
  EXECUTIVE,
  FRAMING,
  LENSES,
  Q1_COMPLIANCE,
  Q1_RELATIONSHIP,
  Q2,
  SELF_REPORT,
  STAKEHOLDERS,
  ACCOUNTABILITY_COPY,
} from '../sim/content';
import { allocationText, reformTitleText, round2Message, stakeholderExtras } from '../sim/derive';
import type { SimState } from '../sim/types';
import { CloseIcon } from './Icons';

interface JourneyItem {
  title: string;
  choice?: string;
  lines: string[];
}

function journeyItems(sim: SimState): JourneyItem[] {
  const items: JourneyItem[] = [];
  if (sim.evidence.complete) {
    items.push({
      title: 'Evidence Desk',
      choice: sim.reviewOrderCorrect ? 'Reviewed in a defensible order' : 'Reached for a later step first',
      lines: [sim.reviewOrderCorrect ? EVIDENCE_COPY.completeCorrect : EVIDENCE_COPY.completeAfterBlock, EVIDENCE_COPY.feedback],
    });
  }
  if (sim.boardFraming) {
    items.push({
      title: 'Board framing',
      choice: FRAMING.short[sim.boardFraming],
      lines: [FRAMING.consequence[sim.boardFraming], FRAMING.feedback[sim.boardFraming]],
    });
  }
  if (sim.selfReportDecision) {
    items.push({
      title: 'Self-report decision',
      choice: SELF_REPORT.short[sim.selfReportDecision],
      lines: [SELF_REPORT.consequence[sim.selfReportDecision], SELF_REPORT.feedback[sim.selfReportDecision]],
    });
  }
  const { round1, round2 } = sim.accountability;
  if (round1 && round2) {
    items.push({
      title: 'Accountability diagnosis',
      choice: `Round 2: ${allocationText(round2)}`,
      lines: [`Round 1: ${allocationText(round1)}`, round2Message(round1, round2), ACCOUNTABILITY_COPY.feedback],
    });
  }
  for (const s of STAKEHOLDERS) {
    const opt = sim.stakeholderResponses[s.id];
    if (!opt) continue;
    items.push({
      title: `Stakeholder — ${s.name}`,
      choice: s.short[opt],
      lines: [[s.reaction[opt], ...stakeholderExtras(s.id, opt, sim)].join(' '), s.feedback],
    });
  }
  if (sim.executiveResponse) {
    const o = sim.executiveResponse;
    items.push({
      title: `Executive pressure — ${EXECUTIVE.name}`,
      choice: EXECUTIVE.short[o],
      lines: [EXECUTIVE.reaction[o], EXECUTIVE.feedback[o]],
    });
  }
  const bc = sim.boardCase;
  if (bc.locked) {
    items.push({
      title: 'Board case',
      choice: `Reform: ${reformTitleText(bc)}`,
      lines: [
        `Recommendation: ${bc.recommendation ?? ''}`,
        `Ethical lenses: ${bc.lenses.map((id) => LENSES.find((l) => l.id === id)?.title).join(', ')}`,
        bc.reformMismatch ? BOARD_CASE_COPY.mismatch : 'Your reform addresses the failure you diagnosed as primary.',
      ],
    });
  }
  const q1 = sim.relationshipCost ? Q1_RELATIONSHIP : Q1_COMPLIANCE;
  if (sim.boardQA.q1) {
    items.push({ title: `Board Q&A — ${q1.speaker}`, choice: q1.short[sim.boardQA.q1], lines: [`“${q1.question}”`, q1.feedback[sim.boardQA.q1]] });
  }
  if (sim.boardQA.q2) {
    items.push({ title: `Board Q&A — ${Q2.speaker}`, choice: Q2.short[sim.boardQA.q2], lines: [`“${Q2.question}”`, Q2.feedback[sim.boardQA.q2]] });
  }
  return items;
}

export function JourneyDialog({ open, onClose, sim }: { open: boolean; onClose: () => void; sim: SimState }) {
  const ref = useRef<HTMLDialogElement>(null);
  const selfClosed = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) {
      selfClosed.current = true;
      el.close();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="doc-dialog"
      aria-labelledby="journey-title"
      onClose={() => {
        if (selfClosed.current) {
          selfClosed.current = false;
          return;
        }
        if (open) onClose();
      }}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onClose();
        }
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      {open && (
        <div className="doc-dialog__frame">
          <div className="doc-dialog__bar">
            <p className="doc-dialog__label">Review Journey</p>
            <button type="button" className="btn btn--light btn--small" onClick={onClose} autoFocus>
              <CloseIcon width={16} height={16} />
              Close
            </button>
          </div>
          <div className="doc-dialog__scroll">
            <div className="journey">
              <h2 id="journey-title" className="section-title" style={{ marginBottom: 16 }}>
                Your decisions, in order
              </h2>
              <ol className="journey__list">
                {journeyItems(sim).map((item) => (
                  <li key={item.title} className="journey__item">
                    <h3>{item.title}</h3>
                    {item.choice && <p className="journey__choice">{item.choice}</p>}
                    {item.lines.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}
