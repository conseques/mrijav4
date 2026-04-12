const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 12;

async function hashPassword(plainPassword) {
  return bcrypt.hash(String(plainPassword || ''), SALT_ROUNDS);
}

async function verifyPassword(plainPassword, passwordHash) {
  if (!passwordHash) {
    return false;
  }

  if (String(passwordHash).startsWith('firebase-migrated:')) {
    return false;
  }

  return bcrypt.compare(String(plainPassword || ''), String(passwordHash));
}

module.exports = {
  hashPassword,
  verifyPassword
};
