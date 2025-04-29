const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
require("dotenv").config()
const {connectToMongoDB} = require("../config/db")

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
  return token;
}

async function insertDataToMongodb(input , token){
  const {db, client } = await connectToMongoDB();
  const collection = db.collection('Posts');
  if(!token){
      return {message : "token was not present"};
  }
  try{
  const tokenDoc = await collection.findOne({ [token]: { $exists: true } });

  const update = {
      $push: {
        [token]: input
      }
    };

  await collection.updateOne({ [token]: { $exists: true } }, update);
  console.log(" Data inserted successfully");
  return true;
  }
  catch(error){
      return {message : error};
  }
  finally{
      client.close();
  }

}

module.exports = {generateToken, decryptToken, generateUserUUID,findTheTokenFromJwt,requestHeader,insertDataToMongodb};