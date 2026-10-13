ハロウィン投影 Web技術試作0.1.14 — 本人確認用・非公開

案内されたページをブラウザーで開きます。利用者の端末コマンド、CMD、PowerShell、
Node、Python、TouchDesignerの実行・追加インストールは不要です。
このZIPは確認環境へ渡す静的Webファイルです。一般公開するURLは作成していません。
ZIP内HTMLのfile://起動は動作保証していません。私用HTTPSまたはlocalhost確認環境用です。

1. 効果・文字・速さ・大きさを調整します。
2. プロジェクターへPCを接続し、複製または拡張表示にします。
3. ブラウザーを投影先へ移動し「投影開始・全画面」を押します。
   パネル非表示とブラウザー枠消失は別です。枠が残る場合はブラウザーの全画面メニューで確認します。
4. Escで操作へ戻ります。終了は「表示を終了」→終了表示を確認→タブを閉じるだけです。
   終了時は描画資源を解放します。ブラウザーや他のアプリを強制終了しません。

接続なしで使う:
- 接続中に「この端末へ保存」を押し「オフライン準備済み」を確認します。
- 同じブラウザー・同じプロファイル・同じURLで再度開きます。履歴/ブックマークを使えます。
- 入力文字や調整は保存せず、開き直すと初期値へ戻ります。
- 初回保存には接続が必要です。ブラウザーの保存削除、別プロファイル/別端末では再準備が必要です。
- 更新は「更新を確認」→準備後「最新版に切り替える」。表示中に自動で切り替わりません。
- 「保存を解除」はこのアプリの同じ保存先だけを解除します。次回は接続が必要です。
- 認証付き私用環境のログイン手続きは別です。秘密URLだけを非公開とは扱いません。
- 保存したアプリ本体は端末に残ります。共有PCでは「保存を解除」してください。ログアウトと保存解除は別です。

技術試作の範囲:
Aは新規2D全身骸骨、Bは本人コウモリの保存60フレームを比較再生します。飛翔は初速・動きの混合を受ける粒子計算候補です。原VJの3D頭・下顎・流体・原作飛翔、
TDの力・最終合成の再現は未完です。入力と制御のAPIを分離しました。図案再生倍率は飛ぶ速さと別に操作できます。原作再現の完成品、実機投影検収済み、撮影済みとは称しません。
全画面APIの成立だけで実画面の枠消失は保証しません。通常Chrome/Edgeと実機で確認が必要です。

ライセンス: 同梱LICENSE.txt（MIT）。外部素材との区分はRIGHTS.txt。

画像素材はprivate本人確認だけの扱いでMIT対象外。外部へ配布/公開しないでください。詳細はassets/OWNER-BAT-ASSET.txt。

コウモリ図案の準備:
- 接続中にページを開くと本人図案を準備し、画面に準備状態を表示します。
- 準備済みの同じページでは、接続がなくなってもBへ切り替えられます。
- ページを開き直す/ブラウザーを再起動する前に「この端末へ保存」で準備してください。
- 未取得・未保存の図案は接続なしで初めて読み込めません。案内が出たら接続し「再開」を押します。
- 「停止」は描画を止め、図案の準備を同じページ内に保持します。「表示を終了」はページ内の図案も解放します。
- 端末のオフライン保存は「保存を解除」で別途削除します。
- 仮飛翔の速さと図案再生倍率を別々に調整できます。

0.1.4比較差分:
保存タイムライン60fpsと、固定Trailの個体別位相寄与を画像再生へ反映しました。
原作はさらにNoiseと移動Trailを加算します。今回は固定寄与だけの比較で、原作の完全な位相一致ではありません。
旧30fps相当は図案再生0.5×で比較できます。飛翔の仮円軌道、色加工/Blur合成、文字maskの相違は残しています。
原作Bの私的基準映像を取得しました。粒子計算・最終合成の一致確認は未完なので、忠実再現の完成版として扱わないでください。

3Dドクロ（CC0別候補）の私的比較:
- 「3Dドクロ」を選ぶと、頭と顎を別々に操作できます。元の2DとBも残しています。
- 頭の回転速度0で頭を停止。顎の速さ0では「顎の開き」を固定角度として使います。
- 顎を色分けして上下歯の動きを確認できます。支点の上下/前後と大きさを調整できます。
- 停止で模型の展開/描画bufferを解放し、表示終了で埋込模型の保持も解除します。
- この模型はCDmirのCC0別モデル、白骨の幾何比較です。元TDの形・texture・流体・背景文字の再現ではありません。
- 3D描画もCanvas2Dを使います。WebGL2・TD・追加ランタイム・CDNは不要です。
- 同じ端末へ保存する手順で3Dも接続なしで使えます。実機での速度・見えは未検収です。

