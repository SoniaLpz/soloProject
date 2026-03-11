describe('Contact Form', () => {
   beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('Should load the form', () => {

    cy.visit('/contact');
    cy.url().should('include', '/contact');
  });

  it('Users should be able to submit form', () => {
    const message = {
      name: "John Walker",
      email: "john@gmail.com",
      message: "I want to adopt Buddy"
    }
    cy.visit('/contact');
    cy.get('input[name="name"]').type(message.name);
    cy.get('input[name="email"]').type(message.email);
    cy.get('textarea[name="message"]').type(message.message);
    cy.contains('Send Message').click();
    cy.contains('Message sent successfully!').should('be.visible');
  });
});