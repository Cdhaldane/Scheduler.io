// Dropdown.test.js
import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Dropdown from "./Dropdown";

describe("Dropdown Component", () => {
  test("renders dropdown with default label", () => {
    render(
      <Dropdown label="Select Option" options={["Option 1", "Option 2"]}>
        <button>Toggle Dropdown</button>
      </Dropdown>
    );

    const triggerElement = screen.getByLabelText("Select Option");
    expect(triggerElement).toBeInTheDocument();
    expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
  });

  test("opens dropdown when clicked", () => {
    render(
      <Dropdown label="Select Option" options={["Option 1", "Option 2"]}>
        <button>Toggle Dropdown</button>
      </Dropdown>
    );

    const triggerElement = screen.getByLabelText("Select Option");

    // Ensure dropdown is closed initially
    expect(screen.queryByText("Option 1")).not.toBeInTheDocument();

    // Click the dropdown trigger
    fireEvent.click(triggerElement);

    // Ensure dropdown is opened
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
  });

  test("closes dropdown when clicked outside", async () => {
    render(
      <Dropdown label="Select Option" options={["Option 1", "Option 2"]}>
        <button>Toggle Dropdown</button>
      </Dropdown>
    );

    const triggerElement = screen.getByLabelText("Select Option");

    // Click to open the dropdown
    fireEvent.click(triggerElement);
    expect(screen.getByText("Option 1")).toBeInTheDocument();

    // Click outside of the dropdown
    fireEvent.mouseDown(document.body);

    // Ensure dropdown is closed
    await waitFor(() => {
      expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
    });
  });

  test("calls onClick when an option is selected", () => {
    const handleClick = jest.fn();
    render(
      <Dropdown
        label="Select Option"
        options={["Option 1", "Option 2"]}
        onClick={handleClick}
      >
        <button>Toggle Dropdown</button>
      </Dropdown>
    );

    // Open dropdown
    const triggerElement = screen.getByLabelText("Select Option");
    fireEvent.click(triggerElement);

    // Click on Option 1
    const option1 = screen.getByText("Option 1");
    fireEvent.click(option1);

    // Ensure the onClick handler was called with the correct argument
    expect(handleClick).toHaveBeenCalledWith("Option 1");
  });

  test("renders options with icons if provided", () => {
    const optionsWithIcons = [
      { label: "Option 1", icon: "fa-icon-1" },
      { label: "Option 2", icon: "fa-icon-2" },
    ];

    const { container } = render(
      <Dropdown label="Select Option" options={optionsWithIcons}>
        <button>Toggle Dropdown</button>
      </Dropdown>
    );

    // Open dropdown
    fireEvent.click(screen.getByLabelText("Select Option"));

    // Ensure options with icons are rendered
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();

    // Use querySelector to select icons by class name
    const icon1 = container.querySelector(".fa-icon-1");
    const icon2 = container.querySelector(".fa-icon-2");

    expect(icon1).toBeInTheDocument();
    expect(icon2).toBeInTheDocument();
  });
});
