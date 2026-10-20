/* MIT. UI language only; no storage/network or user-text changes. */
'use strict';
(() => {
  const dictionary = {
    '改変・サポートと投影時のお願い':
      'Modifications, support and projection precautions',
    'ご自身での改変も歓迎です。個別の改修依頼や操作サポートには対応していません。動作は保証していないため、使用する機材で事前にお試しください。投影場所の許可を取り、光を人の目や車両に向けず、点滅や明るい映像が苦手な方にもご配慮ください。':
      "You are welcome to make your own modifications. I do not take on individual modification requests or provide help with operating the app. Operation is not guaranteed, so please test it with the equipment you plan to use. Obtain permission for the projection location, keep the light away from people's eyes and vehicles, and consider people who are sensitive to flashing or bright imagery.",
    'HALLOWEEN / 操作席': 'HALLOWEEN / CONSOLE',
    '3段のキーで、狙った値へ': 'Three key rows. Choose your target.',
    '上段は動き、中段は色、下段は文字サイズ。1回押して目標位置を選びます。':
      'Top row: motion. Middle: color. Bottom: text size. Press once to choose a target.',
    'はじめに': 'Start here',
    'キー配置・困ったとき': 'Keys & help',
    '1　投影窓を準備': '1  Prepare the projection',
    '投影窓を開く': 'Open projection window',
    '既存の投影窓へ再接続': 'Reconnect to projection',
    '未接続。上のボタンから始めます。': 'Not connected. Use the button above.',
    '投影窓を準備済みの投影先へ移し、その窓の「全画面で始める」を押します。確認だけならウィンドウで始められます。':
      'Move the projection window to your prepared display and choose Start fullscreen. Use Start windowed for a quick check.',
    '2　映像と向きを決める': '2  Choose scene and orientation',
    '映像を切り替える（Z）': 'Change scene (Z)',
    '投影向きを切り替える（X）': 'Flip output (X)',
    '動き方を変える（C）': 'Change motion mode (C)',
    '現在の映像：ドクロ': 'Scene: Skulls',
    '投影向き：通常': 'Orientation: Normal',
    '動き方：顎を動かす': 'Mode: Automatic jaw',
    '文字とエフェクトを含む投影全体だけを反転します。操作画面は正位置。映像切替・Resetでも向きを保持します。':
      'Flips the complete projected image, including text and effects. The console stays upright. Orientation is kept across scene changes and Reset.',
    'ドクロの数（9 減 / 0 増）': 'Skull count (9 fewer / 0 more)',
    '1体': '1 skull',
    '2体': '2 skulls',
    '3体': '3 skulls',
    '4体': '4 skulls',
    '5体': '5 skulls',
    '6体': '6 skulls',
    'ドクロの動き方': 'Skull layout',
    '中央の周囲を回遊': 'Orbit the center',
    '上下に整列': 'Top and bottom rows',
    'ドクロの口パク（L / M）': 'Manual jaw (L / M)',
    '開き幅を変える（L）': 'Change jaw width (L)',
    '開閉を切り替える（M）': 'Open / close jaw (M)',
    'Lは小15°・中30°・大60°・最大90°を巡回。Mは選んだ幅で開閉します。閉じても幅は保持します。L/Mで手動、Cで自動へ戻ります。キーは押し直すたびに1回動作します。':
      'L cycles Small 15°, Medium 30°, Large 60°, and Maximum 90°. M opens or closes at the chosen width; closing keeps the width. L/M enter manual mode. C returns to automatic. Release and press again for each action.',
    '3　演奏開始': '3  Enable performance keys',
    '演奏開始': 'Enable keys',
    'キー演奏を解除（Esc）': 'Disable keys (Esc)',
    '一時停止・再開（Space）': 'Pause / resume (Space)',
    '演奏停止': 'Keys off',
    '半角英数・Shiftなし。上の3段を左から右の目標位置として使います。':
      'Use Latin keys without Shift. Read the three target rows from left to right.',
    '体数−': 'Fewer',
    '体数＋': 'More',
    '開き幅': 'Width',
    '映像切替': 'Scene',
    '投影向き': 'Orientation',
    '動き方': 'Mode',
    '一時アクセント': 'Accent',
    '基準・長押し': 'Baseline: hold',
    'Reset・長押し': 'Reset: hold',
    '開閉': 'Open/close',
    '一時停止・再開': 'Pause / resume',
    'キー演奏を解除': 'Disable keys',
    '目標位置は8段階です。映像に渡す実値は約0.15秒で滑らかに移り、移行中の再指定も現在値からつながります。正確な中間値はスライダーで指定できます。色見本は目標色相の目安です。ドクロの0％は定位置へ戻って頭部が静止します。コウモリの0％は中央付近でたむろし、羽ばたきは続きます。背景も続くため、映像全体の一時停止はSpaceです。':
      'Each row has eight targets. Values move smoothly over about 0.15 seconds, including when retargeted. Use sliders for intermediate values. Swatches indicate the target hue. At 0%, skull heads return to rest; bats gather near the center and keep flapping. The background continues. Space pauses the whole image.',
    '動きの激しさ': 'Motion intensity',
    '現在': 'Current',
    '目標': 'Target',
    '細かく調整するスライダー': 'Fine adjustment',
    '色相': 'Hue',
    '文字サイズ': 'Text size',
    '「演奏開始」を押し、操作窓にフォーカスがある間だけ有効。半角英数・Shiftなしで使います。入力欄・選択欄・IME・修飾キー・別窓への移動でキー演奏を解除し、戻っても自動再開しません。数字や文字を入力中に演奏キーを奪いません。':
      'Choose Enable keys and keep the console focused. Use Latin keys without Shift. Inputs, selects, IME, modifier keys, and switching windows disable performance keys. Return and enable them again. Typing in a field remains normal.',
    'Vの演出は最大3秒です。押し続けても演奏は解除されません。一度離すと次のアクセントを使えます。V以外の連続押下は最大8秒です。':
      'V accents last at most 3 seconds. Holding V keeps keys enabled; release it before another accent. Other continuous key holds are limited to 8 seconds.',
    '4　文字と準備基準': '4  Text and baseline',
    'この映像の文字（最大240字・8行）':
      'Scene text (up to 240 characters / 8 lines)',
    '表示範囲の幅': 'Text area width',
    '表示範囲の高さ': 'Text area height',
    '文字を大きくすると画面外へ広がる場合があります。幅・高さは表示範囲の切り抜きです。投影の見えで調整します。':
      'Large text can extend beyond the image. Width and height crop the visible text area. Adjust while watching the projection.',
    '1行ずつ送る': 'Show one line at a time',
    '前の行': 'Previous line',
    '次の行': 'Next line',
    '先頭へ戻す': 'First line',
    '今の見えを基準にする': 'Save current baseline',
    '基準へ戻す（B・0.6秒長押し）': 'Restore baseline (hold B 0.6s)',
    '映像をReset（N・0.6秒長押し）': 'Reset image (hold N 0.6s)',
    '基準復帰とResetは、誤操作を避けるため0.6秒長押しです。':
      'Hold baseline restore or Reset for 0.6 seconds to confirm.',
    '文字・向きは基準復帰やResetで保持。投影窓を閉じると文字・設定・基準は初期化します。':
      'Baseline restore and Reset keep text and orientation. Closing the projection clears text, settings, and baseline.',
    '投影の補正・中断・終了': 'Output, stop & exit',
    '投影向き（X・上のボタンと共通）':
      'Output orientation (same as X / button above)',
    '通常': 'Normal',
    '左右反転': 'Flip horizontal',
    '上下反転': 'Flip vertical',
    '上下左右反転': 'Flip both',
    '円マスクを開く': 'Open circular mask',
    '停止・解放': 'Stop & release',
    '再開': 'Resume',
    '投影を終了': 'End projection',
    'キーを解除しても映像は続きます。終了は「投影を終了」を選びます。':
      'Disabling keys leaves the video running. Choose End projection to finish.',
    '文字で読むキー一覧': 'Key reference',
    '3段の8位置と共通操作': 'Three rows of eight targets and shared keys',
    '位置・キー': 'Position / key',
    '操作': 'Action',
    '押し方': 'Press',
    '動きの激しさを8位置から指定': 'Choose one of eight motion targets',
    '1押下で目標へ': 'One press selects a target',
    '色相を8位置から指定': 'Choose one of eight hue targets',
    '文字サイズを8位置から指定': 'Choose one of eight text sizes',
    'ドクロ数を減らす / 増やす（1〜6体）': 'Fewer / more skulls (1–6)',
    '1押下ずつ': 'One per press',
    'ドクロ / コウモリを交互に切替': 'Toggle skulls / bats',
    '単発': 'Press once',
    '通常→左右→上下→上下左右→通常':
      'Normal → horizontal → vertical → both → normal',
    '動き方を3状態で切替': 'Cycle three motion modes',
    '押している間・最大3秒': 'While held, up to 3 seconds',
    '準備した基準へ戻す': 'Restore saved baseline',
    '0.6秒長押し': 'Hold 0.6 seconds',
    '映像計算をReset（文字・設定は保持）':
      'Reset simulation (keep text and settings)',
    '顎の開き幅4段階 / 開閉切替（Aのみ）':
      'Four jaw widths / open-close (A only)',
    '押し直すたび1回': 'Release and press again',
    'キー演奏を解除（映像は続く）': 'Disable keys (video continues)',
    'いつでも': 'Any time',
    '3段キーの使い方 / Halloween 0.1.60-bone-whiteness':
      'Three-row key guide / Halloween 0.1.60-bone-whiteness',
    '3段の8位置で、狙った値へ': 'Three rows, eight targets each',
    '操作窓を開く': 'Open console',
    'キーボードの位置': 'Keyboard positions',
    '目標位置と実際の値': 'Targets and current values',
    '上の3段を左から右の8位置として使います。動きは1〜8、色はQ〜I、文字サイズはA〜K。キーを1回押すと目標を選び、実際の値は約0.15秒で線形に移ります。移行中の再指定も現在値から新目標へつながります。連打・長押しで値を探す必要はありません。':
      'Read the top three rows as eight targets from left to right: 1–8 motion, Q–I color, A–K text size. One press chooses a target; the value moves linearly over about 0.15 seconds. Retargeting starts from the current value. Repeated presses or holds are unnecessary.',
    '目標は8段階であり、目標指定そのものが無段階ではありません。細かい中間値は各スライダーで指定します。画面に現在値と目標・選んだ位置・移行中/到達を表示。色相は0〜315度の8位置を用意し、境界をまたぐときは短い方向へ移ります。色見本は目安です。':
      'Keys select eight discrete targets. Sliders select intermediate values. The console shows current value, target, selected slot, and moving/settled status. Hue targets run from 0° to 315° and take the shortest route across the boundary. Swatches are a guide.',
    'ドクロの0％は定位置へ戻って頭部が静止します。コウモリの0％は中央付近でたむろし、羽ばたきは続きます。背景も続くため、映像全体の一時停止はSpaceです。文字はA/B共通の大きさで、Pause中も調整できます。':
      'At 0%, skull heads return to rest. Bats gather near the center and keep flapping. The background continues, so Space pauses the whole image. Text size is shared by A and B and can be adjusted while paused.',
    '映像と向き': 'Scene and orientation',
    'Zまたは「映像を切り替える」でドクロ↔コウモリ。Xまたは「投影向きを切り替える」で、通常→左右反転→上下反転→上下左右反転→通常。文字とエフェクトを含む最終映像だけを反転し、操作画面は正位置です。映像切替でも向きを保持。台形補正と90度回転は追加していません。Cはドクロの顎、コウモリの渦と向きの3配分を切り替えます。コウモリはどの配分で0％なら中央付近でたむろします。Vは一時アクセントです。':
      'Z / Change scene toggles skulls and bats. X / Flip output cycles normal, horizontal, vertical, both, then normal. The final image including text and effects flips; the console stays upright. Scene changes keep orientation. Keystone and 90° rotation are not provided. C cycles three jaw modes or bat vortex/orientation mixes. At 0% bats gather near the center in all modes. V adds a brief accent.',
    'ドクロは初期3体、9/0または数の選択欄で1〜6体。出現の弾みは6％・約0.2秒です。':
      'Starts with 3 skulls. Use 9/0 or the count selector for 1–6. The arrival pulse is 6% over about 0.2 seconds.',
    '基準とReset': 'Baseline and Reset',
    '「今の見えを基準にする」で一時記録。Bを0.6秒長押しか画面の同じ長押しボタンで復帰します。Nを0.6秒長押しで映像の計算をReset。文字と向きは保持します。短い押下では実行しません。投影窓を閉じると文字・設定・基準は初期化されます。':
      'Save current baseline stores a temporary snapshot. Hold B or its screen button for 0.6 seconds to restore it. Hold N for 0.6 seconds to reset the simulation. Text and orientation are kept. Short presses do nothing. Closing the projection clears text, settings, and baseline.',
    '困ったとき': 'Troubleshooting',
    'キーが反応しない': 'Keys do not respond',
    '入力を確定して操作窓の「演奏開始」。半角英数・Shiftなしで使います。IMEや別窓への移動後も再度演奏開始が必要です。Vの演出は最大3秒です。押し続けても演奏は解除されません。一度離すと次のアクセントを使えます。V以外の連続押下は最大8秒です。':
      'Finish typing and choose Enable keys in the console. Use Latin keys without Shift. Enable again after IME or changing windows. V lasts up to 3 seconds; release before another accent. Other continuous holds are limited to 8 seconds.',
    '別窓が出ない / 接続が切れた': 'No popup / disconnected',
    'Chromeのポップアップ通知を確認。操作窓の再読込み後は「既存の投影窓へ再接続」。投影窓を閉じた場合は新しく準備します。':
      'Check Chrome popup notices. After reloading the console, choose Reconnect to projection. If the projection was closed, open a fresh one.',
    '文字が見えない / 黒い': 'Missing text / black image',
    '開始、Pause/停止、文字内容・サイズ・表示範囲を確認。詳細欄の「円マスクを開く」をONにします。':
      'Check startup, Pause/stop, text, text size and area. In output details, turn on Open circular mask.',
    '全画面': 'Fullscreen',
    '投影窓で「全画面で始める」をクリック。抜けるにはその窓でEscです。Xは向きで、全画面キーではありません。':
      'Click Start fullscreen in the projection window. Esc there exits fullscreen. X changes orientation.',
    '終了': 'Exit',
    '詳細欄「投影を終了」。機器の電源・画面配置は機器とOSの手順で操作します。':
      'Choose End projection in output details. Use your equipment and OS instructions for power and display arrangement.',
    '素材と権利': 'Assets & rights',
    'コードのライセンス': 'Code license',
    '現在の映像：': 'Scene: ',
    'ドクロ': 'Skulls',
    'コウモリ': 'Bats',
    '投影向き：': 'Orientation: ',
    '動き方：': 'Mode: ',
    '顎を動かす': 'Automatic jaw',
    '顎を閉じる': 'Jaw closed',
    '顎を開く': 'Jaw open',
    '配分1：渦寄り': 'Mix 1: stronger vortex',
    '配分2：中間': 'Mix 2: balanced',
    '配分3：ゆるい旋回': 'Mix 3: gentle turning',
    '手動：開': 'Manual: open',
    '手動：閉': 'Manual: closed',
    '自動': 'Automatic',
    '従来：閉': 'Legacy: closed',
    '従来：全開': 'Legacy: fully open',
    ' / 開き幅：': ' / Width: ',
    '投影終了。新しく開くと初期化します。':
      'Projection ended. Opening a new one resets it.',
    '切断。再接続してください。': 'Disconnected. Please reconnect.',
    '投影窓を表示してから演奏開始。':
      'Show the projection window, then enable keys.',
    '接続済み。投影窓の開始を押してください。':
      'Connected. Press Start in the projection window.',
    '接続済み · ': 'Connected · ',
    'ウィンドウ': 'Windowed',
    '（位置': ' (slot ',
    '（自由位置）': ' (custom)',
    '移行中': 'Moving',
    '到達': 'Settled',
    '8位置の目標指定 / 約0.15秒の線形移行 / 色相は短い向きで移動':
      '8 targets / ~0.15s linear transition / shortest hue route',
    '通信が切れました': 'Connection lost',
    '投影窓に接続してください': 'Connect to the projection window',
    '反映の返答がありません': 'No response to the change',
    '投影終了': 'Projection ended',
    '投影の応答を確認できないため停止': 'Keys off: no projection response',
    '投影窓がありません': 'No projection window',
    '接続できません。「投影窓を開く」で開始するか、再接続を試してください。':
      'Could not connect. Open a projection window or try Reconnect.',
    '押しているキー：': 'Held keys: ',
    '投影準備': 'Preparing projection',
    '別窓を開けませんでした。ブラウザーのポップアップ表示を確認してください。':
      'Could not open the window. Check browser popup notices.',
    '再接続': 'Reconnect',
    '投影窓を取得できません': 'Could not find the projection window',
    '操作窓へ戻って演奏開始を押してください':
      'Return to the console and choose Enable keys',
    '演奏停止。映像は続きます': 'Keys off. Video continues',
    '投影を終了しました。': 'Projection ended.',
    '画面の長押し操作': 'Holding a screen control',
    '映像計算をResetしました。': 'Simulation reset.',
    '準備した基準へ移行します。': 'Restoring the saved baseline.',
    '0.6秒間、押したままにしてください。': 'Keep holding for 0.6 seconds.',
    '長押しを中止しました。': 'Hold cancelled.',
    '投影窓を閉じました。開き直すと動きは再初期化します。':
      'Projection window closed. Reopening resets motion.',
    '通信を確認できません。演奏停止。再接続を押してください。':
      'No connection response. Keys off. Choose Reconnect.',
    '操作窓を終了': 'Console closed',
    '操作窓のフォーカスを確認できないため停止':
      'Keys off: console focus unavailable',
    '入力確認が中断したため停止': 'Keys off: input check interrupted',
    '連続押下は最大8秒です。離して演奏開始を押してください':
      'Hold limit: 8 seconds. Release, then enable keys again',
    '演奏中（V上限：離すと次のアクセント）':
      'Keys enabled (V limit: release for next accent)',
    '投影接続と入力欄を確認してください':
      'Check the projection connection and input focus',
    '演奏中': 'Keys enabled',
    'Escで演奏停止': 'Keys off: Esc',
    '修飾キー/IMEで演奏停止': 'Keys off: modifier / IME',
    'フォーカスを失ったため停止。演奏開始で戻ります':
      'Keys off: focus lost. Enable keys to return',
    '操作窓が隠れたため停止': 'Keys off: console hidden',
    '入力中。演奏開始で戻ります': 'Typing. Enable keys to return',
    '日本語入力中のため停止': 'Keys off: IME input',
    '演奏開始を押してください': 'Choose Enable keys',
    '描画応答を確認できません': 'No rendering response',
    '描画の長い中断。演奏開始で戻ります':
      'Rendering interrupted. Enable keys to return',
    '操作窓の応答が途切れました。演奏開始で戻ります':
      'Console response lost. Enable keys to return',
    '接続が切れました': 'Disconnected',
    '押下の整合性を確認できません': 'Key hold could not be verified',
    '再接続してください': 'Please reconnect',
    '投影の表示と応答を確認してください':
      'Check projection visibility and response',
    '演奏停止中': 'Keys disabled',
    '操作窓の設定範囲外': 'Setting unavailable from console',
    '操作窓の命令範囲外': 'Command unavailable from console',
    '投影向きは4状態です': 'Orientation has four modes',
    '無効な設定': 'Invalid setting',
    '命令がありません': 'Missing command',
    '接続しました。演奏開始を押してください': 'Connected. Choose Enable keys',
    '全画面にできませんでした。ウィンドウで始めることもできます。':
      'Fullscreen was unavailable. You can start windowed instead.',
    '投影窓を終了': 'Projection window closed',
    '窓が非表示': 'Window hidden',
    '窓が最小化または小さすぎます': 'Window minimized or too small',
    '小': 'Small',
    '中': 'Medium',
    '大': 'Large',
    '最大': 'Maximum',
    'B (0.6秒)': 'B (0.6s)',
    'N (0.6秒)': 'N (0.6s)',
    'ドクロの動きの激しさ': 'Skull motion intensity',
    'コウモリの力・初速・羽ばたき': 'Bat force, initial speed & flap',
    '背景の色相': 'Background hue',
    'コウモリの色相': 'Bat hue',
    '頭・顎の動き': 'Head & jaw motion',
    '飛行の力＋初速＋羽ばたき': 'Flight force + initial speed + flap',
    '顎の動き方3状態': 'Three jaw modes',
    '渦と向きの3配分': 'Three vortex / orientation mixes',
    '前景の光': 'Foreground glow',
    '新個体の速さ＋回り方': 'New bat speed + turning',
    'ハロウィン映像を、すぐに始める': 'Start your Halloween projection',
    '日本語 / English。追加ソフトやコマンド入力は不要です。':
      'Japanese / English. No extra software or commands are needed.',
    '映像をはじめる': 'Start the projection',
    'ZIPをすべて展開': 'Extract the whole ZIP',
    'ZIPを右クリックして「すべて展開」。展開したフォルダーの入口HTMLをChromeで開きます。フォルダー全体を一緒に保持してください。':
      'Right-click the ZIP and choose Extract All. Open the entry HTML in Chrome. Keep the extracted folder together.',
    '投影画面を開く': 'Open the projection window',
    '上のボタンから操作画面へ進み、「投影窓を開く」。投影画面で「ウィンドウで始める」または「全画面で始める」を押します。':
      'Use the button above, then Open projection window. In that window, choose Start windowed or Start fullscreen.',
    '操作画面へ戻って演奏開始': 'Return to the console and enable keys',
    '文字を準備し、「演奏開始」。1〜8は動き、Q〜Iは色、A〜Kは文字サイズ。Lで口の開き幅、Mで開閉、Zで映像、Xで向きを変えます。':
      'Prepare your text and choose Enable keys. 1–8 control motion, Q–I color, A–K text size. L selects jaw width, M opens/closes, Z changes scene, and X flips the output.',
    'キーは操作画面にフォーカスがある間だけ有効です。別窓や入力欄へ移動した後は「演奏開始」。接続が切れた表示なら「再接続」から戻します。':
      'Keys work while the console has focus. After using another window or an input, choose Enable keys again. If disconnected, use Reconnect.',
    '一時停止はSpace。終了は操作画面の「投影の補正・中断・終了」から「投影を終了」。閉じた後の文字・設定は初期値になります。':
      'Space pauses the video. To finish, open Output, stop & exit and choose End projection. Closing the projection resets text and settings.',
    'Windows・Chrome確認版': 'Windows / Chrome preview',
    '顎を手動で口パク': 'Make the jaw talk',
    '手動の顎（Cで自動へ）': 'Manual jaw (C for automatic)',
    '投影窓の準備': 'Prepare projection window',
    'この窓を投影先へ移し、開始を押してください。開始後は操作UIを表示しません。':
      'Move this window to the projection display and press Start. Controls disappear after startup.',
    '全画面で始める': 'Start fullscreen',
    'ウィンドウで始める': 'Start windowed',
    'キーボード演奏エリア': 'Performance key area',
    'キーボードの3段に8位置。1から8が動き、QからIが色、AからKが文字サイズ。':
      'Three rows of eight targets: 1–8 motion, Q–I hue, A–K text size.',
    '動きの激しさの8目標位置': 'Eight motion targets',
    '色相の8目標位置': 'Eight hue targets',
    '文字サイズの8目標位置': 'Eight text size targets',
    '現在の値': 'Current value'
  };
  Object.assign(dictionary, {
    '使える操作': 'Available controls',
    '現在使える操作': 'Available controls',
    'キー一覧・困ったとき': 'Keys & help',
    'キー一覧': 'Key reference',
    '二窓の操作席、キーボード、文字とサイズ、映像切替、ドクロ1〜6体、一時停止とResetが使えます。操作は':
      'Use the separate console and projection, performance keys, text, scene changes, 1–6 skulls, Pause and Reset. See the ',
    'を確認してください。': ' for instructions.',
    'ゲームパッド・スマホ・OS全体の入力捕捉・自動画面配置は実装していません。':
      'Gamepads, phone control, global OS key capture and automatic display arrangement are not implemented.'
  });
  const sourceTitle = document.title;
  // Release wording: UI text only; translation behavior and projected user text stay unchanged.
  Object.assign(dictionary, {
    '3段のキーで、映像を操作': 'Control the visuals with three keyboard rows',
    'キー操作一覧': 'Keyboard controls',
    '動きの激しさを8段階から選ぶ': 'Choose one of eight motion levels',
    '色相を8段階から選ぶ': 'Choose one of eight hues',
    '文字サイズを8段階から選ぶ': 'Choose one of eight text sizes',
    '1回押して選択': 'Press once to choose',
    'キーボード操作を止める（映像は続く）':
      'Stop keyboard controls (visuals continue)',
    '映像の動きをリセット（文字・設定は保持）':
      'Reset motion (keep text and settings)',
    '保存した設定とリセット': 'Saved appearance and reset',
    'Windows・Chrome向け。プロジェクターの接続と画面配置は、Windowsで設定してください。':
      'For Windows and Chrome. Set up the projector connection and display arrangement in Windows.',
    'Windows・Chrome向け / 0.1.60': 'For Windows and Chrome / 0.1.60',
    '羽ばたくコウモリ': 'Animated bats',
    'CDmir / Human Skull（CC0）': 'CDmir / Human Skull (CC0)',
    '動きを止める・映像を消す': 'Pause or blank the image',
    '動きだけ止めるときはSpace。映像を黒くして中断するときは「投影の補正・中断・終了」→「停止・解放」。戻すときは「再開」→必要なら「演奏開始」です。Escはキー操作だけを止め、映像は続きます。プロジェクターの光を止める操作は機器側で行ってください。':
      'Space pauses motion. To blank the image, open “Output, stop & exit” and choose “Stop & release”. Choose “Resume” and, if needed, “Enable keys” to return. Esc stops keyboard controls while the visuals continue. Use the projector’s own controls to stop its light output.'
  });
  Object.assign(dictionary, {
    'ドクロのキー配置': 'Skull key layout',
    'コウモリのキー配置': 'Bat key layout',
    '9 / 0は体数、L / Mは顎。Cは顎の自動モード、Vは前景の光です。':
      '9 / 0 change skull count; L / M control the jaw. C selects the automatic jaw mode; V adds foreground light.',
    '9 / 0、L / Mはこの映像では未使用です。Cは旋回の配分、Vは新しい個体の速さと回り方です。':
      '9 / 0 and L / M are unused in this scene. C changes the turning mix; V changes new bats’ speed and turning.',
    '動き0%で頭部は定位置に戻って静止します。背景は続くため、映像全体の一時停止はSpaceです。':
      'At 0% motion, the skulls return to their resting positions. The background continues. Space pauses the whole scene.',
    '動き0%で中央付近にたむろし、羽ばたきは続きます。映像全体の一時停止はSpaceです。':
      'At 0% motion, bats gather near the centre and keep flapping. Space pauses the whole scene.',
    '背景の色合いを回します。Qは水色、Wは青です。見本は流体の明るい縁の色の目安です。背景には濃い青なども混ざり、骨Glowも連動します。':
      'Rotate the background colours. Q is cyan and W is blue. Swatches represent the bright fluid edges. The background also contains darker blue tones, and bone glow changes too.',
    'コウモリ本体の色を選びます。元の青は240°、反対側の黄は60°です。白い輪郭や光はそのままなので、見本は本体色の目安です。':
      'Choose the bat body colour. The original blue is 240°; its opposite yellow is 60°. White outlines and light keep their colours. Swatches represent the body tint.',
    '目標位置は8段階です。約0.15秒で滑らかに移り、移行中の再指定も現在値からつながります。細かい値はスライダーで選べます。':
      'Choose one of eight targets. Values move smoothly over about 0.15 seconds, including when you choose another target mid-transition. Use sliders for finer values.',
    '顎を動かす / 閉じる / 開く。手動の顎からは自動へ戻る。':
      'Move / close / open the jaw. Return from manual jaw control to automatic motion.',
    '渦寄り / 中間 / ゆるい旋回の3配分を切り替える。':
      'Cycle through vortex / mixed / gentle turning.',
    '体数を減らす': 'Fewer skulls',
    '体数を増やす': 'More skulls',
    '未使用': 'Unused',
    'コウモリでは使いません': 'Unused for bats',
    '顎モード': 'Jaw mode',
    '旋回の配分': 'Turning mix',
    '速さ・旋回': 'Speed / turning',
    '変換前の色': 'Input colours',
    '反対側の色': 'Opposite colours',
    '標準の色合い': 'Default appearance',
    '元の青': 'Original blue',
    '反対側の黄': 'Opposite yellow',
    '赤': 'Red',
    '橙': 'Orange',
    '黄': 'Yellow',
    '黄緑': 'Yellow-green',
    '緑': 'Green',
    '青緑': 'Teal',
    '水色': 'Cyan',
    '青': 'Blue',
    '青紫': 'Blue-violet',
    '紫': 'Violet',
    '桃': 'Pink',
    '赤紫': 'Magenta',
    '色合い': 'Colour',
    'キー入力：有効': 'Keys: enabled',
    'キー入力：無効': 'Keys: disabled',
    'キー入力だけ解除（Esc）': 'Disable keys only (Esc)',
    '映像を消して中断': 'Blank visuals',
    '映像を再表示': 'Show visuals again',
    '投影窓を閉じる': 'Close projection window',
    'この表示を終了': 'End this display',
    '動きを再開': 'Resume motion',
    '動きを一時停止': 'Pause motion',
    '中断中（描画・GPU資源は解放済み）':
      'Blanked (rendering stopped; GPU resources released)',
    '中断は黒画面にし、描画とGPU資源を解放します。投影窓は開いたままです。再表示は、一時停止中なら続きから、中断後なら同じ映像を作り直します。文字・設定・向きは保持します。':
      'Blanking stops rendering and releases GPU resources. The projection window stays open and black. Show visuals again continues a paused scene, or recreates a blanked scene. Text, settings and orientation are kept.',
    '投影窓を閉じると、その窓の映像と保持データを破棄し、キー入力も解除します。操作席は開いたままです。':
      'Closing the projection window discards its visuals and retained data and disables keys. This operator window stays open.',
    'Escはキー入力だけを解除します。映像は続き、GPU資源は解放しません。動きだけの一時停止はSpaceです。':
      'Esc disables keys only. Visuals continue and GPU resources remain allocated. Space pauses motion.',
    '中断すると黒画面にし、描画とGPU資源を解放します。再表示は、一時停止中なら続きから、中断後なら同じ映像を作り直します。':
      'Blanking stops rendering and releases GPU resources. Show visuals again continues a paused scene, or recreates a blanked scene.',
    '映像と保持データを破棄します。このタブは残るため、終了後に閉じてください。':
      'Discard visuals and retained data. This tab stays open; close it after ending the display.',
    'この窓を再読込み': 'Reload this window',
    '映像を準備できませんでした。再読込みして、もう一度お試しください。':
      'The visuals could not be prepared. Reload this window to try again.',
    '動きだけ止めるときはSpace。映像を黒くして中断するときは「投影の補正・中断・終了」→「映像を消して中断」。戻すときは「映像を再表示」→必要なら「演奏開始」です。Escはキー操作だけを止め、映像は続きます。プロジェクターの光を止める操作は機器側で行ってください。':
      'Space pauses motion. To blank the image, open “Output, stop & exit” and choose “Blank visuals”. Choose “Show visuals again” and, if needed, “Enable keys” to return. Esc disables keys while visuals continue. Use the projector controls to stop its light output.',
    '詳細欄「投影窓を閉じる」。機器の電源・画面配置は機器とOSの手順で操作します。':
      'Choose “Close projection window” in the details section. Use the device and OS controls for power and display arrangement.',
    '一時停止はSpace。終了は操作画面の「投影の補正・中断・終了」から「投影窓を閉じる」。閉じた後の文字・設定は初期値になります。':
      'Space pauses motion. To end, open “Output, stop & exit” in the operator window and choose “Close projection window”. Text and settings return to their defaults after closing.'
  });
  Object.assign(dictionary, {
    'ドクロの骨の白さ': 'Skull bone whiteness',
    '骨の白さ': 'Bone whiteness',
    '低くすると流体の色になじみ、高くすると半透明の白い骨が見えます。初期値0%は従来の見た目です。文字と重なる部分は、投影先で読みやすさを確認してください。':
      'Lower values blend into the fluid color; higher values reveal translucent white bone. The default 0% keeps the previous appearance. Check overlapping text for readability on the projection surface.',
    '会場に合わせて骨の白さを調整する': 'Adjust bone whiteness for the venue',
    '操作窓の「ドクロの骨の白さ」で調整します。低くすると流体の色になじみ、高くすると半透明の白い骨が見えます。初期値0%は従来の見た目です。文字と重なる部分は、投影先で読みやすさを確認してください。':
      'Use “Skull bone whiteness” in the console. Lower values blend into the fluid color; higher values reveal translucent white bone. The default 0% keeps the previous appearance. Check overlapping text for readability on the projection surface.'
  });
  Object.assign(dictionary, {
    'ドクロの骨の白さ（O）': 'Skull bone whiteness (O)',
    'O（アルファベットのオー）を押し直すと、現在の白さに25ポイント加えます。100%で止まり、次の押下で0%へ戻ります。例えば10→35→60→85→100→0%。演奏開始後、ドクロで有効です。押しっぱなしでは変わりません。数字0はドクロ数を増やすキーです。':
      'Press O (the letter) again to add 25 percentage points to the current whiteness. It stops at 100%; the next press returns to 0%. For example: 10→35→60→85→100→0%. Available for skulls after enabling keyboard performance. Holding the key does not repeat. Digit 0 increases the skull count.',
    '骨の白さ＋25%': 'Bone whiteness +25%',
    '白さ＋25%': 'Whiteness +25%',
    'O（アルファベット）': 'O (letter)',
    '骨の白さ＋25ポイント。100%の次は0%（ドクロのみ）':
      'Bone whiteness +25 percentage points; 100% returns to 0% on the next press (skulls only)',
    '9 / 0は体数、L / Mは顎、Oは骨の白さ＋25ポイント。Cは顎の自動モード、Vは前景の光です。':
      '9 / 0 change the skull count, L / M control the jaw, and O adds 25 percentage points of bone whiteness. C selects automatic jaw modes; V adds foreground light.',
    '9 / 0、L / M、Oはこの映像では未使用です。Cは旋回の配分、Vは新しい個体の速さと回り方です。':
      '9 / 0, L / M and O are unused in this scene. C selects the flight mix; V changes new bats’ speed and turning.',
    '操作窓の「ドクロの骨の白さ（O）」のスライダーで調整します。低くすると流体の色になじみ、高くすると半透明の白い骨が見えます。初期値0%は従来の見た目です。文字と重なる部分は、投影先で読みやすさを確認してください。':
      'Use the “Skull bone whiteness (O)” slider in the console. Lower values blend into the fluid color; higher values reveal translucent white bone. The default 0% keeps the previous appearance. Check overlapping text for readability on the projection surface.'
  });
  const dict = new Map(Object.entries(dictionary));
  const escape = (s) => s.replace(/[.*+?^$()|[\]{}\\]/g, '\\$&');
  const pattern = new RegExp(
    [...dict.keys()]
      .filter((s) => s.length > 1)
      .sort((a, b) => b.length - a.length)
      .map(escape)
      .join('|'),
    'g'
  );
  function translate(source) {
    if (dict.has(source)) return dict.get(source);
    return source
      .replace(
        / \/ 開き幅：(最大|小|中|大) (\d+)°/g,
        (_, s, n) =>
          ' / Width: ' +
          { 小: 'Small', 中: 'Medium', 大: 'Large', 最大: 'Maximum' }[s] +
          ' ' +
          n +
          '°'
      )
      .replace(/（位置(\d+)）/g, ' (slot $1)')
      .replace(pattern, (s) => dict.get(s));
  }
  const remote = window.HalloweenStageRole?.remote === true;
  const root = remote
    ? document.getElementById('stage-start')
    : document.getElementById('controls') ||
      document.querySelector('main') ||
      document.body;
  const sources = new WeakMap(),
    attributes = new WeakMap(),
    hrefs = new WeakMap();
  const skip =
    'script,style,textarea,input,[contenteditable],#message,#message-text,#text-preview,#main-text,#text';
  let language = 'ja',
    disposed = false;
  function hashLanguage() {
    const m = location.hash.match(/(?:^#|[?&])lang=(ja|en)(?:&|$)/);
    return m ? m[1] : 'ja';
  }
  function textNode(node) {
    if (
      !node.parentElement ||
      node.parentElement.closest(skip) ||
      node.parentElement.closest('.language-controls')
    )
      return;
    const current = node.nodeValue;
    let saved = sources.get(node);
    if (!saved || current !== saved.rendered)
      saved = { source: current, rendered: current };
    const trimmed = saved.source.trim(),
      result =
        language === 'en'
          ? saved.source.replace(trimmed, translate(trimmed))
          : saved.source;
    saved.rendered = result;
    sources.set(node, saved);
    if (current !== result) node.nodeValue = result;
  }
  function element(el) {
    if (el.closest(skip) || el.closest('.language-controls')) return;
    let saved = attributes.get(el);
    if (!saved) {
      saved = {};
      attributes.set(el, saved);
    }
    for (const name of ['title', 'aria-label', 'placeholder']) {
      const value = el.getAttribute(name);
      if (value === null) continue;
      let item = saved[name];
      if (!item || value !== item.rendered)
        item = { source: value, rendered: value };
      const result = language === 'en' ? translate(item.source) : item.source;
      item.rendered = result;
      saved[name] = item;
      if (result !== value) el.setAttribute(name, result);
    }
    if (el.tagName === 'A' && el.hasAttribute('href')) {
      const raw = hrefs.get(el) || el.getAttribute('href');
      hrefs.set(el, raw);
      try {
        const url = new URL(raw, location.href);
        if (!/\.html$/i.test(url.pathname) || url.origin !== location.origin)
          return;
        const parts = url.hash
          .slice(1)
          .split(/[?&]/)
          .filter((p) => p && !/^lang=/.test(p));
        parts.push('lang=' + language);
        url.hash = parts.join('&');
        if (el.href !== url.href) el.href = url.href;
      } catch {}
    }
  }
  function apply(node = root) {
    if (!node) return;
    if (node.nodeType === 3) {
      textNode(node);
      return;
    }
    if (node.nodeType !== 1) return;
    element(node);
    const walker = document.createTreeWalker(
      node,
      NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT
    );
    while (walker.nextNode()) {
      const n = walker.currentNode;
      if (n.nodeType === 3) textNode(n);
      else element(n);
    }
  }
  const controls = document.createElement('div');
  controls.className = 'language-controls';
  controls.setAttribute('role', 'group');
  controls.setAttribute('aria-label', 'Language / 言語');
  for (const [value, label] of [
    ['ja', '日本語'],
    ['en', 'English']
  ]) {
    const b = document.createElement('button');
    b.type = 'button';
    b.dataset.language = value;
    b.textContent = label;
    b.addEventListener('click', () => setLanguage(value));
    controls.append(b);
  }
  (remote ? root : document.querySelector('header') || root)?.prepend(controls);
  function setLanguage(value, { notify = true } = {}) {
    if (disposed || !['ja', 'en'].includes(value)) return false;
    const changed = value !== language;
    language = value;
    document.documentElement.lang = value;
    for (const b of controls.children)
      b.setAttribute('aria-pressed', String(b.dataset.language === value));
    apply();
    document.title = language === 'en' ? translate(sourceTitle) : sourceTitle;
    if (changed && notify)
      window.dispatchEvent(
        new CustomEvent('halloween-language-change', { detail: { language } })
      );
    return true;
  }
  const observer = new MutationObserver((records) => {
    for (const r of records) {
      if (r.type === 'characterData') textNode(r.target);
      else if (r.type === 'attributes') element(r.target);
      else for (const n of r.addedNodes) apply(n);
    }
  });
  if (root)
    observer.observe(root, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['title', 'aria-label', 'placeholder']
    });
  function hashChange() {
    setLanguage(hashLanguage());
    const anchor = location.hash.slice(1).split(/[?&]/)[0];
    if (anchor && !anchor.includes('='))
      document.getElementById(anchor)?.scrollIntoView();
  }
  window.HalloweenI18n = Object.freeze({
    getLanguage: () => language,
    setLanguage,
    t: (source) =>
      language === 'en' ? translate(String(source)) : String(source)
  });
  window.addEventListener('hashchange', hashChange);
  setLanguage(hashLanguage(), { notify: false });
  if (location.hash.includes('lang=')) hashChange();
  window.addEventListener(
    'pagehide',
    () => {
      disposed = true;
      observer.disconnect();
      window.removeEventListener('hashchange', hashChange);
    },
    { once: true }
  );
})();
