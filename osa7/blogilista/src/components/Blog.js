import { React } from 'react'
import { useDispatch } from 'react-redux'
import { deleteBlog } from '../reducers/blogReducer'
import { setSuccessNotification, setErrorNotification } from '../reducers/notificationReducer'
import { Link } from "react-router-dom"

const Blog = ({ blog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const dispatch = useDispatch()

  const handleDelete = async (e) => {
    e.preventDefault()
    try {
      dispatch(deleteBlog(blog))
      dispatch(setSuccessNotification(`Blog ${blog.title} deleted succesfully`, 3))
    } catch (exception) {
      dispatch(setErrorNotification('Error while deleting the blog', 3))
    }
  }

  return (
    <div style={blogStyle} className='blog'>
      <div>
        <Link to={`/blogs/${ blog.id }`}>{blog.title} by {blog.author}</Link> <button onClick={handleDelete}>delete</button>
      </div>
    </div>
  )
}

export default Blog