// Footer.js
import React from "react";
import { useLocation } from "react-router-dom";

import "./Footer.css"; // Import the CSS file for the footer

/**
 * Footer Component
 *
 * Purpose:
 * - The Footer component displays a simple footer with a copyright notice.
 *
 * Inputs:
 * - None.
 *
 * Outputs:
 * - JSX for rendering the footer with the copyright notice.
 */

const Footer = () => {
  const location = useLocation();
  const isCalendar =
    location.pathname.includes("/admin") ||
    location.pathname === "/home" ||
    location.pathname.includes("/employee");

  return (
    <footer
      className="footer"
      data-testid="footer"
      style={{
        backgroundColor: isCalendar ? "var(--bg-primary)" : "var(--bg-primary)",
      }}
    >
      <div className="footer-content">
        <p>© 2024 Timeslot. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
