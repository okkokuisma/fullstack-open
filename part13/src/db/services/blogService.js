const { Blog, User } = require('../dbInit')
const { Op, fn, col } = require("sequelize")

const getAll = async (query) => {
  let where = {}

  if (query && query.search) {
    where[Op.or] =
      [
        {
          title: {
            [Op.iLike]:  `%${query.search}%`
          }
        },
        {
          author: {
            [Op.iLike]:  `%${query.search}%`
          }
        }
      ]
  }

  return await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    order: [
      ['likes', 'DESC']
    ],
    where
  })
}

const getAuthors = async () => {
  return await Blog.findAll({
    attributes:[
      'author',
      [fn('SUM', col('likes')), 'likes'],
      [fn('COUNT', col('title')), 'blogs']
    ],
    group: 'author'
  })
}

const findById = async (id) => {
  const blog = await Blog.findByPk(id, {
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    }
  })

  if (!blog) {
    const error = new Error('No blogs found with the given id')
    error.name = 'BlogNotFoundError'
    throw error
  }

  return blog
}

const destroy = async (id) => {
  const blog = await findById(id)
  await blog.destroy()
}

const create = async (values) => {
  return await Blog.create(values)
}

const editLikes = async (id, likes) => {
  const blog = await findById(id)
  blog.likes = likes
  return await blog.save()
}

const toString = async () => {
  const blogs = await getAll()
  blogs
    .map(b => b.toJSON())
    .forEach(b => {
      console.log(`${b.author}: '${b.title}', ${b.likes} likes`)
    })
}

module.exports = { getAll, create, destroy, editLikes, toString, getAuthors }