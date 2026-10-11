import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { chromium } from '@playwright/test';

let server, browser, base;
const pairs = [
  ['/', '/en/'], ['/privacy-policy/', '/en/privacy-policy/'],
  ['/ubicacion/', '/en/location/'],
  ['/habitaciones/grand-suite/', '/en/rooms/grand-suite/'],
  ['/habitaciones/king/', '/en/rooms/king/'],
  ['/habitaciones/queen/', '/en/rooms/queen/'],
];
const routes = pairs.flat();
const domain = 'https://www.businesssuiteskepler.com';
const titles = new Set(), descriptions = new Set();
before(async () => {
  server = createServer(async (req, res) => {
    const path = new URL(req.url, 'http://localhost').pathname;
    const file = join('dist', path.endsWith('/') ? `${path}index.html` : path);
    try {
      const body = await readFile(file);
      res.setHeader('Content-Type', ({ '.html': 'text/html', '.css': 'text/css', '.webp': 'image/webp', '.xml': 'application/xml', '.txt': 'text/plain' })[extname(file)] || 'application/octet-stream');
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
    page.on('response', response => {
      if (response.url().startsWith(base) && response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
    });
    page.on('pageerror', error => errors.push(error.message));
    await page.route('https://www.googletagmanager.com/**', r => r.fulfill({ body: '' }));
    assert.equal((await page.goto(base + route)).status(), 200);
    const lang = route.startsWith('/en/') ? 'en' : 'es';
    assert.equal(await page.locator('html').getAttribute('lang'), lang);
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), `https://www.businesssuiteskepler.com${route}`);
    assert.equal(await page.locator('link[hreflang]').count(), 3);
    const title = await page.title();
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    assert.ok(description);
    assert.ok(!titles.has(title), `Duplicate title: ${title}`);
    assert.ok(!descriptions.has(description), `Duplicate description: ${description}`);
    titles.add(title); descriptions.add(description);
    const pair = pairs.find(pair => pair.includes(route));
    const otherRoute = pair[lang === 'es' ? 1 : 0];
    for (const [language, path] of [['es', pair[0]], ['en', pair[1]], ['x-default', pair[0]]]) {
      assert.equal(await page.locator(`link[hreflang="${language}"]`).getAttribute('href'), domain + path);
    }
    assert.equal(await page.locator('.language-switch a[aria-current="page"]').getAttribute('hreflang'), lang);
    assert.equal(await page.locator(`.language-switch a[hreflang="${lang === 'es' ? 'en' : 'es'}"]`).getAttribute('href'), otherRoute);
    const schemas = await page.locator('script[type="application/ld+json"]').evaluateAll(nodes => nodes.map(node => JSON.parse(node.textContent)));
    if (!route.includes('privacy-policy')) {
      const nodes = schemas.flatMap(schema => schema['@graph'] || [schema]);
      const hotel = nodes.find(node => node['@type'] === 'Hotel');
      assert.ok(hotel, 'Missing Hotel schema');
      assert.equal(hotel.address.postalCode, '11590');
      assert.equal(hotel.address.addressCountry, 'MX');
      assert.equal(hotel.telephone, '+525536668535');
      assert.ok(hotel.geo.latitude > 19.43 && hotel.geo.latitude < 19.44);
      assert.ok(hotel.geo.longitude > -99.19 && hotel.geo.longitude < -99.18);
      assert.equal(hotel.numberOfRooms, 13);
      assert.ok(!hotel.aggregateRating && !hotel.offers);
      if (route.includes('/habitaciones/') || route.includes('/rooms/')) {
        const room = nodes.find(node => node['@type'] === 'HotelRoom');
        assert.ok(room && room.containedInPlace['@id'] === hotel['@id']);
        assert.equal(room.floorSize.unitCode, 'MTK');
        if (route.includes('grand-suite')) {
          assert.equal(room.floorSize.minValue, 80); assert.equal(room.floorSize.maxValue, 95);
        } else assert.equal(room.floorSize.value, route.includes('king') ? 30 : 27);
        const breadcrumbs = nodes.find(node => node['@type'] === 'BreadcrumbList');
        assert.equal(breadcrumbs.itemListElement.at(-1).item, domain + route);
        assert.equal(await page.locator('.room-pair a.arrow-link').count(), 2);
      } else {
        assert.match(await page.locator('h1').innerText(), /Polanco/);
        for (const paths of pairs.slice(3)) {
          assert.ok(await page.locator(`main a[href="${paths[lang === 'es' ? 0 : 1]}"]`).count() >= 1);
        }
      }
    }
    if (route === '/ubicacion/' || route === '/en/location/') {
      const body = await page.locator('main').innerText();
      for (const landmark of ['Kepler 147', 'Mariano Escobedo 425', 'Marina Nacional 329', 'Chapultepec']) {
        assert.ok(body.includes(landmark), `Missing location reference: ${landmark}`);
      }
      assert.doesNotMatch(body, /Ángel de la Independencia|Zona Rosa/);
      for (const roomPair of pairs.slice(3)) {
        assert.equal(await page.locator(`main a[href="${roomPair[lang === 'es' ? 0 : 1]}"]`).count(), 1);
      }
    }
    // Check all initial internal links and their section targets before click handlers mutate them.
    const links = await page.locator('a[href]').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')));
    for (const href of new Set(links)) {
      const url = new URL(href, base + route);
      if (url.origin !== base) continue;
      assert.ok(routes.includes(url.pathname), `Unknown route ${href} on ${route}`);
      if (url.hash) {
        const targetHtml = await readFile(join('dist', url.pathname, 'index.html'), 'utf8');
        assert.ok(targetHtml.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `Missing anchor ${href}`);
      }
    }
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
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
      assert.equal(overflow, false, `Horizontal overflow on ${route} at ${width}px`);
    }
    assert.equal(await page.locator('.nav').isVisible(), true);
    const booking = await page.locator('a[href*="hotels.cloudbeds.com"]').first().getAttribute('href');
    assert.ok(booking.includes(`/${lang}/reservation/`));
    assert.deepEqual(errors, []);
    await page.close();
  });
}

