# Mobile Responsive Correction

The mobile implementation must fill the device viewport. Never shrink the desktop 16:9 screen into a portrait phone frame.

- Portrait: full-width hero visual + lower interaction sheet.
- Landscape: full-height visual + left interaction rail.
- Use `object-fit: cover`; no letterboxing.
- Support rotation without blocking the experience.
- Use safe-area padding.
- Expanded evidence fills most of the viewport.
- Voice-response transcripts remain editable and are never auto-submitted.

See section 15 in `BOARDROOM_DILEMMA_MASTER_REPLICATION.md` and the corrected reference images under `references/mobile/`.
