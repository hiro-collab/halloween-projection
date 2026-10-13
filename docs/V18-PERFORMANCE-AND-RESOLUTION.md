# 0.1.18の負荷と原/Webの計算解像度

2026-10-13。ユーザーの「重い」「point spriteを大きくしていないか」「全部CPUか」という質問への現状測定。測定のための画質変更/解像度変更/最適化は実装していない。

0.1.17/8737f2dは流体のCPU演算だった。時間積分の修正依頼を受けた後、0.1.18作業版で流体を自作WebGL2 float演算へ移した。今回実機Chromeの `backend=WebGL2-float` を確認。ドクロの頂点変換・深度ソート・照明計算・Canvas2D三角形描画はCPU/Canvas経路、Blur/合成はWebGL2。全部CPUではない。

## 現在の主要時間

製品と同じ内容の計測用コピーに区間タイマーを追加。GPU query有効/無効を別保存し、通常のCPU区間値はquery無効の結果を使う。各値はCPUで観測した経過時間で、GPU待ちを含む。GPU実行時間だけと混同しない。

|区間（1描画の平均ms）|A1組720p|A1組FHD|A6組720p|A6組FHD|
|---|---:|---:|---:|---:|
|頂点変換|.18|.14|.69|.75|
|深度ソート|1.36|1.31|7.50|7.27|
|照明/Canvas三角形描画|6.72|6.97|45.67|41.01|
|頭の前処理・Canvas upload・同期待ち|23.51|25.13|128.93|138.51|
|処理済み頭→流体GPU転送|.41|.41|.40|.45|
|固定tick solver command submission|6.11|5.35|14.74|13.50|
|dye readPixels・R成分抽出|2.52|4.78|6.86|7.67|
|Blur/Glow/文字/三枝/finalのsubmission|5.50|4.49|4.37|4.32|
|最終Canvasコピー|.12|.09|.09|.11|
|全体|46.43|48.68|209.25|213.57|
|実描画/s|20.89|20.31|4.76|4.67|

文字maskの再描画は未変更時にcacheされ、平均ほぼ0ms。6組720pの約62%が頭前処理/upload/待ち、約22%が照明/描画、約4%がsort。FHDは約65%/19%/3%。**頭の画像生成と取り込みが主要因**。単に頂点数やsolver格子が多いという説明では足りない。

別のGPU timer runでは、6組の頭前処理GPU区間が約11.9〜12.1ms、post約40.9〜41.1ms、solver約3.6〜4.2ms/描画。CPU側の129〜139msを頭shader単独の時間とは言えない。Canvas2Dの描画完了、画像転送、前のGPU処理待ちを含む同期区間が大きい。GPU時間をCPU表へ加算しない。

計測コピーだけの劣化ではないことも確認。変更していない製品で6組を再測定し、720p5.04/FHD4.93 draw/s、39.93/39.40 solver tick/s、約2.4秒中.75/.80秒を破棄した。8tick上限により、この負荷では実時間より流体が遅れる。先の短い6組検証では10.43 draw/s・59.71tick/s・破棄0だった。姿勢・経過状態・実行時負荷による差の切り分けは未完で、速い方だけを通常性能としない。

Bは今回720p55.98/FHD55.81draw/s。CPUで観測した描画submissionは2.83/2.61ms：姿勢.44/.37、40sprite描画.66/.63、circle色/画像upload1.06/1.05、fire/noise/text.40/.36、final copy.24/.17。GPU完了全体の時間ではない。Bの小画像が今回のA6組の遅さの主因という証拠はない。

## 解像度と処理量

