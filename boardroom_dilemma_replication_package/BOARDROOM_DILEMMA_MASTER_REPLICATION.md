# The Boardroom Dilemma — Master Replication Package

## Package purpose
This document is the **single build and production blueprint** for recreating the full simulation experience.
It is written so that Claude, Lovable, or any implementation team can rebuild the simulation carefully without losing the cinematic intent, responsive behavior, or interaction logic.

### Authority order (read first)
When two sources disagree, the higher one wins:

1. **DBA9101 simulation script** (`DBA9101_Y1_S1_SDD_01.pdf`) — learning logic, choices, state changes, feedback, endings.
2. **`CONTENT_LOGIC_FINALIZATION.md`** — exact production copy, implementation decisions and gap closures (section 19 holds the 15 September 2026 corrections).
3. **This document** — production, visual, layout and responsive direction.
4. **Reference mockups** — layout intent only. They contain known factual errors (see section 13).

### Revision — 15 September 2026
This revision applies every correction found in a full cross-check against the DBA9101 script:
- facility corrected to **Ogun State** everywhere; mockup-era "Lagos Free Zone / Plant 2 / 2024" details removed from all prompts;
- intro film dialogue corrected so it no longer contradicts the script (timeline, bypass history, payment period, regulator status);
- Executive Pressure now has **four** responses and **four** branch clips, staged as a private aside;
- stakeholder conversations use **four** options each, in the script order;
- Evidence Desk follows the script's **fixed four-step review order** and uses a **top-view** table;
- accountability sliders use the script's lenses, must total 100%, and show live GRI / RCS;
- Board Case follows the script's four ordered steps with the **five source ethical lenses**;
- Board Q&A uses two multiple-choice questions with source-driven branching;
- every decision now has an in-world consequence and a "why" feedback moment;
- three endings, not one; accessibility requirements from the script added (section 4.5);
- regulator is the fictional **FISCA**; no real insignia or portraits.

### Page ↔ script screen mapping

| Build page | Script screen | Mechanic |
|---|---|---|
| 01 Intro | Screen 0 (context, part 1) | Film / non-mechanic |
| 02 Your Role | Screen 0 (context, part 2) | Non-mechanic |
| 03 Evidence Desk | Screen 1 — Due Diligence Review | Procedural (fixed order) |
| 04 Crisis Decision | Screen 2 — Initial Framing · Screen 3 — Self-Report | Branching |
| 05 Accountability Diagnosis | Screen 4 — Systems model, two rounds | Systems & model |
| 06 Stakeholder Pressure | Screens 5a–5d | Dialogue / role-play |
| 07 Executive Pressure | Screen 6 — Executive Narrative Resistance | Dialogue / role-play |
| 08 Build the Board Case | Screen 7 — Assembling the Board Presentation | Procedural |
| 09 Board Q&A | Screen 8 | Dialogue / role-play |
| 10 Outcome | Ending END-A / END-B / END-C + debrief | Consequence & reflection |

---

## 1. Experience summary

**Project title:** The Boardroom Dilemma — A Governance Crisis  
**Fictional organisation:** Delta Industrial Nigeria Ltd. (DIN), Nigerian subsidiary of a UK-based multinational manufacturing group  
**Simulation premise:** Three weeks after a contract worker died at DIN's **Ogun State production facility** — on a line running with a bypassed safety interlock — the learner enters as the **Company Secretary and Strategic Advisor to the Board**. An internal audit has also flagged facilitation payments through a logistics agent. In 72 hours, the learner must complete a defensible due-diligence review, frame the situation for the Board, decide whether and how DIN self-reports, diagnose accountability, handle four stakeholders, withstand executive pushback, assemble a defensible Board case, and answer for their earlier decisions in a final Board Q&A.

The Board and headquarters environment may be a premium Lagos corporate office. The incident itself happened at the **Ogun State facility**.

### Experience rule
> **Image / video first. Interaction second. Text last.**

### Design rule
> The simulation must feel like a **cinematic decision experience**, not a website or dashboard.

### Interaction rule
> One page = **one dramatic intent** + **one main learner action**.

### Learning rule (from the script)
> Consequence text is never a grade. State variables stay hidden. Choices are final within a run. Every path resolves to a defined ending.

---

## 2. Recommended production model stack

### 2.1 Still-image / environment models

#### A. Seedream 5.0 Pro — primary environment model
Use for hero page backgrounds, boardrooms, offices, table scenes (including the top-view Evidence Desk), city-facing corporate interiors, and outcome environments.

Why: strongest for **spatial realism**, table geometry, room perspective, daylight interiors, object placement, and believable architectural composition.

#### B. Soul 2.0 / Soul ID — recurring character model
Use for recurring board members, the Group Commercial Director, stakeholder portraits, and closer dramatic stills where facial consistency matters.

#### C. Nano Banana Pro — document / object detail model
Use for paper and folder textures, the small site photographs used inside documents, the fictional Delta logo, and the fictional FISCA seal.

Important:
- **All readable document text is typeset in code** (HTML/CSS) so the wording is exact, crisp, accessible to screen readers, and easy to correct after SME review. Generated images supply texture and photographs only.

### 2.2 Video models

#### A. Seedance 2.5 — intro micro-drama video
Use for intro film clips A–H.

#### B. Kling — branching confrontation video
Use for the Executive Pressure scene: **one common setup clip and four branch clips (A–D)**. Start each branch from the setup clip's final frame so continuity holds.

### 2.3 Post / edit tools
Use Claude (or an editor) to cut clips together, control timing, add J-cuts / L-cuts and sound bridges, keep voiceover continuity, and maintain pacing.

### 2.4 Voice, sound and captions
- Narration, dialogue and sound: ElevenLabs (or equivalent).
- **Every video and every narration line ships with captions** (WebVTT for video; on-screen captions for page narration).

---

## 3. Global design system

### 3.1 Typography
- **Titles / main headings:** Afacad
- **Body / UI / labels / options:** Manrope
- **In-world documents:** Manrope for corporate documents; a serif masthead (e.g. Georgia) for the newspaper clipping only

### 3.2 Core palette
- White / off-white text
- Deep slate / charcoal overlays
- Blue-gray glass overlays
- Restrained green accent for Delta brand moments
- Warm daylight wood / marble environment tones

Avoid neon colors, unnecessary gradients, heavy glassmorphism everywhere, overdecorated cards, and bright saturated multi-color UI.

### 3.3 Visual style
- Bright daytime, premium corporate cinematic look
- Nigerian contextual realism (Lagos corporate office for Board scenes; Ogun State industrial facility for plant scenes)
- Believable perspective and scale
- Shallow depth of field only when it helps hierarchy
- Reflections must obey geometry
- All cups, pens, devices, papers and glasses must sit correctly on surfaces
- No real government insignia, real regulator names, or portraits of recognisable public figures

### 3.4 Persistent UI (minimal)
- Page progress indicator (e.g. 03 / 10) with thin progress line
- Audio control (narration on / off)
- **Captions toggle (required)**
- No back navigation — choices are final within a run (script rule)

Avoid permanent sidebars or visible navigation bars for the learner.

### 3.5 Responsive breakpoints

```txt
Desktop / laptop: 1280px and above
Tablet landscape: 820px – 1279px
Mobile portrait or small landscape: 390px – 819px (phone landscape up to 932px wide)
```

