const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { z } = require('zod');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { db } = require('../db/connection');
const { requireRole } = require('../middleware/auth');
const {
  mapCourseRow,
  mapEventRow,
  mapPastEventRow,
  mapUserRow,
  toTimestampObject
} = require('../utils/mappers');
const { parseJson, stringifyJson } = require('../utils/json');
const { nowIso } = require('../utils/time');

const router = express.Router();

// System Backup Route
router.get('/system/backup', requireRole('admin'), (req, res) => {
  const dataDir = path.resolve(__dirname, '../../data');
  const backupFile = `mrija-backup-${Date.now()}.tar.gz`;
  const backupPath = path.resolve(__dirname, '../../data', backupFile);

  const command = `tar -czf ${backupPath} -C ${path.dirname(dataDir)} ${path.basename(dataDir)}`;
  
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error('Backup failed:', error, stderr);
      return res.status(500).json({ error: 'Failed to create backup archive.' });
    }
    
    res.download(backupPath, backupFile, (err) => {
      if (err) console.error('Error downloading backup:', err);
      
      // Cleanup backup file after download finishes or fails
      fs.unlink(backupPath, (unlinkErr) => {
        if (unlinkErr) console.error('Error cleaning up backup:', unlinkErr);
      });
    });
  });
});

const localesSchema = z.record(z.any()).refine((value) => Object.keys(value || {}).length > 0, {
  message: 'Locales are required.'
});

const reviewSchema = z.object({
  status: z.enum(['approved', 'rejected'])
});

const roleSchema = z.object({
  role: z.enum(['volunteer', 'manager', 'admin'])
});

const eventSchema = z.object({
  imageUrl: z.string().trim().min(1).max(4000),
  day: z.string().trim().min(1).max(120),
  time: z.string().trim().min(1).max(120),
  tagType: z.enum(['regular', 'annual']).optional().default('regular'),
  locales: localesSchema
});

const pastEventSchema = z.object({
  imageUrl: z.string().trim().min(1).max(4000),
  date: z.string().trim().min(1).max(120),
  tag: z.string().trim().min(1).max(60).default('community'),
  locales: localesSchema
});

const courseSchema = z.object({
  imageUrl: z.string().trim().min(1).max(4000),
  teacherPhotoUrl: z.string().trim().min(1).max(4000),
  phone: z.string().trim().min(1).max(120),
  locales: localesSchema
});

router.use(requireRole('manager', 'admin'));

router.get('/volunteers', (req, res) => {
  const statusFilter = String(req.query.status || '').trim().toLowerCase();
  const rows =
    statusFilter && ['pending', 'approved', 'rejected'].includes(statusFilter)
      ? db.prepare('SELECT * FROM users WHERE status = ? ORDER BY created_at DESC').all(statusFilter)
      : db.prepare('SELECT * FROM users ORDER BY created_at DESC').all();

  return res.json({
    items: rows.map(mapUserRow)
  });
});

router.patch('/volunteers/:id/review', (req, res) => {
  const userId = String(req.params.id || '').trim();
  if (!userId) {
    return res.status(400).json({ error: 'User id is required.' });
  }

  const parsed = reviewSchema.safeParse(req.body || {});
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid review payload.' });
  }

  const existingUser = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
  if (!existingUser) {
    return res.status(404).json({ error: 'User not found.' });
  }

  const nextStatus = parsed.data.status;
  const nextRole =
    nextStatus === 'approved' && existingUser.role === 'user' ? 'volunteer' : existingUser.role;
  const updatedAt = nowIso();

  db.prepare(`
    UPDATE users
    SET status = @status, role = @role, updated_at = @updatedAt
    WHERE id = @id
  `).run({
    id: userId,
    status: nextStatus,
    role: nextRole,
    updatedAt
  });

  const updated = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
  return res.json({ item: mapUserRow(updated) });
});

router.delete('/volunteers/:id', (req, res) => {
  const userId = String(req.params.id || '').trim();
  if (!userId) {
    return res.status(400).json({ error: 'User id is required.' });
  }

  const existingUser = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
  if (!existingUser) {
    return res.status(404).json({ error: 'User not found.' });
  }

  db.prepare('DELETE FROM users WHERE id = ?').run(userId);
  
  return res.json({ success: true, message: 'User deleted successfully.' });
});

router.patch('/volunteers/:id/role', (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only admins can change volunteer roles.' });
  }

  const userId = String(req.params.id || '').trim();
  if (!userId) {
    return res.status(400).json({ error: 'User id is required.' });
  }

  const parsed = roleSchema.safeParse(req.body || {});
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid role payload.' });
  }

  const existingUser = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
  if (!existingUser) {
    return res.status(404).json({ error: 'User not found.' });
  }

  db.prepare(`
    UPDATE users
    SET role = @role, updated_at = @updatedAt
    WHERE id = @id
  `).run({
    id: userId,
    role: parsed.data.role,
    updatedAt: nowIso()
  });

  const updated = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
  return res.json({ item: mapUserRow(updated) });
});

