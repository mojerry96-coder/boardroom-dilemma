# Boardroom Dilemma — media

Generated media for the simulation, plus the script that assembles the films.

> The repository contains only this README and `build_films.py`. The raw folders below (`originals/`, `video/`, `audio/`, `preview/`, `build/`) are not committed. The app ships optimised copies in `app/public/`.

| Folder | Contents |
| --- | --- |
| `originals/` | Full-size stills (Seedream 5.0 Pro / Soul 2.0): `p01`–`p10` page scenes, stakeholder portraits, and last frames used as Kling start images |
| `video/` | Raw generated clips — `intro_a`–`intro_h` (Seedance 2.5), `exec_setup1/2` and `exec_branch_a`–`d` (Kling 3.0 pro) |
| `audio/` | ElevenLabs film narration (`vo_b`, `vo_e`, `vo_g`, `vo_h`, `vo_exec`), audio extracted from clips for transcript QA, and `narration/` — every in-app narrator line (page narration, executive bridge lines, endings) |
| `preview/` | Review JPEGs and frame sheets |
| `build/` | Intermediate segments written by `build_films.py` (safe to delete) |

The app uses optimised copies:
- `app/public/scenes/` — scene stills (≤2048px, JPEG q80), portraits (1200px) and pre-blurred portrait backdrops.
- `app/public/films/` — the films and their WebVTT captions, referenced by `FILMS` in `app/src/assets.ts`.
- `app/public/voice/` — narrator lines, mapped to their exact text in `app/src/voice.ts`.

All narration uses one voice: ElevenLabs "Victor Hopo – Narrative African Voice" (`neMPCpWtBwWZhxEC8qpe`), stability 0.55. When a narrator line changes in `content.ts`, re-record it with that voice and replace the file. A line without a recording falls back to the browser's speech voice.

### Character voices (`audio/characters/`)

| Speaker | ElevenLabs voice | Lines |
| --- | --- | --- |
| The Regulator (FISCA) | Ugochukwu – middle-aged Igbo-accented male (`nw6EIXCsQ89uJMjytYb8`) | `char_regulator` |
| Employee Representative | Olaniyi Victor – Lagos accent (`U7wWSnxIJwCjioxt86mk`) | `char_employee` |
| Journalist | Olufunmilola – Nigerian female, Yoruba (`9Dbo4hEvXQ5l7MXGZFQA`) | `char_journalist` |
| Victim's mother | sim-boardroom-mother – designed (`4uMFVSAo1hQ9m0GtVHf0`) | `char_family` |
| Board Chair | Uyi – middle-aged male (`NwBN5lRnglDs8TBVmser`) | `qa_q1_relationship`, `qa_q1_compliance` |
| Independent Non-Executive Director | sim-boardroom-ined – designed (`Fbxk6DvbU2AJfKkTfARU`) | `qa_q2` plus every follow-up variant (`qa_mismatch_*`, `qa_single_*`, `qa_singlezero_*`) |

The Board follow-ups are filled in from the learner's diagnosis, so each reachable wording is recorded separately. Their file names are built from lever codes: `ag`, `st`, `sr`. `app/src/voice.test.ts` fails if any mapped line is missing its file.

## Rebuilding the films

```bash
python3 media/build_films.py all        # or: intro | executive
```

Needs `ffmpeg`/`ffprobe` on `PATH` (for example `~/.local/bin`) and Pillow.

- Every segment is normalised to 1280×720, 24 fps, 48 kHz stereo.
- Native clip audio is ducked under narration.
- Captions are written next to each film.

### Intro (≈80s)

The intro runs through these segments in order:

1. A — cold open
2. B, slowed, with the location slate and narration
3. C
4. D
5. E
6. F's spreadsheet frame with narration
7. F
8. G1 — journalist
9. G2 — FISCA
10. Top-view tabletop still with narration
11. H — Managing Director
12. Role still with narration
13. "YOU HAVE 72 HOURS." title card

### Executive branches

Each branch opens on a hold of `exec_setup2_last.png` while the learner's reply shows as a caption. The reply is never voiced. Chidi's reaction clip follows.

Speech timings are hard-coded in `BRANCH_CUT` from `silencedetect`. Branch D drops its first 1.9s, where the model voiced an unwanted paraphrase of the learner's line. Re-measure these timings if you replace a clip.

## QA done

- Every dialogue clip was transcribed with ElevenLabs speech-to-text, and each transcript matches the script. Branch D matches only after its trim.
- Frame sheets were reviewed for every clip. The regulator emblem is fictional: an eagle was inpainted out of the still.
