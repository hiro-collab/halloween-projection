# 原B circle差分 — 0.1.7 private比較

実装者の自己テストと同条件の比較資料です。独立した外観レビューは未実施です。
原作の飛翔・最終合成を完成/合格と判定していません。0.1.6と以前の版は保持しました。

## 利用した参照と不足

既存build33070採取の6条件: circle Index1、60fps、Cross0/.5/1・初速1.3、Cross.5で初速.65/2.6、Cross.5/初速1.3で検査文字あり。
各60/120/180tickのraw/color/combined/final、計72PNG。各条件の120〜179tickで運動値60行、計360行。
相対tickはReset後のcallback数です。連続映像全体・全寿命・全seedの参照ではありません。
従来の運動ログのrzはmerge_texture_indexの速度方向側です。最終geoの混合Rzを全frame採ったログではありません。

不足していたcacheの色/上下解釈と回転接続を、既存安全コピーの別所有instanceで限定確認しました。
原6条件PNGを採り直していません。最初は未提供のgeometry.numInstances属性で停止しました。
cache配列の成功分は保持し、既知CHOPサンプル数を使う限定読出しへ修正して65callbackで正常終了。
既存比較TD PID3936と元ファイルは保持しました。native GUIクリックの検証ではありません。
回転用NoiseはSparse/seed1/period1/amplitude360でmerge_texture_indexを入力し、出力は変化します。独立した時間変化だけが原因とはしていません。

## 再現を進めた項目

|項目|根拠と0.1.7の変更|確認範囲|
|---|---|---|
|色チャンネル|既存PNGは保存dataのBGRAをRGBAとして読んだ候補だった。Native配列の全60frameでR/B交換後の最大差2.97e−8|atlas本文は不変。描画時に解釈を補正|
|上下|Nativeのlayer0 PNGはNative配列の上下反転と一致、MAE6.32e−10|spriteを描く時のV方向を補正。全60frameの保存配列は同じ配置|
|circle色|High R/G=0、Low B=.223、HSV saturation=.47、Edge strength1.38、Over接続|紫の本体/白い輪郭。Edgeは半正規化Sobel候補|
|中間合成|同frameをquarter Blur→brightness.89/gamma.41→4x→Over|3×3縮小Blur候補。Feedback残像として扱わない|
|発生/寿命|採取評価Birth5・Life5、球半径.06、初速は法線方向|5個/秒・寿命5秒・放射初速。発生点選択/seedは候補|
|投影/寸法|Ortho width1.26、rectangle.24、採取Gain=.5625|高さ/幅のGainとworld座標を使用|
|描画枠|instancing入力CHOPは40samples、後半は最後の位置へ延長|40枠、固定Trail40の位相寄与。元Noise/rolling Trailは未移植|
|向き|NoiseとLag(速度atan2−90)をCrossで混合|旧候補のCross端で角度ゼロを訂正。Sparse Noise/Lag自体は未一致|
|文字なし|同条件画像で空のDOM文字枠が中央を黒く隠すことを発見|空文字では枠も非表示。原text maskとの一致ではない|

フレームごとにNativeの原raw PNGを固定入力として、ブラウザで色/中間合成を再計算しました。
18画像×2stage=36比較。RGB MAEは0..1値の全画面平均です。背景黒だけで良く見えないよう前景誤差も記録しました。

|比較|平均RGB MAE|前景RGB MAEの最大|raw直接描画からの改善の最小|
|---|---|---|---|
|色18画像|.003575|.04405|90.24%|
|中間合成18画像|.003574|.03094|90.33%|

これは同じ18画像での候補選択/評価です。未見画像への独立評価ではありません。
alpha差や輪郭kernel差は残り、pixel完全一致とはしていません。原rawを入力したこの比較は、飛翔積分器の再現合格でもありません。

## 自己テストと配布物

実キー/入力22、既存Web19、B画像資源22、位相6、入力契約8が合格。
位相の期待値は既存第一24枠を保ったまま、原locked Trailの40枠全体へ拡張しました。
色/発生/寿命/投影/空文字/Pause/1920×1080/Stop/GPU解放/100切替/非対応fallback/End/例外は12項目。
GPU合成はWebGL2、場と文字は既存Canvas2D/DOM。非対応時は色合成を省いた旧図案に戻し、その旨を画面へ表示します。
GL program/texture/framebufferは所有scopeだけで削除し、Stop/Endで0を確認。ユーザーのbrowser設定や保護を解除していません。

最終ZIPは12file/CRC/本体webとのbyte一致を確認し、展開先で色と保存を再検証。
選択式保存・範囲制限・入力非保存・offline起動は既存15項目を使用。
最終ZIPを保存した所有persistent browserを通常close/openし、offlineでB/入力/CC0/Stop/Endを7/7確認しました。
サービスワーカー/更新の実装と11asset許可範囲は不変。私用loopbackのみで確認しました。
更新/不一致拒否の既存実装を再変更していないため、0.1.6での4/4・3/3は履歴として区別しています。
物理投影、Windows枠消失、長時間、別PC、物理切断、私用HTTPS認証は未検収です。

候補: halloween-projection-web-v0.1.7-b-circle-preview.zip、131,063bytes。
Build: 0.1.7-b-circle-preview-2d2dd0e79b55。
SHA256: 805d251d8d621bd2c3575a5fbf6827cdb3e0b5c209212bda93a36eb4cda97a7a。
0.1.6 ZIPは127,528bytes、SHA256 ace29782199e4b12d1c4490d657ec83bb916ea681dd09316583ba8a2a7b82c95のまま。Library保存成功、版0。
WindowsのLibrary版属性追加は未対応でした。対応表は私的保存記録で保持し、Library保存成功と区別しました。

## 独立レビュー用の読み取り専用手順

確定commitは納品時のcommit URLとprivate/b-source-compare/review/confirmed-commit.jsonで固定します。
コードはGitHub privateのそのcommitを読むだけで確認できます。検査用コピーを起動したり、更新試験を実行する必要はありません。

1. private/b-source-compare/review/index.htmlを開き、静的な画像と説明を読む。JS/外部通信/書込みはない。
2. Native raw→色→中間→最終とbrowser-colour-prefix.pngを比較する。prefixは原rawと同一入力で、sourceとbrowserのcolour段を比べる。
3. browser-flight.pngとnative-final.pngを見る。両方1280×720、Index1、Cross.5、初速1.3、size1、文字なし、Reset後約2秒。
4. comparison.jsonでbrowser実時刻/粒子数/設定と各画像hashを確認する。原absFrame371とWeb相対clockの位相/seedは異なる。
5. 再現済み項目、部分候補、未一致を分けて評価し、観察した差を返す。動作確認だけで原作一致としない。

7画像にはRGB差×8の図も含みます。これらは私的レビュー資料でGit/Web ZIPには含めません。
実ブラウザ結果は自己撮影です。別担当の独立レビュー済みという記録は作っていません。ユーザーのレビュー待ちを完了条件へ追加していません。

## 残件と次段階

B: sphereの発生点/seed、3Dの力/metaball falloff/積分器、Sparse NoiseとLag、Noise/rolling Trailの画像位相、最終fire_wrapの光/色相/text maskが未一致。
10秒リセットのユーザー観測とbuild33230の有限観測との差は未解明のまま保持します。元の観測を否定しません。
A: 原素材/支点/texture・流体・背景文字は次段階。CC0別ドクロの素材/権利と元モデルの再配布権を混同しません。
スマートフォンUI/通信方式は未決のまま実装していません。公開・新契約・権限拡大・保護解除なし。