### 3.6 Responsive principles

#### Desktop
- Full cinematic composition
- Content sits in a left overlay panel
- Visuals dominate the viewport
- Interaction sits in negative space

#### Tablet
- Keep a single dominant visual
- Reduce side padding; panel slightly narrower
- Preserve image priority
- Avoid dense stacked controls in multiple columns

#### Mobile
- See section 15 (required): portrait = hero + bottom sheet; landscape = left rail + hero
- Keep core CTA visible; one-column interaction
- Internal scroll where necessary, scrollbar hidden
- Free-text and voice fields anchored low in the viewport

### 3.7 Minimal interface rule (REQUIRED — supersedes panel descriptions below)
The generated media is the primary focus. The interface only supports it.

- **One compact dock, never a scrolling panel.** Desktop/tablet: a small card bottom-left. Phone portrait: a short bottom sheet sized to its content. Phone landscape: a left rail. It holds only the current moment.
- **Dialogue lives on the media.** Stakeholder lines, the Commercial Director's challenge and Board questions appear as subtitles over the scene, not as text in the dock.
- **Short choices first.** Options show as short labels; the full script wording appears only for the selected option, then Confirm.
- **Detail on request.** Situation text, lever explanations and "why it matters" feedback sit behind a context button or a "Why it matters" toggle.
- **One task at a time.** Multi-part work (e.g. the Board case) is split into single steps; the evidence checklist is one instruction line with step dots.
- **Chapter titles on the media.** Each page opens with its title shown briefly over the scene; the dock header carries only a small page name.
- **Opt-in reading only.** In-world documents and the Review Journey open in their own viewer.
- **QA check:** at desktop, tablet, phone portrait and phone landscape, no dock state may need scrolling.

| Page | What the dock shows |
|---|---|
| 01 | Title, one line, Play Intro / Skip |
| 02 | Role line, 72-hour badge, name + Begin, "Read your brief" |
| 03 | One instruction line with 4 step dots; blocking message when triggered; outcome |
| 04 | "Open the document" → short-label choices → outcome (twice) |
| 05 | Round prompt, three compact sliders, two readouts, one button; statement moment shows only the statement prompt |
| 06 | Reply choices (stakeholder line on the media); remembered stakeholders as avatars |
| 07 | Reply choices (his line on the media) → outcome |
| 08 | One section task at a time: recommendation → three lens chips → one justification per screen → diagnosis → reform target → reform text → lock |
| 09 | Answer choices (question and context chips on the media) → feedback, optional own words |
| 10 | Ending title, lesson, four word indicators, actions; "What happened" and "Reflect" open as separate dock views |

---

## 4. Global interaction system

### 4.1 Primary verbs
- **Inspect**
- **Choose**
- **Adjust**
- **Respond**
- **Assemble**

### 4.2 Reusable artifact interaction component

#### Component name
`InteractiveArtifact`

#### States
```txt
locked -> resting -> hovered -> focused -> reviewed -> selected -> recalled
```

#### State behavior
- **locked:** visible but not yet available (e.g. later Evidence Desk steps); activating it shows in-world feedback instead of opening
- **resting:** artifact sits naturally in the scene
- **hovered:** subtle lift (2–3%), focus shadow, pointer change
- **focused:** artifact opens as a readable document dialog
- **reviewed:** artifact returns with a small reviewed indicator
- **selected:** artifact is used in a later decision or Board pack
- **recalled:** artifact resurfaces later because another page references it

#### Animation rules
- 180–260ms ease for hover states; 260–420ms ease for open / close
- Subtle background dim on focus
- No bounce or flashy zoom
- Preserve physical origin and return position
- **All motion is removed when the learner's system requests reduced motion**

### 4.3 Voice answer feature
Voice input is optional. Typing is always available.

#### Where to use voice input
- Board Case free-text fields (ethical-lens justifications, diagnosis notes, reform proposal)
- Optional "in your own words" notes during Board Q&A (not scored)
- Post-ending reflection prompts

#### Do not use voice input for
- Multiple-choice decisions, evidence steps, sliders

#### Voice input behavior
- Microphone button inside the field
- Press mic -> recording state with a visible indicator
- Live transcription appears in the editable field
- Learner can edit the transcript
- **Never auto-submit**
- If the browser cannot transcribe speech, hide the microphone and keep the text field fully functional (or use a server transcription provider — never an API key in frontend code)

### 4.4 Decision moment: consequence + why
Every scored choice follows the same pattern:
1. Learner chooses (options are final; order may be randomised per run).
2. The interface shows the **in-world consequence** (what the world does — tone, reactions) — never a grade and never a score.
3. The interface shows the **feedback ("the why")** from the script.
4. Learner continues.

Hidden state variables (RT, BC, EM, MN) are never displayed during the simulation.

### 4.5 Accessibility (from the script)
- Every interaction completes by keyboard alone; sliders use native range inputs with arrow-key steps.
- Screen-reader compatible: document dialogs are real dialogs with focus management; consequences announce through a polite live region.
- Alt text for every avatar, document and environment image.
- **No time-sensitive interaction that cannot be paused.** Films and narration can be paused, replayed and skipped.
- Captions for all video and narration.
- "Motion/camera features are not used": this build uses no device camera or motion sensors, adds no parallax or scroll-driven motion, and removes UI animation under reduced-motion settings. Film footage remains content with full playback controls. *(Interpretation — SME to confirm.)*

---

## 5. Video plan

## 5.1 Video inventory

### VIDEO 01 — Intro micro-drama
- Purpose: hook the learner and establish the governance crisis
- Model: **Seedance 2.5**
- Final edited duration target: **40–45 seconds**

### VIDEO 02 — Executive Pressure branching confrontation
- Purpose: let the learner feel internal pushback
- Model: **Kling**
- Final structure: **common setup clip + 4 branch clips (A–D)**

---

## 5.2 VIDEO 01 — Intro micro-drama script and edit plan

### Final duration target
**42 seconds.**

### Canon the film must respect
- The fatality happened **three weeks** before the Board brief, at the **Ogun State facility**.
- The interlock bypass was a **cost-cutting measure in place for about eight months**, not a one-day maintenance delay.
- Internal audit found **three payments over fourteen months** through one logistics agent.
- The press has **not** connected the fatality to the payments.
- The regulator knows about the fatality but has **not opened an inquiry**. Whether DIN self-reports is the learner's decision on Page 04 — the film must not pre-empt it.

### Clip breakdown

#### Clip A — Boardroom cold open (0:00–0:04)
**Visual goal:** begin inside tension.  
**Shot direction:** medium-wide boardroom shot, subtle push-in, a board member asks a hard question.  
**Line:**
> Board member: "Who knew the interlock had been bypassed?"

**Edit direction:** start abruptly, no fade-in.

#### Clip B — Three weeks earlier / plant establishing (0:04–0:08)
**On-screen caption:** Ogun State facility · Three weeks earlier  
**Voiceover:**
> "At Delta Industrial Nigeria's Ogun State facility, pressure to hit group margin targets had been building for months."

**Edit direction:** hard cut from boardroom to plant. Industrial ambience.

#### Clip C — Operator / supervisor exchange (0:08–0:14)
**Dialogue:**
> Operator: "That interlock has been bypassed for months. We shouldn't be running this line."  
> Supervisor: "I've raised it. The answer is keep running. Just get this batch through."

