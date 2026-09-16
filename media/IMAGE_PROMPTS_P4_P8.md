# Crisis Decision (Page 4) and Build the Board Case (Page 8) — image prompts

These prompts match the rebuilt interface. They replace T2, T3 and B1–B9 in `IMAGE_PROMPTS.md`, which were written for the earlier layout.

The rules from `IMAGE_PROMPTS.md` still apply:
- **Model and resolution.** Use the model named on each asset, at 2K.
- **References.** Attach the listed files from `media/prompt_refs/`.
- **Series.** Generate the first card of a series, then attach it for the rest.
- **Cut-outs.** Assets marked "cut-out" get Remove Background and are saved as PNG.
- **No readable text.** Titles, stamps, labels and numbers are all typeset in code.
- **Delivery.** Save the chosen files in `media/originals/new/` under the filename shown, and I'll optimise and wire them in.

| Priority | Page 4 | Page 8 |
| --- | --- | --- |
| Needed | C1 scene, C2 talking points, C3 briefing folio | K1 scene, K2 open pack, K3 cover, K4 locked seal |
| Nice to have | C4 document paper, C5 reaction still | K5–K9 lens icons, K10–K12 failure-type icons, K13 page paper |

---

## Page 4 — Crisis Decision

The player reads two documents on the table, the MD's Draft Talking Points and the Crisis Briefing Note, then sets the Board Position and the Disclosure Approach. The documents now sit mid-screen on the right, so the scene needs clear table there.

### C1 — Crisis scene with a clear table · `crisis_table_clear.jpg`
**Model:** Seedream 5.0 Pro (image edit) · **Aspect:** 16:9 · **Attach:** `ref_03_crisis_scene.jpg`
```text
Using the reference image, keep the same daylight Lagos boardroom, the same three board members in dark suits, the marble table, the water glasses and the skyline through the windows. Raise the camera slightly and pull back, so the board members sit in the upper half of the frame and a wide, clear stretch of polished marble table fills the middle and lower right of the frame, with soft window reflections and nothing on it. Keep the left third of the frame darker and uncluttered for on-screen text. The board members wait in serious, attentive silence, looking towards the camera. Photorealistic, natural skin tones, cinematic but restrained. No documents, no papers, no text.
```

### C2 — MD's Draft Talking Points · `crisis_talking_points.png` · cut-out
**Model:** Nano Banana Pro · **Aspect:** 3:4 · **Attach:** `ref_01_boardroom_logo.jpg`, `ref_03_crisis_scene.jpg`
```text
Photorealistic overhead photograph of a single A4 printed sheet lying flat, portrait, filling about 85% of the frame, on a plain flat light grey background. Warm white premium paper with a thin deep slate header band across the top, a small teal-green triangle logo at the left of the band matching the logo on the boardroom wall in the reference, a silver paper clip at the top-left corner, three short hand-drawn pencil marks in the right margin, and the bottom-right corner lifted very slightly. The body shows soft, blurred grey bars suggesting typed paragraphs, with nothing legible. Leave a clear empty rectangle in the lower right, where a stamp will be added. Soft daylight from the upper right with a gentle contact shadow along the lower-left edge. No readable text, letters or numbers anywhere.
```

### C3 — Crisis Briefing Note in a leather folio · `crisis_briefing_folio.png` · cut-out
**Model:** Nano Banana Pro · **Aspect:** 3:4 · **Attach:** `ref_03_crisis_scene.jpg`, your chosen C2
```text
Photorealistic overhead photograph of an open black leather document folio lying flat, portrait, filling about 85% of the frame, on a plain flat light grey background. The folio holds a single white A4 sheet framed by the leather on all sides, with a slim silver pen resting along the left edge. The sheet has the same slate header band style as the reference sheet, and soft, blurred grey bars suggesting typed paragraphs, with nothing legible. Leave a clear empty rectangle in the lower right of the sheet, where a stamp will be added. Same soft daylight from the upper right and gentle contact shadow as the reference sheet. No readable text, letters or numbers anywhere.
```

### C4 — Document paper for the open view · `crisis_doc_paper.jpg`
**Model:** Nano Banana Pro · **Aspect:** 3:4 · **Attach:** your chosen C2
```text
Flat, evenly lit, straight-on scan of a premium off-white A4 paper sheet filling the entire frame edge to edge: very subtle paper fibre texture, a thin deep slate header band across the top matching the reference sheet, and generous empty space below. No shadows, no curl, no vignette, completely uniform light so text can be laid over it. No text, letters, lines or numbers.
```

### C5 — Board reaction after the decisions (optional) · `crisis_decided.jpg`
**Model:** Seedream 5.0 Pro (image edit) · **Aspect:** 16:9 · **Attach:** your chosen C1

Shown once both decisions are made. It needs a small code change, so skip it if you want to keep things simple.
```text
Using the reference image, keep the exact same camera, boardroom, board members, table and light. Change only the moment: the board member in the centre now holds a single printed sheet and reads it with a concerned frown, the man on the right leans back with folded arms, and the woman on the left looks across at them. Tension, a decision has been made. Keep the middle and lower right of the table clear. No readable text on the sheet or anywhere else.
```

---

## Page 8 — Build the Board Case

The player assembles the case inside an open Board pack. Tabs for the four sections are on the left page, and the working section is on the right page. It is 14 hours before the Board meets, which is late at night.

