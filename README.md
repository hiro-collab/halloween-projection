# Halloween Projection — private Web preview

利用者はWebページをブラウザーで開き、改変する人はソースを使う構成です。
**現在はGitHub private・本人確認用。一般公開のWeb URLやGitHub Pagesは作成していません。**

動くのは新規2D図形の技術試作0.1.3です。Bは本人生成cache60framesの比較再生へ置換。入力APIと図案再生を分離。原VJの3D頭/下顎・流体・飛翔力/最終合成は未再現です。
原作再現の完成品とは呼びません。現在の[仕様](docs/REQUIREMENTS.md)と実装範囲を区別してください。

## Webで使う

web/が配信対象のすべてです。[日本語案内](web/README.txt)と画面の投影ガイドを参照。
利用者は端末・CMD・PowerShell・TDの実行や追加インストールを必要としません。
「表示を終了」で描画を解放し、タブを閉じます。
オフライン保存は利用者の選択式。準備後は同じブラウザー・同じURLで再読込できます。
初回保存は接続中に行い、更新/解除は画面から操作。入力文字・調整は保存しません。

確認はlocalhostのみ。私用HTTPSで使う場合は配信先自体の認証/アクセス制限が必要です。
privateリポジトリーや秘密URLだけではWebページは非公開になりません。
配信するのはweb/だけ。Git/.env/開発ツール/QA/原VJ解析資料を配信しません。
詳細は[セキュリティ](docs/WEB-SECURITY.md)、[検証](docs/WEB-VALIDATION.md)。

## ライセンスと素材

本人が承諾したMITを自作コード・新規2D図形・説明文へ適用しました。[LICENSE](LICENSE)。
GitHub名義hiro-collabを著作権表示に使用。改変・再配布・商用利用も含みます。
原モデル・動画・音楽は含めません。本人bat cache由来atlasはprivate確認用の別素材でMIT外・一般配布条件未定。外部素材へMITを一括適用しません。[権利台帳](docs/RIGHTS.md)。

## 開発・履歴

web/index.html、app.js、styles.css、offline.jsが編集対象。自作JS/CSSでCDN/外部依存なし。
開発者はpython tools/build-web-package.pyでハッシュ付きsw.jsとdist/の静的ZIPを再生成します。
tests/serve-web-preview.pyは127.0.0.1限定の開発確認サーバー。利用者向けの起動方法ではありません。
app/とSTART.cmdは以前の技術試作の履歴です。本人のSAC保護環境で起動拒否があり、一般向け配布として使いません。
旧Windows版ZIPや原本を上書きしません。公開化・料金・新権限・証明書購入は別の判断です。
\n## 現在の一段階\n0.1.3はB原図案/羽ばたき+入力APIのprivate実装候補です。[確認/未検証](docs/BAT-STAGE-CHECKPOINT.md)。0.1.2のcache合格をこの版の合格へ流用しません。\n