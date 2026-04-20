const {
  normalizeUserDetails,
  processMembershipPayment,
} = require('../../_lib/vipps');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const reference = String(req.query.reference || '').trim();

  if (!reference) {
    return res.status(400).json({ error: 'Missing payment reference.' });
  }

  try {
    const result = await processMembershipPayment(reference, {
      source: 'vipps_status_page',
      lastVippsEvent: 'STATUS_POLL',
      eventTimestamp: new Date(),
    });
    const payment = result.payment;
    const storageResult = result.persistenceResult;

    return res.status(200).json({
      reference,
      paymentState: result.paymentCaptured ? 'CAPTURED' : payment.state,
      paymentCaptured: result.paymentCaptured,
      captureTriggered: result.captureTriggered,
      captureError: result.captureError,
      registrationStored: storageResult?.stored || false,
      storageError: storageResult?.stored ? null : storageResult?.error || null,
      storageBackend: storageResult?.backend || null,
      welcomeEmail: result.welcomeEmailResult || null,
      member: normalizeUserDetails(payment),
    });
  } catch (error) {
    console.error('Vipps membership payment status failed:', error);

    return res.status(error.statusCode || 500).json({
      error: error.message || 'Could not fetch Vipps membership payment status.',
      details: error.details || null,
    });
  }
};
