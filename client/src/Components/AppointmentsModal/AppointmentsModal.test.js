// AppointmentsModal.test.js
import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  queryByAttribute,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { prettyDOM } from "@testing-library/dom";
import AppointmentsModal from "./AppointmentsModal";
import Modal from "../../DevComponents/Modal/Modal";
import Spinner from "../../DevComponents/Spinner/Spinner";
import { getBookingsByClientEmail, getServiceFromId } from "../../Database";

const getById = queryByAttribute.bind(null, "id");

// Mock Modal and Spinner components
jest.mock("../../DevComponents/Modal/Modal", () => (props) => (
  <div data-testid="modal">
    <button id="close-modal" onClick={props.onClose}>
      Close
    </button>
    {props.children}
  </div>
));
jest.mock("../../DevComponents/Spinner/Spinner", () => () => (
  <div data-testid="spinner">Loading...</div>
));

// Mock Database functions
jest.mock("../../Database", () => ({
  getBookingsByClientEmail: jest.fn(),
  getServiceFromId: jest.fn(),
}));

describe("AppointmentsModal Component", () => {
  const mockSession = {
    user: {
      email: "test@example.com",
      user_metadata: { organization: "Test Organization" },
    },
  };

  const mockAppointments = [
    {
      booking_id: "1",
      service_id: "service1",
      status: "confirmed",
      booking_date: "2024-10-12",
      booking_time: "10:00 AM",
      service: { name: "Service 1", price: 100 },
    },
    {
      booking_id: "2",
      service_id: "service2",
      status: "pending",
      booking_date: "2024-10-13",
      booking_time: "11:00 AM",
      service: { name: "Service 2", price: 150 },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders modal with loading spinner", async () => {
    getBookingsByClientEmail.mockResolvedValue({ data: [], error: null });

    render(
      <AppointmentsModal
        isOpen={true}
        onClose={jest.fn()}
        session={mockSession}
      />
    );

    expect(screen.getByTestId("modal")).toBeInTheDocument();
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  test("fetches and displays appointments", async () => {
    getBookingsByClientEmail.mockResolvedValue({
      data: mockAppointments,
      error: null,
    });
    getServiceFromId.mockResolvedValueOnce({ name: "Service 1", price: 100 });
    getServiceFromId.mockResolvedValueOnce({ name: "Service 2", price: 150 });

    render(
      <AppointmentsModal
        isOpen={true}
        onClose={jest.fn()}
        session={mockSession}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/Upcoming Appointments/i)).toBeInTheDocument();
      expect(screen.getByText(/Service 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Service 2/i)).toBeInTheDocument();
    });
  });

  test("filters appointments by status", async () => {
    getBookingsByClientEmail.mockResolvedValue({
      data: mockAppointments,
      error: null,
    });
    getServiceFromId.mockResolvedValueOnce({ name: "Service 1", price: 100 });
    getServiceFromId.mockResolvedValueOnce({ name: "Service 2", price: 150 });

    const dom = render(
      <AppointmentsModal
        isOpen={true}
        onClose={jest.fn()}
        session={mockSession}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/Service 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Service 2/i)).toBeInTheDocument();
    });

    // Filter by confirmed status
    const confirmedFilter = getById(dom.container, "confirmed");
    fireEvent.click(confirmedFilter);
    getServiceFromId.mockResolvedValueOnce({ name: "Service 1", price: 100 });

    await waitFor(() => {
      expect(screen.queryByText(/Service 2/i)).not.toBeInTheDocument();
      expect(screen.getByText(/Service 1/i)).toBeInTheDocument();
    });
  });

  test("shows message when no appointments are available", async () => {
    getBookingsByClientEmail.mockResolvedValue({ data: [], error: null });

    render(
      <AppointmentsModal
        isOpen={true}
        onClose={jest.fn()}
        session={mockSession}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/No upcoming appointments/i)).toBeInTheDocument();
    });
  });

  test("handles errors when fetching appointments", async () => {
    getBookingsByClientEmail.mockResolvedValue({
      data: null,
      error: "Error fetching data",
    });

    render(
      <AppointmentsModal
        isOpen={true}
        onClose={jest.fn()}
        session={mockSession}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/No upcoming appointments/i)).toBeInTheDocument();
    });
  });

  test("renders and closes the modal", async () => {
    getBookingsByClientEmail.mockResolvedValue({
      data: [],
      error: null,
    });

    const onClose = jest.fn();

    const dom = render(
      <AppointmentsModal
        isOpen={true}
        onClose={onClose}
        session={mockSession}
      />
    );
    const closeButton = getById(dom.container, "close-modal");
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalled();
  });
});
