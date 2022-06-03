import Blog from './Blog'
import { useSelector } from 'react-redux'

const BlogList = () => {
  const blogs = useSelector(state => state.blogs
    .filter(blog => blog.user.username === state.user.username)
    .sort((a, b) => b.likes - a.likes))

  return <div id='blog_list'>
    <h2>blogs</h2>
    {blogs.map(blog =>
      <Blog key={blog.id} blog={blog} />
    )}
  </div>
}

export default BlogList