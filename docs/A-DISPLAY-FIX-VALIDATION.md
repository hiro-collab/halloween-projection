# A表示・実時間・8行文字の修正 — 0.1.17

2026-10-13。独立レビューで指摘された0.1.16の色/白つぶれ、描画頻度に比例して遅れる流体時計、長文の画面外クリップに対するローカル修正版。UIの「ドクロ・流体・背景文字を原の順序で比較」または `halloweenControl.set('skull3d','aCompositeMode',1)` で選択する。旧版は保持している。原全体の再現合格ではない。

## 実装

- Levelの順序を brightness → gamma → contrast に修正。元の同一headOverlay入力での局所計算では、この順序がnative値に近いことを先に確認した。
- Edgeの入力をRGBA各チャンネルの勾配から輝度へ変更し、白いRGBとalphaに同じedge値を使う。元のEdgeはluminance選択、edge alpha、白、premultiplied RGB。微分カーネル/正規化は依然候補である。
- 頭Glowの出力を全解像度から原のsixteenth相当に修正（1280×720では80×45）。Blur自体はGaussian候補を保持。Catmullと低解像度文字処理の一括候補は最終MAEを0.007548へ悪化させたため採用しなかった。候補と結果はprivate内に保持。
- GUIは各描画までの実際の有効経過秒を `flow.step(.95, elapsedSeconds)` に渡す。advectionとvorticityのDeltaが描画数と切り離された。Aの頭/顎/flow時計も有効経過秒を使う。直接の `step()` は従来の1/60秒を維持。simulationSeconds/lastDeltaSecondsを診断に追加し、Resetでクリア。Pause/hidden中は時計を進めない。
- Aの背景文字はArialの実測幅とascent/descentを用い、全行が幅82%・高さ48%の領域に収まる最大サイズを選ぶ。文字はliteralのままで、保存しない。元の固定fontsizeX .15625と完全に同じ組版とはしない。

## 比較基準の訂正

以前のnative比較には、試験用グラフの接続を変更する処理に2つの誤りがあった。この文書と `output/a-v17-fix-20261013/fixed-input.json` が訂正後の基準である。0.1.16文書や古い画像は履歴として保存するが、無noise・1組という条件での一致評価には使わない。

1. Noise TOPを同名のゼロConstantへ置換したときMultiplyを再接続しておらず、実際は `[level1, level1]` だった。明示的に `[zero noise1, level1]` へ接続した。ゼロ入力の全値0を確認。旧nativeの緑色をWebの色変換不良の根拠にしない。
2. Composite TOPの入力を順に外すと残る入力の番号が移動し、前景が1組になっていなかった。全入力を外してから、radialBlur1と透明ゼロ入力のみ接続した。Composite TOPは2入力以上が必要で、1入力のみの途中試験も不採用。

採用基準は `private/timeline-20261012/a-integrated-single-zero-20261013/capture/`。既存TD2025.33230の自己所有コピーで、同じCC0候補頭画像・固定dye60・同じ2行文字PNGを入力した。Hue138/Cross.824、radial134sample/strength.6、1組＋透明、装飾noiseゼロ。4callbackで有限終了。errors空。元archiveとTD3936は変更/終了していない。

## 固定入力の画像

旧版HEAD ed0abedと修正版のcompositorを同じ入力で計測。出力は1280×720、RGBの差。黒領域で平均が下がるため、片方が明るい画素の集合での誤差も併記する。最終Web出力は投影用にopaqueなので、native TOPのalphaとの一致は評価しない。

|指標|0.1.16|0.1.17|
|---|---:|---:|
|全画面RGB MAE（0〜1）|0.0123404|0.00666350|
|明るい画素の集合のRGB MAE|0.0737901|0.0412358|
|全画面RGB最大差|0.741176|0.741176|
|RGB全チャンネル>.98の白画素|17,365|11,501|

