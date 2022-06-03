import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Switch, Route, useRouteMatch
} from "react-router-dom"
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'
import Notification from './components/Notification'
import CreateBlogForm from './components/CreateBlogForm'
import Togglable from './components/Togglable'
import { setErrorNotification, setSuccessNotification } from './reducers/notificationReducer'
import { initBlogs } from './reducers/blogReducer'
import { setUser } from './reducers/userReducer'
import BlogList from './components/BlogList'
import UserTable from './components/UserTable'
import UserView from './components/UserView'
import NavigationMenu from './components/NavigationMenu'
import BlogView from './components/BlogView'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [renderBlogs, setRenderBlogs] = useState(true)
  const user = useSelector(state => state.user)
  const users = useSelector(state => state.users)
  const blogs = useSelector(state => state.blogs)

  const createBlogFormRef = useRef()
  const blogMatch = useRouteMatch('/blogs/:id')
  const userMatch = useRouteMatch('/users/:id')

  const matchedUser = userMatch
    ? users.find(user => user.id === userMatch.params.id)
    : null

  const matchedBlog = blogMatch
    ? blogs.find(blog => blog.id === blogMatch.params.id)
    : null

  const dispatch = useDispatch()
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    if (user) {
      fetchBlogs()
    }
  }, [renderBlogs, user])


  const fetchBlogs = async () => {
    dispatch(initBlogs())
  }

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      dispatch(setUser(user))
      console.log(user)
      setPassword('')
      setPassword('')
      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
    } catch (exception) {
      dispatch(setErrorNotification('Invalid username or password', 3))
    }
  }

  const createBlog = async (blogObject) => {
    try {
      createBlogFormRef.current.toggleVisibility()
      const blog = await blogService.createBlog(blogObject)
      setRenderBlogs(!renderBlogs)
      dispatch(setSuccessNotification(`Blog ${blog.title} added successfully`, 3))
    } catch (exception) {
      dispatch(setErrorNotification('Error while adding the blog', 3))
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

  const createBlogForm = () => {
    return (
      <div>
        <Togglable buttonLabel='Add a blog' ref={createBlogFormRef}>
          <CreateBlogForm createBlog={createBlog}/>
        </Togglable>
      </div>
    )
  }

  return (
    <div>
      <Notification.ErrorMessage />
      <Notification.SuccessMessage />
      {user === null ?
        loginForm() :
        <div>
          <NavigationMenu />
          <h1>Blog app</h1>
          <Switch>
            <Route path='/blogs/:id'>
              <BlogView blog={ matchedBlog } />
            </Route>
            <Route path='/users/:id'>
              <UserView user={ matchedUser } />
            </Route>
            <Route path='/users'>
              <UserTable />
            </Route>
            <Route path= '/'>
              {createBlogForm()}
              <BlogList />
            </Route>
          </Switch>
        </div>
      }
    </div>
  )
}

export default App