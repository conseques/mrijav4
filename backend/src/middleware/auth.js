const { db } = require('../db/connection');
const { mapUserRow } = require('../utils/mappers');
const { decodeAccessToken } = require('../utils/tokens');

function getBearerToken(authHeader) {
  const source = String(authHeader || '');
  if (!source.startsWith('Bearer ')) {
    return '';
  }

  return source.slice('Bearer '.length).trim();
}

function authOptional(req, _res, next) {
  const token = getBearerToken(req.headers.authorization);

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const payload = decodeAccessToken(token);
    const userRow = db.prepare('SELECT * FROM users WHERE id = ?').get(payload.sub);
    req.user = mapUserRow(userRow);
  } catch {
    req.user = null;
  }

  return next();
}

function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication is required.' });
  }

  return next();
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication is required.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions.' });
    }

    return next();
  };
}

function requireApprovedVolunteer(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication is required.' });
  }

  const hasRole = ['volunteer', 'manager', 'admin'].includes(req.user.role);
  if (!hasRole || req.user.status !== 'approved') {
    return res.status(403).json({ error: 'Only approved volunteers can access this resource.' });
  }

  return next();
}

module.exports = {
  authOptional,
  requireApprovedVolunteer,
  requireAuth,
  requireRole
};
