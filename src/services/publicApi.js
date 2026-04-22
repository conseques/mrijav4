import { fallbackPastEvents, fallbackUpcomingEvents } from '../content/publicContentFallbacks';
import { fetchJsonWithFallbacks, getApiBaseCandidates } from './apiClient.mjs';

const configuredBaseUrl = String(import.meta.env.VITE_BACKEND_URL || '')
  .trim()
  .replace(/\/$/, '');
const baseUrls = getApiBaseCandidates({
  configuredBaseUrl,
  hostname: typeof window !== 'undefined' ? window.location.hostname : '',
});

async function apiFetch(path, options = {}) {
  return fetchJsonWithFallbacks({
    path,
    baseUrls,
    options,
  });
}

export function fetchPublicEvents() {
  return apiFetch('/api/public/events').catch((error) => {
    console.warn('Falling back to bundled upcoming events:', error);
    return { items: fallbackUpcomingEvents };
  });
}

export function fetchPublicPastEvents() {
  return apiFetch('/api/public/past-events').catch((error) => {
    console.warn('Falling back to bundled past events:', error);
    return { items: fallbackPastEvents };
  });
}

export function submitPublicRegistration(payload) {
  return apiFetch('/api/public/registrations', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
