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

function findTheTokenFromJwt(req){

  const authHeader = req.headers['authorization'];
  console.log("authHeader:", authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid token' });
  }

  const json_token = authHeader.trim().split(' ')[1];
  return json_token;
}



function requestHeader(authHeader){
  if(!authHeader){
    return res.status(401).json({message : "authHeader is not received.. "});
  }
  const duu_token = authHeader.split(' ')[1]; // Get the actual token part
  const dee_token = decryptToken(duu_token);
  const token = dee_token.uuid;
  return token;
}

module.exports = {generateToken, decryptToken, generateUserUUID,findTheTokenFromJwt,requestHeader};