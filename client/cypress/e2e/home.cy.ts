describe.only('Home Page', () => {
   beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('Users can navigate to Pets page', () => {

    cy.visit('/');
    cy.contains('View Pets').click();
    cy.url().should('include', '/pets');
  });

  it('Users can navigate to Register page', () => {

    cy.visit('/');
    cy.contains('Register as Shelter').click();
    cy.url().should('include', '/register');
  });

  it('Users can navigate to Login page', () => {

    cy.visit('/');
    cy.contains('Login').click();
    cy.url().should('include', '/login');
  })

  it('Users can navigate to Contact page', () => {

    cy.visit('/');
    cy.contains('button', 'Contact Us').click();
    cy.url().should('include', '/contact');
  });
});