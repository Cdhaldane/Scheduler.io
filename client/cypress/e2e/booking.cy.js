// cypress/e2e/booking_submit.cy.js

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
});