#### Clip D — Incident (0:14–0:18)
**Visual goal:** disruption, not gore. Alarm, abrupt movement, handheld urgency. No voiceover.

#### Clip E — Management containment (0:18–0:25)
**Dialogue:**
> Plant Manager: "What exactly do you want in the incident report?"  
> Regional Director: "Stick to what's confirmed. Don't put conclusions in writing yet."

**Voiceover bridge:**
> "As the first reports came in, it became clear the accident might not be an isolated safety failure."

#### Clip F — Auditor discovers payments (0:25–0:31)
**Dialogue:**
> Auditor: "I've gone back fourteen months. Three payments, all through the same agent."  
> Finance Manager: "They're expediting fees."  
> Auditor: "Then why is there no record of where the money actually went?"

**Edit direction:** close-ups of the audit extract and tension in faces.

#### Clip G — External pressure (0:31–0:37)
**Dialogue:**
> Journalist (on the phone): "Workers say safety concerns were raised before the fatality. Will DIN comment?"  
> FISCA official: "We're aware of the fatality. We have not opened an inquiry — at this stage."

**Voiceover bridge:**
> "Questions about safety, oversight and financial conduct were beginning to converge."

#### Clip H — Return to boardroom / player handoff (0:37–0:42)
**Dialogue:**
> Managing Director: "The Board meets in seventy-two hours. I need to understand what happened, how far this goes, and what we can defend."

**Narrator handoff:**
> "You will examine the evidence, determine where accountability lies, and advise the Board on what Delta should do next."

**Final title card:**
> YOU HAVE 72 HOURS.

### Intro edit direction
- Keep scenes short; let editing create urgency
- J-cuts and sound bridges, used tastefully
- 2–5% digital push-ins only where needed
- No glitch transitions, no long dissolves
- Slight handheld feel only for pressure moments
- Hold 0.5–1s on important faces after key lines
- Use sound to stitch clips into one short film
- Deliver with burned-in-free captions (WebVTT) and a pause control in the player

### Audio design for Intro
- Industrial ambience in plant scenes; room tone in boardroom
- Restrained tension underscore, low in mix
- Voiceover only as narrative glue; never competes with dialogue

---

## 5.3 VIDEO 02 — Executive Pressure branching scene

### Structure
1. Narration before the clip
2. Common setup clip
3. Held frame + learner choice (four options)
4. Branch continuation clip A / B / C / D
5. Narration consequence bridge, then feedback

### Staging (script: he "pulls you aside")
A private aside in the corridor outside the glass-walled boardroom. Board members are visible but blurred through the glass. The Group Commercial Director (**Chidi Okafor** — production-authored fictional name) speaks low and forcefully, close to the learner's point of view.

### Narration before clip
> "Your investigation has reached the Boardroom. Senior leaders now have something to lose."

### Common setup — dialogue (source-authored)
> Chidi Okafor: "Let's not turn this into a witch hunt. Performance is everything in this market — you slow down, you lose the contract, you lose the jobs. Everyone signed off on the budget. This is not about ethics, it's about being realistic."

### Choice options (source-authored, Screen 6)
- **A.** "You're right, we should focus on the business realities and not get distracted."
- **B.** "I hear the pressure you were under — and I think the Board needs to hear that too, alongside what it cost."
- **C.** "That's exactly the kind of thinking that got a man killed."
- **D.** "Let's discuss this after the Board meeting."

### Branch clips and consequence bridges
| Branch | Clip direction (production-authored) | Narration bridge |
|---|---|---|
| A | Okafor relaxes, claps the learner's shoulder, walks back into the boardroom ahead of them. | "You accepted the performance story. It will be harder to question it in front of the Board." |
| B | Okafor pauses; the tension shifts from hostility to reluctant consideration. | "You heard the pressure without letting it silence the cost. The Board will hear both." |
| C | Silence. Okafor's jaw sets; he holds the learner's gaze, then turns away. | "You named the consequence out loud. The truth is on the record — and so is the relationship cost." |
| D | Okafor nods curtly and leaves; the question visibly hangs in the corridor. | "You avoided the moment. The question hasn't gone away; it has only moved into the boardroom." |

In-world reaction lines and feedback text are in `CONTENT_LOGIC_FINALIZATION.md` section 19.7.

### Edit direction for VIDEO 02
- Keep the confrontation front and center; hold on Okafor long enough for discomfort
- Branch clips must match lighting, camera placement and blocking of the setup clip
- A very short held breath before options appear
- Once a branch is chosen, the interface disappears and the branch clip plays immediately
- Pause control and captions remain available throughout

---

## 6. Still image and asset inventory

## 6.1 Page hero / environment images

### P01 — Intro / landing frame
**Use:** Page 01  
**Model:** Seedream 5.0 Pro + Soul 2.0 for recurring faces  
**Prompt:**
```text
Create a premium photorealistic daytime Nigerian corporate boardroom interior in Lagos, seen from the learner's end of a glossy marble conference table. Wide 16:9, cinematic but physically believable, with the Lagos skyline and a cable-stayed bridge visible through floor-to-ceiling windows. Three board members are present: a commanding middle-aged Nigerian man leaning forward and gesturing, a thoughtful Nigerian woman in a black blazer and pearls, and an older Nigerian man with glasses, all serious and high-level executive in tone. Realistic table perspective, believable object contact, natural daylight. Leave clean negative space on the left for a title block and top right for a progress indicator. Subtle fictional Delta Industrial Nigeria branding on the wall. No readable documents on the table. Avoid exaggerated lens distortion.
```

### P02 — Your Role frame
**Use:** Page 02  
**Model:** Seedream 5.0 Pro + Soul 2.0  
**Prompt:**
```text
Create a clean photorealistic daytime Lagos boardroom scene from the learner perspective with three Nigerian board members seated opposite, serious and expectant. Same room language and brand continuity as the intro boardroom. Leave left-side space for a heading, subtitle, a short brief and a name field. Place a closed leather board pack in the foreground on the table with no readable text. Premium marble table, reflections, water glasses, pen, notebook, subtle Delta logo on the wall, Lagos skyline outside. Tense but inviting.
```

### P03 — Evidence Desk environment
**Use:** Page 03  
**Model:** Seedream 5.0 Pro  
**Camera:** top view, looking straight down at the table.

**Prompt (A: table with folders, the look of the page):**
```text
Create a wide 16:9 photorealistic top view of a polished marble boardroom table in daylight, shot from directly overhead with the camera pointing straight down at 90 degrees, so there is no perspective and every edge of the table runs parallel to the frame. The table fills the whole frame edge to edge; no chairs, walls or windows are visible. Soft daylight falls across the surface from one side, with a gentle window-shaped light patch and soft realistic shadows under every object. Five closed document folders lie flat on the right two-thirds of the table, spaced apart so none overlap, each turned only slightly (2 to 6 degrees) as if placed by hand: a pair of matching folders side by side for the Incident Report and Near-Miss Report, then a folder for Payment Records, a folder for Internal Correspondence, and a folder with the edge of a folded newspaper clipping showing. Each folder is a premium corporate folder with a small Delta Industrial Nigeria logo on the cover and a blank label tab; no readable text anywhere, because labels are added later in code. A few props sit near the table edges without touching the folders: a glass of water seen from above, a coffee cup on a saucer, a fountain pen, and the corner of a leather notebook. Keep the left third of the table clear, plain marble that is calm and slightly darker, so white title text and a button can sit on it. Every object must sit flat on the surface with correct contact shadows and consistent scale. Premium, restrained, physically believable.
```

