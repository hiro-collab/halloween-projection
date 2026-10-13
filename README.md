# Halloween Projection — private Web preview

利用者はWebページをブラウザーで開き、改変する人はソースを使う構成です。
**現在はGitHub private・本人確認用。一般公開のWeb URLやGitHub Pagesは作成していません。**

0.1.7は新規2D骸骨、CC0別候補の頭・顎、本人bat cache60framesを使う私的比較版です。Bの初速・CrossをUI/キー/共通APIから粒子計算候補へ接続しました。原VJの3D頭/下顎・流体・飛翔力/最終合成は未再現です。
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

## 現在の比較版
0.1.7のB色/向き/発生・投影の差分と自己テスト、独立レビュー用資料は[B circle検証](docs/B-CIRCLE-VALIDATION.md)を参照。0.1.6の入力・時計検証と旧版は保持しています。原BのSparse雑音/力/位相/最終合成は未一致。原Aの流体・背景文字は次段階、スマートフォン通信/UIは未決です。

## 原作照合の現在地
0.1.4は保存fps/固定Trail位相寄与だけを合わせたprivate比較候補です。[差分・検証・不足する基準](docs/BAT-SOURCE-MATCH.md)。飛翔・色合成・文字maskの忠実再現は未完です。0.1.3合格版と0.1.2安定版へ戻せます。

## CC0別ドクロの私的比較
0.1.5では頭/顎を独立操作できるCC0別模型を第三の比較シーンへ追加しました。[模型・検証](docs/CC0-SKULL-TRIAL.md)。元Aの完全再現とはしません。[原B自己採取の実際の停止点](docs/TD-REFERENCE-ATTEMPT.md)。既存版へ戻せるprivate branchを維持します。

## 0.1.8 B信号・光・文字合成比較

SparseをXYZ空間で評価し、40枠方向のLag、生存数別Random/rolling/locked画像位相を反映しました。
文字の黒い矩形を除き、光と文字をCanvas内へ合成する非公開比較版です。
[測定・修正・未一致](docs/B-SIGNALS-FIRE-VALIDATION.md)と[原VJ/Webの技法対応](docs/VJ-TECHNIQUE-MAP.md)。
原粒子計算、最終Noise/Blur/文字マスク、10秒境界、原A流体/背景文字は未完です。
0.1.7の独立レビュー不合格を保持し、自己テスト合格を原再現合格として扱いません。

## 0.1.9 B発生入力・位置更新比較

原と同じReset/seedの120stepを採取し、42発生点と速度/位置更新を小さく修正しました。
[出生step・原入力・抵抗対照・残る力場差](docs/B-PARTICLE-STEP-VALIDATION.md)。
最初の出生位相と原Force SOPは未一致です。d4e38b6/0.1.8を保持し、外部送信は保留しています。

## 0.1.10 B出生位相比較

原240stepの20出生と同じ位相に修正。部分ageの乱数は未一致です。
[出生/Force入力の有限切り分け](docs/B-BIRTH-PHASE-FORCE-SPLIT.md)・[原Aの確認順](docs/A-LOCAL-REPRODUCTION-OUTLOOK.md)。
同じ新生状態で大きい配置差がForce SOP入力から増えることを確認。力場は今回変更していません。

## 0.1.11 B原Force場比較

原の正規化方向・Wyvill weight・Vortex/Spiralの成分解釈から力場を最小修正しました。
[原値/式/同条件検証/残差](docs/B-FORCE-FIELD-VALIDATION.md)。
同じ原新生状態のForce-only位置差は約.529→4e-7、全力場は約.548→.0508。乱流/部分age/最終外観と原Aは未完です。

## 原Aの配線・頭/顎比較

原Aの共通親/顎支点、absTime入力、2D流体と文字枝を確認しました。
[同じnativeリグで原/CC0別候補の4姿勢を比較](docs/A-SOURCE-RIG-VALIDATION.md)。
候補の仮配置には約54pxのずれがあり、採用前に位置合わせと顎支点を分離します。Web/0.1.11は保持し、原A全体は未完です。
