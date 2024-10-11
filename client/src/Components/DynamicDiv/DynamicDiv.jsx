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
