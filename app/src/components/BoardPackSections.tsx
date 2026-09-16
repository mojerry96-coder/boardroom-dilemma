import { useState, type ReactNode } from 'react';
import { primaryLevers } from '../sim/accountability';
import { BOARD_CASE_COPY, EVIDENCE_LABEL, FRAMING, LENSES, LEVER_COPY, REFORM_CARDS, SELF_REPORT, UI } from '../sim/content';
import { primaryFailureText } from '../sim/derive';
import { LEVERS, type BoardCase, type EvidenceId, type LensId, type SimState } from '../sim/types';
import { PillButton, TextLink } from './ui';
import { VoiceField } from './VoiceField';

// The four working pages of the Board pack (Page 08). Each section keeps the script's inputs.

interface SectionProps {
  sim: SimState;
  update: (patch: Partial<BoardCase>) => void;
  toggleEvidence: (id: EvidenceId) => void;
  toggleLens: (id: LensId) => void;
  onDone: () => void;
  readOnly: boolean;
}

const EVIDENCE_ORDER: EvidenceId[] = ['incident', 'nearMiss', 'payments', 'correspondence', 'news'];

function SectionHead({ n, title, hint }: { n: number; title: string; hint?: string }) {
  return (
    <header className="pack-section__head">
      <p className="pack-section__kicker">Section {n} of 4</p>
      <h3 className="pack-section__title">{title}</h3>
      {hint && <p className="pack-section__hint">{hint}</p>}
    </header>
  );
}

function Actions({ children }: { children: ReactNode }) {
  return <div className="pack-actions">{children}</div>;
}

function AddButton({ disabled, onClick, label = 'Add to Board Pack' }: { disabled?: boolean; onClick: () => void; label?: string }) {
  return (
    <PillButton size="small" variant="green" icon="none" disabled={disabled} onClick={onClick}>
      {label}
    </PillButton>
  );
}

export function EvidenceSection({ sim, update, toggleEvidence, onDone, readOnly }: SectionProps) {
  const bc = sim.boardCase;
  const reviewed = EVIDENCE_ORDER.filter((id) => sim.evidence.reviewed.includes(id));
  const available = reviewed.length ? reviewed : EVIDENCE_ORDER;
  const selected = bc.selectedEvidence;
  const valid = selected.length > 0 && (bc.recommendation ?? '').trim().length >= 20;

  return (
    <div className="pack-section">
      <SectionHead n={1} title="Selected Evidence" hint="Include only the evidence your case relies on." />
      <div className="pack-chips" role="group" aria-label="Evidence to include">
        {available.map((id) => (
          <button key={id} type="button" className="pack-chip" aria-pressed={selected.includes(id)} disabled={readOnly} onClick={() => toggleEvidence(id)}>
            {EVIDENCE_LABEL[id]}
          </button>
        ))}
      </div>
      <VoiceField
        label={BOARD_CASE_COPY.steps[0]}
        value={bc.recommendation ?? ''}
        onChange={(v) => update({ recommendation: v })}
        rows={3}
        variant="area"
        onPaper
        disabled={readOnly}
        hint={BOARD_CASE_COPY.stepHints[0]}
      />
      {!readOnly && (
        <Actions>
          <AddButton disabled={!valid} onClick={onDone} />
        </Actions>
      )}
    </div>
  );
}

export function LensSection({ sim, update, toggleLens, onDone, readOnly }: SectionProps) {
  const bc = sim.boardCase;
  const min = BOARD_CASE_COPY.minChars;
  const [lensIndex, setLensIndex] = useState<number | null>(null);
  const title = (id: LensId) => LENSES.find((l) => l.id === id)?.title ?? id;

  if (lensIndex !== null && bc.lenses[lensIndex]) {
    const id = bc.lenses[lensIndex];
    const value = bc.justifications[id] ?? '';
    return (
      <div className="pack-section">
        <SectionHead n={2} title={UI.caseLensJustify(lensIndex + 1, title(id))} hint={BOARD_CASE_COPY.lensPrompt} />
        <p className="pack-ref">
          Your framing: {sim.boardFraming ? FRAMING.short[sim.boardFraming] : '—'} · Self-report: {sim.selfReportDecision ? SELF_REPORT.short[sim.selfReportDecision] : '—'}
        </p>
        <VoiceField
          key={id}
          label={`Justification for the ${title(id)} lens`}
          showLabel={false}
          value={value}
          onChange={(v) => update({ justifications: { ...bc.justifications, [id]: v } })}
          placeholder={UI.caseLensPlaceholder}
          minChars={min}
          rows={3}
          variant="area"
          onPaper
          disabled={readOnly}
        />
        <Actions>
          {!readOnly && (
            <AddButton
              label={lensIndex < 2 ? 'Next lens' : 'Add to Board Pack'}
              disabled={value.trim().length < min}
              onClick={() => {
                if (lensIndex < 2) setLensIndex(lensIndex + 1);
                else {
                  setLensIndex(null);
                  onDone();
                }
              }}
            />
          )}
          <TextLink dark onClick={() => setLensIndex(lensIndex > 0 ? lensIndex - 1 : null)}>
            Back
          </TextLink>
        </Actions>
      </div>
    );
  }

  return (
    <div className="pack-section">
      <SectionHead n={2} title="Ethical Lens" hint={`${UI.caseLenses} ${BOARD_CASE_COPY.lensCount(bc.lenses.length)}.`} />
      <div className="lens-cards" role="group" aria-label={UI.caseLenses}>
        {LENSES.map((l) => {
          const on = bc.lenses.includes(l.id);
          return (
            <button
              key={l.id}
              type="button"
              className="lens-card"
              aria-pressed={on}
              disabled={readOnly || (!on && bc.lenses.length >= 3)}
              onClick={() => toggleLens(l.id)}
            >
              <span className="lens-card__title">{l.title}</span>
              <span className="lens-card__text">{l.description}</span>
            </button>
          );
        })}
      </div>
      <Actions>
        <AddButton label={readOnly ? 'Read justifications' : 'Justify your lenses'} disabled={bc.lenses.length !== 3} onClick={() => setLensIndex(0)} />
      </Actions>
    </div>
  );
}