0.1.6 VJ入力比較（保持版の記録）:
- Bの「初速」と「動きの混合（Cross）」をスライダー、キー、共通APIへ接続しました。
- ↑↓は初速（比較範囲0〜2.6）、←→は混合（0〜1）。長押しの反復イベントは無視します。
- 初速は新しく生まれる個体に反映します。既存個体の速度や羽ばたき速度を一括変更しません。
- Spaceで一時停止/再開、Rでリセット。文字入力中は操作キーを適用しません。
- 比較再生の速さは全体時間の倍率、図案再生は羽ばたきの倍率です。初速とは別です。
- Crossの渦・収縮・回転の補間値は元設定を使用します。粒子の誕生位置・雑音・積分器は候補実装です。
- 24個体、寿命5秒、60Hzの計算。元TDの25個体前後・放出・力・色・Blur・文字mask・最終合成は未一致です。
- スマートフォンの画面と通信方法は未実装です。APIだけでは接続できません。

0.1.7 B circle比較:
- atlasは書き換えず、Nativeの全60frame照合に基づいてR/B・上下の読み方を描画時に補正しました。
- 発生5/秒・寿命5秒・中心半径0.06・放射初速、投影幅1.26・矩形0.24・40描画枠へ近づけました。
- 回転は雑音と速度方向−90度の混合です。雑音・発生点・力/積分器は候補のままです。
- WebGL2が使える環境で紫の本体/白い輪郭、同frameの縮小Blur/Level/Overを比較します。使えない環境は旧図案へ戻ります。
- 色と中間合成は原PNGの同じraw入力から数値比較しました。飛翔や最終fire_wrapの一致合格ではありません。
- 原Aの流体/背景文字は次の段階です。実装者の自己試験と独立外観レビューは分けて記録します。

0.1.8 B 信号・光/文字合成比較:
- 原Noise CHOPをXYZ空間の33³格子で採取。範囲±0.8内を補間する比較候補です。範囲外は端に制限し診断へ記録します。
- Lag CHOPは時間方向でなく40描画枠の並びに作用。原応答から復元し、同じ入力の誤差約0.000012度でした。
- 生存数別Random、rolling Trail、locked Trailを画像番号へ反映。同じ原frameの40番号が一致しました。原絶対時計との一致は未確認です。
- 輝度alpha→縮小ぼかし→Brightness/Contrast→Noise積→色相-284/Value0.5→Overを追加しました。
- 文字の黒いDOM矩形を廃止。文字のglyphと背景のMinimum/Levelを投影canvas内で合成する比較候補です。
- 最終Simplex noise、Blur TOP、文字書体/マスク、粒子SOPの誕生・力計算は未一致です。元B全体の再現合格版ではありません。
- 旧0.1.2安定版と0.1.3～0.1.7比較版を保持。公開・素材再配布・他のTDプロセスの終了は行っていません。

0.1.9 B 発生点・位置更新比較:
- seed1で並べ替えた原42発生点と初速の法線を反映しました。新生点はその初速で部分時間だけ進み、誕生frameの全時間に力を足しません。
- 原対照で確認した速度更新v×(1−drag×dt)+力×dt、更新後の速度による位置更新へ修正しました。
- 出生jitterの時計/RNGは未一致です。原seed1の最初の出生はstep6、Webは固定間隔step12のままです。
- 原Force SOP/乱流はまだ近似です。同じ原新生状態を与えた全力場の位置誤差も大きく、原飛翔の合格ではありません。
- 0.1.8以下のZIPを保持。今回の作業はローカルのみで、外部送信/pushは保留しています。

0.1.10 B 出生位相比較:
- 原4対照の240stepと同じ出生数・stepとなるfloat32残余カウンターへ修正しました。最初の出生はstep6です。
- 原のjitterは出生stepを変えず、部分ageだけを変えました。seed1/2でもこの範囲のageは同じでした。
- 部分ageの内部乱数は未移植です。通常描画ではage0候補のままで、完全一致とはしていません。
- 同じ原新生状態の入力分離で、抵抗のみの誤差は約1e-7、乱流のみ約.057、Force SOPのみ約.529でした。主な位置差はForce SOP側に残ります。
- 原Aの確認順はdocs/A-LOCAL-REPRODUCTION-OUTLOOK.md。今回はAの新規実装や外部送信をしていません。

0.1.11 B 原Force場比較:
- 原の中心(0,0,.03)、半径3、weight2、Wyvill kernel、Z軸を反映しました。
- 正規化接線へVortex、平面半径方向へ−(Vortex+Spiral)を掛けます。旧.14/.1の線形係数は外しました。
- 原の固定Vortex/Spiral4対照で、同じ新生状態から120stepの位置差が約1e-7～4e-7へ縮小しました。
- 全力場の同条件差は約.548→.0508。これは同じ原新生状態を与えた計算比較です。通常描画の部分age、原乱流、最終光/文字、原Aは未一致です。
- 任意係数で外観を合わせず、sprite/40枠/size/合成は保持。旧版とローカル送信保留を保持します。


