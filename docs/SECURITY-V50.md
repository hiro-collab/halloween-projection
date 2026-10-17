# v50 security review scope

The owner explicitly approved normal push of code and bundled assets to the existing private `hiro-collab/halloween-projection` repository. The target is the dedicated `codex/operator-flip-v50-20261017` branch. No force push, public visibility change, public Release, external security scanner upload, or secret rotation is included.

## Local content review

The review covers the current tracked files, owned new files, and every blob newly reachable from the local branch relative to the fetched GitHub main. It checks private-key markers, common provider-token formats, credential literals, email addresses and personal/local absolute paths, plus unexpected environment files, credentials, native source media, recordings, logs and ZIPs. Commit metadata is also reviewed; existing author identities use GitHub noreply addresses. This pattern review cannot prove that every possible secret is absent.

High-entropy string candidates were separately reviewed. They are the known owner PNG, CC0 skull binary, a binary16 fluid field, an int16 sampled motion field, and a gzip/row-delta binary16 projection map. Decoder dimensions and hashes match their numerical/image purpose. These private owner fixtures remain outside the code MIT license. The PNG has only IHDR/IDAT/IEND chunks, with no text or EXIF metadata.

No application dependency manifest, vendored third-party runtime package, CDN, downloaded executable, font file, or external analytics SDK is shipped in the static ZIP. Consequently there is no packaged npm/Python dependency set for a CVE audit. The installed browser, GPU driver, OS, Node and QA tooling are outside that statement and are not certified vulnerability-free.

## Application boundaries

Current web HTML has a restrictive CSP, no inline scripts or event handlers, and only local subresources. User text is assigned through `textContent` or Canvas `fillText`; there are no HTML-string insertion or dynamic-code sinks. API settings have declared finite bounds, string/line limits and own-key checks. The file route uses embedded, hash-checked image bytes. HTTP asset retrieval uses a fixed same-origin image URL with redirect, size, hash and timeout checks. Service Worker saving is opt-in, hashes approved static files, and excludes typed text and arbitrary URLs.

The two-window handshake requires the opener, a random128-bit token, and matching origin for HTTP. Local file pages require a wildcard target origin because of their opaque origin, while still checking opener and token. Only the transferred MessagePort accepts commands; the API is allowlisted and bounded. A fresh-window keyboard arm is required after focus/input/IME/modifier or heartbeat interruptions. The known legacy Windows host is loopback-only and validates Host, Origin and a random quit token; it is not part of the static Web distribution. The ordinary root entry now opens the current static guide.

Runtime proof uses isolated browser contexts, synthetic text and owned loopback/file fixtures. Application-context requests are observed separately from browser/OS background communication. File startup with Chrome's offline setting does not claim a physical network-disconnection test. CSP/cache, malformed input, literal user text, lifecycle and native focus results are recorded with the final release validation; historical QA counts are not reused.

The v50 browser boundary run passes 15 checks, including literal text, bounded malformed input, framing/device policies, same-origin GET requests, all 44 approved cached assets, exclusion of typed text, offline reload, and removal of the owned registration/cache. The saved-state inventory now includes the actor-layout asset, matching the worker inventory. The final ZIP contains 45 static entries including the worker, without logs or test tools. Its fixed ZIP timestamps and permissions allow byte-for-byte reproduction from the committed sources.

Performance cue values are finite and bounded. The 24 physical keys choose eight discrete targets per axis; real values interpolate over 150ms with no added timer. Hue takes the shortest circular path. The operator port limits final orientation to the four declared modes; it does not expose native remap modes. Browser automation disables forced focus emulation for the Windows foreground proof so native focus loss is actually observed.

## Publication boundary

The owner bat atlas, sampled motion/UV/field data and CC0 model provenance remain in `web/RIGHTS.txt` and `PRIVATE-ASSET-BOUNDARIES.md`. The explicit private-repository approval does not authorize public redistribution. No active local push hook or repository workflow is present. Raw screenshots, videos, logs, profile data and private validation reports stay outside Git. The delivery ZIP and operation movie are saved separately for the owner. Final commit, remote equality and private state must be read back after the normal push.
