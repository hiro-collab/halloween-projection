# 0.1.10 出生位相とForce入力の分離

2026-10-13。ローカルのみ。3cb351d/0.1.9とd4e38b6/0.1.8を保持。GitHub送信は引き続き禁止。
この段階は出生数の位相だけを修正。部分ageの内部乱数、原Force SOP、原B全体は未一致。

## 有限対照と原因

同じ原42発生入力、Reset後0粒子、60Hz時計を自動cook前に1ずつ進めた有限コピー。
Birth5/Life5/初速1.3。jitter ON/OFF、seed1/2の4ケースを240step採取。
元TOEを変更せず、検証コピーだけ通常終了。既存TD3936を保持。

- 全4ケースの20出生stepは同じ：6,17,29,41,…233。
- jitter OFFの部分ageは0。ONは0.00125555～0.01646127秒、平均0.01021541秒。
- seed1/2の部分ageもこの範囲では同じ。seedが一般に無関係とは断定しない。
- 旧Webは固定間隔12,24,…で、最初の分岐はstep6の出生有無だった。
- float32の5/60残余を時計の初期frame1分持ち、各stepに加算して.5を超える整数分を発生、残余から減算すると全240stepの20出生が一致した。
  float64や単純な端数切上げでは不一致。これは原の観測に合う候補式で、内部ソースを確認したものではない。

`HalloweenBatParticle.createBirthClock`を追加し、固定nextBirth=.2を置換。
Resetは新しい独立カウンターを作る。描画、slot数、大きさ、速度/位置更新、原42点は変更していない。
**部分ageは通常描画では0候補のまま**。乱数の少数参照値を本番へ流用・有限表を無根拠に繰り返す実装はしていない。
部分age0の入力差は、この無力/無抵抗対照の初速1.3で最大.02139965世界座標。
Forceを加えた後の誤差上限をこの値で保証しない。

## 同じ原新生状態からForce/乱流を分ける

別の有限120stepで外力/抵抗のみ、乱流のみ、Force SOPのみ、全力場を採取。
全4ケースの新生ID/step/P/v/ageが一致したことを確認してから比較。
元の初生状態をWeb候補計算へ直接与え、609状態を追跡。出生位相・部分ageの差を混ぜない。

| 入力 | 120step位置max | 同じ原P/vの1step位置max | 同じ原P/vの1step速度max |
|---|---:|---:|---:|
| 外力.1 / drag5のみ | 1.12853e-7 | 1.64350e-8 | 5.52119e-8 |
| 原乱流のみ対Web sin候補 | .05744860 | .00011107 | .00666411 |
| 原Force SOPのみ対Web線形候補 | .52921599 | .00191272 | .11476349 |
| 原全力場対Web候補 | .54760613 | .00199409 | .11964557 |

Force-onlyの速度から推定した有効加速度medianは6.74935、同座標のWeb候補は.186342。
これは速度差からの推定で、Force SOP出力を直接読んだ値ではない。
**大きい配置差はForce SOP入力を入れた時に発生する**。乱流も未一致だが寄与は小さい。
係数の見た目合わせやframe/slot/寸法変更はせず、次に同じ座標で方向・強さ・metaball weightを測る。

## 証拠・範囲

- `private/timeline-20261012/birth-phase-20261013/capture/`：4対照240行/Reset/設定。
- `private/timeline-20261012/force-input-fixed-20261013/capture/`：4対照120行/Reset/設定。
- `private/fire-wrap-20261013/birth-phase-analysis.json`、`birth-force-split-comparison.json`。
- `tests/b-birth-phase.qa.cjs`：出生20/240step・Reset・部分age未一致の契約。
- `tests/b-birth-browser.qa.js`：実RAF/accumulatorを通した出生20/240stepとReset。
- Force分離の初回は欠番を除くinputs配列を添字2で読みIndexError。実在force1を明示接続し別labelで修正、失敗は保持。
- この段階は出生1probe、Force分離1probe+既知接続ミスの修正1回で区切った。内部乱数を際限なく探索しない。
- 原Aの見通しは[A-LOCAL-REPRODUCTION-OUTLOOK.md](A-LOCAL-REPRODUCTION-OUTLOOK.md)。新規A実装を完了扱いしない。

0.1.10 ZIP：212865 bytes / 14files / 13assets。
Build `0.1.10-b-birth-phase-preview-7b05ad9f5215`。
SHA256 `768049d200f3233f94d9630920b3f3a881a478e91cf960b16bbbe7906f1b214b`。
最終ブラウザー回帰の結果は確認後に追記する。通常再起動/旧版更新/物理切断は今回未実行。

最終回帰: 出生Node3/3、実ブラウザー出生3/3（20出生/240step）、原更新式11/11、入力契約8/8、入力22/22、描画12/12、光文字資源12/12、保存15/15。ZIP CRC/全byte一致、0.1.9保持を確認。
