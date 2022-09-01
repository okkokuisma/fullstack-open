const jwt = require('jsonwebtoken')
const loginRouter = require('express').Router()

const { SECRET } = require('../utils/config')
const userService = require('../db/services/userService')
const sessionService = require('../db/services/sessionService')

loginRouter.post('/', async (request, response, next) => {
  const body = request.body

  try {
    const user = await userService.findByUsername(body.username)
    const passwordCorrect = body.password === 'secret'

    if (!(user && passwordCorrect)) {
      return response.status(401).json({
        error: 'invalid username or password'
      })
    }

    if (user.disabled) {
      return response.status(401).json({
        error: 'account disabled, please contact admin'
      })
    }

    const userForToken = {
      username: user.username,
      id: user.id,
    }

    const token = jwt.sign(userForToken, SECRET)
    await sessionService.create({ userId: user.id, token })
    response
      .status(200)
      .send({ token, username: user.username, name: user.name })
  } catch (error) {
    next(error)
  }
})

module.exports = loginRouter