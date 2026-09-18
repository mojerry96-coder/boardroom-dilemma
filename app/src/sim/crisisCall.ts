// Page 4 — the emergency Board call before the Crisis Decision. Voiced with ElevenLabs (media/README.md),
// mixed into one track by media/audio/call/build_call.py, which also writes these timings (seconds).

export type CallSpeaker = 'chair' | 'ined' | 'md' | 'okafor';

export interface CallCue {
  speaker: CallSpeaker;
  start: number;
  end: number;
  text: string;
}

export const CALL_PARTICIPANTS: { id: CallSpeaker; name: string; role: string }[] = [
  { id: 'chair', name: 'Board Chair', role: 'Chair' },
  { id: 'ined', name: 'Independent Director', role: 'Non-Executive' },
  { id: 'md', name: 'Managing Director', role: 'Executive' },
  { id: 'okafor', name: 'Chidi Okafor', role: 'Group Commercial Director' },
];

/** When each participant joins; everyone else is already on the call. */
export const CALL_JOINS: Partial<Record<CallSpeaker, number>> = { md: 0.35 };

export const CALL_DURATION = 78.05;

export const CALL_CUES: CallCue[] = [
  { speaker: 'md', start: 0.9, end: 3.3, text: "Sorry. Sorry, I'm here. Can you hear me?" },
  { speaker: 'chair', start: 3.65, end: 6.52, text: "We can. Let's keep this short. We have an hour." },
  { speaker: 'ined', start: 6.97, end: 13.63, text: "Before we do anything else. Has anyone actually spoken to the family? Not Legal. One of us." },
  { speaker: 'md', start: 14.53, end: 16.96, text: "HR sent them a letter last week, about the..." },
  { speaker: 'ined', start: 16.84, end: 17.51, text: "A letter." },
  { speaker: 'chair', start: 18.31, end: 23.21, text: "Noted. We'll come back to that. It matters." },
  { speaker: 'chair', start: 24.91, end: 26.51, text: "Chidi, you're on mute." },
  { speaker: 'okafor', start: 27.06, end: 37.0, text: "Can you hear me now? Good. Look, with respect, we won't fix a letter in the next hour. The question is what we say in that room. “This is not who we are.” It's true. Ogun was one plant. One bad call." },
  { speaker: 'ined', start: 37.15, end: 43.16, text: "That interlock was bypassed for eight months, Chidi. That isn't a bad call. That's a habit." },
  { speaker: 'okafor', start: 43.66, end: 46.54, text: "To hit a margin target this Board set." },
  { speaker: 'md', start: 48.24, end: 52.56, text: "And the Crestfield payments. Do we really put those in the same sentence as a man's death?" },
  { speaker: 'ined', start: 52.91, end: 56.36, text: "If they came from the same pressure, I don't think we get to choose." },
  { speaker: 'okafor', start: 56.41, end: 57.49, text: "We don't know that yet." },
  { speaker: 'chair', start: 57.99, end: 76.85, text: "Which is exactly why nobody freelances today. The journalist is still calling. FISCA already knows. If we walk in with the wrong story… Company Secretary. You've read the file, and you've heard all of us. How do we frame this? And do we tell FISCA before they ask?" },
];

/** Chidi talks while still muted, before the Chair notices. */
export const CALL_MUTED = { speaker: 'okafor' as CallSpeaker, start: 23.5, end: 25.4 };
