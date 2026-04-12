const jwt = require('jsonwebtoken');
const { jwtExpiresIn, jwtSecret } = require('../config');

function createAccessToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      role: user.role,
      status: user.status
    },
    jwtSecret,
    { expiresIn: jwtExpiresIn }
  );
}

function decodeAccessToken(token) {
  return jwt.verify(token, jwtSecret);
}

module.exports = {
  createAccessToken,
  decodeAccessToken
};
