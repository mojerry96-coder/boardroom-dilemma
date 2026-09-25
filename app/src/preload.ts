import { CALL_AUDIO, CALL_AVATARS, DOC_PHOTOS, EXECUTIVE_BRANCH_END, EXECUTIVE_WAIT, FILMS, FOLDER_ART, PORTRAIT_BACKDROPS, PORTRAITS, PROPS, SCENES, QUESTION_CLIPS, SPEAKER_CLIPS, STAKEHOLDER_CLIPS, TABLE_SHEETS } from './assets';
import { warm, warmPicture } from './media';
import { ENDINGS, EXECUTIVE, NARRATION, Q1_COMPLIANCE, Q1_RELATIONSHIP, Q2, STAKEHOLDERS } from './sim/content';
import { BRIEFING, CHAPTERS, GUIDE } from './sim/experience';
import { voiceSourcesFor } from './voice';

// What each page needs, so it can be fetched quietly before the player gets there.

interface PageMedia {
  /** Photos with AVIF/WebP variants (fetched in the format the browser will use). */
  pictures?: string[];
  images?: string[];
  /** Narrated or spoken lines; their recordings are fetched. */
  lines?: string[];
}

const PAGE_MEDIA: Record<number, PageMedia> = {
  1: { pictures: [SCENES.intro.src], images: FILMS.intro?.poster ? [FILMS.intro.poster] : [] },
  2: { pictures: [SCENES.role.src], lines: [CHAPTERS[2].bridge, NARRATION.role, BRIEFING.narrationFacts, BRIEFING.narrationMission] },
  3: {
    pictures: [SCENES.desk.src, DOC_PHOTOS.incident, DOC_PHOTOS.nearMiss, DOC_PHOTOS.news],
    images: Object.values(FOLDER_ART),
    lines: [CHAPTERS[3].bridge, NARRATION.evidenceLoad, GUIDE.evidencePattern],
  },
  4: {
    pictures: [SCENES.crisis.src],
    images: [TABLE_SHEETS.talkingPoints.src, TABLE_SHEETS.briefing.src, PROPS.docPaper, ...Object.values(CALL_AVATARS), CALL_AUDIO.webm],
    lines: [CHAPTERS[4].bridge, NARRATION.crisisLoad],
  },
  5: { pictures: [SCENES.accountability.src], images: [TABLE_SHEETS.talkingPoints.src], lines: [CHAPTERS[5].bridge, NARRATION.accountabilityLoad, GUIDE.newEvidence, GUIDE.reassess] },
  6: {
    pictures: [SCENES.regulator.src, ...Object.values(PORTRAITS).map((p) => p.src), ...Object.values(PORTRAIT_BACKDROPS).map((p) => p.src)],
    images: Object.values(STAKEHOLDER_CLIPS).flatMap((clip) => [clip.start, clip.end]),
    lines: [CHAPTERS[6].bridge, NARRATION.stakeholdersLoad, ...STAKEHOLDERS.map((s) => s.line)],
  },
  7: {
    pictures: [SCENES.executive.src],
    images: [...(FILMS.executiveSetup?.poster ? [FILMS.executiveSetup.poster] : []), EXECUTIVE_WAIT.start, EXECUTIVE_WAIT.end, ...Object.values(EXECUTIVE_BRANCH_END)],
    lines: [CHAPTERS[7].bridge, ...Object.values(EXECUTIVE.bridge)],
  },
  8: {
    pictures: [SCENES.boardCase.src],
    images: [PROPS.packOpen, PROPS.packCover, PROPS.lockedSeal],
    lines: [CHAPTERS[8].bridge, NARRATION.boardCaseLoad, GUIDE.caseReform, ...GUIDE.caseAdded, GUIDE.caseAddedMismatch, GUIDE.caseLocked],
  },
  9: {
    pictures: [SCENES.boardQA.src],
    images: [...Object.values(SPEAKER_CLIPS), ...Object.values(QUESTION_CLIPS)].flatMap((clip) => [clip.start, clip.end]),
    lines: [
      CHAPTERS[9].bridge,
      GUIDE.qaLoad,
      Q1_RELATIONSHIP.question,
      Q1_COMPLIANCE.question,
      Q2.question,
      GUIDE.qaAnswered[1],
      ...[Q1_RELATIONSHIP, Q1_COMPLIANCE, Q2].flatMap((q) => Object.values(q.reaction)),
    ],
  },
  10: { pictures: [SCENES.outcome.src], lines: [CHAPTERS[10].bridge, ...Object.values(ENDINGS).map((e) => e.narration)] },
};

/** Fetch a page's photos, props and recordings in the background. */
export function warmPage(page: number) {
  const media = PAGE_MEDIA[page];
  if (!media) return;
  media.pictures?.forEach(warmPicture);
  const clips = (media.lines ?? []).map((line) => voiceSourcesFor(line)[0]).filter((url): url is string => !!url);
  warm([...(media.images ?? []), ...clips]);
}
