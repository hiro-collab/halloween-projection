# Webセキュリティ確認 — private技術試作0.1.2

公開状態: GitHub private維持。Web公開・Pages設定・秘密URLの公開を行わない。QAは127.0.0.1だけ。
privateリポジトリーとWeb配信の非公開は別。私用HTTPSへ載せるときは配信先の認証/アクセス制限が必要。

## 配信と通信
配信対象はweb/の8ファイルだけ。CMD/PS/開発ツール/QA/Git/.env/原VJ解析文書を配信しない。
自作JS/CSS/Canvas2D。CDN、外部ライブラリ、外部モデル、画像、動画、フォント、解析/広告通信なし。
アプリのHTTP要求は同一originの静的ファイルだけ。alive/quitのhost連携API・localhost bridgeなし。
ブラウザー/OS自身の通常通信はこのアプリのネットワーク保証に含めない。
利用者は追加ランタイム・端末コマンド・Windows起動スクリプトを実行しない。

入力文字はtextContentで描画しHTML解釈しない。eval/innerHTML/script生成、任意file read/write、camera/mic/位置情報/APIキーなし。
文字/速度/大きさはメモリーだけ。localStorage/sessionStorage/IndexedDBへ保存せず、ページを開き直すと初期値。

CSPはdefault-src none、script/style self、worker/connect self、object/base/form禁止。inline script/styleなし。
開発用静的server例はHTTP frame-ancestors none、X-Frame-Options DENY、nosniff、no-referrer、camera/mic/location禁止も付加。
frame-ancestorsはmetaでは指定できないため、将来HTTPS配信でもHTTP headerを整える。単にweb/を置くだけで同等headersとはしない。
他のアプリが同じoriginで悪意あるJSを実行できる環境には置かない。専用の私用origin/フォルダーを使う。

## 保存・更新・解除
オフライン保存は画面で選ぶ。保存未選択の初期表示でService Workerを自動登録しない。
保存対象はindex.html/styles.css/app.js/offline.js/README.txt/LICENSE.txt/RIGHTS.txtの7つ。
sw.jsは更新確認の対象で、Cache APIへ保存しない。URL query、任意navigation、他のpath、ユーザー文字、ログ、認証ページはcacheへ入れない。
インストール時にstatus200・redirect禁止・個別SHA256一致・受信streamを262144bytes以内に制限。各fetchは10秒timeout。
manifest/hashが不一致なら新cacheを破棄し、既存の稼働版を残す。hashは配信元そのものを信頼する根拠ではなく、誤配信/不完全な更新を検出する。
assetとworker templateのcontent hashからbuild識別子を作り、全assetの準備後に新workerを待機させる。利用者が更新を選ぶまで稼働画面をreloadしない。
明示更新は描画を終了してreload、文字/調整が初期値へ戻ると説明。activate時に同じscopeの古いapp cacheだけ削除。
保存解除は正確なapp scopeのworker unregisterとapp専用prefixのcacheだけ削除。他のcache/worker/ブラウザー全体のデータを消さない。
同じscopeに他アプリのworkerがある場合は上書きせず保存を拒否する。
初回保存は接続が必要。ブラウザー削除/容量制限/別profile/別端末では再準備。file://保存非対応を明示。
端末に保存したMITアプリ本体はログアウト後も残り得る。認証ログアウトとローカル保存解除は別。共有PCでは解除を案内。

## 検査
19の描画/操作項目、13のWeb/入力/cache安全性、4の更新、3の不一致更新をlocalhost展開版で合格。
cacheの7ファイル/入力非保存、offline reload/新規tab、他cache保持、解除後cold start不可、更新待機、旧cache整理、不一致拒否を確認。
合成不一致のworker install errorは期待した拒否。通常のpage例外の合格と混同しない。
履歴含むprivacy scan、素材・依存区分、MITと著作権表示を確認。元TOE/モデル/60frame原作画像/動画/生logはコミットしない。

## 残る境界
私用HTTPSの認証/headers/hostingの実際の設定は未試験。この作業は外部配信を作成していない。
物理ネット切断、製品版Chrome/Edge・別PC・長時間・storage eviction・実機投影は未試験。
全画面API成立と実デスクトップの枠消失は別。cloud側でAPI成立でも枠が残る所見を保持。
原VJの3D頭/下顎・流体・原作コウモリ/APIは未実装。技術試作を完成品とは称しない。

ライセンス: 自作code/新2D/説明文は本人承諾のMIT。原素材・外部素材は別条件で、現在は含めない。
公開切替、費用、新規重要権限、原素材採用は今回範囲外。
