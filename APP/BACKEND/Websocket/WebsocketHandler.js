require('dotenv').config();
const logger = require('../utils/logger');

const handleWebSocketConnection = (
    WebSocket,
    wss,
    ClientWss,
    wsConnections,
    ClientConnections,
    clients
) => {
    wss.on('connection', async (ws, req) => {
        ws.isAlive = true;
        ws.lastHeartbeat = Date.now(); // Store last heartbeat timestamp

        ws.socket?.setNoDelay(true);


        // Handle messages
        ws.on('message', (message) =>
            handleIncomingMessage(
                uniqueIdentifier,
                message,
                ws,
                WebSocket,
                ClientWss,
            )
        );

        // Handle pong response (for ping-pong mechanism)
        ws.on('pong', () => {
            logger.loggerPingPong(`Received pong from ${uniqueIdentifier}`);
            ws.lastHeartbeat = Date.now();
            ws.isAlive = true;
        });

        // Handle errors
        ws.on('error', (error) => handleWebSocketError(uniqueIdentifier, error, ws, clientIpAddress));

        // Handle close
        ws.on('close', (code, reason) => {
            clearInterval(heartbeatCheck);
            const closeReason = reason.toString() || 'No reason provided';

            const closeCodes = {
                1000: 'Normal Closure',
                1001: 'Going Away',
                1002: 'Protocol Error',
                1003: 'Unsupported Data',
                1006: 'Abnormal Closure (No Close Frame) recived',
                1007: 'Invalid Frame Payload Data',
                1008: 'Policy Violation',
                1009: 'Message Too Big',
                1010: 'Mandatory Extension Missing',
                1011: 'Internal Server Error',
            };

            const codeDescription = closeCodes[code] || 'Unknown Close Code';
            handleWebSocketClose(uniqueIdentifier, code, reason, ws, ClientConnections, clientIpAddress, codeDescription);
        });
    });
};

const handleIncomingMessage = async (
    uniqueIdentifier,
    message,
    ws,
    WebSocket,
    ClientWss,
    currentVal,
    previousResults,
    wsConnections,
    ClientConnections,
    clients,
    OCPPResponseMap,
    meterValuesMap,
    sessionFlags,
    charging_states,
    startedChargingSet,
    chargingSessionID,
    chargerStartTime,
    chargerStopTime,
    clientIpAddress
) => {
    try {
        const requestData = JSON.parse(message);
        logger.loggerDebug(`Received message from ${uniqueIdentifier}: ${message}`);

        // Broadcast message to other clients
        broadcastMessage(uniqueIdentifier, requestData, ws, ClientWss);
    } catch (error) {
        logger.loggerError(`Message parsing error: ${error.message}`);
        ws.send(JSON.stringify([3, null, { status: "Error", message: "Message parsing failed" }]));
    }
};

const broadcastMessage = (DeviceID, message, sender, ClientWss) => {
    const jsonMessage = JSON.stringify({ DeviceID, message });
    ClientWss.clients.forEach(client => {
        if (client !== sender && client.readyState === WebSocket.OPEN) {
            client.send(jsonMessage, (error) => {
                if (error) {
                    logger.loggerError(`Error sending message: ${error.message}`);
                }
            });
        }
    });
};

const handleWebSocketError = (uniqueIdentifier, error, ws) => {
    logger.loggerError(`WebSocket error (${uniqueIdentifier}): ${error.message}`);
    if (error.code === 'WS_ERR_UNEXPECTED_RSV_1' || error.code === 'WS_ERR_EXPECTED_MASK') {
        ws.close(1002, 'Invalid frame received');
    }
};

const handleWebSocketClose = (uniqueIdentifier, code, reason, ws, ClientConnections, clientIpAddress, codeDescription) => {
    const closeReason = reason?.toString() || "No reason provided"; // Ensure reason is a string

    logger.loggerWarn(
        `WebSocket closed for Client: ${uniqueIdentifier} | IP: ${clientIpAddress} | Code: ${code} | Reason: ${reason || codeDescription}`
    );

    ClientConnections.delete(ws);
};

module.exports = { handleWebSocketConnection, broadcastMessage };
