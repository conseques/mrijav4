const fs = require('node:fs');
const path = require('node:path');
const { cert, getApps, initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { db } = require('../src/db/connection');
const { initSchema } = require('../src/db/schema');
const { stringifyJson } = require('../src/utils/json');
const { nowIso } = require('../src/utils/time');
const { firebaseCredentialsPath } = require('../src/config');

function parseServiceAccount(rawJson) {
  const parsed = JSON.parse(rawJson);
  if (parsed.private_key) {
    parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
  }
  return parsed;
}

function loadServiceAccount() {
  if (process.env.FIREBASE_ADMIN_CREDENTIALS_JSON) {
    return parseServiceAccount(process.env.FIREBASE_ADMIN_CREDENTIALS_JSON);
  }

  const explicitPath = firebaseCredentialsPath
    ? path.resolve(__dirname, firebaseCredentialsPath)
    : null;
  const rootPath = path.resolve(__dirname, '../../mrija-web-firebase-adminsdk-fbsvc-a14dbe45db.json');
  const fallbackPath = path.resolve(__dirname, '../../');

  const candidates = [
    explicitPath,
    rootPath,
    ...fs
      .readdirSync(fallbackPath)
      .filter((fileName) => fileName.includes('firebase-adminsdk') && fileName.endsWith('.json'))
      .map((fileName) => path.join(fallbackPath, fileName))
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (!fs.existsSync(candidate)) {
      continue;
    }

    return parseServiceAccount(fs.readFileSync(candidate, 'utf8'));
  }

  throw new Error(
    'Firebase credentials were not found. Set FIREBASE_ADMIN_CREDENTIALS_PATH or FIREBASE_ADMIN_CREDENTIALS_JSON.'
  );
}

function getFirebaseDb() {
  if (getApps().length === 0) {
    initializeApp({
      credential: cert(loadServiceAccount())
    });
  }

  return getFirestore();
}

function toIso(value) {
  if (!value) {
    return nowIso();
  }

  if (typeof value === 'string') {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? nowIso() : new Date(parsed).toISOString();
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value.toDate === 'function') {
    return value.toDate().toISOString();
  }

  if (typeof value.seconds === 'number') {
    return new Date(value.seconds * 1000).toISOString();
  }

  return nowIso();
}

function migrateEvents(collectionSnapshot) {
  const statement = db.prepare(`
    INSERT INTO events (id, image_url, day, time, tag_type, locales, created_at, updated_at)
    VALUES (@id, @imageUrl, @day, @time, @tagType, @locales, @createdAt, @updatedAt)
    ON CONFLICT(id) DO UPDATE SET
      image_url = excluded.image_url,
      day = excluded.day,
      time = excluded.time,
      tag_type = excluded.tag_type,
      locales = excluded.locales,
      updated_at = excluded.updated_at
  `);

  let imported = 0;
  for (const docSnapshot of collectionSnapshot.docs) {
    const data = docSnapshot.data() || {};
    const createdAt = toIso(data.createdAt);
    statement.run({
      id: docSnapshot.id,
      imageUrl: data.imageUrl || '',
      day: data.day || '',
      time: data.time || '',
      tagType: data.tagType || 'regular',
      locales: stringifyJson(data.locales || {}, {}),
      createdAt,
      updatedAt: toIso(data.updatedAt || data.createdAt)
    });
    imported += 1;
  }

  return imported;
}

function migratePastEvents(collectionSnapshot) {
  const statement = db.prepare(`
    INSERT INTO past_events (id, image_url, date_text, tag, locales, created_at, updated_at)
    VALUES (@id, @imageUrl, @dateText, @tag, @locales, @createdAt, @updatedAt)
    ON CONFLICT(id) DO UPDATE SET
      image_url = excluded.image_url,
      date_text = excluded.date_text,
      tag = excluded.tag,
      locales = excluded.locales,
      updated_at = excluded.updated_at
  `);

  let imported = 0;
  for (const docSnapshot of collectionSnapshot.docs) {
    const data = docSnapshot.data() || {};
    statement.run({
      id: docSnapshot.id,
      imageUrl: data.imageUrl || '',
      dateText: data.date || '',
      tag: data.tag || 'community',
      locales: stringifyJson(data.locales || {}, {}),
      createdAt: toIso(data.createdAt),
      updatedAt: toIso(data.updatedAt || data.createdAt)
    });
    imported += 1;
  }

  return imported;
}

function migrateCourses(collectionSnapshot) {
  const statement = db.prepare(`
    INSERT INTO courses (id, image_url, teacher_photo_url, phone, locales, created_at, updated_at)
    VALUES (@id, @imageUrl, @teacherPhotoUrl, @phone, @locales, @createdAt, @updatedAt)
    ON CONFLICT(id) DO UPDATE SET
      image_url = excluded.image_url,
      teacher_photo_url = excluded.teacher_photo_url,
      phone = excluded.phone,
      locales = excluded.locales,
      updated_at = excluded.updated_at
  `);

  let imported = 0;
  for (const docSnapshot of collectionSnapshot.docs) {
    const data = docSnapshot.data() || {};
    statement.run({
      id: docSnapshot.id,
      imageUrl: data.imageUrl || '',
      teacherPhotoUrl: data.teacherPhotoUrl || '',
      phone: data.phone || '',
      locales: stringifyJson(data.locales || {}, {}),
      createdAt: toIso(data.createdAt),
      updatedAt: toIso(data.updatedAt || data.createdAt)
    });
    imported += 1;
  }

  return imported;
}

function migrateReports(collectionSnapshot) {
  const statement = db.prepare(`
    INSERT INTO reports (id, payload, updated_at)
    VALUES (@id, @payload, @updatedAt)
    ON CONFLICT(id) DO UPDATE SET
      payload = excluded.payload,
      updated_at = excluded.updated_at
  `);

  let imported = 0;
  for (const docSnapshot of collectionSnapshot.docs) {
    const data = docSnapshot.data() || {};
    statement.run({
      id: docSnapshot.id,
      payload: stringifyJson(data, {}),
      updatedAt: toIso(data.updatedAt || data.createdAt)
    });
    imported += 1;
  }

  return imported;
}

function migrateRegistrations(collectionSnapshot) {
  const statement = db.prepare(`
    INSERT INTO registrations (
      id, name, email, phone, event_name, type, source, payment_reference, payment_state, created_at
    )
    VALUES (
      @id, @name, @email, @phone, @eventName, @type, @source, @paymentReference, @paymentState, @createdAt
    )
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      email = excluded.email,
      phone = excluded.phone,
      event_name = excluded.event_name,
      type = excluded.type,
      source = excluded.source,
      payment_reference = excluded.payment_reference,
      payment_state = excluded.payment_state,
      created_at = excluded.created_at
  `);

  let imported = 0;
  for (const docSnapshot of collectionSnapshot.docs) {
    const data = docSnapshot.data() || {};
    statement.run({
      id: docSnapshot.id,
      name: data.name || 'Unknown',
      email: String(data.email || '').toLowerCase(),
      phone: data.phone || '',
      eventName: data.eventName || 'Unknown event',
      type: data.type || 'event',
      source: data.source || 'website',
      paymentReference: data.paymentReference || '',
      paymentState: data.paymentState || 'registered',
      createdAt: toIso(data.createdAt)
    });
    imported += 1;
  }

  return imported;
}

function migrateMemberships(collectionSnapshot) {
  const statement = db.prepare(`
    INSERT INTO memberships (
      id, first_name, last_name, name, email, phone, source, payment_reference, payment_state, vipps_sub,
      psp_reference, msn, amount_value, currency, last_vipps_event, payment_description, created_at
    )
    VALUES (
      @id, @firstName, @lastName, @name, @email, @phone, @source, @paymentReference, @paymentState, @vippsSub,
      @pspReference, @msn, @amountValue, @currency, @lastVippsEvent, @paymentDescription, @createdAt
    )
    ON CONFLICT(id) DO UPDATE SET
      first_name = excluded.first_name,
      last_name = excluded.last_name,
      name = excluded.name,
      email = excluded.email,
      phone = excluded.phone,
      source = excluded.source,
      payment_reference = excluded.payment_reference,
      payment_state = excluded.payment_state,
      vipps_sub = excluded.vipps_sub,
      psp_reference = excluded.psp_reference,
      msn = excluded.msn,
      amount_value = excluded.amount_value,
      currency = excluded.currency,
      last_vipps_event = excluded.last_vipps_event,
      payment_description = excluded.payment_description,
      created_at = excluded.created_at
  `);

  let imported = 0;
  for (const docSnapshot of collectionSnapshot.docs) {
    const data = docSnapshot.data() || {};
    statement.run({
      id: docSnapshot.id,
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      name: data.name || 'Vipps member',
      email: String(data.email || '').toLowerCase(),
      phone: data.phone || '',
      source: data.source || 'vipps_epayment',
      paymentReference: data.paymentReference || docSnapshot.id,
      paymentState: data.paymentState || 'captured',
      vippsSub: data.vippsSub || '',
      pspReference: data.pspReference || '',
      msn: data.msn || '',
      amountValue: Number(data.amountValue || 0),
      currency: data.currency || 'NOK',
      lastVippsEvent: data.lastVippsEvent || '',
      paymentDescription: data.paymentDescription || '',
      createdAt: toIso(data.createdAt)
    });
    imported += 1;
  }

  return imported;
}

function migrateVolunteers(collectionSnapshot) {
  const statement = db.prepare(`
    INSERT INTO users (
      id, email, password_hash, name, phone, status, role, skills, created_at, updated_at
    )
    VALUES (
      @id, @email, @passwordHash, @name, @phone, @status, @role, @skills, @createdAt, @updatedAt
    )
    ON CONFLICT(id) DO UPDATE SET
      email = excluded.email,
      name = excluded.name,
      phone = excluded.phone,
      status = excluded.status,
      role = excluded.role,
      skills = excluded.skills,
      updated_at = excluded.updated_at
  `);

  let imported = 0;
  for (const docSnapshot of collectionSnapshot.docs) {
    const data = docSnapshot.data() || {};
    statement.run({
      id: docSnapshot.id,
      email: String(data.email || '').toLowerCase(),
      passwordHash: `firebase-migrated:${docSnapshot.id}`,
      name: data.name || 'Volunteer',
      phone: data.phone || '',
      status: data.status || 'pending',
      role: data.role || 'user',
      skills: stringifyJson(data.skills || [], []),
      createdAt: toIso(data.createdAt),
      updatedAt: toIso(data.updatedAt || data.createdAt)
    });
    imported += 1;
  }

  return imported;
}

function migrateVolunteerTasks(collectionSnapshot) {
  const taskStatement = db.prepare(`
    INSERT INTO volunteer_tasks (
      id, title, description, date_text, location, marker, skills_required, urgency, created_at, updated_at
    )
    VALUES (
      @id, @title, @description, @dateText, @location, @marker, @skillsRequired, @urgency, @createdAt, @updatedAt
    )
    ON CONFLICT(id) DO UPDATE SET
      title = excluded.title,
      description = excluded.description,
      date_text = excluded.date_text,
      location = excluded.location,
      marker = excluded.marker,
      skills_required = excluded.skills_required,
      urgency = excluded.urgency,
      updated_at = excluded.updated_at
  `);

  const applicationStatement = db.prepare(`
    INSERT INTO volunteer_task_applications (task_id, user_id, created_at)
    VALUES (@taskId, @userId, @createdAt)
    ON CONFLICT(task_id, user_id) DO NOTHING
  `);

  let importedTasks = 0;
  let importedApplications = 0;
  for (const docSnapshot of collectionSnapshot.docs) {
    const data = docSnapshot.data() || {};
    const createdAt = toIso(data.createdAt);

    taskStatement.run({
      id: docSnapshot.id,
      title: data.title || 'Untitled task',
      description: data.description || '',
      dateText: data.date || '',
      location: data.location || '',
      marker: data.marker || '',
      skillsRequired: stringifyJson(data.skillsRequired || [], []),
      urgency: data.urgency || 'Medium',
      createdAt,
      updatedAt: toIso(data.updatedAt || data.createdAt)
    });
    importedTasks += 1;

    const appliedUsers = Array.isArray(data.appliedUsers) ? data.appliedUsers : [];
    for (const userId of appliedUsers) {
      if (!userId) {
        continue;
      }
      applicationStatement.run({
        taskId: docSnapshot.id,
        userId,
        createdAt
      });
      importedApplications += 1;
    }
  }

  return {
    importedTasks,
    importedApplications
  };
}

async function runMigration() {
  initSchema();
  const firebaseDb = getFirebaseDb();

  const [
    eventsSnap,
    pastEventsSnap,
    coursesSnap,
    reportsSnap,
    registrationsSnap,
    membershipsSnap,
    volunteersSnap,
    volunteerTasksSnap
  ] = await Promise.all([
    firebaseDb.collection('events').get(),
    firebaseDb.collection('past_events').get(),
    firebaseDb.collection('courses').get(),
    firebaseDb.collection('reports').get(),
    firebaseDb.collection('registrations').get(),
    firebaseDb.collection('memberships').get(),
    firebaseDb.collection('volunteers').get(),
    firebaseDb.collection('volunteerTasks').get()
  ]);

  const stats = {
    events: migrateEvents(eventsSnap),
    pastEvents: migratePastEvents(pastEventsSnap),
    courses: migrateCourses(coursesSnap),
    reports: migrateReports(reportsSnap),
    registrations: migrateRegistrations(registrationsSnap),
    memberships: migrateMemberships(membershipsSnap),
    volunteers: migrateVolunteers(volunteersSnap),
    volunteerTasks: migrateVolunteerTasks(volunteerTasksSnap)
  };

  console.log('Firebase -> backend migration completed.');
  console.table({
    events: stats.events,
    pastEvents: stats.pastEvents,
    courses: stats.courses,
    reports: stats.reports,
    registrations: stats.registrations,
    memberships: stats.memberships,
    volunteers: stats.volunteers,
    volunteerTasks: stats.volunteerTasks.importedTasks,
    taskApplications: stats.volunteerTasks.importedApplications
  });
}

runMigration().catch((error) => {
  console.error('Migration failed:', error);
  process.exitCode = 1;
});
