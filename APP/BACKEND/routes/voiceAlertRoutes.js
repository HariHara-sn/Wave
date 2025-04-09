const {uploadTheAudioToMongoDbCollection} = require("../controllers/voiceAlertController");

const express = require("express");

const app = express.Router();

app.post("/audioFile",uploadTheAudioToMongoDbCollection);

module.exports = app;