# Boardroom Dilemma — prompts for the ungenerated images

These are prompts for the 27 image assets the build still needs. The first 12 are the ones people see most.

## How to use this

1. **Model.** Each prompt names one:
   - **Seedream 5.0 Pro** for photographs and edits of existing scenes.
   - **Nano Banana Pro** for folders, documents, cards and brand marks.
   
   Use 2K resolution and the aspect ratio given.
2. **Reference images.** Attach the files listed under **Attach** from `media/prompt_refs/` as image references. This keeps the logo, table, factory and room consistent with what's already in the app.
3. **Series.** Generate the first item of each series, pick the best result, then attach it as an extra reference for the rest of that series. Folders, lens cards and reform cards stay consistent that way.
4. **Cut-outs.** Some assets sit on top of a scene. For those, the prompt asks for a plain light grey background, so run **Remove Background** afterwards and save as PNG.
5. **Check before saving:**
   - No readable text, letters or numbers. All text in the app is typeset in code.
   - The logo matches the green triangle on the boardroom wall.
   - No real company, government or agency marks.
6. **Save.** Put the chosen files in `media/originals/new/` under the filename shown and tell me. I'll optimise them and wire them into the app.

| Reference file | What it keeps consistent |
| --- | --- |
| `ref_01_boardroom_logo.jpg` | Delta logo (green triangle on the wall), boardroom look |
| `ref_02_evidence_tabletop.jpg` | Evidence Desk marble, props and light (daylight from the upper right) |
| `ref_03_crisis_scene.jpg` | Page 4 table angle and light |
| `ref_04_accountability_scene.jpg` | Page 5 table angle and light |
| `ref_05_regulator_seal.jpg` | FISCA seal on the regulator's wall |
| `ref_06_board_case_scene.jpg` | Page 8 table and portfolio |
| `ref_07_outcome_base.png` | Page 10 base image (full resolution) |
| `ref_08_plant_establishing.jpg` | Factory exterior and structure from the intro film |
| `ref_09_production_line.jpg` | Factory interior and production line from the intro film |

---

# Priority — the 12 most visible

## Evidence folders (Page 3) — 5 images

The five folders sit on the top-view marble table and carry the labels, step numbers and reviewed marks, which are all added in code.

**Model:** Nano Banana Pro · **Aspect:** 3:4 · **Attach:** `ref_01_boardroom_logo.jpg`, `ref_02_evidence_tabletop.jpg` (plus your chosen F1 for F2–F5) · **After:** Remove Background → PNG

Layout rules for all five folders:
- Keep the whole folder, including anything sticking out, inside the frame with a margin.
- Keep the top-left and top-right corners of the cover plain; the step number and reviewed tick sit there.
- Keep the cream label panel blank and in the lower middle of the cover.

### F1 — Incident Report · `folder_incident.png`
```text
Photorealistic product photograph of a single closed premium corporate document folder lying flat, shot from directly overhead at 90 degrees, portrait orientation, the folder filling about 80% of the frame, on a plain flat light grey background. Matte deep charcoal-slate cover with a fine linen texture and softly worn corners, a slightly darker spine edge on the left, and a short tab rising from the top edge on the right. Near the top centre of the cover sits a small debossed logo: a teal-green geometric triangle with an inner offset triangle, matching the triangle logo on the boardroom wall in the reference image. Across the lower middle of the cover is an empty cream paper label panel with a thin border, left completely blank. Soft daylight from the upper right, with a faint soft shadow along the lower-left edge, matching the light on the marble table reference. No text, letters or numbers anywhere. Premium, restrained, realistic.
```

### F2 — Near-Miss Report · `folder_near_miss.png`
```text
Identical to the reference folder — the same design, charcoal-slate linen cover, teal-green triangle logo, blank cream label panel, overhead camera, daylight and plain light grey background — as its matching pair. The only difference: a narrow yellow paper flag sticks out a little from the right edge, as if marking a page. No text, letters or numbers anywhere.
```

### F3 — Payment Records · `folder_payments.png`
```text
The same folder design as the reference — charcoal-slate linen cover, teal-green triangle logo, blank cream label panel, overhead camera, daylight and plain light grey background — but slightly thicker, with a black elastic closure band running vertically near the right edge and the edges of a few ledger sheets just visible along the bottom edge. No text, letters, numbers or figures anywhere.
```

