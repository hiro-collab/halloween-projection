[日本語](README.md)

# Bring Halloween to walls and floors with your keyboard

Project skulls and bats onto walls or floors, and change motion, color and text with your keyboard.

**[Download the application ZIP](https://github.com/hiro-collab/halloween-projection/releases/download/v0.1.60/halloween-projection-web-v0.1.60-bone-whiteness.zip)** · Windows / Chrome. Extract All, then open `はじめに_START-HERE.html` in Chrome.

*The photos show projections made with the TouchDesigner version, adapted for each setting. You can use this app in the same way to project skulls and bats onto the walls and floors around you.*

<img src="./docs/images/td-projection-gallery-mobile-en-caption.svg" width="440" alt="Three real projections from the earlier TouchDesigner version: Santa-hat skulls at Shibuya Blue Cave, an indoor skull projection, and bats at Osaki Station, with the ground and surroundings visible.">

## Shape the scene with your keyboard

<img src="docs/images/how-it-works.jpg" width="760" alt="Illustration of a standing party guest using a compact wireless keyboard, holding a drink and talking with friends while Halloween visuals are projected onto a wall.">

*Using a keyboard to control the projection. This is an explanatory illustration; see the browser captures below for the actual visuals.*

- **Project skulls and bats** — turn walls and floors into a Halloween scene.
- **Change motion and color live** — use your keyboard to match the mood.
- **Add your own words** — put a greeting or event name into the visuals.

## Switch between two visuals

Press **Z** to switch between skulls and bats.

### Skulls: three heads turning independently

![Actual browser capture with strong motion: three skulls face forward, sideways and at an angle.](docs/images/halloween-preview.jpg)

A capture with motion set high. Each skull turns independently, revealing the model from the side and at different angles.

The skull uses CDmir’s “[Human Skull](https://opengameart.org/content/human-skull-0)” 3D model. Thank you for making it available.

### Bats: change their motion and color

![Actual browser capture of pink bats flying around Halloween text.](docs/images/bats-preview.jpg)

Change the movement and color of the flapping bats while projecting. Both images above are captures of the browser app.

### A keyboard demonstration

![Real-time demo: rotating skulls, Z switches to bats, and T and I change their color.](docs/media/halloween-demo.gif)

About 20 seconds, without audio: rotating skulls → **Z** to switch → bat motion and **T / I** color changes. Recorded at its actual speed. The GIF loops. [View or save the higher-quality MP4](docs/media/halloween-demo.mp4).

## Try it

### What you need

- A PC and projector, a video cable between them (HDMI in the illustration), and an adapter if their ports require one.
- Power for the PC and projector, plus a wall or screen suitable for projection.
- An external keyboard is optional; the PC's built-in keyboard also works. A portable battery and suitcase are optional too.

To try it with just a PC, arrange the console and projection windows side by side on the same screen and choose **Start windowed** in the projection window.

### Set up the PC and projector

Keep the laptop lid open. The **PC shows the console; the projector shows the separate projection window**.

<img src="docs/images/pc-projector-setup.png" width="760" alt="An open laptop shows the operator console. An HDMI cable connects the PC to a projector showing separate visuals. An optional external keyboard connects to the PC. The displays use extended desktop.">

*An illustration of connections and window placement; the controls and visuals are illustrative. Windows display numbers and main/secondary roles do not need to be fixed.*

1. Connect the projector to the PC. Press **Win + P** and choose **Extend**. Connect any external keyboard to the same PC.
2. **Extract All** from the application ZIP. Open `はじめに_START-HERE.html` in Chrome, choose **English**, then **Start the projection**.
3. On the PC console, click **Open projection window**. Drag the new window by its top title bar onto the projector display; leave the console on the PC.
4. When preparation finishes, click **Start fullscreen** in the projection window's central **Prepare projection window** panel. Then return to the PC console, prepare the text and click **Enable keys**. Keep that console selected while playing.

**Fullscreen and key input:** Use the app's button for fullscreen; Chrome's F11 is a different control. To leave fullscreen, click the projection window and press `Esc`. In the console, `Esc` disables performance keys while visuals continue. Switching apps/windows or selecting a text field also disables keys. Return to the PC console and click **Enable keys** again.

**Power and lid:** Check Windows power settings beforehand so sleep or screen-off does not interrupt use. Closing the lid may cause sleep or a display change. Closed-lid operation depends on the laptop, power settings and display configuration. It is untested and not guaranteed for this app.

### This is the operator console

<img src="docs/images/operator-controls-v57-ja.png" width="760" alt="Actual public v0.1.57 operator console: enable/disable keys and pause buttons, keyboard rows, and motion, hue and text-size selectors and sliders. Japanese UI is shown.">

*Actual v0.1.57 key controls and main sliders, captured before connecting the projection window. Japanese UI is shown; choose English in the console to switch languages. Open the image to view it at full size.*

<details>
<summary>Download and start projecting in three steps</summary>

**[Download the application ZIP](https://github.com/hiro-collab/halloween-projection/releases/download/v0.1.60/halloween-projection-web-v0.1.60-bone-whiteness.zip)** · Windows / Chrome. Extract All, then open `はじめに_START-HERE.html` in Chrome.

<!-- RELEASE_DOWNLOAD_URL: https://github.com/hiro-collab/halloween-projection/releases/download/v0.1.60/halloween-projection-web-v0.1.60-bone-whiteness.zip -->

### Start in three steps

Tested with **Windows and Chrome**. Prepare the projector connection and display arrangement in Windows first. No extra software or command-line setup is needed.

1. **Extract the entire ZIP.** Right-click it and choose **Extract All**. Keep the folder together.
2. **Open the entry page.** In Chrome, open `はじめに_START-HERE.html`, choose **English**, then **Start the projection**.
3. **Start the projection window.** Choose **Open projection window**, move that window to the projector display, and click **Start windowed** or **Start fullscreen**. Return to the console, prepare your text, then choose **Enable keys**.

Keep both windows open. Once extracted, the complete folder can run offline.

While the projection window prepares, it shows mamo's icon and **mamo presents** on black. No minimum display time is added; fast preparation may finish before the brand becomes visible.

</details>

## Control it with your keyboard

<img src="docs/images/keyboard-keys-en.svg" width="440" alt="Motion: 1 to 8. Color: Q W E R T Y U I. Text size: A S D F G H J K.">

Choose **Enable keys**, then keep the console selected. Use Latin keys without Shift.

| Key | Action |
| --- | --- |
| `1`–`8` | Choose one of eight motion intensities |
| `Q W E R T Y U I` | Choose a hue |
| `O` | Add 25 percentage points to skull bone whiteness; 100% wraps to 0%. Fine-tune with the slider |
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

Use `Space` to pause motion. To blank the image, open **Output, stop & exit** and select **Stop & release**; select **Resume** to return. `Esc` stops keyboard controls while the visuals continue.

Start with reduced projector brightness and a small window. Avoid directing the beam into people's eyes, and consider viewers sensitive to bright, rapidly changing imagery. Follow your projector's placement and ventilation instructions.

How dark the black background appears and how bright the image looks depend on the projector, surface and ambient light. Try adjusting color, motion and text size with the keyboard to suit the appearance and mood on the spot.

## Pair it with a portable projection setup

A PC and projector on a table are enough for the standard setup. For travel, a suitcase, portable power supply, tripod and projector can form a portable setup for an outdoor party, band performance or Halloween event. A suitcase or dedicated portable kit is optional for this app.

Outdoor use depends on sufficient darkness, a suitable projection surface, venue permission and a safe place to secure the equipment and keep walking routes clear.

For the equipment and assembly, see [mamo's portable outdoor projector setup guide on Qiita (in Japanese)](https://qiita.com/moma42105016/items/85e66a60eb7b656c819c).

<img src="docs/images/portable-projection.jpg" width="760" alt="Illustration of a silver suitcase, folded tripod and projector used while stationary at a nighttime venue.">

*An illustrative use scene with a portable setup placed at a venue. It is not an assembly guide or an exact view of how equipment is packed.*

## Tested and required environment

| Item | Tested scope and conditions |
| --- | --- |
| Tested | Application-ZIP startup, controls and offline saving have been checked with **Windows and Chrome**. This does not guarantee operation on every PC or physical projector. |
| Standard skull rendering | **WebGL2** and `OES_texture_float_linear` (floating-point texture filtering) must be available to the browser. GPU fluid processing also uses `EXT_color_buffer_float` (floating-point render targets). Availability depends on the GPU, driver and browser combination. |
| Fallback | The fluid implementation can switch to CPU processing when GPU fluid is unavailable, but identical appearance or speed is not guaranteed. |
| Untested | Ubuntu/Linux, macOS and other operating systems, and Edge, Firefox and Safari, are untested. On Ubuntu/Linux the entry HTML is also intended to be opened in a browser, without a Windows-only launcher, but it has not been tested on a physical Linux machine. |
| GPU and memory baseline | No minimum GPU model or memory capacity has been measured. Try launching the app and using its keys on your PC and browser, and check how smoothly it runs. |

### Features not currently provided

Automatic display placement, keystone correction and phone control are not provided.

For equipment, extended desktop, the PC-side console and open-lid operation, see **What you need** and **Set up the PC and projector** above.

## Modifications, support and projection precautions

You are welcome to make your own modifications. I do not take on individual modification requests or provide help with operating the app. Operation is not guaranteed; please check beforehand that the app launches and responds to controls on your PC and browser. Obtain permission for the projection location, keep the light away from people's eyes and vehicles, and consider people who are sensitive to flashing or bright imagery.

## License and personal changes

The author’s code, bat artwork and data used to reproduce movement and appearance use the **MIT license**. CDmir’s “Human Skull” 3D model uses **CC0 1.0**. See [LICENSE](LICENSE) and the [asset-specific terms](web/RIGHTS.txt).

The keyboard-use and portable-setup illustrations were generated for this README. The opening projection photographs, browser captures and CDmir’s 3D model are separate materials. The projection photographs and explanatory illustrations are not included under the MIT or CC0 grants above.

<details>
<summary>Change the appearance or wording</summary>

See the [developer guide (Japanese)](docs/DEVELOPMENT.md) for the code map, value flow, packaging and validation steps.

The ZIP includes editable HTML, CSS and JavaScript. In `アプリ本体/`, `console.html` / `console.css` control the console, and `GUIDE.html` / `guide.css` provide the guide. Edit the text or styles and reload to check ordinary changes.

Replacing an image also requires updating its embedded image data. See the [editing guide](web/README.txt).

GitHub’s **Code → Download ZIP** provides the source tree with a different layout. Extract it and open the root `START-HERE.html` to try it.

</details>
