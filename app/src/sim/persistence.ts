import type { SimState } from './types';

// Replaceable persistence (content file section 13). Swap LocalStorageAdapter for an
// LMS or server adapter without touching the simulation.

export interface SimulationResult {
  runId: string;
  learnerName: string;
  completedAt: string;
  ending: SimState['ending'];
  endingVariant: boolean;
  state: SimState['state'];
  flags: { reviewOrderCorrect: boolean; relationshipCost: boolean; reformMismatch: boolean };
  choices: SimState['log'];
  accountability: SimState['accountability'];
  boardCase: SimState['boardCase'];
  boardQA: SimState['boardQA'];
  reflection: SimState['reflection'];
}

export interface PersistenceAdapter {
  loadSession(): Promise<SimState | null>;
  saveSession(state: SimState): Promise<void>;
  clearSession(): Promise<void>;
  submitResult(result: SimulationResult): Promise<void>;
}

// ?store=<name> keeps a separate saved run (e.g. for QA) without touching a learner's session.
const storeName = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('store') : null;
const suffix = storeName ? `:${storeName.replace(/[^\w-]/g, '').slice(0, 24)}` : '';
const SESSION_KEY = `boardroom-dilemma:session:v1${suffix}`;
const RESULTS_KEY = `boardroom-dilemma:results:v1${suffix}`;

export class LocalStorageAdapter implements PersistenceAdapter {
  async loadSession() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as SimState;
      return parsed.version === 1 ? parsed : null;
    } catch {
      return null;
    }
  }

  async saveSession(state: SimState) {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable (private mode) — the run continues in memory */
    }
  }

  async clearSession() {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
  }

  async submitResult(result: SimulationResult) {
    try {
      const existing = JSON.parse(localStorage.getItem(RESULTS_KEY) ?? '[]') as SimulationResult[];
      const next = [...existing.filter((r) => r.runId !== result.runId), result];
      localStorage.setItem(RESULTS_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }
}

export const persistence: PersistenceAdapter = new LocalStorageAdapter();
