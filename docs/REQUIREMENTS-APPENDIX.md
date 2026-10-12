
# VJ制御対応とAPI設計

シーンA=回転ドクロ＋流体＋背景文字、シーンB=飛翔する自作コウモリ＋中央文字。
2シーンを同じ表示面で切り替え、操作で速度/動きを制御する。入力/API分離は本人の設計方針。
流体・両シーンの文字位置は必須。3体固定、キー配列、MIDI必須、具体的文字数上限は指示されていない。

### J1. 確認した制御経路

project1内（Pはmain_visual_mixer_comp/）:
1. midiinmap1（Launchpadのs1-s4/b1-b32というノード注記）と手動constant1をmath1(add)で合成する。
2. project1/switch1 CHOPのinput0=math1、input1=merge2（Leap系slider/button）。選択状態の実再生は未確認。
3. main_visual_mixer_comp.networkのinput0=このswitch1→in1 CHOP。
   input1=leap_input_gate_comp/out1、input2=keyboardin1も記録されている。
4. P/in1→select_sliders(s[1-3])→null_sliders。P/bat_set.Crossの式はnull_sliders.s1。
5. bat_set/par2→null1.Cross→cross1(CHOP)でconstant2/constant3を混合→null2。
   constant2/3にはVortex5/1、Spiral-1.7/-0.9等がある。
6. bat_set/bat.Vortex・Spiralはこのnull2を参照。
   →bat/particle_position_and_rotateの親参照→force1.vortex/spiral→particle1のforce入力。
7. 別のP/in1→select_16s(b[1-32])→null_buttons→bat_set.Buttonchop。
   →bat_set/select1(b30)＋select2(手動b30)→math3(add)→count1(loop,max3)→null3.index→bat.Index。
8. bat.Indexは画像/表示分岐に関わる。動きのs1と、表示切替のb30を同じspeedとして扱わない。

キーボード入力端子の存在は確認したが、そこからbat速度までの直接経路は未確認。
原VJがMIDIを使っている事実を、配布アプリのMIDI必須へ読み替えない。
Leapデバイス・ライブカメラ・MCP/Hermesの外部連携を新商品の依存へ加えない。

Initialspeedは別経路:
bat/particle_position_and_rotate/networkのsphere1→in3→sort1→base1/in1。
base1でSOP法線→sopto1(normal)→math1(gain=par1.Initialspeed)→null2
→chopto1(N属性)→base1/out1→particle1発生源。
保存値1.3。新生粒子の初期速度に関わり、単なる描画時間倍率とは違う。
この値が上位MIDI/keyboardから操作される接続は、現在の静的調査では未確認。

### J2. 文字と2シーンの接続

- P/switch1 TOPはvisual_mode_index_chop.modeで選択し、input4=skullfluid/out1、input5=bat_set/out1。
  project1/switch1 CHOP（制御入力の切替）とは別ノード。
- bat_set.network: Lyrics_viewer/out1→bat_set/in2→null9。
  bat_set/fire_wrap/texter/select1は../../null9を参照。
- skullfluid.network: Lyrics_viewer/out1→skullfluid/in4→null9。
  skullfluid/base2/fire_wrap/texter/select1は../../../null9を参照。
- bat_set/bat.networkのbat/in2は透明constant1入力。文字がこのin2に直接入るとする以前の推測は修正。
- Lyrics_viewerはLyrics/Hue/Size、b31によるdisplay、b13-16のforward/back/reset/flip、SelectedWords/InfoLyricListsを参照する。
  歌詞本文を商品へ転用せず、利用者が編集する文字を受ける。
- 原VJの文字入力が両方へ届く経路は確認済み。背景/中央位置・最終の重なり順は映像照合未実施。
  今回の位置は本人要求として採用する。文字を全シーン最前面の同じUIに置く変更は別差分になる。

### J3. パラメーター候補の意味・保存値・範囲・初期値

ブラウザAPI名はすべて設計案。全項目を初期UIへ露出する必須要件ではない。
cparmで名称・ラベル・定義数列を保存確認したが、数列の型/固定範囲/slider範囲/既定値の完全な解読は未完。
したがって以下の範囲はAPI候補、値は原VJ保存値であり、本人決定の範囲/商品既定値ではない。

