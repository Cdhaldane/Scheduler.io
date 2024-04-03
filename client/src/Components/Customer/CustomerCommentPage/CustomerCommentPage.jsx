import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import "./CustomerCommentPage.css";

/**
 * CustomerCommentPage Component
 *
 * Purpose:
 * - The CustomerCommentPage component allows customers to leave comments for their past appointments.
 * - It provides a text area for entering comments and an option to leave the comment anonymously.
 *
 * Inputs:
 * - None directly; the component may receive customer details such as name and phone number via React Router's location state.
 *
 * Outputs:
 * - JSX for rendering the comment submission form and navigation buttons.
 */
const CustomerCommentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { name, phoneNumber } = location.state || {};

  return (
    <div className="CustomerComment-container">
      <div className="CustomerComment">
        <div className="welcome-message">
          <h1>Comment Page</h1>
        </div>
        <div className="appointments-container">
          <div className="additional-comments">
            <h2>Add Comments for past appointments</h2>
            <textarea
              rows="4"
              cols="50"
              placeholder="Enter any comments here"
            ></textarea>
            <div className="anonymous-checkbox">
              <input
                type="checkbox"
                id="anonymousComment"
                name="anonymousComment"
              />
              <label htmlFor="anonymousComment">
                Leave a comment anonymously
              </label>
            </div>
          </div>
        </div>
        <div className="submit-button">
          <button onClick={() => navigate("/")} className="button">
            Submit
          </button>
        </div>
        <div className="back-to-home">
          <button onClick={() => navigate("/")} className="button">
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerCommentPage;
