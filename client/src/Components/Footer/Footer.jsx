// Footer.js
import React from "react";
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
  return (
    <footer className="footer" data-testid="footer">
      <div className="footer-content">
        <p>© 2024 Timeslot. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
