// cypress/e2e/booking_submit.cy.js


/**
 * BookingSubmit Component Test
 *
 * Purpose:
 * - This Cypress test verifies the functionality of the `BookingSubmit` component in the booking system.
 * - It ensures that the component can handle a successful booking submission and provide appropriate feedback to the user.
 *
 * Inputs:
 * - Mock user information (`name`, `email`, `phoneNumber`).
 * - Mock appointment details (date, time, service, personnel, price).
 * - Mock organization details (`org_id`, `name`).
 *
 * Outputs:
 * - Cypress assertions to verify that the booking confirmation and navigation work as expected.
 */


describe("BookingSubmit Component", () => {
  it("handles successful booking", () => {
    // Prepare mock data
    const mockUser = {
      name: "John Doe",
      email: "john.doe@example.com",
      phoneNumber: "1234567890",
    };

    const mockAppointment = {
      day: new Date("2023-10-10"),
      start: 10,
      end: 11,
      service: { id: "0", name: "Service 1" },
      personnel: { id: "0", first_name: "Jane" },
      price: 100,
    };

    const mockOrganization = {
      org_id: "13e1303c-0a9c-4a8e-aced-2a7f36f35a45",
      name: "Organization 1",
    };

    // Navigate to the BookingSubmit page with necessary state
    const userParam = encodeURIComponent(JSON.stringify(mockUser));
    const appointmentParam = encodeURIComponent(
      JSON.stringify(mockAppointment)
    );
    const organizationParam = encodeURIComponent(
      JSON.stringify(mockOrganization)
    );

    cy.visit(
      `http://localhost:3000/#/booking-submit?user=${userParam}&appointment=${appointmentParam}&organization=${organizationParam}`
    );

    cy.wait(1000);

    // Confirm booking
    cy.contains("Confirm Booking").click();

    // Wait for booking confirmation
    cy.contains("Booking Confirmed").should("be.visible");

    // Verify thank-you message
    cy.contains(`Thank you for booking, ${mockUser.name}!`).should(
      "be.visible"
    );

    // Click "Back to Home" button
    cy.contains("Back to Home").click();

    // Verify navigation to home page
    cy.url().should("include", `/home/${mockOrganization.org_id}`);
  });

  it("displays an error page when user data is missing", () => {
    const mockAppointment = {
      day: new Date("2023-10-10"),
      start: 10,
      end: 11,
      service: { id: "0", name: "Service 1" },
      personnel: { id: "0", first_name: "Jane" },
      price: 100,
    };

    const mockOrganization = {
      org_id: "13e1303c-0a9c-4a8e-aced-2a7f36f35a45",
      name: "Organization 1",
    };

    const appointmentParam = encodeURIComponent(
      JSON.stringify(mockAppointment)
    );
    const organizationParam = encodeURIComponent(
      JSON.stringify(mockOrganization)
    );

    cy.visit(
      `http://localhost:3000/#/booking-submit?appointment=${appointmentParam}&organization=${organizationParam}`
    );

    cy.wait(2000);

    cy.contains("404").should("be.visible"); // Error page or message expected
  });

  it("displays an error page when organization data is missing", () => {
    const mockUser = {
      name: "John Doe",
      email: "john.doe@example.com",
      phoneNumber: "1234567890",
    };

    const mockAppointment = {
      day: new Date("2023-10-10"),
      start: 10,
      end: 11,
      service: { id: "0", name: "Service 1" },
      personnel: { id: "0", first_name: "Jane" },
      price: 100,
    };

    const userParam = encodeURIComponent(JSON.stringify(mockUser));
    const appointmentParam = encodeURIComponent(
      JSON.stringify(mockAppointment)
    );

    cy.visit(
      `http://localhost:3000/#/booking-submit?user=${userParam}&appointment=${appointmentParam}`
    );

    cy.wait(2000);

    cy.contains("404").should("be.visible"); // Error page or message expected
  });

  it("displays an error for invalid email", () => {
    const mockUser = {
      name: "John Doe",
      email: "invalid-email",
      phoneNumber: "1234567890",
    };

    const mockAppointment = {
      day: new Date("2023-10-10"),
      start: 10,
      end: 11,
      service: { id: "0", name: "Service 1" },
      personnel: { id: "0", first_name: "Jane" },
      price: 100,
    };

    const mockOrganization = {
      org_id: "13e1303c-0a9c-4a8e-aced-2a7f36f35a45",
      name: "Organization 1",
    };

    const userParam = encodeURIComponent(JSON.stringify(mockUser));
    const appointmentParam = encodeURIComponent(
      JSON.stringify(mockAppointment)
    );
    const organizationParam = encodeURIComponent(
      JSON.stringify(mockOrganization)
    );

    cy.visit(
      `http://localhost:3000/#/booking-submit?user=${userParam}&appointment=${appointmentParam}&organization=${organizationParam}`
    );

    cy.wait(1000);

    // Confirm booking
    cy.contains("Confirm Booking").click();

    // Check if the failure alert is shown for invalid email
    cy.contains("Invalid Email").should("be.visible");
  });

  it("displays an error when no service is selected", () => {
    const mockUser = {
      name: "John Doe",
      email: "john.doe@example.com",
      phoneNumber: "1234567890",
    };

    const mockAppointment = {
      day: new Date("2023-10-10"),
      start: 10,
      end: 11,
      personnel: { id: "0", first_name: "Jane" }, // No service
      price: 100,
    };

    const mockOrganization = {
      org_id: "13e1303c-0a9c-4a8e-aced-2a7f36f35a45",
      name: "Organization 1",
    };

    const userParam = encodeURIComponent(JSON.stringify(mockUser));
    const appointmentParam = encodeURIComponent(
      JSON.stringify(mockAppointment)
    );
    const organizationParam = encodeURIComponent(
      JSON.stringify(mockOrganization)
    );

    cy.visit(
      `http://localhost:3000/#/booking-submit?user=${userParam}&appointment=${appointmentParam}&organization=${organizationParam}`
    );

    cy.wait(1000);

    // Confirm booking
    cy.contains("Confirm Booking").click();

    // Check if the failure alert is shown
    cy.contains("Booking Failed").should("be.visible");
  });
});
