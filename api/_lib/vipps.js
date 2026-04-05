const crypto = require('node:crypto');
const { getFirebaseAdminDb, hasFirebaseAdminConfig } = require('./firebaseAdmin');

const MEMBERSHIP_AMOUNT_ORE = 10000;
const MEMBERSHIP_EVENT_NAME = 'Membership (Vipps)';
const DEFAULT_VIPPS_API_BASE_URL = 'https://api.vipps.no';
const DEFAULT_FIREBASE_PROJECT_ID = 'mrija-web';
const DEFAULT_FIREBASE_API_KEY = 'AIzaSyA3KnOfvzBFoGhgJw3Zjz3uWQZR2e15ymo';
const MEMBERSHIP_REFERENCE_PREFIX = 'membership-';
const MEMBERSHIP_WEBHOOK_EVENTS = [
  'epayments.payment.authorized.v1',
  'epayments.payment.captured.v1',
  'epayments.payment.cancelled.v1',
  'epayments.payment.expired.v1',
  'epayments.payment.terminated.v1',
  'epayments.payment.aborted.v1',
];

const VIPPS_SYSTEM_HEADERS = {
  'Vipps-System-Name': 'mrija',
  'Vipps-System-Version': '1.0.0',
  'Vipps-System-Plugin-Name': 'mrija-web',
  'Vipps-System-Plugin-Version': '1.0.0',
};

function createHttpError(statusCode, message, details) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.details = details;
  return error;
}

function getRequiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw createHttpError(500, `Missing required environment variable: ${name}`);
  }
  return value;
}

function getVippsConfig() {
  return {
    apiBaseUrl: (process.env.VIPPS_API_BASE_URL || DEFAULT_VIPPS_API_BASE_URL).replace(/\/$/, ''),
    clientId: getRequiredEnv('VIPPS_CLIENT_ID'),
    clientSecret: getRequiredEnv('VIPPS_CLIENT_SECRET'),
    subscriptionKey: getRequiredEnv('VIPPS_SUBSCRIPTION_KEY'),
    merchantSerialNumber: getRequiredEnv('VIPPS_MSN'),
  };
}

