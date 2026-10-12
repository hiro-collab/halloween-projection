# B元コンポーネント照合 — 0.1.4 private比較候補

0.1.2安定版と0.1.3合格版を保持し、bat-source-matchで差分を調べました。
元アーカイブの参照は成功しています。原本不在とはしていません。元TOE/埋込DATの実行や原本変更はありません。
完全再現の合格は未取得。今回実装したのは画像時間と固定Trail寄与の部分比較です。

## 原VJの関係と今回の差分

| 項目 | 元コンポーネントの静的証拠 | 0.1.3との相違/0.1.4 |
|---|---|---|
| 時間 | .start cookrate60、local/time.rate=cookRate()、merge_texture_index/express1=int(absTime.frame % depth) | 暫定30fpsから保存設定60fpsへ。Resetはアプリの0起点を保持しabsTime同一とはしない |
| 個体画像index | math2=locked trail2×2、math1でnoise1とtrail1を加算、express2でint→depth剰余 | 同一frameを全24体へ出していた。今回locked寄与だけを個体別に反映。Noise/rolling Trailは未移植 |
| locked Trail | tracklength40、data_rle=@2 128 … @2 147、rate60 | 第一24体でoffset16,16,18,18,…38,38。原frame一致の主張ではない |
| 飛翔 | sphere半径.06/z.03→normal×Initialspeed→particle SOP、force SOP/metaball半径3、external各.1、drag5、period.03 | 24体の固定周回は異なる。原SOPの発生/乱数/力の実挙動は未照合、仮軌道表示を維持 |
| 向き | vx/vy→atan2→-90、noise rotationとのCross、geo2.rz。xyのGainは画像aspect由来 | 現在の小さなsin角は原速度方向ではない。未移植 |
| 制御 | s1→bat_set.Cross→constant2/3→Vortex5→1・Spiral-1.7→-.9・rotation Cross.77→0 | 既存speedは時間倍率。Initialspeed/力混合と同一視せず、仮軌道labelを保持 |
| 初速 | base1.Initialspeed=1.3、法線をmath1で増幅して新生粒子へ | 初速を既存speedへ誤結線していない。専用入力の実挙動は未実装 |
| 選択 | b30→Count0..3→Index。画像switch2と処理switch1を同時選択 | circle batは画像分岐1。保存Index2.96は基準circle場面の値ではない |
| circle用色 | Index1出力base3: Edge1(strength1.38)と、Level(highr/highg0/lowb.223)→Inside→HSV(sat.47)→Over | atlasを直接描く現版とは異なる。未移植 |
| 合成 | switch1→blur1(quarter)→level1(brightness.89/gamma.41/4x)、switch1とOver | 同じフレームのBlur/Level合成。以前の「残像」は訂正。Feedback接続はこの枝にない |
| 最終文字 | Lyrics_viewer→bat_set.in2/null9→fire_wrap/texter.select1、blur/minimum/level/Over。analyze/logicでdeco/texterを選択 | DOM白文字/黒地最前面は本人可読性要件の実装。原maskの見えとの一致未確認 |

元部品はparticle/force/edge/blur/noiseなどのネイティブ演算です。保存値をブラウザーの別数式へ直訳するだけで同一としません。
保存親Birth5/Life5/Turb.2と子の古い評価Birth20/Life2/Turb10.1等が異なり、cook off/Reset onもあります。
実際に選んだB場面の操作後の評価値が必要です。画像選択1に合わせた正方形のrectangle(.24)、ortho幅1.26も実見え照合前。
原素材の色/alpha/画像向き/矩形伸張を推測変更しません。暫定60fpsは保存条件を合わせる比較用で、元2秒羽ばたきの再取得ではありません。

## 実装・検証

