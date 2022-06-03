import blogService from '../services/blogs'
import { initUsers } from '../reducers/usersReducer'

export const like = (blog) => {
  return async (dispatch) => {
    await blogService.updateBlog({ ...blog, likes: blog.likes + 1 })
    dispatch({
      type: 'LIKE',
      data: { id: blog.id },
    })
  }
}

export const newBlog = (blog) => {
  return async (dispatch) => {
    const createdBlog = await blogService.createBlog({ ...blog, likes: 0 })
    dispatch({
      type: 'CREATE',
      data: createdBlog
    })
  }
}

export const deleteBlog = (blog) => {
  return async (dispatch) => {
    await blogService.deleteBlog(blog)
    dispatch({
      type: 'DELETE',
      data: { id: blog.id }
    })
  }
}

export const initBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch({
      type: 'INIT_BLOGS',
      data: blogs
    })
    dispatch(initUsers(blogs))
  }
}

const reducer = (state = [], action) => {
  console.log('state now: ', state)
  console.log('action', action)

  switch (action.type) {
    case 'LIKE':
      const id = action.data.id
      const initialBlog = state.find(a => a.id === id)
      const modifiedBlog = { ...initialBlog, likes: initialBlog.likes + 1 }
      return state.map(b => b.id === id ? modifiedBlog : b)
    case 'CREATE':
      return [ ...state, action.data ]
    case 'DELETE':
      return state.filter(b => b.id !== action.data.id)
    case 'INIT_BLOGS':
      return action.data
    default:
      return state;
  }
}

export default reducer