# 改変する場所と確認手順

対象は現在のブラウザー版 `web/` です。`app/` は旧Windows試作です。
配布ZIPでは `web/` の内容が `アプリ本体/` に入ります。通常利用にNode.jsやPythonは不要です。

## 変更したい内容から探す

| 内容 | 最初に読むファイル・関数 | 一緒に確認する場所 |
| --- | --- | --- |
| キーの割当 | `web/keyboard-performance.js` の `rows`、`physical()`、`down()` | `performance-api.js` の `bindings`・`dispatch()`、`console.html`・`GUIDE.html` の表示 |
| キーの目標値・初期状態 | `web/performance-api.js` の `profiles`、`positions()`、`apply()` | `queue()`・`advance()` の150ms補間、`operator-contract.qa.cjs` |
| パラメーターの範囲・説明 | `web/app-control-api.js` の `field()`・`settings` | 実値と範囲は `control-api.js`、演奏用の上書きは `performance-api.js` |
| ドクロの動き | `web/a-motion.js` の `create()`・`advance()`、`a-jaw-control.js` | `a-actor-layout.js`・`a-return-motion.js` と `app.js` の `makeSkull3D()` |
| コウモリの動き | `web/b-motion-runtime.js` の `parameters()`・`advance()` | `bat-motion.js` の出生・力・採取データ、`bat-phase.js` の羽ばたき履歴 |
| 色の説明・見本だけ | `web/usage-copy.js` の `look()`・`update()` | `i18n.js` の日英文、`operator-guidance.qa.cjs`。実際の色変換は別の処理 |
| ドクロの実際の色 | `web/a-composite.js` のGLSL stage 5・6と `draw()` | `performance-api.js` の色相・Glow連動、`app.js` の `responseValues()` |
| コウモリの実際の色 | `web/bat-art.js` の合成シェーダー | `app.js` の `makeBats()` から渡す `colorHue` |
| ドクロの形・描画 | `web/app.js` の `makeSkull3D()`、`a-skull-raster.js` | モデルの埋込みデータは `app.js` 内。今回の整理では移動していない |
| 流体・Glow・文字合成 | `web/a-fluid.js`、`a-composite.js` の `prepare()`・`draw()` | GPU所有責任、演算順、Float32丸め、RGBA8変換境界を保持する |
| 最終の反転・円マスク | `web/output-operators.js` | `output-uv.js` の埋込み校正データ、`app.js` の `render()` |
| 操作画面・案内文 | `web/console.html`・`console.css`・`console.js`、`usage-copy.js` | `i18n.js`、`START-HERE.html`、`GUIDE.html` |

## 値が投影へ届く順序

標準の二窓構成は次の順序です。

```text
console.html の物理キー
  -> keyboard-performance.js: down() が intent を作る
  -> console.js: request() が MessagePort で送る
  -> stage-receiver.js: receive() が要求を検査
  -> performance-api.js: dispatch() / queue() / advance() / apply()
  -> app-control-api.js の公開パラメーター -> control-api.js の実値
  -> app.js の変更通知と描画
  -> A（ドクロ）または B（コウモリ） -> output-operators.js -> 投影Canvas
```

操作画面のスライダー・目標ボタンは `console.js` から同じ演奏intentを送ります。
文字入力・一部設定・停止などは共通APIへ送る別の要求で、`stage-receiver.js` が振り分けます。
返答は非同期です。試験ではクリック直後の古い表示を読まず、目標位置・場面名・停止状態の反映を待ちます。

`control-api.js` の初期値、`app-control-api.js` のschemaメタデータ、演奏用 `profiles` は別々にあります。
標準二窓では演奏プロフィールが後から適用されるため、初期値を変更するときは三者を確認します。
`apply()` の動き1軸は振幅・力・初速など複数の実パラメーターへ変換されます。

`queue()` は目標まで150msで補間し、色相は短い向きへ回します。
二窓演奏のA色相・Glowは `app.js: responseValues()` でその補間値を直接使用します。
schemaの元Lag説明を、すべての入力経路にそのまま当てはめないでください。
単窓の比較UIは `control-adapters.js` から共通APIへ入る別経路です。

## 時計とGPU処理で保つ点

