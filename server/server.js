const http = require('http')
const app = require('./index')
const { initializeSocket } = require('./socket')
const PORT = process.env.PORT || 3000


const server = http.createServer(app)

initializeSocket(server)

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})