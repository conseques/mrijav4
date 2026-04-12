const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { z } = require('zod');
const { db } = require('../db/connection');
const { requireApprovedVolunteer, requireAuth } = require('../middleware/auth');
const { mapUserRow } = require('../utils/mappers');
const { hashPassword, verifyPassword } = require('../utils/password');
const { nowIso } = require('../utils/time');
const { createAccessToken } = require('../utils/tokens');
const { stringifyJson } = require('../utils/json');

const router = express.Router();

const registerSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().max(40).optional().default(''),
  password: z.string().min(8).max(120)
});

const loginSchema = z.object({
  email: z.string().trim().email().max(160),
  password: z.string().min(1).max(120)
});

const profileSchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  phone: z.string().trim().max(40).optional()
});

const skillsSchema = z.object({
  skills: z.array(z.string().trim().min(1).max(64)).max(30)
});

router.post('/register-volunteer', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid registration payload.' });
  }

  const payload = parsed.data;
  const normalizedEmail = payload.email.toLowerCase();
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail);

  if (existing) {
    return res.status(409).json({ error: 'This email is already registered.' });
  }

  const now = nowIso();
  const passwordHash = await hashPassword(payload.password);
  const id = uuidv4();

  db.prepare(`
    INSERT INTO users (id, email, password_hash, name, phone, status, role, skills, created_at, updated_at)
    VALUES (@id, @email, @passwordHash, @name, @phone, 'pending', 'user', '[]', @createdAt, @updatedAt)
  `).run({
    id,
    email: normalizedEmail,
    passwordHash,
    name: payload.name,
    phone: payload.phone || '',
    createdAt: now,
    updatedAt: now
  });

  return res.status(201).json({
    id,
    message: 'Registration created and waiting for admin verification.'
  });
});

router.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid login payload.' });
  }

  const payload = parsed.data;
  const normalizedEmail = payload.email.toLowerCase();
  const userRow = db.prepare('SELECT * FROM users WHERE email = ?').get(normalizedEmail);

  if (!userRow) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  if (String(userRow.password_hash).startsWith('firebase-migrated:')) {
    return res.status(403).json({
      error: 'This account was migrated from Firebase. Set a new password in the backend before login.'
    });
  }

  const isValid = await verifyPassword(payload.password, userRow.password_hash);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const user = mapUserRow(userRow);
  const token = createAccessToken(user);

  return res.json({
    token,
    user
  });
});

router.get('/me', requireAuth, (req, res) => {
  return res.json({ user: req.user });
});

router.patch('/me', requireAuth, (req, res) => {
  const parsed = profileSchema.safeParse(req.body || {});
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid profile payload.' });
  }

  const payload = parsed.data;
  const hasName = Object.prototype.hasOwnProperty.call(payload, 'name');
  const hasPhone = Object.prototype.hasOwnProperty.call(payload, 'phone');

  if (!hasName && !hasPhone) {
    return res.status(400).json({ error: 'No profile fields provided.' });
  }

  const now = nowIso();
  db.prepare(`
    UPDATE users
    SET name = COALESCE(@name, name),
        phone = COALESCE(@phone, phone),
        updated_at = @updatedAt
    WHERE id = @id
  `).run({
    id: req.user.id,
    name: hasName ? payload.name : null,
    phone: hasPhone ? payload.phone : null,
    updatedAt: now
  });

  const updated = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  return res.json({ user: mapUserRow(updated) });
});

router.patch('/me/skills', requireApprovedVolunteer, (req, res) => {
  const parsed = skillsSchema.safeParse(req.body || {});
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid skills payload.' });
  }

  const now = nowIso();
  db.prepare(`
    UPDATE users
    SET skills = @skills,
        updated_at = @updatedAt
    WHERE id = @id
  `).run({
    id: req.user.id,
    skills: stringifyJson(parsed.data.skills, []),
    updatedAt: now
  });

  const updated = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  return res.json({ user: mapUserRow(updated) });
});

module.exports = router;
