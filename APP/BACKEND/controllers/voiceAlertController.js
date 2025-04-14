// const fs = require('fs');
// const path = require('path');
// const { google } = require('googleapis');
// const { connectToMongoDB } = require('../config/db');
// require("dotenv").config();

// // MongoDB URI & setup
// // const MONGO_URI = "mongodb://localhost:27017";
// // const client = new MongoClient(MONGO_URI);
// // const dbName = "audio_db";
// // const collectionName = "audio_links";

// // Google Drive setup
// const KEYFILEPATH = '/home/britto/Zdart/Wave/APP/BACKEND/controllers/credentials.json';
// const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

// async function uploadToDrive(filePath, fileName) {
//   const auth = new google.auth.GoogleAuth({
//     keyFile: KEYFILEPATH,
//     scopes: SCOPES,
//   });

//   const driveService = google.drive({ version: 'v3', auth });

//   // Upload file
//   const fileMetadata = {
//     name: fileName,
//   };
//   const media = {
//     mimeType: 'audio/mpeg',
//     body: fs.createReadStream(filePath),
//   };

//   const file = await driveService.files.create({
//     resource: fileMetadata,
//     media: media,
//     fields: 'id',
//   });

//   const fileId = file.data.id;

//   // Make the file public
//   await driveService.permissions.create({
//     fileId,
//     requestBody: {
//       role: 'reader',
//       type: 'anyone',
//     },
//   });

//   // Return the shareable link
//   const url = `https://drive.google.com/uc?id=${fileId}&export=download`;
//   return url;
// }

// async function saveToMongoDB(url) {
//   // await client.connect();
//   // const db = client.db(dbName);
//   // const collection = db.collection(collectionName);
//   const { db, client } = await connectToMongoDB();
//   const collection = db.collection('audio_links');
//   await collection.insertOne({ audio_url: url, timestamp: new Date() });
//   await client.close();
// }

// function generateFilename(prefix = 'file', ext = '.mp3') {
//   const now = new Date();

//   const timestamp = now.toISOString()
//     .replace(/T/, '_')            // replace T with underscore
//     .replace(/:/g, '')            // remove colons
//     .replace(/\..+/, '');         // remove milliseconds and timezone

//   return `${prefix}_${timestamp}${ext}`;
// }

// exports.uploadTheAudioToMongoDbCollection = async  (req,res)=> {
//   // const filePath = '/home/britto/Zdart/sample-wave/file_to_drive/audiomass-output.mp3';  // change this
  

//   try {
//     const {filePath} = req.body;
//     const fileName = generateFilename();
//     console.log("Before uploadToDrive func");
//     console.log("file path :",filePath, "file name : ",fileName);
//     const url = await uploadToDrive(filePath, fileName);
//     console.log("File uploaded! URL:", url);

//     await saveToMongoDB(url);
//     console.log("URL saved to MongoDB successfully.");
//     return res.status(200).json({success:true,message:"Audio file was successfully added to the drive and the link is inserted in the collection of the database"});
//   } catch (err) {
//     console.error("Error:", err);
//     return res.status(500).json({success:false,message:"there was a problem on database inserting "});
//   }
// }

// version 2

// const fs = require('fs');
// const { google } = require('googleapis');
// const { connectToMongoDB } = require('../config/db');
// require("dotenv").config();

// const KEYFILEPATH = '/home/britto/Zdart/Wave/APP/BACKEND/controllers/credentials.json';
// // const SCOPES = ['https://www.googleapis.com/auth/drive'];

// const SCOPES = [
//   'https://www.googleapis.com/auth/drive.file',
//   'https://www.googleapis.com/auth/drive.metadata'
// ];

// const auth = new google.auth.GoogleAuth({
//   keyFile: KEYFILEPATH,
//   scopes: SCOPES,
// });
// const driveService = google.drive({ version: 'v3', auth });

// // const folderId = "1dQ6ncw5jFQPracID-6HhLeavwV5C4kTI";

// let zdartFolderId = null;

// async function getOrCreateZdartFolder() {
//   if (zdartFolderId) return zdartFolderId;

//   const res = await driveService.files.list({
//     q: "mimeType='application/vnd.google-apps.folder' and name='Wave' and trashed=false",
//     fields: 'files(id, name)',
//   });

//   if (res.data.files.length > 0) {
//     zdartFolderId = res.data.files[0].id;
//   } else {
//     const folderMetadata = {
//       name: 'Wave',
//       mimeType: 'application/vnd.google-apps.folder',
//     };
//     const folder = await driveService.files.create({
//       resource: folderMetadata,
//       fields: 'id',
//     });
//     zdartFolderId = folder.data.id;
//   }

