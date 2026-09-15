# The Boardroom Dilemma

An interactive governance simulation for DBA9101. Following a fatal incident at Delta Industrial Nigeria's Ogun State facility, the learner acts as Company Secretary and Strategic Advisor to the Board. They have 72 hours to review evidence, weigh accountability, respond to stakeholders and executive pressure, build a Board case and defend it under questioning. The ending reflects their decisions.

The interface is media-first. Generated stills, films and voice carry each scene, and a compact dock shows the UI only when a decision is needed.

## Run it

```bash
cd app
npm install
npm run dev
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server (Vite) |
| `npm test` | Run the simulation and voice-coverage tests (Vitest) |
| `npm run build` | Type-check and build to `app/dist` |

URL options for QA:
- `?debug` adds a page jumper and a state panel.
- `?store=<name>` keeps a separate saved session.
- `?reset` clears that session once.
- `?noshuffle` shows choices in their original order.

## Repository layout

| Path | Contents |
| --- | --- |
| `app/src/sim/` | Simulation engine: state reducer, scoring, accountability indices, ending resolver, all copy (`content.ts`) |
| `app/src/pages/` | The ten screens |
| `app/src/components/` | Stage and dock UI, film player, narration, documents |
| `app/src/voice.ts` | Maps each spoken line to its recording |
| `app/public/` | Shipped media: `scenes/` (stills), `films/` (MP4 + WebVTT captions), `voice/` (narration and character lines) |
| `media/` | `build_films.py` (assembles the films) and a README covering how the media was made and the voice cast |
| `boardroom_dilemma_replication_package/` | Specification: master replication spec, content and logic finalisation, mobile correction |
| `BOARDROOM_DILEMMA_EXACT_REPLACEMENT_BUILD.md` | Page-by-page build specification |

## Not included

The DBA9101 course script PDF, the layout mockup images and the raw generation files (full-size stills, raw clips, narration takes) are not in this repository. Some links in the specification documents point to those files. The app ships optimised copies of everything it plays, so it runs without them.

## Media

Media was generated with AI:
- Stills: Seedream 5.0 Pro and Soul 2.0.
- Film clips: Seedance 2.5 and Kling 3.0.
- Narration and character voices: ElevenLabs.

All people, organisations and regulators in the scenario are fictional.
