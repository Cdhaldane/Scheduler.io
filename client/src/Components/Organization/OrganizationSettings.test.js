import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/";
import OrganizationSettings from "./OrganizationSettings";
import { useAlert } from "../../DevComponents/Providers/Alert";
import { updateOrganization } from "../../Database";

// Mocking dependencies
jest.mock("../../Database", () => ({
  updateOrganization: jest.fn(),
}));
jest.mock("../../DevComponents/Providers/Alert", () => ({
  useAlert: jest.fn(),
}));

describe("OrganizationSettings Component", () => {
  let mockAlert;
  let mockOrganization;
  let mockOnClose;

  beforeEach(() => {
    mockAlert = {
      showAlert: jest.fn(),
    };
    mockOrganization = {
      org_id: "1",
      name: "Test Organization",
      org_settings: {
        openingTime: "09:00:00",
        closingTime: "17:00:00",
      },
    };
    mockOnClose = jest.fn();
    useAlert.mockReturnValue(mockAlert);
    updateOrganization.mockResolvedValue({ data: {}, error: null });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders organization name and time pickers", async () => {
    render(
      <OrganizationSettings
        organization={mockOrganization}
        onClose={mockOnClose}
      />
    );

    // Check if organization name input is rendered
    const nameInput = screen.getByLabelText("Organization Name");
    expect(nameInput).toBeInTheDocument();
    expect(nameInput.value).toBe(mockOrganization.name);

    // Check if opening time picker is rendered with the default value
    const openingTimePicker = screen.getAllByLabelText("Operating Hours")[0];

    expect(openingTimePicker).toBeInTheDocument();

    // Check if closing time picker is rendered with the default value
    const closingTimePicker = screen.getAllByLabelText("Operating Hours")[1];
    expect(closingTimePicker).toBeInTheDocument();
  });

  test("updates organization and shows success alert on valid submit", async () => {
    render(
      <OrganizationSettings
        organization={mockOrganization}
        onClose={mockOnClose}
      />
    );

    const nameInput = screen.getByLabelText("Organization Name");
    fireEvent.change(nameInput, { target: { value: "Updated Organization" } });

    const submitButton = screen.getByText("Save");
    fireEvent.click(submitButton);

    await waitFor(() => expect(updateOrganization).toHaveBeenCalledTimes(1));

    expect(updateOrganization).toHaveBeenCalledWith(mockOrganization.org_id, {
      name: "Updated Organization",
      org_settings: {
        openingTime: mockOrganization.org_settings.openingTime,
        closingTime: mockOrganization.org_settings.closingTime,
      },
    });

    await waitFor(() =>
      expect(mockAlert.showAlert).toHaveBeenCalledWith(
        "success",
        "Organization updated successfully"
      )
    );

    expect(mockOnClose).toHaveBeenCalled();
  });

  test("shows error alert when update fails", async () => {
    updateOrganization.mockResolvedValueOnce({
      data: null,
      error: "Error updating",
    });

    render(
      <OrganizationSettings
        organization={mockOrganization}
        onClose={mockOnClose}
      />
    );

    const submitButton = screen.getByText("Save");
    fireEvent.click(submitButton);

    await waitFor(() => expect(updateOrganization).toHaveBeenCalledTimes(1));

    expect(mockAlert.showAlert).toHaveBeenCalledWith(
      "error",
      "Error updating organization"
    );
  });
});
