# 技術仮版のブラウザ検証
開発者用。利用者は最上位START.cmdをダブルクリックして起動する。

開発者はSTART.cmd --test-console --no-browserで返るloopback URLを既存Playwright CLIで開き、
output/を作成してpreview.qa.jsをrun-codeへ渡す。操作/300切替/停止/文字/サイズ/API全画面を確認。
続けてstartup.qa.jsで失敗時のパネル復帰・認証検証・画面終了と所有起動処理の停止を確認する。
startup.qa.jsは最後にこのサーバーを通常終了する。結果は小さな集計で返し、詳細はページのpreviewTestReportに保持。
画像や生ログはGitへ追加しない。製品版ブラウザ枠除去・Explorer UI・原作再現は別検収。
