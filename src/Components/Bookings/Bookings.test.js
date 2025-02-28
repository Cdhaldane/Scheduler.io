// BookingSubmit.test.js

/**
 * BookingSubmit Component Test Suite
 *
 * Purpose:
 * - This suite tests the `BookingSubmit` component, verifying the rendering of booking details, handling of successful and failed bookings, and behavior when location state is missing.
 *
 * Tests:
 * - `renders booking details correctly`: Ensures that the booking details (service name, personnel, date, price) are displayed as expected.
 * - `handles successful booking`: Simulates a successful booking process by clicking the "Confirm Booking" button, confirming that:
 *   - `addBooking` and `sendEmail` functions are called.
 *   - A success alert is displayed.
 *   - The thank-you message and "Back to Home" button are rendered.
 *   - Navigation redirects the user back to the home page.
 * - `handles booking failure`: Simulates a booking failure scenario, verifying that:
 *   - `addBooking` is called, but `sendEmail` is not.
 *   - An error alert is displayed without showing a confirmation or thank-you message.
 * - `displays default values when location state is missing`: Ensures that when location state data is absent, an error message is displayed to the user.
 *
 *
 * Async Handling:
 * - Uses `waitFor` to handle asynchronous operations, such as waiting for booking and email functions to complete.
 *
 * Usage:
 * - Run this test suite to confirm that the `BookingSubmit` component handles booking flows and errors as expected.
 */



import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import BookingSubmit from "./BookingSubmit";
import { useLocation, useNavigate } from "react-router-dom";
import { useAlert } from "../../DevComponents/Providers/Alert";
import { sendEmail, addBooking } from "../../Database";
import * as queryString from "query-string";

// Mock useLocation to provide test data
jest.mock("react-router-dom", () => ({
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

// Mock useAlert
jest.mock("../../DevComponents/Providers/Alert", () => ({
  useAlert: jest.fn(),
}));

// Mock Database functions
jest.mock("../../Database", () => ({
  sendEmail: jest.fn(),
  addBooking: jest.fn(),
}));

describe("BookingSubmit Component", () => {
  const mockNavigate = jest.fn();
  const mockShowAlert = jest.fn();

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Mock implementations
    useNavigate.mockReturnValue(mockNavigate);
    useAlert.mockReturnValue({ showAlert: mockShowAlert });
  });

  const mockUser = {
    name: "John Doe",
    email: "john.doe@example.com",
    phoneNumber: "1234567890",
  };

  const mockAppointment = {
    day: new Date("2023-10-10"),
    start: 10,
    end: 11,
    service: { id: "service1", name: "Service 1" },
    personnel: { id: "person1", first_name: "Jane" },
    price: 100,
  };

  const mockOrganization = {
    org_id: "org1",
    name: "Organization 1",
  };

  function setup(bookingSuccess = true) {
    // Mock useLocation to return test data
    useLocation.mockReturnValue({
      state: {
        user: mockUser,
        appointment: mockAppointment,
        organization: mockOrganization,
      },
    });

    // Mock addBooking
    addBooking.mockResolvedValue(
      bookingSuccess ? { res: {}, error: null } : { res: null, error: "Error" }
    );

    // Mock sendEmail
    sendEmail.mockResolvedValue();

    // Render the component
    render(<BookingSubmit />);
  }

  test("renders booking details correctly", () => {
    setup();

    expect(screen.getByRole("button", { name: /Confirm booking/i }));
    expect(screen.getByText(/Your appointment for a/i));
    expect(screen.getByText(mockAppointment.service.name));
    expect(screen.getByText(mockAppointment.personnel.first_name));
    expect(
      screen.getByText(
        mockAppointment.day.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })
      )
    );
    expect(screen.getByText(`$${mockAppointment.price}`));
  });

  test("handles successful booking", async () => {
    setup();

    const confirmButton = screen.getByRole("button", {
      name: /Confirm Booking/i,
    });
    fireEvent.click(confirmButton);

    // Wait for addBooking to be called
    await waitFor(() => {
      expect(addBooking).toHaveBeenCalledTimes(1);
    });

    // Wait for sendEmail to be called
    await waitFor(() => {
      expect(sendEmail).toHaveBeenCalledTimes(1);
    });

    // Wait for the alert to be shown
    expect(mockShowAlert).toHaveBeenCalledWith("success", "Booking Confirmed");

    // Wait for the component to re-render and display new content
    await waitFor(() => {
      expect(screen.getByText(/Booking Confirmed/i));
    });

    // Check that the thank-you message is displayed
    expect(
      screen.getByText(
        new RegExp(`Thank you for booking, ${mockUser.name}!`, "i")
      )
    );

    // Wait for the "Back to Home" button to appear
    const backButton = await screen.findByRole("button", {
      name: /Back to Home/i,
    });
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith(
      `/home/${mockOrganization.org_id}`
    );
  });

  test("handles booking failure", async () => {
    setup(false); // Pass false to simulate booking failure

    const confirmButton = screen.getByRole("button", {
      name: /Confirm Booking/i,
    });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(addBooking).toHaveBeenCalledTimes(1);
    });

    expect(sendEmail).not.toHaveBeenCalled();
    expect(mockShowAlert).toHaveBeenCalledWith("error", "Booking Failed");
    expect(screen.queryByText(/Booking Confirmed/i)).not;
  });

  test("displays default values when location state is missing", () => {
    // Mock useLocation to return empty state
    useLocation.mockReturnValue({
      state: null,
    });

    render(<BookingSubmit />);

    expect(
      screen.getByText(/Oops! The page you are looking for does not exist./i)
    );
  });
});