router.get('/events', (_req, res) => {
  const rows = db.prepare('SELECT * FROM events ORDER BY created_at DESC').all();
  return res.json({ items: rows.map(mapEventRow) });
});

router.post('/events', (req, res) => {
  const parsed = eventSchema.safeParse(req.body || {});
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid event payload.' });
  }

  const payload = parsed.data;
  const id = uuidv4();
  const now = nowIso();

  db.prepare(`
    INSERT INTO events (id, image_url, day, time, tag_type, locales, created_at, updated_at)
    VALUES (@id, @imageUrl, @day, @time, @tagType, @locales, @createdAt, @updatedAt)
  `).run({
    id,
    imageUrl: payload.imageUrl,
    day: payload.day,
    time: payload.time,
    tagType: payload.tagType,
    locales: stringifyJson(payload.locales, {}),
    createdAt: now,
    updatedAt: now
  });

  const created = db.prepare('SELECT * FROM events WHERE id = ?').get(id);
  return res.status(201).json({ item: mapEventRow(created) });
});

router.put('/events/:id', (req, res) => {
  const id = String(req.params.id || '').trim();
  if (!id) {
    return res.status(400).json({ error: 'Event id is required.' });
  }

  const parsed = eventSchema.safeParse(req.body || {});
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid event payload.' });
  }

  const exists = db.prepare('SELECT id FROM events WHERE id = ?').get(id);
  if (!exists) {
    return res.status(404).json({ error: 'Event not found.' });
  }

  const payload = parsed.data;
  db.prepare(`
    UPDATE events
    SET image_url = @imageUrl,
        day = @day,
        time = @time,
        tag_type = @tagType,
        locales = @locales,
        updated_at = @updatedAt
    WHERE id = @id
  `).run({
    id,
    imageUrl: payload.imageUrl,
    day: payload.day,
    time: payload.time,
    tagType: payload.tagType,
    locales: stringifyJson(payload.locales, {}),
    updatedAt: nowIso()
  });

  const updated = db.prepare('SELECT * FROM events WHERE id = ?').get(id);
  return res.json({ item: mapEventRow(updated) });
});

router.delete('/events/:id', (req, res) => {
  const id = String(req.params.id || '').trim();
  if (!id) {
    return res.status(400).json({ error: 'Event id is required.' });
  }

  const result = db.prepare('DELETE FROM events WHERE id = ?').run(id);
  if (!result.changes) {
    return res.status(404).json({ error: 'Event not found.' });
  }

  return res.json({ ok: true });
});

router.get('/past-events', (_req, res) => {
  const rows = db.prepare('SELECT * FROM past_events ORDER BY created_at DESC').all();
  return res.json({ items: rows.map(mapPastEventRow) });
});

router.post('/past-events', (req, res) => {
  const parsed = pastEventSchema.safeParse(req.body || {});
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid past event payload.' });
  }

  const payload = parsed.data;
  const id = uuidv4();
  const now = nowIso();

  db.prepare(`
    INSERT INTO past_events (id, image_url, date_text, tag, locales, created_at, updated_at)
    VALUES (@id, @imageUrl, @dateText, @tag, @locales, @createdAt, @updatedAt)
  `).run({
    id,
    imageUrl: payload.imageUrl,
    dateText: payload.date,
    tag: payload.tag,
    locales: stringifyJson(payload.locales, {}),
    createdAt: now,
    updatedAt: now
  });

  const created = db.prepare('SELECT * FROM past_events WHERE id = ?').get(id);
  return res.status(201).json({ item: mapPastEventRow(created) });
});

router.put('/past-events/:id', (req, res) => {
  const id = String(req.params.id || '').trim();
  if (!id) {
    return res.status(400).json({ error: 'Past event id is required.' });
  }

  const parsed = pastEventSchema.safeParse(req.body || {});
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid past event payload.' });
  }

  const exists = db.prepare('SELECT id FROM past_events WHERE id = ?').get(id);
  if (!exists) {
    return res.status(404).json({ error: 'Past event not found.' });
  }

  const payload = parsed.data;
  db.prepare(`
    UPDATE past_events
    SET image_url = @imageUrl,
        date_text = @dateText,
        tag = @tag,
        locales = @locales,
        updated_at = @updatedAt
    WHERE id = @id
  `).run({
    id,
    imageUrl: payload.imageUrl,
    dateText: payload.date,
    tag: payload.tag,
    locales: stringifyJson(payload.locales, {}),
    updatedAt: nowIso()
  });

  const updated = db.prepare('SELECT * FROM past_events WHERE id = ?').get(id);
  return res.json({ item: mapPastEventRow(updated) });
});

router.delete('/past-events/:id', (req, res) => {
  const id = String(req.params.id || '').trim();
  if (!id) {
    return res.status(400).json({ error: 'Past event id is required.' });
  }

  const result = db.prepare('DELETE FROM past_events WHERE id = ?').run(id);
  if (!result.changes) {
    return res.status(404).json({ error: 'Past event not found.' });
  }

  return res.json({ ok: true });
});

