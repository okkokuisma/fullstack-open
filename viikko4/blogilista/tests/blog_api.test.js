const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')

const api = supertest(app)

let token = ''
const initialBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
]

beforeEach(async () => {
  await Blog.deleteMany({})
  const blogs = initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogs.map(blog => blog.save())
  await Promise.all(promiseArray)

  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('secretpassword', 10)
  const user = new User({ username: 'test', passwordHash })
  await user.save()
  
  const response = await api
    .post('/api/login')
    .send({ username: 'test', password: 'secretpassword' })
  
  token = response.body.token
})

describe('get', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .set('authorization', token)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  
  test('right amount of blogs are returned', async () => {
    const blogs = helper.blogsInDb()
    expect(blogs).toHaveLength(initialBlogs.length)
  })
  
  test('blogs have parameter id', async () => {
    const blogs = helper.blogsInDb()
    blogs.forEach((blog) => {
      expect(blog.id).toBeDefined()
    })
  })  
})

describe('post', () => {
  test('blogs can be added', async () => {
    let addedBlog = {
      title: 'test',
      author: 'test',
      url: 'test',
      likes: 10
    }
  
    await api
    .post('/api/blogs')
    .send(addedBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  
    const blogs = helper.blogsInDb()
  
    expect(blogs).toHaveLength(initialBlogs.length + 1)
    expect(blogs.map(x => x.title)).toContain('test')
  })
  
  test('like count of posted blog defaults to 0', async () => {
    let addedBlog = {
      title: 'test',
      author: 'test',
      url: 'test',
    }
  
    await api
    .post('/api/blogs')
    .send(addedBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  
    const blogs = helper.blogsInDb()
    const returnedBlog = blogs.find(blog => blog.title === 'test')
  
    expect(returnedBlog.likes).toBe(0)
  })
  
  test('blog title and url are required', async () => {
    let addedBlog = {
      author: 'test',
      likes: 10
    }
  
    await api
    .post('/api/blogs')
    .send(addedBlog)
    .expect(400)
  })
})

// describe('delete', () => {
//   test('blogs can be removed', async () => {
//     await api
//     .delete('api/blogs/5a422b3a1b54a676234d17f9')
//     .expect(204)

//     const response = await api.get('/api/blogs')
//     expect(response.body).toHaveLength(initialBlogs - 1)
    
//     const blogTitles = response.body.map(blog => blog.title)
//     expect(blogTitles).toEqual(
//       expect.not.arrayContaining('Canonical string reduction')
//     )
//   })
// })

afterAll(() => {
  mongoose.connection.close()
})