//   return zdartFolderId;
// }

// async function uploadToDrive(filePath, fileName) {
//   // const folderId = await getOrCreateZdartFolder();
// const folderId = "1dQ6ncw5jFQPracID-6HhLeavwV5C4kTI";

//   const fileMetadata = {
//     name: fileName,
//     parents: [folderId],
//     supportsAllDrives: true 
//   };
//   const media = {
//     mimeType: 'audio/mpeg' ,
//     body: fs.createReadStream(filePath),
//   };

//   const file = await driveService.files.create({
//     resource: fileMetadata,
//     media: media,
//     fields: 'id',
//     supportsAllDrives: true 
//   });

//   const fileId = file.data.id;

//   await driveService.permissions.create({
//     fileId,
//     requestBody: {
//       role: 'reader',
//       type: 'anyone',
//     },
//   });

//   const previewUrl = `https://drive.google.com/file/d/${fileId}/view`;
//   // const previewUrl = `https://drive.google.com/drive/folders/1dQ6ncw5jFQPracID-6HhLeavwV5C4kTI/${fileId}/view`;
//   return { url: previewUrl, fileId };
// }

// async function saveToMongoDB(url, fileId) {
//   const { db, client } = await connectToMongoDB();
//   const collection = db.collection('UploadFile');
//   await collection.insertOne({ "role" : "teacher", file_url: url, file_id: fileId, timestamp: new Date() });
//   await client.close();
// }

// function generateFilename(prefix = 'file', ext = '.mp3') {
//   const now = new Date();
//   const timestamp = now.toISOString()
//     .replace(/T/, '_')
//     .replace(/:/g, '')
//     .replace(/\..+/, '');
//   return `${prefix}_${timestamp}${ext}`;
// }

// exports.uploadTheAudioToMongoDbCollection = async (req, res) => {
//   try {
//     const { filePath } = req.body;
//     const fileName = generateFilename();
//     const { url, fileId } = await uploadToDrive(filePath, fileName);
//     await saveToMongoDB(url, fileId);

//     return res.status(200).json({
//       success: true,
//       message: "Audio uploaded to Drive & URL saved in MongoDB.",
//       url,
//       fileId,
//     });
//   } catch (err) {
//     console.error("Upload Error:", err);
//     return res.status(500).json({ success: false, message: "Upload failed." });
//   }
// };

// exports.deleteAudioFromDriveAndDB = async (req, res) => {
//   try {
//     const { fileId } = req.body;

//     // Delete from Drive
//     await driveService.files.delete({ fileId });

//     // Delete from MongoDB
//     const { db, client } = await connectToMongoDB();
//     const collection = db.collection('audio_links');
//     await collection.deleteOne({ file_id: fileId });
//     await client.close();

//     return res.status(200).json({
//       success: true,
//       message: `Audio file with ID ${fileId} deleted from Drive and DB.`,
//     });
//   } catch (err) {
//     console.error("Delete Error:", err);
//     return res.status(500).json({ success: false, message: "Delete failed." });
//   }
// };

// exports.renameAudioOnDrive = async (req, res) => {
//   try {
//     const { fileId, newName } = req.body;

//     await driveService.files.update({
//       fileId,
//       requestBody: {
//         name: newName,
//       },
//     });

//     return res.status(200).json({
//       success: true,
//       message: `Audio file renamed to "${newName}"`,
//     });
//   } catch (err) {
//     console.error("Rename Error:", err);
//     return res.status(500).json({ success: false, message: "Rename failed." });
//   }
// };

const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const { connectToMongoDB } = require('../config/db');
require("dotenv").config();

const KEYFILEPATH = 'controllers/credentials.json';
const SCOPES = [
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.metadata'
];

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});
const driveService = google.drive({ version: 'v3', auth });

const folderId = "1dQ6ncw5jFQPracID-6HhLeavwV5C4kTI";

// Function to get MIME type based on file extension
function getMimeType(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  
  const mimeTypes = {
    '.pdf': 'application/pdf',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    '.mp3': 'audio/mpeg'
  };

  return mimeTypes[extension] || 'application/octet-stream';
}

