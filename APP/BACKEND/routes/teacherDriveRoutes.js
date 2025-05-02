const {uploadFileToDriveAndDB, deleteFileFromDriveAndDB, renameFileOnDrive,filesUploadedByTeacher, teacherWithClass} = require("../controllers/teacherDriveController");

const express = require("express");

const app = express.Router();

app.post("/uploadFile",uploadFileToDriveAndDB);
app.post("/deleteFile",deleteFileFromDriveAndDB);
app.post("/renameFile",renameFileOnDrive)
app.get("/receiveFile",filesUploadedByTeacher)
app.get("/teacherDetails",teacherWithClass);

module.exports = app;