### K1 — Late-night preparation scene · `boardcase_night.jpg`
**Model:** Seedream 5.0 Pro (image edit) · **Aspect:** 16:9 · **Attach:** `ref_06_board_case_scene.jpg`
```text
Using the reference image, keep the same boardroom, marble table, chairs and window framing. Change the time to late at night: the Lagos skyline glows with scattered office and street lights under a deep blue-black sky, the room lights are off, and a single warm desk lamp at the far right of the table throws a soft pool of light across the table surface. Remove the portfolio from the table; leave only a closed laptop and a cup of cold coffee near the lamp. Keep the left third of the frame dark and uncluttered for on-screen text, and keep the centre-right of the table open and softly lit. Quiet, focused, the night before a hard meeting. Photorealistic. No people, no text.
```

### K2 — Open Board pack · `boardpack_open.png` · cut-out
**Model:** Nano Banana Pro · **Aspect:** 16:10 · **Attach:** `ref_01_boardroom_logo.jpg`, `ref_06_board_case_scene.jpg`
```text
Photorealistic straight-down overhead photograph of an open premium black leather board portfolio lying completely flat, landscape, filling about 90% of the frame, on a plain flat light grey background. Two cream paper pages sit side by side inside the leather: the left page slightly narrower than the right, about 46 to 54, separated by a stitched leather spine down the middle. The pages are perfectly flat with no curl and are evenly and softly lit from above, with no hotspots or gradients, because text and buttons will be laid over them. A thin muted gold edge line runs around the leather border, and a small blind-embossed triangle logo matching the reference sits in the leather at the bottom centre. Both pages are completely blank. Soft even contact shadow around the portfolio. No text, letters or numbers.
```

### K3 — Board case cover page · `boardpack_cover.png`
**Model:** Nano Banana Pro · **Aspect:** 3:4 · **Attach:** `ref_01_boardroom_logo.jpg`, your chosen K2
```text
Flat, evenly lit, straight-on view of a heavy cream card cover page filling the frame edge to edge, portrait: a subtle linen paper texture, a blind-embossed teal-green triangle logo matching the reference centred in the upper third, a thin muted gold rule below it, and a large empty space beneath for a typeset title and the preparer's name. No shadows, no curl, completely uniform light. No text, letters or numbers.
```

### K4 — "Locked for the Board" seal · `boardpack_locked_seal.png` · cut-out
**Model:** Nano Banana Pro · **Aspect:** 1:1 · **Attach:** `ref_01_boardroom_logo.jpg`
```text
Photorealistic close-up, straight overhead, of a single deep green wax seal pressed onto paper, centred on a plain flat light grey background, filling about 60% of the frame. The seal has a crisp embossed geometric triangle with an inner offset triangle, matching the logo in the reference, a naturally irregular wax edge, and a short strip of deep slate silk ribbon passing underneath it. Soft daylight from the upper right with a small contact shadow. No text, letters or numbers.
```

### K5–K9 — Ethical lens icons · `lens_icon_*.png` · cut-out
**Model:** Nano Banana Pro · **Aspect:** 1:1 · **Attach:** your chosen K3 (plus your chosen K5 for K6–K9)

These are small icons that sit at the top of each lens card. The card's title and description stay as text. Every icon uses the same base prompt; replace `[ICON]` with the subject from the table.
```text
A single minimal icon centred on a plain flat light grey background: a small round cream paper medallion with a thin teal-green rim, and inside it an elegant thin-line drawing in deep slate showing [ICON]. Even line weight, no fills, no shading, no gradients, generous margin around the medallion. No text, letters or numbers.
```
| File | Lens | `[ICON]` |
| --- | --- | --- |
| `lens_icon_utilitarian.png` | Utilitarian | balance scales weighing two small groups of people |
| `lens_icon_deontological.png` | Deontological | an open rulebook with a ribbon bookmark |
| `lens_icon_virtue.png` | Virtue Ethics | a steady compass needle pointing north |
| `lens_icon_stakeholder.png` | Stakeholder | three interlocking circles |
| `lens_icon_ubuntu.png` | Ubuntu / African Communal Ethics | several hands joined in a circle |

### K10–K12 — Failure-type icons for the reform choice · `failure_icon_*.png` · cut-out
**Model:** Nano Banana Pro · **Aspect:** 1:1 · **Attach:** your chosen K5

These sit beside the three reform choices: Agency, Stewardship and Stakeholder recognition. Use the same base prompt as K5–K9.

| File | Failure type | `[ICON]` |
| --- | --- | --- |
| `failure_icon_agency.png` | Agency failure | a magnifying glass over an open ledger |
| `failure_icon_stewardship.png` | Stewardship failure | an upward arrow travelling through a shielded channel |
| `failure_icon_stakeholder.png` | Stakeholder-recognition failure | a single person inside a circle of attention |

### K13 — Pack page paper (optional) · `boardpack_paper.jpg`
**Model:** Nano Banana Pro · **Aspect:** 4:3
```text
Flat, evenly lit, straight-on image of cream board-pack paper filling the entire frame edge to edge: a very subtle fine paper grain and a faint thin margin rule down the left side. Completely uniform light, no shadows, no curl, no vignette, suitable as a seamless background for text. No text, letters or numbers.
```

> The pack's tabs, chips, text fields and diagnosis bars stay as code. They need to react to clicks and typing, and images would blur at small sizes.
