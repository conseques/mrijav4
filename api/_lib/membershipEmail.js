const crypto = require('node:crypto');
const nodemailer = require('nodemailer');
const { getFirebaseAdminDb } = require('./firebaseAdmin');

const DEFAULT_SITE_URL = 'https://www.mrija.no';
const MAX_EMAIL_ITEMS = 3;
const EMAIL_LOCK_WINDOW_MS = 10 * 60 * 1000;

function normalizeDate(value) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return value;
  }

  if (typeof value.toDate === 'function') {
    return value.toDate();
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function getSiteUrl() {
  return (process.env.PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, '');
}

function getLocalizedContent(record, fieldName, locale = 'en') {
  if (!record?.locales) {
    return '';
  }

  return (
    record.locales?.[locale]?.[fieldName] ||
    record.locales?.en?.[fieldName] ||
    record.locales?.no?.[fieldName] ||
    record.locales?.ua?.[fieldName] ||
    ''
  );
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getEmailConfig() {
  return {
    resendApiKey: process.env.RESEND_API_KEY || '',
    resendFrom: process.env.RESEND_FROM_EMAIL || '',
    resendReplyTo: process.env.RESEND_REPLY_TO_EMAIL || '',
    smtpHost: process.env.SMTP_HOST || '',
    smtpPort: Number(process.env.SMTP_PORT || 0),
    smtpSecure: String(process.env.SMTP_SECURE || '').toLowerCase() === 'true',
    smtpUser: process.env.SMTP_USER || '',
    smtpPass: process.env.SMTP_PASS || '',
    smtpFrom: process.env.SMTP_FROM_EMAIL || '',
    smtpReplyTo: process.env.SMTP_REPLY_TO_EMAIL || '',
    siteUrl: getSiteUrl(),
  };
}

function hasMembershipEmailConfig() {
  const config = getEmailConfig();
  return Boolean(
    (config.smtpHost && config.smtpPort && config.smtpUser && config.smtpPass && config.smtpFrom) ||
    (config.resendApiKey && config.resendFrom)
  );
}

async function getMembershipDigestData() {
  const db = getFirebaseAdminDb();

  if (!db) {
    throw new Error('Firebase Admin is required to build the membership digest email.');
  }

  const [eventsSnapshot, coursesSnapshot] = await Promise.all([
    db.collection('events').orderBy('createdAt', 'desc').limit(MAX_EMAIL_ITEMS).get(),
    db.collection('courses').orderBy('createdAt', 'desc').limit(MAX_EMAIL_ITEMS).get(),
  ]);

  return {
    events: eventsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })),
    courses: coursesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })),
  };
}

