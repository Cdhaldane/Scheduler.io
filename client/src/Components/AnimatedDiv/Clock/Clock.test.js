// Clock.test.js
import React from "react";
import { render, screen, queryByAttribute } from "@testing-library/react";
import "@testing-library/jest-dom";
import Clock, { BackgroundClockContainer } from "./Clock";

const getById = queryByAttribute.bind(null, "id");

describe("Clock Component", () => {
  test("renders the clock with default properties", () => {
    const dom = render(<Clock />);

    const clockElement = screen.getByRole("presentation");
    expect(clockElement).toBeInTheDocument();
    expect(clockElement).toHaveClass("clock");
    expect(clockElement).toHaveStyle({
      backgroundColor: "var(--bg-secondary)",
    });

    // Check if the hour, minute, and second hands are present
    const hourHand = getById(dom.container, "hr");
    const minuteHand = getById(dom.container, "min");
    const secondHand = getById(dom.container, "sec");

    expect(hourHand).toBeInTheDocument();
    expect(minuteHand).toBeInTheDocument();
    expect(secondHand).toBeInTheDocument();
  });

  test("applies custom width, height, and color properties", () => {
    render(<Clock width="200px" height="200px" color="bg-primary" />);

    const clockElement = screen.getByRole("presentation");
    expect(clockElement).toHaveStyle({
      width: "200px",
      height: "200px",
      backgroundColor: "var(--bg-primary)",
    });
  });

  test("calculates correct rotation for the hour, minute, and second hands", () => {
    const mockDate = new Date("2024-10-11T10:15:30"); // Test date: 10:15:30
    jest.spyOn(global, "Date").mockImplementation(() => mockDate);

    const dom = render(<Clock />);

    const hourHand = getById(dom.container, "hr");
    const minuteHand = getById(dom.container, "min");
    const secondHand = getById(dom.container, "sec");

    // Hour hand (10:15 should be around 307.5 degrees)
    expect(hourHand).toHaveStyle({
      transform: "rotate(307.5deg) translate(0, -50%)",
    });

    // Minute hand (15 minutes = 90 degrees)
    expect(minuteHand).toHaveStyle({
      transform: "rotate(90deg) translate(0, -50%)",
    });

    // Second hand (30 seconds = 180 degrees)
    expect(secondHand).toHaveStyle({
      transform: "rotate(180deg) translate(0, 20%)",
    });

    // Restore the original Date implementation
    jest.restoreAllMocks();
  });

  test("clears the timer on component unmount", () => {
    const clearIntervalSpy = jest.spyOn(global, "clearInterval");
    const { unmount } = render(<Clock />);

    unmount();
    expect(clearIntervalSpy).toHaveBeenCalledTimes(1);
  });
});

describe("BackgroundClockContainer Component", () => {
  test("renders Clock component with children overlaid", () => {
    render(
      <BackgroundClockContainer>
        <span>Overlay Content</span>
      </BackgroundClockContainer>
    );

    // Check that the Clock component is rendered
    const clockElement = screen.getByRole("presentation");
    expect(clockElement).toBeInTheDocument();

    // Check that the children content is rendered over the clock
    const overlayContent = screen.getByText(/Overlay Content/i);
    expect(overlayContent).toBeInTheDocument();
  });

  test("applies the correct container styles for overlay", () => {
    render(
      <BackgroundClockContainer>
        <span>Overlay Content</span>
      </BackgroundClockContainer>
    );

    const overlayContent = screen.getByText(/Overlay Content/i).parentElement;

    expect(overlayContent).toHaveStyle({
      position: "absolute",
      top: "0",
      left: "0",
      right: "0",
      bottom: "0",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "white",
    });
  });
});
