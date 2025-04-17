
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const { connectToMongoDB } = require('../config/db');

const multer = require("multer");
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

const folderId = "1bmFALmb2ChoKIDDzvoVgnnx8UeGr4D2o";

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
  // const fileName = generateFilename(filePath);

  const fileName = path.basename(filePath); // "Kite IIIYear Milestone 2 Assignment.pdf"

// Extract filename without extension
  // const fileName = path.parse(fullFileName).name; 
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


// console.log("token : ",token);

async function saveToMongoDB(url, fileId, fileName, fileType,name , teacherid,token) {
  const { db, client } = await connectToMongoDB();
  const collection = db.collection('Drive');
//   await collection.insertOne({ 
//     name: name,
//     teacherid : teacherid,
//     role: "teacher", 
//     file_url: url, 
//     file_id: fileId,
//     file_name: fileName,
//     file_type: fileType,
//     timestamp: new Date() 
//   });



const input = { 
        name: name,
        teacherid : teacherid,
        role: "teacher", 
        file_url: url, 
        file_id: fileId,
        file_name: fileName,
        file_type: fileType,
        timestamp: new Date() 
      }
    console.log("token",[token]);
    const filter ={};
    const update = {
        $push: {
          [token]: input
        }
      };
    await collection.updateOne(filter, update,{ upsert: true });
  await client.close();
}

// function generateFilename(filePath) {
//   const extension = path.extname(filePath).toLowerCase();
//   const prefix = 'file';
//   const now = new Date();
//   const timestamp = now.toISOString()
//     .replace(/T/, '_')
//     .replace(/:/g, '')
//     .replace(/\..+/, '');
//   return `${prefix}_${timestamp}${extension}`;
// }
// const upload = multer({ dest: 'uploads/' });

// exports.uploadFileToDriveAndDB = async (req, res) => {
//   try {
  
  
//     const {  name , teacherId } = req.body;
    
//     // Validate file extension
//     const extension = path.extname(filePath).toLowerCase();
//     if (!['.pdf', '.docx', '.pptx', '.mp3'].includes(extension)) {
//       return res.status(400).json({ 
//         success: false, 
//         message: "Invalid file type. Only .pdf, .docx, .pptx, and .mp3 are allowed." 
//       });
//     }

//     const { url, fileId, fileName } = await uploadToDrive(filePath);
//     const fileType = extension.substring(1); // Remove the dot
//     await saveToMongoDB(url, fileId, fileName, fileType,name,teacherId);

//     return res.status(200).json({
//       success: true,
//       message: "File uploaded to Drive & URL saved in MongoDB.",
//       url,
//       fileId,
//       fileName,
//       fileType
//     });
//   } catch (err) {
//     console.error("Upload Error:", err);
//     return res.status(500).json({ 
//       success: false, 
//       message: "Upload failed.",
//       error: err.message 
//     });
//   }
// };
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');  // Store in the 'uploads/' folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);  // Keep the original filename
  }
});

const upload = multer({ storage: storage });  

exports.uploadFileToDriveAndDB = [
  // First step: handle file upload with Multer middleware
  upload.single('file'), 
  
  // Then process the uploaded file
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      // Get the full path to the uploaded file
      const AbsolutefilePath = path.resolve(req.file.path);

      // const filePath = path.relative(__dirname, AbsolutefilePath); 
      const filePath = path.relative(process.cwd(), AbsolutefilePath);  

      console.log("filePath",filePath);

      const { name, teacherId } = req.body;

      // Validate file extension
      const extension = path.extname(filePath).toLowerCase();
      if (!['.pdf', '.docx', '.pptx', '.mp3'].includes(extension)) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid file type. Only .pdf, .docx, .pptx, and .mp3 are allowed." 
        });
      }
      
      // const authHeader = req.headers['authorization'];
      // console.log("authheader:" ,authHeader)
      //   // Check if token exists in header
      //   if (!authHeader || !authHeader.startsWith('Bearer')) {
      //     return res.status(401).json({ message: 'Missing or invalid token' });
      //   }

      // const token = authHeader.split(' ')[1]; // Get the actual token part
      // console.log("token",token);

      const authHeader = req.headers['authorization'];
      console.log("authHeader:", authHeader);

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Missing or invalid token' });
      }

      const token = authHeader.trim().split(' ')[1]; // remove accidental spaces
      console.log("token:", token);
      // Assuming uploadToDrive() and saveToMongoDB are defined elsewhere
      const { url, fileId, fileName } = await uploadToDrive(filePath);
      const fileType = extension.substring(1); // Remove the dot
      await saveToMongoDB(url, fileId, fileName, fileType, name, teacherId,token);

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
  }
];

