# v41 motion display correction

Baseline: v40 commit `f23b4aa9d3a16755d10cc202437f4c6e8ea2ae44`. This is a local preview branch. No GitHub push or original VJ/model edits are included.

## Confirmed cause and change

v40 fitted the current projected head/jaw silhouette to a target rectangle each frame and recentered its bounding box. That presentation step largely cancelled perspective Z sizing, resized the head when only its jaw moved, and introduced angle-dependent view scaling. Its `tanh` XY placement also compressed translation and gave X and Y unequal pixel gains.

v41 removes that fit and bbox recentering. The fixed registered mesh envelope includes all head rotations and jaw angles0–90, analytically bounded around the existing parent pivot. A view multiplier is fixed for a viewport, count and position-amplitude configuration, independent of the current pose. Original camera perspective still changes the geometry with Z. XY translation uses equal linear pixel gains, with the original perspective depth factor. These gains and safe layout margins are presentation choices, not claimed Native operator constants.

The original six motionMat states, source Noise/Feedback/cook cadence, control lag, shared source clock, rig registration, jaw hierarchy and rotation order remain unchanged. B motion/Particle/phase, texture, model and text/lighting math remain unchanged. Existing symmetric1–6 slots and count interpolation remain in use. The fixed envelope requires smaller initial heads than v40, a visible tradeoff recorded in the comparison video.

## Reproducible checks

Run `python tests/run-browser-qa.py projection-isolation natural-screen-trace actor-count count-fhd` after setting `PLAYWRIGHT_CLI`. Tests instrument only the HTTP response to expose actual submitted screen vertices and the original pre-layout projection; they do not modify production motion code.

The isolation sweep covers all counts, X/Y/Z translations−5..5, each rotation−90..90 and jaw0..90. Measured count1 Z near/far head-width ratio is1.1172388 in v41 (v40:0.9993939). Jaw-only head-width ratio stays1.000000 across the sweep; v40 shrank the head near30 degrees and grew it near90. The geometry suite passes43 checks. Applying the same criteria to v40 yields7 passes and36 expected quality failures, retained as the before evidence.

Live unmodified motionMat is sampled75 times each at counts1 and6. The measured view multiplier spread is below0.000001. Screen landmark paths and head-size curves are retained in the test output; zero mesh clipping or central-band intersection was observed in those samples. This is a finite observation, not a proof for every text, control or duration. `motion-display-continuity` also observes90 seconds of6-actor A and20 seconds of B, Pause, Reset, switch back and End; measured fps is reported as a property of that run.

The old/new video contains newly recorded actual application pages, matched API inputs followed by live motionMat and trusted Q/E/Space keys. It retains the old source timestamps. Two-window exact frame synchronization and identical random paths are not asserted. Raw videos, plots, CSVs and machine-specific receipts stay outside tracked source. `releases/v41.json` records the ZIP bytes and entry metadata for exact reproduction by `tools/reproduce-saved-release.py`.

## Remaining acceptance

Numbers alone do not certify naturalness. Screen trajectories, size response, comparison frames and standard HAPPY/HALLOWEEN text were reviewed; final human judgement and real projector/high-DPR/extended event operation remain pending. Bright flow can reduce local letter contrast as in the existing composite. Arbitrary text, maximal font/glow settings and full Native raster/RNG equivalence are not certified. This is a preview, not a completed distribution.
