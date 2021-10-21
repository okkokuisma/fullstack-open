Cypress.Commands.add('createBlog', ({ title, author, url, likes }) => {
  const loggedUserJSON = window.localStorage.getItem('loggedUser')
  const user = JSON.parse(loggedUserJSON)
  cy.request({
    method: 'POST',
    url: 'http://localhost:3003/api/blogs',
    auth: {
      bearer: user.token
    },
    body: {
      title: title,
      author: author,
      url: url,
      likes: likes,
    },
  })
  cy.visit('http://localhost:3000')
})