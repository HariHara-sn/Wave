const {uploadFileToDriveAndDB, deleteFileFromDriveAndDB, renameFileOnDrive} = require("../controllers/voiceAlertController");

const express = require("express");

const app = express.Router();

app.post("/audioFile",uploadFileToDriveAndDB);
app.post("/deleteFile",deleteFileFromDriveAndDB);
app.post("/renameFile",renameFileOnDrive)

module.exports = app;