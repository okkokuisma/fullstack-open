import { React, useState } from 'react'

const CreateBlogForm = ({ createBlog }) => {
  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogUrl, setBlogUrl] = useState('')

  const handleCreate = async (e) => {
    e.preventDefault()

    await createBlog({
      title: blogTitle,
      author: blogAuthor,
      url: blogUrl })
    setBlogTitle('')
    setBlogAuthor('')
    setBlogUrl('')
  }

  return <div>
    <h2>Add new blog</h2>
    <form onSubmit = {handleCreate}>
      <p>Blog title <input type="text" value={blogTitle} id="title" name="Title" onChange={({ target }) => setBlogTitle(target.value)}/></p>
      <p>Blog author <input type="text" value={blogAuthor} id="author" name="Author" onChange={({ target }) => setBlogAuthor(target.value)}/></p>
      <p>Blog url <input type="text" value={blogUrl} id="url" name="Url" onChange={({ target }) => setBlogUrl(target.value)}/></p>
      <button type="submit">add blog</button>
    </form>
  </div>
}

export default CreateBlogForm