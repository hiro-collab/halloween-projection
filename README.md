# Halloween Projection — private preview v40

This branch restores the existing validated v39 source, then records the v40 count-selection change separately. Intermediate local development history was not recorded and is not reconstructed. See [release recovery](docs/LOCAL-RELEASE-RECOVERY.md) and [asset boundaries](docs/PRIVATE-ASSET-BOUNDARIES.md).

Open web/START-HERE.html for the operator and projection windows. This is a preview; real-projector and longer-duration acceptance remain pending. Code licensing does not relicense private owner assets. No public site or push is part of this local recovery.

Build: python tools/build-web-package.py . Exact saved ZIP reproduction: python tools/reproduce-saved-release.py releases/v40.json . Python is a maintainer tool; end users use the static ZIP. dist/ and output/ are ignored.

Validation: node tests/app-control-api.qa.cjs . Set PLAYWRIGHT_CLI to an installed CLI JS entry point and run python tests/run-browser-qa.py common-api resources keyboard-lifecycle realtime-controls offline-unpacked natural-motion . v40 additionally has actor-count and count-fhd tests. Browser test output/captures are ignored.

v40 controls: a.actorCount integer1..6; Japanese selector; Q decrease/E increase after arming. Symmetric rows protect standard central text. Layout interpolation retains shared clock and surviving motion histories. Details remain in web/GUIDE.html.
