const {
  createHttpError,
  isMembershipReference,
  processMembershipPayment,
  verifyVippsWebhookRequest,
} = require('../../_lib/vipps');

async function readRawBody(req) {
  if (typeof req.body === 'string') {
    return req.body;
  }

  if (Buffer.isBuffer(req.body)) {
    return req.body.toString('utf8');
  }

  if (req.body && typeof req.body === 'object') {
    return JSON.stringify(req.body);
  }

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return Buffer.concat(chunks).toString('utf8');
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    const rawBody = await readRawBody(req);

    verifyVippsWebhookRequest({
      method: req.method,
      pathAndQuery: req.url,
      host: req.headers.host,
      rawBody,
      headers: req.headers,
    });

    const payload = rawBody ? JSON.parse(rawBody) : {};
    const reference = String(payload.reference || '').trim();
    const eventName = String(payload.name || '').toUpperCase();

    if (!reference || !isMembershipReference(reference)) {
      return res.status(200).json({ ok: true, ignored: true, reason: 'non-membership-reference' });
    }

    if (!['AUTHORIZED', 'CAPTURED'].includes(eventName)) {
      return res.status(200).json({ ok: true, ignored: true, reason: `event-${eventName || 'unknown'}` });
    }

    const result = await processMembershipPayment(reference, {
      source: 'vipps_webhook',
      lastVippsEvent: eventName,
      eventTimestamp: payload.timestamp ? new Date(payload.timestamp) : new Date(),
    });

    return res.status(200).json({
      ok: true,
      reference,
      eventName,
      paymentState: result.payment.state,
      captureTriggered: result.captureTriggered,
      captureError: result.captureError,
      persistenceStored: result.persistenceResult?.stored || false,
      persistenceError: result.persistenceResult?.error || null,
      welcomeEmail: result.welcomeEmailResult || null,
    });
  } catch (error) {
    console.error('Vipps webhook handling failed:', error);

    const statusCode =
      error.statusCode ||
      (error instanceof SyntaxError ? 400 : 500);

    return res.status(statusCode).json({
      error: error.message || 'Could not process Vipps webhook.',
    });
  }
};
