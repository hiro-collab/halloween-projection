# v53 Motion, input and skull surface

The latest private preview fixes V long holds, the skull rest row at low strength, live bat-force strength/C modes, and internal triangle seams together. Open the extracted START-HERE.html in Chrome. Digits1..8 move from quiet to strong; A quiet returns the body to a fixed row, B quiet keeps flutter and central flight. V caps its accent after3seconds while key performance remains armed; release before a new accent.

- Details and source distinctions: `docs/MOTION-SURFACE-V53.md`.
- Package: `dist/halloween-projection-web-v0.1.53-motion-surface-preview.zip`.
- Release evidence: `releases/v53.json`.

# v52 導入説明の修正

配布ZIPを新しく展開してChromeでSTART-HERE.htmlから起動できます。準備段階は画面ボタン、キー操作は「演奏開始」の後という順番を明記しました。導入・ヘルプの版表示と終了・再起動の説明を更新しています。v51の描画、モデル、画像、動き、キー動作は維持します。

- `docs/INSTALLATION-V52.md`: 実配布ZIPからの導入確認と検証範囲。
- 配布物: `dist/halloween-projection-web-v0.1.52-install-guide-preview.zip`。

# Halloween Projection v51

Windows・Chrome向けの本人用導入確認版。既定は3体の回遊、出現6％・0.2秒です。

## 導入

1. 配布ZIPを「すべて展開」。
2. 展開フォルダーのSTART-HERE.htmlをChromeで開く。
3. 「操作窓を開く」→「投影窓を開く」。
4. 投影窓で「ウィンドウで始める」または「全画面で始める」。
5. 操作窓で文字と見えを準備し、「演奏開始」。

コマンド入力・追加ソフトは不要。展開フォルダー内の全ファイルを保持するとネット接続なしで起動できます。文字・設定は投影窓を閉じると初期化されます。詳しくはweb/GUIDE.html。

GitHubの「Code → Download ZIP」で取得したソースZIPの場合も、展開後に一番上のSTART-HERE.htmlをChromeで開けます。現在のweb/への入口です。app/は旧Windows試作の履歴で、通常の導入には使いません。

## キー配置

| キー | 操作 | 押し方 |
|---|---|---|
| 1 2 3 4 5 6 7 8 | 動きの激しさを8位置から指定 | 1押下で目標へ |
| Q W E R T Y U I | 色相を8位置から指定 | 1押下で目標へ |
| A S D F G H J K | 文字サイズを8位置から指定 | 1押下で目標へ |
| 9 / 0 | ドクロ数を減らす / 増やす（1〜6体） | 1押下ずつ |
| Z | ドクロ / コウモリを交互に切替 | 単発 |
| X | 通常→左右→上下→上下左右→通常 | 単発 |
| C | 動き方を3状態で切替 | 単発 |
| V | 一時アクセント | 押している間・最大3秒 |
| B | 準備した基準へ戻す | 0.6秒長押し |
| N | 映像計算をReset（文字・設定は保持） | 0.6秒長押し |
| Space | 一時停止・再開 | 単発 |
| Esc | キー演奏を解除（映像は続く） | いつでも |

```text
1 2 3 4 5 6 7 8  9 0   動き8位置 / 体数−＋
Q W E R T Y U I  O P   色8位置
 A S D F G H J K  L    文字サイズ8位置
  Z X C V B N M         映像 / 向き / 動き方 / 一時 / 基準 / Reset
```

目標指定は8段階、実値は約0.15秒の時間基準で線形移行。途中の再指定は現在値から連続。色相は短い円周経路。正確な中間値は各スライダーで指定できます。「演奏開始」を押し、操作窓にフォーカスがある間だけ有効。半角英数・Shiftなしで使います。入力欄・選択欄・IME・修飾キー・別窓への移動でキー演奏を解除し、戻っても自動再開しません。数字や文字を入力中に演奏キーを奪いません。

向きは通常→左右→上下→上下左右→通常で、文字とエフェクトを含む最終出力だけを反転します。UIは正位置、映像切替でも向きを保持。台形補正・90度回転は追加していません。

## 開発者向け

ビルド: `python tools/build-web-package.py`。検証: `node tests/app-control-api.qa.cjs`、`node tests/actor-presence.qa.cjs`、`node tests/presence-lag.qa.cjs`。既存Playwright CLIのJSパスをPLAYWRIGHT_CLIへ設定して `python tests/run-browser-qa.py keyboard-lifecycle offline-unpacked`。Python/Node.jsは保守作業用で、利用者の導入には不要です。

コードはMIT。本人bat素材・測定データはMIT対象外で一般公開/再配布条件は未確定。RIGHTS.txtとdocs/PRIVATE-ASSET-BOUNDARIES.mdを確認してください。本人承認の既存private GitHubへのコード/同梱素材の通常pushだけが許可され、公開化・公開Releaseは含みません。実投影/別端末は未検収です。ZIP/動画/ログはGitへ含めません。


v51では、通常の顎支点を使用モデルの登録済み関節位置に揃えました。開口時に顎が頭の内部へ入り込む問題を修正しています。頭の動き・顎の独立開閉・閉じた姿・3段キーは保持しています。詳しくはdocs/JAW-HINGE-V51.md。
