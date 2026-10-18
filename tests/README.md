# 現行コードの検証入口

変更箇所と梱包手順は [開発ガイド](../docs/DEVELOPMENT.md) を参照してください。
CPU単体スイートは `node tools/run-unit-tests.cjs` で順次実行します。
以下は版別の検証記録です。固定バージョンや旧asset数の期待値を、現行の合格記録へ流用しません。

# v53 focused checks（版別記録）

Run `node tests/motion-strength.qa.cjs`, `node tests/surface-normals.qa.cjs`, `node tests/operator-contract.qa.cjs` and existing lifecycle units. With PLAYWRIGHT_CLI configured, run `python tests/run-browser-qa.py motion-surface input-hold-safety surface-quality resources keyboard-lifecycle actor-count actor-presence presence-lag entry-comparison offline-unpacked security-boundaries operator-flip`. GPU cases run sequentially. Motion-surface tests actual offline file UI, force distributions and production counters; surface-quality measures shared-edge alpha plus72 count/glow/yaw states. Headless focus tests are not hardware keyboard evidence.

# v51 当時のQA

通常の導入はSTART-HERE.htmlから二窓のWeb版です。Python/Node.jsは利用者には不要です。

- 単体: node tests/app-control-api.qa.cjs、node tests/actor-presence.qa.cjs、node tests/presence-lag.qa.cjs、node tests/operator-contract.qa.cjs。24位置の物理キー、150msの時刻補間、移行途中の再指定、循環色相、長押し保護を確認します。
- ブラウザー: PLAYWRIGHT_CLIに既存CLIのJSパスを設定し、python tests/run-browser-qa.py keyboard-lifecycle operator-flip offline-unpacked resources actor-count actor-presence presence-lag entry-comparison security-boundaries。ケースは順次実行し、GPU競合を避けます。operator-flipは四隅マーカーと非対称文字を使い、実際の出力シェーダーとA/B最終画像の4方向を画素比較します。entry-comparisonは比較導線を閉じて6%を保持することを検証します。
- 30分運転: PLAYWRIGHT_MODULEに既存playwrightモジュールを設定し、node tests/stability-soak.cjs <新規ZIP展開フォルダー> <Git外の保存先> 30。3体/6体/B各5分を2巡、Pause/Resetと資源回収を確認。画面FHD・DPR1・A内部720p。
- Windows実窓: 同じモジュール設定でnode tests/native-window.qa.cjs <ソースZIPまたは配布ZIP展開フォルダー> <Git外の保存先>。所有Chrome窓のPID・タイトル・前景を確認してからOSのEscを送ります。ほかの窓へ入力しません。
- file起動はネットワークofflineの隔離Chromeで検証します。Windows ExplorerのダウンロードUI・物理投影・別端末は別の検収です。

以下は旧版の履歴記録です。旧asset数や旧起動試験の合格をv49へ流用しません。

# 技術試作のQA（開発者用）

現在のWebはtests/serve-web-preview.pyでweb/だけを127.0.0.1へ配信し、
隔離Playwright profileでweb.qa.js（19）→offline-security.qa.js（15）をrun-codeする。
output/を作成。offline/security testは合成入力と専用cacheだけを扱う。
update.qa.js（4）は隔離fixtureでRIGHTSを変更してtools/build-web-package.pyを実行後に使う。
corrupt-update.qa.js（3）はさらに異なるbuildを作った後、fixture app.jsだけを不一致にして使う。元Webに不一致を加えない。
cache解除/更新confirmは自動集計のため隔離fixture内で受入れへ置換。confirm UI表示は別に観測済み。
persistent profileで通常close→同profile open→ネットワークoffline→URL gotoも確認する。

serve-web-preview.pyの--stdin-controlは所有serverをstdin quitで通常終了させる開発用。
開発者用Python/Node/PlaywrightはWeb ZIPに含めない。利用者はページを開くだけ。

preview.qa.js/startup.qa.jsは旧Windows試作の履歴検証。現在の一般向け起動手順には使わない。
画面画像/生ログ/私的パスをGitへ追加しない。

0.1.6 VJ入力比較:
- node tests/vj-input-contract.qa.cjs: 8項目。Web/端末非依存の入力契約。
- vj-browser.qa.js: 22項目。実キー・UI・候補粒子への反映、初速誕生時適用、連打/境界/切替/終了。
- offline-vj-restart.qa.js: 7項目。所有persistent browserを通常close/open後、blankからofflineで先にgotoする。隔離ZIPのloopback fixtureは8766/web-preview/を使う。
- ZIP照合後の展開先でVJ入力・B資源22・位相6・保存15・通常再起動7・更新4・不一致更新3を実行。
- Chrome profileは短い所有Tempパスを使う。長いcheckout配下ではCacheStorage.open内部エラーを観測した。セキュリティ解除はしない。
- QA serverを--stdin-controlで正常終了する場合、PTYでstdinを保持する。ユーザーや他担当のprocessを終了しない。

検証範囲と未一致はdocs/VJ-INPUT-TIMING-VALIDATION.mdを参照。

0.1.7 B circle比較ではb-composite.qa.js（12）で実1920×1080・発生/寿命・原投影・空文字・GPU色合成・Pause・解放/fallbackを確認。
bat-source-phase.qa.jsは原locked Trail40sample全枠へ期待値を拡張。旧第一24枠の期待値も保持。
独立外観レビューは別担当がdocs/B-CIRCLE-VALIDATION.mdの確定commit/静的比較画像を読み取る。自己テストの合格を原作一致判定へ流用しない。

0.1.8: b-signals.qa.js（6）は格子に含まれない原座標・原Lag応答・同じframeの40indexと資源解放を検証。
b-fire.qa.js（12）はGPU/文字mask/静止/停止/終了/fallback。原映像一致の試験ではない。
bat-source-phase.qa.js（6）はRandom/rolling/locked位相候補とframeLock/時計/Resetを検証。
offline-security.qa.jsは13静的assetの完全一覧のみ許可。ZIPはsw.jsを加えた14file。
同じ原画像の合成比較と未一致はdocs/B-SIGNALS-FIRE-VALIDATION.md。

0.1.10: b-birth-phase.qa.cjs / b-birth-browser.qa.jsは原20出生/240stepの出生数とReset位相だけを検証。部分age RNG/Force SOP一致を示さない。原4入力対照はdocs/B-BIRTH-PHASE-FORCE-SPLIT.md。

0.1.11: b-force-field.qa.cjsは原4固定Vortex/Spiral条件の12goldenと2edge契約（14）。Wyvill/方向/成分の実生産関数を原1stepへ照合。軸/外側guardはNative直接採取ではない。詳細docs/B-FORCE-FIELD-VALIDATION.md。

- 顎回帰: node tests/jaw-hinge.qa.cjs。通常Aの支点、0度の不変、親子行列と独立開口、個数/再選択による支点の保持、明示的な旧支点比較を確認。

## Data license

The five owner-scene validation JSON datasets are MIT licensed, Copyright (c) 2026 hiro-collab. See [DATA-LICENSE.txt](DATA-LICENSE.txt). Numeric contents are unchanged; the third-party model retains CC0.
