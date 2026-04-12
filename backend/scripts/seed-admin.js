const { v4: uuidv4 } = require('uuid');
const { defaultAdmin } = require('../src/config');
const { db } = require('../src/db/connection');
const { initSchema } = require('../src/db/schema');
const { hashPassword } = require('../src/utils/password');
const { nowIso } = require('../src/utils/time');

async function run() {
  initSchema();

  const email = String(defaultAdmin.email || '').trim().toLowerCase();
  const password = String(defaultAdmin.password || '').trim();
  const name = String(defaultAdmin.name || 'MriJa Admin').trim();
  const phone = String(defaultAdmin.phone || '').trim();

  if (!email || !password) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD are required in backend/.env');
  }

  const passwordHash = await hashPassword(password);
  const now = nowIso();
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);

  if (existing) {
    db.prepare(`
      UPDATE users
      SET password_hash = @passwordHash,
          role = 'admin',
          status = 'approved',
          name = @name,
          phone = @phone,
          updated_at = @updatedAt
      WHERE email = @email
    `).run({
      email,
      passwordHash,
      name,
      phone,
      updatedAt: now
    });

    console.log(`Updated existing admin account: ${email}`);
    return;
  }

  db.prepare(`
    INSERT INTO users (id, email, password_hash, name, phone, status, role, skills, created_at, updated_at)
    VALUES (@id, @email, @passwordHash, @name, @phone, 'approved', 'admin', '[]', @createdAt, @updatedAt)
  `).run({
    id: uuidv4(),
    email,
    passwordHash,
    name,
    phone,
    createdAt: now,
    updatedAt: now
  });

  console.log(`Created admin account: ${email}`);
}

run().catch((error) => {
  console.error('Failed to seed admin account:', error);
  process.exitCode = 1;
});
