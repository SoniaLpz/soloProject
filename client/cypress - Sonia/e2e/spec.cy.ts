
describe('My First Test', () => {
  it('Visits the link', () => {
    cy.visit('http://localhost:5173/')
    cy.get('h1').should('be.visible').and('not.be.empty')
    cy.contains('button', 'View Pets').click()
    cy.location('pathname').should('match', /\/pets/ )
  })

  it('List Pets', () => {
    cy.visit('http://localhost:5173/pets');
    cy.get('.pet-list').should('contain', 'Buddy')
  })

   it('Maps List Pets', () => {
    cy.visit('http://localhost:5173/pets');
    cy.get('h3').should('contain', 'Buddy')
  })
  
    it('Login', () => {
      cy.visit('http://localhost:5173/login');
      cy.get('[placeholder = Email]').type('soloProject@gmail.com')
      cy.get('[placeholder = Password]').type('password26')
      cy.get('button').click()
    })

    it('Register', () => {
      cy.visit('http://localhost:5173/register');
      cy.get('[placeholder = Email]').type('soloProject@gmail.com')
      cy.get('[placeholder = Password]').type('password26')
      cy.get('#role').select('Shelter')
      cy.get('button').click()
    })

     it('Contact Us', () => {
      cy.visit('http://localhost:5173/contact');
      cy.get('[placeholder = "Your Name"]').type('Lopez')
      cy.get('[placeholder = "Your Email"]').type('soloProject@gmail.com')
      cy.get('[placeholder = "Your Message"]').type('Hola')
      cy.get('button').click()
    })
})