function getPublicSiteUrl(req) {
  const explicitUrl = process.env.PUBLIC_SITE_URL;
  if (explicitUrl) {
    return explicitUrl.replace(/\/$/, '');
  }

  const forwardedProto = req.headers['x-forwarded-proto'] || 'https';
  const forwardedHost = req.headers['x-forwarded-host'] || req.headers.host;

  if (!forwardedHost) {
    throw createHttpError(500, 'Could not determine the public site URL for Vipps return redirects.');
  }

  return `${forwardedProto}://${forwardedHost}`;
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

function buildVippsHeaders({ accessToken, idempotencyKey } = {}) {
  const config = getVippsConfig();
  const headers = {
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': config.subscriptionKey,
    'Merchant-Serial-Number': config.merchantSerialNumber,
    ...VIPPS_SYSTEM_HEADERS,
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  if (idempotencyKey) {
    headers['Idempotency-Key'] = idempotencyKey;
  }

  return headers;
}

async function getAccessToken() {
  const config = getVippsConfig();
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
    throw createHttpError(
      response.status || 500,
      'Vipps access token request failed.',
      payload
    );
  }

  return payload.access_token;
}

async function vippsApiRequest(path, { method = 'GET', body, accessToken, idempotencyKey } = {}) {
  const config = getVippsConfig();
  const response = await fetch(`${config.apiBaseUrl}${path}`, {
    method,
    headers: buildVippsHeaders({ accessToken, idempotencyKey }),
    body: body ? JSON.stringify(body) : undefined,
  });

  const payload = await parseJsonResponse(response);

  if (!response.ok) {
    throw createHttpError(response.status || 500, `Vipps request failed for ${path}`, payload);
  }

  return payload;
}

function generateMembershipReference() {
  return `${MEMBERSHIP_REFERENCE_PREFIX}${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
}

async function createMembershipPayment(req) {
  const accessToken = await getAccessToken();
  const reference = generateMembershipReference();
  const returnUrl = `${getPublicSiteUrl(req)}/membership/complete?reference=${encodeURIComponent(reference)}`;

  const payment = await vippsApiRequest('/epayment/v1/payments', {
    method: 'POST',
    accessToken,
    idempotencyKey: crypto.randomUUID(),
    body: {
      amount: {
        value: MEMBERSHIP_AMOUNT_ORE,
        currency: 'NOK',
      },
      paymentMethod: {
        type: 'WALLET',
      },
      reference,
      returnUrl,
      userFlow: 'WEB_REDIRECT',
      paymentDescription: 'Annual membership in MriJa',
      metadata: {
        flow: 'membership',
        source: 'website',
      },
      profile: {
        scope: 'name email phoneNumber',
      },
    },
  });

  if (!payment.redirectUrl) {
    throw createHttpError(502, 'Vipps did not return a redirect URL.', payment);
  }

  return {
    reference,
    redirectUrl: payment.redirectUrl,
  };
}

async function getPayment(reference) {
  const accessToken = await getAccessToken();
  return vippsApiRequest(`/epayment/v1/payments/${encodeURIComponent(reference)}`, {
    accessToken,
  });
}

async function capturePayment(reference, amountValue = MEMBERSHIP_AMOUNT_ORE) {
  const accessToken = await getAccessToken();
  return vippsApiRequest(`/epayment/v1/payments/${encodeURIComponent(reference)}/capture`, {
    method: 'POST',
    accessToken,
    idempotencyKey: `capture-${reference}`,
    body: {
      modificationAmount: {
        currency: 'NOK',
        value: amountValue,
      },
    },
  });
}

function normalizePhoneNumber(phoneNumber) {
  if (!phoneNumber) {
    return '';
  }

  const trimmed = String(phoneNumber).trim();
  if (!trimmed) {
    return '';
  }

  return trimmed.startsWith('+') ? trimmed : `+${trimmed}`;
}

function normalizeUserDetails(payment) {
  const details = payment.userDetails || {};
  const firstName = details.firstName || '';
  const lastName = details.lastName || '';

  return {
    firstName,
    lastName,
    fullName: [firstName, lastName].filter(Boolean).join(' ').trim(),
    email: details.email || '',
    phone: normalizePhoneNumber(details.mobileNumber),
    vippsSub: payment.sub || payment.profile?.sub || '',
  };
}

function getFirestoreConfig() {
  return {
    projectId: process.env.FIREBASE_PROJECT_ID || DEFAULT_FIREBASE_PROJECT_ID,
    apiKey: process.env.FIREBASE_API_KEY || DEFAULT_FIREBASE_API_KEY,
  };
}

function buildFirestoreFields(record) {
  return Object.entries(record).reduce((fields, [key, value]) => {
    if (value === undefined || value === null || value === '') {
      return fields;
    }

    if (typeof value === 'boolean') {
      fields[key] = { booleanValue: value };
      return fields;
    }

    if (typeof value === 'number' && Number.isInteger(value)) {
      fields[key] = { integerValue: String(value) };
      return fields;
    }

    if (value instanceof Date) {
      fields[key] = { timestampValue: value.toISOString() };
      return fields;
    }

    fields[key] = { stringValue: String(value) };
    return fields;
  }, {});
}

function normalizeStringValue(value) {
  if (Array.isArray(value)) {
    return String(value[0] || '').trim();
  }

  return String(value || '').trim();
}

function isMembershipReference(reference) {
  return String(reference || '').startsWith(MEMBERSHIP_REFERENCE_PREFIX);
}

function buildMembershipRecord(payment, options = {}) {
  const member = normalizeUserDetails(payment);
  const eventTimestamp = options.eventTimestamp || new Date();

  return {
    firstName: member.firstName,
    lastName: member.lastName,
    name: member.fullName || 'Vipps member',
    email: member.email,
    phone: member.phone,
    source: options.source || 'vipps_epayment',
    paymentReference: payment.reference,
    paymentState: payment.state || 'CAPTURED',
    vippsSub: member.vippsSub,
    pspReference: payment.pspReference || '',
    msn: payment.msn || getVippsConfig().merchantSerialNumber,
    amountValue: payment.amount?.value || MEMBERSHIP_AMOUNT_ORE,
    currency: payment.amount?.currency || 'NOK',
    lastVippsEvent: options.lastVippsEvent || '',
    paymentDescription: payment.paymentDescription || 'Annual membership in MriJa',
    createdAt: eventTimestamp,
  };
}

function buildRegistrationRecord(payment, options = {}) {
  const member = normalizeUserDetails(payment);
  const eventTimestamp = options.eventTimestamp || new Date();

  return {
    name: member.fullName || 'Vipps member',
    email: member.email,
    phone: member.phone,
    eventName: MEMBERSHIP_EVENT_NAME,
    type: 'membership',
    source: options.source || 'vipps_epayment',
    paymentReference: payment.reference,
    paymentState: payment.state || 'CAPTURED',
    createdAt: eventTimestamp,
  };
}

async function createDocumentViaFirestoreRest(collectionName, documentId, record) {
  const { projectId, apiKey } = getFirestoreConfig();
  const firestoreUrl =
    `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${collectionName}` +
    `?documentId=${encodeURIComponent(documentId)}&key=${encodeURIComponent(apiKey)}`;

  const response = await fetch(firestoreUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fields: buildFirestoreFields(record),
    }),
  });

  const payload = await parseJsonResponse(response);

  if (response.ok) {
    return {
      stored: true,
      alreadyExists: false,
      backend: 'firestore_rest',
    };
  }

  const payloadText = JSON.stringify(payload);
  if (response.status === 409 || payloadText.includes('ALREADY_EXISTS')) {
    return {
      stored: true,
      alreadyExists: true,
      backend: 'firestore_rest',
    };
  }

  return {
    stored: false,
    error: payload.error?.message || payload.raw || `Could not store document in ${collectionName}.`,
    backend: 'firestore_rest',
  };
}

async function saveDocument(collectionName, documentId, record) {
  const adminDb = getFirebaseAdminDb();

  if (adminDb) {
    await adminDb.collection(collectionName).doc(documentId).set(record, { merge: true });
    return {
      stored: true,
      alreadyExists: false,
      backend: 'firebase_admin',
    };
  }

  return createDocumentViaFirestoreRest(collectionName, documentId, record);
}

async function saveMembershipData(payment, options = {}) {
  const documentId = payment.reference;

  if (!documentId) {
    return {
      stored: false,
      error: 'Vipps payment reference is missing.',
      memberships: null,
      registrations: null,
    };
  }

  const membershipRecord = buildMembershipRecord(payment, options);
  const registrationRecord = buildRegistrationRecord(payment, options);

  const [membershipResult, registrationResult] = await Promise.all([
    saveDocument('memberships', documentId, membershipRecord),
    saveDocument('registrations', documentId, registrationRecord),
  ]);

  const errors = [membershipResult.error, registrationResult.error].filter(Boolean);

  return {
    stored: membershipResult.stored && registrationResult.stored,
    error: errors.length > 0 ? errors.join(' | ') : null,
    memberships: membershipResult,
    registrations: registrationResult,
    backend: hasFirebaseAdminConfig() ? 'firebase_admin' : 'firestore_rest',
  };
}

async function delay(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function refreshPaymentAfterCapture(reference, attempts = 4, delayMs = 400) {
  let payment = await getPayment(reference);

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    if (payment.state === 'CAPTURED') {
      return payment;
    }

    await delay(delayMs);
    payment = await getPayment(reference);
  }

  return payment;
}

async function processMembershipPayment(reference, options = {}) {
  let payment = await getPayment(reference);
  let captureTriggered = false;
  let captureError = null;

  if (payment.state === 'AUTHORIZED') {
    try {
      await capturePayment(reference, payment.amount?.value || MEMBERSHIP_AMOUNT_ORE);
      captureTriggered = true;
      payment = await refreshPaymentAfterCapture(reference);
    } catch (error) {
      captureError = error.message || 'Capture request failed.';
      payment = await getPayment(reference);
    }
  }

  let persistenceResult = null;

  if (payment.state === 'CAPTURED') {
    persistenceResult = await saveMembershipData(payment, options);
  }

  return {
    payment,
    captureTriggered,
    captureError,
    persistenceResult,
  };
}

function getVippsWebhookConfig() {
  return {
    id: normalizeStringValue(process.env.VIPPS_WEBHOOK_ID),
    secret: normalizeStringValue(process.env.VIPPS_WEBHOOK_SECRET),
  };
}

function verifyVippsWebhookRequest({ method, pathAndQuery, host, rawBody, headers }) {
  const { secret } = getVippsWebhookConfig();

  if (!secret) {
    throw createHttpError(500, 'Missing VIPPS_WEBHOOK_SECRET environment variable.');
  }

  const dateHeader = normalizeStringValue(headers['x-ms-date']);
  const contentHashHeader = normalizeStringValue(headers['x-ms-content-sha256']);
  const authorizationHeader = normalizeStringValue(headers.authorization);
  const normalizedHost = normalizeStringValue(host || headers.host);

  if (!dateHeader || !contentHashHeader || !authorizationHeader || !normalizedHost) {
    throw createHttpError(400, 'Vipps webhook headers are incomplete.');
  }

  const calculatedContentHash = crypto.createHash('sha256').update(rawBody).digest('base64');
  if (calculatedContentHash !== contentHashHeader) {
    throw createHttpError(401, 'Vipps webhook content hash verification failed.');
  }

  const signedString =
    `${method}\n${pathAndQuery}\n${dateHeader};${normalizedHost};${contentHashHeader}`;

  const signature = crypto.createHmac('sha256', secret).update(signedString).digest('base64');
  const expectedAuthorization =
    `HMAC-SHA256 SignedHeaders=x-ms-date;host;x-ms-content-sha256&Signature=${signature}`;

  const actualBuffer = Buffer.from(authorizationHeader);
  const expectedBuffer = Buffer.from(expectedAuthorization);

  if (
    actualBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(actualBuffer, expectedBuffer)
  ) {
    throw createHttpError(401, 'Vipps webhook authorization verification failed.');
  }

  return true;
}

module.exports = {
  MEMBERSHIP_AMOUNT_ORE,
  MEMBERSHIP_REFERENCE_PREFIX,
  MEMBERSHIP_WEBHOOK_EVENTS,
  createHttpError,
  createMembershipPayment,
  getPayment,
  capturePayment,
  isMembershipReference,
  normalizeUserDetails,
  processMembershipPayment,
  saveMembershipData,
  verifyVippsWebhookRequest,
};
