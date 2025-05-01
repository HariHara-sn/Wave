const { MongoClient } = require('mongodb');
require("dotenv").config();
// const MONGO_URI = "mongodb://localhost:27017";
const mongodb_url= process.env.MONGO_URI;
const dbName = "Wave";

const client = new MongoClient(mongodb_url);

async function connectToMongoDB() {
  // Connect only if not already connected
  if (!client.isConnected?.()) {
    await client.connect();
    console.log("✅ MongoDB is connected successfully!");
  }

  const db = client.db(dbName);

  return { db, client };
}

module.exports = {
  connectToMongoDB,
};