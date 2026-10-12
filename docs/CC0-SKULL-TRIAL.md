# CC0別ドクロの私的比較 — 0.1.5

原VJのドクロを同定/完全再現した版ではありません。本人の採用意向を受け、出典・頭/顎分離を確認済みの別候補を第三の比較シーンへ採用。
元2D/B、0.1.2安定版、0.1.3合格版、0.1.4部分比較版を保持。一般公開・販売・外部素材配布なし。

## 実物の出典・変換

[Human Skull / CDmir](https://opengameart.org/content/human-skull-0)、一次ページの[CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)。
対象archiveはskull-obj.zip、実OBJはskull-obj/skull-Low4K.obj。分析OBJとの違いはCRLF/LFだけで、全頂点・全faceを実archive OBJと照合。
2,435位置頂点、2,276faces、fan三角化4,548tris（ページ表示4,538とは差あり）。
大骨0＋上歯17..32を頭2,656tris、大骨35＋下歯1..16を顎1,892trisへ割当。全faceを一度だけ使用、面切断/欠落/重複なし。
位置をfloat32、indexをuint16、頭/顎ラベルをbyteにした61,068-byte形式をapp.jsへ埋込。
texture/normal/AO画像は未採用。白骨の幾何比較で、元TDのtexture・照明・形状一致とはしない。
データはCC0、独自描画/操作コードはMIT。本人bat PNGは従来どおりMIT外のprivate素材。
archive SHA256 067899af520649177c0dd5de1a4b18bd4f46daf667df04a405dc9a27d206011b。
実OBJ SHA256 f24014fa02de4b3e3be2926df887114f42cb49361592b103a47d7cac8d8225af。
変換data SHA256 bb38451e202e30ce2d84cdc224433ac27aafd43539ed362e6127a980b3538706。

## 操作・描画・解放

skull3d比較シーンはCanvas2Dで3D投影・奥行き順描画。WebGL2・追加ライブラリ/CDN・TD実行・追加runtimeは不要。
頭の回転速度と顎開閉の速度は独立時計。頭0で停止、顎速度0では開き0..45度を固定角として操作。
サイズ50..150%、支点Y[-1.15,-.65]/Z[-.3,.2]、顎/下歯の色分けを同じ検証済み入力APIで調整。
初期支点(0,-.75,-.12)は検査用仮値。原VJ支点の同定ではなく、本人が見た目を調整できる初期値。
最大30Hzで幾何を描画し、間のframeはCanvasを保持。停止した状態のresize/入力変更でも描画を更新。
active模型は1scope。Stop/切替で模型61,068bytesと描画scratch78,423bytesの参照を破棄。
Stop後は埋込模型の文字列81,424charsを再開用に保持。Endでこれも0、PNG保持/RAF/listenerも解放。ブラウザー全体のメモリー解放とはしない。
静的ファイル12/cache11は維持。模型はapp.js内なので任意ファイル・追加fetch・許可拡大なし。文字/調整はRAMだけ。

## 有限検証

所有localhost、全展開したZIP、隔離persistent Chromium154.0.8037.98。18/18:
実模型/三角数、不要controls非表示、6無効値atomic拒否、UI/API、顎だけ動かした頭領域のpixel不変、
頭だけ動かした顎clock/局所角不変、手動開口/支点、黒い間欠frameなし、1080p負荷、
Pause両clock/pixel固定、paused Reset、縦横8組の最大size/45度開口/支点端、停止模型resize、
300三シーン遷移、Stop/Resume/End全模型buffer解放、page例外なし。
1920×1080の実測は約27.9描画fps、CPU幾何/描画命令の平均2.59ms、p95 3.30ms。上限30Hzに対する4.5秒の私的試験。

GPU合成完了時間を直接測った値ではなく、モデルの全4,548trisを維持した描画命令時間と実render数。実機投影/他PC/製品browserへ拡大しない。
既存操作19/19、B位相6/6、B API/資源22/22、保存15/15、60frame不透明画素60/60を今回再試験。既存試験の条件を変更していない。
更新4/4、不一致PNG更新3/3、通常browser再起動後offlineのB/3D/End6/6も今回合格。
未試験: 物理投影、通常Windows枠消失、私的HTTPS/認証、物理切断、長時間、他PC。file://非保証。
原Aの流体・背景文字・元モデル/支点/texture一致、原Bの最終飛翔/色・文字maskは未検収。

## 候補

halloween-projection-web-v0.1.5-skull-candidate-preview.zip、124,968bytes、build 0.1.5-skull-candidate-preview-0585b458d488、SHA256 78c8ac96123cc6a82d16b77e2de7f20e99fc8992281195a32d173a0a50c5e2ad。
模型・bat画像の条件を混同せず、private候補としてだけ納品。原TOE、採取用コピー、原callback、私的スクリーンショット、生logsは配布/Git/Libraryへ含めない。
