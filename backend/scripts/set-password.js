require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { db } = require('../src/db/connection');
const { hashPassword } = require('../src/utils/password');

async function run() {
  const email = process.argv[2];
  const pass = process.argv[3];
  if (!email || !pass) return console.log('Usage: node set-password.js email new_password');
  
  const hash = await hashPassword(pass);
  const info = db.prepare('UPDATE users SET password_hash = ? WHERE email = ?').run(hash, email);
  if (info.changes > 0) console.log('Password updated for ' + email);
  else console.log('User not found: ' + email);
}
run();
