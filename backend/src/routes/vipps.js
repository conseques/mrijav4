const express = require('express');
const path = require('node:path');

const router = express.Router();

// Navigate from backend/src/routes/ up to the project root
const projectRoot = path.join(__dirname, '..', '..', '..');

// Load env vars from root .env.local (Vipps keys live there)
require('dotenv').config({ path: path.join(projectRoot, '.env.local') });

// These are the existing Vercel function handlers — we reuse them directly in Express
const createHandler = require(path.join(projectRoot, 'api/vipps/membership/create'));
const statusHandler = require(path.join(projectRoot, 'api/vipps/membership/status'));
const webhookHandler = require(path.join(projectRoot, 'api/vipps/webhooks/epayment'));

/**
 * POST /api/vipps/membership/create
 * Initiates a Vipps ePayment for annual membership.
 */
router.post('/membership/create', (req, res) => createHandler(req, res));

/**
 * GET /api/vipps/membership/status?reference=...
 * Polls the payment status and finalises the membership if authorised.
 */
router.get('/membership/status', (req, res) => statusHandler(req, res));

/**
 * POST /api/vipps/webhooks/epayment
 * Receives signed webhook events from Vipps.
 * The handler reads req.rawBody, so we must ensure Express exposes it.
 */
router.post('/webhooks/epayment', (req, res) => webhookHandler(req, res));

module.exports = router;
