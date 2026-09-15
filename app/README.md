# The Boardroom Dilemma — simulation app

A standalone, responsive React build of the DBA9101 governance simulation.

- Production copy and decisions: `../boardroom_dilemma_replication_package/CONTENT_LOGIC_FINALIZATION.md` (section 19 records the 15 September 2026 corrections)
- Visual and responsive direction: `../boardroom_dilemma_replication_package/BOARDROOM_DILEMMA_MASTER_REPLICATION.md`
- Script and learning logic: the DBA9101 course script (not included in this repository)

## Run

```bash
npm install
npm run dev
```

Other scripts:
- `npm test` covers scoring, formulas and the resolver (including every possible run), and checks that every spoken line has a recording.
- `npm run typecheck`
- `npm run build`

### Useful URL flags (development and QA)

| Flag | Effect |
|---|---|
| `?reset` | Clears the saved session and starts a new run |
| `?store=<name>` | Uses a separate saved session, so QA runs don't overwrite your own |
| `?debug` | Shows hidden state and page jump buttons (never for learners) |
| `?noshuffle` | Keeps option order A–D instead of the per-run shuffle |

## Where things live

| Path | What |
|---|---|
| `src/sim/content.ts` | Every learner-facing line: choices, consequences, feedback, stakeholder lines, endings, film cues |
| `src/sim/documents.ts` | Typeset evidence and Board documents (`**bold**`, `==highlight==`) |
| `src/sim/engine.ts` | Script state changes for each decision |
| `src/sim/accountability.ts` | Sliders, GRI, RCS and the Board Credibility award |
| `src/sim/resolver.ts` | Ending resolver and word-only indicators |
| `src/sim/persistence.ts` | `PersistenceAdapter` and the development `LocalStorageAdapter` |
| `src/sim/store.tsx` | Simulation state; choices are final once made |
| `src/components/` | Stage (desktop/tablet/phone portrait/phone landscape), documents, film player, narration, sliders, voice field |
| `src/pages/` | Page01Intro … Page10Outcome |
| `src/assets.ts` | Scene image and film manifest |
| `src/voice.ts` | Maps each spoken line (narrator and characters) to its recording |
| `public/scenes/` | Scene stills, stakeholder portraits and blurred portrait backdrops |
| `public/films/` | Intro and executive films with WebVTT captions |
| `public/voice/` | Recorded narration and character lines |

## Media

The media is final. How it was generated, the film build script and the voice cast are in `../media/README.md`.

- **Images:** replace a file in `public/scenes/` and adjust its `position` in `src/assets.ts` if the framing changes.
- **Films:** rebuild with `python3 ../media/build_films.py`. The captions come out of that script.
- **Spoken lines:** when a line changes in `content.ts`, re-record it with the same voice and replace its file in `public/voice/`. A line without a recording falls back to browser speech synthesis, and `npm test` lists any line that is missing a file.

## Connecting an LMS or server

Implement `PersistenceAdapter` (`loadSession`, `saveSession`, `clearSession`, `submitResult`) and export it as `persistence` from `src/sim/persistence.ts`. `submitResult` receives the debrief data the script asks for (all choices, allocations, lenses, reform, flags, final state, ending and reflections).

## Voice input

Voice input uses the browser's speech recognition where available; otherwise the microphone is hidden and typing works as normal. Transcripts land in the editable field and nothing submits automatically. A server transcription provider can be added behind the `TranscriptionProvider` interface in `src/components/VoiceField.tsx`. Never put an API key in frontend code.
