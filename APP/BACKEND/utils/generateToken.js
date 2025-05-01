const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
require("dotenv").config()
const {connectToMongoDB} = require("../config/db")
const fs = require('fs');
const path = require('path');



const jwtSecret = process.env.JWT_SECRET;


function generateToken(uuid) {
  // console.log("jwt secert key => ",jwtSecret);
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
  console.log("token => ",token);
  return token;
}

async function insertDataToMongodb(input, collectionName){
  const {db, client } = await connectToMongoDB();
  const collection = db.collection(collectionName);
  try{
  await collection.insertOne(input);
  console.log(" Data inserted successfully into ", collectionName ,"collection");
  return true;
  }
  catch(error){
      return {message : error};
  }
  finally{
      client.close();
  }

}

const filePath = path.join(__dirname, 'ids.txt');

if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, '');
}

function generateUnique10DigitId() {
  const existingIds = new Set(
    fs.readFileSync(filePath, 'utf-8').split('\n').filter(Boolean)
  );

  let id;

  do {
    id = Math.floor(1000000000 + Math.random() * 9000000000).toString();
  } while (existingIds.has(id));

  // Save the new ID to the file
  fs.appendFileSync(filePath, id + '\n');
  return id;
}

module.exports = {generateToken, decryptToken, generateUserUUID,findTheTokenFromJwt,requestHeader,insertDataToMongodb,generateUnique10DigitId};