**Prompt (B: same table without folders, for building the page):**
```text
Using the exact same camera, framing, marble, lighting and props as the previous top-view image, create the table with the five folders removed. Keep the surface where the folders were clean and continuous, with no leftover shadows or marks. This image is the background plate; the folders are placed on top of it as separate clickable assets.
```

**Notes:**
- Build the page from plate B, with each folder as its own asset positioned where it sits in image A. That keeps the lift, open, return and reviewed states working.
- Generate the folder assets from the same straight-down angle and lighting, so they match the plate.
- A top view has no skyline or wall, so Delta branding only appears on the folder logos here.
- For phones, crop plate B and re-space the folder assets rather than scaling the desktop image down.
- Folder order on the table follows the script's review order (safety chain → financial record → correspondence → external exposure).

### P04 — Crisis Decision environment
**Use:** Page 04  
**Model:** Seedream 5.0 Pro + Soul 2.0  
**Prompt:**
```text
Create a photorealistic daytime Lagos boardroom strategy scene with three Nigerian board members in the background, serious and expectant, and a polished foreground table with clear space where two documents will be placed later as separate interactive assets. The composition must allow the left side to contain a decision panel while the foreground document area stays visible. Realistic perspective, daylight, Lagos skyline, subtle Delta branding. Premium, restrained, physically believable. No readable documents in the image.
```

### P05 — Accountability Diagnosis frame
**Use:** Page 05  
**Model:** Seedream 5.0 Pro + Soul 2.0  
**Prompt:**
```text
Create a photorealistic daytime Lagos boardroom scene with three Nigerian executives opposite the learner, reflective and weighing a hard judgement. Leave left-side space for an accountability panel with three sliders, and clear foreground table space where a clipboard statement will be placed later as a separate asset. Daylight, Lagos skyline, marble table, glass of water, coffee cup, subtle Delta branding, all real and well composed. No readable documents in the image.
```

### P06 — Stakeholder Pressure: FISCA regulator office
**Use:** Page 06, Screen 5a hero  
**Model:** Seedream 5.0 Pro + Soul 2.0  
**Prompt:**
```text
Create a premium photorealistic Nigerian public regulator's office in daylight, with a stern senior Nigerian regulator in his late fifties seated behind a desk facing the learner, formal and measured. The wall carries a fictional seal for the "Federal Industrial Safety & Compliance Authority (FISCA)" — an original circular emblem with a gear, a shield and a balance scale, not resembling any real Nigerian government or agency insignia. A Nigerian flag may stand in the corner. No framed portraits of any real person. Shelves of neutral, untitled legal binders. Subtle city-view light from a window. Realistic desk perspective and a clean left area for dialogue choices. Serious and institutional, not theatrical.
```

### P06b — Employee Representative
**Use:** Page 06, Screen 5b hero + memory tile  
**Model:** Soul 2.0  
**Prompt:**
```text
Create a photorealistic portrait of a Nigerian employee representative in his mid-forties at an industrial production facility, wearing a high-visibility safety vest over work clothes, direct and emotionally engaged, determined but controlled. Background: softly blurred plant walkway and equipment. Compose for both a wide hero crop (subject right of center, space on the left) and a square memory-tile crop.
```

### P06c — Journalist
**Use:** Page 06, Screen 5c hero + memory tile  
**Model:** Soul 2.0  
**Prompt:**
```text
Create a photorealistic portrait of a Nigerian business journalist in her thirties holding a reporter's notebook, with a camera bag strap over one shoulder, probing and slightly adversarial, watchful expression. Background: softly blurred newsroom or street outside a corporate office. Compose for a wide hero crop (subject right of center) and a square memory-tile crop.
```

### P06d — Victim's Family
**Use:** Page 06, Screen 5d hero + memory tile  
**Model:** Soul 2.0  
**Prompt:**
```text
Create a dignified photorealistic portrait of an older Nigerian woman, the mother of the deceased contract worker, wearing dark modest clothing and a headwrap, grieving but composed, human and raw without theatrical expression. Seated in a quiet, simple meeting room with soft daylight. Compose for a wide hero crop (subject right of center) and a square memory-tile crop. Respectful, no stereotypes.
```

### P07 — Executive Pressure still reference
**Use:** Page 07 cover frame / fallback still  
**Model:** Seedream 5.0 Pro + Soul 2.0  
**Prompt:**
```text
Create a high-tension photorealistic scene in daylight in the corridor outside a glass-walled Lagos boardroom. A senior Nigerian executive in his fifties — the Group Commercial Director — stands close to the learner's point of view, speaking low and forcefully, one hand raised mid-gesture, defensive and performance-oriented. Through the glass behind him, board members sit blurred around the table. Realistic perspective, body grounding and premium continuity with the boardroom. Leave room on the left for four response options.
```

### P08 — Build the Board Case environment
**Use:** Page 08  
**Model:** Seedream 5.0 Pro  
**Prompt:**
```text
Create a photorealistic daytime Lagos boardroom table scene centered on an open, empty leather zip portfolio seen from the learner perspective, with clear space inside where four section tabs will be placed later as interactive assets: Recommendation, Ethical Reasoning, Accountability Diagnosis, Governance Reform. Large table, Lagos skyline, empty chairs, subtle Delta branding. Keep left-side space for title and CTA. No readable text in the image. Real daylight and credible perspective are essential.
```

### P09 — Board Q&A environment
**Use:** Page 09  
**Model:** Seedream 5.0 Pro + Soul 2.0  
**Prompt:**
```text
Create a photorealistic daytime Lagos boardroom Q and A scene from the learner perspective, with four Nigerian board members opposite the learner. The central female board member gestures with a questioning hand, serious and probing. Other board members watch critically. Keep a wide table foreground for a question card and response options. Maintain room continuity, realistic object placement, Lagos skyline, and subtle Delta branding.
```

### P10 — Outcome environments
**Use:** Page 10  
**Model:** Seedream 5.0 Pro  
Generate one base scene and three lighting variants, one per ending.
```text
Create a calm premium photorealistic daytime Lagos boardroom aftermath scene with empty chairs, a polished marble table, a closed Delta-branded folder and pen in the foreground, and the Lagos skyline beyond the windows. Leave left-side space for the outcome title, summary and four indicators.
Variant END-A: bright, clear late-afternoon light — resolved and reflective.
Variant END-B: flat overcast light — composed but uneasy.
Variant END-C: early-evening light with long shadows and a second, open file on the table — heavy and scrutinised.
```

---

## 6.2 Document, folder and brand asset prompts

> All readable text is typeset in code from `CONTENT_LOGIC_FINALIZATION.md`. Generated images provide paper texture, folder art and the small photographs inside documents only. Dates, references and names must match the content file exactly.

