# Web検証 — 0.1.2 private preview

Windows上の所有localhost server、独立フォルダーへ全展開したWeb ZIP、隔離したpersistent Chromium154.0.8037.98 profileで検証。
UIの全画面APIと、Windowsブラウザー枠消失は区別。実機・private HTTPS配信の合格へ拡大しない。

| 範囲 | 結果 |
|---|---|
| 描画/操作・300切替・停止解放・日本語240字・サイズ・API全画面/Esc・Webガイド | 19/19 |
| 選択式保存・CSP/header・開発file非配信・XSS文字非解釈/非保存・cache allowlist・offline再読込/新tab・Web終了・解除scope・解除後offline cold start失敗・同一origin GETだけ | 13/13 |
| 稼働中に更新待機・明示更新reload/reset・旧cache削除・新cache offline | 4/4 |
| asset不一致で新worker拒否・旧描画継続・旧cache offline維持 | 3/3 |
| ブラウザープロファイル通常終了/再起動後、最終buildのoffline cold startとWeb終了 | 合格 |
| 最終ZIP CRC・8ファイル・source bytes/hash一致・個人パス/秘密/素材scan | 合格 |

通常描画はpage例外なし。合成不一致更新でのinstall errorは期待した拒否。
cache解除のconfirm UIを観測。自動集計は隔離fixture内でconfirm結果を受入れに置換し、解除/更新後状態を検証。
原作資料やscreenshots/raw logsをGitへ含めない。生証拠は私的QAフォルダーに保持。

未試験: Windows既定browser実表示・物理ネット切断・製品版Chrome/Edge・別PC・長時間・storage eviction・private HTTPS認証/headers・実デスクトップの枠消失・実機投影・動画収録。
file://オフライン保存はサポートしない。原VJの3D再現版は未実装で合格対象外。

保存処理修正後にも13/13・4/4・3/3を再実行。workerコードだけを変更しasset hashは同じ合成更新でもbuildが変わり、不一致assetで稼働cacheを消さないことを確認。
最終build 0.1.2-web-preview-4de4101f4160、Web ZIP16,439bytes、SHA256 a9580459faa54da1294657b0bde4edad51a6f13dd6e6fac26a7fabf65985038e。