function buildMembershipDigestEmail({ memberName, events, courses, siteUrl }) {
  const safeMemberName = memberName || 'friend';
  const escapedName = escapeHtml(safeMemberName);
  const allEventsUrl = `${siteUrl}/events`;
  const allCoursesUrl = `${siteUrl}/#courses`;

  const eventItemsHtml = events.length > 0
    ? events.map((event) => {
        const name = escapeHtml(getLocalizedContent(event, 'name'));
        const description = escapeHtml(getLocalizedContent(event, 'description'));
        const day = escapeHtml(event.day || 'Date coming soon');
        const time = escapeHtml(event.time || 'Time to be announced');

        return `
          <li style="margin:0 0 18px;padding:0;">
            <strong style="display:block;font-size:16px;color:#0f172a;">${name}</strong>
            <span style="display:block;color:#1d4ed8;font-size:14px;margin-top:4px;">${day} • ${time}</span>
            <span style="display:block;color:#475569;font-size:14px;line-height:1.6;margin-top:6px;">${description}</span>
          </li>
        `;
      }).join('')
    : '<li style="color:#475569;">We are preparing new community events right now.</li>';

  const courseItemsHtml = courses.length > 0
    ? courses.map((course) => {
        const name = escapeHtml(getLocalizedContent(course, 'name'));
        const description = escapeHtml(getLocalizedContent(course, 'desc'));
        const level = escapeHtml(getLocalizedContent(course, 'levels'));
        const duration = escapeHtml(getLocalizedContent(course, 'duration'));
        const location = escapeHtml(getLocalizedContent(course, 'location'));

        return `
          <li style="margin:0 0 18px;padding:0;">
            <strong style="display:block;font-size:16px;color:#0f172a;">${name}</strong>
            <span style="display:block;color:#1d4ed8;font-size:14px;margin-top:4px;">${level}${duration ? ` • ${duration}` : ''}</span>
            <span style="display:block;color:#475569;font-size:14px;line-height:1.6;margin-top:6px;">${description}</span>
            ${location ? `<span style="display:block;color:#64748b;font-size:13px;margin-top:6px;">Location: ${location}</span>` : ''}
          </li>
        `;
      }).join('')
    : '<li style="color:#475569;">We will share new courses with you soon.</li>';

  const subject = `Your MriJa membership is active`;

  const text = [
    `Hi ${safeMemberName},`,
    '',
    'Thank you for joining MriJa. Your membership payment has been confirmed.',
    '',
    'Current courses:',
    ...courses.map((course) => {
      const name = getLocalizedContent(course, 'name');
      const level = getLocalizedContent(course, 'levels');
      const duration = getLocalizedContent(course, 'duration');
      const location = getLocalizedContent(course, 'location');
      return `- ${name}${level ? ` | ${level}` : ''}${duration ? ` | ${duration}` : ''}${location ? ` | ${location}` : ''}`;
    }),
    '',
    'Upcoming events:',
    ...events.map((event) => {
      const name = getLocalizedContent(event, 'name');
      return `- ${name}${event.day ? ` | ${event.day}` : ''}${event.time ? ` | ${event.time}` : ''}`;
    }),
    '',
    `All courses: ${allCoursesUrl}`,
    `All events: ${allEventsUrl}`,
    '',
    'We are glad to have you with us.',
    'MriJa',
  ].join('\n');

  const html = `
    <div style="background:#f8fafc;padding:32px 16px;font-family:Arial,sans-serif;color:#0f172a;">
      <div style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:24px;overflow:hidden;border:1px solid #e2e8f0;">
        <div style="padding:32px;background:linear-gradient(135deg,#f97316 0%,#0f766e 100%);color:#ffffff;">
          <p style="margin:0 0 10px;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;opacity:0.85;">MriJa Membership</p>
          <h1 style="margin:0;font-size:28px;line-height:1.2;">Welcome to the community, ${escapedName}</h1>
          <p style="margin:14px 0 0;font-size:16px;line-height:1.6;max-width:520px;">
            Your membership payment has been confirmed. Here is a quick overview of the courses and community events that are active right now.
          </p>
        </div>

        <div style="padding:28px 32px 6px;">
          <h2 style="margin:0 0 16px;font-size:22px;color:#0f172a;">Current courses</h2>
          <ul style="margin:0;padding-left:18px;">${courseItemsHtml}</ul>
          <p style="margin:18px 0 0;">
            <a href="${allCoursesUrl}" style="color:#0f766e;text-decoration:none;font-weight:600;">See all courses</a>
          </p>
        </div>

        <div style="padding:18px 32px 6px;">
          <h2 style="margin:0 0 16px;font-size:22px;color:#0f172a;">Upcoming events and activities</h2>
          <ul style="margin:0;padding-left:18px;">${eventItemsHtml}</ul>
          <p style="margin:18px 0 0;">
            <a href="${allEventsUrl}" style="color:#0f766e;text-decoration:none;font-weight:600;">See all events</a>
          </p>
        </div>

        <div style="padding:24px 32px 32px;">
          <p style="margin:0;color:#475569;font-size:14px;line-height:1.7;">
            We are glad to have you with us. If you have any questions, just reply to this email and the MriJa team will help you.
          </p>
        </div>
      </div>
    </div>
  `;

  return {
    subject,
    html,
    text,
  };
}