### E01–E05 — Evidence folders (Evidence Desk)
**Model:** Nano Banana Pro  
```text
Create a set of five premium corporate document folders for Delta Industrial Nigeria Ltd., photographed from directly overhead at 90 degrees on a transparent or clean background, matching soft side daylight. Each folder: matte charcoal or deep slate cover, small Delta logo, a blank label tab, subtle wear. One folder has the edge of a folded newspaper clipping showing. No readable text. Provide each folder as a separate image with a soft contact shadow.
```

### E01 — Incident Report photo insert
```text
Create a small documentary-style photograph of an industrial production line at a manufacturing facility in Ogun State, Nigeria, cordoned off with safety tape after an incident, daylight, no people, no gore, no readable signage. For use inside a printed incident report.
```

### E02 — Near-Miss Report photo insert
```text
Create a small documentary-style photograph of a production-line safety interlock panel with a maintenance tag hanging from it, industrial facility, daylight, no readable text. For use inside a printed near-miss report.
```

### E05 — Newspaper clipping texture
```text
Create a realistic newsprint paper texture with a faint fold line and slightly uneven clipped edges, no text. A separate small black-and-white documentary photograph of the exterior gate of a manufacturing facility in Ogun State, Nigeria, daylight, no readable signage.
```

### AD01 — Supervisor Statement on clipboard
```text
Create a black clipboard holding a blank white statement page with a stapled second sheet behind it, lying on a marble table in the same perspective and daylight as the Accountability Diagnosis scene. No readable text; the statement text is typeset in code.
```

### CD01 / CD02 — Draft talking points and Crisis Briefing Note
```text
Create two blank premium printed document sheets lying on a marble boardroom table, one in a leather folio, matching the Crisis Decision scene perspective and daylight. No readable text; content is typeset in code.
```

### BC01 — Evidence File cover
```text
Create a premium evidence file cover design for Delta Industrial Nigeria Ltd. with space for the title "Evidence File — A Governance Crisis", a small photograph of the Ogun State production facility exterior, and a CONFIDENTIAL mark. Title, facility name and date are typeset in code.
```

### BC02 — Ethical lens card set (five source lenses)
```text
Create a set of five minimal premium board annotation cards with a small line icon each and space for a title: 1) Utilitarian — scales weighing many figures; 2) Deontological — an open rulebook; 3) Virtue Ethics — a steady compass; 4) Stakeholder — interlocking circles; 5) Ubuntu / African Communal Ethics — linked hands forming a circle. Clean, branded, consistent with the Delta board pack. Titles typeset in code.
```

### BC03 — Governance reform starter cards (one per failure type)
```text
Create three clean governance reform note cards for a corporate board pack, each with a small icon: 1) Agency failure — a magnifier over a ledger (independent assurance over deviations and payments); 2) Stewardship failure — an upward arrow through a protected channel (protected escalation route); 3) Stakeholder-recognition failure — a figure inside a circle of attention (claim-holder review). Text typeset in code.
```

### BR01 — Delta Industrial Nigeria logo (fictional)
```text
Create a simple fictional corporate logo mark for "Delta Industrial Nigeria": a bold geometric triangle with an inner offset triangle in deep green and slate, flat vector style, with a separate wordmark "DELTA". Must not resemble any existing company's logo.
```

### BR02 — FISCA seal (fictional)
```text
Create an original fictional circular seal for "Federal Industrial Safety & Compliance Authority (FISCA)": a gear ring around a shield holding a balance scale, green and white, flat vector style. Must not resemble the Nigerian coat of arms or any real agency emblem.
```

---

## 7. Page-by-page build specification

Each page includes purpose, assets, layouts, interactions, narration, and a build prompt. Exact copy, scoring and formulas live in `CONTENT_LOGIC_FINALIZATION.md`.

---

## PAGE 01 — Intro micro-drama landing (Screen 0, part 1)

### Purpose
Hook the learner with the crisis and launch the intro film.

### Assets
- P01 hero frame
- VIDEO 01 with captions

### Desktop layout
- Hero frame full-screen; title block left; Play Intro button; Skip intro link; progress 01 / 10 top right

### Tablet adaptation
- Title left, smaller; CTAs stacked tightly

### Mobile adaptation
- Portrait: hero fills the upper area; Play Intro / Skip in the bottom sheet. Landscape: left rail.
- Film plays edge-to-edge

### Interaction
- Play Intro -> full-screen film player with pause, captions and skip
- Skip -> Page 02
- Film end -> title card "YOU HAVE 72 HOURS" -> Page 02

### Narration
- None on the page; the film carries it

### Claude build prompt
```text
Build Page 01 as a cinematic landing page using the intro hero frame. The image dominates the viewport. Delta Industrial Nigeria label top-left, simulation title, subtitle, Play Intro button, Skip intro link, progress 01 / 10. Play Intro opens a full-screen film player with pause, captions and skip. After the film and the "YOU HAVE 72 HOURS" title card, go to Page 02.
```

---

## PAGE 02 — Your Role in the Crisis (Screen 0, part 2)

### Purpose
Place the learner into the role and give them the script's context brief.

### Assets
- P02 environment

### Desktop layout
- Board members visible center/right
- Left panel: role heading, subtitle, 72-hour badge, three short context facts, "Read the full brief" link (opens the Screen 0 context as a document), name field, Begin Simulation

### Mobile adaptation
- Hero upper area; badge, facts, name field and CTA in the sheet

### Interaction
- "Read the full brief" opens the source Screen 0 context text
- Name field is optional-to-fill but Begin activates on any non-empty value
- Learner name persists for Board references and the debrief

### Narration
> "You are the Company Secretary and Strategic Advisor to the Board. In seventy-two hours, you must investigate what happened, advise the Board, and defend your judgement."

### Claude build prompt
```text
Build Page 02 using the Your Role environment. Keep the board members as the visual focus. Left panel: role heading, subtitle, 72-hour badge, three short context facts from Screen 0, a "Read the full brief" document link, a name input and a Begin Simulation button. On mobile, move everything into the bottom sheet without losing image priority.
```

---

## PAGE 03 — Evidence Desk (Screen 1 — Due Diligence Review, procedural)

### Purpose
Make the learner complete a defensible pre-Board review **in the script's fixed order**: internal facts first, external exposure last.

### Assets
- P03 top-view table (plate B) + five folder assets
- Evidence documents E01–E05 typeset in code

### Review steps (source order)
1. **Verify the safety chain of command** — Incident Report **and** Near-Miss Report (both must be opened)
2. **Trace the financial record** — Payment Records (internal audit extract)
3. **Review internal correspondence** — Regional Director's email
4. **Check external exposure** — News Clipping

### Desktop layout
- Title, subtitle and review checklist in the left panel
- Folders on the top-view table, in step order
- Only the next correct step's folders are active; later folders appear greyed

### Tablet adaptation
- Folders keep table positions; larger touch areas; panel compresses vertically

### Mobile adaptation
- Portrait: table crop in the hero with folders in a compact grid; checklist and status in the sheet. Landscape: checklist rail + table
- Opened documents fill most of the screen

### Interaction flow
1. Folders load; step 1 folders active
2. Opening an active folder shows the document; closing marks it reviewed
3. Activating a greyed folder shows the script's blocking message: "You don't have enough internal verification yet to interpret what the press does or doesn't know. Complete your internal review first." — and records a blocked attempt
4. When all four steps are complete, show the consequence and "why" feedback, then Continue
5. `review_order_correct` = true only if the learner completed the review **without any blocked attempt** (section 19.2)

