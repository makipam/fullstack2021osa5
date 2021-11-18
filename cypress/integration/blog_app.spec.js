describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Kayttaja',
      username: 'kayttajatunnus',
      password: 'salasana'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('login form can be opened', function() {
    cy.visit('http://localhost:3000')
    cy.contains('log in').click()
  })

  it('user can login', function () {
    cy.contains('log in').click()
    cy.get('#username').type('kayttajatunnus')
    cy.get('#password').type('salasana')
  })

  it('login fails with wrong password', function() {
    cy.contains('log in').click()
    cy.get('#username').type('kayttajatunnus')
    cy.get('#password').type('wrong')
    cy.get('#login-button').click()

    cy.get('.error')
      .should('contain', 'wrong username or password')
      .and('have.css', 'color', 'rgb(255, 0, 0)')
      .and('have.css', 'border-style', 'solid')

    cy.get('html').should('not.contain', 'login successful')
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'kayttajatunnus', password: 'salasana' })
    })

    it('a new blog can be created', function() {
      cy.contains('create new blog').click()
      cy.get('#title').type('a blog created by cypress')
      cy.get('#author').type('author created by cypress')
      cy.get('#url').type('url created by cypress')
      cy.contains('Create').click()
      cy.contains('a blog created by cypress')
    })

    describe('and a blog exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'another blog cypress',
          author: 'another author cypress',
          url: 'another url cypress',
          likes: 0
        })
      })

      it('like count can be increased', function () {
        cy.contains('View').click()
        cy.contains('like').click()

        cy.get('html').should('contain', 'likes: 1')
      })

      it('a blog can be deleted', function () {
        cy.contains('View').click()
        cy.contains('Remove').click()
        cy.on('window:confirm', () => true)

        cy.get('html').should('contain', 'another blog cypress by another author cypress was removed!')
      })
    })
    describe('and several blogs exist', function () {
      beforeEach(function () {
        cy.createBlog({ title: 'blog 1', author: 'author 1', url: 'url 1', likes: 2 })
        cy.createBlog({ title: 'blog 2', author: 'author 2', url: 'url 2', likes: 0 })
        cy.createBlog({ title: 'blog 3', author: 'author 3', url: 'url 3', likes: 0 })

        cy.wait(5500)

        cy.contains('blog 3')
      })
      it('blogs in right order when likes are increased', function () {
        cy.contains('blog 1').contains('View').click()
        cy.contains('blog 1').contains('like').as('1like')
        cy.contains('blog 2').contains('View').click()
        cy.contains('blog 2').contains('like').as('2like')
        cy.contains('blog 3').contains('View').click()
        cy.contains('blog 3').contains('like').as('3like')

        cy.get('@3like').click()
        cy.wait(500)
        cy.get('@3like').click()
        cy.wait(500)
        cy.get('@3like').click()
        cy.wait(500)
        cy.get('@3like').click()
        cy.wait(500)

        cy.get('.blog').eq(0).contains('blog 3').should('exist')

        cy.get('@2like').click()
        cy.wait(500)
        cy.get('@2like').click()
        cy.wait(500)
        cy.get('@2like').click()
        cy.wait(500)
        cy.get('@2like').click()
        cy.wait(500)
        cy.get('@2like').click()
        cy.wait(500)
        cy.get('@2like').click()
        cy.wait(500)

        cy.get('.blog').eq(0).contains('blog 2').should('exist')

      })


    })
  })
})