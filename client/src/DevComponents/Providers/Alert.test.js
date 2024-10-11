import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AlertProvider, useAlert } from "./Alert";
import "@testing-library/jest-dom";

jest.setTimeout(10000); // Set timeout to 10 seconds for all tests in this file

// Mock component to test useAlert
const MockAlertComponent = () => {
  const { showAlert, alert } = useAlert();

  return (
    <div>
      <button onClick={() => showAlert("success", "Test Alert Message")}>
        Show Alert
      </button>
      {alert && <p>{alert.message}</p>}
    </div>
  );
};

describe("AlertProvider", () => {
  test("displays alert message when showAlert is called", async () => {
    render(
      <AlertProvider>
        <MockAlertComponent />
      </AlertProvider>
    );

    // Click the button to trigger the alert
    fireEvent.click(screen.getByText("Show Alert"));

    // Check if the alert message is displayed
    expect(screen.getByText("Test Alert Message")).toBeInTheDocument();

    // Wait for the alert to disappear after the timeout (5 seconds)
    await waitFor(
      () => {
        expect(
          screen.queryByText("Test Alert Message")
        ).not.toBeInTheDocument();
      },
      { timeout: 6000 }
    );
  });
});
