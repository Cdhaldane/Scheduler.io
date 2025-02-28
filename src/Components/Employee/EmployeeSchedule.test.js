// EmployeeSchedule.test.js
import React from "react";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import EmployeeSchedule from "./EmployeeSchedule";
import { getServiceFromId } from "../../Database";

// Mock the getServiceFromId function to return a mock service
jest.mock("../../Database", () => ({
  getServiceFromId: jest.fn(),
}));

describe("EmployeeSchedule Component", () => {
  const mockBookings = [
    {
      booking_date: "2024-10-12",
      booking_time: "10:00",
      client_name: "John Doe",
      client_email: "john.doe@example.com",
      client_phone: "1234567890",
      service_id: "service1",
      status: "confirmed",
    },
    {
      booking_date: "2024-10-13",
      booking_time: "14:00",
      client_name: "Jane Smith",
      client_email: "jane.smith@example.com",
      client_phone: "0987654321",
      service_id: "service2",
      status: "pending",
    },
  ];

  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
  });

  test("renders loading state initially", async () => {
    act(() => {
      getServiceFromId.mockResolvedValue({ name: "Service Name" });
    });

    render(<EmployeeSchedule bookings={mockBookings} />);

    // Ensure "Loading..." is rendered initially
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  test("fetches and displays services for each booking", async () => {
    getServiceFromId
      .mockResolvedValueOnce({ name: "Haircut" })
      .mockResolvedValueOnce({ name: "Massage" });

    render(<EmployeeSchedule bookings={mockBookings} />);

    // Wait for the services to be fetched and displayed
    await waitFor(() => {
      expect(screen.getByText("Haircut")).toBeInTheDocument();
      expect(screen.getByText("Massage")).toBeInTheDocument();
    });

    // Ensure other booking details are displayed
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/Jane Smith/i)).toBeInTheDocument();
  });

  test("expands and collapses booking details on click", async () => {
    getServiceFromId
      .mockResolvedValueOnce({ name: "Haircut" })
      .mockResolvedValueOnce({ name: "Massage" });

    render(<EmployeeSchedule bookings={mockBookings} />);

    // Wait for service names to appear
    await waitFor(() => {
      expect(screen.getByText("Haircut")).toBeInTheDocument();
      expect(screen.getByText("Massage")).toBeInTheDocument();
    });

    // Click on the first booking to expand it
    const firstBooking = screen.getByText(/John Doe/i);
    userEvent.click(firstBooking);

    // Check that booking details are expanded
    await waitFor(
      () => {
        expect(
          screen.getByText(/Client Email: john.doe@example.com/i)
        ).toBeInTheDocument();
        expect(
          screen.getByText(/Client Phone: 1234567890/i)
        ).toBeInTheDocument();
        expect(
          screen.getByText(/Booking Status: confirmed/i)
        ).toBeInTheDocument();
      },
      { timeout: 1000 }
    );

    // Click again to collapse the booking
    fireEvent.click(firstBooking);
    expect(
      screen.queryByText(/Client Email: john.doe@example.com/i)
    ).not.toBeInTheDocument();
  });

  test("handles service fetching errors", async () => {
    // Mock an error when fetching a service
    getServiceFromId.mockRejectedValueOnce(
      new Error("Failed to fetch service")
    );

    render(<EmployeeSchedule bookings={mockBookings} />);

    // Check if the service is in a loading state initially
    await waitFor(() => {
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    // Ensure error is logged and service remains in "Loading..." state
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});
