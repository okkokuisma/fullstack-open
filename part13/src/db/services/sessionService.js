const { Session } = require('../dbInit')

const findByUser = async (userId) => {
  return await Session.findOne({
    where: {
      userId
    }
  })
}

const destroy = async (userId) => {
  await Session.destroy({
    where: {
      userId
    }
  })
}

const create = async (values) => {
  const session = await findByUser(values.userId)

  if (session) {
    await session.destroy()
  }

  return await Session.create(values)
}

module.exports = { create, findByUser, destroy }