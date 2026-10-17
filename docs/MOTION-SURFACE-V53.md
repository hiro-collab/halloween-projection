# Motion, input and surface correction v53

This private preview fixes four reported product behaviors together. Original model data, registered jaw hinge, original source clocks, measured native force function, native operator coefficients and downstream image effects are retained. It is not a new TouchDesigner project or a full native-noise reproduction.

## V holding

The operator keyboard timer and projection receiver each independently disarmed the owner at three seconds. The receiver's eight-second hold timer also counted V. Both three-second paths now release only the accent; V alone is excluded from the eight-second hold rule. Release V before triggering another accent. Other keys receive their own hold start time. Esc, editable input/IME/modifiers, lost focus/visibility, stale owner/render heartbeat and non-V eight-second hold safeguards remain.

Actual v52 Chrome reproduction accepted the key before timing and found arming lost at3.214s and10.204s while the document remained focused. v53 tests cover short,3s,10s,repeat,late cue,scene switch,release/retrigger and explicit disarm. Headless bringToFront does not prove native OS focus; editable focus and synthetic blur are named separately, with a separate owned-window Windows check.

## A returning to rest

Old performance mapping used Cross=.25+.5*strength: low strength never reached the original rest endpoint. The source Math maps Motioncross through.7..1, Lag, Cross and Feedback; the latter fades toward locked state with coefficient.98. Original locked positions have zero Y, zero rotation and three repeated pairs, rather than six uniquely distributed arbitrary-count actors. Jaw fader contains a separately saved constant and native composed alpha=.69, which are preserved.

The Web strength bridge uses inverse Cross and blends body position/rotation toward the original composed locked rest. A separate bounded presentation envelope takes450ms for full0..1 travel; numerical cue targets still use150ms. It does not restart noise or source history. At zero, fixed identity actors form one centered nonoverlapping row for counts1..6. Count adaptation is explicitly a Web presentation feature. Jaw remains an independent child and keeps its three existing modes. Explicit comparison actor poses bypass the rest bridge.

## B force and quiet movement

Previously digits changed only newborn speed/flap. Drag erased the speed difference while live particle forces stayed unchanged. C sampled.15/.5/.85 and omitted the original Cross endpoints.

The measured native field contains tangential Vortex and inward -(Vortex+Spiral); Radial=0. Negative Spiral subtracts inward Vortex, not extra inward gravity. Saved SurfaceAttraction is not applied because Particle has no connected surface input. See B-FORCE-FIELD-VALIDATION.md for the native12 golden cases.

Strength now reaches the applied force: C samples source Cross0/.5/1; ForceCross=strength*Cross, Vortex=5-4*ForceCross and Spiral=-1.7+.8*ForceCross. At quiet strength, the tangential component fades. A bounded envelope softens the native inward component near the center to acceleration 2*drag/life times displacement (2 in the saved source settings). The previous constant-magnitude inward force collapsed the flock into a point. This finite return rate lets source births and residual movement occupy a central area without a ring or position clamp;full strength retains the original measured vector exactly. Drag, external force, turbulence and the source clock continue. The original birth speed1.3 is retained as a quiet floor, rising to2.6 at full strength; flap rate remains.5..1.5. Thus quiet does not freeze birth/flight or place every particle on a fixed-radius ring. Full-strength force is exactly the same measured native force. This strength envelope and discrete C sampling are Web control adaptations, not three newly claimed native modes.

Observed C1 versus C2 at full strength after7.3s each: mean XY radius.454 versus.343,mean XY speed1.732 versus1.110,and circulation3.604 versus3.032rad/s. Corresponding source Vortex/Spiral are5/-1.7 versus3/-1.3,rotationCross.77 versus.385. Original source Cross was continuous;the Web uses0/.5/1,not three originally discrete switches. Quiet after10s occupied spread.132 with mean radius.116 and nonzero mean speed.057;flap continued. These are Web production measurements,not native image equivalence.

## Removing the internal polygon pattern

Old triangles each had separate area coverage and source-over alpha. Two shared-edge half-coverages combine to.75, leaving a seam; flat per-face lighting and translucent back faces reinforced the pattern. The new default WebGL2 renderer uses area-weighted normals, welded duplicate positions within the same bone, perspective-correct interpolated normals, opaque depth-tested triangles and hardware MSAA. Normal and jaw groups remain separate. Original outline, orbital/nasal holes, teeth and jaw geometry stay present; no full-image blur is added.

Geometry remains2435 vertices and4548 triangles per skull. Each face submits3 vertices/27 floats instead of6 vertices/60 floats. The CPU diagnostic fallback uses averaged normals/opaque fills and is not asserted to have identical antialias quality. Glow and fluid compositing remain the existing downstream operators.

## Validation and limits

Run unit motion-strength/surface-normals/operator-contract/app-control-api, browser motion-surface/surface-quality and the existing resource/input/count/presence/security checks. Surface-quality measures the actual shared-edge alpha and72 count/glow/yaw combinations. Real-time comparison uses production clocks and original captured frame timestamps, with sequential recordings; capture cadence is not a performance benchmark. Local QA images and private original-source traces remain outside Git. Release validation metadata records the final ZIP hash and measured runtime evidence.

This is a local Windows/Chrome preview. Physical projector, other hardware, complete TouchDesigner noise equality and general public/commercial asset licensing are not established by these checks. The original TOE was only statically read and SHA256 checked; it was not executed or changed.