router.get('/courses', (_req, res) => {
  const rows = db.prepare('SELECT * FROM courses ORDER BY created_at DESC').all();
  return res.json({ items: rows.map(mapCourseRow) });
});

router.post('/courses', (req, res) => {
  const parsed = courseSchema.safeParse(req.body || {});
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid course payload.' });
  }

  const payload = parsed.data;
  const id = uuidv4();
  const now = nowIso();

  db.prepare(`
    INSERT INTO courses (id, image_url, teacher_photo_url, phone, locales, created_at, updated_at)
    VALUES (@id, @imageUrl, @teacherPhotoUrl, @phone, @locales, @createdAt, @updatedAt)
  `).run({
    id,
    imageUrl: payload.imageUrl,
    teacherPhotoUrl: payload.teacherPhotoUrl,
    phone: payload.phone,
    locales: stringifyJson(payload.locales, {}),
    createdAt: now,
    updatedAt: now
  });

  const created = db.prepare('SELECT * FROM courses WHERE id = ?').get(id);
  return res.status(201).json({ item: mapCourseRow(created) });
});

router.put('/courses/:id', (req, res) => {
  const id = String(req.params.id || '').trim();
  if (!id) {
    return res.status(400).json({ error: 'Course id is required.' });
  }

  const parsed = courseSchema.safeParse(req.body || {});
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid course payload.' });
  }

  const exists = db.prepare('SELECT id FROM courses WHERE id = ?').get(id);
  if (!exists) {
    return res.status(404).json({ error: 'Course not found.' });
  }

  const payload = parsed.data;
  db.prepare(`
    UPDATE courses
    SET image_url = @imageUrl,
        teacher_photo_url = @teacherPhotoUrl,
        phone = @phone,
        locales = @locales,
        updated_at = @updatedAt
    WHERE id = @id
  `).run({
    id,
    imageUrl: payload.imageUrl,
    teacherPhotoUrl: payload.teacherPhotoUrl,
    phone: payload.phone,
    locales: stringifyJson(payload.locales, {}),
    updatedAt: nowIso()
  });

  const updated = db.prepare('SELECT * FROM courses WHERE id = ?').get(id);
  return res.json({ item: mapCourseRow(updated) });
});

router.delete('/courses/:id', (req, res) => {
  const id = String(req.params.id || '').trim();
  if (!id) {
    return res.status(400).json({ error: 'Course id is required.' });
  }

  const result = db.prepare('DELETE FROM courses WHERE id = ?').run(id);
  if (!result.changes) {
    return res.status(404).json({ error: 'Course not found.' });
  }

  return res.json({ ok: true });
});

router.get('/report', (_req, res) => {
  const row = db.prepare('SELECT * FROM reports WHERE id = ?').get('main');
  return res.json({
    data: row ? parseJson(row.payload, {}) : {}
  });
});

router.put('/report', (req, res) => {
  const payload = req.body;
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return res.status(400).json({ error: 'Report payload must be an object.' });
  }

  const updatedAt = nowIso();
  db.prepare(`
    INSERT INTO reports (id, payload, updated_at)
    VALUES ('main', @payload, @updatedAt)
    ON CONFLICT(id) DO UPDATE SET
      payload = excluded.payload,
      updated_at = excluded.updated_at
  `).run({
    payload: stringifyJson(payload, {}),
    updatedAt
  });

  return res.json({
    data: payload
  });
});

router.get('/registrations', (_req, res) => {
  const rows = db.prepare('SELECT * FROM registrations ORDER BY created_at DESC').all();
  return res.json({
    items: rows.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone || '',
      eventName: row.event_name,
      type: row.type || 'event',
      source: row.source || 'website',
      paymentReference: row.payment_reference || '',
      paymentState: row.payment_state || 'registered',
      createdAt: toTimestampObject(row.created_at)
    }))
  });
});

router.get('/memberships', (_req, res) => {
  const rows = db.prepare('SELECT * FROM memberships ORDER BY created_at DESC').all();
  return res.json({
    items: rows.map((row) => ({
      id: row.id,
      firstName: row.first_name || '',
      lastName: row.last_name || '',
      name: row.name || '',
      email: row.email || '',
      phone: row.phone || '',
      source: row.source || 'vipps_epayment',
      paymentReference: row.payment_reference || '',
      paymentState: row.payment_state || 'captured',
      vippsSub: row.vipps_sub || '',
      pspReference: row.psp_reference || '',
      msn: row.msn || '',
      amountValue: row.amount_value || 0,
      currency: row.currency || 'NOK',
      lastVippsEvent: row.last_vipps_event || '',
      paymentDescription: row.payment_description || '',
      createdAt: toTimestampObject(row.created_at)
    }))
  });
});

module.exports = router;
