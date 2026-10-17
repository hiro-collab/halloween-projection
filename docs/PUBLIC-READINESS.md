# v55 公開判断用の実物台帳

2026-10-17。これは同梱物と履歴の有限調査です。公開操作、公開Release、履歴削除・書換えはしていません。

## 現在の本人承認と公開操作

2026-10-17、本人は「コウモリの画像とか数値データもMIT条件で配布してしまって構わない」と明確に承認しました。自作コード、本人作成コウモリPNG/埋込み、本人作品由来の採取値と検証値をMIT条件に揃えます。Copyright (c) 2026 hiro-collab。標準MIT本文へ追加条件を入れません。採取数値すべてに新たな著作権が成立すると判断したものでもありません。

素材許諾の未確定という以前の確認点は解消しました。公開Releaseやpublic化の実行は引き続き未承認で、今回は行いません。第三者模型はCC0のままです。

対象: web/assets/owner-bat-atlas.png、web/bat-atlas-data.js、web/bat-motion.js、web/bat-phase.js、web/a-fluid.js、web/output-uv.js。開発用JSON5件はtests/DATA-LICENSE.txtで特定します。以下の由来・用途・技術上の不要/必要という区分は保持します。

コウモリの出所は不明ではありません。REQUIREMENTS.md、assets/OWNER-BAT-ASSET.txt、B-CIRCLE-VALIDATION.mdは、本人が円・矩形を追加・切抜き・反転・変形して作る bat_set/bat/batImgs/bat_img_generator と、保存された60フレームを記録しています。旧候補Bat_FBXや雪のbase2は別枝です。既存記録が示す本人素材の由来と、公開配布の許諾範囲を区別しました。今回、元TOEを新しく開いて生成工程を再実行したわけではありません。

原作への公開リンク・Instagram等は、確認できたURLがまだありません。掲載したい場合だけ正しいURLを指定できます。MIT標準本文に原作URLの追加義務は入れません。

## 数値データは何か、必要か

|実ファイル・値|既存記録による出所|現行での用途・必要性|
|---|---|---|
|bat-motion.js の encoded、33³ Int16、71,874 bytes|本人B作品の回転用 Sparse Noise、seed1/period1/amplitude360を[-.8,.8]・.05刻みで採取|XYZ位置から回転角を補間する。現行Bの見え・向きのため使用。単純削除は不可。別noiseへ置換可能だが今回の維持要求と別作業|
|同ファイルの kernel（40枠のLag応答）|本人作品のLag CHOPへ既知インパルスを与えた数値応答|速度由来角の枠方向Lag。ソース文字列のコピーではなく応答測定。削除すると向きが変わる|
|同ファイルの tables（生存数0～25のRandom応答）|本人作品内のseed固定Random出力|旧 instanceIndices 用の互換表。通常の現行B位相は下記bat-phase.jsへ移行しており、この旧表は削除候補。API互換性を調べてから縮小できる|
|同ファイルの emitter（42点×位置XYZ/法線XYZ）|本人作品の球面発生SOPのseed順出力。元ドクロや第三者bat模型の頂点ではない|現行Bの出生位置・初速方向。汎用球面生成へ置換可能だが同じ出生順・動きの維持には検証が必要|
|bat-phase.js の sequence|本人作品のseed1/depth60 Random応答|40描画枠のTrailと組み合わせ、元60コマを選ぶ。今回維持すべき位相に使用。別RNG化は見えを変える|
|a-fluid.js の encoded、100×57×RG half-float、22,800 bytes|本人A作品 base3/noise1→reorder2、Amp1.08/Period1.06、時刻0の評価出力|初期/固定比較入力、動的noise無効時のフォールバック。通常の動的運転は独立noiseを毎tick生成するため、固定参照を外せる余地はある。削除は初期状態/比較モードを変える|
|output-uv.js の packed、1280×720×RG binary16相当、3,686,400 decoded bytes|本人作品の投影補正Remap出力の数値UV。画像や歌詞ではない|元Remapの5～8番用。通常操作席のXは1～4番なのでその経路には不要。ただし開発用の旧単窓画面/APIには5～8番が残り、現行bundleでロードする。標準版から分離する余地がある|
|control-response.js の3係数と18重み、a-motion-lag.js等の係数・設定|本人作品内のLag/Filter等を観測・測定した有限演算係数|独自実装の追従演算。大きな画像/映像サンプル表とは区別する。現在のコードMIT扱いを維持|
|tests/a-fluid-sampling-golden.json|自作ramp/one-hot/tie入力に対するTD2025.33230のGPU数値出力。provenanceに原geometry/atlas/shaderコピーなしと明記|開発回帰用。アプリZIPには入らず、実行に不要。ソースGitには含む|
|tests/a-scene-poses.json、a-scene-golden.json|自作6固定姿勢とCC0模型の登録で得たheadWorld/jawWorld行列。scopeに元motionサンプル/画像payloadなしと明記|開発回帰用。アプリZIPには入らず、実行に不要|
|tests/skull-origin-golden.json、skull-rig-golden.json|同じCC0別模型、自作固定角、元親/候補顎支点での行列・camera設定・画素boundsの有限TD比較|開発回帰用。元模型の頂点や元動画ではない。アプリZIPには入らず、実行に不要|

