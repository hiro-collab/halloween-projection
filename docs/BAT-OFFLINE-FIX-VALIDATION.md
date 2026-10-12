# Bオフライン回帰修正と実測 — private 0.1.3

第一段bat-source-previewで「読込済みページ→接続なし→B切替」が画像fetch失敗で止まった回帰を修正。
旧0.1.2安定版とmain、共有GUI、原VJを変更せず、bat-offline-fixへ限定しています。
原TDの保存図案を用いたB比較試作です。原飛翔/合成の忠実再現やA完成とは扱いません。

## 実装と準備条件

ページ開始時に固定URLのPNGを検証し、61,130bytesの圧縮データだけ準備します。
Bの描画scopeは一つのImageBitmapを24体で使います。飛翔時間と図案再生時間は独立。
Stop/切替はRAFと画像pendingをcancelし、bitmapをclose。停止した同ページの再開用に検証済み圧縮データを保持します。
Endでデータも解放。pending取得を共有し、abortが落ち着く前に新しい取得を重複させません。遅延decode後もcloseします。
準備済み同ページのoffline切替は可能。未取得/未保存で接続なしの画像取得は不可能なので、安全に停止して準備案内。
接続復帰後のResumeでretry。取得済みdecode失敗でもbitmap/RAFを解放し、再開できます。
端末へ保存した11assetは同URL/同profileでoffline再読込・新tab・通常再起動に使用。解除は正確scopeだけ。
文字/調整はRAMのみ。file://起動・保存を保証しません。利用者はCMD/TD/追加runtimeを実行せず、案内ページをブラウザーで開きます。

## 有限の独立試験

Windows、所有localhost静的server、隔離persistent Chromium 154.0.8037.98。
旧web.qa.jsの合格条件を削除/緩和していません。旧版の合格数は流用せず、今回の画像版を再試験しました。

| 範囲 | 今回の結果 |
|---|---|
| 旧操作・Pause画素固定・Reset・300切替/heap・Stop・日本語240字/8行・360×640・API全画面/非表示/Esc・読込済みoffline B切替 | 19/19 |
| 共通API/UI同期・無効値7種のatomic拒否・独立時計・frameLock・非選択設定・300切替/収支・遅延decode・未準備offline・復帰・decode失敗・不一致PNG・cold取得Stop/切替・End | 22/22 |
| opt-in・CSP/header・開発file非配信・文字非解釈/非保存・11asset allowlist・offline再読込/B・新tab/B・終了・他cache保持・解除後cold不可・origin GET限定 | 15/15 |
| 更新待機中の描画継続・明示reload/入力初期化・旧cache退役・更新後offline | 4/4 |
| 配信PNGだけを破損させた更新拒否・旧描画継続・旧verified cache offline維持 | 3/3 |
| 全60frameのraw RGBA候補との不透明画素hash比較、比較用bitmapclose | 60/60、一致 |
| 最終ZIPから端末保存、通常browserclose→同profile open→offline cold start/B→Stop→Resume→End | 5/5 |
| 日本語/空白を含む独立フォルダーへ最終ZIP全展開、12file/CRC/source bytes/hash | 合格 |

Stop観測: effect/RAF/object/bitmap/pending=0、canvas1×1、検証済みPNG61,130bytesのみ保持。
End観測: 上記に加えlistener=0、圧縮PNG=0。fetch最大1、bitmap最大1。
画像反復はcreated=closedを確認。300切替のheapは旧試験の1MiB上限内。
合成PNG更新のintegrity install errorは期待した拒否。取得/decodeエラーの注入と通常表示のpage例外を分けています。
confirm UIは既存検証で観測。今回集計は所有fixtureのconfirm結果を受入れに置換して、更新/解除後の実状態を確認。

## 元素材・権利・証拠上限

原cache tex3d1.data SHA256 287602b91d5d9f699258d5cb6b4e79dcc8ec28569d5a9928171e0a8c5fb99665。
PNG1600×540、10列×6行、60×160×90、SHA256 9da78cbc8d5721f136f3385354ea94345f9fe5bdae4cc7ce5cc4e8f45d5a317a。
元pixelをRGBA8候補として並べ、再着色/alpha変更なし。不透明画素の60frame一致はブラウザーPNG decode/crop比較。
半透明画素のCanvas丸め/色管理/TD live render/向き/最終合成/実tempo/仮飛翔の原作一致を証明しません。
保存LFO0.5Hzを参考とした30fps/2秒は暫定。base2は雪、旧Bat_FBXを本人circle batと同一視していません。
PNGは本人許容のprivate比較用でMIT外。外部配布条件未確定。コードのMITを画像/外部モデルへ適用しません。
TOE/モデル/原動画/生ログ/画面画像は配布/コミットしません。権利台帳とassets/OWNER-BAT-ASSET.txtを同梱。

## 検証環境の障害と未試験

反復失敗注入後のreloadでChrome net::ERR_NO_BUFFER_SPACEによりbat-art.jsが読めない1回を記録。
同時点のHTTP200/原本hash一致を確認し、所有検証browserだけを通常closeして新profileで再試験。
60frame/保存15/更新4/拒否3/最終cold5で再発なし。原因は確定しておらず、全環境での不発保証とはしません。
正規Windows UI経路のMXC0x80070003は未解消。Win32/SendKeys/強制終了/権限変更による迂回なし。
未試験: private HTTPS認証/headers、製品Chrome/Edge、別PC、物理ネット切断、長時間、eviction、実Windows枠消失、実機投影、動画。
API全画面とページ上のコントロール非表示を、実デスクトップの枠消失へ昇格しません。
原Aの外部モデル出典/配布条件、頭顎の対応/支点/live renderが未確認。Aの3D/流体/背景文字は今回未実装。
新しい外部Web/一般公開/販売/YouTube投稿/課金/資格情報追加/保護無効化はありません。
旧0.1.2の確認serverは親側の本人確認用として保持。今回所有の試験browser/serverは通常終了します。

## 最終私的配布候補

build 0.1.3-bat-source-preview-57e4d6629ade。
ZIP halloween-projection-web-v0.1.3-bat-source-preview.zip、79,628bytes、12ファイル。
SHA256 abef1f6b7092efff2cb05709d28f1eac7fb69943e1b6766c47949c77e803a362。
ZIPは静的web/だけ。Git blob・ZIP・11asset cache manifestの全bytes/hashを照合済み。
実画面例とraw集計は私的QAへ保持し、公開資料へ追加しません。動画カットは[収録予定](VIDEO-SHOTS.md)、まだ未収録です。
