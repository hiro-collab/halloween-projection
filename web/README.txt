ハロウィン投影 0.1.55-jaw-edge-preview

1 配布ZIPを保存し、右クリック→「すべて展開」。ZIPの中から直接開かないでください。
2 展開先のはじめに_START-HERE.html（またはアプリ本体/START-HERE.html）をChromeで開く。
3 「操作窓を開く」→「投影窓を開く」→その投影窓で開始。
4 操作窓へ戻って文字を準備。画面の「映像を切り替える」「投影向きを切り替える」ボタンで映像と向きを選ぶ。
5 「演奏開始」を押してから下記のキーを使う。別窓や文字入力へ移った後は、操作窓で再度「演奏開始」。
6 終了は「投影の補正・中断・終了」を開いて「投影を終了」。再使用はSTART-HERE.htmlから。
Chromeが使えるこのPCでは追加ソフトとコマンド入力は不要。フォルダー全体を保持するとネット接続なしで起動できます。
ドクロとコウモリ画像は同梱されています。投影窓を閉じた後は文字・設定が初期値になります。

【3段の8目標位置】
1 2 3 4 5 6 7 8：動きの激しさを8位置から指定 / 1押下で目標へ
Q W E R T Y U I：色相を8位置から指定 / 1押下で目標へ
A S D F G H J K：文字サイズを8位置から指定 / 1押下で目標へ
9 / 0：ドクロ数を減らす / 増やす（1〜6体） / 1押下ずつ
Z：ドクロ / コウモリを交互に切替 / 単発
X：通常→左右→上下→上下左右→通常 / 単発
C：動き方を3状態で切替 / 単発
V：一時アクセント / 押している間・最大3秒
B：準備した基準へ戻す / 0.6秒長押し
N：映像計算をReset（文字・設定は保持） / 0.6秒長押し
L：顎の開き幅を15°/30°/60°/90°から選ぶ（Aのみ）
M：選んだ幅で開閉。閉じても幅は保持（Aのみ）。Cで自動へ戻る
Space：一時停止・再開 / 単発
Esc：キー演奏を解除（映像は続く） / いつでも

目標は8段階。実値は約0.15秒の線形移行で、途中の再指定は現在値からつながります。
正確な中間値は画面スライダーで指定。色相は境界の短い方向へ移動。
「演奏開始」を押し、操作窓にフォーカスがある間だけ有効。半角英数・Shiftなしで使います。入力欄・選択欄・IME・修飾キー・別窓への移動でキー演奏を解除し、戻っても自動再開しません。数字や文字を入力中に演奏キーを奪いません。

S/Fは文字サイズ、Rは色位置です。Mは今回から顎の開閉です。
Z/X/C/V/B/N/L/Mと9/0、Space/Escが共通操作です。
向きは通常→左右→上下→上下左右。文字と最終映像だけを反転し、UIは正位置。
ドクロ初期3体、出現6％・0.2秒。実投影/別端末は別途確認。
素材はRIGHTS.txt、コードはLICENSE.txt。

ドクロの0％は定位置へ戻って頭部が静止します。コウモリの0％は中央付近でたむろし、羽ばたきは続きます。背景も続くため、映像全体の一時停止はSpaceです。
Vの演出は最大3秒です。押し続けても演奏は解除されません。一度離すと次のアクセントを使えます。V以外の連続押下は最大8秒です。

【日本語 / English】
入口・操作席・キーガイドの日本語 / Englishボタンで切替。再読込みなし。
投影する文字、数値、映像、キー配置は変更しません。言語は保存せず、リンク先へ引き継ぎます。
Choose 日本語 / English on the entry, console, or key guide. No reload; user text and visual settings stay unchanged. Language is not stored.

【編集する方へ / Editing】
通常の利用はHTMLをChromeで開くだけです。配布物にはHTML/CSS/JavaScriptのソースが入っています。
アプリ本体/console.html・console.cssは操作画面、GUIDE.html・guide.cssは案内、console.jsは操作連携です。
キーはkeyboard-performance.jsとperformance-api.js、演出は各a-*.js/b-*.js/bat-*.js、表示言語はi18n.js。
file://で開く版は、テキストエディターで変更して閉じ直し・再読込みできます。通常の文字・色・スタイル変更にビルドは不要です。
PNGはbat-atlas-data.jsにも同一バイトで埋込み、bat-art.jsとビルダーでハッシュを検査しています。
画像をPNGだけ差し替えても反映できません。開発者が寸法・60コマの切出し・ハッシュ・埋込データを合わせて更新します。
3D模型や採取済み数値は独自バイナリ/圧縮データです。一般的な模型変換ツールは同梱していません。
配布ZIP再生成やHTTP配信版のService Worker整合性更新にはリポジトリーのPythonビルダーを使用します。
ZIPへ開発ツールやPython/Nodeは同梱しません。コードのMITと素材条件は別です（LICENSE.txt / RIGHTS.txt）。

The package contains editable HTML, CSS and JavaScript, with meaningful names and no bundler requirement.
Edit console.html / console.css for operator UI, GUIDE.html / guide.css for help, and i18n.js for UI translations.
Keyboard behavior spans keyboard-performance.js and performance-api.js. Visual modules are a-*.js, b-*.js and bat-*.js.
For local file use, ordinary text/style/logic edits need only a text editor and reload. No build is required.
The bat PNG is also embedded in bat-atlas-data.js and hash-pinned in bat-art.js and the maintainer builder. Replacing only the PNG is insufficient.
Model and sampled fields use custom binary/compressed formats; no general model converter is included.
Maintainers use the repository Python builder to regenerate the ZIP and hashed Service Worker for HTTP hosting.
GitHub automatic Source code ZIP is the repository snapshot. A curated application ZIP can be attached manually to a Release; this preview creates no public Release.
