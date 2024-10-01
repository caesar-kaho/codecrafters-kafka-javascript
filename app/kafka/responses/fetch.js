import { API_KEYS } from '../apiKeys.js'
import {
    NULL_TAG,
    toBufferFromInt8,
    toBufferFromInt16BE,
    toBufferFromInt32BE,
} from '../utils.js'
import { createResponseHeaderV1 } from './headers.js'

export function handleFetchRequest(request) {

    const header = createResponseHeaderV1(request)
    const throttleTimeMs = toBufferFromInt32BE(0)
    const errorCode = toBufferFromInt16BE(0)
    const sessionId = toBufferFromInt32BE(0)
    const responses = toBufferFromInt8(1)
    const body = Buffer.concat([
        throttleTimeMs,
        errorCode,
        sessionId,
        responses,
        NULL_TAG,
    ])

    const response = Buffer.concat([header, body])
    const responseSize = toBufferFromInt32BE(response.length)
    
    return Buffer.concat([responseSize, response])
}