### F4 — Internal Correspondence · `folder_correspondence.png`
```text
The same folder design as the reference — charcoal-slate linen cover, teal-green triangle logo, blank cream label panel, overhead camera, daylight and plain light grey background — but thin, with a silver paper clip on the top edge and the corner of a single blank white printed sheet peeking out at the top right. The sheet shows no readable text. No text, letters or numbers anywhere.
```

### F5 — News Clipping · `folder_news.png`
```text
The same folder design as the reference — charcoal-slate linen cover, teal-green triangle logo, blank cream label panel, overhead camera, daylight and plain light grey background — with the edge of a folded, off-white newspaper clipping sticking out from the right side at a slight angle. The clipping shows only soft, unreadable grey column texture and the corner of a greyscale photograph; no legible words or headlines. No text, letters or numbers on the folder.
```

---

## Document photos — 4 images

These go inside the typeset documents. Text stays in code; the images give the documents their realism.

### D1 — Incident Report photo · `doc_incident_photo.jpg`
**Model:** Seedream 5.0 Pro · **Aspect:** 4:3 · **Attach:** `ref_09_production_line.jpg`
```text
Documentary-style evidence photograph for an internal incident report, taken inside the same factory as the reference image: an industrial roller-conveyor production line that has been stopped and cordoned off with yellow-and-black safety tape strung between steel posts, a folded yellow hazard stand on the concrete floor beside it, fluorescent strip lights overhead and flat daylight from high windows. No people, no injuries, no blood, no readable signage, labels or brand names. Shot at chest height with a 35mm lens, natural slightly muted colour, sober and factual like an investigator's photo.
```

### D2 — Near-Miss Report photo · `doc_near_miss_photo.jpg`
**Model:** Seedream 5.0 Pro · **Aspect:** 4:3 · **Attach:** `ref_09_production_line.jpg`
```text
Close documentary photograph of a machine safety interlock on the guard of a production line in the same factory as the reference image: a grey steel control box with a guard-door switch and a key interlock, a red lockout hasp, and a manila maintenance tag hanging from it on a wire tie, the tag marked only with unreadable scribbles. A strip of grey duct tape bridges the door switch — a subtle sign the interlock has been bypassed. Fluorescent factory light, shallow depth of field, no people, no readable text, logos or brand names. Natural, slightly muted colour.
```

### D3 — News Clipping photo · `doc_news_photo.jpg`
**Model:** Seedream 5.0 Pro · **Aspect:** 4:3 · **Attach:** `ref_08_plant_establishing.jpg` (optional)
```text
Black-and-white press photograph for a regional business newspaper: the exterior of a manufacturing facility in Ogun State, Nigeria. A closed sliding steel security gate in a tall perimeter wall topped with coiled wire, a small guard booth beside it, a red-earth road verge and a few palm trees, with the factory roof and steel structures visible beyond the wall. Flat midday light, two parked cars, nobody near the camera. No readable signage, company names or logos. Light film grain, straightforward press-photo framing.
```

### D4 — Newsprint texture · `doc_newsprint_texture.jpg`
**Model:** Nano Banana Pro (or Seedream 5.0 Pro) · **Aspect:** 3:4
```text
Flat, evenly lit scan of a single blank sheet of off-white newsprint paper filling the entire frame edge to edge, portrait orientation: fine grey paper fibres, a faint horizontal fold line across the middle, very subtle yellowing toward the edges and a few tiny creases. Absolutely no text, print, columns, photos or markings. No shadows, no vignetting, no visible paper edges, so it works as a background texture.
```

---

## Outcome lighting variants (Page 10) — 3 images

These are edits of the existing outcome image, so the room and camera stay identical and only the light changes. One is used per ending.

**Model:** Seedream 5.0 Pro (image edit) · **Aspect:** 16:9 · **Attach:** `ref_07_outcome_base.png`

> **Spec conflict:** The master spec asks for early-evening light on END-C. The newer build spec says "bright daytime visual language only — no sunset/night grade". These prompts keep all three in daylight. If you want the original direction instead, change END-C's lighting sentence to *"early-evening light with long shadows"*.

