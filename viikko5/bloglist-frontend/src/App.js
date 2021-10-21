import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'
import Notification from './components/Notification'
import CreateBlogForm from './components/CreateBlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [renderBlogs, setRenderBlogs] = useState(true)

  const createBlogFormRef = useRef()

  useEffect(() => {
    if (user) {
      fetchBlogs()
    }
  }, [renderBlogs, user])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const fetchBlogs = async () => {
    const allBlogs = await blogService.getAll()
    const filteredBlogs = allBlogs.filter(blog => blog.user.username === user.username)
    console.log(filteredBlogs)
    setBlogs(filteredBlogs)
  }

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      setPassword('')
      setPassword('')
      setUser(user)
      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
    } catch (exception) {
      setErrorMessage('Invalid username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    }
  }

  const handleLogout = async (e) => {
    e.preventDefault()
    setUser(null)
    blogService.setToken(null)
    window.localStorage.removeItem('loggedUser')
  }

  const createBlog = async (blogObject) => {
    try {
      createBlogFormRef.current.toggleVisibility()
      const blog = await blogService.createBlog(blogObject)
      setRenderBlogs(!renderBlogs)
      setMessage(`Blog ${blog.title} added successfully`)
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    } catch (exception) {
      setErrorMessage('Error while adding the blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    }
  }

  const likeBlog = async (blogObject) => {
    const updatedBlog = await blogService.updateBlog({ ...blogObject, likes: blogObject.likes + 1 })
    setRenderBlogs(!renderBlogs)
    setMessage(`You liked blog ${updatedBlog.title}`)
    setTimeout(() => {
      setMessage(null)
    }, 3000)
  }

  const deleteBlog = async (blogObject) => {
    try {
      await blogService.deleteBlog(blogObject)
      setRenderBlogs(!renderBlogs)
      setMessage(`Blog ${blogObject.title} deleted succesfully`)
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    } catch (exception) {
      setErrorMessage('Error while deleting the blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    }
  }

  const loginForm = () => {
    return <div>
      <h2>Login</h2>
      <form onSubmit={ handleLogin }>
        <input type="text" value={username} id="username" name="Username" onChange={({ target }) => setUsername(target.value)}/>
        <input type="text" value={password} id="password" name="Password" onChange={({ target }) => setPassword(target.value)}/>
        <button type="submit">login</button>
      </form>
    </div>
  }

  const blogList = () => {
    return <div id='blog_list'>
      <h2>blogs</h2>
      {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
        <Blog key={blog.id} blog={blog} likeBlog={likeBlog} deleteBlog={deleteBlog} />
      )}
    </div>
  }

  const logoutForm = () => {
    return <div>
      <form onSubmit={handleLogout}>
        <button type="submit">logout</button>
      </form>
    </div>
  }

  const createBlogForm = () => {
    return (
      <Togglable buttonLabel='Add a blog' ref={createBlogFormRef}>
        <CreateBlogForm createBlog={createBlog}/>
      </Togglable>
    )
  }

  return (
    <div>
      <Notification.ErrorMessage message={errorMessage} />
      <Notification.SuccessMessage message={message} />
      {user === null ?
        loginForm() :
        <div>
          <p>{user.name} logged in</p>
          {logoutForm()}
          {createBlogForm()}
          {blogList()}
        </div>
      }
    </div>
  )
}

export default App