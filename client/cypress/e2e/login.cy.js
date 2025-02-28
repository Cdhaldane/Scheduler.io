// cypress/e2e/login.cy.js

/**
 * Login Component Test
 *
 * Purpose:
 * - This Cypress test suite validates the functionality of the `Login` component for both sign-in and sign-up flows.
 * - It ensures that users can successfully log in, handle login errors, create new accounts, and handle sign-up errors.
 *
 * Inputs:
 * - Sign-in inputs: `email`, `password`.
 * - Sign-up inputs: `email`, `password`, `confirm-password`, `name`, `phone number`.
 *
 * Outputs:
 * - Cypress assertions to verify success and error messages for each action.
 */





describe("Login Component", () => {
  beforeEach(() => {
    // Visit the page where the Login component is rendered
    cy.visit("http://localhost:3000/#"); // Adjust this URL based on your routing
  });

  it("allows a user to sign in successfully", () => {
    // Mock the sign-in network request

    cy.get(".fa-solid.fa-arrow-right-to-bracket").click();

    // Fill in the email and password fields
    cy.get('input[type="email"]').type("testuser@example.com");
    cy.get('input[type="password"]').type("password123");

    // Click the Sign In button
    cy.get('button[type="submit"]').contains("Sign In").click();

    // Assert that the success alert is shown
    cy.contains("Logged in successfully").should("be.visible");

    // Additional assertions can be added here, e.g., redirection to home page
  });

  it("shows an error message on sign-in failure", () => {
    cy.get(".fa-solid.fa-arrow-right-to-bracket").click();
    // Fill in the email and password fields
    cy.get('input[type="email"]').type("testuser@example.com");
    cy.get('input[type="password"]').type("wrongpassword");

    // Click the Sign In button
    cy.get('button[type="submit"]').contains("Sign In").click();

    // Assert that the error message is displayed
    cy.contains("Invalid login credentials").should("be.visible");
  });

  it("allows a user to sign up successfully", () => {
    cy.get(".fa-solid.fa-arrow-right-to-bracket").click();
    // Click the "Don't have an account? Sign up" link
    cy.contains("Don't have an account? Sign up").click();

    // Fill in the sign-up form fields
    cy.get('input[type="email"]').type("newuser@example.com");
    cy.get("#password").type("password123");
    cy.get("#confirm-password").type("password123");
    cy.get('input[type="name"]').type("New User");
    cy.get('input[type="tel"]').type("1234567890");

    // Click the Sign Up button
    cy.get('button[type="submit"]').contains("Sign Up").click();

    // Assert that the success alert is shown
    cy.contains("Account created successfully").should("be.visible");
  });

  it("shows an error message on sign-up failure", () => {
    cy.get(".fa-solid.fa-arrow-right-to-bracket").click();
    // Click the "Don't have an account? Sign up" link
    cy.contains("Don't have an account? Sign up").click();

    // Fill in the sign-up form fields
    cy.get('input[type="email"]').type("existinguser@example.com");
    cy.get("#password").type("password123");
    cy.get("#confirm-password").type("password123");
    cy.get('input[type="name"]').type("Existing User");
    cy.get('input[type="tel"]').type("1234567890");

    // Click the Sign Up button
    cy.get('button[type="submit"]').contains("Sign Up").click();

    // Assert that the error message is displayed
    cy.contains("User already registered").should("be.visible");
  });
});