### Narration
On load:
> "Before you advise the Board, verify the internal facts. Open what matters — in the order a defensible review requires."

After step 2:
> "Patterns matter as much as incidents. What do these records suggest together?"

### Claude build prompt
```text
Build Page 03 as a top-view evidence table with five separate folder assets on a background plate. Implement the script's four-step procedural review: only the next correct step is active; greyed steps show the in-world blocking message and record a blocked attempt. Opening a folder shows the typeset document in an accessible dialog; closing marks it reviewed. After step 4, show the consequence and feedback, then Continue. On mobile, keep the same flow with a compact folder grid.
```

---

## PAGE 04 — Crisis Decision (Screens 2 and 3, branching)

### Purpose
Set the Board framing (Screen 2) and the self-report decision (Screen 3).

### Assets
- P04 environment
- CD01 Managing Director's draft talking points (contains the line "This is not who we are as a company.")
- CD02 Crisis Briefing Note

### Desktop layout
- Left panel holds the current step only
- The two documents sit on the table as interactive artifacts
- Decided steps collapse into small decision chips

### Mobile adaptation
- Documents remain visible in the hero as tappable cards; one decision group at a time in the sheet

### Interaction flow
1. Learner opens the draft talking points
2. Framing question appears with the four source options (Screen 2)
3. Learner chooses -> in-world consequence -> feedback -> collapses to a chip
4. Learner opens the Crisis Briefing Note
5. Self-report question appears with the four source options (Screen 3)
6. Learner chooses -> consequence -> feedback -> Continue

### Narration
On load:
> "The Board will be judged not only by what happened, but by how it chooses to speak and what it chooses to disclose."

### Claude build prompt
```text
Build Page 04 so each decision emerges from a tangible document. Opening the MD's draft talking points reveals the four source framing options; opening the Crisis Briefing Note reveals the four source self-report options. Each choice is final and shows an in-world consequence plus the script's feedback. Persist both decisions for Pages 06, 08 and 09.
```

---

## PAGE 05 — Accountability Diagnosis (Screen 4, systems model, two rounds)

### Purpose
Allocate responsibility across the script's three governance-failure lenses, then reassess after new evidence.

### Assets
- P05 environment
- AD01 Supervisor Statement (typeset)

### Levers (source labels)
- **Agency failure**
- **Stewardship failure**
- **Stakeholder-recognition failure**

Each shows a one-line plain-language subtitle. Allocations **must total 100%**.

### Desktop layout
- Left panel: three linked sliders, live **Governance Risk Index (GRI)** and **Reform Credibility Score (RCS)** meters, action button
- Statement clipboard on the table once it arrives

### Mobile adaptation
- Sliders and meters in the sheet; new-evidence card above the CTA; statement opens full-screen

### Interaction flow
1. Round 1: learner allocates; GRI and RCS update live
2. Setting any lever to 0% or 100% shows the script's warning (does not block)
3. Learner locks Round 1
4. Interruption: "New evidence received — signed supervisor statement"
5. Learner must open the statement
6. Round 2: sliders start at the Round 1 allocation; learner re-allocates; GRI / RCS recalculate
7. Submit shows the delta feedback ("Your Agency-failure weighting moved from X% to Y% …" or the unchanged-diagnosis warning) and the script's feedback
8. Board Credibility is awarded +5 to +15 per section 19.3

### Narration
First load:
> "Responsibility may not lie in one place. Weigh the evidence carefully."

New evidence:
> "A signed supervisor statement has just arrived."

After closing the statement:
> "Does this change where you believe accountability lies?"

### Claude build prompt
```text
Build Page 05 around the script's two-round systems model. Three linked sliders (Agency, Stewardship, Stakeholder-recognition failure) always total 100% and update a live GRI and RCS. Warn at 0% or 100%. After Round 1 is locked, interrupt with the supervisor statement, require it to be opened, then run Round 2 from the Round 1 values and show the delta feedback. Keep the boardroom image dominant.
```

---

## PAGE 06 — Stakeholder Pressure (Screens 5a–5d)

### Purpose
Respond to four stakeholders, one at a time, who remember what was said.

### Assets
- P06 FISCA regulator office (5a)
- P06b employee representative (5b), P06c journalist (5c), P06d victim's family (5d)

### Order (source)
1. Regulator — Senior Director, Industrial Compliance, FISCA
2. Employee representative
3. Journalist — The Ogun Business Review
4. Mother of the deceased worker

### Desktop layout
- Active stakeholder is the hero
- Left panel: stakeholder label, their line, **four** response options
- Memory strip of stakeholders already answered

### Mobile adaptation
- Hero stays upper; line and four options stack in the sheet; memory strip as small chips

### Interaction flow
1. Stakeholder speaks; four options appear
2. Learner chooses -> in-world reaction -> the sub-screen's feedback
3. Stakeholder moves into the memory strip; next stakeholder becomes the hero
4. After 5d, Continue

Dependencies: 5a reads the Screen 3 decision and `review_order_correct`; 5c reads the Screen 2 framing.

### Narration
Opening:
> "The crisis is already moving beyond the room. Each stakeholder wants something different, and each will remember how you respond."

### Claude build prompt
```text
Build Page 06 as a sequential stakeholder conversation system. One stakeholder dominates at a time with their line and four source options. After each choice, show the in-world reaction and feedback, archive the stakeholder into a memory strip, and promote the next. Apply the source scoring, including the Screen 3 consistency rule for the regulator and the Screen 2 consistency rule for the journalist.
```

---

## PAGE 07 — Executive Pressure (Screen 6)

### Purpose
Feel internal power resisting the accountability conversation.

### Assets
- VIDEO 02 setup clip + branch clips A–D
- P07 still

### Desktop layout
- Before choice: still / held frame, title and four options in the left panel
- During clips: interface hidden, captions shown

### Mobile adaptation
- Video in the hero; four options stack in the sheet and disappear when the branch plays

### Interaction flow
1. Narration, then setup clip (pausable)
2. Held frame; four options
3. Learner chooses; matching branch clip plays immediately
4. Narration bridge, in-world reaction and feedback
5. Option C sets `relationship_cost = true`
6. Continue to Page 08

### Claude build prompt
```text
Build Page 07 as a branching video confrontation with the Group Commercial Director. Play the setup clip, hold, present the four source responses, then hide the interface and play the matching branch clip. Show the narration bridge, reaction and feedback, persist the choice and the relationship_cost flag, and keep pause and captions available.
```

---

## PAGE 08 — Build the Board Case (Screen 7, procedural)

### Purpose
Assemble a defensible Board presentation in the script's order.

### Assets
- P08 environment; BC01–BC03

### Steps (source)
1. **Recommended course of action** — auto-populated from the Screen 3 decision; editable
2. **Ethical reasoning** — select exactly **three of five** lenses (Utilitarian, Deontological, Virtue Ethics, Stakeholder, Ubuntu / African Communal Ethics) and write a justification for each that links to the learner's own Screen 2–3 choices (shown as reference chips)
3. **Accountability diagnosis** — auto-populated from the Round 2 allocation; optional notes
4. **One governance reform** — choose the failure type it targets, then write it (starter cards available). If it does not target the highest-weighted Round 2 failure, show the script's flag (not a block)

