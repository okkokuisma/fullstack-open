import { React, useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, likeBlog, deleteBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [visible, setVisible] = useState(false)

  const showWhenVisible = { display: visible ? '' : 'none' }

  Blog.propTypes = {
    likeBlog: PropTypes.func.isRequired,
    deleteBlog: PropTypes.func.isRequired
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLike = async (e) => {
    e.preventDefault()
    await likeBlog(blog)
  }

  const handleDelete = async (e) => {
    e.preventDefault()
    await deleteBlog(blog)
  }

  return (
    <div style={blogStyle} className='blog'>
      <div className='visibleContent'>
        {blog.title} by {blog.author} <button onClick={toggleVisibility}>{visible ? 'hide' : 'show'}</button>
      </div>
      <div style={showWhenVisible} className='toggledContent'>
        <p>{blog.url}</p>
        <p>likes {blog.likes} <button onClick={handleLike}>like</button></p>
        <p><button onClick={handleDelete}>delete</button></p>
      </div>
    </div>
  )
}

export default Blog