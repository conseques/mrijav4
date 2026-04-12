const { db } = require('./connection');

const schemaSql = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'volunteer', 'manager', 'admin')),
  skills TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  image_url TEXT NOT NULL,
  day TEXT NOT NULL,
  time TEXT NOT NULL,
  tag_type TEXT NOT NULL DEFAULT 'regular',
  locales TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS past_events (
  id TEXT PRIMARY KEY,
  image_url TEXT NOT NULL,
  date_text TEXT NOT NULL,
  tag TEXT NOT NULL DEFAULT 'community',
  locales TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS courses (
  id TEXT PRIMARY KEY,
  image_url TEXT NOT NULL,
  teacher_photo_url TEXT NOT NULL,
  phone TEXT NOT NULL,
  locales TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY,
  payload TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS registrations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  event_name TEXT NOT NULL,
  type TEXT DEFAULT 'event',
  source TEXT DEFAULT 'website',
  payment_reference TEXT DEFAULT '',
  payment_state TEXT DEFAULT 'registered',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS memberships (
  id TEXT PRIMARY KEY,
  first_name TEXT DEFAULT '',
  last_name TEXT DEFAULT '',
  name TEXT NOT NULL,
  email TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  source TEXT DEFAULT 'vipps_epayment',
  payment_reference TEXT NOT NULL,
  payment_state TEXT DEFAULT 'captured',
  vipps_sub TEXT DEFAULT '',
  psp_reference TEXT DEFAULT '',
  msn TEXT DEFAULT '',
  amount_value INTEGER DEFAULT 0,
  currency TEXT DEFAULT 'NOK',
  last_vipps_event TEXT DEFAULT '',
  payment_description TEXT DEFAULT '',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS volunteer_tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date_text TEXT NOT NULL,
  location TEXT NOT NULL,
  marker TEXT DEFAULT '',
  skills_required TEXT NOT NULL DEFAULT '[]',
  urgency TEXT NOT NULL DEFAULT 'Medium' CHECK (urgency IN ('Low', 'Medium', 'High')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS volunteer_task_applications (
  task_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (task_id, user_id),
  FOREIGN KEY (task_id) REFERENCES volunteer_tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_past_events_created_at ON past_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_courses_created_at ON courses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON registrations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_memberships_created_at ON memberships(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_volunteer_tasks_created_at ON volunteer_tasks(created_at DESC);
`;

const createDefaultReportSql = `
INSERT INTO reports (id, payload, updated_at)
VALUES (
  'main',
  '{"totalAmountRaised":35000,"goalAmount":150000,"livesImpacted":850,"activeProjects":5,"distribution":{"militaryAid":21000,"humanitarianAid":8750,"otherOrgsSupport":3500,"other":1750},"recentAllocations":[{"id":"1","project":"Slava Ukraini!","categoryKey":"militaryAidTitle","date":"Oct 24, 2023","amount":"13,450.00"},{"id":"2","project":"Ukrainian Freedom Convoys","categoryKey":"otherOrgsTitle","date":"Oct 22, 2023","amount":"10,000.00"}]}',
  @updatedAt
)
ON CONFLICT(id) DO NOTHING;
`;

function initSchema() {
  db.exec(schemaSql);
  db.prepare(createDefaultReportSql).run({ updatedAt: new Date().toISOString() });
}

module.exports = {
  initSchema
};
