# 0.1.8 B 信号・光・文字合成の比較

2026-10-13。非公開の本人確認用。元B全体の忠実再現は未合格。
ff8aef2の独立レビュー不合格を維持し、今回の自己試験と混同しない。
旧0.1.2安定版、0.1.3～0.1.7比較ZIP、元アーカイブ・atlas・既存TDセッションを保持。

| 指摘 | 確認できた原因 / 修正 | 残る差 |
|---|---|---|
| 中央の花・星形、向き | 原XYZ・最終geo Rz・indexを固定した原Render対Web Spriteの輪郭IoU .9999226、RGB MAE .007804、前景RGB MAE .031626。投影・寸法が主因ではなかった。原SparseはXYZ空間、Lagは40描画枠の並びに作用。誤った時間ノイズ/フィルタを置換 | 粒子SOPの発生点選択/seed、3D力、turbulence、積分は近似。中央密集全体を解消したとはしていない |
| 個体の図案位相 | 生存数別Random、rolling Trail、locked Trail×2、int/60剰余を反映 | Webは相対時計。原absTime、1frame遅延、10秒境界は未解明 |
| ピンク・紫の内側/光不足 | Luminance alpha→quarter Blur→brightness 2→contrast 1.71→Noise積→Hue -284/Value .5→premultiplied Overを追加 | Blur TOPとSimplex3Dは未一致 |
| 文字の黒い矩形 | CSSの黒背景が原因。DOMは測定/意味情報へ限定し、glyph→背景Minimum→brightness 3/gamma 2.02→背景側OverをCanvas内へ移した | 原Blur、書体/字間、null9文字マスクとのpixel一致は未検証 |

## 同じ原入力での比較

署名確認済み既存TouchDesigner 2025.33230で短いTempパスの原Bコピーを使用。
追加契約・ライセンス購入・保護解除は不要。検証用TDのみ通常終了し、既存previewは保持。
原BコピーSHA256: `0d2264cfdb1919fe8048272cd03165e0a825e8398a96c7732d6391f865eddf9f`。
ignoredの`private/timeline-20261012/`と`private/fire-wrap-20261013/`へ採取/比較記録を保存。

- 同じ40入力のScript CHOPでSparse/Lag/Randomを再計算し、採取した元出力との差は各0。
- Sparseを[-.8,.8]、33³、step .05で採取。Int16格子71874 bytes、trilinear補間。
  格子に含まれない原40座標の最大誤差1.14563度、平均.35320度。
  範囲外はclampして診断へ加算。未観測座標の原関数完全一致は主張しない。
- Lagインパルスから同じ40入力を枠方向に復元。左側定数延長、最大誤差.00001224度。
- Randomは生存数0～25のN+1応答を採取。同じ原frameのrolling/lockedと合わせて40番号の不一致0。
- 親COMPのcookingを止めた最初の原PNGは100×100黒で無効。親cookingを維持した固定Script CHOPで1280×720を再取得し使用。無効PNGを合格根拠にしない。

光合成は同じ原combined PNGで比較。RGB MAEは0～1、前景は原RGB最大値>20/255。

| Webへの固定入力 | 全画面RGB MAE | 前景RGB MAE | 解釈 |
|---|---:|---:|---|
| 原マスク＋原Noise | .00007331 | .00046027 | Hue/Value/Over演算と接続順が近い |
| Web Blur＋原Noise | .00387019 | .02504197 | ぼかしの差が残る |
| Web Blur＋Web Noise | .01508734 | .09458567 | Simplex3Dとの違いが大きい。全体合格ではない |

最初のImageBitmap比較はupload上下が逆で無効。bitmapをflipYで作り直し比較。
通常アプリのCanvas入力はUNPACK_FLIP_Yが有効。無効結果もprivateへ別名で保持。
Web Noiseはcoherent value候補で、原Simplex3Dの完全移植ではない。
光/文字は同じframeの合成。Feedbackによる時間残像ではない。

## 境界と次の作業

`bat-motion.js`の測定応答は非公開比較データとして独自の補間コードと区別する。
原atlasはMIT外。ファイル本体/60frameの色やalphaを上書きしていない。
CC0別ドクロの権利記録は[CC0-SKULL-TRIAL.md](CC0-SKULL-TRIAL.md)。元モデルとの同一性を主張しない。
原Aの素材・リギング・流体/背景文字は未完。[技法対応](VJ-TECHNIQUE-MAP.md)で未確認/仮説を区別。
次は同じ初期条件で粒子座標・速度・最終Rz・indexを追い、発生と力の差を切り分ける。
Blur/Simplex3D/文字マスクの残差、原10秒境界を解明してから原B全体を再度独立評価する。

この版の最終回帰とZIP識別値は最終確認後に追記する。

## 最終回帰と識別

- 数値信号6/6、光/文字/GPU/資源12/12、描画12/12、入力22/22、通常Web19/19、画像資源22/22、位相6/6、契約8/8、元図案60/60。
- 同じ静止frameで文字の変更pixelがあり、二行間の隙間の変更pixelは0。黒い矩形による遮蔽を解消。
- Composite→FireのCanvas受け渡しで非premultipliedに再解釈していた点を修正。原RGBA buffer対実Canvasの誤差はRGB .017239→0、alpha .014553→0、最大byte差254→0。半透明pixelの回帰を追加。
- 実ZIP保存15/15、通常close/open後のblank→offline起動7/7。物理ネット切断は試験していない。
- 保存判定の旧11asset一覧を13へ修正。保存済みcacheがあるのに診断falseとなる失敗と修正を記録。
- QA serverの単一HTTP接続がChrome待機接続で塞がる障害をThreadingHTTPServer/10秒timeoutで修正。待機socketを保持した別GETが200/.063秒、CSP/静的allowlistを保持。開発用serverはZIP外。
- 最初の試験名誤記、終了後ページの再利用、bitmap上下不一致、旧manifest判定、QA server timeoutをprivateに記録。原因を直した条件で再確認し、繰り返し失敗を成功扱いしていない。
- CC0形状/元atlasのSHAは不変。既存TD preview PID3936の応答を保持。新規検証用のTDだけ通常終了。

ZIP: `halloween-projection-web-v0.1.8-b-signals-fire-preview.zip` / 210422 bytes / 14 files / 13 cached assets.

Build: `0.1.8-b-signals-fire-preview-dc3467160c4f`

SHA256: `433062e1e2530bd6d3fbc4a86de1b030b3d71efbc15e34bddbfbc485cfcb3c77`

非公開の比較材料は`private/b-signals-fire-review/index.html`と同folderのhashes.json/confirmed-commit.json。
原pose描画、同じ入力の合成、Web実時間は別々に並べる。新しい独立レビューは未実施。
0.1.7 ZIP SHA `805d251d8d621bd2c3575a5fbf6827cdb3e0b5c209212bda93a36eb4cda97a7a`の保持を確認。
0.1.6 Library保存も保持。0.1.8のLibrary uploadはしていない。