| API候補 | 意味 / 原作対応 | 保存値・式の観測 | API範囲・初期値（案/未決） |
|---|---|---|---|
| flight.initialSpeed | 新生粒子の速度倍率。base1.Initialspeed→法線gain | 1.3 | 有限・非負の案。上限/商品初期値は未確定。原作座標/速度単位を合わせる。 |
| flight.motionMix | s1→bat_set.Cross→定数2/3の混合 | Cross式はs1、保存評価0 | 0〜1の案。初期値は基準入力から採る。直接力設定と競合時の優先規則が必要。 |
| flight.vortex / spiral | 渦・螺旋の力。null2→bat→force1 | 定数の5↔1 / -1.7↔-0.9、bat保存評価1/-0.9 | 符号を含む有限値。安全な上下限は未確定。sourceMix時は派生値として読取、override時のみ直接設定する案。 |
| flight.radial / axial / direction | 放射・軸方向の力。bat→force1 | Radial0、force保存Dir(0,0,1)、Axial0 | 原作を再現する基本値と操作範囲を照合。負値を一律拒否すると力の向きが変わるため項目別判断。 |
| flight.turbulence | XYZの乱れ。bat→particle1 | bat各.2、子保存評価10.1、定数各1.1 | ベクトル各有限・非負の案。上限未確定。上位定数と現batのbinding範囲も区別。 |
| flight.birth / life | 発生量/生存時間。bat→particle1 | bat5/5、定数20/2、子保存評価20/2 | Birth非負/Life正の有限値の案。TD単位・発生規則・初期値・上限は未確定。 |
| flight.viewWidth | 正投影カメラ幅。bat.Orthowidth→cam1 | bat1.26、定数1.5、cam保存評価1 | 正の有限値の案。個体サイズと画面範囲の意味を分ける。 |
| bat.flapFrequency | batImgs.frequeny→三角波系 | 1と×4の式 | 正の有限値の案。上位入力への接続未確認。原作の実羽ばたきと照合して初期値/上限を決める。 |
| display.variant | b30→count→Index、画像/加工分岐 | max3ループ、bat保存評価2.96 | 原作照合用状態。4分岐の追加公開を必須にしない。商品Bを自作コウモリから別素材へ勝手に切り替えない。 |
| scene.timeScale | シミュレーション時間倍率 | 同名原パラメーター未確認 | AI案。初期値1の案、範囲未決。初期速度/羽ばたき/寿命/流体のどれへ作用するか明文化が必要。 |
| skull.motionMix / hue | Motioncross=s2、Hue=s3、math/lag/lookup経由 | 保存評価0/0、motionCrossは.7〜1変換等を経由 | 有限値。Hueは元の0〜360変換と色表を保持。入力の正規化・初期値は基準場面で確認。 |
| skull.jawExponent / jawNoisePeriod | Jawexp/Jawperiod→motionMat.noise3 | 4 / .12 | 正の有限値の案。Noise periodを「.12秒の開閉周期」と呼ばない。上限/初期値未確定。 |
| skull.pose / size / center | Tx/Ty/Tz・Rx/Ry/Rz・支点と形状の調整 | 各テンプレートとpivotY-.5等 | 基準形状の座標に合わせる。商品値域/初期姿勢は未確定。代替モデルへ数値を無条件に流用しない。 |
| fluid.mix / colorDiffusion | Cross2/Coldiffusion→base2 | .824 / .95 | 0〜1の案。保存枝の実効果を映像確認して初期値を決める。 |
| fluid.noiseAmplitude / noisePeriod | Noiseamp/Noiseperiod→base2/base3 | 1.08 / 1.06 | 非負振幅/正periodの案、上限・初期値未確定。TD/Webの単位とノイズを照合する。 |

設定保持/Resetは上記全API候補へ共通の案:
- ユーザーの文字・設定値はシーン別に保持。非選択シーンの値は保存のみで、その効果の描画資源を作らない。
- 切替で旧効果をReset/停止/解放し、新効果の粒子・残像・流体・顎/回転の状態を基準へ初期化。
- 明示Resetは動的状態を初期化し、設定値を既定値へ戻す操作とは分ける。
- sourceMixによる派生値とユーザーoverride値を同時に上書きしない。保持するモードもstatusで返す。
- 元のabsTime・乱数・count/indexの開始状態との比較契約は未確定。設定保持の案を原VJ契約と呼ばない。

### J4. 既存GUIと共用できるもの

確認先 web/runtime.js・web/catalog.js・web/adapters.js・web/gl-host.js:
- select/set/status、select世代確認、直列化、範囲外/NaN拒否、シーン別controls保存、非選択時の非割当。
- 1 RAF、Pause/Stop/Reset、scope.release、初期化失敗時の解放、状態イベント/診断の履歴上限。
- エフェクトと入力の接続面を共通化する設計が使える。新2シーンのcatalogとadapterが必要。
- 現validateSetは数値キー用。方向/乱れ等のベクトルや文字には別の検証が必要。
- 既存fluidはfuelThreshold/flame等の別契約で、原skullfluidのColdiffusion等と同名同値ではない。
- HTTPのdot/NodeブリッジやWebGL2/float拡張を配布の必須にする必要はない。まず同一ブラウザ内APIを案とする。

### J5. 検収を分ける

制御検収: API値→実シミュレーションの速度/力への反映、UI/入力/API直呼びの一致、
範囲/未知key拒否、切替後の設定と状態、非選択効果の非更新。
映像検収: 同条件の原VJとA/Bの見た目、羽ばたき/飛翔/顎/回転/流体、文字位置・合成順の比較。
APIが動いたことを原作再現の合格としない。

原作の生成結果を画像群として再利用する方法は許容される。羽ばたきを静止させる意味ではない。画像と飛翔シミュレーション/APIを分離する。
