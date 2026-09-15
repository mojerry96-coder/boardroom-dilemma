import type { Opt, StakeholderId } from './sim/types';

// Asset manifest. Scene stills are generated (Seedream 5.0 Pro / Soul 2.0) and optimised
// into public/scenes. Films live in public/films with WebVTT captions.

const base = import.meta.env.BASE_URL;
const scene = (file: string) => `${base}scenes/${file}`;
const film = (file: string) => `${base}films/${file}`;

export interface SceneImage {
  src: string;
  alt: string;
  position?: string;
  standIn: boolean;
}

export const SCENES = {
  intro: {
    src: scene('intro.jpg'),
    alt: 'Three board members at a marble table in a daylight Lagos boardroom; the man in the centre leans forward, gesturing mid-question.',
    position: '62% 40%',
    standIn: false,
  },
  role: {
    src: scene('role.jpg'),
    alt: 'Three board members sit back across the marble table, silent and expectant, a closed board pack in front of the learner.',
    position: '60% 40%',
    standIn: false,
  },
  tabletop: {
    src: scene('tabletop.jpg'),
    alt: 'Top view of a dark marble table in daylight with a glass of water, a coffee cup and a fountain pen at its edges.',
    position: '50% 50%',
    standIn: false,
  },
  crisis: {
    src: scene('crisis.jpg'),
    alt: 'The three board members wait across a wide, clear marble table in the boardroom.',
    position: '60% 30%',
    standIn: false,
  },
  accountability: {
    src: scene('accountability.jpg'),
    alt: 'The board members weigh a difficult judgement: one with steepled fingers, one looking down in thought.',
    position: '60% 35%',
    standIn: false,
  },
  regulator: {
    src: scene('regulator.jpg'),
    alt: 'A senior regulator seated behind a wooden desk in a formal office, hands folded, beneath a fictional FISCA emblem.',
    position: '68% 35%',
    standIn: false,
  },
  executive: {
    src: scene('executive.jpg'),
    alt: 'The Group Commercial Director in a dark suit and burgundy tie speaks forcefully in a corridor beside a glass-walled boardroom.',
    position: '66% 30%',
    standIn: false,
  },
  boardCase: {
    src: scene('boardcase.jpg'),
    alt: 'An open leather portfolio with blank pages on the boardroom table, empty chairs and the Lagos skyline beyond.',
    position: '62% 60%',
    standIn: false,
  },
  boardQA: {
    src: scene('board_qa.jpg'),
    alt: 'Four board members across the table; the woman in the centre leans forward with an open, questioning hand.',
    position: '50% 32%',
    standIn: false,
  },
  outcome: {
    src: scene('outcome.jpg'),
    alt: 'The empty boardroom after the session, a closed folder and pen on the marble table.',
    position: '60% 55%',
    standIn: false,
  },
} satisfies Record<string, SceneImage>;

export type SceneKey = keyof typeof SCENES;

export const PORTRAITS: Record<Exclude<StakeholderId, 'regulator'>, SceneImage> = {
  employee: {
    src: scene('employee.jpg'),
    alt: 'The employee representative, a man in his forties in a high-visibility vest, holding a hard hat at the plant.',
    standIn: false,
  },
  journalist: {
    src: scene('journalist.jpg'),
    alt: 'A business journalist in a grey blazer holding an open notebook outside an office building.',
    standIn: false,
  },
  family: {
    src: scene('family.jpg'),
    alt: 'The mother of the deceased worker, in dark clothing and a headwrap, seated with a folded letter.',
    standIn: false,
  },
};

/** Pre-blurred backdrops behind the stakeholder portrait card (avoids a live CSS blur on phones). */
export const PORTRAIT_BACKDROPS: Record<Exclude<StakeholderId, 'regulator'>, SceneImage> = {
  employee: { src: scene('employee_bg.jpg'), alt: '', standIn: false },
  journalist: { src: scene('journalist_bg.jpg'), alt: '', standIn: false },
  family: { src: scene('family_bg.jpg'), alt: '', standIn: false },
};

/** Stills used by the storyboard fallback when a film file is unavailable. */
export const FILM_IMAGES: Record<string, string> = {
  intro: SCENES.intro.src,
  boardQA: SCENES.boardQA.src,
  crisis: SCENES.crisis.src,
  regulator: SCENES.regulator.src,
  executive: SCENES.executive.src,
  journalist: PORTRAITS.journalist.src,
};

export interface FilmSource {
  src: string;
  captions: string;
}

/** Final films with WebVTT captions. Set to null to fall back to the storyboard preview. */
export const FILMS: {
  intro: FilmSource | null;
  executiveSetup: FilmSource | null;
  executiveBranch: Record<Opt, FilmSource | null>;
} = {
  intro: { src: film('intro.mp4'), captions: film('intro.vtt') },
  executiveSetup: { src: film('executive_setup.mp4'), captions: film('executive_setup.vtt') },
  executiveBranch: {
    A: { src: film('executive_branch_a.mp4'), captions: film('executive_branch_a.vtt') },
    B: { src: film('executive_branch_b.mp4'), captions: film('executive_branch_b.vtt') },
    C: { src: film('executive_branch_c.mp4'), captions: film('executive_branch_c.vtt') },
    D: { src: film('executive_branch_d.mp4'), captions: film('executive_branch_d.vtt') },
  },
};

export const filmPath = film;
