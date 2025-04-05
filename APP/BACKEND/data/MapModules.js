const otpStore = new Map(); // Stores OTPs for verification
const clientConnections = new Set(); // Active client WebSocket connections
const wsConnections = new Map(); // Maps client IDs to WebSocket instances
const clients = new Map(); // Stores client-related data


module.exports = {
    otpStore,
    clientConnections,
    wsConnections,
    clients
};
