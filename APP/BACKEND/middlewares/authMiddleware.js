const jwt = require('jsonwebtoken');
const { loggerInfo, loggerError } = require('../utils/logger');

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to check if the user is authenticated
const protect = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ error: true, message: 'Not authenticated, JWT token is missing!' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Attach decoded token data to request
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            loggerInfo(`Token expiry: ${err.message}, IP: ${req.ip}`);
            return res.status(401).json({ error: true, message: 'Token expired!' });
        }
        loggerError(`Invalid token: ${err.message}, IP: ${req.ip}`);
        return res.status(401).json({ error: true, message: 'Invalid token!' });
    }
};

// Alias for protect to maintain compatibility with existing code
const isAuthenticated = protect;

module.exports = { protect, isAuthenticated }; 