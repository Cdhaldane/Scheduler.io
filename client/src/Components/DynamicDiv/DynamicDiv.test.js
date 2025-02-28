// DynamicDiv.test.js
import React from "react";
import {
  render,
  screen,
  fireEvent,
  queryByAttribute,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import DynamicDiv from "./DynamicDiv";
import { handleTwoWayCollapse } from "../../Utils";

jest.setTimeout(10000); // Set timeout to 10 seconds for all tests in this file

const getById = queryByAttribute.bind(null, "id");

// Mock the `handleTwoWayCollapse` function
// jest.mock("../../Utils", () => ({
//   handleTwoWayCollapse: jest.fn(),
// }));

describe("DynamicDiv Component", () => {
  beforeEach(() => {
    // Set up window width for each test
    global.innerWidth = 1024;
    global.dispatchEvent(new Event("resize"));
  });

  test("renders DynamicDiv with the correct default properties", async () => {
    const dom = render(
      <DynamicDiv>
        <div>Test Content</div>
      </DynamicDiv>
    );

    const titleElement = screen.getByText(/TIMESLOT/i);
    const sideIcon = getById(dom.container, "side-icon");
    const contentElement = screen.getByText(/Test Content/i);

    waitFor(() => {
      expect(titleElement).toBeInTheDocument();
      expect(sideIcon).toBeInTheDocument();
      expect(contentElement).toBeInTheDocument();
    });
  });

  test("renders the close and open icons in mobile mode", async () => {
    // Set window width to trigger mobile view
    global.innerWidth = 708;
    global.dispatchEvent(new Event("resize"));

    const { container, rerender } = render(<DynamicDiv />);

    // Initially, the open icon should be visible (as the mobile menu is collapsed)
    const openIcon = getById(container, "open-icon");
    expect(openIcon).toBeInTheDocument();

    userEvent.click(openIcon);

    // Ensure the mobile menu opens and close icon appears
    await waitFor(() => {
      const closeIcon = getById(container, "close-icon");
      expect(closeIcon).toBeInTheDocument();
    });
  });

  test("handles window resize and switches between mobile and desktop view", () => {
    const { container, rerender } = render(<DynamicDiv />);

    // Initially in desktop view
    expect(getById(container, "open-icon")).not.toBeInTheDocument();

    // Switch to mobile view by resizing the window
    global.innerWidth = 600;
    global.dispatchEvent(new Event("resize"));

    rerender(<DynamicDiv />);

    // Check that mobile view is activated and toggle button appears
    expect(getById(container, "open-icon")).toBeInTheDocument();
  });

  test("renders custom title, colors, and icons", async () => {
    const dom = render(
      <DynamicDiv
        title="Custom Title"
        color="red"
        backgroundColor="blue"
        openIcon="fa-solid fa-arrow-left"
        closeIcon="fa-solid fa-arrow-right"
        sideIcon="fa-solid fa-check"
      />
    );

    const titleElement = screen.getByText(/Custom Title/i);
    expect(titleElement).toBeInTheDocument();

    const headerElement = screen.getByRole("banner");
    const sideIcon = getById(dom.container, "side-icon");

    await waitFor(() => {
      expect(headerElement).toHaveStyle({
        color: "red",
        backgroundColor: "blue",
      });
      expect(sideIcon).toBeInTheDocument();
    });
  });
});
