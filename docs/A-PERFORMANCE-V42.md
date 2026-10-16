# v42 A performance and cadence correction

v41 display behavior is retained. Under matched FHD conditions, the saved v40/v41 baseline is20.924/20.967 actual draws/s, so its display change did not reproduce a regression. The historical v40 ~33fps run used internal720p and stronger/different controls. The prior v41 90s result was mislabeled internal720p: its default is viewport-sized FHD. That correction is reconstructed from its test/defaults and confirmed by new v41 raster/composite readback; original saved artifacts remain unchanged.

## Measured causes and changes

The default fullFHD frame spends about32ms in synchronous float readback, but GPU queries show that this includes queued composite work, rather than32ms of fluid shader work. Fluid GPU interval is about0.20ms, coverage raster about0.47ms; the shared large composite program costs roughly2.15ms even for a fullFHD copy/Level pass. Constant operation selectors0/1 reduce the measured copy/Level draw to about0.018ms, with the identical fragment template, equations, texture formats, resolution, pass order and quantization boundaries. Two extra programs are compiled on creation; other stages use the existing program. Uniform locations are cached per program. Framebuffer completeness is cached per unchanged texture allocation, invalidated on allocation/resize, and context loss is still checked.

CPU diagnostic six-actor costs: motionMat 0.061ms, model projection/layout 0.275ms, depth sort 3.896ms, shading/packing/raster submission 4.408ms. One actor reduces geometry CPU work but initially gives similar throughput, supporting a composite/GPU limit. Glow0.2 adds work: the original diagnostic is18.12fps versus20.90 at Glow0. Those switches are diagnostic conditions; release defaults are unchanged.

After the runtime returned to60Hz RAF, the old gate could produce only20Hz: it rebased33.3ms on a draw start after CPU preparation, missing every second-frame boundary. v42 follows a30Hz deadline phase, skips missed slots, retains immediate control/paused redraws, and does not add simulation catch-up cooks. The actual-app synthetic regression reproduces40 old draws versus60 new draws over2 virtual seconds at60Hz with0.2ms preparation; Pause/Reset/End also pass. This is a clock-boundary regression, not a real fps benchmark.

## Final matched measurements

One owned headless Chrome155, RTX3070/ANGLE D3D11, FHD stage/DPR1, six actors, standard text, Glow0, same settings per pair; ABBA order,2x20s/version after2.4s warmup. Actual model draws are counted separately from RAF. Final FHD data predates the subsequent PC reboot but includes the deadline fix and completed cleanup; resumed720p data is after reboot. Each comparison uses its own same-session reference.

| Internal render target | v41 draws/s | v42 draws/s | v41 frame wall ms | v42 frame wall ms |
|---|---:|---:|---:|---:|
|1920x1080|19.623|30.009|49.517|16.141|
|1280x720|20.027|29.993|20.002|14.541|

90-second real A run: 90.158s, 2705 actual draws, 30.003fps; RAF 59.928/s; actual target [1920, 1080]. Solver 60.006Hz, solver/motion dropped0s. B 60.021 actual draws/s over20.010s. These are finite observations, not guaranteed projector/event performance.

## Validation and preservation

Browser 291 checks; exact Float32 fluid/intermediate RGBA comparisons131; synthetic cadence9; common API unit18. All final checks pass. Paused Reset, allocation revalidation, context loss and disposal are included. The model, motionMat/Feedback/Noise/lag, clocks, rig/jaw/camera, v41 layout, CPU vertex/lighting/sort, coverage raster, B and text/lighting equations remain unchanged. Some actual motion histories change when the producer reaches its intended cadence; no identical stochastic trajectory claim is made.

Run `python tests/run-a-performance-qa.py cache-equivalence cadence paired paired-720p` after setting `PLAYWRIGHT_CLI`. The runner exports exact Git v40/v41 references into ignored output, uses isolated Chrome sessions and records their IDs/PIDs/hashes/cleanup. Detailed original/GPU diagnostic cases are available under tests/performance. No user profile, credentials, existing Chrome tab, note publication, OS tuning or GitHub push is involved.

Two exec transport timeouts and an interrupted720p case are recorded outside source. That incomplete case is excluded; completed FHD data was preserved and remaining checks resumed after verifying no owners/sessions remained. Other GPU/browser platforms, initial extra-program compilation latency, real projection/highDPR and event-length operation remain unverified. Human naturalness acceptance remains open. This is a local preview.

One initial actor-count run had44 passes and a failed1/2-key count assertion. It recorded no instantaneous count. The test now waits for a rendered scene, then independently asserts the visible count and canonical API count; the rerun records4/4 and passes45. The first transient is retained outside source and its exact cause is not certified.
