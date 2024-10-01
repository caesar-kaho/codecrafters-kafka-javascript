import { NULL_TAG, toBufferFromInt32BE } from '../utils.js'

export function createResponseHeaderV0(request) {
    return toBufferFromInt32BE(request.header.correlationId)
}
export function createResponseHeaderV1(request) {
    return Buffer.concat([createResponseHeaderV0(request), NULL_TAG])
}

export const parseRequestHeaderV0 = (data) => ({
    apiKey: data.readInt16BE(4),
    apiVersion: data.readInt16BE(6),
    correlationId: data.readInt32BE(8),
    clientId: data.slice(12, data.indexOf(0, 12)).toString(),
});