const userRouter = require('express').Router()
const userService = require('../db/services/userService')

userRouter.get('/', async (request, response) => {
  const users = await userService.getAll()
  response.status(200).json(users)
})

userRouter.get('/:id', async (request, response, next) => {
  try {
    const user = await userService.findById(request.params.id, request.query)
    response.status(200).json(user)
  } catch (error) {
    next(error)
  }
})

userRouter.post('/', async (request, response, next) => {
  const body = request.body
  try {
    const createdUser = await userService.create(body)
    response.status(201).json(createdUser)
  } catch (error) {
    next(error)
  }
})

userRouter.delete('/:id', async (request, response, next) => {
  try {
    await userService.destroy(request.params.id)
    return response.status(204).end()
  } catch (error) {
    next(error)  }
})

userRouter.put('/:username', async (request, response, next) => {
  const body = request.body
  try {
    const editedUser = await userService.editUsername(request.params.username, body.newUsername)
    return response.status(200).json(editedUser)
  } catch (error) {
    next(error)  }
})

module.exports = userRouter