### O1 — END-A, resolved · `outcome_end_a.jpg`
```text
Using the reference image, keep the exact same camera position, framing, empty boardroom, marble table, chairs, water glasses, closed portfolio, wall logo and Lagos skyline. Change only the light: bright, clear afternoon daylight with crisp sunlight through the windows, clean natural highlights on the marble and a blue sky with a few light clouds. The mood is calm, resolved and reflective. No sunset colours, no added objects, no text.
```

### O2 — END-B, uneasy · `outcome_end_b.jpg`
```text
Using the reference image, keep the exact same camera position, framing, empty boardroom, marble table, chairs, water glasses, closed portfolio, wall logo and Lagos skyline. Change only the light: flat overcast daylight under a uniform pale grey sky, softer contrast, cooler neutral tones, the skyline slightly hazy. The mood is composed but uneasy. No added objects, no text.
```

### O3 — END-C, under scrutiny · `outcome_end_c.jpg`
```text
Using the reference image, keep the exact same camera position, framing, empty boardroom, marble table, chairs, water glasses, closed portfolio, wall logo and Lagos skyline. Change the light to dim, heavy overcast daylight under a dark grey stormy sky, with low contrast and cooler desaturated tones. Add one thing: a second document file lying open on the table beside the closed portfolio, its pages blank with no readable text. The mood is heavy and under scrutiny. Keep it daytime — not sunset, not night. No text.
```

---

# Remaining 15

## Documents on the table (Pages 4 and 5) — 3 images

> T2 and T3 are superseded by `IMAGE_PROMPTS_P4_P8.md`, which matches the rebuilt Page 4. T1 still applies.

These are cut-out objects that sit in the table foreground and open into the typeset document when clicked.

**Model:** Nano Banana Pro · **Aspect:** 4:3 · **After:** Remove Background → PNG

### T1 — Supervisor Statement on clipboard (Page 5) · `table_supervisor_clipboard.png`
**Attach:** `ref_04_accountability_scene.jpg`
```text
A black hardboard clipboard holding a blank white statement page, with the edge of a stapled second page visible beneath it, lying flat as if on the marble boardroom table in the reference image and seen from the same seated camera angle and daylight. The page is completely blank — no text, lines, logos or signatures. A soft contact shadow under the clipboard. Only the clipboard, on a plain flat light grey background so it can be cut out.
```

### T2 — MD's Draft Talking Points (Page 4) · `table_talking_points.png`
**Attach:** `ref_03_crisis_scene.jpg`
```text
A single premium A4 printed sheet with a thin dark slate header band and a slightly lifted corner, lying flat as if on the marble boardroom table in the reference image and seen from the same seated camera angle and daylight. The sheet is completely blank — no text, lines or logos. A soft contact shadow underneath. Only the sheet, on a plain flat light grey background so it can be cut out.
```

### T3 — Crisis Briefing Note (Page 4) · `table_briefing_folio.png`
**Attach:** `ref_03_crisis_scene.jpg`
```text
An open dark brown leather folio holding a blank white A4 document, lying flat as if on the marble boardroom table in the reference image and seen from the same seated camera angle and daylight, with a slim silver pen resting in the folio's spine. The document is completely blank — no text, lines or logos. A soft contact shadow underneath. Only the folio, on a plain flat light grey background so it can be cut out.
```

---

## Board pack (Page 8) — 9 images

> Superseded by `IMAGE_PROMPTS_P4_P8.md`, which matches the rebuilt Page 8.

### B1 — Evidence File cover · `boardpack_evidence_cover.png`
**Model:** Nano Banana Pro · **Aspect:** 3:4 · **Attach:** `ref_01_boardroom_logo.jpg`, `ref_08_plant_establishing.jpg`
```text
Flat front view of a premium corporate evidence file cover for a board pack, portrait, filling the frame edge to edge: matte deep slate card with a fine paper texture, the teal-green triangle logo from the reference in the top-left corner, a thin muted gold rule across the upper third, an empty rectangular area for a title, and a small inset documentary photograph of an industrial production facility with steel structures in hazy daylight in the lower half, framed by a thin white border. Leave an empty rectangular stamp area in the top-right corner. No text, letters or numbers anywhere.
```

### B2–B6 — Ethical lens cards · `lens_*.png`
**Model:** Nano Banana Pro · **Aspect:** 3:4 · **Attach:** `ref_01_boardroom_logo.jpg` (plus your chosen B2 for B3–B6)

