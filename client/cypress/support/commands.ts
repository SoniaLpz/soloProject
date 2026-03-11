/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      register(
        email: string,
        password: string,
        role: "shelter" | "adopter",
      ): Chainable<void>;
    }
  }
}

Cypress.Commands.add("register", (email, password, role) => {
  cy.intercept("POST", "http://localhost:3000/auth/register").as(
    "registerRequest",
  );
  cy.visit("/register");
  cy.get('input[type="email"]').type(email);
  cy.get('input[type="password"]').type(password);
  cy.get('select[id="role"]').select(role);
  cy.get('button[type="submit"]').should("be.visible").click();
  cy.wait("@registerRequest");
});
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
