import { describe, expect, it } from 'vitest';
import { NARRATION, QA_FOLLOW_UPS, STAKEHOLDERS } from './sim/content';
import { fill, singleCauseLine } from './sim/derive';
import { VOICE_LINES, voiceFor } from './voice';

const recorded = new Set(Object.keys(import.meta.glob('../public/voice/*.mp3')).map((p) => p.split('/').pop()));

describe('recorded voice lines', () => {
  it('has an audio file for every mapped line', () => {
    const missing = VOICE_LINES.map(([, file]) => `${file}.mp3`).filter((file) => !recorded.has(file));
    expect(missing).toEqual([]);
  });

  it('maps each line to one file', () => {
    expect(new Set(VOICE_LINES.map(([text]) => text)).size).toBe(VOICE_LINES.length);
  });

  it('covers narration, stakeholders and the follow-ups the Board page builds', () => {
    for (const text of Object.values(NARRATION)) expect(voiceFor(text)).toBeDefined();
    for (const s of STAKEHOLDERS) expect(voiceFor(s.line)).toBeDefined();
    expect(voiceFor(singleCauseLine({ agency: 100, stewardship: 0, stakeholderRecognition: 0 }))).toBeDefined();
    expect(voiceFor(singleCauseLine({ agency: 60, stewardship: 40, stakeholderRecognition: 0 }))).toBeDefined();
    expect(
      voiceFor(fill(QA_FOLLOW_UPS.mismatch, { primaryFailure: 'Agency failure and Stewardship failure', reformTarget: 'Stakeholder-recognition failure' })),
    ).toBeDefined();
  });
});