Every lens card uses the same base prompt. Replace `[ICON]` with the icon for that card:
```text
Flat front view of a minimal premium board annotation card, portrait, on a plain flat light grey background: cream card stock with a soft paper texture, rounded corners and a thin teal-green border, a single elegant thin-line icon in deep slate centred in the upper half showing [ICON], and a clean empty area in the lower half for a title. Consistent line weight, no fills, no shading. No text, letters or numbers anywhere.
```
| File | Lens | `[ICON]` |
| --- | --- | --- |
| `lens_utilitarian.png` | Utilitarian | balance scales weighing two groups of small human figures |
| `lens_deontological.png` | Deontological | an open rulebook with a ribbon bookmark |
| `lens_virtue.png` | Virtue Ethics | a steady compass pointing north |
| `lens_stakeholder.png` | Stakeholder | three interlocking circles |
| `lens_ubuntu.png` | Ubuntu / African Communal Ethics | several linked hands forming a circle |

### B7–B9 — Governance reform cards · `reform_*.png`
**Model:** Nano Banana Pro · **Aspect:** 3:4 · **Attach:** your chosen B2 lens card (for a consistent style)

Every reform card uses the same base prompt. Replace `[ICON]` with the icon for that card:
```text
Flat front view of a clean governance reform note card for a corporate board pack, portrait, on a plain flat light grey background: white card stock with a soft paper texture, rounded corners and a deep slate-green band across the top, a single thin-line icon in teal green centred below the band showing [ICON], and generous empty space beneath for text. Consistent line weight with the reference card. No text, letters or numbers anywhere.
```
| File | Failure type | `[ICON]` |
| --- | --- | --- |
| `reform_agency.png` | Agency failure | a magnifying glass over a ledger |
| `reform_stewardship.png` | Stewardship failure | an upward arrow travelling through a protected, shielded channel |
| `reform_stakeholder.png` | Stakeholder-recognition failure | a single person figure inside a circle of attention |

> The line icons for B2–B9 could also be drawn as SVG in code, which stays sharp at any size. The prompts above are for generating them as images.

---

## Brand marks — 2 images

Both are simple flat marks. The app already draws a Delta logo in code, so treat these as the definitive designs to trace to vector.

### L1 — Delta Industrial Nigeria logo · `brand_delta_logo.png`
**Model:** Nano Banana Pro · **Aspect:** 1:1 · **Attach:** `ref_01_boardroom_logo.jpg`
```text
Flat vector-style logo mark, centred on a pure white background: a bold geometric triangle in teal green with an inner offset triangle cut-out, matching the triangle logo on the boardroom wall in the reference image. Clean sharp edges, solid flat colour, no gradients, no shadows, no text. It must not resemble any existing company's logo.
```

### L2 — FISCA seal · `brand_fisca_seal.png`
**Model:** Nano Banana Pro · **Aspect:** 1:1 · **Attach:** `ref_05_regulator_seal.jpg`
```text
Flat vector-style circular seal, centred on a pure white background, matching the seal on the office wall in the reference image: a green outer ring with gear teeth around a white inner field containing a shield with a balance scale, green and white only. No text or letters. It must not resemble the Nigerian coat of arms or any real government or agency emblem — no eagle, horses, flowers or national symbols.
```

---

## Optional — Evidence Desk with folders in place · `p03_tabletop_with_folders.jpg`

This is only a placement guide for the folders, not used in the app. Skip it unless you want a composed reference.

**Model:** Seedream 5.0 Pro (image edit) · **Aspect:** 16:9 · **Attach:** `ref_02_evidence_tabletop.jpg`
```text
Using the reference image, keep the exact same camera, marble, daylight and props (glass of water, coffee cup, fountain pen). Add five closed matte charcoal-slate document folders lying flat on the right two-thirds of the table, spaced apart without overlapping, each turned only 2 to 6 degrees as if placed by hand: a matching pair side by side, then a third folder, a fourth folder, and a fifth with the edge of a folded newspaper clipping showing. Each folder has a small teal-green triangle logo and a blank cream label panel. Keep the left third of the table clear. Correct contact shadows. No text anywhere.
```

---

## Not images — for completeness

The spec also calls for sound. These would be made in ElevenLabs, not as images:
- a low tension music bed under the intro film
- background ambience for the pages: boardroom room tone, plus plant ambience where relevant
