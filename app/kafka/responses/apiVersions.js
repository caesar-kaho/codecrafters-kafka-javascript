import { createResponseHeaderV0 } from './headers.js'
import { API_KEYS } from '../apiKeys.js'
import {
    NULL_TAG,
    toBufferFromInt8,
    toBufferFromInt16BE,
    toBufferFromInt32BE,
} from '../utils.js'

export function handleApiVersionRequest(request) {
    const header = createResponseHeaderV0(request)
    const { apiVersion } = request.header
    const isValidApiVersion = 0 <= apiVersion && apiVersion <= 4
    const errorCode = toBufferFromInt16BE(isValidApiVersion ? 0 : 35)
    const apiKeys = Buffer.concat([
        toBufferFromInt8(3),
        toBufferFromInt16BE(API_KEYS.API_VERSIONS),
        toBufferFromInt16BE(4),
        toBufferFromInt16BE(4),
        NULL_TAG,
        toBufferFromInt16BE(API_KEYS.FETCH),
        toBufferFromInt16BE(16),
        toBufferFromInt16BE(16),
        NULL_TAG,
    ])
    const throttleTimeMs = toBufferFromInt32BE(0)
    const body = Buffer.concat([errorCode, apiKeys, throttleTimeMs, NULL_TAG])
    const response = Buffer.concat([header, body])
    const responseSize = toBufferFromInt32BE(response.length)
    return Buffer.concat([responseSize, response])

}

