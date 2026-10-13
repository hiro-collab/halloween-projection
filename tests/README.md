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
