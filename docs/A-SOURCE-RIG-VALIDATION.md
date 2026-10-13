# 原Aの配線と頭・顎4姿勢の私的比較

2026-10-13。部品・支点・時計・流体枝・文字の合成順を静的確認し、頭/顎のみ既存TouchDesignerで有限実行した。**原A全体の再現合格ではない。Webは52c67a0/0.1.11を保持した。**

後続の[0.1.12位置合わせ・独立顎支点](A-RIG-REGISTRATION-VALIDATION.md)で、閉姿勢の54pxずれを補正し同じCC0のnative/Web4姿勢を確認。この文書の最初の仮登録と失敗記録は保持する。

## 保存元と実行範囲

原全体TOEは27,230,064 bytes、SHA256 `f5254beb016b52e36c269c1d5a857e78e5beacc5fd8d4162a074cf16d3c54094`。独立コピーを公式toeexpandで展開し、8,438ノード/17,511ファイルを読んだ。原本ハッシュ不変。展開終了値1だが、完了ログ/TOC/ファイルを確認した。

ドクロA本体は `main_visual_mixer_comp/skullfluid`（mixer switch1の入力4）。`skullfluid1`（入力6）は別流体枝。原A本体は保存時cook off。

実行コピーは頭/顎locked SOP、1組のgeo、親null、材質、camera/light/renderに限定。帽子/FBX/外部texture/原callback/流体は含めず、信頼できる採取DATだけを追加。署名Validの既存TouchDesigner 2025.33230で1280×720を描画でき、ライセンス不足の停止はなかった。4姿勢×原/CC0の32callback後に所有コピーだけ通常終了。既存TD3936を保持。

原モデル/原atlas/原shaderの再配布条件は未確認。TOE、geometry、shader原文、原PNG/採取データはignored private内のみで、Git/配布ZIP/Libraryへ含めない。外部送信/push/公開なし。

## 原の頭/顎と時計

以下は `skullfluid/base1` 内。

|部位|入力と変換|確認値|
|---|---|---|
|頭|base3/filein1→out1→skull1/in1→geo2/in1|locked 78,343 points / 78,313 primitives。geo2局所回転0|
|顎|base3/filein2→out2→skull1/in2→geo1/in1|locked 50,678 points / 50,644 primitives。独立X回転|
|共通親|geo1/geo2の3D親null1|pivot `(0,-.5,0)`、Tx/Ty/TzとXYZ回転を共有|
|顎自身|geo1のpivotは既定原点|noise2+Jaw→limitでX角0..90度|
|材質|phong1|diffuse RGB=.4、emission RGB=.5、shininess157|
|カメラ|cam1/render1|位置(0,0,90)、perspective/FOV6.4、1280×720/aa1。FOV軸の明示採取は未実施|
|個体|skull1..skull6|cloning設定は一様でない。今回は1組のみ|

原頭bbox: X[-.65785,.65783], Y[-.77739,.83664], Z[-1.07409,.78860]。原顎: X[-.59455,.59487], Y[-1.14582,-.24633], Z[-.19779,.71116]。primitive数を三角形数とは呼ばない。

motionMatのnum=6。TOP画素をbase1/topto1でCHOPへ変換し、行0RGB→Tx/Ty/Tz、行1RGB→Rx/Ry/Rz、行2R→Jawへrename。移動はGain、親角0..180、顎入力0..30へ変換。

motionMat noise1/2/3のZはabsTime.seconds。移動noise1はperiod .05/amp .2、回転noise2はamp .28、顎noise3はPeriod .12/Exp4/amp2。head/jawのfaderは別Feedback枝でCross/Resetが上位へ結び付く。省略されたnoise2 periodとFeedback初期状態の実評価は未採取。

各skull内の親回転noise1は保存時bypass on、顎noise2/pivot noise3はamp0。上流信号が角を決める。タイムライン600frame/60HzとabsTimeは別時計。今回角度を直接固定しており、運動noise/fader Reset/10秒境界の検証ではない。

## CC0候補との同入力4姿勢

