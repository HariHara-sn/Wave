const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
require("dotenv").config()
const jwtSecret = process.env.JWT_SECRET;


function generateToken(uuid) {
  console.log("jwt secert key => ",jwtSecret);
  return jwt.sign({ uuid }, jwtSecret);
}

function decryptToken(token){
  return jwt.verify(token,jwtSecret);
}
function generateUserUUID(username) {
  const uuid = uuidv4();
  return `${username}-${uuid}`;
}

module.exports = {generateToken, decryptToken, generateUserUUID};