- `motion-clock.js` の共有時計、A/Bの固定ステップ、演奏目標の補間、Aの30Hz描画ゲートは別の処理です。
- `Math.fround()`、和の順番、シェーダーの演算順を変更すると丸め結果が変わり得ます。採取係数を見やすさだけのために丸めないでください。
- ドクロはモデル/姿勢 → ラスタ → 頭前処理 → 流体 → 合成の順です。`prepare()` と `draw()` の分離自体は頭画像のキャッシュではありません。
- 流体runtimeがWebGL contextとping-pongの色テクスチャを所有します。合成側は借用し、独自のLINEAR samplerを使います。合成側を先にdisposeし、その後に流体をdisposeします。
- 共有テクスチャのdescriptorはcontext・幅/高さ・channel・向きを検査します。別contextのtextureを渡してはいけません。
- `a-composite.js` は同じGLSLから13種類の定数stageプログラムを作ります。`fragment.replace('uniform int stage;', ...)` が使う文字列を変更すると定数化できなくなります。
- `?aTransfer=legacy` は旧読戻し転送、`?aPrograms=uniform` は以前の2種類（0/1）の定数化へ戻す比較スイッチです。通常の画面やブラウザー設定を変更するものではありません。
- Pauseは資源を保持します。Stopは黒画面にして資源を解放し、Resumeは同じ選択・設定で再構築します。Endは保持データも解放します。

## 読込み順

classic scriptと `window.Halloween…` を使用しています。`file:` での利用も含むため、読込み方式を変える作業は別途検証が必要です。
正確な順序は `web/index.html` と `web/console.html` のscriptタグが根拠です。

- 操作窓: `i18n` → `window-safety` → `keyboard-performance` → `usage-copy` → `console`。
- 投影窓の先頭: `stage-role` → `projection-startup`。他のscriptはHTMLに書かれた順の `defer` です。
- Aの動きは `motion-clock`・`a-motion-lag` の後、B runtimeは `bat-motion`・`bat-phase` の後です。
- 合成は `a-source-noise`・`a-source-blur` の後、`app` は描画・共通API各モジュールの後です。
- 末尾は `app` → `offline` → `window-safety` → `performance-api` → `stage-receiver`。初期化時とイベント実行時の参照を混同しないでください。

## 整形と確認

開発者向けにNode.jsとPythonを使用します。整形ツールはアプリの依存物ではなく、配布ZIPにも入りません。

```text
npm install --prefix output/readability-tools --no-audit --no-fund --ignore-scripts prettier@3.6.2 acorn@8.15.0
node tools/run-unit-tests.cjs
node tools/check-source-equivalence.cjs <整理前commit> output/readability-tools/node_modules/acorn
```

`.prettierrc.json` はJSの整形用です。GLSLテンプレートの自動整形は無効にしています。
`web/bat-atlas-data.js` と `web/sw.js` は生成物なので手で整形しません。
GLSLを整形した場合、上の構文比較はJSのASTとGLSLトークン列、定数stageの置換対象を照合します。
これは構文・トークンの比較であり、ブラウザーでのコンパイルや画像比較の代わりにはなりません。
意図した動作変更を含む作業では、この「動作同一」比較の不一致を隠さず、変更別のテストで確認します。

`run-unit-tests.cjs` は現在17件のCPU単体スイートを順次実行します。
ネイティブ窓試験、ブラウザー試験、長時間運転は含みません。
変更別には、キーは `operator-contract`、色説明・準備表示は `operator-guidance`、APIは `app-control-api`、
流体は `a-fluid-sampling`、A/B動きは `a-scene-golden`・`b-particle-step`・`b-force-field` などを確認します。
既存ブラウザー試験の実行方法・環境変数は [tests/README.md](../tests/README.md) を参照してください。
古い版に固定された期待値を含むケースは、その版の履歴検証と現行版の検証を区別します。

## 梱包とオフライン資産

```text
python tools/build-web-package.py
```

このコマンドは `web/bat-atlas-data.js` と `web/sw.js` を再生成し、`dist/` にZIPと `web-manifest.json` を作ります。
既存の同名ZIPを上書きします。公開済みZIPを手元で保持する場合は、リポジトリー構成を保った検証用コピーで実行してください。

新しい実行時ファイルを追加した場合は、HTMLのscript/linkだけでなく `tools/build-web-package.py` の `ASSETS` に追加します。
開発用サーバーを使う場合は `tests/serve-web-preview.py` の許可一覧も確認します。
`sw.js` のHASHES/BUILDを直接編集しても次のビルドで上書きされます。ビルダーの入力ファイルを直して再生成します。
画像の差替えにはPNG・埋込みpayload・`bat-art.js` とビルダーの整合性hashの更新も必要です。
モデル用の一般変換ツールは同梱していません。埋込みデータの移動・変換は今回の整理範囲外です。

梱包後はmanifestのSHA256・資産hash・ZIPのCRC・全エントリーを照合し、展開した内容をChromeで試します。
A/B、色、文字、Pause/Resume、Stop/Resume、Endを短時間ずつ確認し、最後に描画と所有サーバー・試験窓を終了します。
描画比較は解像度、時計、姿勢、文字、Noise入力を揃えて行います。平均fpsだけを画像同一性の証明にはしません。
この手順のビルドやローカル確認が、mainへのマージやRelease公開を自動的に行うことはありません。

過去の採取・性能資料は `docs/` の版別記録です。現行の変更入口にはこのページを使い、必要な履歴へ辿ってください。
