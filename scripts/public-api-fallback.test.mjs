import test from 'node:test';
import assert from 'node:assert/strict';

import { fetchJsonWithFallbacks, getApiBaseCandidates } from '../src/services/apiClient.mjs';

test('getApiBaseCandidates prefers local proxy and keeps hosted fallback for localhost', () => {
  assert.deepEqual(
    getApiBaseCandidates({
      hostname: 'localhost',
      publicFallbackBaseUrl: 'https://api.mrija.no',
    }),
    ['', 'http://localhost:8080', 'https://api.mrija.no']
  );
});

test('fetchJsonWithFallbacks retries the next base after a network failure', async () => {
  const calls = [];
  const payload = { ok: true };

  const fetchImpl = async (url) => {
    calls.push(url);

    if (url === '/api/public/registrations') {
      throw new TypeError('Failed to fetch');
    }

    return {
      ok: true,
      json: async () => payload,
    };
  };

  const response = await fetchJsonWithFallbacks({
    path: '/api/public/registrations',
    baseUrls: ['', 'https://api.mrija.no'],
    fetchImpl,
  });

  assert.deepEqual(response, payload);
  assert.deepEqual(calls, [
    '/api/public/registrations',
    'https://api.mrija.no/api/public/registrations',
  ]);
});

test('fetchJsonWithFallbacks does not retry validation errors', async () => {
  let calls = 0;

  const fetchImpl = async () => {
    calls += 1;
    return {
      ok: false,
      status: 400,
      json: async () => ({ error: 'Invalid registration payload.' }),
    };
  };

  await assert.rejects(
    fetchJsonWithFallbacks({
      path: '/api/public/registrations',
      baseUrls: ['', 'https://api.mrija.no'],
      fetchImpl,
    }),
    /Invalid registration payload\./
  );

  assert.equal(calls, 1);
});
