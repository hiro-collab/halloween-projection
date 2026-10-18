# Halloween Projection v0.1.59 — Readable code and developer guide

Browser JavaScript and GLSL have been formatted, with intent comments and a developer guide to make modification points easier to find. Keyboard mappings, colour conversion, motion and rendering resolution are unchanged. This release adds no performance optimization.

- Before/after equivalence was checked for 36 JavaScript files and 16 GLSL templates; all 17 unit suites passed.
- With identical clocks, randomness and 1280×720/DPR1 rendering, 12 skull/bat images had zero pixel difference. One pre-birth black bat frame is identified separately; all remaining 11 images contain visible output.
- The extracted new ZIP was served over loopback HTTP and checked in Chrome: packaged entry startup, 53 operator checks and 13 colour/text/orientation checks. Test readiness conditions were corrected as well.
- The environment's `file:` tool restriction was respected. These startup checks use HTTP and do not establish file-protocol operation, physical projection or long-duration stability.

Download `halloween-projection-web-v0.1.59-readability-cleanup.zip` from Assets, Extract All, then open `はじめに_START-HERE.html` in Chrome. Previous releases remain available.

ZIP SHA256: `581b798f5d5f3f93dc6c359d960e1a6184ba745eb3aaf6652ca88eb702bcb1de`
