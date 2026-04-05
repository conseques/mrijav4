const MEMBERSHIP_WEBHOOK_EVENTS = [
  'epayments.payment.authorized.v1',
  'epayments.payment.captured.v1',
  'epayments.payment.cancelled.v1',
  'epayments.payment.expired.v1',
  'epayments.payment.terminated.v1',
  'epayments.payment.aborted.v1',
];

function getRequiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getConfig() {
  const siteUrl = getRequiredEnv('PUBLIC_SITE_URL').replace(/\/$/, '');

  return {
    apiBaseUrl: (process.env.VIPPS_API_BASE_URL || 'https://api.vipps.no').replace(/\/$/, ''),
    clientId: getRequiredEnv('VIPPS_CLIENT_ID'),
    clientSecret: getRequiredEnv('VIPPS_CLIENT_SECRET'),
    subscriptionKey: getRequiredEnv('VIPPS_SUBSCRIPTION_KEY'),
    merchantSerialNumber: getRequiredEnv('VIPPS_MSN'),
    callbackUrl: `${siteUrl}/api/vipps/webhooks/epayment`,
  };
}

async function parseJsonResponse(response) {
  const text = await response.text();
  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

async function getAccessToken(config) {
  const response = await fetch(`${config.apiBaseUrl}/accesstoken/get`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      client_id: config.clientId,
      client_secret: config.clientSecret,
      'Ocp-Apim-Subscription-Key': config.subscriptionKey,
      'Merchant-Serial-Number': config.merchantSerialNumber,
    },
    body: '',
  });

  const payload = await parseJsonResponse(response);
  if (!response.ok || !payload.access_token) {
    throw new Error(`Could not get Vipps access token: ${JSON.stringify(payload)}`);
  }

  return payload.access_token;
}

async function registerWebhook() {
  const config = getConfig();
  const accessToken = await getAccessToken(config);

  const response = await fetch(`${config.apiBaseUrl}/webhooks/v1/webhooks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      'Ocp-Apim-Subscription-Key': config.subscriptionKey,
      'Merchant-Serial-Number': config.merchantSerialNumber,
    },
    body: JSON.stringify({
      url: config.callbackUrl,
      events: MEMBERSHIP_WEBHOOK_EVENTS,
    }),
  });

  const payload = await parseJsonResponse(response);
  if (!response.ok || !payload.id || !payload.secret) {
    throw new Error(`Could not register Vipps webhook: ${JSON.stringify(payload)}`);
  }

  console.log(JSON.stringify({
    callbackUrl: config.callbackUrl,
    events: MEMBERSHIP_WEBHOOK_EVENTS,
    webhookId: payload.id,
    webhookSecret: payload.secret,
    nextSteps: [
      'Add VIPPS_WEBHOOK_ID to your deployment environment.',
      'Add VIPPS_WEBHOOK_SECRET to your deployment environment.',
      'Redeploy so the serverless webhook can verify incoming requests.',
    ],
  }, null, 2));
}

registerWebhook().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
