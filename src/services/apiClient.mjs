const LOCAL_BACKEND_URL = 'http://localhost:8080';
const PUBLIC_BACKEND_FALLBACK_URL = 'https://api.mrija.no';

function normalizeBaseUrl(baseUrl = '') {
  return String(baseUrl).trim().replace(/\/$/, '');
}

function isRetryableStatus(status) {
  return status === 404 || status >= 500;
}

function createErrorMessage(payload, response) {
  if (typeof payload?.error === 'string' && payload.error.trim()) {
    return payload.error.trim();
  }

  if (typeof payload?.message === 'string' && payload.message.trim()) {
    return payload.message.trim();
  }

  return `Request failed with status ${response.status}`;
}

export function getApiBaseCandidates({
  configuredBaseUrl = '',
  hostname = '',
  localBackendUrl = LOCAL_BACKEND_URL,
  publicFallbackBaseUrl = PUBLIC_BACKEND_FALLBACK_URL,
} = {}) {
  const normalizedConfiguredBaseUrl = normalizeBaseUrl(configuredBaseUrl);
  if (normalizedConfiguredBaseUrl) {
    return [normalizedConfiguredBaseUrl];
  }

  const candidates = [''];
  const normalizedHostname = String(hostname || '').trim().toLowerCase();
  const isLocalBrowser = ['localhost', '127.0.0.1'].includes(normalizedHostname);

  if (!isLocalBrowser) {
    return candidates;
  }

  const normalizedLocalBackendUrl = normalizeBaseUrl(localBackendUrl);
  const normalizedPublicFallbackUrl = normalizeBaseUrl(publicFallbackBaseUrl);

  if (normalizedLocalBackendUrl) {
    candidates.push(normalizedLocalBackendUrl);
  }

  if (normalizedPublicFallbackUrl) {
    candidates.push(normalizedPublicFallbackUrl);
  }

  return [...new Set(candidates)];
}

export async function fetchJsonWithFallbacks({
  path,
  baseUrls,
  options = {},
  fetchImpl = fetch,
} = {}) {
  const { headers, ...restOptions } = options;
  const candidates = Array.isArray(baseUrls) && baseUrls.length > 0 ? baseUrls : [''];
  let lastError = null;

  for (let index = 0; index < candidates.length; index += 1) {
    const baseUrl = candidates[index];
    const url = `${baseUrl}${path}`;
    const isLastCandidate = index === candidates.length - 1;

    try {
      const response = await fetchImpl(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(headers || {}),
        },
        ...restOptions,
      });

      const payload = await response.json().catch(() => ({}));

      if (response.ok) {
        return payload;
      }

      const error = new Error(createErrorMessage(payload, response));
      error.status = response.status;
      error.payload = payload;

      if (!isLastCandidate && isRetryableStatus(response.status)) {
        lastError = error;
        continue;
      }

      throw error;
    } catch (error) {
      if (!isLastCandidate && error?.status == null) {
        lastError = error;
        continue;
      }

      throw error;
    }
  }

  throw lastError || new Error('Request failed.');
}
