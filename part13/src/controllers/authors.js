const authorRouter = require('express').Router()
const blogService = require('../db/services/blogService')

authorRouter.get('/', async (request, response) => {
  const authors = await blogService.getAuthors()
  response.status(200).json(authors)
})


module.exports = authorRouter