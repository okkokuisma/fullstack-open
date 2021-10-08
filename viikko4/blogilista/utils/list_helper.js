const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((likes, blog) => likes + blog.likes, 0)
}

const favouriteBlog = (blogs) => {
  sortedList = blogs.sort((a, b) => b.likes - a.likes)

  return sortedList[0]
}

const mostBlogs = (blogs) => {
  const blogCount = blogs.reduce((authors, blog) => {
    let i = authors.findIndex(author => author.name === blog.author)
    
    i > 0
    ? authors[i].blogs += 1
    : authors.push( {name : blog.author, blogs : 1} )
    
    return authors
  }, [])

  return blogCount.reduce((prev, next) => {
    let r = {}
    
    prev.blogs > next.blogs
    ? r = prev
    : r = next
    
    return r
  })
}

const mostLikes = (blogs) => {
  const likeCount = blogs.reduce((authors, blog) => {
    let i = authors.findIndex(author => author.name === blog.author)
    
    i > 0
    ? authors[i].likes += blog.likes
    : authors.push( {name : blog.author, likes : blog.likes} )
    
    return authors
  }, [])

  return likeCount.reduce((prev, next) => {
    let r = {}
    
    prev.likes > next.likes
    ? r = prev
    : r = next
    
    return r
  })
}

module.exports = {
  dummy, totalLikes, favouriteBlog, mostBlogs, mostLikes
}