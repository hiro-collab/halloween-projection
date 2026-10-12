# 技術試作のQA（開発者用）

現在のWebはtests/serve-web-preview.pyでweb/だけを127.0.0.1へ配信し、
隔離Playwright profileでweb.qa.js（19）→offline-security.qa.js（13）をrun-codeする。
output/を作成。offline/security testは合成入力と専用cacheだけを扱う。
update.qa.js（4）は隔離fixtureでRIGHTSを変更してtools/build-web-package.pyを実行後に使う。
corrupt-update.qa.js（3）はさらに異なるbuildを作った後、fixture app.jsだけを不一致にして使う。元Webに不一致を加えない。
cache解除/更新confirmは自動集計のため隔離fixture内で受入れへ置換。confirm UI表示は別に観測済み。
persistent profileで通常close→同profile open→ネットワークoffline→URL gotoも確認する。

serve-web-preview.pyの--stdin-controlは所有serverをstdin quitで通常終了させる開発用。
開発者用Python/Node/PlaywrightはWeb ZIPに含めない。利用者はページを開くだけ。

preview.qa.js/startup.qa.jsは旧Windows試作の履歴検証。現在の一般向け起動手順には使わない。
画面画像/生ログ/私的パスをGitへ追加しない。
