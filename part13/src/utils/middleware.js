const jwt = require('jsonwebtoken')
const { SECRET } = require('../utils/config')
const userService = require('../db/services/userService')
const sessionService = require('../db/services/sessionService')

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      const token = authorization.substring(7)
      request.decodedToken = jwt.verify(token, SECRET)
      request.token = token
    } catch (error) {
      return response.status(401).json({ error: 'token invalid' })
    }
  } else {
    return response.status(401).json({ error: 'token missing' })
  }
  next()
}

const sessionValidator = async (request, response, next) => {
  const { decodedToken, token } = request

  try {
    const user = await userService.findById(decodedToken.id)
    console.log(user)
    if (user.disabled) {
      await sessionService.destroy(decodedToken.id)
      return response.status(401).json({ error: 'user disabled' })
    }

    const session = await sessionService.findByUser(decodedToken.id)

    if (!session) {
      return response.status(401).json({ error: 'no active session' })
    } else if (session.token !== token) {
      return response.status(401).json({ error: 'token invalid' })
    } else if (Date.now() - Date.parse(session.createdAt) > 1800000) {
      await sessionService.destroy(decodedToken.id)
      return response.status(401).json({ error: 'token expired' })
    }
  } catch (error) {
    next(error)
  }

  next()
}

const errorHandler = (error, request, response, next) => {
  console.log(error)
  if (error.name === 'SequelizeValidationError') {
    return response.status(400).send({ error: `${error.errors[0].message}` })
  } else if (error.name === 'BlogNotFoundError') {
    return response.status(400).send({ error: error.message })
  } else if (error.name === 'UserNotFoundError') {
    return response.status(400).send({ error: error.message })
  }

  next(error)
}

module.exports = { errorHandler, tokenExtractor, sessionValidator }