// This will delte the file from the drive
exports.deleteFileFromDriveAndDB = async (req, res) => {
  try {

    const authHeader = req.headers['authorization'];

    // Check if token exists in header
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Missing or invalid token' });
    }

    const token = authHeader.split(' ')[1]; // Get the actual token part

    const { fileId } = req.body;

    // Delete from Drive
    await driveService.files.delete({ fileId });

    // Delete from MongoDB
    const { db, client } = await connectToMongoDB();
    const collection = db.collection('Drive');
    // let fileid = {fileId};

    const filter = {}
    console.log({fileId});
    const update = {
        $pull : {
            [token] : {file_id : fileId}
        }
    }

    await collection.updateOne(filter, update);
    // await collection.deleteOne({ file_id: fileId });
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

// 

exports.renameFileOnDrive = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
      console.log("authheader", authHeader);
  // Check if token exists in header
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Missing or invalid token' });
    }

    const token = authHeader.split(' ')[1]; // Get the actual token part

    console.log("token",token);
        

      const { fileId, newName } = req.body;
  
      if (!fileId || !newName) {
        return res.status(400).json({
          success: false,
          message: "Both fileId and newName are required.",
        });
      }
  
      // Rename file in Google Drive
      await driveService.files.update({
        fileId,
        requestBody: {
          name: newName,
        },
      });
  
      // Connect to MongoDB
      const { db, client } = await connectToMongoDB();
      const collection = db.collection('Drive');
  
      // Update all matching elements in the 'jwt-token-1' array
      // const updateResult = await collection.updateMany(
      //   { "jwt-token-1.file_id": fileId },
      //   {
      //     $set: { "jwt-token-1.$[elem].file_name": newName },
      //   },
      //   {
      //     arrayFilters: [{ "elem.file_id": fileId }],
      //   }
      // );

      const updateResult = await collection.updateMany(
        { [`${token}.file_id`]: fileId },
        {
          $set: { [`${token}.$[elem].file_name`]: newName },
        },
        {
          arrayFilters: [{ "elem.file_id": fileId }],
        }
      );
  
      await client.close();
  
      if (updateResult.matchedCount === 0) {
        return res.status(404).json({
          success: false,
          message: "File not found in jwt-token-1 array.",
        });
      }
  
      return res.status(200).json({
        success: true,
        message: `File renamed to "${newName}" in Drive and DB.`,
        updatedCount: updateResult.modifiedCount,
      });
    } catch (err) {
      console.error("Rename Error:", err);
      return res.status(500).json({
        success: false,
        message: "Rename failed.",
        error: err.message,
      });
    }
  };


  // This function will give all the files uploaded to the drive by individual teacher 

  exports.filesUploadedByTeacher = async (req,res)=>{
    try {

      // Header is "authorization : Bearer 5243453423fds"
      const authHeader = req.headers['authorization'];
      console.log("authheader", authHeader);
      // Check if token exists in header
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Missing or invalid token' });
      }
      const token = authHeader.split(' ')[1]; // Get the actual token part
      console.log("token",token);
      if (!token) {
        return res.status(400).json({ success: false, message: "Token is missing in request headers." });
      }

      const { db, client } = await connectToMongoDB();
      const collection = db.collection('Drive');
      // const token = "jwt-token-1"; // You may receive this from `req.headers`, `req.cookies`, etc.

      const projection = {};
      projection[token] = 1; // Only include the specific token field in result

      const result = await collection.findOne({}, { projection });

      await client.close();

      if (!result || !result[token]) {
        return res.status(404).json({ success: false, message: "Token data not found in database." });
      }
      console.log(result[token]); 
      return res.status(200).json({
      success: true,
      token: token,
      data: result[token],
      });


      }
      catch(err){
        console.error("Error fetching token data:", err);
        return res.status(500).json({ success: false, message: "Internal server error", error: err.message });

      }
  }
  