0.1.12 A 頭/顎の配置・支点比較:
- 3Dドクロの「原Aに位置を合わせて比較」で閉姿勢の位置合わせと共通親XYZ回転を比較できます。形状はCC0別候補です。
- 速度0は現在の角度で停止します。固定4姿勢の比較では頭/顎の速度を0にし、一時停止してResetすると時計0の基準向きになります。
- 既存halloweenControl APIからskull3dのrigMode(0=旧比較/1=原A座標比較)、headX/headY/headZ(-180..180度)、jawOpen(0..45度)を設定できます。
- headYは回転時計へ加える基準角。headRateとjawRateは独立し、共通親が回ると閉じた顎も一緒に回ります。
- 閉姿勢の全高とbbox中心を原へ合わせ、候補の顎支点は同じ座標変換で別に写しました。原と候補の形状/開口/照明の一致を意味しません。
- 原Aの運動noise、6組、流体/背景文字、B乱流/部分age/最終外観は未完。原モデル/原shaderは配布へ含めません。旧版ZIPを保持します。


0.1.13 原顎支点の対照:
- 「原Aの登録座標支点（0,0,0）」で原支点を選べます。候補座標の上下範囲も-1.15..+.2へ拡張しました。
- 同CC0の顎30下端は仮支点538/原支点525、原素材は529。素材と支点の影響を分けて比較できます。

0.1.14 原A流体coreの一段階:
- 「原A流体の計算出力を比較」は実solverの赤い色格子を可視化する検査モードです。最終Aの色・光・背景文字は未実装です。
- 速度場は原評価値の時刻0固定。色640x360/速度100x57、curl/vorticity/pressure1pass/投影/移流/減衰を実装しました。
- 各描画で1/60秒1step、30Hz上限。原60Hzの実時間・動的noise・移流補間は未一致です。
- Pause/Reset/Stop/Resume/Endで検査できます。Stopで所有格子buffer、Endで固定fieldのencoded参照も破棄します。
- 原の数値field参照はMIT外・private比較限定です。原shader/原modelを追加していません。旧ZIPを保持します。


0.1.15 source A comparison:
- Startup/Reset models two cold cooks in the measured source fluid graph. GPU interpolation weights conserve constants, including ties.
- Optional blue body-color branch: gain .96, RGBA8, HSV hue224. Edge glow, alpha, lighting, background text and final composite remain incomplete.
- Local GUI benchmark: 22.70 solver steps/s and 22.70 mesh draws/s, measured separately. The default GUI velocity field is still frozen at tz0; dynamic noise is not generated.
- Earlier stable and comparison packages are preserved. Native reference fields remain MIT-excluded and private.


0.1.16 integrated source A comparison:
- In 3D Skull, enable the integrated comparison checkbox to show skull, fluid and background text in source order. It selects the registered CC0 alternate and original jaw pivot. Text uses the upstream Arial settings.
- Source light (0,0,10), diffuse .4, emission .5, specular .3, shininess157 are applied with candidate face-normal/view-alpha shading. This is one alternate actor, not the original model or six-actor scene.
- Source head preprocessing, Sobel/HSV172/224, head overlay, threshold/outside, background text minimum/Level5/gamma2.02, Cross .824, radial foreground and final Level1.03/gamma1.1 are connected. Blur, edge, alpha and lighting differences remain.
- Velocity is still the approved frozen source field at tz0. Dynamic noise is not generated; source decoration noise is unconnected and no new native noise payload is included in this package.
- Pause, Reset, toggles, Stop, Resume and End release owned resources. Final scene is a private comparison; it is not a faithful reproduction pass.


0.1.17 source A display fixes:
- Level applies brightness, then gamma, then contrast. Edge derives white RGB and alpha from luminance. Head glow output follows the source sixteenth resolution. Gaussian Blur and derivative normalization remain comparison candidates.
- GUI passes measured active elapsed seconds to advection/vorticity instead of one fixed 1/60 step per draw. Default direct step() is still 1/60 for existing fixed-step comparisons. Injection/diffusion remain per cook; frozen velocity is unchanged.
- Arial background masks shrink to fit all eight lines within 82% width and 48% height. Native fixed-size typography remains a separate fidelity limitation. Text stays literal and is not stored.
- One alternate actor, no dynamic decoration noise. Earlier packages and original sources are preserved.


0.1.18 six-scene / fixed-step comparison:
- Optional six-scene checkbox: six shared CC0 head/jaw pairs and three foreground mask/radial branches. One-actor comparison remains default. The periodic motion is our candidate; original motionMat/fader is not matched. setActors accepts six finite position/rotation/jaw inputs without saving them.
- Runtime uses float WebGL2 fluid with fixed 1/60-second ticks, maximum eight ticks per draw and .25-second input cap. Excess elapsed is explicitly discarded/reported. CPU fallback is limited to two ticks. Pause/visibility suspension excludes inactive elapsed; Reset clears clock and retains two cold release cooks. Direct CPU step() remains a comparison API.
- Identical fixed inputs produce identical one-second scalar states at 60/30/10 draws. Moving geometry input is still sampled per draw. Dynamic velocity/decorative noise is not generated; no new sampled noise payload was added.
- Background text can be hidden by skulls or dark flow after source-order composition. The eight-line glyph fit does not guarantee all final letters are readable.
