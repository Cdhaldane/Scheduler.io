import React from "react";

/**
 * NotFoundPage Component
 *
 * Purpose:
 * - The NotFoundPage component provides a user interface for displaying a 404 Not Found error.
 * - It informs the user that the requested page does not exist.
 *
 * Inputs:
 * - None
 *
 * Outputs:
 * - JSX for rendering a message indicating that the page is not found, with a 404 error code.
 */

const NotFoundPage = () => {
  return (
    <div
      className="not-found-container"
      style={{ textAlign: "center", marginTop: "50px" }}
    >
      <h1>404 Not Found</h1>
      <p>Oops! The page you are looking for does not exist.</p>
    </div>
  );
};

export default NotFoundPage;
