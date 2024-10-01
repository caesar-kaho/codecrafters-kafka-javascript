import { parseRequestHeaderV0 } from '../responses/headers.js'

export function parseRequest(buffer) {
  const header = parseRequestHeaderV0(buffer)
  return {header};
}