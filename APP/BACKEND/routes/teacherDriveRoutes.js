const {uploadFileToDriveAndDB, deleteFileFromDriveAndDB, renameFileOnDrive,filesUploadedByTeacher} = require("../controllers/teacherDriveController");

const express = require("express");

const app = express.Router();

app.post("/uploadFile",uploadFileToDriveAndDB);
app.post("/deleteFile",deleteFileFromDriveAndDB);
app.post("/renameFile",renameFileOnDrive)
app.get("/receiveFile",filesUploadedByTeacher)

module.exports = app;