|対象|原の根拠|Web720p / FHD|
|---|---|---|
|bat保存1frame|tex3d cache60×160×90×RGBA|同じ160×90、60枚。1個の1600×540 atlas bitmap|
|bat個体/描画|Webは原の40instance契約を使用。元ライブ総particle数は今回未採取|40 image draw/描画。生存particleは最大約25を40instanceへ割当|
|bat screen rectangle|保存size1/size2=.24、Web orthowidth1.26。原最終の全scaleは今回未再実測|size1時、約244×244px / 366×366px（回転前）。160×90をCanvasで1回再サンプル/instance|
|B raw/色/final buffer|render1の保存値1280×720、実値はInfo(null3=in2)に依存。ライブin2寸法は未確認|1280×720 / 1920×1080。cap1920×1080|
|B quarter glow/mask|quarter/preshrinkを静的確認。今回は全B live段を再採取していない|320×180 / 480×270|
|Aドクロraw/render|render1固定1280×720。native同CC0比較も1280×720|1280×720 / 1920×1080、DPRを掛けない。FHDは2.25倍の画素|
|A geometry|原1組は頭78343/顎50678 points。primitive数は三角形数と同一視しない|2435vertices/4548trianglesを共有。6組14610 transformed vertices/27288triangles|
|A color格子|640×360=230400 cells|同じ。60固定ticks/有効秒を目標|
|A velocity/pressure格子|100×57=5700 cells、pressure1pass|同じ。GPU velocity/pressureはRGBA32F paddingで、native RG/monoよりchannelが多いが小格子|
|A flowColor|native640×360|同じ640×360|
|A head gain/strong/edge/overlay/flowHue等|native1280×720|1280×720 / 1920×1080|
|A headGlow出力|native80×45|80×45 / 120×68|
|A headBlur出力|native1280×720、preshrink2|1280×720 / 1920×1080、作業640×360 / 960×540|
|A textBlur出力|native160×90、preshrink4|**1280×720 / 1920×1080**、作業40×23 / 60×34。出力は原より64倍/144倍の画素|
|A text Minimum/Level|今回の同入力native参照は1280×720|1280×720 / 1920×1080。textBlurと区別|
|A front/radial|native320×180|320×180 / 480×270、6組は3枝×134sample|
|最終Canvas/DPR|原の出力window拡大と内部TOP寸法は別|今回DPR1で1280×720 / 1920×1080。コード上は最終CanvasだけDPR最大1.5、内部targetはCSS寸法|

Aの格子はviewportを大きくしても増えていない。一方、Webの多くの画像処理はviewportへ連動する。元の固定1280×720をFHDでも維持して最後だけ拡大する構成ではない。原より大きくしている段がある。

三つのradialは720pで23,155,200、FHDで52,099,200のsample/描画。Bのframeを160×90以上のbitmapへ作り直しているわけではないが、最終画面のpost処理は大きい。

## 毎描画の再計算と転送

- Aはflow clockが変わると、姿勢を固定していても頂点変換・sort・照明/三角形・head前処理を再計算する。頭画像を独立cacheしていない。
- A前処理でraw CanvasをRGBA8 textureへupload。処理済みWebGL Canvasを別の流体WebGL contextへ取り込む。1画像3.6864MB/8.2944MB相当の寸法で、実際のCPU/GPU転送方式はbrowser依存。
- 流体colorはRGBA32F640×360をreadPixels（3.6864MB）、CPUでRへ抽出（.9216MB）、compositorのdyeBufferへ再コピーしR32Fへupload（.9216MB）。同一GPU textureをそのまま参照していない。
- glyphはCanvas再描画をcacheするが、GPUへのglyph uploadは毎描画。頭と同じ画面サイズ。
- Blur scratch2枚を4つのBlur呼出で再利用し、1描画8回texImage2Dでstorageを確保し直す。dyeのtexImage2Dも毎描画。
- 装飾noiseが明示ゼロのA比較でもdeco blurを計算している。その枝の不要計算候補があるが、今回まだ変更していない。

次の確認/最適化候補は、頭画像のcacheとGPUへ渡す経路、Canvas2Dの多数の半透明三角形、R32FのGPU間連携、原の内部解像度への固定、zero-noise枝/不変glyph upload/Blur storageの再利用。画質を勝手に下げず、原寸法・同入力外観・実時間状態を再検証して採用する。

証拠：`output/a-v18-performance-20261013/summary.json`（queryなし）、`with-gpu-query-summary.json`、`production-load.json`。原Aの寸法は `private/timeline-20261012/a-integrated-single-zero-20261013/capture/stages.json`、Bは保存nodeとatlas採取台帳。既存TD3936を保持。製品コード/ZIPは測定のためには変更していない。