Procedural rule: Step 2 must be complete before Step 4. Attempting to skip shows: "A recommendation without stated ethical reasoning is not defensible in this room – go back and complete Step 2."

### Desktop layout
- Board pack as tactile center/right hero with four section tabs that fill as steps complete
- Title and Lock Board Case CTA on the left

### Mobile adaptation
- Board pack sections become stacked touch rows in the sheet; one step open at a time

### Narration
On load:
> "Now you must turn judgement into a defensible Board case. Include only what you can support."

When Step 4 opens:
> "A stronger case is not the loudest one. It is the one you can defend."

### Claude build prompt
```text
Build Page 08 as a physical-feeling board pack with the script's four ordered steps: editable auto-populated recommendation, three-of-five ethical lenses with written justifications, auto-populated Round 2 diagnosis with notes, and one targeted governance reform with the mismatch flag. Enforce Step 2 before Step 4 with the source message. Voice input is optional on free-text fields and never auto-submits.
```

---

## PAGE 09 — Board Q&A (Screen 8)

### Purpose
Answer for earlier decisions under Board scrutiny.

### Assets
- P09 environment

### Desktop layout
- Board members dominate; question card lower-left with speaker label, question, context chips and four options
- Optional "in your own words" note with microphone after answering (not scored)

### Mobile adaptation
- Board in the hero; question, chips and options in the sheet; microphone enlarged for touch

### Interaction flow
1. Question 1: if `relationship_cost = true`, the "alienated Chidi Okafor" question; otherwise the compliance question
2. Context chips name the learner's relevant earlier choices
3. Learner chooses -> feedback
4. Non-scored follow-ups if applicable: reform mismatch line; single-cause diagnosis line
5. Question 2 (always) -> feedback
6. Continue to the ending

### Narration
Before the first question:
> "Every earlier decision now comes under scrutiny."

### Claude build prompt
```text
Build Page 09 as an image-led Board interrogation. Show one question at a time with context chips tied to the learner's earlier choices and four dialogue options. Branch Question 1 on relationship_cost, insert the non-scored mismatch and single-cause follow-ups before Question 2, and apply the finalized scoring. Offer an optional, unscored voice-or-typed note.
```

---

## PAGE 10 — Outcome (Ending + debrief)

### Purpose
Deliver consequence and reflective closure.

### Assets
- P10 environment variant for the ending reached

### Desktop layout
- Ending title, outcome copy and closing lesson in the left panel
- Four quiet indicators (Regulatory Trust, Board Credibility, Employee Morale, Media Narrative) shown as **words, never numbers**
- Reflection prompt (optional, not scored) with typing or voice
- Review Journey and Restart

### Mobile adaptation
- Title and summary upper sheet; indicators stack; Review Journey reachable

### Interaction flow
1. Resolve the ending (section 9 of the content file)
2. Show the ending copy (variant opening if reached through the fallback rule)
3. Learner may answer the reflection prompts
4. Review Journey lists every decision with its consequence and feedback
5. Result is submitted through the persistence adapter

### Narration
Per ending — see content file section 10.

### Claude build prompt
```text
Build Page 10 as a restrained outcome screen for END-A, END-B or END-C. Show the title, outcome copy, closing lesson and four word-only indicators, the optional reflection prompts with voice support, a Review Journey of all decisions, and a Restart. Submit the result through the persistence adapter.
```

---

## 8. Mobile and tablet replication references

This package includes:
- `references/mobile/boardroom_dilemma_mobile_reference_grid.png`
- `references/tablet/boardroom_dilemma_tablet_reference_grid.png`

These are **layout intent references**, not pixel-perfect final mocks, and they carry the same factual errors as the desktop mockups (section 13).

### Mobile replication rules
- Single column layout only
- Image remains dominant
- Controls move to bottom sheets (portrait) or a left rail (landscape)
- Expanded artifacts fill most of the screen
- Touch targets at least 44px tall
- CTA buttons easy to reach in the lower zone

### Tablet replication rules
- Preserve wider image composition
- Allow side-aligned content when space supports it
- Never shrink text too much just to preserve desktop composition
- Prefer a dominant image plus one main interaction panel

---

## 9. Implementation structure (as built)

```txt
app/
  src/
    sim/
      types.ts            state and content types
      content.ts          all learner-facing copy
      documents.ts        typeset evidence and board documents
      engine.ts           scoring for every decision (pure functions)
      accountability.ts   GRI, RCS and Board Credibility award
      resolver.ts         ending resolver
      persistence.ts      PersistenceAdapter + LocalStorageAdapter
      store.tsx           simulation state provider
    components/
      Stage               responsive cinematic stage (desktop / tablet / sheet / rail)
      TopBar              progress, audio, captions
      Narration           captions + narration playback
      ChoiceList          decision options
      DecisionOutcome     consequence + feedback moment
      DocumentDialog      accessible document viewer
      Paper               typeset document renderer
      Folder              top-view evidence folder
      FilmPlayer          film / storyboard player with pause, captions, skip
      AllocationSliders   linked 100% sliders
      Meter               GRI / RCS meters
      VoiceField          text field with optional speech input
    pages/
      Page01Intro … Page10Outcome
  public/
    standins/             temporary scene images (replace with final assets)
```

---

## 10. Technical interaction notes

The authoritative state model, formulas and resolver are in `CONTENT_LOGIC_FINALIZATION.md`:
- state to persist — section 13
- evidence order flag — section 19.2
- GRI, RCS and Board Credibility award — section 19.3
- reform targeting and mismatch — section 19.4
- ending resolver — section 9

---

## 11. Quality control checklist

Before approving any still asset, verify:
- Horizon and camera height feel real (top view: truly straight down)
- Table geometry is believable
- Cups and glasses rest flat
- People are grounded in chairs / floor
- Hands contact surfaces properly
- Foreground and background scale are consistent
- Skyline perspective matches the room
- Lighting direction is coherent
- No readable baked-in text; no real insignia, agency names or recognisable portraits
- Ogun State facility, not Lagos Free Zone / Plant 2

Before approving any page build, verify:
- Image or video is still the hero
- There is only one primary action
- Every decision shows consequence + feedback, never a grade or score
- Mobile interaction remains easy to tap
- Keyboard-only completion works; screen reader announces consequences
- Narration has captions; films can be paused
- State from earlier pages persists meaningfully

Before approving the videos, verify:
- Dialogue matches section 5 and the script canon
- Voiceover is narrative glue, not over-explanation
- Edits create urgency, not chaos
- Four Executive Pressure branches match the setup clip's continuity
- Captions are complete and timed

---

## 12. Final build order

1. Build the shared React shell and responsive stage system
2. Build central simulation state and the persistence adapter
3. Use current mockups as temporary visual stand-ins (baked-in text, outdated facts and real-government imagery blurred out)
4. Implement all interactions and branching logic
5. Validate desktop
6. Validate tablet landscape
7. Validate mobile portrait
8. Validate mobile landscape / rotation
9. Only after compositions are stable, generate final Seedream / Soul / Nano Banana assets
10. Generate Seedance intro clips
11. Generate Kling Executive Pressure setup and four branch clips
12. Replace temporary assets
13. Final continuity and accessibility QA
14. SME sign-off

---

## 13. Reference contents included in this package

### Desktop page references
- references/desktop/01_intro.png … references/desktop/10_outcome.png

