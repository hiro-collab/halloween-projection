# 原A流体の開始・Reset・補間 — 0.1.15

2026-10-13。0.1.14を保持し、開始/Resetと移流補間を最小入力へ分離。原の時刻可変速度場も入力して比較した。**動的noise生成器、原A最終映像の一致・60Hzの実時間再現は未達。**

## 最小入力から確認した範囲

署名済み既存TD2025.33230で、独自8×4 ramp、2×2 one-hot、halfway tieを各7条件採取。原の移流shaderは私的probeだけで使用し、Git/ZIPへコピーしていない。保存するgoldenは独自入力と測定出力のみ。

採取GPUでは軸のfractionを1/256へ丸め、対角重みw11を1/256へ丸め、残りを `w10=sx-w11, w01=sy-w11, w00=1-sx-sy+w11` とすると21条件/1120値の最大差5.96e-8。256個の別座標でconstant=1を保持する試験も合格。zero境界を保持。これは採取環境の観測で、全GPU/全TDの仕様とは断定しない。

4つの重みを独立にMath.roundする最初の案は、tieで重み合計が1を外れ、長時間の全格子誤差を増やしたため不採用。大きい格子ではvUV/座標・float演算の残差がある。Delta×速度×float32逆解像度の乗算順序も合わせた。

## 開始とResetを明示

1-pixelの直接Feedback試験では解除時の1cookがcold。原fluid全接続では親パラメータ経由のResetを解除した後も**2cookがcold**だった。原3/4callbackのcurlはExternal_velocity単独のcurlと全値一致し、5callbackから原4callbackのvelocityを取り込むことを確認。単に結果のframe番号をずらしていない。

solver作成/Reset後と `setReset(true→false)` に、この原fluid固有の2cold cookを明示。Reset保持中は毎cook前の色/速度/圧力feedbackをゼロへ戻す。`steps` は実計算回数、`feedbackSteps` は現在のfeedback連鎖長、`resetReleasePending` は残るcold cook数。一般的な直接Feedbackの挙動と混同しない。

## 時刻固定なしの速度入力比較

原Noise Amp1.08/Period1.06の `tz=absTime.seconds` を維持し32callback分のRG100×57を毎callback採取。Resetをcallback1/2で保持し、2終了後に解除。ブラウザも同じReset状態と各callbackの実測RGを使用。Deltaは双方1/60固定、色注入は同じ原reorder後画像。**noiseをブラウザで生成した試験ではなく、時刻可変入力を使うsolver部分の比較。**

absTimeは実際に変化し、起動/保存負荷でabsFrameの欠番もある。callback数は実秒数ではない。同じcallback番号で比較し、phase offset=0。原の枝エラーは空。

|原callback|色 max / MAE|速度 max / MAE|圧力 max / MAE|
|---|---|---|---|
|4・解除後2番目のcold cook|0.0003784 / 6.45e-8|0.003844 / 4.90e-6|2.98e-8 / 3.26e-9|
|12|0.001743 / 1.67e-6|0.03681 / 0.0004637|0.003376 / 9.59e-5|
|22|0.002099 / 4.06e-6|0.07911 / 0.001715|0.009100 / 0.0003581|
|32・feedback連鎖29|0.003277 / 6.83e-6|0.4210 / 0.003882|0.04747 / 0.0007867|

これは同じ格子の残差で、原の自由運動全体の合格ではない。callback末尾でResetを変更した第一試験、1cold実装の第二試験は別名保存し、基準へ採用していない。

別の時刻0固定試験も、原1/2/10/30/60とCPU同番号で比較。60callbackの色 max0.02022/MAE2.85e-5、速度 max0.68597/MAE0.01280、圧力 max0.13915/MAE0.003359。0.1.14の位相を分けた比較よりMAEは下がったが、速度/圧力のmaxは増加。一般的一致・全残差改善と呼ばない。

## 色枝を一段だけ接続

原 `base2/base3/base2/math2 gain .96 → reorder2 RGBA8 → hsvadj2 hue224` のRGB枝を `skull3d.fluidColor=1` /「原の青色の枝を比較」へ接続。独自8×4 scalar入力32pixelのnative RGBと最大1byte差。既定0は赤いscalar表示。

Sobel strength5.31/HSV172の縁、色枝のluminance alpha、後段の頭の照明/Blur、threshold/outside、Cross、背景文字、最終合成は未実装。現在は不透明なRGB検査表示。原最終色や原モデルと同一とはしない。

## GUI負荷・資源と証拠

GUI13件合格：色枝の共通API、格子、表示、Pause/Reset、20回再構築、無効化、Stop/Resume、2cold挙動、不正入力拒否、End解放、pageerrorなし。2.511秒の別counter測定でsolver **22.70step/s**、頭/流体の描画 **22.70draw/s**、RAF callback **22.70/s**。同じcounterからfpsを推定していない。solver平均26.42ms/max42.30ms。所有float/ImageData buffer4,972,800bytes、停止後0、live scope最大1。

入力field override `setExternal(Float32Array(11400))` は私的比較用。動的採取データはZIPへ追加していない。GUIは既存の時刻0固定fieldのまま、MIT外・private限定。型/長さ/非finite値を拒否する。

証拠：

- `private/timeline-20261012/a-sampling-reset-clock-20261013`、`a-sampling-weights-20261013`、`a-sampling-ties-20261013`：有限最小入力、実Reset、実GPU重み。
- `private/timeline-20261012/a-fluid-dynamic-early-reset-20261013`：32callback、時刻/Reset/実Feedback記録、移流前後と全格子。
- `output/a-fluid-source-reset-release-v15-20261013/result.json`：同callback動的field比較。
- `output/a-fluid-frozen-start-v15-20261013/result.json`：明示開始の固定field比較。
- `output/a-fluid-gui-counter-v15-20261013/a-fluid-gui.json` と `scalar-colour.png`：13GUI件、青色枝、別counter負荷。
- `tests/a-fluid-sampling-golden.json`、`tests/a-fluid-sampling.qa.cjs`：280合格、原restricted画像/モデル/shaderなし。

既存TD3936、元TOE/CC0 binary、旧ZIPを保持。各追加TDは所有ファイルを照合して正常終了。外部送信・push・権限変更なし。次は残る座標/float差と、noise生成器・Sobel/alpha・頭の照明・背景文字を同入力で取り込む。B乱流/部分age/最終外観/10秒境界も未完。


最終回帰：原支点21、旧3D18、B操作22、14assetオフライン保存15、すべて合格。通常browser再起動/旧版更新/物理切断は今回未実施。再利用QA profileの保存済み状態で初期opt-in判定のみ14/15となった試験も保存。所有scopeだけ解除して初回状態から15/15を再確認した。
最終ZIP242945 bytes、build `0.1.15-a-fluid-reset-preview-f1e0577531be`、SHA256 `024b33813d8386e8fde571b054b4b7c7915e0e599d001b3c2a4499e7d6c56648`。15files/14cache assets、CRC/全展開byte一致。`output/a-v15-regression-20261013/confirmed-checkpoint.json`に条件と結果を保存。
