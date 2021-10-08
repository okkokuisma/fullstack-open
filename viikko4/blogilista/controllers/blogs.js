const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})
  
blogsRouter.post('/', async (request, response) => {
  const body = request.body

  // const token = request.token
  // const decodedToken = jwt.verify(token, process.env.SECRET)
  // if (!token || !decodedToken.id) {
  //   return response.status(401).json({ error: 'token missing or invalid' })
  // }
  // const user = await User.findById(decodedToken.id)
  const user = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  const responseData = await blog.save()
  user.blogs = user.blogs.concat(responseData._id)
  await user.save()

  response.status(201).json(responseData)
})

blogsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  const user = request.user

  console.log(blog.user.toString())
  console.log(user._id.toString())
  if (blog.user.toString() === user._id.toString()) {
    user.blogs = user.blogs
      .filter(b => b._id.toString() !== blog._id.toString())
    await user.save()
    await blog.remove()
    return response.status(204).end()
  }
  
  return response.status(401).json({ error: 'unauthorized action' })
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const update = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, update, { new: true })
  response.json(updatedBlog)
})

module.exports = blogsRouter