### Responsive reference grids and per-page phone references
- references/mobile/portrait/01_intro_portrait.png … 10_outcome_portrait.png
- references/mobile/landscape/01_intro_landscape.png … 10_outcome_landscape.png
- references/mobile/boardroom_dilemma_mobile_portrait_reference_grid.png
- references/mobile/boardroom_dilemma_mobile_landscape_reference_grid.png
- references/tablet/boardroom_dilemma_tablet_reference_grid.png

### Known errors in the mockups (do not copy)
- "Lagos Free Zone – Plant 2", "Thermal Oil Unit", 2024 dates and "The Daily Chronicle" headline
- Simplified slider labels (Individual / Management / Systemic)
- Three Executive Pressure options; generic Crisis Decision and stakeholder options
- Ethical lens note "People / Integrity / Long-term impact"
- A real regulator (NUPRC), the Nigerian coat of arms, and a portrait resembling a real public figure
- A single "Credibility Preserved" outcome with all-positive indicators
- Free-text Board Q&A (the script uses multiple choice)
- Evidence Desk shown in perspective (now a top view)

---

## 14. One-paragraph master build instruction for Claude

```text
Build The Boardroom Dilemma as a premium cinematic boardroom simulation for Delta Industrial Nigeria Ltd., faithful to the DBA9101 script. Keep the experience image-first and minimally interfaced. Use the page references as layout intent only, Afacad for headings and Manrope for body text, and support desktop, tablet, phone portrait and phone landscape. Implement the script's mechanics in order: a fixed-order evidence review on a top-view table, framing and self-report decisions, a two-round 100% accountability model with live GRI and RCS, four stakeholder conversations, a four-branch executive confrontation, a four-step Board case with three of five ethical lenses and a targeted reform, a two-question Board Q&A, and three endings with an optional reflection. Every decision shows an in-world consequence and the script's feedback, never a grade; state variables stay hidden; choices are final. Typeset all document text in code, keep everything keyboard- and screen-reader-accessible with captions and pausable media, and use Seedance 2.5, Kling, Seedream 5.0 Pro, Soul 2.0 and Nano Banana Pro only after layouts are proven.
```

---

## 15. Mobile Responsive Correction — REQUIRED

The original mobile reference that simply contained the desktop 16:9 page inside a portrait phone frame is deprecated. The mobile implementation must fill the device viewport and recompose the interface.

### 15.1 Portrait composition
- The hero image/video fills the upper 55–62% of the viewport with `object-fit: cover`.
- A bottom interaction sheet occupies the lower 38–45%.
- The sheet contains only the current interaction.
- Titles/progress may overlay the hero, but controls must not cover faces or critical evidence.
- Evidence expands nearly full-screen when opened.
- No black letterboxing.

### 15.2 Landscape rotation
- Rotation is supported; do not lock orientation.
- In phone landscape, move interactions into a left rail approximately 36–42% wide.
- The image/video fills the remaining width and full height.
- Keep touch targets at least 44px.
- Use safe-area padding for notches and browser chrome.

### 15.3 Required responsive CSS

```css
:root {
  --safe-top: env(safe-area-inset-top, 0px);
  --safe-right: env(safe-area-inset-right, 0px);
  --safe-bottom: env(safe-area-inset-bottom, 0px);
  --safe-left: env(safe-area-inset-left, 0px);
}
.mobile-stage {
  position: relative; width: 100%; min-height: 100svh; height: 100dvh;
  overflow: hidden; background: #0f141c; isolation: isolate;
}
.mobile-stage__hero {
  position: absolute; inset: 0; width: 100%; height: 100%;
  object-fit: cover; object-position: var(--hero-position, 60% 42%); z-index: 0;
}
.mobile-stage__scrim {
  position: absolute; inset: 0; z-index: 1; pointer-events: none;
  background: linear-gradient(180deg,rgba(7,12,18,.60) 0%,rgba(7,12,18,.08) 30%,rgba(7,12,18,.08) 52%,rgba(7,12,18,.90) 80%,rgba(7,12,18,.98) 100%);
}
.mobile-stage__header {
  position: absolute; top: calc(14px + var(--safe-top));
  left: calc(16px + var(--safe-left)); right: calc(16px + var(--safe-right)); z-index: 4;
}
.mobile-stage__sheet {
  position: absolute; left: 0; right: 0; bottom: 0; z-index: 5; max-height: 44dvh;
  padding: 20px calc(18px + var(--safe-right)) calc(18px + var(--safe-bottom)) calc(18px + var(--safe-left));
  border-radius: 26px 26px 0 0; background: rgba(15,20,28,.96); backdrop-filter: blur(16px);
  overflow-y: auto; scrollbar-width: none;
}
.mobile-stage__sheet::-webkit-scrollbar { display: none; }
@media (max-width: 819px) and (orientation: portrait) {
  .mobile-stage__hero { height: 62dvh; }
  .mobile-stage__sheet { min-height: 36dvh; }
}
@media (max-width: 932px) and (orientation: landscape) {
  .mobile-stage { display: grid; grid-template-columns: minmax(280px,40vw) 1fr; }
  .mobile-stage__hero { left: min(40vw,360px); width: calc(100% - min(40vw,360px)); height: 100%; }
  .mobile-stage__scrim { background: linear-gradient(90deg,rgba(7,12,18,.98) 0%,rgba(7,12,18,.90) 34%,rgba(7,12,18,.14) 58%,rgba(7,12,18,.06) 100%); }
  .mobile-stage__sheet { top: 0; bottom: 0; right: auto; width: min(40vw,360px); max-height: none; border-radius: 0; padding-top: calc(72px + var(--safe-top)); }
}
```

### 15.4 Page-specific mobile behavior
- **01 Intro:** hero fills the screen; Play Intro/Skip sit in the lower sheet. Film plays edge-to-edge.
- **02 Role:** hero upper section; role badge, context facts, name field and Begin Simulation stack below.
- **03 Evidence:** top-view table crop with a compact folder grid in the hero; review checklist in the sheet; tap opens a full-screen readable document.
- **04 Crisis Decision:** one decision group at a time; self-report unlocks after framing.
- **05 Accountability:** sliders and GRI/RCS live in the bottom sheet; Supervisor Statement opens full-screen.
- **06 Stakeholder Pressure:** active stakeholder stays in the hero; line and four responses stack below.
- **07 Executive Pressure:** video dominates; four choices stack below, then disappear when the branch video plays.
- **08 Board Case:** four case steps become stacked touch rows.
- **09 Board Q&A:** question, context chips and four options in the sheet; optional note with microphone anchored low; never auto-submitted.
- **10 Outcome:** indicators and reflection stack in the lower sheet; Review Journey stays reachable.

### 15.5 Corrected references
Portrait files: `references/mobile/portrait/01_intro_portrait.png` through `10_outcome_portrait.png`.

Landscape rotation files: `references/mobile/landscape/01_intro_landscape.png` through `10_outcome_landscape.png`.

Contact sheets:
- `references/mobile/boardroom_dilemma_mobile_portrait_reference_grid.png`
- `references/mobile/boardroom_dilemma_mobile_landscape_reference_grid.png`

`references/mobile/boardroom_dilemma_mobile_reference_grid.png` now points to the corrected portrait reference rather than the old letterboxed version.

---

End of replication document.
