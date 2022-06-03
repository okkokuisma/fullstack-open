import { like } from '../reducers/blogReducer'
import { setSuccessNotification } from '../reducers/notificationReducer'
import { useDispatch } from 'react-redux'

const BlogView = ({ blog }) => {
  const dispatch = useDispatch()

  const handleLike = async (e) => {
    e.preventDefault()
    dispatch(like(blog))
    dispatch(setSuccessNotification(`You liked blog ${blog.title}`, 3))
  }

  return (
    <div id='blog_view'>
      <h1>{ blog.title }</h1>
      <p><a href={blog.url}>{blog.url}</a></p>
      <p>likes {blog.likes} <button onClick={handleLike}>like</button></p>
      <p>added by { blog.user.name }</p>
    </div>
  )
}

export default BlogView