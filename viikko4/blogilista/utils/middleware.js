const logger = require('./logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const tokenExtractor = (request, response, next) => {
  const header = request.get('authorization')
  if (header && header.toLowerCase().startsWith('bearer ')) {
    request.token = header.substring(7)
  }
  
  next()
}

const tokenValidator = (request, response, next) => {
  const token = request.token
  request.token = jwt.verify(token, process.env.SECRET)

  next()
}

const userExtractor = async (request, response, next) => {
  const token = request.token
  if (token.id) {
    request.user = await User.findById(token.id)
  }
  
  next()
}

const errorHandler = (error, request, response, next) => {
  logger.info(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(400).json({ error: 'invalid token' })
  }

  next(error)
}

module.exports = { errorHandler, tokenExtractor, userExtractor, tokenValidator }