# v0.1ブラウザ検証
preview.qa.jsは既存本体検証を移したPlaywright CLI run-code用関数。開発者用。
START.cmd --no-browserのloopback URLを既存CLIで開き、output/を作成してからrun-codeへ関数を渡す。関数は現在のpage.url()を検証して再読込する。
300切替、停止/再開/Reset、文字、全画面、サイズ、例外を確認。結果/画像はoutput/へ置きGitへ含めない。
利用者の起動にPlaywright/Nodeは不要。原作再現と新APIの試験は未実装。
