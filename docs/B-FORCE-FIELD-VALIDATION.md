# 0.1.11 原Force SOPの最小修正

2026-10-13。ローカルのみ。6bb3974/0.1.10以下を保持、push禁止継続。
原の方向/強さ/weightを式で再現し、任意係数で見た目を合わせない。

## 原値と原因

原metaは中心(0,0,.0299999993)、半径XYZ=3、weight=2、Wyvill kernel、exponents=1。
Force primitiveの実値はdir=(0,0,1)、fradial=0、fedge=0、fvortex/fspiral。
UIパラメータ表示だけでなく、primitive値を読んだ。

Vortexのみ(3,0)、Spiralのみ(0,−1.3)、合成(3,−1.3)、別合成(3,−1.7)を明示設定。
原の同42発生入力/seed1/Reset0、毎回1frame時計で120stepを採取。
乱流・外力を0、drag5に固定し、同じ観測新生P/v/ageから比較した。
全4ケース各609連続状態。式は単独成分から特定し、異なる合成値でも検証した。

中心からの位置をd=(x,y,z−.03)、平面長をr、n=(x/r,y/r,0)、t=(−y/r,x/r,0)とする。
u=|d|²/9、w=2×[1−22u/9+17u²/9−4u³/9]。
**F=w×[Vortex×t−(Vortex＋Spiral)×n]**。

- Vortexには接線だけでなく同じ強さの内向き成分がある。
- Spiralの半径方向は−Spiral。負値は内向きVortexを減らす。
- 旧Webは位置長に比例する.14/.1倍の線形場で、方向の正規化・weight・kernel・成分の意味が違った。
- 前段の合成でradial係数が−1.7と出たのは−(3−1.3)だった。パラメータ/primitiveの不一致ではない。
- 力を評価する位置は更新前P。更新後Pなどの候補より一致することを確認した。

`HalloweenBatParticle.force`を追加し、候補線形場だけを置換。
外力・候補乱流・出生・更新式・sprite・40枠・size・合成/control APIは保持。
軸上r=0とsupport外u>=1は0を返す契約。今回のNative採取は実際のB軌道座標で、境界/軸上の直接採取ではない。

## 同条件の検証

実生産のforce/integrate関数へ原状態を渡した。誤差は世界座標のEuclidean距離。
原はfloat32、Webはfloat64。任意のfit係数はない。

| Native明示値 | 力component max差 | 120step位置max 修正前 | 修正後 |
|---|---:|---:|---:|
| V3 / S0 | 3.992e-6 | .47844320 | 1.16218e-7 |
| V0 / S−1.3 | 3.484e-6 | .80358939 | 1.62132e-7 |
| V3 / S−1.3 | 4.065e-6 | .52580066 | 3.54543e-7 |
| V3 / S−1.7 | 4.036e-6 | .58719100 | 2.44322e-7 |

別の前段4入力対照へ同じ生産関数を適用した結果：

| 入力 | 120step位置max 修正前 | 修正後 |
|---|---:|---:|
| 外力/抵抗のみ | 1.12853e-7 | 1.12853e-7 |
| 乱流のみ | .05744860 | .05744860 |
| Force SOPのみ＋外力/抵抗 | .52921599 | 4.00922e-7 |
| 全力場＋Web候補乱流 | .54760613 | .05082517 |

**全力場の残差は残る**。通常Webの部分age乱数も未一致なので、これは原B全体の自由運動一致ではない。
場の差が縮まったので原A限定の静的接続確認へ進める。B乱流/部分age・光/文字も別未完として保持する。

証拠：`private/timeline-20261012/force-formula-20261013/capture/force-geometry.json`、設定、Reset、120行。
`private/fire-wrap-20261013/force-stage-validation.json`、`force-full-stage-validation.json`。
`tests/b-force-field.qa.cjs`は原12golden（4成分条件）と2edge契約で14/14、位置component max1.05e-8/速度5.60e-8。
Node出生3/更新式11も合格。ブラウザー回帰は最終確認後に追記。

0.1.11 ZIP：213407 bytes / 14files / 13assets。
Build `0.1.11-b-force-field-preview-611874969a80`。
SHA256 `18df03fd1675523a675e20b5cab34a272339d4d9896e434d1b2ae26229d39646`。
通常再起動/旧版更新/物理切断/新独立再レビューは今回未実行。原A見通し文書を保持。

最終回帰: 力場Node14/14、出生Node3/ブラウザー3、更新式11、入力22、描画12、光/文字/資源12、信号6、保存15、合格。実Web仮想時計120stepを別名保存。ZIP CRC/全byte一致、0.1.10保持、sprite/合成/control API/atlasのbyte不変を確認。
