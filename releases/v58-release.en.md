# Halloween Projection v0.1.58 — Skull rendering and operator guidance

The skull renderer shares GPU textures between the fluid and composite stages and specializes composite shader programs by operation. Existing colour formulas, pass order, models, motion and rendering resolution are retained.

- Clearer preparation status, scene-specific keyboard explanations and pause, blank, resume and exit guidance.
- Skull Q W E R T Y U I labels and swatches now show cyan, blue, violet, magenta, red, yellow, yellow-green and green. All eight samples were compared with the actual bright fluid-edge shader output. Colour conversion and bat colour guidance are unchanged.
- The new ZIP was checked in Chrome on Windows: startup, eight keyboard controls, JA/EN labels, scene switching, pause/resume, blanking, restoring and exit. Existing keyboard contract (19), API (18) and fluid (280) tests passed.

Download `halloween-projection-web-v0.1.58-performance-update.zip` from Assets, Extract All, then open `はじめに_START-HERE.html` in Chrome. Previous releases remain available.

ZIP SHA256: `f1176134eae6b133955b8ea866dd7d448a9d4c9ece7d6fb2512c5ceca992e650`
