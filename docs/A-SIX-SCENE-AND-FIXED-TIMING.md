# 六組構成と固定刻み流体 — 0.1.18

2026-10-13。0.1.17独立レビューの「同じ1秒でも描画回数で流体量が変わる」「800ms停滞後の大きなDelta一括更新」を優先して修正し、六組の画面構成と統合したローカル比較版。原全体の再現合格ではない。

Current role: Halloween Web app delegated implementer.
Formal owner: local implementation and verification only.
Authority source: 最新の六組実装依頼と、固定step/catch-up上限を優先する追加依頼。
Superseded/stale signals: 0.1.17の実時間カウンタ改善だけを流体動作の一致とする評価。
First safe action: 原の六組/前景配線を静的確認し、既存fieldとCC0モデルのまま実装する。

## 「六組」が指すもの

原 `skullfluid/base1/render1` のgeometry指定は `skull*/*`。`skull1..skull6` の各組に頭geo2と顎geo1があり、計12geometry。共通の親null1へTx/Ty/Tz・XYZ回転を与え、顎には別のX回転を与える。各組の親pivotは(0,-.5,0)、顎局所pivotは原点。motionMatのnum=6、6×3のTOPをCHOPへ変換し、行0RGB→移動、行1RGB→親回転、行2R→顎、個体番号−1のsampleを読む。

移動倍率3.31、親回転マッピング0..180、顎マッピング0..30を確認。保存された個体の各7入力は全てEXPRESSION。cloningは1/3/5がon、2/4/6がoffで一様ではない。Webは同じCC0別候補を共有し、6組の独立変換を描く。原modelとの同一性やclone内の全設定一致とは呼ばない。

前景は3本ある。circle1..3はPos4..6、trim sampleは0/2/4（1/3/5番の個体）。radialBlur1..3の中心はPos1..3、sampleは0/1/2（1/2/3番）。この違いを統一しない。circleはfrom0..10→0..1で得た相対中心にimage中心.5を加え、radialはfrom−5..5→0..1。native Math CHOPの既定to range=0..1を有限実行で確認した。

0.1.17は1組・1本のみ。0.1.18では6組を同じ深度順に描き、共通renderを同じ流体へ注入する。前景3本をそれぞれmask/radial処理し、Over→gain1.3→背景Over→final Levelへ渡す。modelのbinaryは61068 bytesの1コピーのまま、描画は27288 triangles。追加scratchと前景textureは1組へ戻すと解放する。

UIの「原Aの6組構成で比較（動きは候補）」、または `halloweenControl.set('skull3d','aSceneMode',1)` で選ぶ。初期値は旧1組。`setActors('skull3d', sixPoses)` はposition/rotation/jawの6個の入力を検証し、コピーして保持する。positionは各±5、rotationは各±360度、jawは0..90度。不正値は変更せず拒否。`null` で自作周期候補へ戻る。入力を保存しない。

既定の動きは自作の周期候補。原Noise TOPやfaderの出力を採取・埋込みしたものではない。原の画面が固定の二段グリッドだったという意味でもない。検証用の二段六姿勢は、こちらで作った固定入力である。

## 時間積分の仕様

|項目|GPU通常経路|GPU不足時のCPU経路|
|---|---|---|
|実積分の刻み|1/60秒で固定|同じ1/60秒|
|1描画で進める最大回数|8|2|
|受付時間の上限|.25秒|.25秒|
|上限を超えた分|破棄しdroppedSecondsへ明示|同じ。処理不足なら実時間より遅くなる|
|端数|1刻み未満を保持|同じ|
|Pause/hidden|計算を止め、復帰時の最初のRAFはelapsed0|同じ|
|Reset|時計/field feedbackをクリア、2回のcold cookを維持|同じ|

GUIは `advance(elapsedSeconds)` を呼ぶ。各tickの注入・拡散・外部速度加算・圧力・移流は必ず1/60で進み、描画回数で注入回数を変えない。800msを1つのDeltaにはしない。通常経路では8tick=.133333秒を実行し、約.666667秒を破棄する。無制限の追いつきや、破棄分を進んだ実時間カウンタで隠す処理はない。

CPUの同演算を60回/秒実行すると負荷が大きいため、既存の自作CPU式をWebGL2 float targetへ移した。原shader原文や新noise画像は追加していない。640×360 scalar、100×57 velocity/pressure、1 pressure pass、補間の量子化、境界の扱い、拡散値を維持する。初回shader準備はactive時計の前に有限warmupで支払う。旧CPU `create()/step()` は比較用に残す。GUIはGPUを選び、対応しない環境では上記のCPU上限経路へ戻る。

**動く頭の入力画像はまだ描画時にサンプルしている。** 固定入力でのsolver状態は描画頻度から切り離されたが、異なる描画頻度で動く入力まで同じ軌跡を注入する保証はない。次は入力の描画/サンプルも固定時計へ移す必要がある。sourceの動的速度noiseも未実装で、既存のtz0 fieldを使う。

## 検証

