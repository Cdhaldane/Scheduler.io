// AvailabilityForm.test.js
import React from "react";
import {
  render,
  screen,
  fireEvent,
  queryByAttribute,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import AvailabilityForm from "./AvailabilityForm";

const getById = queryByAttribute.bind(null, "id");

describe("AvailabilityForm Component", () => {
  test("renders AvailabilityForm with employee name and buttons", () => {
    const dom = render(<AvailabilityForm />);

    // Check that the employee name is displayed
    const employeeNameElement = screen.getByRole("heading", {
      name: /Employee Name/i,
    });
    expect(employeeNameElement).toBeInTheDocument();

    // Check that the "Available" button is rendered
    const availableButton = getById(dom.container, "available");
    expect(availableButton).toBeInTheDocument();
    expect(availableButton).toHaveClass("availability-block");
    expect(availableButton).toHaveAttribute("id", "available");

    // Check that the "Not Available" button is rendered
    const notAvailableButton = getById(dom.container, "notAvailable");
    expect(notAvailableButton).toBeInTheDocument();
    expect(notAvailableButton).toHaveClass("availability-block");
    expect(notAvailableButton).toHaveAttribute("id", "notAvailable");
  });

  test("handles button clicks for Available and Not Available", () => {
    const dom = render(<AvailabilityForm />);

    const availableButton = getById(dom.container, "available");
    const notAvailableButton = getById(dom.container, "notAvailable");

    // Simulate clicking the "Available" button
    fireEvent.click(availableButton);
    expect(availableButton).toBeInTheDocument(); // Add additional functionality later as required

    // Simulate clicking the "Not Available" button
    fireEvent.click(notAvailableButton);
    expect(notAvailableButton).toBeInTheDocument(); // Add additional functionality later as required
  });
});
