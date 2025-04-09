const { MongoClient } = require('mongodb');
require("dotenv").config();
// MongoDB connection URI and database name
// const MONGO_URI = "mongodb://localhost:27017";
const mongodb_url= process.env.MONGO_URI;
const dbName = "audio_db";

// Create a new MongoClient instance
const client = new MongoClient(mongodb_url);

// Function to connect to MongoDB
async function connectToMongoDB() {
  // Connect only if not already connected
  if (!client.isConnected?.()) {
    await client.connect();
    console.log("✅ MongoDB is connected successfully!");
  }

  // Get the database
  const db = client.db(dbName);

  // Return both db and client to be used elsewhere
  return { db, client };
}

// Export the function so it can be used in other files
module.exports = {
  connectToMongoDB,
};