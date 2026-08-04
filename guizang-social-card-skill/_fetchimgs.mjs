import { chromium } from "./node_modules/playwright/index.mjs";
const browser = await chromium.launch({ args: ["--use-angle=swiftshader","--enable-unsafe-swiftshader"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
try {
  await page.goto("https://unsplash.com/s/photos/office-desk", { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.waitForTimeout(4000);
  await page.mouse.wheel(0, 1200);
  await page.waitForTimeout(2500);
  const info = await page.evaluate(() => {
    const imgs = [...document.querySelectorAll("img")].slice(0, 10).map(i => ({ src: (i.src||"").slice(0,110), cls: i.className.slice(0,40) }));
    const links = [...document.querySelectorAll("a[href*='/photos/']")].slice(0,5).map(a=>a.href);
    return { title: document.title, imgCount: document.querySelectorAll("img").length, imgs, links };
  });
  console.log(JSON.stringify(info, null, 1));
} catch (e) { console.log("ERR", e.message.slice(0,200)); }
await browser.close();
