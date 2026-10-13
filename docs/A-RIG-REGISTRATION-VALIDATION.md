# A候補の閉姿勢位置合わせと独立顎支点 — 0.1.12

2026-10-13。CC0別候補の閉姿勢を原Aの位置へ合わせ、共通親XYZ回転と顎独立X回転をWeb比較モードへ追加した。**同じCC0候補のnative/Web変換は限定一致。原モデル形状・照明・動的A全体の一致ではない。** 旧0.1.11と52c67a0、0.1.2安定版/比較版を保持。ローカルのみ、push/uploadなし。

## 約54pxの上ずれを補正した変換

先の[4姿勢比較](A-SOURCE-RIG-VALIDATION.md)は、候補の顎支点を原点へ寄せる移動をモデル全体へ適用していた。これを全体の位置合わせから分離した。

CC0座標qをA比較座標へ `p = s q + T` で写す。閉じた全体の高さから `s=.6951803205280249`、閉姿勢の頭+顎bbox中心から
`T=(-.000007301568984985352, .09370309658982542, .00247608319722023)`。
各軸で `T = 原bbox中心 − s×候補bbox中心` を計算した。形状の頂点は変更しない。

旧Tは `(0,.5213852403960187,.083421638463363)`。Yの補正は **−.4276821438061932**。native閉正面の候補範囲が `[555,200,725,452)` から **`[555,254,725,507)`** へ移り、原の上下範囲 `[254,507)` と揃った。原の幅166pxに対して候補170pxという形状差は残す。

顎の検査用支点は別に `j = s×(0,pivotY,pivotZ)+T` で写す。初期値(-.75,-.12)では
`j=(-.000007301568984985352,-.4276821438061932,-.08094555526614276)`。
これは**候補支点の仮説**であり、原顎の局所支点 `(0,0,0)` と異なる。顎30度の原下端529px/候補538pxの差を、素材形状だけの誤差とは呼ばない。支点差も残っている。

共通親支点a=(0,-.5,0)。頭は `T(a) Rz Ry Rx T(-a)`、顎はその親変換に `T(j) Rx(jaw) T(-j)` を続ける。親回転順は原採取行列で確認した。閉角0では顎支点を変更しても全体位置が動かない。

cameraZ90/FOV6.4のperspective。Webは焦点距離 `viewportWidth/(2 tan(6.4°/2))` を使用。1280×720の4姿勢で同じCC0のnative画像範囲と最大1px差を確認した。FOV軸の文字列は原APIから直接取得していないので、これは採取画像で確認した有効投影。全aspect/実機の検証には一般化しない。

## 共通APIとUI

3Dドクロの「原Aに位置を合わせて比較」がrigMode=1。既存比較はrigMode=0で既定のまま。
headX/headY/headZは−180..180度、headRate/jawRateは0..2、jawOpenは0..45度。headYは回転時計へ加える基準角。速度0は現在角で停止するため、固定姿勢は頭/顎速度0→Pause→Resetで時計0から設定する。

```js
halloweenControl.select('skull3d');
for (const [key,value] of [['rigMode',1],['headRate',0],['jawRate',0]])
  halloweenControl.set('skull3d',key,value);
halloweenControl.pause();
halloweenControl.reset('skull3d');
for (const [key,value] of [['headX',20],['headY',45],['headZ',15],['jawOpen',45]])
  halloweenControl.set('skull3d',key,value);
```

既存pivotY/pivotZは候補元座標の値で、全体のTを変えない。UIとAPIは同じ検証済みproducerを使用し、不正な角/モードは値を変えず拒否。Pause/Reset/Stop/Resume、モデル1scopeの解放を維持した。

## 有限比較結果

同じCC0 geometry/登録/親・顎角を、署名済み既存TD2025.33230の有限32callbackコピーとChromium154.0.8037.98で比較。原geometry、帽子/FBX/外部texture/原callbackはWebへ追加していない。

|親XYZ角 / 顎X角|CC0 native前景範囲|Web前景範囲|行列max差|
|---|---|---|---:|
|0,0,0 / 0|555,254,725,507|555,254,725,507|0|
|0,0,0 / 30|555,254,725,538|555,254,725,538|1.55436e-8|
|0,90,0 / 0|509,254,734,506|509,253,735,506|4.37114e-8|
|20,45,15 / 45|523,250,727,539|523,249,727,539|4.21272e-8|

- Native行列/登録golden **10/10**。ブラウザの4姿勢/共通API/独立頭顎/停止/資源 **20/20**。
- 閉姿勢で顎支点を変更しても全canvas画素・頭行列・Tが不変。顎だけ開くと頭行列/頭上部画素が不変。頭だけ回すと閉顎が親に追随し、顎時計/開角は固定。
- 既存3D比較18/18、Bブラウザ入力22/22、B入力契約8/8、保存15/15。最終0.1.12の同一タブoffline再読込で新モード3/3。通常browser再起動/旧版更新/物理切断は今回未実施。
- 最初のWeb比較は操作前の頭時計が2.411度残り行列4件失敗。証拠を別名保持し、速度0/Pause/Resetへ採取条件だけ修正。開始時計を揃えた最終比較は上記20件合格。失敗を合格へ加算しない。

照明はWebの既存Canvas2D平面陰影で、nativeのPhongとは異なる。骨色/面の見え・画素RGBの完全一致は測っていない。全体登録はbboxによる初期比較で、解剖学的ランドマークの一致を示さない。

## 保存物と残件

最終ZIP `halloween-projection-web-v0.1.12-a-rig-registration-preview.zip`、**215225 bytes**。
build `0.1.12-a-rig-registration-preview-e09ba4f58cc9`。
SHA256 `4473931fecca9f61d7116ae38e751a28c798b1898e56a7ea34b7c5ea32514bfa`。14file/13cache asset、CRC/全展開byte一致。

CC0 binary SHA `bb38451e202e30ce2d84cdc224433ac27aafd43539ed362e6127a980b3538706` は不変。Bの粒子関数/VJ producer、bat-motion/art/fire、atlas、offline、安全設定も52c67a0から不変。原A/B元TOEと旧0.1.11ZIPのSHA不変。既存TD3936を保持し、所有nativeコピーは通常終了。

私的証拠：`private/timeline-20261012/a-rig-centered-20261013/` のregistration/8PNG/8JSON/validation/package-integrityとcentered-private-contact-sheet.png。Web最終4PNGと20件は `output/a-rig-final-20261013/`、回帰は `output/a-rig-regressions-20261013/`、offline新モードは `output/a-rig-offline-20261013/`。最初の失敗は `output/a-rig-20261013/` に保持。Gitのgolden JSONは行列/範囲だけで原geometry/画像を含まない。

原Aの6組/運動noise/Feedback・Reset時計/流体/背景文字、原顎支点との差、素材形状/照明は未完。B乱流/部分age RNG/最終外観・10秒境界/スマホ通信UIも未完。B次重点は同新生P/v/ageで原乱流加速度の切り分け。原model/atlas/shaderの権利不明を維持し、追加原素材は配布/Git/Libraryへ含めない。
