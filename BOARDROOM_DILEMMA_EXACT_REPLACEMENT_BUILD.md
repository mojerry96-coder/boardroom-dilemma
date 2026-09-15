# The Boardroom Dilemma — Exact Replacement Build Specification

> **Purpose:** Replace the current simulation build with a faithful implementation of the ten supplied page references while preserving the final interaction logic, content rules, responsive behavior, and cinematic design decisions already approved.
>
> This document is written as a direct implementation specification for Claude / a React developer. Do not treat the supplied images as inspiration only. Use them as **layout references**, then implement the interaction and content logic described here.

---

# 0. Non-negotiable implementation rules

1. **Do not redesign these pages.** Rebuild the supplied references faithfully.
2. **Image/video is always the primary layer.** UI supports the visual; UI must never become the dominant object unless the interaction requires it.
3. **No dashboard feel.** No permanent side navigation, boxed card grids, heavy app chrome, or decorative widgets.
4. **Desktop reference viewport:** `1672 × 941` (approximately 16:9).
5. **Primary title font:** `Afacad`.
6. **Body/UI font:** `Manrope`.
7. **Bright daytime visual language only.** No sunset/night grade.
8. **Perspective must remain physically believable.** Do not stretch/crop reference images in ways that distort tables, faces, windows, or document geometry.
9. **Use real HTML/CSS for all UI text, controls, buttons, fields, sliders, and interaction labels.** Do not bake functioning UI into background images.
10. **Evidence documents are separate interactive assets.** The Evidence Desk background and each evidence item must remain separate layers.
11. **Voice input is optional** and must always transcribe into an editable text field; never auto-submit.
12. **No-scrolling desktop stage.** Pages occupy `100dvh`. Internal panels may scroll only on small screens where the content cannot otherwise fit.
13. **The visual references contain two known placeholders that must NOT be carried into the final build:**
    - The incident location must be **DIN Ogun State Production Facility**, not “Lagos Free Zone / Plant 2”.
    - Page 06 must use a **fictional regulator**, not NUPRC or real political portraits. Use **Federal Industrial Safety & Compliance Authority (FISCA)**.
14. **Page 05 instructional labels must use the source-defined model:**
    - Agency failure
    - Stewardship failure
    - Stakeholder-recognition failure
15. **Page 10 is dynamic.** The supplied image shows the positive visual variant, but the implementation must support all three defined endings.

---

# 1. Reference image mapping

Rename the ten supplied images before adding them to the project.

```txt
/public/reference/page-01-governance-crisis.png
/public/reference/page-02-role.png
/public/reference/page-03-evidence-desk.png
/public/reference/page-04-crisis-decision.png
/public/reference/page-05-accountability.png
/public/reference/page-06-stakeholder-pressure.png
/public/reference/page-07-executive-pressure.png
/public/reference/page-08-board-case.png
/public/reference/page-09-board-qa.png
/public/reference/page-10-outcome.png
```

These images are **reference/mockup plates**, not final composited application screenshots. The production app should reconstruct the text and controls in HTML/CSS while using final generated environment plates and separate assets.

---

# 2. Recommended project structure

```txt
src/
  app/
    App.tsx
    SimulationRouter.tsx
  components/
    SimulationStage.tsx
    StageBackground.tsx
    StageProgress.tsx
    StageTitle.tsx
    ChoiceGroup.tsx
    PillButton.tsx
    GlassPanel.tsx
    InteractiveArtifact.tsx
    ArtifactViewer.tsx
    SliderRow.tsx
    VoiceResponseField.tsx
    StakeholderMemoryStrip.tsx
    BoardPackAssembler.tsx
    VideoBranchPlayer.tsx
    AudioControls.tsx
  pages/
    Page01Intro.tsx
    Page02Role.tsx
    Page03EvidenceDesk.tsx
    Page04CrisisDecision.tsx
    Page05Accountability.tsx
    Page06StakeholderPressure.tsx
    Page07ExecutivePressure.tsx
    Page08BuildBoardCase.tsx
    Page09BoardQA.tsx
    Page10Outcome.tsx
  state/
    simulationStore.ts
    scoring.ts
    persistence.ts
  styles/
    tokens.css
    global.css
    stage.css
    responsive.css
  content/
    evidence.ts
    choices.ts
    boardQuestions.ts
    voiceover.ts
public/
  images/
    environments/
    evidence/
    stakeholders/
    board-pack/
  video/
    intro/
    executive-pressure/
  audio/
    vo/
    ambience/
```

---

# 3. Dependencies

```bash
npm install zustand framer-motion lucide-react clsx
```

Optional for audio helpers:

```bash
npm install howler
```

Do **not** add a large component library. The visual system is custom and should remain lightweight.

---

# 4. Font installation

Use Google Fonts or self-hosted webfont files.

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Afacad:wght@400;500;600;700&family=Manrope:wght@400;500;600;700&display=swap"
  rel="stylesheet"
/>
```

Global font variables:

```css
:root {
  --font-display: "Afacad", system-ui, sans-serif;
  --font-ui: "Manrope", system-ui, sans-serif;
}
```

---

# 5. Exact design tokens

Create `src/styles/tokens.css`.

```css
:root {
  /* Core colors */
  --white: #f8fafc;
  --white-strong: #ffffff;
  --ink: #102139;
  --ink-soft: #506176;
  --ink-muted: #8390a0;

  /* Delta / interaction accents */
  --delta-green: #0f766e;
  --delta-green-dark: #086358;
  --delta-green-soft: #d9ece8;
  --delta-blue: #0f4f82;
  --delta-blue-dark: #0b3f6a;
  --danger: #bd4141;
  --warning: #c49b55;

  /* Glass surfaces */
  --glass-dark: rgba(11, 25, 42, 0.70);
  --glass-dark-strong: rgba(11, 25, 42, 0.82);
  --glass-light: rgba(255, 255, 255, 0.94);
  --glass-light-soft: rgba(255, 255, 255, 0.82);
  --glass-border-light: rgba(255, 255, 255, 0.58);
  --glass-border-dark: rgba(18, 36, 57, 0.16);

  /* Shadow / focus */
  --shadow-soft: 0 12px 42px rgba(5, 19, 33, 0.14);
  --shadow-modal: 0 30px 90px rgba(3, 13, 24, 0.36);
  --artifact-focus: 0 0 0 2px rgba(93, 177, 255, 0.92), 0 8px 34px rgba(57, 151, 240, 0.26);

  /* Radius */
  --radius-sm: 12px;
  --radius-md: 18px;
  --radius-lg: 28px;
  --radius-pill: 999px;

  /* Desktop stage spacing based on 1672 x 941 reference */
  --stage-pad-x: clamp(28px, 3.45vw, 58px);
  --stage-pad-top: clamp(26px, 3.4vh, 34px);
  --stage-pad-bottom: clamp(24px, 3.8vh, 36px);

  /* Type */
  --eyebrow-size: clamp(11px, 0.78vw, 14px);
  --title-size: clamp(48px, 4.45vw, 76px);
  --title-size-large: clamp(52px, 4.8vw, 82px);
  --subtitle-size: clamp(17px, 1.35vw, 24px);
  --body-size: clamp(14px, 1vw, 17px);
  --choice-size: clamp(14px, 1vw, 17px);

  --ease-out: cubic-bezier(.16, 1, .3, 1);
  --ease-standard: cubic-bezier(.2, .75, .3, 1);
}
```

---

# 6. Global stage layout

Create `src/styles/stage.css`.

```css
.sim-stage {
  position: relative;
  width: 100vw;
  height: 100dvh;
  overflow: hidden;
  isolation: isolate;
  background: #0f1824;
  color: var(--white);
  font-family: var(--font-ui);
}

