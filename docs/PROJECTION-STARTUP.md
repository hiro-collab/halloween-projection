# Projection preparation branding

The projection document shows the owner's approved icon with `mamo presents` on black only during its initial preparation. The one-window comparison app and operator console do not show it. There is no timer, minimum display duration, animation, or wait for the image to decode.

In this app, the initial A frame is prepared before the projection window's Windowed/Fullscreen Start confirmation. At the end of that preparation, the brand is removed and the existing confirmation controls become available. Start itself is not delayed and the brand does not return after Reset, scene changes, or reconnect. A fast machine may never visibly paint the brand.

The wording lives in the single `#projection-brand-name` paragraph in `web/index.html`. It can be changed later to the owner's chosen wording; the current instruction remains `mamo presents`.

A failed application-script load exposes a reload message instead of leaving an endless brand screen. A missing icon does not hold the projection. The image and its source record are included in the static package and opt-in offline cache; no profile image is fetched from the internet at runtime.

The JPEG is the exact user-confirmed Qiita/Twitter distribution image, 359×359 and12,302bytes. A byte-identical copy was found in the user's local Twitter export. It is not described as a high-resolution camera original. See `web/assets/MAMO-ICON-SOURCE.txt` and `web/RIGHTS.txt` for its separate branding permission and source identity.

## 日本語

投影窓を開いた直後の実準備中だけ、本人が確認したアイコンと `mamo presents` を黒背景に表示します。準備完了で既存の全画面／ウィンドウ開始確認へ移り、開始後の映像へブランド表示の待ち時間は足しません。速い環境では一瞬、または見えない場合があります。文字は `web/index.html` の1か所で差し替えられます。

既存のキー、文字送り、頭数調整、描画エンジン、モデルは変更していません。今回も公開main・Release・既存v0.1.55 ZIPを更新しません。
