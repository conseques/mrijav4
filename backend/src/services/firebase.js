const path = require('node:path');
const { backendRoot, firebaseCredentialsPath } = require('../config');

let _app = null;

function getFirebaseAdmin() {
  if (_app) {
    return _app;
  }

  try {
    // firebase-admin is an optional dependency for the exchange endpoint
    const admin = require('firebase-admin');

    if (admin.apps.length > 0) {
      _app = admin.apps[0];
      return _app;
    }

    const resolvedPath = firebaseCredentialsPath
      ? path.resolve(backendRoot, firebaseCredentialsPath)
      : null;

    if (!resolvedPath) {
      throw new Error(
        'FIREBASE_ADMIN_CREDENTIALS_PATH is not configured in .env – Firebase token exchange is unavailable.'
      );
    }

    const serviceAccount = require(resolvedPath);
    _app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });

    return _app;
  } catch (err) {
    throw new Error(`Firebase Admin SDK failed to initialise: ${err.message}`);
  }
}

/**
 * Verifies a Firebase ID token and returns the decoded payload.
 * @param {string} idToken
 */
async function verifyFirebaseIdToken(idToken) {
  const admin = require('firebase-admin');
  getFirebaseAdmin(); // ensure initialised
  return admin.auth().verifyIdToken(idToken);
}

module.exports = { verifyFirebaseIdToken };