.sim-stage__bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
  z-index: -3;
  user-select: none;
  pointer-events: none;
}

.sim-stage__wash {
  position: absolute;
  inset: 0;
  z-index: -2;
  pointer-events: none;
  background:
    linear-gradient(
      90deg,
      rgba(8, 22, 39, .48) 0%,
      rgba(8, 22, 39, .22) 25%,
      rgba(8, 22, 39, .00) 52%
    );
}

.sim-stage__content {
  position: relative;
  width: 100%;
  height: 100%;
  padding:
    var(--stage-pad-top)
    var(--stage-pad-x)
    var(--stage-pad-bottom);
}

.sim-stage__brand {
  position: absolute;
  top: var(--stage-pad-top);
  left: var(--stage-pad-x);
  font-size: var(--eyebrow-size);
  font-weight: 600;
  line-height: 1;
  letter-spacing: .19em;
  text-transform: uppercase;
  color: rgba(255,255,255,.95);
  white-space: nowrap;
}

.sim-stage__progress {
  position: absolute;
  top: calc(var(--stage-pad-top) - 2px);
  right: var(--stage-pad-x);
  display: flex;
  align-items: center;
  gap: 18px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: .16em;
  color: rgba(255,255,255,.95);
}

.sim-stage__progress::before {
  content: "";
  display: block;
  width: 136px;
  height: 2px;
  background: rgba(255,255,255,.32);
}

.sim-stage__progress-fill {
  position: absolute;
  left: 0;
  top: 50%;
  height: 2px;
  transform: translateY(-50%);
  background: #fff;
}

.stage-title {
  font-family: var(--font-display);
  font-weight: 600;
  letter-spacing: -0.035em;
  line-height: .96;
  color: var(--white);
  text-wrap: balance;
  margin: 0;
}

.stage-subtitle {
  font-family: var(--font-ui);
  font-size: var(--subtitle-size);
  line-height: 1.45;
  color: rgba(255,255,255,.93);
  margin: 0;
}

.stage-eyebrow {
  font-size: var(--eyebrow-size);
  letter-spacing: .26em;
  font-weight: 600;
  text-transform: uppercase;
  color: rgba(255,255,255,.92);
}

.glass-panel--dark {
  border: 1px solid rgba(255,255,255,.35);
  background: var(--glass-dark);
  backdrop-filter: blur(14px) saturate(110%);
  -webkit-backdrop-filter: blur(14px) saturate(110%);
  box-shadow: 0 10px 35px rgba(4, 13, 22, .12);
}

.glass-panel--light {
  border: 1px solid rgba(255,255,255,.72);
  background: var(--glass-light);
  color: var(--ink);
  box-shadow: var(--shadow-soft);
}

.primary-pill {
  min-height: 58px;
  border-radius: var(--radius-pill);
  border: 1px solid rgba(255,255,255,.88);
  padding: 0 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  font-family: var(--font-ui);
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 180ms var(--ease-out), box-shadow 180ms var(--ease-out), background 180ms ease;
}

.primary-pill:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(5, 21, 38, .16);
}

.primary-pill--white {
  background: rgba(255,255,255,.96);
  color: var(--ink);
}

.primary-pill--green {
  background: var(--delta-green);
  color: #fff;
  border-color: rgba(255,255,255,.85);
}

.primary-pill--blue {
  background: var(--delta-blue);
  color: #fff;
  border-color: rgba(255,255,255,.88);
}

.choice-row {
  width: 100%;
  min-height: 54px;
  border-radius: var(--radius-pill);
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 22px;
  cursor: pointer;
  transition: transform 160ms var(--ease-out), box-shadow 160ms ease, background 160ms ease;
}

.choice-row:hover {
  transform: translateY(-1px);
}

.choice-row--dark {
  border: 1px solid rgba(255,255,255,.55);
  background: rgba(10,25,42,.62);
  color: #fff;
}

.choice-row--light {
  border: 1px solid rgba(255,255,255,.92);
  background: rgba(255,255,255,.95);
  color: var(--ink);
}
```

---

# 7. Shared React shell

```tsx
// components/SimulationStage.tsx
import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface SimulationStageProps {
  page: number;
  total?: number;
  backgroundSrc: string;
  backgroundAlt: string;
  children: ReactNode;
  wash?: boolean;
  backgroundPosition?: string;
}

export function SimulationStage({
  page,
  total = 10,
  backgroundSrc,
  backgroundAlt,
  children,
  wash = true,
  backgroundPosition = 'center center',
}: SimulationStageProps) {
  const progress = (page / total) * 100;

  return (
    <motion.main
      className="sim-stage"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: .35 }}
    >
      <img
        className="sim-stage__bg"
        src={backgroundSrc}
        alt={backgroundAlt}
        style={{ objectPosition: backgroundPosition }}
      />
      {wash && <div className="sim-stage__wash" />}

      <div className="sim-stage__content">
        <div className="sim-stage__brand">DELTA INDUSTRIAL NIGERIA LTD.</div>

        <div className="sim-stage__progress" aria-label={`Page ${page} of ${total}`}>
          <span
            className="sim-stage__progress-fill"
            style={{ width: `${progress}%` }}
          />
          <span>{String(page).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
        </div>

        {children}
      </div>
    </motion.main>
  );
}
```

---

# 8. Simulation state

```ts
// state/simulationStore.ts
import { create } from 'zustand';

export type ScoreState = {
  RT: number;
  BC: number;
  EM: number;
  MN: number;
};

export interface SimulationState {
  currentPage: number;
  learnerName: string;

  evidenceReviewed: Record<string, boolean>;
  boardFraming: 'A' | 'B' | 'C' | 'D' | null;
  disclosure: 'A' | 'B' | 'C' | 'D' | null;

  accountabilityRound1: {
    agency: number;
    stewardship: number;
    stakeholderRecognition: number;
  };

  accountabilityRound2: {
    agency: number;
    stewardship: number;
    stakeholderRecognition: number;
  };

  stakeholderResponses: {
    regulator: 'A' | 'B' | 'C' | null;
    employee: 'A' | 'B' | 'C' | null;
    journalist: 'A' | 'B' | 'C' | null;
    family: 'A' | 'B' | 'C' | null;
  };

  executiveResponse: 'A' | 'B' | 'C' | null;
  relationshipCost: boolean;

