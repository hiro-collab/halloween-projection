# 原VJとWebの技法境界

修正の切り分け用。既存アプリ内の対応であり、教材や別アプリを作らない。
原B全体は独立レビューで未合格。未確認の原処理を確定事項として扱わない。

| 技法 | 原ノード / 入力→計算→出力 | Web / 操作API | 時計・Reset・資源・後段 |
|---|---|---|---|
| 3Dリギング | locked filein1/filein2、Jaw/geo1独立接続は静的確認。元モデル対応・支点・親子変換全体は未確認 | app.js makeSkull3D。CC0別候補のhead/jaw→独立支点回転→3D投影。headRate/jawRate/jawOpen/pivotY/pivotZ/size | CPU描画上限30Hz、head/jaw時計、Reset初期化、Stopでbuffer/Endでencoded解放。原A後段は未接続 |
| 原A流体 | vector fieldに沿う移流/発散/圧力/着色は技法上の仮説。元ノード・格子・境界・Feedbackは未確認 | 原A field solver未実装。BのSparse回転場を流体と扱わない | A背景文字/流体/光の前後関係・時計・Resetは元資料確認後に実装 |
| B点群粒子 | sphere半径.06/中心z.03→法線×Initialspeed→particleSOP Birth5/Life5/drag5/turbulence→force1 Vortex/Spiral→XYZ/速度→ppGain | app.js makeBats。3D粒子→40枠repeat-last。Initialspeedは誕生のみ。Cross→Vortex=5−4m、Spiral=−1.7+.8m。発生/力/積分は近似 | 固定60Hz accumulator、Pause停止、Resetで誕生/時計消去、Stopで点群解放。原独立timeは60Hz/Hold。10秒現象未解明 |
| B回転信号 | XYZ→Sparse seed1/period1/amp360、速度atan2−90→Lag→Cross(.77×(1−m))→geo Rz | bat-motion.js空間格子補間＋枠方向Lag、app.js instancePosesで最終Rz。範囲±.8、外はclamp診断 | 現在XYZ/速度から生成。時間ノイズではない。Stopで71874-byte格子/Endでencoded解放 |
| B point sprite | 40 XYZ/Rz/index→rectangle .24、orthowidth1.26、tex3d保存60frame→Render RGBA | bat-art.js drawInstancesはpose配列→Bitmap投影/回転/V反転。原atlasは別権利 | motion/位相/後段を含めない。Bitmap1個、Stop close/End PNG bytes破棄 |
| B図案番号 | 生存数NのRandom(N+1)＋rolling Trail＋locked Trail×2→int modulo60 | bat-motion.js instanceIndices。frameLock/flapRateは比較操作。同じ原frameの40番号で不一致0 | Web相対60FPS図案時計。原absTime/1frame遅延との全経路一致は未確認 |
| B光・文字 | circle Edge/Level/HSV/Over→deco_fire Luma/quarter Blur/Level/Noise/HSV/Over→texter背景BlurとglyphのMinimum/Level/Over | bat-art.js circle、bat-fire.js最終光/文字、app.js glyphCanvas→stage。元Simplex/Blur/文字マスクは候補 | 同frame合成。Feedback時間残像ではない。Pause静止、Stopで全GL resource解放。原画像・入力文字を保存しない |

公共操作境界: HalloweenControlAPI/VJは値検証・scene/pause/resume/reset。
スマートフォン画面/通信は未実装。入力APIを端末接続の完成と扱わない。
同じ原pose比較で発生/力・回転・図案位相・投影・光/文字の誤差を分ける。
測定/未一致は[B-SIGNALS-FIRE-VALIDATION.md](B-SIGNALS-FIRE-VALIDATION.md)。公開/権限拡大なし。
