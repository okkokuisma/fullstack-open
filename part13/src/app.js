const express = require('express')
const cors = require('cors')

const blogRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const logoutRouter = require('./controllers/logout')
const authorRouter = require('./controllers/authors')
const readinglistRouter = require('./controllers/readinglists')
const { errorHandler } = require('./utils/middleware')
const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
app.use('/api/logout', logoutRouter)
app.use('/api/authors', authorRouter)
app.use('/api/readinglists', readinglistRouter)

app.use((request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
})

app.use(errorHandler)

module.exports = app