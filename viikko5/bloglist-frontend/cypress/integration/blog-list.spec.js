describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Testi Testinen',
      username: 'testinikki',
      password: 'testisalis'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown when user has not logged in', function() {
    cy.contains('Login')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.contains('Login')
      cy.get('#username').type('testinikki')
      cy.get('#password').type('testisalis')
      cy.contains('login').click()

      cy.contains('Testi Testinen logged in')
    })

    it('fails with wrong credentials', function() {
      cy.contains('Login')
      cy.get('#username').type('testinikki')
      cy.get('#password').type('testisalasana')
      cy.contains('login').click()

      cy.contains('Invalid username or password')
      cy.contains('Login')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.request('POST', 'http://localhost:3003/api/login', {
        username: 'testinikki', password: 'testisalis'
      }).then(res => {
        localStorage.setItem('loggedUser', JSON.stringify(res.body))
        cy.visit('http://localhost:3000')
      })
    })

    it('A blog can be created', function() {
      cy.contains('Add a blog').click()
      cy.get('#title').type('test title')
      cy.get('#author').type('test author')
      cy.get('#url').type('testurl.com/test')
      cy.contains('add blog').click()

      cy.contains('test title by test author')
      cy.contains('show').click()
      cy.contains('testurl.com/test')
    })

    describe('When a blog was created',function() {
      beforeEach(function() {
        cy.createBlog({
          title: 'test title',
          author: 'test author',
          url: 'testurl.com/test',
          likes: 0
        })
      })

      it('user can like it', function() {
        cy.contains('test title by test author')
        cy.contains('show').click()
        cy.contains('like').click()
        cy.contains('likes 1')
      })

      it('user can delete it', function() {
        cy.contains('test title by test author')
        cy.contains('show').click()
        cy.contains('delete').click()
        cy.contains('Blog test title deleted succesfully')
      })

      it('blog are sorted by like count', function() {
        cy.createBlog({
          title: 'blog with 1 like',
          author: 'author with 1 like',
          url: 'testurl.com/test',
          likes: 1
        })
        cy.createBlog({
          title: 'blog with 2 likes',
          author: 'author with 2 likes',
          url: 'testurl.com/test',
          likes: 2
        })
        const cellContents = []
        cy.get('#blog_list')
          .get('.blog')
          .each(($el) => {
            cellContents.push($el.text())
          })
          .then(() => {
            expect(cellContents[0]).to.include('2 likes')
            expect(cellContents[1]).to.include('1 like')
          })
      })
    })
  })
})