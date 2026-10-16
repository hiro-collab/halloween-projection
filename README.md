# Halloween Projection — private preview v43

v43 restores the large source-camera skull orbit that the previous row presentation reduced to about4% of its visible travel. The default is now central orbit; the old symmetric rows remain an explicit option. No extra spin or changed motion generator is added. See [diagnosis and verification](docs/SKULL-ORBIT-V43.md).

v42 preserves the v41 motion display fix and restores the intended30Hz A cadence while reducing GPU overhead. See [measured causes and validation](docs/A-PERFORMANCE-V42.md). The branch also retains the recovered v39 baseline and separate v40 count-selection commit. Intermediate local development history was not recorded and is not reconstructed. See [release recovery](docs/LOCAL-RELEASE-RECOVERY.md) and [asset boundaries](docs/PRIVATE-ASSET-BOUNDARIES.md).

Open web/START-HERE.html for the operator and projection windows. This is a preview; real-projector and longer-duration acceptance remain pending. Code licensing does not relicense private owner assets. No public site or push is part of this local recovery.

Build: python tools/build-web-package.py . Exact saved ZIP reproduction: python tools/reproduce-saved-release.py releases/v43.json . Python is a maintainer tool; end users use the static ZIP. dist/ and output/ are ignored.

Validation: node tests/app-control-api.qa.cjs . Set PLAYWRIGHT_CLI to an installed CLI JS entry point and run python tests/run-browser-qa.py common-api resources keyboard-lifecycle realtime-controls offline-unpacked natural-motion . v40 additionally has actor-count and count-fhd tests. Browser test output/captures are ignored.

v40 controls: a.actorCount integer1..6; Japanese selector; Q decrease/E increase after arming. The optional rows mode protects standard central text; default source orbit may cross it. Layout interpolation retains shared clock and surviving motion histories. Details remain in web/GUIDE.html.

The v41 display correction retains source motionMat/rig/camera logic while removing per-frame silhouette fitting. See docs/MOTION-DISPLAY-V41.md and the projection-isolation/natural-screen-trace browser tests. Subjective naturalness is not certified by numerical checks.

Optional continuity measurement: `python tests/run-browser-qa.py motion-display-continuity` records90 seconds of six-actor A,20 seconds of B, Pause/Reset and scene lifecycle. Its fps is an observed run result, not an acceptance guarantee.

The v42 A performance correction preserves the v41 display fix, caches stable GPU state, specializes the identical copy/Level selector, and fixes30Hz pacing at60Hz RAF. See [measured causes and validation](docs/A-PERFORMANCE-V42.md). Reproduce a saved package with `python tools/reproduce-saved-release.py releases/v42.json`.
