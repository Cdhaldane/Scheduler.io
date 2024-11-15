
/**
 * DynamicDiv Component
 *
 * Purpose:
 * - This component renders a collapsible side panel that adjusts for mobile and desktop views, providing a responsive container with customizable icons, colors, and title.
 *
 *
 * State:
 * - `isMobile`: Boolean that tracks if the window width is 768px or smaller, adjusting the layout for mobile.
 * - `mobileOpen`: Boolean that controls the visibility of the panel in mobile view.
 *
 * Effects:
 * - On component mount and window resize, `isMobile` and `mobileOpen` are updated based on the screen width.
 *
 * Key Functions:
 * - `handleTwoWayCollapse`: Invoked when toggling the panel visibility in mobile view, allowing for smooth collapse/expand animations.
 *
 * UI Structure:
 * - Displays a toggle icon in mobile view to open/close the panel.
 * - Renders a header with customizable title, color, background color, and side icon.
 * - Displays `children` content inside the panel when `mobileOpen` is true.
 *
 * Notes:
 * - Ensure that the `handleTwoWayCollapse` function is defined in `Utils.jsx` to handle the toggle behavior.
 * - The CSS classes, such as `dynamic-container`, `dynamic-header`, and icon-specific classes, should be defined in `DynamicDiv.css`.
 */



import React, { useState, useEffect } from "react";

import "./DynamicDiv.css";
import { handleTwoWayCollapse } from "../../Utils.jsx";

/**
 * DynamicDiv Component
 *
 * Purpose:
 * This component renders a dynamic, collapsible side panel that can change its behavior based on the screen size (mobile or desktop).
 * It provides an interface where the panel can be opened or closed using icons and adjusts the layout for mobile users.
 *
 * Props:
 * - `children`: The content to be rendered inside the dynamic div.
 * - `closeIcon`: The icon class for closing the panel (defaults to a chevron pointing right).
 * - `openIcon`: The icon class for opening the panel (defaults to a chevron pointing left).
 * - `sideIcon`: An additional icon on the right side of the header (defaults to a calendar icon).
 * - `color`: The text color for the header (defaults to the primary theme color).
 * - `backgroundColor`: The background color for the header (defaults to the primary background color).
 * - `title`: The title text to be displayed in the header (defaults to "TIMESLOT").
 *
 * Example Usage:
 * <DynamicDiv title="Schedule" color="red" backgroundColor="blue">
 *   <div>Your content goes here</div>
 * </DynamicDiv>
 */

const DynamicDiv = ({
  children,
  closeIcon = "fa-solid fa-chevron-right",
  openIcon = "fa-solid fa-chevron-left",
  sideIcon = "fa-solid fa-calendar-check",
  color = "var(--primary)",
  backgroundColor = "var(--bg-primary)",
  title = "TIMESLOT",
}) => {
  // State to determine if the screen is mobile-sized and whether the mobile panel is open
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [mobileOpen, setMobileOpen] = useState(isMobile ? false : true);

  // Effect to listen to window resize events and adjust mobile view accordingly
  useEffect(() => {
    window.addEventListener("resize", () => {
      if (window.innerWidth <= 768) {
        setIsMobile(true);
        setMobileOpen(false); // Close the panel on mobile view when resizing down
      } else {
        setMobileOpen(true); // Open the panel on larger screens
        setIsMobile(false);
      }
    });
  }, []);

  // Return JSX for rendering the dynamic div with mobile-specific controls
  return (
    <>
      {isMobile && (
        <i
          id="open-icon"
          onClick={() =>
            handleTwoWayCollapse(
              mobileOpen,
              setMobileOpen,
              "dynamic-container",
              "right"
            )
          } // Call handleTwoWayCollapse to open the panel when clicked
          className={`${openIcon} dynamic-mobile-toggle ${
            mobileOpen ? "hidden" : ""
          }`}
        ></i>
      )}
      {mobileOpen && (
        <div
          className={`main-right dynamic-container ${isMobile ? "mobile" : ""}`}
          style={{}} // Apply mobile-specific styles if needed
        >
          <header
            className="dynamic-header"
            style={{
              backgroundColor: backgroundColor,
              color: color,
            }} // Header with custom background and text colors
          >
            {isMobile && (
              <i
                id="close-icon"
                onClick={() =>
                  isMobile &&
                  handleTwoWayCollapse(
                    mobileOpen,
                    setMobileOpen,
                    "dynamic-container",
                    "right"
                  )
                } // Call handleTwoWayCollapse to close the panel when clicked
                className={`${closeIcon} dynamic-close-icon`}
              ></i>
            )}
            <h1 className="no-margin">{title}</h1> {/* Render the title */}
            <i
              className={`${sideIcon} dynamic-header-icon-right`}
              id="side-icon"
            ></i>{" "}
            {/* Render the optional side icon */}
          </header>
          {children} {/* Render the children passed into the component */}
        </div>
      )}
    </>
  );
};

export default DynamicDiv;