async function sendResendEmail({ to, subject, html, text, tags = [] }) {
  const config = getEmailConfig();
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.resendApiKey}`,
      'Content-Type': 'application/json',
      'User-Agent': 'mrija-web/1.0',
      'Idempotency-Key': crypto.randomUUID(),
    },
    body: JSON.stringify({
      from: config.resendFrom,
      to: [to],
      reply_to: config.resendReplyTo || undefined,
      subject,
      html,
      text,
      tags,
    }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok || !payload.id) {
    throw new Error(payload.message || payload.error || 'Resend email request failed.');
  }

  return payload;
}

function createSmtpTransport() {
  const config = getEmailConfig();

  return nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    secure: config.smtpSecure || config.smtpPort === 465,
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass,
    },
    tls: {
      minVersion: 'TLSv1.2',
    },
  });
}

async function sendSmtpEmail({ to, subject, html, text }) {
  const config = getEmailConfig();
  const transporter = createSmtpTransport();
  const response = await transporter.sendMail({
    from: config.smtpFrom,
    to,
    replyTo: config.smtpReplyTo || undefined,
    subject,
    html,
    text,
  });

  if (!response.messageId) {
    throw new Error('SMTP provider did not return a message id.');
  }

  return {
    id: response.messageId,
    accepted: response.accepted || [],
    rejected: response.rejected || [],
  };
}

async function sendMembershipEmailPayload({ to, subject, html, text, reference = 'preview' }) {
  const config = getEmailConfig();

  if (config.smtpHost) {
    return {
      provider: 'smtp',
      ...(await sendSmtpEmail({ to, subject, html, text })),
    };
  }

  return {
    provider: 'resend',
    ...(await sendResendEmail({
      to,
      subject,
      html,
      text,
      tags: [
        { name: 'flow', value: 'membership' },
        { name: 'reference', value: reference },
      ],
    })),
  };
}

async function claimMembershipEmailSend(reference) {
  const db = getFirebaseAdminDb();

  if (!db) {
    return { shouldSend: false, reason: 'missing_firebase_admin' };
  }

  const membershipRef = db.collection('memberships').doc(reference);

  return db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(membershipRef);
    const data = snapshot.exists ? snapshot.data() : {};

    const sentAt = normalizeDate(data.welcomeEmailSentAt);
    if (sentAt) {
      return { shouldSend: false, reason: 'already_sent' };
    }

    const lastAttemptAt = normalizeDate(data.welcomeEmailLastAttemptedAt);
    if (
      data.welcomeEmailStatus === 'sending' &&
      lastAttemptAt &&
      Date.now() - lastAttemptAt.getTime() < EMAIL_LOCK_WINDOW_MS
    ) {
      return { shouldSend: false, reason: 'already_in_progress' };
    }

    transaction.set(
      membershipRef,
      {
        welcomeEmailStatus: 'sending',
        welcomeEmailLastAttemptedAt: new Date(),
        welcomeEmailError: '',
      },
      { merge: true }
    );

    return { shouldSend: true, reason: 'ready' };
  });
}

async function storeMembershipEmailResult(reference, result) {
  const db = getFirebaseAdminDb();

  if (!db) {
    return;
  }

  await db.collection('memberships').doc(reference).set(result, { merge: true });
}

async function sendMembershipDigestEmail({ reference, memberName, memberEmail }) {
  if (!memberEmail) {
    return { status: 'skipped', reason: 'missing_email' };
  }

  if (!hasMembershipEmailConfig()) {
    return { status: 'skipped', reason: 'missing_email_provider_config' };
  }

  const claim = await claimMembershipEmailSend(reference);
  if (!claim.shouldSend) {
    return { status: 'skipped', reason: claim.reason };
  }

  try {
    const { events, courses } = await getMembershipDigestData();
    const email = buildMembershipDigestEmail({
      memberName,
      events,
      courses,
      siteUrl: getSiteUrl(),
    });
    const response = await sendMembershipEmailPayload({
      to: memberEmail,
      subject: email.subject,
      html: email.html,
      text: email.text,
      reference,
    });
    const provider = response.provider;

    await storeMembershipEmailResult(reference, {
      welcomeEmailStatus: 'sent',
      welcomeEmailSentAt: new Date(),
      welcomeEmailProvider: provider,
      welcomeEmailId: response.id,
      welcomeEmailError: '',
    });

    return {
      status: 'sent',
      provider,
      id: response.id,
    };
  } catch (error) {
    await storeMembershipEmailResult(reference, {
      welcomeEmailStatus: 'failed',
      welcomeEmailError: error.message || 'Could not send welcome email.',
    });

    return {
      status: 'failed',
      reason: error.message || 'Could not send welcome email.',
    };
  }
}

async function sendMembershipDigestPreviewEmail({ to, memberName = 'friend' }) {
  if (!hasMembershipEmailConfig()) {
    return { status: 'skipped', reason: 'missing_email_provider_config' };
  }

  const { events, courses } = await getMembershipDigestData();
  const email = buildMembershipDigestEmail({
    memberName,
    events,
    courses,
    siteUrl: getSiteUrl(),
  });

  const response = await sendMembershipEmailPayload({
    to,
    subject: `[Preview] ${email.subject}`,
    html: email.html,
    text: email.text,
    reference: 'preview',
  });

  return {
    status: 'sent',
    provider: response.provider,
    id: response.id,
    accepted: response.accepted || [],
    rejected: response.rejected || [],
  };
}

module.exports = {
  buildMembershipDigestEmail,
  createSmtpTransport,
  getMembershipDigestData,
  hasMembershipEmailConfig,
  sendMembershipDigestEmail,
  sendMembershipDigestPreviewEmail,
};