全画面MAEは46.0%減、白画素は33.8%減。native白画素は8,410で、修正版も3,091画素多い。鼻・歯・顎の白つぶれは改善したが、同じ外観の合格ではない。Blur、edge正規化、alphaやRGBA8/float演算の差が残る。

`output/a-v17-fix-20261013/comparison.html` にnative/旧版/修正版、`v16/` と `v17/` に段別PNG、`fixed-input.json` に段別数値を保存した。画像とnative配列はローカルprivate比較資料で、Git/配布ZIPへ追加しない。新しいnative noise画像は使用/梱包していない。

## 実時間と文字の検証

新しい `tests/a-display-fixes.qa.js` は11項目合格。流体再有効化の新scopeに旧scopeの経過秒を渡さないことも確認した。最終版の3秒計測（Pause/Resume境界と最後の未描画時間を含む）：

|表示|実時間秒|solver有効秒|実時間比|実測step/s|
|---|---:|---:|---:|---:|
|1280×720|3.0263|2.9580|0.9774|19.50|
|1920×1080|3.0292|2.9358|0.9692|14.53|

旧固定1/60 per-drawの約0.316倍/0.217倍から改善。これは60fps達成を意味しない。実測平均A描画49.48ms/66.69ms、CPU solverとgraphics→CPU読戻しの負荷が残る。sourceの注入・拡散・外部速度加算はper cookのままなので、描画頻度を変えた全状態が同一になる保証もない。

Deltaが単に診断カウンタを変えるだけでないことも確認した。同じ入力と外部速度でDelta0/.1を与え、scalarが2560画素変化。NaN Delta拒否、Pauseで有効秒停止、Resetで0、Stopでscope解放も合格。

239字・8行（UI上限240字）のArial maskは43.55pxへ縮小。実際に描いたglyphの8つの行帯を検出し、画素範囲x232〜1051/y187〜523が1280×720の指定領域内。literal HTML文字列のDOM注入なし。背景文字の最終的な発光は原のMinimum合成により流体と重なる部分に限られる。

## 残る範囲

原modelとの同一性、point-normal照明、原の6組/motion/fader、動的速度noise、装飾Simplex3Dとrandom alpha、Catmullの内部カーネル、Edge正規化、全時間状態、Bの原飛翔/age/最終合成は未完。元Noiseは標準の手続き生成TOPで外部画像ではないが、内部seed/座標/演算順の一致は未確認。拒否されたRGBA埋込みは再実行していない。従来のprivate atlasと固定fieldはMIT外のまま。

公開・push・外部送信・新規契約・権限拡大・セキュリティ設定変更なし。既存セッションを保持。

## 最終保存

GUI回帰122項目（修正11、統合17、scalar13、元支点21、3D18、B操作22、保存15、統合offline5）とnumeric golden280項目が合格。最終のscope初期化追加後は影響するA/保存/offline61項目を再実施し全合格。結果は `output/a-v17-final-20261013/`、B/元支点/3Dの結果は `output/a-v17-regression-20261013/`。ブラウザーの実ネットワーク切断とブラウザー再起動は今回の検証対象外。

最終ZIP `dist/halloween-projection-web-v0.1.17-a-display-fixes.zip`、250,014 bytes、build `0.1.17-a-display-fixes-ff34f57d9cb3`、SHA256 `1ec4c769ac7f65f5f4689a642b6c0a29515b2fce164b33bde83ecd40090405a5`。16ファイル/15cache assets。CRC・全展開byteの一致を確認。Bのfunction/assets、既存model/field payload、元archive SHA f5254beb…c54094 は不変。0.1.2/0.1.3/0.1.4を含む旧ZIPを保持。

最終のpackage/保持確認は `output/a-v17-fix-20261013/preservation-and-package.json`。一時的なCLI失敗は、自己所有scopeの保存解除confirmダイアログと引用文字列の不備を特定して訂正した。アプリのCSPは維持し、確認は自分のテスト保存だけに対して行った。
