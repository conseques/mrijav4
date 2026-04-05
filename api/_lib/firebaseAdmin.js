const fs = require('node:fs');
const path = require('node:path');
const { cert, getApps, initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

function parseServiceAccountJson(rawJson) {
  const parsed = JSON.parse(rawJson);
  if (parsed.private_key) {
    parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
  }
  return parsed;
}

function getServiceAccountFromEnv() {
  if (process.env.FIREBASE_ADMIN_CREDENTIALS_JSON) {
    try {
      return parseServiceAccountJson(process.env.FIREBASE_ADMIN_CREDENTIALS_JSON);
    } catch (error) {
      throw new Error('FIREBASE_ADMIN_CREDENTIALS_JSON is not valid JSON.');
    }
  }

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    return null;
  }

  return {
    projectId,
    clientEmail,
    privateKey: privateKey.replace(/\\n/g, '\n'),
  };
}

function getServiceAccountFromFile() {
  const explicitPath = process.env.FIREBASE_ADMIN_CREDENTIALS_PATH;

  const candidatePaths = [
    explicitPath,
    ...fs.readdirSync(process.cwd())
      .filter((filename) => filename.includes('firebase-adminsdk') && filename.endsWith('.json'))
      .map((filename) => path.join(process.cwd(), filename)),
  ].filter(Boolean);

  for (const candidatePath of candidatePaths) {
    if (!fs.existsSync(candidatePath)) {
      continue;
    }

    try {
      return parseServiceAccountJson(fs.readFileSync(candidatePath, 'utf8'));
    } catch (error) {
      throw new Error(`Could not read Firebase service account from ${candidatePath}.`);
    }
  }

  return null;
}

function hasFirebaseAdminConfig() {
  return Boolean(
    process.env.FIREBASE_ADMIN_CREDENTIALS_JSON ||
      process.env.FIREBASE_ADMIN_CREDENTIALS_PATH ||
      (process.env.FIREBASE_ADMIN_PROJECT_ID &&
        process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
        process.env.FIREBASE_ADMIN_PRIVATE_KEY) ||
      fs.readdirSync(process.cwd()).some(
        (filename) => filename.includes('firebase-adminsdk') && filename.endsWith('.json')
      )
  );
}

function getFirebaseAdminApp() {
  const serviceAccount = getServiceAccountFromEnv() || getServiceAccountFromFile();

  if (!serviceAccount) {
    return null;
  }

  if (getApps().length > 0) {
    return getApps()[0];
  }

  return initializeApp({
    credential: cert(serviceAccount),
  });
}

function getFirebaseAdminDb() {
  const app = getFirebaseAdminApp();
  return app ? getFirestore(app) : null;
}

module.exports = {
  getFirebaseAdminDb,
  hasFirebaseAdminConfig,
};
