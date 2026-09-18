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
- `app/public/scenes/` — scene stills (≤2048px, JPEG q80), portraits (1200px) and pre-blurred portrait backdrops, each with AVIF and WebP versions (full width and 1280px).
- `app/public/films/` — the films (720p), a 480p rendition and a poster frame for each, and their WebVTT captions, referenced by `FILMS` in `app/src/assets.ts`.
- `app/public/voice/` — narrator and character lines as MP3 and Opus (`.webm`), mapped to their exact text in `app/src/voice.ts`.

### Background score (`audio/music/`)

The source track is `audio/music/monume-motivation-570700.mp3`. The app plays a quiet, seamless loop of it, made with:

```bash
# 1 — trim the lead-in, dip the speech frequencies, master to a −26 LUFS bed
ffmpeg -i audio/music/<track>.mp3 -af "silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.1,equalizer=f=2200:t=q:w=1.4:g=-3,loudnorm=I=-26:TP=-3:LRA=9" -ar 48000 bed.wav
# 2 — crossfade the last 3s over the opening so the loop has no seam (CUT = duration − 3)
ffmpeg -i bed.wav -filter_complex "[0]atrim=0:CUT,asetpts=N/SR/TB[a];[0]atrim=CUT,asetpts=N/SR/TB[b];[b][a]acrossfade=d=3:c1=tri:c2=tri[out]" -map "[out]" loop.wav
# 3 — encode both versions
ffmpeg -i loop.wav -c:a libopus -b:a 80k -vbr on -application audio ../app/public/music/score.webm
ffmpeg -i loop.wav -c:a libmp3lame -b:a 112k ../app/public/music/score.mp3
```

Where the music plays and how loud is `app/src/sound.ts`; `app/README.md` explains the levels and ducking.

`optimise_media.py` makes the AVIF/WebP photos, the tiny scene placeholders (`app/src/scenePlaceholders.ts`), the Opus voice files, and the 480p films and posters, and reports the size saved and visual similarity (SSIM) for each photo. Run it again after replacing any photo, voice line or film, then regenerate `app/src/imageManifest.ts`; `app/README.md` describes how the app picks between versions.

All narration uses one voice: ElevenLabs "Victor Hopo – Narrative African Voice" (`neMPCpWtBwWZhxEC8qpe`), stability 0.55. When a narrator line changes in `content.ts`, re-record it with that voice and replace the file. A line without a recording falls back to the browser's speech voice.

### Character voices (`audio/characters/`)

| Speaker | ElevenLabs voice | Lines |
| --- | --- | --- |
| The Regulator (FISCA) | Ugochukwu – middle-aged Igbo-accented male (`nw6EIXCsQ89uJMjytYb8`) | `char_regulator` |
| Employee Representative | Olaniyi Victor – Lagos accent (`U7wWSnxIJwCjioxt86mk`) | `char_employee` |
| Journalist | Olufunmilola – Nigerian female, Yoruba (`9Dbo4hEvXQ5l7MXGZFQA`) | `char_journalist` |
| Victim's mother | sim-boardroom-mother-v2 – designed older Nigerian woman (`t5l2oSG9hRTK1yVZR86k`), `eleven_v3` | `char_family` |
| Board Chair | Uyi – middle-aged male (`NwBN5lRnglDs8TBVmser`) | `qa_q1_relationship`, `qa_q1_compliance` |
| Independent Non-Executive Director | sim-boardroom-ined – designed (`Fbxk6DvbU2AJfKkTfARU`) | `qa_q2` plus every follow-up variant (`qa_mismatch_*`, `qa_single_*`, `qa_singlezero_*`) |

### Emergency Board call (Page 4, `audio/call/`)

A pre-mixed call in `app/public/call/crisis_call.{webm,mp3}`, with camera-off profile photos `avatar_*.webp`. `audio/call/build_call.py` trims the lines in `audio/call/lines/`, sets the timing (including interruptions and the muted moment), mixes the track and writes the cue timings copied into `app/src/sim/crisisCall.ts`. Recorded with `eleven_v3`, stability 0.5.

| Speaker | ElevenLabs voice |
| --- | --- |
| Board Chair | Uyi (`NwBN5lRnglDs8TBVmser`) |
| Independent Director | sim-boardroom-ined (`Fbxk6DvbU2AJfKkTfARU`) |
| Managing Director | sim-boardroom-md – designed (`FxGawZyHOnLEtD4jik9x`) |
| Chidi Okafor | sim-boardroom-okafor – designed (`pQ8wletSSWpzUEhW9Hkm`) |

The Board follow-ups are filled in from the learner's diagnosis, so each reachable wording is recorded separately. Their file names are built from lever codes: `ag`, `st`, `sr`. `app/src/voice.test.ts` fails if any mapped line is missing its file.

Character lines are used as recorded: never sped up, slowed down or stripped of pauses. `normalise_voice.py` rebuilds `app/public/voice` from the untouched recordings (edge silence trimmed, -16 LUFS, -1.5 dBTP, MP3 160k and Opus 64k). The earlier retimed files are in `audio/voice_backup_20260918/`. Bump `VERSION` in `app/public/sw.js` whenever files are replaced under the same names.

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

Each branch starts on Chidi himself, half a second before he answers (`LEAD_IN`), so his reaction follows the learner's choice at once. The learner's reply is never voiced or replayed.

Speech timings are hard-coded in `BRANCH_CUT` from `silencedetect`. Branch D drops its first 1.9s, where the model voiced an unwanted paraphrase of the learner's line. Re-measure these timings if you replace a clip.

## QA done

- Every dialogue clip was transcribed with ElevenLabs speech-to-text, and each transcript matches the script. Branch D matches only after its trim.
- Frame sheets were reviewed for every clip. The regulator emblem is fictional: an eagle was inpainted out of the still.