  boardCase: {
    selectedEvidence: string[];
    ethicalLenses: string[];
    governanceReform: string | null;
    locked: boolean;
  };

  boardQA: {
    q1Choice: 'A' | 'B' | 'C' | 'D' | null;
    q2Choice: 'A' | 'B' | 'C' | 'D' | null;
    freeResponses: string[];
  };

  score: ScoreState;
  ending: 'END-A' | 'END-B' | 'END-C' | null;

  setPage(page: number): void;
  setName(name: string): void;
  markEvidenceReviewed(id: string): void;
  patch(partial: Partial<SimulationState>): void;
}

export const useSimulationStore = create<SimulationState>((set) => ({
  currentPage: 1,
  learnerName: '',
  evidenceReviewed: {},
  boardFraming: null,
  disclosure: null,
  accountabilityRound1: { agency: 34, stewardship: 33, stakeholderRecognition: 33 },
  accountabilityRound2: { agency: 34, stewardship: 33, stakeholderRecognition: 33 },
  stakeholderResponses: { regulator: null, employee: null, journalist: null, family: null },
  executiveResponse: null,
  relationshipCost: false,
  boardCase: { selectedEvidence: [], ethicalLenses: [], governanceReform: null, locked: false },
  boardQA: { q1Choice: null, q2Choice: null, freeResponses: [] },
  score: { RT: 50, BC: 50, EM: 50, MN: 50 },
  ending: null,

  setPage: (page) => set({ currentPage: page }),
  setName: (learnerName) => set({ learnerName }),
  markEvidenceReviewed: (id) =>
    set((state) => ({ evidenceReviewed: { ...state.evidenceReviewed, [id]: true } })),
  patch: (partial) => set(partial),
}));
```

---

# 9. Interactive artifact component

This component is required for Page 03 and reused on Pages 04, 05, 08, and 09.

```tsx
// components/InteractiveArtifact.tsx
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface Props {
  id: string;
  src: string;
  alt: string;
  reviewed?: boolean;
  onOpen: () => void;
  className?: string;
  children?: ReactNode;
}

export function InteractiveArtifact({
  src,
  alt,
  reviewed,
  onOpen,
  className = '',
}: Props) {
  return (
    <motion.button
      className={`interactive-artifact ${className}`}
      type="button"
      onClick={onOpen}
      whileHover={{ y: -7, scale: 1.02 }}
      whileTap={{ scale: .995 }}
      transition={{ duration: .22 }}
    >
      <img src={src} alt={alt} />
      {reviewed && <span className="interactive-artifact__reviewed">Reviewed ✓</span>}
    </motion.button>
  );
}
```

```css
.interactive-artifact {
  position: absolute;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  transform-origin: center bottom;
  filter: drop-shadow(0 10px 24px rgba(7, 17, 28, .18));
}

.interactive-artifact img {
  display: block;
  width: 100%;
  height: auto;
}

.interactive-artifact:hover img,
.interactive-artifact:focus-visible img {
  box-shadow: var(--artifact-focus);
}

.interactive-artifact__reviewed {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(12, 118, 110, .92);
  color: white;
  border-radius: var(--radius-pill);
  padding: 6px 10px;
  font-size: 11px;
  font-weight: 700;
}
```

---

# 10. Artifact viewer

```tsx
// components/ArtifactViewer.tsx
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

