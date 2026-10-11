import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { chromium } from '@playwright/test';

let server, browser, base;
const routes = ['/', '/en/', '/privacy-policy/', '/en/privacy-policy/'];
before(async () => {
  server = createServer(async (req, res) => {
    const path = new URL(req.url, 'http://localhost').pathname;
    const file = join('dist', path.endsWith('/') ? `${path}index.html` : path);
    try {
      const body = await readFile(file);
      res.setHeader('Content-Type', ({ '.html': 'text/html', '.css': 'text/css', '.webp': 'image/webp' })[extname(file)] || 'application/octet-stream');
      res.end(body);
    } catch { res.writeHead(404).end(); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch();
});
after(async () => {
  await browser?.close();
  await new Promise(resolve => server?.close(resolve));
});
for (const route of routes) {
  test(`${route}: metadata, WebP, GA and navigation`, async () => {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('https://www.googletagmanager.com/**', r => r.fulfill({ body: '' }));
    assert.equal((await page.goto(base + route)).status(), 200);
    const lang = route.startsWith('/en/') ? 'en' : 'es';
    assert.equal(await page.locator('html').getAttribute('lang'), lang);
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), `https://www.businesssuiteskepler.com${route}`);
    assert.equal(await page.locator('link[hreflang]').count(), 3);
    assert.ok(await page.locator('meta[name="description"]').getAttribute('content'));
    const configs = await page.evaluate(() => window.dataLayer.map(item => Array.from(item)).filter(item => item[0] === 'config'));
    assert.deepEqual(configs, [['config', 'G-BQ28GN72RB']]);
    assert.equal(await page.locator('script[src*="gtag/js"]').count(), 1);
    await page.evaluate(async () => {
      for (const image of document.images) { image.loading = 'eager'; await image.decode(); }
    });
    for (const image of await page.locator('img').evaluateAll(nodes => nodes.map(img => ({
      src: img.currentSrc, width: img.naturalWidth, alt: img.alt,
      dimensions: img.hasAttribute('width') && img.hasAttribute('height'),
    })))) {
      assert.match(image.src, /\.webp$/);
      assert.ok(image.width > 0 && image.alt && image.dimensions);
    }
    assert.match(await page.locator('meta[property="og:image"]').getAttribute('content'), /\.webp$/);
    const menu = page.locator('.menu-button');
    await menu.click();
    assert.equal(await menu.getAttribute('aria-expanded'), 'true');
    assert.equal(await menu.textContent(), lang === 'es' ? 'Cerrar' : 'Close');
    await page.keyboard.press('Escape');
    assert.equal(await menu.getAttribute('aria-expanded'), 'false');
    await page.evaluate(() => { window.location.hash = '#suites'; });
    const switcher = page.locator(`.language-switch a[hreflang="${lang === 'es' ? 'en' : 'es'}"]`);
    await switcher.evaluate(link => link.addEventListener('click', event => event.preventDefault()));
    await switcher.click();
    assert.match(await switcher.getAttribute('href'), /#suites$/);
    await page.setViewportSize({ width: 1440, height: 1000 });
    assert.equal(await page.locator('.nav').isVisible(), true);
    const booking = await page.locator('a[href*="hotels.cloudbeds.com"]').first().getAttribute('href');
    assert.ok(booking.includes(`/${lang}/reservation/`));
    assert.deepEqual(errors, []);
    await page.close();
  });
}
