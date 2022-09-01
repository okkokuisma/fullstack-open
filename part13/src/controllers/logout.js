const loginRouter = require('express').Router()

const sessionService = require('../db/services/sessionService')
const { tokenExtractor } = require('../utils/middleware')

loginRouter.delete('/', tokenExtractor, async (request, response) => {
  const { decodedToken } = request
  await sessionService.destroy(decodedToken.id)
  return response.status(200).end()
})

module.exports = loginRouter