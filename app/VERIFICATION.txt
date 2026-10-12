# 検証範囲
現在の実装はv0.1技術仮版。原作A/B・3D頭/下顎・流体・分離APIは未実装で、合格に含めない。

保存済みv0.1検証: 本体19/19、ZIP展開9/9、最終ZIP6/6。
300切替でnative RAF最大1・listener20一定。Stopでeffect/RAF0、canvas1×1。
日本語240字、1366×768/1920×1080/360×640、全画面/Esc・パネル非表示を確認。
非localhost遮断の再読込と読込後offline操作を確認。
GC後heap増24,472 bytesは観測値で、長時間/GPU漏れなしの証明ではない。
Windows11 Home10.0.26300 / PowerShell5.1.26100.9444 / 試験Chromium154.0.8037.98。

未試験: 原作映像一致・新API・実投影・通常Explorer/既定ブラウザ操作・別PC・製品版Chrome/Edge・
物理ネット切断・file://・長時間。画面画像と生ログはGitへ含めない。
