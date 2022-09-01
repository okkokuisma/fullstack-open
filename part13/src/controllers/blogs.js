const blogRouter = require('express').Router()
const blogService = require('../db/services/blogService')
const userService = require('../db/services/userService')
const { tokenExtractor, sessionValidator } = require('../utils/middleware')

blogRouter.get('/', async (request, response) => {
  const blogs = await blogService.getAll(request.query)
  response.status(200).json(blogs)
})

blogRouter.post('/', tokenExtractor, sessionValidator, async (request, response, next) => {
  const body = request.body
  try {
    const user = await userService.findById(request.decodedToken.id)
    const createdBlog = await blogService.create({ ...body, userId: user.id })
    response.status(201).json(createdBlog)
  } catch (error) {
    next(error)
  }
})

blogRouter.delete('/:id', tokenExtractor, sessionValidator, async (request, response, next) => {
  try {
    const blogId = request.params.id
    const user = await userService.findById(request.decodedToken.id)
    if (user.toJSON().blogs.some(b => b.id === Number(blogId))) {
      await blogService.destroy(blogId)
      return response.status(200).send('Blog removed')
    } else {
      return response.status(401).send('Unauthorized request')
    }
  } catch (error) {
    console.log(error)
    next(error)  }
})

blogRouter.put('/:id', tokenExtractor, sessionValidator, async (request, response, next) => {
  const { likes } = request.body
  try {
    const editedBlog = await blogService.editLikes(request.params.id, likes)
    return response.status(200).json(editedBlog)
  } catch (error) {
    console.log(error)
    next(error)  }
})

module.exports = blogRouter