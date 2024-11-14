
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

const DynamicDiv = ({
  children,
  closeIcon = "fa-solid fa-chevron-right",
  openIcon = "fa-solid fa-chevron-left",
  sideIcon = "fa-solid fa-calendar-check",
  color = "var(--primary)",
  backgroundColor = "var(--bg-primary)",
  title = "TIMESLOT",
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [mobileOpen, setMobileOpen] = useState(isMobile ? false : true);

  useEffect(() => {
    window.addEventListener("resize", () => {
      if (window.innerWidth <= 768) {
        setIsMobile(true);
        setMobileOpen(false);
      } else {
        setMobileOpen(true);
        setIsMobile(false);
      }
    });
  }, []);

  //Render the schedule form with the appointment details and booking button
  return (
    <>
      {isMobile && (
        <i
          onClick={() =>
            handleTwoWayCollapse(
              mobileOpen,
              setMobileOpen,
              "dynamic-container",
              "right"
            )
          }
          className={`${openIcon} dynamic-mobile-toggle ${
            mobileOpen ? "hidden" : ""
          }`}
        ></i>
      )}
      {mobileOpen && (
        <div
          className={`main-right dynamic-container ${isMobile ? "mobile" : ""}`}
          style={{}}
        >
          <header
            className="dynamic-header"
            style={{
              backgroundColor: backgroundColor,
              color: color,
            }}
          >
            {isMobile && (
              <i
                onClick={() =>
                  isMobile &&
                  handleTwoWayCollapse(
                    mobileOpen,
                    setMobileOpen,
                    "dynamic-container",
                    "right"
                  )
                }
                className={`${closeIcon} dynamic-header-icon-left`}
              ></i>
            )}
            <h1 className="no-margin">{title}</h1>
            <i className={`${sideIcon} dynamic-header-icon-right`}></i>
          </header>
          {children}
        </div>
      )}
    </>
  );
};

export default DynamicDiv;
