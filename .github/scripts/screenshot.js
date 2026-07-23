// Screenshot the built front page at a desktop and a mobile viewport.
// Run after the site is being served on http://localhost:8080/.
const { chromium } = require('playwright');

const URL = 'http://localhost:8080/';
const OUT = 'screenshots';

// Desktop is captured full-page (wide aspect, stays reasonable). Mobile is
// captured at viewport height only: a full-page mobile shot is a ~390x9000
// sliver that renders as a giant, out-of-proportion strip in the PR comment.
// A single phone screen is the representative "how does it look on mobile" view.
async function shoot(browser, name, viewport, mobile, fullPage) {
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: mobile ? 2 : 1,
    isMobile: mobile,
    hasTouch: mobile,
  });
  const page = await context.newPage();
  // The page pulls the Podlove player + some analytics from CDNs and polls a
  // live-status endpoint that 404s locally, so 'networkidle' may never settle.
  // Wait for the DOM, then give assets/fonts a moment to paint.
  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(3500);
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage });
  await context.close();
}

(async () => {
  const fs = require('fs');
  fs.mkdirSync(OUT, { recursive: true });

  const browser = await chromium.launch();
  await shoot(browser, 'desktop', { width: 1280, height: 900 }, false, true);
  await shoot(browser, 'mobile', { width: 390, height: 844 }, true, false);
  await browser.close();

  console.log('Screenshots written to', OUT);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
