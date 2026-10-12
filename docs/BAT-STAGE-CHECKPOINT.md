# 第一段のprivate実装チェックポイント — 0.1.3

対象: Bの本人circle bat保存図案/羽ばたき再生と入力API分離。
原VJのbat_set/bat/batImgs/tex3d1.dataを参照。60×160×90×RGBA候補、原pixelを10×6atlasへ配置。
原データSHA256 287602b91d5d9f699258d5cb6b4e79dcc8ec28569d5a9928171e0a8c5fb99665。
PNG61,130bytes、SHA2569da78cbc8d5721f136f3385354ea94345f9fe5bdae4cc7ce5cc4e8f45d5a317a。
本人が生成画像再利用を許容したprivate比較用。PNGはMIT外、外部配布条件未確定。元TOE/モデルは含めない。

実装: bat-art.jsは描画scope所有ImageBitmap、abort/late decode close、固定URL/サイズ/SHAチェック。
appは24体へ同じ60frame図案を使い、既存の紫色ベクターを撤去。既存の仮円軌道は残して原作飛翔一致とは扱わない。
30frames/sec基準、1周2秒は保存LFO0.5Hzを参考にした暫定再生。原作のlookup/最終合成/実tempoは未検収。
飛ぶ速さと図案再生倍率を別に操作。中央文字はtextContent/黒地/前面を維持。

control-api.js: select/set/setText/pause/resume/reset/stop/status。既存GUIの値検証・非選択設定保持・解放設計を参考。
UI/キーボードが同APIを使い、描画はDOM入力値を直接読まない。未知scene/key、NaN、範囲外を拒否する実装。
frameLock(nullまたは0..59)は比較用API。speedは仮飛翔時間倍率でTD Initialspeed/力の再現ではない。
画像失敗時はactive資源とRAFを解放してerror、再開から再取得する実装。

確認済み: 原cache hash、PNG生成、JS構文、12file ZIP生成、ブラウザー実表示と画像readyを確認。
既存19項目の実際の結果は私的チェックポイント記録と親報告を参照。Windows browser枠消失とは別のページ表示証拠。
未検証: 新APIの拒否値/独立時計/非選択設定/冷えた読み込み中のStop/失敗復帰/全60frame pixel比較、画像資源の反復収支、
11assetになったoffline cache/更新/解除/再起動、private HTTPS/通常Chrome/実機、TD実再生との色/向き/alpha/最終動き比較。
旧0.1.2のoffline合格を新12file版へ流用しない。今回のZIPはprivate実装candidateで完成・一般配布版ではない。

Aの阻害: 外部ドクロモデルの出典URL/再配布条件、locked形状の頭/顎対応・支点と原作実表示が未確認。
Aの3D頭/下顎/流体/背景文字は未実装。推測した代替モデルは同梱しない。
共有GUI側のファイルは参照だけ。変更はハロウィンrepo内に限定、private維持、外部Webなし。

## 今回の実測と回帰
ブラウザーでB ready=true、60frame、ImageBitmap1、RAF1、中央文字を実表示しページscreenshotを保存。
旧19項目の再試験は「読込済みページでネットワークoffline→B切替→Pause」で中断した。合格数は未確定。
未保存/Service Workerなしの状態でBの新しいPNG fetchが失敗し、画像errorからPauseがdisabledとなりlocatorが30秒timeout。
0.1.2では画像fetchが不要だったため通ったケースで、読込後offline切替の互換をまだ保持できていない。
失敗後はphase=error、created=disposed=307、RAF0、effect/object0、bitmap created=closed=2/open0/pending0。
300切替を実行した後の観測ではnative RAF最大1、listener23を確認。ただし新画像の長期/遅延/全反復の合格とはしない。
次の修正はキャッシュ準備の有無と読込後offlineの契約を整理し、ネット切替で新bitmapを作れるasset取得を実装/検証すること。
このブランチは未完candidateの保存。0.1.2安定ブランチやmainへ統合していない。
