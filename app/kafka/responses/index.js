import { API_KEYS } from '../apiKeys.js'
import { handleApiVersionRequest } from './apiVersions.js'
import { handleFetchRequest } from './fetch.js'

const HANDLERS = {
    [API_KEYS.API_VERSIONS]: handleApiVersionRequest,
    [API_KEYS.FETCH]: handleFetchRequest,
}
export function respond(request) {
    const apiKey = request.header.apiKey
    const handle = HANDLERS[apiKey]

    if (handle === undefined) {
        throw new Error(`Unimplemented Request API Key: ${apiKey}`)
    }
    
    return handle(request)
}