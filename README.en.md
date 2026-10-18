[日本語](README.md)

# Halloween Projection

Halloween visual effects on a black background for a projector. Change motion, color and text from your keyboard while the projection runs.

Switch between animated skulls with a flowing background and a flock of bats around your text. Keep the controls on your computer and send a separate window to the projector.

![Browser version screenshots: a skull with a flowing background on the left, and bats with Halloween text on the right.](docs/images/halloween-preview.jpg)

*Browser version screenshots, not a photograph of a physical projection.*
<!-- DEMO_VIDEO_URL: Add only after playback is verified on GitHub. Do not use a private Library URL or a local path. -->
<!-- TD_PROJECTION_EXAMPLE: If approved footage is added later, label it "Projection example made with the TouchDesigner version" and distinguish it from browser screenshots. -->

## Download

**The application ZIP is being prepared for release. There is no published Release or public download link yet.**

The verified package is named `halloween-projection-web-v0.1.55-jaw-edge-preview.zip`. Its download link will go here after publication.
<!-- RELEASE_DOWNLOAD_URL: After publishing an approved Release with the verified application ZIP attached, replace the notice above with its actual link. The automatic Source code ZIP is a different package. -->

## Start in three steps

Tested with **Windows and Chrome**. Prepare the projector connection and display arrangement in Windows first. No extra software or command-line setup is needed.

1. **Extract the entire ZIP.** Right-click it and choose **Extract All**. Keep the folder together.
2. **Open the entry page.** In Chrome, open `はじめに_START-HERE.html`, choose **English**, then **Start the projection**.
3. **Start the projection window.** Choose **Open projection window**, move that window to the projector display, and click **Start windowed** or **Start fullscreen**. Return to the console, prepare your text, then choose **Enable keys**.

Keep both windows open. Once extracted, the complete folder can run offline.

## Play from the keyboard

Use Latin keys without Shift while the console has focus.

| Key | Action |
| --- | --- |
| `1`–`8` | Choose one of eight motion intensities |
| `Q W E R T Y U I` | Choose a hue |
| `A S D F G H J K` | Choose a text size |
| `Z` | Switch skulls / bats |
| `X` | Cycle normal / horizontal flip / vertical flip / both |
| `L` / `M` | Choose jaw width / open or close the jaw |
| `Space` | Pause / resume the whole image |
| `Esc` | Disable performance keys; the image continues |

Edit the words in the console text box. `9` / `0` selects 1–6 skulls; `C` returns a manual jaw to automatic motion. The complete key guide is `アプリ本体/GUIDE.html` in the extracted package.

<details>
<summary>More controls, recovery and exit</summary>

- Text fields, IME and window changes disable performance keys. Return to the console and choose **Enable keys** again.
- If disconnected, choose **Reconnect to projection**. If the projection window was closed, open a new one.
- Hold `N` for 0.6 seconds to reset the simulation while retaining text and settings. Hold `B` for 0.6 seconds to restore a previously saved baseline.
- At 0% motion, skull heads return to rest; bats keep flapping. Use `Space` to pause everything.
- To finish, open **Output, stop & exit → End projection**. Closing the projection window resets text, settings and the baseline.
- The language switch changes UI text without translating your projected words.

</details>

## Before projecting

Start with reduced projector brightness and a small window. Avoid directing the beam into people's eyes, and consider viewers sensitive to bright, rapidly changing imagery. Follow your projector's placement and ventilation instructions.

How dark the black background appears depends on the projector, surface and ambient light. Automatic display placement, keystone correction and phone control are not provided. Check physical projector setups and other computers before use.

## License and editing

Own code, the owner-created bat artwork and sampled/validation values are **MIT licensed**. The third-party **CDmir / Human Skull** model retains **CC0 1.0**. See [LICENSE](LICENSE) and the [asset notices](web/RIGHTS.txt).

<details>
<summary>Edit the application or work from source</summary>

The ZIP contains editable HTML, CSS and JavaScript. In `アプリ本体/`, edit `console.html` / `console.css` for the console, `GUIDE.html` / `guide.css` for help, and `i18n.js` for UI translations. Ordinary text and style changes need an editor and reload.

Images are also embedded and hash-checked; replacing only the PNG is insufficient. See the [editing notes](web/README.txt) and [asset provenance](docs/PUBLIC-READINESS.md).

GitHub's **Code → Download ZIP** downloads the source repository, which has a different layout. Extract it and open its root `START-HERE.html`; normal use still needs no build. Packaging tools and historical validation records are developer material; `app/` is an older Windows prototype.

Current verification: [v55 release record](releases/v55.json). Earlier development notes remain under `docs/` and `releases/`.

</details>
