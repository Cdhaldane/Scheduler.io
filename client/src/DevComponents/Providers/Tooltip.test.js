import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { TooltipProvider, useTooltip } from "./Tooltip";
import "@testing-library/jest-dom";

// Mock component to test useTooltip
const MockTooltipComponent = () => {
  const { showTooltip, hideTooltip, tooltip } = useTooltip();

  return (
    <div>
      <button
        onMouseEnter={() => showTooltip("Test Tooltip Message")}
        onMouseLeave={() => hideTooltip()}
      >
        Hover me
      </button>
      {tooltip.visible && <div>{tooltip.content}</div>}
    </div>
  );
};

describe("TooltipProvider", () => {
  test("displays tooltip when hovered and hides when mouse leaves", () => {
    render(
      <TooltipProvider>
        <MockTooltipComponent />
      </TooltipProvider>
    );

    // Hover over the button to show the tooltip
    fireEvent.mouseEnter(screen.getByText("Hover me"));

    // Check if the tooltip is displayed
    expect(screen.getByText("Test Tooltip Message")).toBeInTheDocument();

    // Stop hovering to hide the tooltip
    fireEvent.mouseLeave(screen.getByText("Hover me"));

    // Check if the tooltip is hidden
    expect(screen.queryByText("Test Tooltip Message")).not.toBeInTheDocument();
  });
});
