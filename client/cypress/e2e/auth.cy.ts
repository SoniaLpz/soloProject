describe("Full auth e2e", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it("should allow adopter to register and log in", () => {
    const email = `test${Date.now()}@example.com`;
    //register
    cy.visit("/register");
    cy.register(email, "hashedpassword", "adopter");
    cy.contains("Registration successful!").should("be.visible");
    //login
    cy.visit("/login");
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type("hashedpassword");
    cy.get('button[type="submit"]').should("be.visible").click();
    cy.contains("Welcome to PetAdopt").should("be.visible");
    //token persisted
    cy.window()
      .its("localStorage")
      .invoke("getItem", "token")
      .should("not.be.null");
  });

  it("should allow shelter to register and log in", () => {
    const email = `test${Date.now()}@example.com`;
    //register
    cy.visit("/register");
    cy.register(email, "hashedpassword", "shelter");
    cy.contains("Registration successful!").should("be.visible");
    //login
    cy.visit("/login");
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type("hashedpassword");
    cy.get('button[type="submit"]').should("be.visible").click();
    cy.contains("Welcome to Your Dashboard").should("be.visible");
    //token persisted
    cy.window()
      .its("localStorage")
      .invoke("getItem", "token")
      .should("not.be.null");
  });
});

describe("Logout flow", () => {
  beforeEach(() => {
    cy.window().then((win) => win.localStorage.setItem("token", "fake-token"));
    cy.visit("/dashboard");
  });

  afterEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it("logs out successfully", () => {
    cy.get('button[aria-label="Logout"]').should("be.visible").click();
    cy.url().should("include", "/login");
  });
});