export function DiagnosisSection({ sim, update, onDone, readOnly }: SectionProps) {
  const bc = sim.boardCase;
  const r2 = sim.accountability.round2;
  const [noteOpen, setNoteOpen] = useState(bc.diagnosisNotes.trim().length > 0);
  const primary = r2 ? primaryLevers(r2) : [];

  return (
    <div className="pack-section">
      <SectionHead n={3} title="Diagnosis" hint={BOARD_CASE_COPY.stepHints[2]} />
      {r2 ? (
        <>
          <ul className="diagnosis-bars">
            {LEVERS.map((l) => (
              <li key={l} className={primary.includes(l) ? 'is-primary' : undefined}>
                <span className="diagnosis-bars__label">{LEVER_COPY[l].label}</span>
                <span className="diagnosis-bars__track" aria-hidden="true">
                  <span style={{ width: `${r2[l]}%` }} />
                </span>
                <span className="diagnosis-bars__value">{r2[l]}%</span>
              </li>
            ))}
          </ul>
          <p className="pack-ref">Primary failure: {primaryFailureText(r2)}</p>
        </>
      ) : (
        <p className="pack-ref">Complete the accountability diagnosis first.</p>
      )}
      {noteOpen && (
        <VoiceField
          label={BOARD_CASE_COPY.notesLabel}
          showLabel={false}
          placeholder="Optional note for the Board…"
          value={bc.diagnosisNotes}
          onChange={(v) => update({ diagnosisNotes: v })}
          rows={2}
          variant="area"
          onPaper
          disabled={readOnly}
        />
      )}
      {!readOnly && (
        <Actions>
          <AddButton disabled={!r2} onClick={onDone} />
          {!noteOpen && (
            <TextLink dark onClick={() => setNoteOpen(true)}>
              {UI.caseNote}
            </TextLink>
          )}
        </Actions>
      )}
    </div>
  );
}

export function ReformSection({ sim, update, onDone, readOnly }: SectionProps) {
  const bc = sim.boardCase;
  const r2 = sim.accountability.round2;
  const min = BOARD_CASE_COPY.minChars;
  const primary = r2 ? primaryLevers(r2) : [];
  const [stage, setStage] = useState<'target' | 'text'>(bc.reformTarget ? 'text' : 'target');
  const target = bc.reformTarget;
  const mismatch = target !== null && r2 !== null && !primary.includes(target);
  const valid = target !== null && bc.reformText.trim().length >= min;

  if (stage === 'target' && !readOnly) {
    return (
      <div className="pack-section">
        <SectionHead n={4} title="Governance Reform" hint={UI.caseTarget} />
        <div className="pack-options" role="group" aria-label={UI.caseTarget}>
          {LEVERS.map((l) => (
            <button key={l} type="button" className="pack-option" aria-pressed={target === l} onClick={() => update({ reformTarget: l })}>
              <span>{LEVER_COPY[l].label}</span>
              {primary.includes(l) && <span className="pack-tag">Your primary diagnosis</span>}
            </button>
          ))}
        </div>
        <Actions>
          <AddButton label="Continue" disabled={!target} onClick={() => setStage('text')} />
        </Actions>
      </div>
    );
  }

  return (
    <div className="pack-section">
      <SectionHead n={4} title={`Reform · ${target ? LEVER_COPY[target].label : ''}`} />
      {!readOnly && (
        <p className="pack-ref">
          <TextLink dark onClick={() => setStage('target')}>
            {UI.caseChangeTarget}
          </TextLink>
          {target && (
            <TextLink dark onClick={() => update({ reformText: REFORM_CARDS[target].text, reformCard: target })}>
              {UI.caseSuggested}
            </TextLink>
          )}
        </p>
      )}
      <VoiceField
        label="Your reform"
        showLabel={false}
        value={bc.reformText}
        onChange={(v) => update({ reformText: v })}
        placeholder={UI.caseReform}
        minChars={min}
        rows={3}
        variant="area"
        onPaper
        disabled={readOnly}
      />
      {mismatch && (
        <p className="pack-warning" role="status">
          {BOARD_CASE_COPY.mismatch}
        </p>
      )}
      {!readOnly && (
        <Actions>
          <AddButton disabled={!valid} onClick={onDone} />
        </Actions>
      )}
    </div>
  );
}
