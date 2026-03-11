const mockPet = {
  name: "Rocky",
  type: "Dog",
  age: "5",
  location: { lat: 52.2053, lng: 0.1218 },
  city: "Cambridge",
  shelterName: "The Home Cambridge",
  phone: "123456789",
  email: "homecambridge@gamil.com",
  image: "/images/rocky.jpg",
  gender: "Male",
  favorite: false,
};

describe("admin pet detail page flow", () => {
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
    cy.visit("/dashboard/list");
  });

  afterEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it("should allow shelter to see pet detail page", () => {
    cy.get(`img[src="${mockPet.image}"]`).should("be.visible").click();
    cy.url().should("include", "/pets");
    cy.get(".edit-button").should("be.visible");
    cy.get(".delete-button").should("be.visible");
  });

  it("should allow shelter to edit pet details", () => {
    cy.get(`img[src="${mockPet.image}"]`).should("be.visible").click();
    cy.url().should("include", "/pets");
    cy.get(".edit-button").should("be.visible").click();
    cy.url().should("include", "/edit");
    cy.get(".edit-form").should("be.visible");
    cy.get('input[name="name"]').type(mockPet.name);
    cy.get('input[name="age"]').type(mockPet.age);
    cy.get('button[type="submit"]').should("be.visible").click();
    cy.url().should("not.include", "/edit");
  });

  it("should allow shelter to delete pet", () => {
    cy.get(`img[src="${mockPet.image}"]`).should("be.visible").click();
    cy.url().should("include", "/pets");
    cy.get(".delete-button").should("be.visible").click();
    cy.url().should("include", "/list");
    cy.get(mockPet.name).should("not.exist");
  });
});
