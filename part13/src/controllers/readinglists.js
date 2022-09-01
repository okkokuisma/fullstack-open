const readinglistRouter = require('express').Router()
const readinglistService = require('../db/services/readinglistService')
const { tokenExtractor, sessionValidator } = require('../utils/middleware')

readinglistRouter.post('/', tokenExtractor, sessionValidator, async (request, response, next) => {
  const body = request.body
  if (request.decodedToken.id !== body?.userId) {
    return response.status(401).json({ error: 'unauthorized' })
  }
  try {
    const createdEntry = await readinglistService.create(body)
    return response.status(201).json(createdEntry)
  } catch (error) {
    next(error)
  }
})

readinglistRouter.put('/:id', tokenExtractor, sessionValidator, async (request, response, next) => {
  if (request.body?.read === true) {
    try {
      const entry = await readinglistService.findById(request.params.id)
      // console.log(entry)
      if (request.decodedToken.id !== entry.toJSON().userId) {
        return response.status(401).json({ error: 'unauthorized' })
      }

      const editedEntry = await readinglistService.markRead(entry)
      return response.status(200).json(editedEntry)
    } catch (error) {
      next(error)
    }
  } else {
    return response.status(400).json({ error: 'invalid request' })
  }
})

module.exports = readinglistRouter