「本人作品内のTD演算出力」であることは記録されています。第三者の完成作品の絵・動画を採取した記録は見つかっていません。TDという第三者ソフトの演算結果と、TD/NVIDIAの実装ソースを複製することは別の確認事項です。第三者権利不存在の網羅証明はしていません。

## コード・shader・模型

実行時の外部JSライブラリ、CDN、package依存、フォントファイルは同梱していません。HTML/CSS/JSはテキストで、bundler出力だけの配布ではありません。Base64はPNG・模型・数値データです。

a-fluid.js / a-composite.js / bat-fire.js / bat-art.js / a-source-noise.js等は、独自Web実装として記録されています。Sobel・HSV・有限差分流体・bilinear・simplex・gradient noise等の手法名や一般的な定数だけから、特定コードのコピーとは判定しません。履歴のNVIDIA著作表示、Ashima/Gustavson、mod289/taylorInvSqrt、three.js、webgl-fluid-simulation等の有限パターン検査では該当なしでした。原移流shaderを私的検証probeだけで使い、Git/ZIPへコピーしなかったとA-FLUID-RESET-VALIDATION.mdは記録しています。作成時の参照先すべてを突き合わせた調査ではなく、ヘッダーのMIT表示だけで独立作成を証明していません。特許の網羅調査はしていません。

模型はCDmir / Human SkullのCC0別モデルです。[一次配布ページ](https://opengameart.org/content/human-skull-0)と[CC0](https://creativecommons.org/publicdomain/zero/1.0/)、archive/OBJ/変換後ハッシュをRIGHTS.txtに保持しています。元TDドクロではなく、texture/AO画像も同梱しません。

## 履歴・配布物の検査範囲

リモートの到達可能な12ブランチをread-only fetchし、ローカル履歴と合わせてオブジェクト、ファイル、作者/committer identityを調査しました。認証文字列、秘密鍵、絶対ユーザーパス、emailアドレス、TOE/TOG/模型元ファイル・音楽・動画・archive・実行物等の拡張子、既知第三者マーカーを検査します。最終ZIPと今回の追加ファイル・commit messageも別途対象です。

この有限検査は「秘密/個人情報が一切ない」の保証ではありません。到達不能オブジェクト、GitHub以外の保管先、元TOEの全依存物は対象外です。公開許可そのものの代わりにもなりません。検査の機械記録と正確な件数は納品の監査JSONに残します。公開を実行する際は、その時点の差分を再確認します。

## 編集と配布構成

通常の文字/スタイル/JavaScript編集はテキストエディターと再読込みでできます。画像はPNGと埋込みpayload、bat-art.jsとビルダーのhashを一緒に更新する必要があります。模型は独自binaryで、一般変換ツールは同梱していません。詳しくはweb/README.txt。

ソースのweb/配置は保持し、配布ZIPだけ「はじめに_START-HERE.html」「アプリ本体/」「利用条件.txt」にします。内部相対リンク、二窓の認証付き接続、Service Workerのscopeはアプリ本体内のままです。GitHubの自動Source code ZIPはリポジトリーsnapshotで、通常利用に必ずビルドが必要という意味ではありません。初学者向けには検証済みの構成済みZIPをReleaseへ手動添付する方法があります。今回はReleaseを作りません。
