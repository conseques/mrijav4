const { createMembershipPayment } = require('../../_lib/vipps');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    const payment = await createMembershipPayment(req);

    return res.status(200).json({
      reference: payment.reference,
      redirectUrl: payment.redirectUrl,
    });
  } catch (error) {
    console.error('Vipps membership payment creation failed:', error);

    return res.status(error.statusCode || 500).json({
      error: error.message || 'Could not create Vipps membership payment.',
      details: error.details || null,
    });
  }
};
