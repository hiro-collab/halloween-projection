# 原Aの一体表示 — 0.1.16

2026-10-13。ドクロ・流体・背景文字を原の順序で一画面に接続した。UIの「ドクロ・流体・背景文字を原の順序で比較」または `halloweenControl.set('skull3d','aCompositeMode',1)` で選択。登録済みCC0別モデル、原顎支点0、fluidModeも同時に選ぶ。**原全体の再現合格ではない。1組のみ、速度場は時刻0固定、装飾noiseは未接続。**

## 今回接続した順序

1. 頭と顎：既存の登録/支点/カメラに、原の評価値を使う照明比較を追加。点光源(0,0,10)、白/dimmer1、減衰なし。材質diffuse .4、emission .5、specular .3、shininess157、front alpha1/side0を使用。
2. 頭前処理：gain .36、Level brightness1.36/contrast2.18、eighth→Blur preshrink3/size10→brightness2/luminance alpha、Edge strength1.65/black .17をOver。原constant3の代表値を固定した。
3. 頭前処理から従来の原fluid coreへ色を注入。640×360の赤scalar、100×57速度/圧力、Delta1/60のまま。動的noise生成器は未実装。
4. fluid色のSobel strength5.31→luminance/RGBA8→HSV172/saturation1.66/value9と、gain .96→RGBA8→HSV224を足す。後段Hue138/value1.42へ渡す。
5. 頭：Level .96/gamma1.02→gamma1.06/saturation1.32と、Blur preshrink2/size9→gamma.79をOver。さらにbrightness1.26/gamma.32/contrast1.34。
6. 頭と流体のMultiply→Mono→threshold .544を使いOutside。装飾noise入力はゼロとして明示し、新しいnoise画像や代替noiseを作らない。
7. 背景：eighth→Blur preshrink4/size21。文字マスクとのMinimum→brightness5/gamma2.02。元背景を前、文字を後ろへOver。
8. 頭と流体/文字のAddとOverをCross .824で混ぜる。
9. ドクロ前景：quarter、invert .098/brightness2/gamma.86/contrast4.38、circle radius .2/softness .062、radial Strength .6/中心(.5,.5)/134sample、gain1.3。
10. ドクロ前景を流体/文字後段へOverし、最後にbrightness1.03/gamma1.1。表示先は黒い不透明な投影画面。

134は原に保存されたuniform値を比較条件として固定。元radial componentのSamples既定値20や元VJの入力/制御状態全体を再現したとはしない。未使用の2つの前景経路は切り離し、1組の比較にした。

上流の実入力は `Lyrics_viewer/out1`。その主文字枝のArial、fontsizeX .15625 fraction、中央配置を参照し、ブラウザではArial/幅×.15625を使用。内部texterの未接続「Hello!」/Roboto Blackを採用していない。長文は原の固定サイズの比較で、自動fitや原の文字metrics一致を保証しない。

## 照明・後処理の限界

材質/光源の実評価値を採取したが、現在はCC0のtriangle face normalからのPhong/視線alpha近似。原のpoint normal、ambient、材質shader全体との一致は未検証。元モデルと同じ形状・照明とはしない。

Blurは原のsize/preshrinkを使うGaussian sampling候補。Edge、Level/HSVの丸め、alpha、circle柔らかさにも差がある。中間Web textureはRGBA8、原radialはRGBA16float。原の6組・motion/fader・全制御状態は未移植。原とは異なる発光や透明度を、完成した原の外観と呼ばない。

原由来の固定装飾noise画像をWeb資産へ埋め込む案は、自動承認レビューが拒否した。private/MIT外データを保存・配布対象へ追加する権利確認がないため。該当処理は実行されず、安全なコードのみの一体表示へ切り替えた。新しいnative noise payloadはweb/ZIP/cache/Gitに含めていない。既存の承認済み固定velocity参照とprivate atlasは引き続きMIT外。

## 同入力の対照画像

署名済み既存TD2025.33230の私的コピーで、同じCC0頭画像、既存の原dye60、同じ文字マスクを入力。元資料を変更せず、8callbackで正常終了。装飾noiseなし、Hue138/Cross.824、1組/134sampleの制御した部分条件。最終の原枝エラーは空。

`output/a-integrated-paired-canvas-20261013/comparison.html` に空文字・二行・長文の原TOP/Web対照を保存。原画像はprivate資料で、配布ZIPには含めない。比較はcompositorだけを分離し、core時計や動的noiseの一致を証明しない。

|文字条件|全画面RGB MAE・byte|明るい画素の集合でのRGB MAE・byte|最大差|
|---|---|---|---|
|空|6.23/255|42.88/255|255|
|二行|6.39/255|43.61/255|255|
|長文|7.58/255|47.31/255|255|

黒い背景が多いので、全画面平均だけで近い再現と評価しない。頭の発光/alpha、流体の縁や文字色の差が可視。自己出力だけの一致試験ではない。

採用前の試験も保持：入力の欠落/異なる階層への直接配線を修正。原wet/dry export table欠落でbypassが選ばれたコピーは採用せず、Drywet1の実値に沿うactive経路で再採取。ブラウザの最初のframebuffer失敗は誤ったblur引数を修正し、寸法guardとエラー時の表示停止を追加。ImageBitmapのflip設定が無視された最初の対照は採用せず、Canvasへ変換して同じ向きで比較した。

## GUI・負荷・解放

17件合格：旧既定、共通API、文字編集、noise制限、Pause、paused文字差分、空/長文literal、paused Reset、切替、12回再構築、A/B往復、Stop/Resume、End、pageerrorなし。

1280×720、3.041秒の同時counter採取でsolver **19.07step/s**、mesh描画 **19.07draw/s**、compositor描画 **19.07draw/s**、RAF **19.07/s**。独立counterを同じ時点で読んだ。solver平均26.19ms/max31.60ms、head描画全体平均51.57ms/p95 54.20ms。postの計測はcommand submission平均13.91ms/max21.20msで、GPU実行時間全体とはしない。原60Hz実時間再現は未達。

compositorの割当texture計数87,098,568bytes、scalar scratch921,600bytes。Core既存buffer4,972,800bytesは別。停止/切替/Endでprogram/texture/framebuffer/GPU計数/CPU scratchが0、scope最大1。所有GL contextも解放する。端末全体のGPU使用量を測定した値ではない。

ライブ画像：`output/a-integrated-gui-v16-20261013/with-text.png`、`blank.png`、`long.png`。条件/17結果は同folderの `a-integrated-gui.json`。原基準は `private/timeline-20261012/a-integrated-active-20261013`、実係数はoptics.json。旧版/元TOE/既存TD3936を保持。push/外部送信/権限拡大なし。

残件：動的noise、装飾noiseの権利と接続、point-normal照明/alpha、後処理の可視残差、原モデル/6組/motion/fader、文字metrics、B乱流/部分age/最終外観/時計境界。


最終回帰：一体GUI17、旧scalar13、原支点21、旧3D18、B操作22、15asset保存15、一体Aのoffline起動/End5、すべて合格。旧numeric golden280も合格。通常browser再起動/旧版更新/物理切断は今回未実施。
最終ZIP249035 bytes、build `0.1.16-a-integrated-preview-b44e3615c262`、SHA256 `c0720ef5eea48df70cc077eba1b7b6debfce0ee896d310f09f78d97f60e69087`。16files/15cache assets、CRC/全展開byte一致。B rendererとa-fluid.jsは0.1.15からbyte不変。条件と全結果を `output/a-v16-regression-20261013/confirmed-checkpoint.json` に保存。
