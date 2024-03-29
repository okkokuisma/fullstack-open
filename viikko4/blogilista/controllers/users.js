const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response, next) => {
  const body = request.body

  if (!body.password || body.password.length < 3) {
    response.status(400).send({ error: 'malformatted password' })
  }
  const saltRounds = 10
  const hashed = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash: hashed
  })

  const savedUser = await user.save()
  response.json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  users = await User.find({})
    .populate('blogs', { 
      title: 1, author: 1, url: 1, likes: 1 })
  response.json(users)
})

module.exports = usersRouter