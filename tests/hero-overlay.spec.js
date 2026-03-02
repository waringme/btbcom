/**
 * Hero overlay: picture must remain visible with overlay applied.
 * Run: node tests/hero-overlay.spec.js (uses Playwright from project)
 */
const { chromium } = require('playwright');

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });

    const hero = page.locator('.hero.block.overlay').first();
    await hero.waitFor({ state: 'visible', timeout: 5000 });

    const heroPicture = hero.locator('picture');
    const pictureVisible = await heroPicture.isVisible();
    if (!pictureVisible) throw new Error('Hero picture is not visible');

    const heroImg = hero.locator('picture img');
    const imgVisible = await heroImg.isVisible();
    if (!imgVisible) throw new Error('Hero img is not visible');

    const box = await heroImg.boundingBox();
    if (!box || box.width <= 0 || box.height <= 0) {
      throw new Error(`Hero img has no size: ${JSON.stringify(box)}`);
    }

    const naturalWidth = await heroImg.evaluate((el) => el.naturalWidth);
    if (naturalWidth <= 0) throw new Error('Hero img naturalWidth is 0');

    console.log('OK: Hero overlay block present, picture visible and has dimensions');
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
