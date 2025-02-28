describe("Calendar Component Tests", () => {
  beforeEach(() => {
    // Replace with the URL where your Calendar component is rendered
    cy.visit("http://localhost:3000/#");

    cy.get(".fa-solid.fa-arrow-right-to-bracket").click();

    // Fill in the email and password fields
    cy.get('input[type="email"]').type("testuser@example.com");
    cy.get('input[type="password"]').type("password123");

    // Click the Sign In button
    cy.get('button[type="submit"]').contains("Sign In").click();

    // Assert that the success alert is shown
    cy.contains("Logged in successfully").should("be.visible");

    cy.visit(
      "http://localhost:3000/#/home/bce8fd49-4a09-4d41-83e9-7c0a13bca6c3"
    );
  });

  it("should render the calendar with correct headers", () => {
    cy.get(".calendar-header .header-cell").should("have.length.at.least", 1);
    cy.get(".calendar-header .header-cell").each(($header) => {
      cy.wrap($header).should("not.be.empty");
    });
  });

  it("should display 24 hours in the calendar", () => {
    cy.get(".calendar-row").should("have.length", 24);
  });

  it("should highlight the selected slot", () => {
    // Click on a cell to select it
    cy.get(".cell").eq(15).click();

    // Verify that the cell is highlighted
    cy.get(".cell.single-select").should("exist");
  });

  it("should navigate between weeks", () => {
    // Click on the navigation button to go to the next time frame

    cy.get(".navigation-button.nb-right").click();

    // Verify that the current view has changed
    cy.get(".calendar-header .header-cell")
      .eq(1)
      .invoke("text")
      .then((text1) => {
        cy.get(".navigation-button.nb-right").click();
        cy.get(".calendar-header .header-cell")
          .eq(1)
          .invoke("text")
          .should((text2) => {
            expect(text1).not.to.eq(text2);
          });
      });
  });

  it("should display the current date in the calendar", () => {
    // Get the current date
    const currentDate = new Date().toLocaleDateString("en-US", {
      weekday: "short",
      month: "numeric",
      day: "numeric",
    });

    // Verify that the current date is displayed in the calendar
    const dates = [];

    for (let i = 1; i < 7; i++) {
      cy.get(".calendar-header .header-cell")
        .eq(i)
        .invoke("text")
        .then((text) => {
          dates.push(text);
          if (text === currentDate) {
            cy.get(".calendar-header .header-cell")
              .eq(i)
              .should("have.class", "today");
          }
          if (dates.length === 6) {
            expect(dates).to.include(currentDate);
          }
        });
    }
  });

  it("should display the organization name in the calendar", () => {
    // Get the organization name
    const organizationName = "Recon Solutions Ltd.";

    // Verify that the organization name is displayed in the calendar
    cy.get(".calendar-top-title").should("have.text", organizationName);

    cy.get(".calendar-top-title").click();

    // Verify that the organization modal is displayed
    cy.get(".modal").should("be.visible");
  });

  it("should toggle between compact and full view", () => {
    // Click on the settings button to toggle between compact and full view
    cy.get(".timeframe-button#timeframe-button-view").click();

    // Verify that the view has changed to compact
    cy.get(".calendar-top-time").should("have.class", "noselect");
  });

  it("should change the time frame", () => {
    // Get the current time frame
    const currentTimeFrame = "Week";

    // Click on the time frame button to change the time frame
    cy.get("#timeframe-button-timeframe").click();
    cy.get("#timeframe-button-timeframe").click();
    // Verify that the time frame has changed
    cy.get("#timeframe-button-timeframe")
      .invoke("text")
      .should((text) => {
        expect(text).not.to.eq(currentTimeFrame);
      });
  });
});
