---
name: screenshot-hd
description: Capture sharp, browser-chrome-free Playwright screenshots of web pages at the native iPhone 15 Pro Max viewport and device-pixel density, without a phone mockup or shell. Use when the user requests iPhone 15 Pro Max screenshots, high-resolution mobile UI inspection, reference screenshots, or visual regression artifacts.
---

# Screenshot HD

Capture the page itself with Playwright at the iPhone 15 Pro Max profile. Keep the output free of browser chrome and device-frame decoration.

## Fixed Capture Profile

Use the bundled Playwright context configuration at `assets/iphone-15-pro-max.json` and the `--hires` screenshot option. The config encodes the iPhone 15 Pro Max viewport, density, mobile behavior, touch support, and user agent without relying on a CLI window resize.

- CSS viewport: `430 x 932`
- Device scale factor: `3`
- Expected viewport PNG: `1290 x 2796`
- Orientation: portrait
- Default capture: viewport only, not full page
- Output: PNG unless the user explicitly requests another format

Treat "4K clarity" as high-density native device-pixel output. Do not upscale the page to `3840` pixels and do not add a phone shell, bezel, shadow, rounded mask, or background mockup. The native output is sharper and preserves the actual phone aspect ratio.

## Capture Workflow

1. Check that `npx` is available. Use `@playwright/cli` through `npx` when no project-local Playwright CLI is available.
2. Resolve the target URL, required local dev server, authentication state, and output path before opening the browser. Keep screenshots in the requested output directory or the repository's existing artifact directory.
3. Open a named session with the bundled iPhone 15 Pro Max context configuration. Replace `<skill-root>` with the absolute global skill directory:

   ```powershell
   npx --yes --package @playwright/cli playwright-cli --session screenshot-hd open --config "<skill-root>\assets\iphone-15-pro-max.json" "<URL>"
   ```

   Use `--browser webkit` when the user asks for Safari/iOS rendering. Otherwise preserve the repository's existing browser choice. Do not add `--device` to this command because some CLI versions override the configured height with their desktop window height.
4. Inspect the page with `snapshot` and confirm that the page, route, and major visual content loaded. Re-snapshot after any navigation or significant interaction.
5. Wait for visual stability before capturing. Prefer these explicit Playwright evaluations, then wait for any page-specific data or animation to settle:

   ```powershell
   npx --yes --package @playwright/cli playwright-cli --session screenshot-hd eval "document.fonts.ready.then(() => true)"
   npx --yes --package @playwright/cli playwright-cli --session screenshot-hd eval "new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve(true))))"
   ```

   For animated pages, pause or finish the relevant animation only when doing so reflects the requested state. Do not hide page content merely to make a screenshot pass.
6. Capture the viewport at device-pixel density:

   ```powershell
   npx --yes --package @playwright/cli playwright-cli --session screenshot-hd screenshot --filename "<absolute-output-path>.png" --hires
   ```

   Add `--full-page` only when the user explicitly requests a complete scrolling-page artifact. A full-page image will be taller than the iPhone viewport and therefore will not be `1290 x 2796`.
7. Verify the artifact exists, is a PNG, and has the expected width. For the default viewport capture, confirm `1290 x 2796`; investigate any other size before reporting success. Close the named session after the artifact is verified:

   ```powershell
   npx --yes --package @playwright/cli playwright-cli --session screenshot-hd close
   ```

## Fidelity Rules

- Capture the web page, never a manually drawn phone frame or a screenshot embedded in a mockup.
- Preserve the device profile's mobile user agent, touch behavior, viewport, and pixel density.
- Do not use CSS transforms, browser zoom, image resizing, or post-processing to simulate sharpness.
- Wait for fonts, images, lazy-loaded sections, and route data that are part of the requested view.
- Keep cookie banners, chat widgets, and other page UI unless the user explicitly asks to remove them; they are page content, not a device shell.
- Use `--headed` for a visual debugging pass when needed, but the saved screenshot must still come from the Playwright screenshot command.
- Prefer a fresh named session for each independent capture so cookies, viewport state, and stale pages do not leak between screenshots.

## Troubleshooting

Use the bundled `assets/iphone-15-pro-max.json` with `open ... --config` rather than switching to a generic mobile preset. Check the live dimensions with `eval "JSON.stringify({width: innerWidth, height: innerHeight, dpr: devicePixelRatio})"` before capturing. If the browser binary is missing, install only the required browser with `playwright-cli install-browser chromium` and retry.
