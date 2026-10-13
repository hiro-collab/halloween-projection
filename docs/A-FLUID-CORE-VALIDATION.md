# 原A流体coreの一段階 — 0.1.14

2026-10-13。原の実TOP接続から流体solverを独自CPUコードへ実装し、ブラウザで原fluid/colorの赤いscalar出力を検査できるようにした。**原A最終映像/背景文字の再現合格ではない。** 時刻0のnative速度場を固定した私的比較で、動的noiseは未移植。

## 原入力→出力の対応

|原の枝|今回の対応|
|---|---|
|頭render→base2/level4 brightness .96/gamma1.02→res1半分→base3/math1 gain .2→reorder1 red|CC0候補画像から色注入。厳密数値比較では原reorder後の同じ注入画像を直接使用。GUI前処理の順序/補間は別残差|
|base3/noise1→reorder2 RG|Amp1.08/Period1.06/tz0の実評価RG100×57を固定参照。22,800-byte half-floatで全値一致。数値参照はMIT外、private限定|
|feedback_velocity+External_velocity→curl→vorticity×5.62×1/60→add4|float32格子で同じ順序を実装|
|divergence→pressure→gradient→sub1|pressureは実評価1pass。前pressureから1回Jacobi、raw pressure勾配を速度から引く。圧力feedbackは.9999倍|
|glsl_advect2→math6|投影速度で自身を逆追跡、velocity feedbackは.999倍|
|glsl_advect1→math5|移流後・減衰前の速度で色を逆追跡。逆解像度は速度格子100×57、色feedbackは.95倍|

実評価：色640×360、速度/圧力100×57、linear入力filter、GLSL inputextenduv=zero、pressure passes=1。原divergenceの上下境界条件はx成分を判定する式を保持した。pressureを40回へ増やすなど、見た目のfitはしていない。

Raw GLSL原文はGit/配布へコピーしていない。原モデルも追加していない。現在の表示はcolorノードの値をRGBへ可視化した検査表示で、別の炎エフェクトではない。UI/APIのskull3d fluidMode=1で選択でき、既定0は旧3D比較を維持。

## 有限数値比較と残差

既存署名済みTD2025.33230で、同じCC0画像/同注入画像/速度場tz0/Delta1/60を63callback採取。1/2/10/30/60の全格子を保存した。最後の原枝エラーは空。
原1/2callbackはcolor/velocity/pressure/curlが全格子同一だった。比較の初期位相を分離し、原10/30/60をCPU9/29/59へ対応させた条件付き比較を行った。**開始時計と通常自由運動の一致を証明していない。**

1step：curl max差0、vorticity/divergence約1.19e-7、pressure約2.98e-8。移流後の差が主に残り、補間重みを256段階にした候補で速度MAE約.000206→.00000828へ縮小。これは採取GPUの補間候補で、一般的なTDの仕様と断定しない。

位相を分けた59step（原60callback）でcolor max約.02308/MAE4.54e-5、velocity max約.4251/MAE.01837、pressure max約.07755/MAE.00439。未一致を保持。範囲内をedge保持とする別仮説は誤差を悪化させたため撤回し、zero境界のbilinear候補へ戻した。

未整列の最初の試験は2step以降大きい差があり、原の重複開始と補間を分離せず採用していない。結果は別名保持。

## 負荷・資源・原支点修正

流体GUIの10件は合格：選択、原格子、非空表示、Pause、paused Reset、無効化、20回再構築、Stop/Resume、Endのbuffer/encoded参照解放、pageerrorなし。所有float/ImageData buffer **4,972,800 bytes**、停止後0、live scope最大1。
このPCのGUI検査で約25.3step/秒、計算平均約22.4ms/max28.8ms。各描画でDelta1/60の1step、描画30Hz上限の診断モードであり、原60Hzの実時間再現は未達。GPU移植/最適化は次段階。

独立レビューで指摘された原顎支点0の経路は、別ローカルcheckpoint **8150bee** で修正。原支点21/旧仮支点20合格。原登録座標0の選択と候補Y範囲拡張で、同CC0の顎30下端538→525（原素材529）、複合45下端539→510（原516）。全体登録/素材データを変えず支点寄与を分離した。[支点対照](A-ORIGINAL-PIVOT-VALIDATION.md)

## 背景文字と最終合成の確定済み配線・未実装

文字はroot in4/null9→texter/select1/res2。背景はtexter/in1→res1 eighth→Blur preshrink4/size21。Minimum(backgroundBlur,glyph)→brightness5/gamma2.02→Overで、元背景を前・文字を後ろへ置く。
原base3のSobel/HSV172/224、base2の頭のBlur/Level/HSV/threshold/outside、fire_wrap条件分岐、Cross(add,over)、root radial-blur/math3前景→最終level3も別に存在する。**これらの後段色/光/文字は今回のGUIへ未実装。** 原final文字マスク3条件を私的採取したが、再現合格とはしない。

次は原Feedbackの開始frame/Resetを明示採取し、移流だけを同じ投影速度入力で比較して補間残差を確定する。先に色/炎風の演出で差を隠さない。その後、上記後段と文字枝を同入力で取り込む。

証拠：private/a-fluid-static-20261013/graph.json、private/timeline-20261012/a-fluid-native-wired-20261013の63callback/5格子snapshot/3文字条件/評価値。output/a-fluid-core-final-20261013の全格子誤差、output/a-fluid-gui-final-20261013の10件、output/a-fluid-gui-20261013/scalar-colour.png。
失敗コピーを保持：親base2欠落、CHOP in/out adapter欠落、custom定義/保存値順による既定値化。最終組立では必須adapter5ノードをassertし、640×360/Vorticity5.62/必要channel数で有効値を検査した。

元TOE/CC0 binary/既存ZIP/TD3936を保持。新GPUや契約/権限変更なし。外部送信/pushなし。A形状/照明/6組/動的noise/文字、B乱流/部分age/最終外観/10秒境界/スマホ通信UIは未完。

最終回帰：旧3D18、B入力22、14asset保存15、合格。保存一覧のa-fluid.js欠落でsaved判定がfalseだったため一覧だけ修正し、所有QA scopeのみ解除して再確認した。通常browser再起動/旧版更新/物理切断は今回未実施。
最終ZIP241943 bytes、build0.1.14-a-fluid-core-preview-abfeaad37477、SHA256 `2831a14908c28b9613ffff263a2998375c81979e7ecbe44ec26a5bc90fa62290`。15file/14cache asset、CRC/全展開byte一致。
