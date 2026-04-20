const configuredBaseUrl = String(import.meta.env.VITE_BACKEND_URL || '')
  .trim()
  .replace(/\/$/, '');
const isLocalBrowser =
  typeof window !== 'undefined' &&
  ['localhost', '127.0.0.1'].includes(window.location.hostname);
const BASE_URL = configuredBaseUrl || (isLocalBrowser ? 'http://localhost:8080' : '');
const MEMBERSHIP_API_BASE = `${BASE_URL}/api/vipps/membership`;

async function parseApiResponse(response) {
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const detailsMessage =
      typeof payload.details === 'string'
        ? payload.details
        : payload.details?.message || payload.details?.detail || '';

    throw new Error(
      [payload.error, detailsMessage].filter(Boolean).join(' ') || 'Membership request failed.'
    );
  }

  return payload;
}

export async function startMembershipCheckout() {
  const response = await fetch(`${MEMBERSHIP_API_BASE}/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });

  return parseApiResponse(response);
}

export async function getMembershipStatus(reference) {
  const response = await fetch(
    `${MEMBERSHIP_API_BASE}/status?reference=${encodeURIComponent(reference)}`
  );

  return parseApiResponse(response);
}
