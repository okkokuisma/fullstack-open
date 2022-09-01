const { User, Blog } = require('../dbInit')

const getAll = async () => {
  return await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] }
    }
  })
}

const findByUsername = async (username) => {
  const user = await User.findOne({
    where: {
      username
    },
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] }
    }
  })

  if (!user) {
    const error = new Error('No users found with the given username')
    error.name = 'UserNotFoundError'
    throw error
  }

  return user
}

const findById = async (id, query) => {
  let where = {}

  if (query && query.read) {
    where.read = query.read
  }

  const user = await User.findByPk(id, {
    include: [
      {
        model: Blog,
        attributes: { exclude: ['userId'] },
      },
      {
        model: Blog,
        as: 'addedBlogs',
        attributes: { exclude: ['userId'] },
        through: {
          attributes: ['read', 'id'],
          where
        },
      },
    ],
  })

  if (!user) {
    const error = new Error('No users found with the given id')
    error.name = 'UserNotFoundError'
    throw error
  }

  return user
}

const destroy = async (username) => {
  const user = await findByUsername(username)
  await user.destroy()
}

const create = async (values) => {
  return await User.create(values)
}

const editUsername = async (username, newUsername) => {
  const user = await findByUsername(username)
  user.username = newUsername
  return await user.save()
}

module.exports = { getAll, create, destroy, findByUsername, findById, editUsername }