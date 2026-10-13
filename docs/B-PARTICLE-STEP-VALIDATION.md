# 0.1.9 原粒子の120step切り分け

2026-10-13。ローカルのみ。d4e38b6/0.1.8を保持し、GitHub送信保留。
独立再レビューd4e38b6は未合格：固定poseは良好、黒い文字矩形とCanvas alpha受け渡しは解消。自由運動の中央密集/配置差、光のむら/二重縁、文字書体/幅は残る。
原A素材/流体/背景文字も未完。この段階は原飛翔の合格ではない。

## 同じ初期条件と最初の分岐

既存署名済みTD2025.33230で原Bの有限コピーを使い、seed1・Birth5/Life5・初速1.3・Cross.5。
原粒子と、同じ発生入力でForce SOP/乱流だけを外したdrag5/drag0対照を作った。
独立時計を停止し、Reset=trueでcookして全3ケースの粒子0を確認、Reset=false。
次の自動cook前に時計を1frameずつ進め、120stepを採取。全3ケースの出生stepは一致。
IDを観測用に追加した。画角、sprite、図案、Rz、40描画枠、合成はこの比較の計算に使わない。

- 原の出生step：6,17,29,41,53,65,77,89,101,113。Webの固定間隔は12,24,…。
  **最初の分岐はstep6の出生有無**。出生の位相/jitter/RNGは今回の修正後も未一致。
- 原の発生geometryはsort seed1の球面42点、Point Reuse=Loop。Webは別の連続球面点列だった。
  最初の10出生で、ID順のNは発生入力42点のNと一致。旧Web入力の最大位置差.114127、初速ベクトル差2.472747。
- 原の新生点は入力P＋初速N×部分age、vは初速Nのまま。10出生の最大復元差3.29e-9。
  Webは新生点にも全dtの力/抵抗を即適用していた。
- drag5対照の1stepはv'=v×(1−5dt)+(.1,.1,.1)×dt。係数fit .9166666617、定数.0016666668、最大速度fit差5.39e-8。
  P'=P+v'×dt。旧速度による位置更新MAE .00015769に対し、新速度では3.01e-9。
  Webは(v+力×dt)×exp(−5dt)で、抵抗式と外力の適用順が違った。

## 最小修正

`bat-motion.js`に原42入力のbirthと、確認済みのsemi-implicit Eulerを追加。
`app.js`はその関数を使い、新生点に全dtの力/抵抗を適用しない。
出生時刻は従来の固定5/秒を保持して未一致を明示。Force SOP、metaball falloff、乱流は近似のまま。
スプライト/合成/control API/atlasはd4e38b6とbyte不変。slot数や大きさで密集を隠していない。

同じ原新生状態から各IDを追う比較。出生時刻/点選択の誤差を混ぜず、位置更新を評価した。
最大誤差は世界座標のEuclidean距離。原SOPはfloat32、Web計算はfloat64。

| 条件 / 609連続状態 | 位置max修正前 | 位置max修正後 | 速度max修正前 | 速度max修正後 |
|---|---:|---:|---:|---:|
| 外力.1 / drag5 / Force・乱流なし | .01353024 | 1.12853e-7 | .02199352 | 1.14872e-7 |
| 外力.1 / drag0 / Force・乱流なし | 1.00638e-6 | 1.00638e-6 | 3.13844e-7 | 3.13844e-7 |
| 原全力場対Web候補力 | .55495935 | .54760613 | 1.12661684 | 1.12741401 |

**全力場の差は大きい**。この表を元B全体の再現合格と扱わない。
次の一点は、最初の出生位相/部分ageをResetから揃えること。続いて同じ座標/速度でForce SOPの場の方向・強さを切り分ける。

## 証拠と回帰

- `private/timeline-20261012/particle-aligned-step-20261013/capture/`：reset.json、setup.json、particle-delta.ndjson（120行）、finished.json。
- `private/fire-wrap-20261013/particle-stage-comparison.json`：出生step、入力差、修正前後の追跡誤差。
- `tests/b-particle-step.qa.cjs`：原の8step/3出生goldenを実際の生産関数へ渡し11/11。位置max6.02e-9、速度max2.15e-8。
- 既存契約8、ブラウザー入力22、描画12、光/文字/資源12、数値信号6、位相6、保存15、合格。
  0.1.9の通常再起動/旧版更新/物理切断は今回未実行。0.1.8の履歴結果をこの版の実施としない。
- 採取の初回はSOPコピーの外部入力が欠けて対照が0点。次はTOP.allowCooking=FalseがCOMP専用flagで失敗。
  入力を明示接続し、既知のCOMPだけを止めて採取。さらに自動cook前の時計更新へ直し1frameの観測ずれを除いた。
  各試行は別labelに保存。失敗を成功扱いしていない。検証コピーは通常終了、既存TD3936は保持。
- 原safe-bat SHA `0d2264cfdb1919fe8048272cd03165e0a825e8398a96c7732d6391f865eddf9f`不変。
  0.1.8 ZIP SHA `433062e1e2530bd6d3fbc4a86de1b030b3d71efbc15e34bddbfbc485cfcb3c77`保持。

0.1.9 ZIP：212445 bytes / 14files / 13cached assets。
Build `0.1.9-b-particle-step-preview-74459e7637bf`。
SHA256 `d8a55836b1c3c1f41a5104295b3f37686d17b9d782311c8518aa6fe2ab88fb76`。
crc/byte一致は生成時に検証。コード・測定応答の権利を分け、今回の成果を外部へ送信していない。
