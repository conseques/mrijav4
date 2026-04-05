const MEMBERSHIP_API_BASE = '/api/vipps/membership';

async function parseApiResponse(response) {
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || 'Membership request failed.');
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
