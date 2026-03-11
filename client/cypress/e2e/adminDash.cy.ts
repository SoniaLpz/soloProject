const mockPet = {
  name: "Lua",
  type: "Cat",
  gender: "Female",
  shelterName: "Test Shelter",
  phone: "7815979886",
  email: "email@test.com",
  age: "4",
  location: "London",
};

describe("Admin Flow", () => {
  beforeEach(() => {
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
    cy.visit("/dashboard");
  });

  afterEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it("should allow shelter to see pet listings", () => {
    cy.contains("button", "Pet Listings").click();
    cy.url().should("include", "/list");
    cy.contains("button", "New Pet").should("be.visible");
  });

  it("should allow shelter to create new pet", () => {
    cy.visit("/dashboard/list");
    cy.contains("button", "New Pet").click();
    cy.get(".add-pet-form").should("be.visible");
    cy.get('input[name="name"]').type(mockPet.name);
    cy.get('input[name="type"]').type(mockPet.type);
    cy.get('input[name="gender"]').type(mockPet.type);
    cy.get('input[name="shelterName"]').type(mockPet.shelterName);
    cy.get('input[name="phone"]').type(mockPet.phone);
    cy.get('input[name="email"]').type(mockPet.email);
    cy.get('input[name="age"]').type(mockPet.age);
    cy.get('input[name="location"]').type(mockPet.location);
    cy.get('button[type="submit"]').click();
    cy.contains("Lua").should("be.visible");
  });

  it("should allow shelter to see messages", () => {
    cy.contains("button", "Messages").click();
    cy.url().should("include", "/messages");
    cy.contains("Messages").should("be.visible");
  });
});
