const db_conn = require('../config/db');
const emailer = require('../middlewares/emailer');
const logger = require('../utils/logger');
let db;
const initializeDB = async () => {
    if (!db) {
        db = await db_conn.connectToDatabase();
    }
    return db;
};
initializeDB(); // Initialize the DB connection once


// USER DETAILS
// CompleteProfile
const CompleteProfile = async (req, res) => {
    try {
        const { username, user_id, email_id, phone_number } = req.body;

        // Validate input fields (missing & type validation)
        if (!username || typeof username !== 'string' ||
            !email_id || typeof email_id !== 'string' ||
            !user_id || !Number.isInteger(Number(user_id)) ||
            !phone_number || !Number.isInteger(Number(phone_number))) {
            return res.status(400).json({
                error: true,
                message: 'Invalid input: User ID and phone number must be integers, username and email ID must be strings, and all fields are required.'
            });
        }


        if (!db) {
            return res.status(500).json({
                error: true,
                message: 'Database connection failed. Please try again later.',
            });
        }
        const usersCollection = db.collection('users');

        // Check if the user exists
        const existingUser = await usersCollection.findOne({ user_id: user_id });
        if (!existingUser) {
            return res.status(404).json({ error: true, message: 'User not found' });
        }

        if (existingUser.username === username && existingUser.phone_no === phone_number) {
            return res.status(401).json({ error: true, message: 'no changes found' });
        }

        // Update user status
        const updateResult = await usersCollection.updateOne(
            { user_id: user_id },
            {
                $set: {
                    username: username,
                    phone_no: phone_number,
                    modified_by: email_id,
                    modified_date: new Date()
                }
            }
        );

        if (updateResult.matchedCount === 0) {
            logger.loggerWarn(`${email_id} - Failed to update account, please try again later!`);
            return res.status(500).json({ error: true, message: 'Failed to update account, please try again later!' });
        }

        logger.loggerSuccess(`${email_id} - Account updated successfully!`);
        return res.status(200).json({ error: false, message: 'Account updated successfully!' });

    } catch (error) {
        logger.loggerError(`editAccount - ${error.message}`);
        res.status(500).json({ error: true, message: 'Internal Server Error' });
    }
};
// fetch User Profile
const fetchuserprofile = async (req, res) => {
    try {
        const { user_id, email_id } = req.body;

        // Validate input
        if (!user_id || !Number.isInteger(user_id) || !email_id || typeof email_id !== 'string' || email_id.trim() === '') {
            return res.status(400).json({
                error: true,
                message: 'Invalid input: user_id must be a valid integer and email_id must be a non-empty string.',
            });
        }

        // Connect to database

        if (!db) {
            return res.status(500).json({
                error: true,
                message: 'Database connection failed. Please try again later.',
            });
        }
        const usersCollection = db.collection("users");

        // Find user with active status
        const user = await usersCollection.findOne({ user_id, email_id, status: true });

        if (!user) {
            return res.status(404).json({
                error: true,
                message: 'User not found or inactive.',
            });
        }

        // Prepare user data response
        const userData = {
            user_id: user.user_id,
            username: user.username,
            email_id: user.email_id,
            phone_no: user.phone_no,
            password: user.password,
            autostop: {
                price: user.autostop_price,
                time: user.autostop_time,
                unit: user.autostop_unit,
                price_isChecked: user.autostop_price_is_checked,
                time_isChecked: user.autostop_time_is_checked,
                unit_isChecked: user.autostop_unit_is_checked,
            },
        };

        return res.status(200).json({
            error: false,
            message: 'User profile retrieved successfully.',
            data: userData,
        });

    } catch (error) {
        logger.loggerError(`Error fetching user profile for user_id=${req.body?.user_id}, email_id=${req.body?.email_id}: ${error.message}`, { error });
        return res.status(500).json({
            error: true,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};




// ACCOUNT
// deleteAccount
const deleteAccount = async (req, res) => {
    try {
        const { email_id, user_id, reason } = req.body;

        // Validate input (missing & type validation)
        if (!email_id || typeof email_id !== 'string' ||
            !user_id || !Number.isInteger(Number(user_id)) ||
            !reason || typeof reason !== 'string') {
            return res.status(401).json({
                error: true,
                message: 'Invalid input: User ID must be an integer, and Email ID & reason must be strings. All fields are required.'
            });
        }


        if (!db) {
            return res.status(500).json({
                error: true,
                message: 'Database connection failed. Please try again later.',
            });
        }
        const usersCollection = db.collection('users');

        // Check if the user exists
        const existingUser = await usersCollection.findOne({ user_id: user_id });
        if (!existingUser) {
            return res.status(404).json({ error: true, message: 'User not found' });
        }

        // Update user status
        const updateResult = await usersCollection.updateOne(
            { user_id: user_id },
            {
                $set: {
                    reason: reason,
                    status: false,
                    modified_by: email_id,
                    modified_date: new Date()
                }
            }
        );

        if (updateResult.matchedCount === 0) {
            logger.loggerWarn(`${email_id} - Failed to delete account, Please try again later !`);
            return res.status(401).json({ error: true, message: 'Failed to delete account, Please try again later !' });
        }

        const sendEmail = await emailer.EmailConfig(email_id, mailHead = 'deleteAccount');

        if (sendEmail) {
            logger.loggerInfo(`${email_id} - Delete account mail sent.`);
        }

        logger.loggerSuccess(`${email_id} - Account deleted successfully !`);
        return res.status(200).json({ error: false, message: `Account deleted successfully !` });
    } catch (error) {
        logger.loggerError(`deleteAccount - ${error.message}`);
        res.status(500).json({ error: true, message: error.message });
    }
}

module.exports = {
    // USER DETAILS
    fetchuserprofile,
    CompleteProfile,
    // ACCOUNT
    deleteAccount
};