API/取得/解放/cacheの構造と11asset数は不変。frameLockは個体位相より優先し、全体の比較frameを指定できます。
既存web.qa.js、bat-api-resources.qa.js、offline-security.qa.js、update.qa.js、corrupt-update.qa.jsの条件を緩和せず再試験。
操作19/19、API画像資源22/22、保存安全15/15、更新4/4、不一致PNG更新3/3、元図案不透明pixel60/60一致。
追加位相比較6/6: 保存fps/locked寄与、全個体Pause、frameLock、60fps時計、paused Reset、End資源解放。
最終ZIPの保存後、所有browser通常close→同profile open→offline B/Stop/Resume/End5/5。
日本語空白フォルダーに12file全展開、CRC/source bytes/hash。Git blob照合も実施。
Stopはbitmap/RAF/pending0でPNG61,130bytes保持、EndはPNG/listenerも0。画像資源の既存反復収支は保持。
通常表示のpage例外とエラー注入を区別。元TDの完成出力と画像差分を取った試験ではありません。
Windows枠消失/private HTTPS/物理投影/製品browser/長時間/物理切断/動画収録は未試験。

## 忠実再現を止めている具体的な参照

アクセス可能: 展示版の展開済み全ノード/保存パラメータ、本人bat tex3d1の60frame cache、locked Trail40samples。
今回のZIPhashは既存正式保存アーカイブと一致。原モデルのlocked dataも存在しています。
不足: bat_set/out1のcircle選択1で、s1/Cross=0/中間/1とInitialspeedを動かした最終出力の基準映像/評価値。
Bのrender1/out1最終画像cacheは今回アーカイブにありません。60frame cacheは単体図案で最終飛翔/色/文字合成ではありません。
既存7動画は参照入口が別枝で、本件のB基準場面を示す収録情報は未特定、映像フレームは未閲覧。
正規Windows UIがMXC0x80070003で開始できず、元TOEの安全化/実再生も未完。MCP/Hermes/mic等を含む元全TOEを無条件起動しません。
必要な最小基準はcircle Index1・root60fps、Reset後、Cross0→.5→1、初速1.3と変更時、文字あり/なしの短い出力と操作値です。
原物不足を本人の所在説明不足とは扱わず、既知の保存元から取得する対象を上記へ絞ります。
Noise seed/Trailの全寄与、粒子数/寿命/乱数・force falloff、色/blur/maskの実像が揃うまで忠実再現済みとはしません。

## ドクロの独立調査

元VJのlocked filein1/filein2は存在し、Jawをgeo1へ独立に駆動する接続も確認済み。
元モデルの作者/出典URL/再配布条件、geo1/2と頭/下顎の実形状対応は未確認で、元素材を製品へ採用しません。
別候補 [Human Skull / CDmir](https://opengameart.org/content/human-skull-0) の[CC0](https://creativecommons.org/publicdomain/zero/1.0/)表記を一次ページで再確認。
この別候補は改変/商用/再配布を含むCC0条件。コードのMITとは別管理。本人原モデルの許諾を証明しません。
既存OBJの2,435位置頂点/2,276faces/4,548tris。大骨component0と上歯17..32を頭、大骨35と下歯1..16を顎へ割当。
全faceを一度だけ割当し、面の切断/欠落/重複なし。頭2,656tris、顎1,892tris。
私的ブラウザー図で正面/45°と顎0°/28°の4姿勢を可視確認。上歯は頭、下歯は顎と一緒に動き、頭は不変。
支点(0,-.75,-.12)は検査用仮値、原支点や最適な関節位置の合格ではありません。無texture幾何検査で元見た目一致ではありません。
model/検査図/生JSONをGit/配布ZIP/Libraryへ入れず、素材の外部配布・一般公開はありません。

## 私的候補と戻り先

0.1.4 ZIP halloween-projection-web-v0.1.4-bat-reference-preview.zip、80,142bytes、build 0.1.4-bat-reference-preview-7aac0a99a650。
SHA256 ddf6fddff664e0c8f0aa8f2c951bf5ffd1bc8667091731f35347096939b01455。
戻り先: web-private-preview1673a06、bat-offline-fix e67a7e7（runtime b210371）。旧0.1.3 ZIP/Library保存は不変。
新候補をmainや安定版へmergeしていません。完成版/公開版/一般配布可とは称しません。
