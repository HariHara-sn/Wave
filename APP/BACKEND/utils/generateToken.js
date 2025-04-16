const jwt = require('jsonwebtoken');

const jwtSecret = 'wavesecretkey123';

function generateToken(username) {
  return jwt.sign({ username }, jwtSecret);
}

module.exports = generateToken;