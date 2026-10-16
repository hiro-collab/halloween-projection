# v43: restore the visible skull orbit

The reported loss of the original "round-and-round" movement is a presentation regression. v42 keeps updating the original-style six motion histories, but the v40/v41 row placement almost cancels their visible XY orbit. A positive draw counter or moving jaw does not establish that the original group movement remains visible.

## Evidence and limits

The known source project hash is `f5254beb016b52e36c269c1d5a857e78e5beacc5fd8d4162a074cf16d3c54094`. Its saved motionMat wiring has a six-point Circle, RST with X scale1/Y scale.5/uniform.8, and Rz from absolute frame. At60Hz the circle turns once in6seconds. That output is added to positional Noise, passed through the head/jaw Feedback and Outside/Over, then mapped to Tx/Ty/Tz with gain3.31. Separate rotation Noise maps to XYZ angles with gain180. These are two different motions: positional orbit and local head orientation.

The same saved branch drives each skull's common parent null; the head and jaw share that parent, and the jaw has its own local X transform. The saved local rotation CHOP is bypassed. No independent constant360-degree self-spin was established in that branch. The original full VJ scene has not been newly played or visually certified. Native Noise field values and the Web comparison generator remain different; finite native samples are QA evidence, not an animation payload.

An exact saved v42 ZIP was freshly unpacked and tested in an owned headless Chrome at1920x1080/DPR1. Startup was A6/running, rates1, generated poses, and no asset errors. Over7.0541seconds the stage produced30.0534 actual draws/s. All six heads changed orientation by roughly43.6–68.5degrees on at least one axis; skull raster images changed. Pause held identical raw raster bytes; Resume changed them. Thus an update freeze was not reproduced.

However, the displayed center only spanned34.7–39.2px horizontally and18.6–21.5px vertically. The old row mapping uses height*.007 pixels/world-unit, while the original camera uses focal/(90-z). At z0/FHD the ratio is0.0396253, about4%. This almost hides the large positional orbit. The defect predates v42's GPU caching/pacing change.

## Change

`a.actorLayout` is `source` by default. In source mode, mesh vertices retain the original camera projection, world translation, parent rotation, jaw transform and pivot. There is no row anchor, silhouette recentering, per-pose fitting or extra self-spin. The existing foreground mapping also retains its source-position route.

`rows` explicitly selects the previous symmetric row presentation. This retains its text clearance/count interpolation and intentionally small translation. Both the operator and single-window panel expose the choice. Switching layout changes only placement; motion histories, source clocks, matrices, six source states and selected count survive. Counts1–6 still select the existing source actors; the source orbit is not redistributed into a new invented N-body motion. Row mode remains the option for symmetrical placement at each count. Source orbit can cross the central text, as the original movement does.

The motionMat/Noise/Feedback/lag modules, model bytes, rig hierarchy, rasterizer, fluid/composite math, performance optimization and B implementation are unchanged. No private native samples, source media or TOE data are added to the package.

## Verification

The real operator test checks default source A6, large screen travel for every actor, camera/pivot projection, local rotation and jaw changes, exact paused world-transform preservation across both layouts, counts1–6, Pause/Resume, Reset, B and A return, invalid input and browser errors. Existing row-clearance/isolation tests explicitly select rows rather than silently treating them as the default. Initial Resume assertion compared against the pre-Reset draw counter; it was corrected to compare after Reset. The original failed run is retained outside tracked source.

The normal-speed video records the actual final app continuously: source orbit, rows comparison, source restored, short Pause/Resume, ending running. Its per-frame Chrome wall timestamps are preserved and independently checked. It is not footage of the original native VJ project. Recording cadence is reported separately from the unrecorded benchmark.

This remains a preview. Full original VJ visual acceptance, the user's intended degree of local self-rotation, real projector/highDPR/other GPUs and event-duration operation remain unverified. No GitHub push or publication is part of this repair.

Unrecorded A6/source-layout continuity:45.1395s at internal1280x720 produced29.9959016 actual draws/s;20.0992s at internal1920x1080 produced30.0011941 actual draws/s. Solver60Hz, motion and solver dropped seconds0. Every5-second interval retained six updated poses, one live owner and no errors. The raw first continuity result had a null derived solverHz because its field lives under flow.timing; the final summary derives it from the saved start/end timing counters, without inventing another run.

The inspected continuous MP4 is35.265729s,1920x1080, with1,038 original source frames plus one unchanged endpoint image. Original PTS maximum error is0; container duration differs from captured wall duration by about1microsecond. Source default begins immediately; rows begins at12.570s; source returns at18.935s; Pause at31.332s; Resume at32.032s; the final35.247s observation is running. Seven encoded frames were visually checked and the complete file decoded. This demonstrates the presentation difference; it does not certify an exact original VJ noise trajectory or360-degree self-spin.
