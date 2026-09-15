import { useSim } from '../sim/store';

/** QA helper, shown only with ?debug in the URL. Displays hidden state; never shown to learners. */
export function DebugPanel() {
  const { sim, dispatch } = useSim();
  const { RT, BC, EM, MN } = sim.state;
  return (
    <details className="debug">
      <summary>Debug</summary>
      <div>
        RT {RT} · BC {BC} · EM {EM} · MN {MN}
      </div>
      <div>
        order {String(sim.reviewOrderCorrect)} · relCost {String(sim.relationshipCost)} · mismatch {String(sim.boardCase.reformMismatch)}
      </div>
      <div>
        ending {sim.ending ?? '—'}
        {sim.endingVariant ? ' (variant)' : ''}
      </div>
      <div className="debug__pages">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
          <button key={n} type="button" onClick={() => dispatch({ type: 'GO', page: n })}>
            {n}
          </button>
        ))}
      </div>
      <button type="button" onClick={() => dispatch({ type: 'RESET' })}>
        Reset run
      </button>
    </details>
  );
}