async function uploadToDrive(filePath) {
  const fileName = generateFilename(filePath);
  const mimeType = getMimeType(filePath);

  const fileMetadata = {
    name: fileName,
    parents: [folderId],
    supportsAllDrives: true 
  };

  const media = {
    mimeType: mimeType,
    body: fs.createReadStream(filePath),
  };

  const file = await driveService.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id',
    supportsAllDrives: true 
  });

  const fileId = file.data.id;

  await driveService.permissions.create({
    fileId,
    requestBody: {
      role: 'reader',
      type: 'anyone',
    },
  });

  const previewUrl = `https://drive.google.com/file/d/${fileId}/view`;
  return { url: previewUrl, fileId, fileName };
}

async function saveToMongoDB(url, fileId, fileName, fileType,name , teacherid) {
  const { db, client } = await connectToMongoDB();
  const collection = db.collection('UploadFile');
  await collection.insertOne({ 
    name: name,
    teacherid : teacherid,
    role: "teacher", 
    file_url: url, 
    file_id: fileId,
    file_name: fileName,
    file_type: fileType,
    timestamp: new Date() 
  });
  await client.close();
}

function generateFilename(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  const prefix = 'file';
  const now = new Date();
  const timestamp = now.toISOString()
    .replace(/T/, '_')
    .replace(/:/g, '')
    .replace(/\..+/, '');
  return `${prefix}_${timestamp}${extension}`;
}

exports.uploadFileToDriveAndDB = async (req, res) => {
  try {
    const { filePath , name , teacherId } = req.body;
    
    // Validate file extension
    const extension = path.extname(filePath).toLowerCase();
    if (!['.pdf', '.docx', '.pptx', '.mp3'].includes(extension)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid file type. Only .pdf, .docx, .pptx, and .mp3 are allowed." 
      });
    }

    const { url, fileId, fileName } = await uploadToDrive(filePath);
    const fileType = extension.substring(1); // Remove the dot
    await saveToMongoDB(url, fileId, fileName, fileType,name,teacherId);

    return res.status(200).json({
      success: true,
      message: "File uploaded to Drive & URL saved in MongoDB.",
      url,
      fileId,
      fileName,
      fileType
    });
  } catch (err) {
    console.error("Upload Error:", err);
    return res.status(500).json({ 
      success: false, 
      message: "Upload failed.",
      error: err.message 
    });
  }
};

// This will delte the file from the drive
exports.deleteFileFromDriveAndDB = async (req, res) => {
  try {
    const { fileId } = req.body;

    // Delete from Drive
    await driveService.files.delete({ fileId });

    // Delete from MongoDB
    const { db, client } = await connectToMongoDB();
    const collection = db.collection('UploadFile');
    await collection.deleteOne({ file_id: fileId });
    await client.close();

    return res.status(200).json({
      success: true,
      message: ` file with ID ${fileId} deleted from Drive and DB.`,
    });
  } catch (err) {
    console.error("Delete Error:", err);
    return res.status(500).json({ success: false, message: "Delete failed." });
  }
};

//renmae the file from the drive and update it in the database
// exports.renameFileOnDrive = async (req, res) => {
//     try {
//       const { fileId, newName } = req.body;
  
//       await driveService.files.update({
//         fileId,
//         requestBody: {
//           name: newName,
//         },
//       });
  
//       return res.status(200).json({
//         success: true,
//         message: ` file renamed to "${newName}"`,
//       });
//     } catch (err) {
//       console.error("Rename Error:", err);
//       return res.status(500).json({ success: false, message: "Rename failed." });
//     }
//   };

exports.renameFileOnDrive = async (req, res) => {
  try {
      const { fileId, newName } = req.body;

      // Validate input
      if (!fileId || !newName) {
          return res.status(400).json({
              success: false,
              message: "Both fileId and newName are required."
          });
      }

      // Rename file in Google Drive
      await driveService.files.update({
          fileId,
          requestBody: {
              name: newName,
          },
      });

      // Update filename in MongoDB
      const { db, client } = await connectToMongoDB();
      const collection = db.collection('UploadFile');
      
      const updateResult = await collection.updateOne(
          { file_id: fileId },
          { $set: { file_name: newName } }
      );

      await client.close();

      if (updateResult.matchedCount === 0) {
          return res.status(404).json({
              success: false,
              message: "File not found in database."
          });
      }

      return res.status(200).json({
          success: true,
          message: `File renamed to "${newName}" in both Drive and database.`,
          updatedCount: updateResult.modifiedCount
      });
  } catch (err) {
      console.error("Rename Error:", err);
      return res.status(500).json({
          success: false,
          message: "Rename failed.",
          error: err.message
      });
  }
};