const path = require('node:path');
const dotenv = require('dotenv');

const backendRoot = path.resolve(__dirname, '..');

dotenv.config({ path: path.join(backendRoot, '.env') });
dotenv.config();

const get = (name, fallback = '') => {
  const value = process.env[name];
  return value === undefined || value === null || value === '' ? fallback : value;
};

const parseOrigins = (raw) =>
  String(raw || '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);

module.exports = {
  backendRoot,
  port: Number(get('PORT', 8080)),
  databasePath: path.resolve(backendRoot, get('DATABASE_PATH', './data/mrija.db')),
  jwtSecret: get('JWT_SECRET', 'change-me-in-production'),
  jwtExpiresIn: get('JWT_EXPIRES_IN', '7d'),
  corsOrigins: parseOrigins(get('CORS_ORIGIN', 'http://localhost:3000,http://localhost:5173')),
  defaultAdmin: {
    email: get('ADMIN_EMAIL', ''),
    password: get('ADMIN_PASSWORD', ''),
    name: get('ADMIN_NAME', 'MriJa Admin'),
    phone: get('ADMIN_PHONE', '')
  },
  firebaseCredentialsPath: get('FIREBASE_ADMIN_CREDENTIALS_PATH', '')
};