test('robots and XML sitemap list every canonical page with reciprocal language alternates', async () => {
  const robots = await fetch(base + '/robots.txt');
  assert.equal(robots.status, 200);
  const text = await robots.text();
  assert.match(text, /User-agent: \*/);
  assert.match(text, /Allow: \//);
  assert.ok(text.includes(`Sitemap: ${domain}/sitemap.xml`));
  const response = await fetch(base + '/sitemap.xml');
  assert.equal(response.status, 200);
  const xml = await response.text();
  const page = await browser.newPage();
  const entries = await page.evaluate(xml => {
    const doc = new DOMParser().parseFromString(xml, 'application/xml');
    if (doc.querySelector('parsererror')) throw new Error('Invalid sitemap XML');
    return [...doc.getElementsByTagNameNS('http://www.sitemaps.org/schemas/sitemap/0.9', 'url')].map(url => ({
      loc: url.getElementsByTagNameNS('http://www.sitemaps.org/schemas/sitemap/0.9', 'loc')[0].textContent,
      alternates: [...url.getElementsByTagNameNS('http://www.w3.org/1999/xhtml', 'link')].map(link => [link.getAttribute('hreflang'), link.getAttribute('href')]),
    }));
  }, xml);
  assert.deepEqual(entries.map(entry => entry.loc).sort(), routes.map(path => domain + path).sort());
  for (const entry of entries) {
    const pair = pairs.find(pair => pair.some(path => domain + path === entry.loc));
    assert.deepEqual(entry.alternates, [['es', domain + pair[0]], ['en', domain + pair[1]], ['x-default', domain + pair[0]]]);
  }
  await page.close();
});
