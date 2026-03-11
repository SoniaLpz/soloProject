describe('Favorites', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('User should be able to add to favorites', () => {
    cy.visit('/');
    cy.contains('Login').click();
    cy.get('input[name="email"]').type('test126@gmail.com');
    cy.get('input[type="password"]').type('adopter');
    cy.contains('Log In').click();
    cy.contains('View Pets').click();
    cy.get('.pet-card').first().click();
    cy.get('body').then(($body) => {
      if ($body.text().includes('Unheart This Pet')) {
        cy.contains('Unheart This Pet').click();
      }
    });
    cy.contains('Heart This Pet').click();
    
  });

  it('User should be able to view favorites', () => {
    cy.visit('/');
    cy.contains('Login').click();
    cy.get('input[name="email"]').type('test126@gmail.com');
    cy.get('input[type="password"]').type('adopter');
    cy.contains('Log In').click();
    cy.contains('View Pets').click();
    cy.contains('❤️').click();
    cy.contains('Favorite Pets').should('be.visible');
  });

});