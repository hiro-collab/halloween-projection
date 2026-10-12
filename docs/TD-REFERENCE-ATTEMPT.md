# 元Bの自己採取 — 実行環境確認

これは起動停止時点の履歴です。その後、保存済み基準採取の正常終了と72 PNGを確認し、build33230で独立時計の比較も実行しました。現在の結果は[VJ入力・時計の検証](VJ-INPUT-TIMING-VALIDATION.md)を参照してください。

最新本人/親指示により、原TOEの私的copyを作り、既存TouchDesignerで基準を自ら採れるか実行しました。
原アーカイブhash照合、27,230,064-byte原TOE copy、公式toecollapseで875 selected filesの原B隔離copyを構築、実起動まで成功。
元データ/原本/既存版を変更せず、起動前のTD/TouchPlayerプロセス0件を確認して所有する別instanceだけを開始。

## 起動の安全化と採取予定

原Bのnative粒子/力/rotation/frame-index/色・blur/文字合成は保持。
MCP/Hermes、inputgate、camera/mic/devices、元全projectの起動/外部連携、Windows表示出力を読込対象から除外。
未選択snow/heart/別処理枝とMovie/File SOPは停止し、外部file参照を空にした。default cameraのガイドfileも描画対象外として停止。
原Bの2つのCHOP callbackは局所deco_fire/texterのallowCookingだけを変更すると全文監査して保持。
自作Execute DATだけを起動処理として追加。既存保存原画像・native演算を使い、Cross0/.5/1、初速1.3/.65/2.6、文字なし/ありを採取。
文字入力は自作検査文字であり、元歌詞を転用しない。Hueの外部親値を保存値で置換した条件を記録。
ケースごとの評価params、位置/rotation/画像index、raw/色/合成/最終PNGを私的フォルダーへ保存し、
6ケース完了/停止marker/有限watchdogでproject.quitの正常終了（所有copyの未保存変更のみdiscard）するコード。
元全VJ演奏の完全再現ではなく、差分と使用buildを記録した隔離native B参照。

## 実測の停止点と最小操作

既存TD ProductVersion 0.99.2025.33070。元保存 .build 2025.33230。
所有TD instanceのMainWindowTitleは「File load version conflict」、Responding=True。
採取started/PNG/paramsは0件。起動が出来たことを、基準採取成功へ昇格しない。
本委任に正規Windows用node_replは公開されていない。Computer Use skillはnode_repl内の@oai/skyを正規入口とし、
独自helper/Win32/SendKeysを代用しない。ブラウザー用CUAのnative APIsもdisabled。接続復旧後もファイル・実行は成功しており、
現在の停止は通信拒否・原本未作成ではなく、上記の互換確認とWindows操作経路の不足。
版headerを書き換えて警告を隠す、新規TD契約/認証/インストール、保護変更、ユーザー/他担当のbrowser操作、強制終了はしていない。

最小の次操作は、正規Windows UIが使える本人/既存担当が「File load version conflict」の所有instanceだけを確認し、
開ける条件なら版確認を完了させること。具体的button文字は本環境で見ていないため推測しない。
版確認後に自作採取が開始/終了したかをstarted/finished/ケースfilesで確認する。
追加installが必要とはまだ判定していない。新規contractも行わない。所有PID/Temp copy/採取先は私的LAUNCH/BUILD記録で特定。
原本/利用者セッション保持のため、UIが操作できない所有instanceをOS強制終了していない。

通信中断通知後に保存diff・model/ZIP hash・QAログ・所有processを読戻し、重複作成せず継続。
独立して進められるCC0頭顎trialは実装・可動/負荷検証を完了し、旧回帰も維持。
