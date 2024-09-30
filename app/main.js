import net from "net";
import { toBufferFromInt8, toBufferFromInt16BE, toBufferFromInt32BE } from './bufferUtils.js';

const NULL_TAG = Buffer.from([0]);
const PORT = 9092;
const HOST = "127.0.0.1";
const API_KEYS = {
    FETCH: 1,
    API_VERSIONS: 18
};

const parseRequestHeader = (data) => ({
    apiKey: data.readInt16BE(4),
    apiVersion: data.readInt16BE(6),
    correlationId: data.readInt32BE(8),
    clientId: data.slice(12, data.indexOf(0, 12)).toString(),
});

const encodeCompactArrayLength = (length) => {
    return Buffer.from([(length + 1) & 0xFF]);
};

const handleApiVersionRequest = (request) => {
    const { correlationId } = request;
    const header = toBufferFromInt32BE(correlationId);
    const isValidApiVersion = 0 <= request.apiVersion && request.apiVersion <= 4;
    const errorCode = toBufferFromInt16BE(isValidApiVersion ? 0 : 35);
    let apiKeysCount;
    if (request.apiVersion >= 3) {
        apiKeysCount = encodeCompactArrayLength(2); // Compact array encoding for 2 elements
    }
    else {
        apiKeysCount = toBufferFromInt32BE(2); // Regular array encoding for 2 elements
    }
    const api_keys = Buffer.concat([
        apiKeysCount,
        toBufferFromInt16BE(API_KEYS.FETCH),
        toBufferFromInt16BE(0), // Min version
        toBufferFromInt16BE(16), // Max version
        NULL_TAG,
        toBufferFromInt16BE(API_KEYS.API_VERSIONS),
        toBufferFromInt16BE(0), // Min version
        toBufferFromInt16BE(4), // Max version
        NULL_TAG
    ]);
    const throttle_time_ms = toBufferFromInt32BE(0);
    const body = Buffer.concat([errorCode, api_keys, throttle_time_ms, NULL_TAG]);
    console.log("body", body);
    const response = Buffer.concat([header, body]);
    const responseSize = toBufferFromInt32BE(response.length);
    return Buffer.concat([responseSize, response]);
};

const handleClientConnection = (connection) => {
    console.log("Client connected");
    connection.on("data", (data) => {
        console.log("Received data:", data.toString("hex"));
        try {
            if (data.length < 12) {
                throw new Error("Received insufficient data for request header");
            }
            const header = parseRequestHeader(data);
            console.log("Parsed header:", header);
            if (header.apiKey === API_KEYS.API_VERSIONS) {
                console.log("Handling ApiVersions request");
                const response = handleApiVersionRequest(header);
                connection.write(response);
                console.log("ApiVersions response sent:", response.toString("hex"));
            }
            else {
                console.error("Unsupported API Key:", header.apiKey);
                // In a full implementation, you'd handle other API requests or send an error response
            }
        }
        catch (error) {
            console.error("Error handling client data:", error);
            // In a production environment, you might want to send an error response to the client
        }
    });
    connection.on("end", () => {
        console.log("Client disconnected");
    });
};
// Create and start the server
const server = net.createServer(handleClientConnection);
server.listen(PORT, HOST, () => {
    console.log(`Kafka ApiVersions server is listening on ${HOST}:${PORT}`);
});
// Error handling for the server
server.on("error", (err) => {
    console.error("Server error:", err);
});