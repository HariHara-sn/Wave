const { MongoClient } = require('mongodb');
const logger = require('../utils/logger');

const url = 'mongodb+srv://zdart2026:ibzPcNPmJ71uFhnw@cluster0.dryjxuy.mongodb.net/';
const dbName = 'LearnPro_AI'; //For Co-production

let client;

//database connection
async function connectToDatabase() {
    if (!client) {
        client = new MongoClient(url);
        try {
            await client.connect();
            logger.loggerSuccess('Connected to the database');
        } catch (error) {
            logger.loggerError(`Error connecting to the database: ${error}`);
            throw error;
        }
    }

    return client.db(dbName);
}

module.exports = { connectToDatabase };