const express = require('express');

const router = express.Router();

router.get('/', (_req, res) => {
  res.json({
    ok: true,
    service: 'mrija-backend',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