- 自作六姿勢・同じCC0登録を、原の親/顎階層と同じカメラでnative描画。4callbackで通常終了、render errors空、noise出力は採取していない。12行列と入力/mapping等19項目合格、最大行列差8.74228e−8。六姿勢のnative画像は原全時間画面ではなく、同条件の私的比較。
- 六組GUI10項目合格。六個体それぞれの領域にgeometryが見え、12geometry/27288triangles、共有model1個、独立入力、三枝、1組へ戻した資源、Stopを確認。
- 固定時刻10項目合格。1秒を60/30/10回の描画で入力更新しても、60tick後のscalar最大差0。800msの処理は8tickの対照と最大差0。8tickのCPU/GPU比較はscalar mean1.17249e−7/max.00197387、velocity mean.00013632/max.0123215、pressure mean.000033039/max.00226212。数値の完全一致とはしない。
- 六組の実描画10.43/sに対して実solver59.71tick/s、2.1103秒測定で破棄時間0。GPUのsubmission平均をGPU実行時間全体とは呼ばない。60tick＋readbackの検証は約46〜49msだった。
- Pause、visibleな800ms stall、Reset、Stop、可視状態ハンドラの復帰を確認。別の自己所有タブを前にしても制御環境が対象pageをvisibleに保持したため、実タブhidden確認は不採用。隠れる/戻るハンドラは復元するfixtureで確認し、実タブ切替の合格とはしない。

保存：`output/a-v18-six-timing-20261013/` のsix-fixed.png/six-moving.pngと各QA、`private/timeline-20261012/a-six-cc0-20261013/` のnative/元parameter modes/Math既定。画像と原のnode資料はGit/ZIPへ追加しない。tests/a-scene-golden.jsonは自作固定入力の数値行列だけで、原geometry・原motion sample・画像を含まない。

## 残件と実装優先順

|順|残件|現在の欠け方と次の作業|
|---|---|---|
|今回|六組・時間積分|6組/12geometry/前景3枝と固定刻みGPUを追加。同じ固定入力の状態差を解消。生成する動きは候補|
|1|固定tickの入力/原motion/fader|頭の入力画像は描画毎。GPU頭描画または固定tick用入力生成で、動く入力のFPS差も減らす。原motionMat/fader/Reset/absTimeとの対応を確認|
|2|照明/alpha/白つぶれ|face-normal/view-alpha候補。原point normal・材質・premultiplyの対応を確認。0.1.17の訂正同入力ではnative白8410に対しWeb11501で残差。六組/三枝では重なりも増える|
|3|Blur/Edge/float合成|原Catmullに対しGaussian、Edge正規化未一致。三枝RGBA8と原floatの差もある。入力/出力解像度とkernelを切り分けて修正。前のCatmull一括候補は悪化し不採用|
|4|動的velocity/deco noise|既存velocityはtz0、decoはゼロ。下記の手続き生成の未確定点を解決。RGBA埋込みを代替手段にしない|
|5|B原飛翔・最終合成|原乱流、部分age/RNG、粒子配置/向き、光むら/文字、10秒境界が残る。旧B入力API/描画は今回変更しない|

## 動的noiseの未確定点

motionMatはbuiltin Noise TOPを3枝使う。移動seed1/period.05/harmon0/amp.2、回転seed2/harmon0/amp.28（保存で省略されたperiod/typeの既定は未確定）、顎seed3/period.12/exp4/harmon0/amp2。RGB別、tz=absTime.seconds、横6sample。head/jawのFeedback/faderとCross/Resetがその後にある。noise式だけでは保存時の動き全体を再現できない。

velocityの別Noise TOPは既存の時刻0 RGだけを保持。decoはSimplex3D、seed1、period2、harmon3、spread1.7、roughness.5、exp.21、amp.55、offset.249、mono RGB、random alpha、inputscale0。これは外部画像ではなく手続き生成TOPと確認済み。

残るのはseed/permutation/gradient、pixel座標の中心・正規化・aspect、XYZの時間軸/period、octave数と正規化、exp/amp/offsetの順序と範囲、RGB別seed、random alphaの時刻更新、旧buildと現buildの既定差、fader初期状態とReset/absTimeの関係。生成式の自作実装を同条件で比較する必要がある。拒否されたRGBAの埋込みは再実行/迂回していない。新しいnative noise/pose sample payloadもWebへ追加していない。

## 文字の区別

239字8行のglyph maskが画面内に収まることは0.1.17以降のUI修正。原Aの文字は流体とのMinimum後、頭の後ろへ合成するため、暗部や頭と重なる部分は読めないことがある。maskの画面外クリップ、背景としての意図的な合成、原との見えの差、全文可読性を分ける。全文可読の合格は主張しない。

公開/push/新規契約/権限拡大/セキュリティ解除なし。元TOE、旧ZIP、既存TD3936を保持。

## 最新の負荷確認と保存

後続の重さの質問で、[段別時間・原/Web解像度](V18-PERFORMANCE-AND-RESOLUTION.md)を実測した。六組の製品再測定は約5draw/s・約40tick/sとなり、約2.4秒中.75〜.80秒を破棄。上記の速い短時間測定だけを通常性能とはしない。遅い環境/状態で60tick/sを維持する点は未合格。画質低下による対処や、新たな最適化は測定前後に開始していない。

GUI回帰146項目、numeric317項目（旧sampling280、旧rig10、B入力8、六組19）合格。保存/通常offline/六組offlineも確認。六組offlineの最初のprerequisite判定は保存状態の非同期初期化前だったため、状態待ちを追加し4項目を再実施して合格。実タブhidden遷移・物理ネット切断・通常browser再起動は今回未検証。

ZIP `dist/halloween-projection-web-v0.1.18-six-scene-fixed-step.zip`、256481 bytes、build `0.1.18-six-scene-fixed-step-4c4efa6abfa8`、SHA256 `0c293fefdc4d20a441c18d568e155f368598d3692eab7f17c12be1d5919f07db`。16files/15cache assets、CRC/全展開byte一致。結果は `output/a-v18-regression-20261013/`、性能は `output/a-v18-performance-20261013/`。旧版と既存model/field payloadを保持。