[CDmir Human Skull](https://opengameart.org/content/human-skull-0)のCC0-1.0別候補。archive/OBJ/変換データの権利とハッシュは[既存台帳](CC0-SKULL-TRIAL.md)を継続。今回は同じembedded geometryから頭2,656/顎1,892 trisをOBJ化し、未参照頂点を除いて1403/1024 points。原モデルと同一とは呼ばない。

両形状に同じnative親階層/角度/材質/カメラを適用。仮登録は閉じた全高のuniform scale **.6951803205** と、候補の仮顎支点(0,-.75,-.12)を原顎原点へ寄せる移動Y=.75s/Z=.12s。採用値ではなく、既存候補支点の適用可否を調べる仮説。

|親XYZ角 / 顎X角|原前景範囲 `[left,top,right,bottom)`|候補前景範囲|
|---|---|---|
|0,0,0 / 0|557,254,723,507|555,200,725,452|
|0,0,0 / 30|557,254,723,529|555,200,725,483|
|0,90,0 / 0|503,254,740,506|520,199,745,451|
|20,45,15 / 45|515,252,729,516|530,198,734,488|

8/8画像は非空。各ペアの頭/顎/camera world行列max差0、Renderエラー空、1280×720。顎30度では頭行列不変、閉じた顎は共通親と回る。4姿勢を目視した。両者native Phongで描画したので、現在WebのCanvas2D材質とは別比較。

**仮登録は不採用。** 全高は揃うが候補が約54px上へずれ、顎30度の下端移動は原22px/候補31px。眼窩/頭蓋/顎の比率も異なる。同じ行列は形状一致を意味しない。Web候補の独立顎pivot/Y軸親回転/追加offset/orthographicから、原の共通親pivot/XYZ角/顎局所原点/perspectiveへ、数値のコピーだけでは対応できない。

## 流体と文字（静的確認）

実流体は `skullfluid/base2/base3/fluid`。B Sparse場とは独立した2D feedback solver。color/velocity/pressureのFeedback、velocity RG32float/pressure mono32floatを確認。
隣接速度からcurl→vorticity、divergence→Jacobi pressure→pressure勾配を速度から減算、velocity/colorの逆追跡移流へ続く。deltaはabsTime.stepSeconds。

保存overrideはVorticity5.62/pressureDiff .9999/colorDiff .95/velocityDiff .999/Gradient1/color640×360。velocity custom既定100×57。実runtime解像度、省略passes、初期化/補間/境界は未採取。divergence上下境界判定は原式でx成分参照がある。比較前に修正して別物へ変えない。原shaderは配布へコピーしない。

頭/顎renderはbase2のcolor/velocity注入側へ渡る。文字はroot in4→null9→base2/fire_wrap/texter/select1。Minimum/Blur後Levelはbrightness5/gamma2.02。Bのbrightness3を確認なしに流用しない。
最終over1は入力0にドクロradial-blur/math3、入力1に流体/文字後段base2/out1、level3 brightness1.03/gamma1.1→out1。ここは今回未実行。空文字/二行/長文、alpha/合成、流体付き原最終出力は未検証。

## 次の具体的な実装点

1. A頭/顎の私的pose fixtureで、候補の閉姿勢位置合わせと顎支点を分離する。全高fitは初期値、今回のhinge-to-origin移動は使わない。共通親pivot/XYZ変換と顎独立X角を実装し、まず一組をnative4姿勢と比較。perspective/FOV軸をruntimeで確定してから写す。既存Web比較モードを保持。
2. 6組のmotionMat/head-jaw fader Reset/absTimeを有限採取。流体/文字と切り離す。その後field→移流→後段を同入力比較する。
3. Bの次の重点は**同新生P/v/ageで原乱流加速度を切り分け、候補sin波を置換**。52c67a0独立レビューでForce-only4.00922e-7の限定一致を再確認。一方、同新生状態の全力場.0508252/乱流-only.0574486は未一致。

独立レビューの通常Web終点max .405842→.106617/平均 .214632→.0468568は改善だが、部分age等を含む別比較。これを同新生状態の.0508252と混同しない。Bの部分age RNG、中央扇状密集/個体配置・向き、光むら/文字外観、10秒境界、スマホ通信/UIは未完。0.1.11通常offline再起動/旧版更新/物理切断は今回未実施。

## 私的証拠と失敗記録

`private/a-static-20261013/receipt.json` に展開元同一性。`private/timeline-20261012/a-rig-fourpose-wires-20261013/` にbuild/launch、captureの8PNG/8姿勢JSON/setup/finished、validation.json、目視したfourpose-private-contact-sheet.png。

前試行を保持：a-rig-fourpose-20261013はCRLF TOCで0byte生成/未起動、lf版はTD Matrix非iterableで原正面1枚後通常終了、matrix版は別階層SOP配線でCC0空画像。原因を限定修正し、最終wires版は同階層配線/行列index/非空画像を検査。失敗を合格件数へ加算しない。

原全体TOE/B検証元/Web/ZIP/既存TDは保持。今回CPU/GPU負荷は測定していない。候補の既存Web負荷値は0.1.5の証拠であり、原高密度geometryや今回nativeのfpsへ一般化しない。
