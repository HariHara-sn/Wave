const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
// const { MongoClient } = require('mongodb');
const { connectToMongoDB } = require('../config/db');
require("dotenv").config();

// MongoDB URI & setup
// const MONGO_URI = "mongodb://localhost:27017";
// const client = new MongoClient(MONGO_URI);
// const dbName = "audio_db";
// const collectionName = "audio_links";

// Google Drive setup
const KEYFILEPATH = '/home/britto/Zdart/Wave/APP/BACKEND/controllers/credentials.json';
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

async function uploadToDrive(filePath, fileName) {
  const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES,
  });

  const driveService = google.drive({ version: 'v3', auth });

  // Upload file
  const fileMetadata = {
    name: fileName,
  };
  const media = {
    mimeType: 'audio/mpeg',
    body: fs.createReadStream(filePath),
  };

  const file = await driveService.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id',
  });

  const fileId = file.data.id;

  // Make the file public
  await driveService.permissions.create({
    fileId,
    requestBody: {
      role: 'reader',
      type: 'anyone',
    },
  });

  // Return the shareable link
  const url = `https://drive.google.com/uc?id=${fileId}&export=download`;
  return url;
}

async function saveToMongoDB(url) {
  // await client.connect();
  // const db = client.db(dbName);
  // const collection = db.collection(collectionName);
  const { db, client } = await connectToMongoDB();
  const collection = db.collection('audio_links');
  await collection.insertOne({ audio_url: url, timestamp: new Date() });
  await client.close();
}

function generateFilename(prefix = 'file', ext = '.mp3') {
  const now = new Date();

  const timestamp = now.toISOString()
    .replace(/T/, '_')            // replace T with underscore
    .replace(/:/g, '')            // remove colons
    .replace(/\..+/, '');         // remove milliseconds and timezone

  return `${prefix}_${timestamp}${ext}`;
}

exports.uploadTheAudioToMongoDbCollection = async  (req,res)=> {
  // const filePath = '/home/britto/Zdart/sample-wave/file_to_drive/audiomass-output.mp3';  // change this
  

  try {
    const {filePath} = req.body;
    const fileName = generateFilename();
    console.log("Before uploadToDrive func");
    console.log("file path :",filePath, "file name : ",fileName);
    const url = await uploadToDrive(filePath, fileName);
    console.log("File uploaded! URL:", url);

    await saveToMongoDB(url);
    console.log("URL saved to MongoDB successfully.");
    return res.status(200).json({success:true,message:"Audio file was successfully added to the drive and the link is inserted in the collection of the database"});
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({success:false,message:"there was a problem on database inserting "});
  }
}

