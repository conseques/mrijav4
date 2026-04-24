const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../db/connection');
const { mapCourseRow, mapEventRow, mapPastEventRow } = require('../utils/mappers');
const { parseJson } = require('../utils/json');
const {
  registrationSchema,
  getRegistrationValidationErrorMessage,
  getRegistrationValidationLogDetails,
} = require('../utils/publicRegistration');
const { nowIso } = require('../utils/time');

const router = express.Router();

router.get('/events', (_req, res) => {
  const rows = db.prepare('SELECT * FROM events ORDER BY created_at DESC').all();
  return res.json({ items: rows.map(mapEventRow) });
});

router.get('/past-events', (_req, res) => {
  const rows = db.prepare('SELECT * FROM past_events ORDER BY created_at DESC').all();
  return res.json({ items: rows.map(mapPastEventRow) });
});

router.get('/courses', (_req, res) => {
  const rows = db.prepare('SELECT * FROM courses ORDER BY created_at DESC').all();
  return res.json({ items: rows.map(mapCourseRow) });
});

router.get('/report', (_req, res) => {
  const reportRow = db.prepare('SELECT * FROM reports WHERE id = ?').get('main');
  const fallbackPayload = {
    totalAmountRaised: 0,
    goalAmount: 0,
    livesImpacted: 0,
    activeProjects: 0,
    distribution: {
      militaryAid: 0,
      humanitarianAid: 0,
      otherOrgsSupport: 0,
      other: 0
    },
    recentAllocations: []
  };

  return res.json({
    data: reportRow ? parseJson(reportRow.payload, fallbackPayload) : fallbackPayload
  });
});

router.post('/registrations', (req, res) => {
  const parsed = registrationSchema.safeParse(req.body || {});
  if (!parsed.success) {
    const issues = parsed.error.issues || [];

    console.warn(
      'Invalid public registration payload:',
      getRegistrationValidationLogDetails(req.body || {}, issues, req)
    );

    return res.status(400).json({
      error: getRegistrationValidationErrorMessage(issues),
    });
  }

  const payload = parsed.data;
  const id = uuidv4();
  const createdAt = nowIso();

  db.prepare(`
    INSERT INTO registrations (
      id, name, email, phone, event_name, type, source, payment_reference, payment_state, created_at
    )
    VALUES (
      @id, @name, @email, @phone, @eventName, @type, @source, @paymentReference, @paymentState, @createdAt
    )
  `).run({
    id,
    name: payload.name,
    email: payload.email.toLowerCase(),
    phone: payload.phone,
    eventName: payload.eventName,
    type: payload.type,
    source: payload.source,
    paymentReference: payload.paymentReference,
    paymentState: payload.paymentState,
    createdAt
  });

  return res.status(201).json({
    id,
    createdAt
  });
});

module.exports = router;