export function ArtifactViewer({
  open,
  src,
  alt,
  onClose,
}: {
  open: boolean;
  src?: string;
  alt?: string;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && src && (
        <motion.div
          className="artifact-viewer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="artifact-viewer__card"
            initial={{ y: 32, scale: .94, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 24, scale: .96, opacity: 0 }}
            transition={{ duration: .34, ease: [.16,1,.3,1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="artifact-viewer__close" onClick={onClose} aria-label="Close document">
              <X size={22} />
            </button>
            <img src={src} alt={alt ?? ''} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

```css
.artifact-viewer {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  padding: 5vh 5vw;
  background: rgba(5, 14, 25, .68);
  backdrop-filter: blur(12px);
}

.artifact-viewer__card {
  position: relative;
  width: min(760px, 78vw);
  max-height: 88dvh;
  border-radius: 20px;
  overflow: hidden auto;
  background: #f5f1e8;
  box-shadow: var(--shadow-modal);
}

.artifact-viewer__card img {
  width: 100%;
  display: block;
}

.artifact-viewer__close {
  position: sticky;
  float: right;
  top: 16px;
  right: 16px;
  z-index: 2;
  width: 44px;
  height: 44px;
  margin: 16px;
  border-radius: 50%;
  border: 1px solid rgba(14, 31, 48, .12);
  background: rgba(255,255,255,.92);
  color: var(--ink);
  cursor: pointer;
}
```

---

# 11. Voice answer component

```tsx
// components/VoiceResponseField.tsx
import { Mic, Square } from 'lucide-react';
import { useRef, useState } from 'react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function VoiceResponseField({ value, onChange, placeholder = 'Type your response or speak...' }: Props) {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    chunks.current = [];

    recorder.ondataavailable = (e) => chunks.current.push(e.data);
    recorder.onstop = async () => {
      const blob = new Blob(chunks.current, { type: 'audio/webm' });

      // Replace this adapter call with the chosen server-side transcription provider.
      // IMPORTANT: never expose the transcription API key in the browser.
      const transcript = await window.transcriptionProvider?.transcribe(blob);
      if (transcript) onChange(transcript);

      stream.getTracks().forEach((track) => track.stop());
    };

    recorder.start();
    mediaRecorder.current = recorder;
    setIsRecording(true);
  }

  function stopRecording() {
    mediaRecorder.current?.stop();
    setIsRecording(false);
  }

  return (
    <div className={`voice-field ${isRecording ? 'voice-field--recording' : ''}`}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={1}
      />
      <button
        type="button"
        onClick={isRecording ? stopRecording : startRecording}
        aria-label={isRecording ? 'Stop recording' : 'Answer by voice'}
      >
        {isRecording ? <Square size={20} /> : <Mic size={24} />}
      </button>
    </div>
  );
}
```

```css
.voice-field {
  width: min(730px, 48vw);
  min-height: 70px;
  display: grid;
  grid-template-columns: 1fr 56px;
  align-items: center;
  border-radius: 28px;
  padding: 8px 10px 8px 22px;
  background: rgba(255,255,255,.96);
  color: var(--ink);
  box-shadow: var(--shadow-soft);
}

.voice-field textarea {
  resize: none;
  overflow: hidden;
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--ink);
  font: 500 18px/1.4 var(--font-ui);
}

.voice-field button {
  width: 52px;
  height: 52px;
  border: 0;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #e7ebef;
  color: #657384;
}

.voice-field--recording button {
  background: #f9dede;
  color: #ad3030;
}
```

---

# 12. Page 01 — A Governance Crisis

## Exact visible text

```txt
DELTA INDUSTRIAL NIGERIA LTD.
THE BOARDROOM DILEMMA
A Governance Crisis
A fatal incident. Hidden pressure. Seventy-two hours to advise the Board.
Play Intro
Skip cinematic
01 / 10
```

## Layout coordinates / proportions

Desktop reference:
- brand: top `32–36px`, left `58px`
- eyebrow: left `58px`, top about `98px`
- title: left `58px`, top about `125px`, max width `720px`
- subtitle: left `58px`, top about `205px`
- Play Intro: left `58px`, top about `252px`
- Skip cinematic: left `58px`, top about `328px`
- progress: top-right

## Page CSS

```css
.page01__copy {
  position: absolute;
  left: var(--stage-pad-x);
  top: 10.5vh;
  width: min(760px, 47vw);
}

.page01__copy .stage-title {
  margin-top: 14px;
  font-size: var(--title-size-large);
}

.page01__copy .stage-subtitle {
  margin-top: 14px;
  max-width: 720px;
}

.page01__actions {
  margin-top: 28px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
}

.page01__skip {
  border: 0;
  background: transparent;
  color: rgba(255,255,255,.9);
  text-decoration: underline;
  font: 500 15px var(--font-ui);
  cursor: pointer;
}
```

## Interaction
1. `Play Intro` starts the full-screen 40–45s Seedance edit.
2. While video plays, hide title/buttons and retain only subtle volume/subtitle/skip controls.
3. Intro ends on `YOU HAVE 72 HOURS.`
4. Fade directly into Page 02.
5. `Skip cinematic` goes directly to Page 02.

## Page component

```tsx
export function Page01Intro() {
  const setPage = useSimulationStore((s) => s.setPage);
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <IntroFilm
        src="/video/intro/intro-master.mp4"
        onEnded={() => setPage(2)}
        onSkip={() => setPage(2)}
      />
    );
  }

  return (
    <SimulationStage
      page={1}
      backgroundSrc="/images/environments/page01-intro.jpg"
      backgroundAlt="Delta boardroom during a governance crisis"
    >
      <section className="page01__copy">
        <div className="stage-eyebrow">THE BOARDROOM DILEMMA</div>
        <h1 className="stage-title">A Governance Crisis</h1>
        <p className="stage-subtitle">
          A fatal incident. Hidden pressure. Seventy-two hours to advise the Board.
        </p>
        <div className="page01__actions">
          <button className="primary-pill primary-pill--white" onClick={() => setPlaying(true)}>
            ▶ <span>Play Intro</span>
          </button>
          <button className="page01__skip" onClick={() => setPage(2)}>
            Skip cinematic
          </button>
        </div>
      </section>
    </SimulationStage>
  );
}
```

---

# 13. Page 02 — Your Role in the Crisis

## Exact visible text

```txt
DELTA INDUSTRIAL NIGERIA LTD.
Your Role in the Crisis
You are the Company Secretary and Strategic Advisor to the Board.
72 hours. Investigate. Advise. Defend.
Enter your name
Begin Simulation
02 / 10
```

## Visual layout
This page deliberately differs from Page 01 by moving the primary interaction to the **horizontal center / lower middle** while keeping the title top-left.

```css
.page02__copy {
  position: absolute;
  left: var(--stage-pad-x);
  top: 10vh;
  width: min(800px, 52vw);
}

.page02__copy .stage-title {
  font-size: clamp(48px, 4.1vw, 72px);
}

.page02__copy .stage-subtitle {
  margin-top: 10px;
}

.page02__badge {
  margin-top: 16px;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  min-height: 54px;
  padding: 0 22px;
  border-radius: var(--radius-pill);
  background: rgba(255,255,255,.94);
  color: var(--ink);
  font-weight: 700;
}

.page02__form {
  position: absolute;
  left: 50%;
  top: 51.5%;
  transform: translate(-50%, -50%);
  width: min(510px, 40vw);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

.page02__input {
  width: 100%;
  height: 58px;
  padding: 0 24px;
  border-radius: var(--radius-pill);
  border: 1px solid rgba(255,255,255,.78);
  background: rgba(255,255,255,.96);
  color: var(--ink);
  font: 500 17px var(--font-ui);
  outline: none;
}
```

## Voiceover
Play once after the page settles:

> “You are the Company Secretary and Strategic Advisor to the Board. In seventy-two hours, you must investigate what happened, advise the Board, and defend your judgment.”

## Interaction
- Name field required.
- CTA disabled until trimmed name length is at least 2 characters.
- Do **not** show validation errors until the learner attempts to continue.
- Persist the name immediately.

---

# 14. Page 03 — Evidence Desk

## Exact visible text

```txt
DELTA INDUSTRIAL NIGERIA LTD.
THE BOARDROOM DILEMMA
Evidence Desk
Open what matters. Build your view.
Enter the Evidence Desk
03 / 10
```

## Required separate assets

```txt
/incident-report-thumb.webp
/incident-report-full.webp
/near-miss-thumb.webp
/near-miss-full.webp
/payment-records-thumb.webp
/payment-records-full.webp
/internal-correspondence-thumb.webp
/internal-correspondence-full.webp
/news-clipping-thumb.webp
/news-clipping-full.webp
```

## Important correction
The production versions must use:

```txt
DIN Ogun State Production Facility
```

not the mockup’s Lagos Free Zone wording.

## Desktop placement
The five artifacts should sit in the same approximate arrangement shown in the reference.

```css
.page03__intro {
  position: absolute;
  left: var(--stage-pad-x);
  top: 10.4vh;
  width: min(720px, 44vw);
  z-index: 8;
}

.page03__intro .stage-title {
  margin-top: 12px;
  font-size: clamp(52px, 4.3vw, 74px);
}

.page03__intro .stage-subtitle {
  margin-top: 10px;
}

.page03__intro .primary-pill {
  margin-top: 20px;
}

/* Relative placement intentionally mirrors the reference composition. */
.artifact--incident {
  left: 10.5%;
  top: 42%;
  width: 26%;
}

.artifact--near-miss {
  left: 40.5%;
  top: 42.5%;
  width: 23%;
}

.artifact--payments {
  left: 64.8%;
  top: 42.5%;
  width: 25%;
}

.artifact--correspondence {
  left: 18%;
  top: 62.2%;
  width: 29%;
}

.artifact--news {
  left: 53.2%;
  top: 62%;
  width: 34%;
}
```

## Interaction flow
1. Page opens with hero environment and title.
2. `Enter the Evidence Desk` hides/minimizes intro CTA and enables hover states.
3. Hover/touch-focus raises one document 6–8px and adds a very subtle focus ring.
4. Click/tap expands the document into the ArtifactViewer.
5. Closing the document returns it to **exactly the same table position**.
6. Reviewed documents receive a small reviewed marker.
7. Required logic can enforce the procedural sequence if desired:
   - safety chain
   - financial trail
   - internal email
   - external exposure
8. Once the required set is reviewed, reveal a minimal `Continue` CTA near bottom-right or as a floating pill.

## Voiceover
Initial:

> “Begin with the evidence. Open what matters, and build your view of the crisis.”

After the third document:

> “Patterns matter as much as incidents. What do these records suggest together?”

---

# 15. Page 04 — Crisis Decision

## Exact visible headings

```txt
DELTA INDUSTRIAL NIGERIA LTD.
Crisis Decision
Set the tone before the emergency meeting.
Board Position
Disclosure Approach
Continue
04 / 10
```

## Important note on choice copy
The visual mockup contains placeholder concise options. The functioning build must use the **source-approved decision logic**. Use the following content.

### Board Position

```ts
const boardPositionChoices = [
  {
    id: 'A',
    title: 'Isolated tragedy',
    text: 'Keep the MD\'s line and frame the accident as an isolated tragedy, unrelated to the facilitation payments.'
  },
  {
    id: 'B',
    title: 'One governance failure',
    text: 'Drop the line. Frame safety and payments as two visible symptoms of the same governance failure: cost pressure with light oversight.'
  },
  {
    id: 'C',
    title: 'Forward commitment',
    text: 'Keep the line but reframe it forward-looking: this is not who we intend to remain, paired with a commitment to change.'
  },
  {
    id: 'D',
    title: 'Local execution failure',
    text: 'Frame the crisis primarily as a local-management execution failure, distancing headquarters from the light-documentation correspondence.'
  },
];
```

### Disclosure Approach

```ts
const disclosureChoices = [
  { id: 'A', text: 'Self-report immediately and fully, before the regulator asks.' },
  { id: 'B', text: 'Commission an independent internal investigation first, then report findings with proposed remedial actions.' },
  { id: 'C', text: 'Report only the safety incident; treat the facilitation payments as a separate internal matter.' },
  { id: 'D', text: 'Do not self-report; respond only if and when the regulator formally enquires.' },
];
```

## Visual layout

```css
.page04__copy {
  position: absolute;
  left: var(--stage-pad-x);
  top: 9.8vh;
  width: min(600px, 36vw);
}

.page04__copy .stage-title {
  font-size: clamp(52px, 4.2vw, 72px);
}

.page04__question-stack {
  margin-top: 24px;
  display: grid;
  gap: 16px;
  width: min(530px, 32vw);
}

.page04__panel {
  padding: 18px 20px;
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,.42);
  background: rgba(11,25,42,.62);
  backdrop-filter: blur(12px);
}

.page04__panel h3 {
  margin: 0 0 10px;
  font: 700 21px var(--font-ui);
}

.page04__option {
  display: grid;
  grid-template-columns: 22px 1fr;
  gap: 11px;
  align-items: flex-start;
  padding: 8px 0;
  color: #fff;
}

.page04__option-title {
  display: block;
  font-weight: 700;
  font-size: 14px;
}

.page04__option-text {
  display: block;
  margin-top: 2px;
  font-size: 12.5px;
  line-height: 1.35;
  color: rgba(255,255,255,.78);
}
```

## Interaction sequence
To keep the page more cinematic than a normal form:
1. Draft Board Statement is initially clickable.
2. Learner inspects it.
3. Board Position panel fades in.
4. Learner selects a Board Position.
5. Selection collapses to a small decision chip.
6. Crisis Briefing Note becomes active.
7. Learner inspects it.
8. Disclosure panel fades in.
9. Learner selects a disclosure approach.
10. Continue becomes enabled.

## Voiceover

> “The Board will be judged not only by what happened, but by how it chooses to speak and what it chooses to disclose.”

---

# 16. Page 05 — Accountability Diagnosis

## Exact visible headings

```txt
DELTA INDUSTRIAL NIGERIA LTD.
THE BOARDROOM DILEMMA
Accountability Diagnosis
Weigh where responsibility lies — then reassess when new evidence arrives.
New evidence received — Supervisor statement
Reassess Diagnosis
05 / 10
```

## Final instructional slider labels
Do not use the placeholder mockup labels. Use:

```txt
Agency failure
Stewardship failure
Stakeholder-recognition failure
```

Optional helper subtitles:

```txt
Agency failure — cost/speed incentives and inadequate oversight
Stewardship failure — managers lacked safe channels to challenge pressure
Stakeholder-recognition failure — workers/regulators were not treated as legitimate claim-holders
```

## Slider constraint
The three values must total 100.

Implement either:
- proportional rebalancing of the other two when one slider changes, or
- allow free adjustment and show a live total with submission disabled until total equals 100.

Use the proportional rebalancing approach for smoother UX.

```ts
function rebalance(values: number[], changedIndex: number, nextValue: number) {
  const next = [...values];
  const previous = values[changedIndex];
  const delta = nextValue - previous;
  next[changedIndex] = nextValue;

  const otherIndices = [0,1,2].filter((i) => i !== changedIndex);
  const totalOthers = otherIndices.reduce((sum, i) => sum + values[i], 0);

  for (const i of otherIndices) {
    const share = totalOthers === 0 ? .5 : values[i] / totalOthers;
    next[i] = Math.max(0, Math.round(values[i] - delta * share));
  }

  const diff = 100 - next.reduce((a,b) => a + b, 0);
  next[otherIndices[0]] += diff;
  return next;
}
```

## Layout

```css
.page05__copy {
  position: absolute;
  left: 2.5vw;
  top: 9.7vh;
  width: min(780px, 47vw);
}

.page05__sliders {
  margin-top: 20px;
  width: min(480px, 29vw);
  padding: 16px 18px;
  border-radius: 18px;
  background: rgba(11,25,42,.66);
  border: 1px solid rgba(255,255,255,.34);
  backdrop-filter: blur(13px);
}

.slider-row + .slider-row {
  margin-top: 18px;
}

.slider-row__header {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 8px;
  font-size: 15px;
  font-weight: 600;
}

.slider-row input[type="range"] {
  width: 100%;
  accent-color: #5dafff;
}

.page05__evidence-alert {
  margin-top: 14px;
  width: min(480px, 29vw);
  min-height: 78px;
  padding: 14px 18px;
  border-radius: 16px;
  background: rgba(228,236,244,.83);
  color: var(--ink);
  display: flex;
  align-items: center;
  gap: 14px;
}
```

## Interaction sequence
1. Round 1 sliders are available.
2. Learner confirms Round 1.
3. Sliders visually de-emphasise.
4. Supervisor Statement notification arrives.
5. Voiceover: “A signed supervisor statement has just arrived.”
6. The foreground document gains a subtle focus glow.
7. Learner must open/inspect it.
8. Close returns document to table.
9. Sliders reactivate.
10. `Reassess Diagnosis` applies Round 2.

## Voiceover
Initial:

> “Responsibility may not lie in one place. Weigh the evidence carefully.”

New evidence:

> “A signed supervisor statement has just arrived.”

After close:

> “Does this change where you believe accountability lies?”

---

# 17. Page 06 — Stakeholder Pressure

## Visual correction
The supplied reference uses NUPRC and a recognisable government-style office. **Do not reproduce real agency branding or political portraits.**

Use:

```txt
Federal Industrial Safety & Compliance Authority
FISCA
Senior Director, Industrial Compliance
```

Keep the Nigerian flag if desired, but use a fictional seal.

## Exact visible structure

```txt
DELTA INDUSTRIAL NIGERIA LTD.
THE BOARDROOM DILEMMA
Stakeholder Pressure
One conversation at a time. Every promise will be remembered.
THE REGULATOR
“When will the Board brief us?”
06 / 10
THEY’LL REMEMBER
```

## Layout

```css
.page06__copy {
  position: absolute;
  left: var(--stage-pad-x);
  top: 8.8vh;
  width: min(560px, 34vw);
}

.page06__copy .stage-title {
  font-size: clamp(48px, 4.1vw, 70px);
}

.page06__quote {
  margin-top: 26px;
  border-radius: 22px;
  padding: 18px 22px;
  background: rgba(255,255,255,.94);
  color: var(--ink);
}

.page06__quote-label {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: .24em;
  text-transform: uppercase;
}

.page06__quote-text {
  margin-top: 12px;
  font: 500 29px/1.2 var(--font-display);
}

.page06__choices {
  margin-top: 14px;
  display: grid;
  gap: 10px;
}

.page06__memory {
  position: absolute;
  left: var(--stage-pad-x);
  bottom: 6vh;
  width: min(780px, 48vw);
}

.page06__memory-grid {
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.page06__memory-card {
  aspect-ratio: 1.55;
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  background: #101c2c;
}

.page06__memory-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.page06__memory-card::after {
  content: "";
  position: absolute;
  inset: 38% 0 0;
  background: linear-gradient(transparent, rgba(5,14,24,.92));
}
```

## Stakeholder flow
One active stakeholder at a time.

Recommended sequence:
1. Regulator
2. Employee Representative
3. Journalist
4. Victim’s Family

When a stakeholder is completed:
- its hero state demotes into a memory card
- next stakeholder promotes to the hero position
- response is persisted

## Approved regulator options

```ts
[
  { id: 'A', text: 'Commit to a formal briefing timeline.' },
  { id: 'B', text: 'Explain that the investigation is ongoing.' },
  { id: 'C', text: 'Deflect for now and say you’ll revert.' },
]
```

For the final build, use the finalized stakeholder response text from the content logic file for Employee, Journalist, and Victim’s Family rather than inventing new responses.

## Voiceover

> “The crisis is already moving beyond the room. Each stakeholder wants something different, and each will remember how you respond.”

---

# 18. Page 07 — Executive Pressure

## Exact visible text

```txt
DELTA INDUSTRIAL NIGERIA LTD.
THE BOARDROOM DILEMMA
Executive Pressure
Internal power now pushes back against the truth.
Challenge him directly
Push back carefully
Align for now
Continue Scenario
07 / 10
```

## Layout

```css
.page07__copy {
  position: absolute;
  left: var(--stage-pad-x);
  top: 10.3vh;
  width: min(580px, 35vw);
}

.page07__copy .stage-title {
  font-size: clamp(52px, 4.5vw, 74px);
}

.page07__choice-stack {
  margin-top: 24px;
  display: grid;
  gap: 10px;
  width: min(390px, 24vw);
}

.page07__choice-stack .choice-row {
  min-height: 58px;
  font-weight: 700;
}

.page07__continue {
  margin-top: 20px;
}
```

## Interaction / video behavior
This page is not a static form.

Sequence:
1. Show still reference or immediate common Kling clip.
2. Play common confrontation clip.
3. Hold 500–850ms after the director’s final sentence.
4. Choices fade in.
5. Learner selects one.
6. Hide all UI except progress/audio.
7. Play the matching Kling branch clip.
8. Play one short narrator consequence bridge.
9. Continue to Page 08.

## Branch values

```ts
const executiveChoices = [
  { id: 'A', label: 'Challenge him directly', relationshipCost: true },
  { id: 'B', label: 'Push back carefully', relationshipCost: false },
  { id: 'C', label: 'Align for now', relationshipCost: false },
];
```

## Voiceover
Before common clip:

> “Your investigation has reached the Boardroom. Senior leaders now have something to lose.”

---

# 19. Page 08 — Build the Board Case

## Exact visible text

```txt
DELTA INDUSTRIAL NIGERIA LTD.
Build the Board Case
Assemble only what you can defend.
Selected Evidence
Ethical Lens
Diagnosis
Governance Reform
Lock Board Case
08 / 10
```

## Layout

```css
.page08__copy {
  position: absolute;
  left: var(--stage-pad-x);
  top: 9.8vh;
  width: min(470px, 30vw);
}

.page08__copy .stage-title {
  font-size: clamp(54px, 4.4vw, 76px);
  max-width: 430px;
}

.page08__copy .stage-subtitle {
  margin-top: 12px;
}

.page08__copy .primary-pill {
  margin-top: 20px;
}

.board-pack-hotspot {
  position: absolute;
  left: 29%;
  top: 47%;
  width: 52%;
  height: 43%;
}
```

## Interaction model
The board pack is not a static illustration. Make each section interactive.

```ts
const sections = [
  { id: 'evidence', label: 'Selected Evidence' },
  { id: 'ethics', label: 'Ethical Lens' },
  { id: 'diagnosis', label: 'Diagnosis' },
  { id: 'reform', label: 'Governance Reform' },
];
```

### Selected Evidence
- Show all reviewed evidence from Page 03.
- Learner selects the evidence items to include.
- Selected artifact animates from source tray into the Board Pack.

### Ethical Lens
Use a restrained set of short lens cards.
Suggested lenses:
- Duty / integrity
- Consequences
- Stakeholder recognition
- Ubuntu / relational responsibility

### Diagnosis
Auto-load Round 2 accountability weighting.
Allow the learner to inspect but not silently change it here.

### Governance Reform
Learner chooses one reform package.
Store its target dimension for mismatch logic later.

### Lock Board Case
Enabled only after all four sections are complete.

## Voiceover

> “Now you must turn judgment into a defensible Board case. Include only what you can support.”

When nearly complete:

> “A stronger case is not the loudest one. It is the one you can defend.”

---

# 20. Page 09 — Board Q&A

## Exact visible text

```txt
DELTA INDUSTRIAL NIGERIA LTD.
Board Q&A
Every earlier decision is now under scrutiny.
Type your response or speak...
You can type or use your microphone to answer.
Media response
Disclosure choice
Diagnosis
09 / 10
```

## Layout

```css
.page09__copy {
  position: absolute;
  left: var(--stage-pad-x);
  top: 9.8vh;
  width: min(780px, 47vw);
}

.page09__copy .stage-title {
  font-size: clamp(56px, 4.6vw, 78px);
}

.page09__response-zone {
  position: absolute;
  left: var(--stage-pad-x);
  bottom: 7.2vh;
  width: min(760px, 48vw);
}

.page09__helper {
  margin-top: 10px;
  font-size: 13px;
  color: rgba(255,255,255,.88);
}

.page09__chips {
  margin-top: 18px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.page09__chip {
  min-height: 54px;
  padding: 0 22px;
  border-radius: var(--radius-pill);
  border: 1px solid rgba(255,255,255,.76);
  background: rgba(8,22,39,.62);
  color: white;
  display: inline-flex;
  align-items: center;
  gap: 12px;
}
```

## Board question logic
Use the finalized content logic.

### Question 1 — relationshipCost = true

> “I understand you've already alienated the Commercial Director over this. How do we know you're being fair, not just harsh?”

### Question 1 — relationshipCost = false

> “Compliance says we've met all our legal disclosure obligations. Why do we need a reform programme on top of that?”

### Question 2

> “If we self-report and it turns out we've overreacted, we've damaged the company for nothing. How do you justify that risk?”

## Interaction design
Do not clutter the page with both multiple-choice options and a huge textbox at the same time.

Recommended flow:
1. Board member asks question with optional spoken dialogue.
2. Relevant memory chips appear.
3. Learner may click chips to inspect earlier choices.
4. Learner may type/speak a short answer into the field.
5. After free-response entry, present the 4 authored response choices as a compact bottom-sheet confirmation / reasoning selection.
6. Store both the learner’s own wording and selected authored rationale.
7. Continue to Question 2.

This preserves expressive voice input while retaining deterministic scoring.

## Voice input rule
- mic is optional
- live/returned transcript enters the text field
- transcript remains editable
- learner presses Submit manually
- no auto-submit

---

# 21. Page 10 — Outcome

## Reference positive-state visible text

```txt
DELTA INDUSTRIAL NIGERIA LTD.
Credibility Preserved
The Board accepted a difficult truth — and a stronger path forward.
REGULATORY TRUST
BOARD CREDIBILITY
EMPLOYEE MORALE
MEDIA NARRATIVE
Review Journey
10 / 10
```

The supplied image is the positive visual variant only. Implement all endings.

## Ending resolver

```ts
export function resolveEnding({ RT, BC, EM, MN }: ScoreState) {
  if (RT < 40 || BC < 40) return 'END-C';
  if (RT >= 65 && BC >= 55 && EM >= 55 && MN >= 55) return 'END-A';
  if (MN >= 60 && (RT < 50 || EM < 45)) return 'END-B';
  return 'END-B';
}
```

## Outcome content map

```ts
const endings = {
  'END-A': {
    visualTitle: 'Credibility Preserved',
    canonicalTitle: 'Defensible, but Costly',
    subtitle: 'The Board accepted a difficult truth — and a stronger path forward.',
  },
  'END-B': {
    visualTitle: 'Legitimacy Fragile',
    canonicalTitle: 'Reputation Preserved — Legitimacy Fragile',
    subtitle: 'The organisation avoids immediate collapse, but trust remains uneven.',
  },
  'END-C': {
    visualTitle: 'Credibility Collapses',
    canonicalTitle: 'Collapse of Credibility',
    subtitle: 'Contradictions and delay have turned the Board’s decisions into part of the crisis.',
  },
};
```

## Layout

```css
.page10__copy {
  position: absolute;
  left: var(--stage-pad-x);
  top: 9.5vh;
  width: min(760px, 46vw);
}

.page10__copy .stage-title {
  font-size: clamp(58px, 4.8vw, 82px);
}

.page10__metrics {
  margin-top: 24px;
  display: grid;
  gap: 18px;
  width: min(520px, 33vw);
}

.page10__metric {
  display: grid;
  grid-template-columns: 72px 1fr;
  gap: 14px;
  align-items: center;
}

.page10__metric-icon {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  border: 2px solid rgba(162,218,194,.65);
  color: #d4f2e4;
  background: rgba(38,87,70,.28);
}

.page10__metric h3 {
  margin: 0;
  font: 700 14px/1.2 var(--font-ui);
  letter-spacing: .22em;
}

.page10__metric p {
  margin: 6px 0 0;
  font: 500 14px/1.45 var(--font-ui);
  color: rgba(255,255,255,.88);
}
```

## Interaction
`Review Journey` opens a recap state rather than navigating to a dashboard.

Recommended recap behavior:
- show selected evidence
- show Board framing + disclosure decision
- show Round 2 diagnosis
- show stakeholder responses
- show executive pressure choice
- show Board case
- show Q&A choices

Use a cinematic timeline / artifact recall view, not a table-heavy results screen.

## Voiceover
For positive outcome:

> “The Board accepted a difficult truth — and a stronger path forward. Your decisions shaped what could still be preserved.”

Swap the narration for the relevant ending on END-B / END-C.

---

# 22. Responsive implementation — exact rules

## 22.1 Desktop ≥ 1280px
- Use the supplied screenshots as the composition target.
- No page-level scrolling.
- `object-fit: cover` is allowed only when faces / hero objects remain correctly framed.
- Maintain left overlay width between 30–48vw depending on page.

## 22.2 Tablet 820px–1279px
Use landscape as the primary tablet state.

```css
@media (min-width: 820px) and (max-width: 1279px) {
  :root {
    --stage-pad-x: 28px;
    --stage-pad-top: 26px;
  }

  .stage-title {
    font-size: clamp(44px, 6vw, 64px);
  }

  .sim-stage__progress::before {
    width: 92px;
  }

  .page04__copy,
  .page05__copy,
  .page06__copy,
  .page07__copy,
  .page09__copy {
    width: min(560px, 48vw);
  }

  .choice-row {
    min-height: 52px;
  }
}
```

## 22.3 Mobile portrait ≤ 819px
Do **not** shrink the desktop screenshot into the phone.

The correct portrait architecture is:
1. image fills the entire screen
2. title/brand stays in upper zone
3. interaction becomes a bottom sheet / lower panel
4. background crop remains cinematic
5. controls use minimum 44px touch targets

```css
@media (max-width: 819px) and (orientation: portrait) {
  .sim-stage {
    min-height: 100dvh;
  }

  .sim-stage__content {
    padding: 20px 18px max(18px, env(safe-area-inset-bottom));
  }

  .sim-stage__brand {
    top: 20px;
    left: 18px;
    font-size: 10px;
  }

  .sim-stage__progress {
    top: 18px;
    right: 18px;
    font-size: 10px;
    gap: 8px;
  }

  .sim-stage__progress::before {
    width: 54px;
  }

  .stage-title {
    font-size: clamp(38px, 12vw, 56px);
  }

  .stage-subtitle {
    font-size: 15px;
    line-height: 1.4;
  }

  .page01__copy,
  .page02__copy,
  .page03__intro,
  .page04__copy,
  .page05__copy,
  .page06__copy,
  .page07__copy,
  .page08__copy,
  .page09__copy,
  .page10__copy {
    left: 18px;
    top: 70px;
    width: calc(100vw - 36px);
  }

  /* Any control-heavy page becomes a bottom panel. */
  .page04__question-stack,
  .page05__sliders,
  .page06__choices,
  .page07__choice-stack,
  .page09__response-zone,
  .page10__metrics {
    position: fixed;
    left: 12px;
    right: 12px;
    bottom: max(12px, env(safe-area-inset-bottom));
    width: auto;
    max-height: 48dvh;
    overflow-y: auto;
    scrollbar-width: none;
    border-radius: 24px;
  }

  .page04__question-stack::-webkit-scrollbar,
  .page05__sliders::-webkit-scrollbar,
  .page06__choices::-webkit-scrollbar,
  .page07__choice-stack::-webkit-scrollbar,
  .page09__response-zone::-webkit-scrollbar,
  .page10__metrics::-webkit-scrollbar {
    display: none;
  }

  .voice-field {
    width: 100%;
    min-height: 62px;
  }
}
```

## 22.4 Mobile landscape
On phone rotation, use a left control rail and full-height visual.

```css
@media (max-height: 560px) and (orientation: landscape) {
  .sim-stage__content {
    padding: 16px 20px;
  }

  .sim-stage__brand {
    top: 16px;
    left: 20px;
  }

  .stage-title {
    font-size: clamp(34px, 5vw, 52px);
  }

  .page04__copy,
  .page05__copy,
  .page06__copy,
  .page07__copy,
  .page09__copy,
  .page10__copy {
    top: 58px;
    left: 20px;
    width: min(450px, 42vw);
  }

  .page04__question-stack,
  .page05__sliders,
  .page06__choices,
  .page07__choice-stack,
  .page09__response-zone,
  .page10__metrics {
    max-height: calc(100dvh - 150px);
    overflow-y: auto;
    scrollbar-width: none;
  }
}
```

---

# 23. Motion specification

Use Framer Motion sparingly.

```ts
export const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: .32, ease: [0.16, 1, 0.3, 1] },
};

export const artifactFocus = {
  initial: { opacity: 0, scale: .95, y: 18 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: .97, y: 12 },
  transition: { duration: .34, ease: [0.16, 1, 0.3, 1] },
};
```

Rules:
- no bouncing
- no exaggerated zooming
- no spinning transitions
- no generic page wipes
- use 180–420ms UI transitions
- still images may use 2–4% slow push-in over 8–14 seconds
- interaction animation must explain state changes

---

# 24. Audio / voiceover placement

Keep narrator behavior consistent across the simulation.

Use VO for:
- context
- transition
- consequence
- player responsibility

Do **not** use VO to:
- read button labels
- repeat obvious on-screen text
- narrate what is visibly happening
- talk over emotionally important dialogue

Suggested VO files:

```txt
/audio/vo/page02-role.mp3
/audio/vo/page03-evidence-intro.mp3
/audio/vo/page03-evidence-pattern.mp3
/audio/vo/page04-decision.mp3
/audio/vo/page05-accountability.mp3
/audio/vo/page05-new-evidence.mp3
/audio/vo/page06-stakeholders.mp3
/audio/vo/page07-pressure-intro.mp3
/audio/vo/page07-branch-a.mp3
/audio/vo/page07-branch-b.mp3
/audio/vo/page07-branch-c.mp3
/audio/vo/page08-board-case.mp3
/audio/vo/page09-board-qa.mp3
/audio/vo/page10-end-a.mp3
/audio/vo/page10-end-b.mp3
/audio/vo/page10-end-c.mp3
```

---

# 25. Replace-current-build migration plan

Follow this order exactly.

## Step 1 — freeze existing logic
Before deleting screens, export / copy any existing scoring rules, persistence code, and completed media paths.

## Step 2 — create the new shared stage system
Implement:
- SimulationStage
- progress indicator
- title typography
- buttons
- glass panels
- responsive CSS

Do not rebuild ten independent shells.

## Step 3 — replace all ten page layouts
Build one page at a time using the supplied reference image next to the implementation during development.

Acceptance rule:
- do not proceed to the next page until the current page matches composition and spacing at 1440×810 and 1672×941.

## Step 4 — add responsive states
For every page verify:
- desktop
- tablet landscape
- mobile portrait
- mobile landscape

Do not delay responsive validation until the end.

## Step 5 — wire interaction logic
Add:
- artifact expansion
- slider state
- sequential stakeholder flow
- branching video
- Board Pack assembly
- voice input
- ending resolver

## Step 6 — replace placeholder visuals
Once the layout is approved, swap in final Seedream/Soul/Nano Banana/Kling/Seedance outputs.

## Step 7 — polish
Add:
- ambient sound
- VO
- microtransitions
- preload behavior
- image compression
- reduced-motion support

---

# 26. Final Claude implementation instruction

Paste the block below directly above the source package / codebase when handing this specification to Claude.

```text
Replace the current learner-facing simulation interface with the 10-page Boardroom Dilemma design defined in BOARDROOM_DILEMMA_EXACT_REPLACEMENT_BUILD.md. Do not redesign the visual system. Reconstruct the attached page references with real HTML/CSS/React controls, Afacad headings, Manrope UI/body text, and the exact spacing hierarchy defined in the spec. Preserve the image-first cinematic approach: background environments and people dominate, while UI occupies only the negative space needed for interaction.

Reuse one shared SimulationStage rather than building unrelated page shells. Preserve central state, persistence, scoring and ending logic. Page 03 must use five independent evidence assets with expand/review behavior. Page 04 must reveal decisions through document inspection. Page 05 must implement Round 1 → new evidence → Round 2 using Agency failure, Stewardship failure and Stakeholder-recognition failure. Page 06 must use fictional FISCA regulator branding and sequential stakeholder conversations. Page 07 must use a common Kling confrontation clip followed by three branch videos. Page 08 must assemble the Board case physically from earlier artifacts. Page 09 must support both typed and spoken responses with editable speech transcription and must recall earlier decisions. Page 10 must resolve to one of three endings, not one hardcoded positive ending.

Implement and verify desktop, tablet landscape, mobile portrait, and mobile landscape as you build each page. Do not shrink the desktop page into the phone. On portrait mobile, keep the environment full-screen and move dense interactions into bottom sheets. On phone landscape, use a compact left interaction rail while keeping the cinematic visual full-height.

Do not use NUPRC branding, a real regulator seal, or a real political portrait. Correct all incident-location references to DIN Ogun State Production Facility. Keep the Boardroom itself as a premium Lagos corporate office if desired. Do not add new UI panels, navigation bars, colors, or interaction mechanics that are not defined in the specification.
```

---

# 27. Final acceptance checklist

A page is not considered complete until all are true:

- [ ] visual hierarchy matches supplied reference
- [ ] Afacad used for titles
- [ ] Manrope used for all interface/body text
- [ ] background image remains dominant
- [ ] progress indicator matches top-right style
- [ ] no unnecessary app chrome
- [ ] correct page-specific interaction works
- [ ] no content is clipped at 1366×768
- [ ] page fits 1672×941 reference cleanly
- [ ] tablet landscape tested
- [ ] mobile portrait fills viewport properly
- [ ] mobile landscape reflows correctly
- [ ] touch targets ≥ 44px
- [ ] optional voice input gracefully falls back to typing
- [ ] evidence/docs return to origin after closing
- [ ] state persists across pages
- [ ] no backtracking if the source rule forbids it
- [ ] no real NUPRC / political portrait on Page 06
- [ ] Ogun incident location used in final evidence
- [ ] Page 05 uses source-defined accountability concepts
- [ ] Page 10 is not hardcoded to “Credibility Preserved”

---

**End of replacement build specification.**
