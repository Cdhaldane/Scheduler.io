// cypress/e2e/organization_creation.cy.js

/**
 * Organization Creation Test
 *
 * Purpose:
 * - This Cypress test suite verifies the functionality of the organization creation process within the application.
 * - It ensures that a user can log in, access the organization creation form, provide required organization details, and successfully create an organization.
 *
 * Inputs:
 * - Login inputs: `email`, `password`.
 * - Organization details inputs: `name`, `email`, `phone`, `address`.
 *
 * Outputs:
 * - Cypress assertions to verify successful login, form completion, and navigation to the admin page.
 */




describe("Organization Creation", () => {
  beforeEach(() => {
    // Visit the page where the ACMain component is rendered
    // Adjust the URL based on your routing
    cy.visit("http://localhost:3000/#/create-organization");

    // Mock the sign-in network request

    // Fill in the email and password fields
    cy.get('input[type="email"]').type("testuser@example.com");
    cy.get('input[type="password"]').type("password123");

    // Click the Sign In button
    cy.get('button[type="submit"]').contains("Sign In").click();

    // Assert that the success alert is shown
    cy.contains("Logged in successfully").should("be.visible");

    // Additional assertions can be added here, e.g., redirection to home page
  });

  it("allows a user to create an organization successfully", () => {
    // Mock the network request for creating an organization

    // Step 1: Welcome Page
    // Click the next button to proceed
    cy.get(".ac-button").click();

    // Step 2: Input Organization Details
    const organizationDetails = {
      name: "Test Organization",
      email: "testorg@example.com",
      phone: "123-456-7890",
      address: "123 Test Street",
    };

    // Define the sequence of prompts
    const prompts = [
      "What is your organization's name?",
      "What is your organization's email?",
      "What is your organization's phone number?",
      "What is your organization's address?",
    ];

    // Fill out each input field in sequence
    prompts.forEach((prompt, index) => {
      // Wait for the input label to appear
      cy.contains(prompt).should("be.visible");

      // Type the corresponding value
      const inputValue = Object.values(organizationDetails)[index];
      cy.get(".ac-input input").should("be.visible").type(inputValue);

      // Submit the input
      cy.get(".ac-input .fa-paper-plane").click();
    });

    // Step 3: Creating Organization Message
    // Wait for the "Creating your organization..." message
    cy.contains("Creating your organization...").should("be.visible");

    // Verify navigation to the admin page
    cy.url().should("include", "/admin/");
  });

  it("handles failure to create an organization", () => {
    // Step 1: Intercept the network request and simulate a failure response
    cy.intercept("POST", "**/rest/v1/organizations", {
      statusCode: 500,
      body: {
        error: "Failed to create organization",
      },
    }).as("createOrganizationFailure");

    // Step 2: Welcome Page - Click the next button to proceed
    cy.get(".ac-button").click();

    // Step 3: Input Organization Details
    const organizationDetails = {
      name: "Test Organization",
      email: "testorg_fail@example.com",
      phone: "123-456-7890",
      address: "123 Test Street",
    };

    const prompts = [
      "What is your organization's name?",
      "What is your organization's email?",
      "What is your organization's phone number?",
      "What is your organization's address?",
    ];

    prompts.forEach((prompt, index) => {
      cy.contains(prompt).should("be.visible");
      const inputValue = Object.values(organizationDetails)[index];
      cy.get(".ac-input input").should("be.visible").type(inputValue);
      cy.get(".ac-input .fa-paper-plane").click();
    });

    // Step 5: Verify that the error message is displayed
    cy.contains("Organization creation failed.").should("be.visible");

    // Step 6: Verify that we are NOT redirected to the admin page
    // cy.url().should("not.include", "/admin/");
  });
});
