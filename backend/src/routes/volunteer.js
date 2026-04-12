const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { z } = require('zod');
const { db } = require('../db/connection');
const { requireApprovedVolunteer, requireRole } = require('../middleware/auth');
const { mapTaskRow } = require('../utils/mappers');
const { stringifyJson } = require('../utils/json');
const { nowIso } = require('../utils/time');

const router = express.Router();

const createTaskSchema = z.object({
  title: z.string().trim().min(2).max(180),
  description: z.string().trim().min(2).max(4000),
  date: z.string().trim().min(1).max(120),
  location: z.string().trim().min(1).max(220),
  marker: z.string().trim().max(120).optional().default(''),
  urgency: z.enum(['Low', 'Medium', 'High']).optional().default('Medium'),
  skillsRequired: z.array(z.string().trim().min(1).max(64)).optional().default([])
});

function loadAppliedUsersMap(taskIds) {
  if (!taskIds.length) {
    return new Map();
  }

  const placeholders = taskIds.map(() => '?').join(', ');
  const rows = db
    .prepare(
      `SELECT task_id, user_id FROM volunteer_task_applications WHERE task_id IN (${placeholders}) ORDER BY created_at ASC`
    )
    .all(...taskIds);

  const mapping = new Map();
  for (const row of rows) {
    if (!mapping.has(row.task_id)) {
      mapping.set(row.task_id, []);
    }
    mapping.get(row.task_id).push(row.user_id);
  }

  return mapping;
}

router.get('/tasks', requireApprovedVolunteer, (req, res) => {
  const rows = db.prepare('SELECT * FROM volunteer_tasks ORDER BY created_at DESC').all();
  const taskIds = rows.map((row) => row.id);
  const appliedUsersMap = loadAppliedUsersMap(taskIds);

  return res.json({
    items: rows.map((row) => mapTaskRow(row, appliedUsersMap.get(row.id) || []))
  });
});

router.get('/tasks/my', requireApprovedVolunteer, (req, res) => {
  const rows = db
    .prepare(`
      SELECT t.*
      FROM volunteer_tasks t
      INNER JOIN volunteer_task_applications a ON a.task_id = t.id
      WHERE a.user_id = ?
      ORDER BY a.created_at DESC
    `)
    .all(req.user.id);

  return res.json({
    items: rows.map((row) => mapTaskRow(row, [req.user.id]))
  });
});

router.post('/tasks/:taskId/apply', requireApprovedVolunteer, (req, res) => {
  const taskId = String(req.params.taskId || '').trim();
  if (!taskId) {
    return res.status(400).json({ error: 'Task id is required.' });
  }

  const task = db.prepare('SELECT id FROM volunteer_tasks WHERE id = ?').get(taskId);
  if (!task) {
    return res.status(404).json({ error: 'Task not found.' });
  }

  try {
    db.prepare(`
      INSERT INTO volunteer_task_applications (task_id, user_id, created_at)
      VALUES (?, ?, ?)
    `).run(taskId, req.user.id, nowIso());
  } catch (error) {
    if (String(error.message).includes('UNIQUE')) {
      return res.status(409).json({ error: 'You already applied for this task.' });
    }
    throw error;
  }

  return res.status(201).json({ ok: true });
});

router.post('/tasks', requireRole('manager', 'admin'), (req, res) => {
  const parsed = createTaskSchema.safeParse(req.body || {});
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid task payload.' });
  }

  const payload = parsed.data;
  const id = uuidv4();
  const now = nowIso();

  db.prepare(`
    INSERT INTO volunteer_tasks (
      id, title, description, date_text, location, marker, skills_required, urgency, created_at, updated_at
    )
    VALUES (
      @id, @title, @description, @dateText, @location, @marker, @skillsRequired, @urgency, @createdAt, @updatedAt
    )
  `).run({
    id,
    title: payload.title,
    description: payload.description,
    dateText: payload.date,
    location: payload.location,
    marker: payload.marker,
    skillsRequired: stringifyJson(payload.skillsRequired, []),
    urgency: payload.urgency,
    createdAt: now,
    updatedAt: now
  });

  const row = db.prepare('SELECT * FROM volunteer_tasks WHERE id = ?').get(id);
  return res.status(201).json({ item: mapTaskRow(row, []) });
});

router.delete('/tasks/:taskId', requireRole('manager', 'admin'), (req, res) => {
  const taskId = String(req.params.taskId || '').trim();
  if (!taskId) {
    return res.status(400).json({ error: 'Task id is required.' });
  }

  const result = db.prepare('DELETE FROM volunteer_tasks WHERE id = ?').run(taskId);
  if (!result.changes) {
    return res.status(404).json({ error: 'Task not found.' });
  }

  return res.json({ ok: true });
});

module.exports = router;
