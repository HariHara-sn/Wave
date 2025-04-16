const {uploadFileToDriveAndDB, deleteFileFromDriveAndDB, renameFileOnDrive} = require("../controllers/teacherDriveController");

const express = require("express");

const app = express.Router();

app.post("/uploadFile",uploadFileToDriveAndDB);
app.post("/deleteFile",deleteFileFromDriveAndDB);
app.post("/renameFile",renameFileOnDrive)

module.exports = app;