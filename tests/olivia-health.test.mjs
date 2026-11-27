import { test } from 'node:test';
import assert from 'node:assert/strict';
import { engineAvailable } from '../infrastructure/olivia/health.mjs';

test('gateway health fails when the private Olivia engine is stopped or unhealthy', async () => {
  const saved = globalThis.fetch;
  try {
    globalThis.fetch = async () => { throw new TypeError('fetch failed'); };
    assert.equal(await engineAvailable(), false);
    globalThis.fetch = async () => new Response('', { status: 503 });
    assert.equal(await engineAvailable(), false);
    globalThis.fetch = async () => Response.json({ status: 'unavailable' });
    assert.equal(await engineAvailable(), false);
    globalThis.fetch = async () => new Response('<html>proxy error</html>');
    assert.equal(await engineAvailable(), false);
  } finally { globalThis.fetch = saved; }
});

test('gateway health checks the private engine with a bounded timeout', async () => {
  const saved = globalThis.fetch;
  try {
    globalThis.fetch = async (url, options) => {
      assert.equal(url, 'http://olivia-v3:8093/health');
      assert.ok(options.signal instanceof AbortSignal);
      return Response.json({ status: 'ok' });
    };
    assert.equal(await engineAvailable(), true);
  } finally { globalThis.fetch = saved; }
});
