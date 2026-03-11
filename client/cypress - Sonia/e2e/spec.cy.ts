describe('My First Test', () => {
  it('Visits the link', () => {
    cy.visit('http://localhost:5173/')
    cy.get('h1').should('be.visible').and('not.be.empty')
    cy.contains('button', 'View Pets').click()
    cy.location('pathname').should('match', /\/pets/ )
  })

  it('Browse Pets', () => {
    cy.visit('http://localhost:5173/pets')

  })

})