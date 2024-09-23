// BookingSubmit.test.js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import BookingSubmit from "./BookingSubmit";
import { useLocation, useNavigate } from "react-router-dom";
import { useAlert } from "../Providers/Alert";
import { sendEmail, addBooking } from "../../Database";
import * as queryString from "query-string";

// Mock useLocation to provide test data
jest.mock("react-router-dom", () => ({
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

// Mock useAlert
jest.mock("../Providers/Alert", () => ({
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
