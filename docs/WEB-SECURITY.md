# Webセキュリティ確認 — private試作0.1.3

GitHub privateを維持し、外部Web/Pages/Releaseを作成していません。QAは所有127.0.0.1だけ。
private repositoryと配信の認証は別です。将来のHTTPS配信は実際の認証/アクセス制限/headersの検収が必要です。

## 配信・入力・通信

web/の12ファイルだけを配信/ZIP化。CMD/PS/開発ツール/QA/Git/.env/原TOE/モデル/動画/生ログは配信しません。
Canvas2D、自作JS/CSS、同一originの本人bat atlas。CDN/第三者ライブラリ/外部フォント/解析/広告通信なし。
利用者の端末コマンド・追加TD/ランタイム実行、alive/quit host API、camera/mic/位置/APIキー/任意ファイルアクセスなし。
ブラウザー/OS自身の通信はアプリの通信保証に含めません。

文字はtextContentで表示しHTML解釈しません。文字/調整はRAMだけ、localStorage/sessionStorage/IndexedDBへ保存しません。
CSPはdefault-src none、script/style/worker/connect self、object/base/form禁止。inline script/styleなし。
開発serverはframe-ancestors none、DENY/nosniff/no-referrer、camera/mic/location禁止header付き。
将来の配信headerは別途確認。専用の私用origin/フォルダーを使用してください。

## 図案の取得・解放

bat-art.jsは固定同一origin URL、200、redirect拒否、SHA256一致、stream128KiB上限、fetch10秒timeout。
ページ開始時に圧縮PNG61,130bytesだけ準備し、描画bitmapはBのactive scopeが所有します。
共有取得は最大1件。Stop/切替はpendingをabortし、遅延decodeが終了したbitmapもcloseします。
Stopはbitmap/RAF/effect/pendingを0へ戻し、検証済み圧縮PNGを同ページの再開用RAMに保持します。
Endは圧縮PNGも0へ。準備前のofflineはerror/案内を表示し、描画資源を解放。接続後の再開でretryできます。
取得/準備状態をUI表示。未取得/未保存画像がofflineで取得可能とはしません。

## 選択式保存・更新・解除

初期表示でService Workerを自動登録しません。「この端末へ保存」は11assetだけを保存します。
index.html/styles.css/app.js/offline.js/README.txt/LICENSE.txt/RIGHTS.txt/control-api.js/bat-art.jsとassets内のPNG/帰属書。
sw.jsは更新確認対象、Cache API対象外。query/任意navigation/他path/入力/認証ページ/ログを保存しません。
個別SHA256/200/redirect拒否/受信stream256KiB上限/fetch10秒。assetとworker templateのhashでbuildを識別します。
新asset準備失敗では新cacheだけを破棄、旧版継続。準備済み更新は明示選択まで待機、適用はEnd/reloadして入力初期化。
activateは同scopeの旧app cacheだけ削除。解除は正確scopeのunregister/専用prefixだけ削除し、他cacheを保持。
初回保存は接続が必要。保存済み同profile/同URLでは再読込・新tab・通常再起動後もofflineでB取得できます。
ブラウザー保存削除/eviction/別profile/別PCは再準備が必要。file://の起動/保存を保証しません。
ログアウトと端末保存解除は別です。共有PCでは保存解除を案内。同scopeの別workerは上書きしません。
hashは更新の完全性を検出し、配信元の信頼や認証を代替しません。

## 検証と残る境界

今回の19操作・22API/画像資源・15保存安全・4更新・3不一致PNG更新を独立に検証。
全60frameの不透明画素をraw RGBA候補と比較。元TDの最終render/alpha/色管理/合成一致の証拠ではありません。
詳細と最終配布情報は[B回帰修正](BAT-OFFLINE-FIX-VALIDATION.md)。
原atlasはMIT対象外のprivate本人比較用。外部配布条件未確定。自作code/新2D/説明のMITを画像へ拡張しません。
private HTTPS、製品Chrome/Edge、別PC、物理切断、長時間、storage eviction、Windows枠消失、実機投影/収録は未試験。
原Aの3D頭/下顎/流体/背景文字、原B飛翔/最終合成の忠実再現は未実装/未検収。
公開、販売、追加費用、新規権限、保護回避、他アプリ強制終了は行っていません。
