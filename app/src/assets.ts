import { IMAGE_VARIANTS } from './imageManifest';
import type { CallSpeaker } from './sim/crisisCall';
import type { EvidenceId, Opt, StakeholderId } from './sim/types';

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
  desk: {
    src: scene('desk.jpg'),
    alt: 'Top view of a polished grey marble boardroom table in soft daylight.',
    position: '50% 50%',
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
export const PORTRAIT_BACKDROPS: Record<StakeholderId, SceneImage> = {
  regulator: { src: scene('regulator_bg.jpg'), alt: '', standIn: false },
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
  /** 720p — the default. */
  src: string;
  captions: string;
  /** 480p rendition, used on slow connections or when the 720p film stalls. */
  low?: string;
  /** Still shown while the film loads. */
  poster?: string;
}

const filmSource = (name: string): FilmSource => ({
  src: film(`${name}.mp4`),
  captions: film(`${name}.vtt`),
  low: film(`${name}_480.mp4`),
  poster: film(`${name}_poster.webp`),
});

/** Final films with WebVTT captions. Set to null to fall back to the storyboard preview. */
export const FILMS: {
  intro: FilmSource | null;
  executiveSetup: FilmSource | null;
  executiveBranch: Record<Opt, FilmSource | null>;
} = {
  intro: filmSource('intro'),
  executiveSetup: filmSource('executive_setup'),
  executiveBranch: {
    A: filmSource('executive_branch_a'),
    B: filmSource('executive_branch_b'),
    C: filmSource('executive_branch_c'),
    D: filmSource('executive_branch_d'),
  },
};

export const filmPath = film;

/**
 * DBA · MIVA Open University logo animation (transparent, cropped to the mark), from media/DBA Logo Intro.mov.
 * Safari needs HEVC with alpha; other browsers use VP9 with alpha. The mark finishes building at `buildMs`.
 */
export const LOGO_STING = {
  webm: film('logo_sting.webm'),
  hevc: film('logo_sting.mov'),
  still: film('logo_sting.png'),
  buildMs: 2600,
};

const speakerMedia = (file: string) => `${base}speakers/${file}`;

export interface SpeakerClip {
  /** Name tag on the card, when the full title is too long for it. */
  label?: string;
  /**
   * A short silent presence beat (about 3–5s), or, when `talking`, the character speaking their line with
   * lip sync (Kling 3.0). A talking clip's soundtrack is the line's recording in public/voice, so the clip
   * plays muted and starts as the voice begins.
   */
  video: string;
  talking?: boolean;
  /** First frame, shown while the clip loads. */
  start: string;
  /** Final frame (looking at the player), shown on return visits and with reduced motion. */
  end: string;
}

/** On-screen presence for characters who question the player, keyed by the speaker name used in content.ts. */
export const SPEAKER_CLIPS: Record<string, SpeakerClip> = {
  'Board Chair': {
    video: speakerMedia('board_chair.mp4'),
    start: speakerMedia('board_chair_start.webp'),
    end: speakerMedia('board_chair_end.webp'),
  },
  'Independent Non-Executive Director': {
    label: 'Independent Director',
    video: speakerMedia('independent_director.mp4'),
    start: speakerMedia('independent_director_start.webp'),
    end: speakerMedia('independent_director_end.webp'),
  },
};

const talkingClip = (name: string): SpeakerClip => ({
  video: speakerMedia(`${name}.mp4`),
  start: speakerMedia(`${name}_start.webp`),
  end: speakerMedia(`${name}_end.webp`),
  talking: true,
});

/** Page 6: each stakeholder speaking their line, started as their recording begins. */
export const STAKEHOLDER_CLIPS: Record<StakeholderId, SpeakerClip> = {
  regulator: talkingClip('regulator_talk'),
  employee: talkingClip('employee_talk'),
  journalist: talkingClip('journalist_talk'),
  family: talkingClip('family_talk'),
};

/** Page 9: the Board member asking each scored question, keyed by the question's shuffle key. */
export const QUESTION_CLIPS: Record<string, SpeakerClip> = {
  'q1-relationship': talkingClip('board_chair_q1_relationship'),
  'q1-compliance': talkingClip('board_chair_q1_compliance'),
  q2: { ...talkingClip('independent_director_q2'), label: 'Independent Director' },
};

/** Page 7: the executive waits for the player's answer. Starts on the corridor film's final frame. */
export const EXECUTIVE_WAIT: SpeakerClip = {
  video: speakerMedia('executive_wait.mp4'),
  start: speakerMedia('executive_wait_start.webp'),
  end: speakerMedia('executive_wait_end.webp'),
};

/** Page 7: each reaction film's final frame, held behind the outcome. */
export const EXECUTIVE_BRANCH_END: Record<Opt, string> = {
  A: film('executive_branch_a_end.webp'),
  B: film('executive_branch_b_end.webp'),
  C: film('executive_branch_c_end.webp'),
  D: film('executive_branch_d_end.webp'),
};

const call = (file: string) => `${base}call/${file}`;

/** Page 4: the emergency Board call. Camera-off profile photos, and the call as one recording. */
export const CALL_AVATARS: Record<CallSpeaker, string> = {
  chair: call('avatar_chair.webp'),
  ined: call('avatar_ined.webp'),
  md: call('avatar_md.webp'),
  okafor: call('avatar_okafor.webp'),
};
export const CALL_AUDIO = { webm: call('crisis_call.webm'), mp3: call('crisis_call.mp3') };

const prop = (file: string) => `${base}props/${file}`;

/** Photographed props for Pages 4 and 8 (media/originals/new 2, cut out and optimised). */
export const PROPS = {
  /** Open leather Board pack, 1562 × 824. Page 8's pack layout matches its paper areas. */
  packOpen: prop('boardpack_open.webp'),
  /** Embossed cover card shown on the pack's right page when no section is open. */
  packCover: prop('boardpack_cover.webp'),
  /** Wax seal pressed onto the pack when the case is locked. */
  lockedSeal: prop('boardpack_locked_seal.webp'),
  /** Letterhead paper for the Page 4 documents when opened. */
  docPaper: prop('doc_paper.webp'),
};

export interface TableSheet {
  src: string;
  /** Top and bottom of the slate header band, as fractions of the image height. */
  band: [number, number];
  /** Where the typeset title starts inside the band, as a fraction of the image width (clear of the logo). */
  titleX: number;
}

/** Page 4 documents on the table: cut-out sheet photographs with the title typeset into the header band. */
export const TABLE_SHEETS: Record<'talkingPoints' | 'briefing', TableSheet> = {
  talkingPoints: { src: prop('table_talking_points.webp'), band: [0.0238, 0.1149], titleX: 0.25 },
  briefing: { src: prop('table_briefing_sheet.webp'), band: [0.019, 0.08], titleX: 0.2 },
};

/** AVIF and WebP `srcset`s for a photo in public/, when media/optimise_media.py has made them. */
export function pictureSources(src: string) {
  const variants = IMAGE_VARIANTS[src.startsWith(base) ? src.slice(base.length) : src];
  if (!variants) return null;
  const srcset = (list: [number, string][]) => list.map(([w, file]) => `${base}${file} ${w}w`).join(', ');
  return { avif: srcset(variants.avif), webp: srcset(variants.webp) };
}

const evidence = (file: string) => `${base}evidence/${file}`;

/** Evidence Desk folders: overhead cut-outs with a soft contact shadow (labels are typeset over them). */
export const FOLDER_ART: Record<EvidenceId, string> = {
  incident: evidence('folder_incident.webp'),
  nearMiss: evidence('folder_nearMiss.webp'),
  payments: evidence('folder_payments.webp'),
  correspondence: evidence('folder_correspondence.webp'),
  news: evidence('folder_news.webp'),
};

/** Photographs printed inside the evidence documents. */
export const DOC_PHOTOS = {
  incident: evidence('doc_incident_photo.jpg'),
  nearMiss: evidence('doc_near_miss_photo.jpg'),
  news: evidence('doc_news_photo.jpg'),
};

/** Paper texture behind the news clipping. */
export const NEWSPRINT = evidence('newsprint.jpg');
