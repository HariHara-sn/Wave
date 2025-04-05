const express = require('express');
const router = express.Router();
const Controller = require("../controllers/profileController");
const authUser = require("../middlewares/authenticated");




// USER DETAILS
router.post("/fetchuserprofile", authUser.isAuthenticated, Controller.fetchuserprofile); // Route to fetch user profile
router.post('/CompleteProfile', authUser.isAuthenticated, Controller.CompleteProfile); // Route to CompleteProfile


// ACCOUNT
// deleteAccount
router.post('/deleteAccount', authUser.isAuthenticated, Controller.deleteAccount);




// Export the router
module.exports = router;
