const http = require('http')

const { connectToDatabase } = require('./db/dbInit')
const blogService = require('./db/services/blogService')
const app = require('./app')
const { PORT } = require('./utils/config')

const startServer = () => {
  const server = http.createServer(app)
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

const start = async () => {
  try {
    await connectToDatabase()
    startServer()
    await blogService.toString()
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

start()