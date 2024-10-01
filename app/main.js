import net from 'net'
import { parseRequest } from './kafka/requests/index.js'
import { respond } from './kafka/responses/index.js'

const PORT = 9092;
const HOST = '127.0.0.1';

const server = net.createServer((connection) => {
    connection.addListener('data', (buffer) => {
        console.log('🍣 Raw request:', buffer)
        const request = parseRequest(buffer)
        console.log('📥 Parsed request:', request)
        const response = respond(request)
        console.log('🍣 Raw Response:', response)
        connection.write(response)
    })
})
server.listen(PORT, HOST)
console.log('⭐️ Listening on 9092...')