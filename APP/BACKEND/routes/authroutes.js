const express = require('express');
const router = express.Router();
const { register, login , detailsOfTeacher } = require('../controllers/authController');


router.post('/register', register);
router.get('/login', login);
router.post('/detailsOfTeacher',detailsOfTeacher);

module.exports = router;
