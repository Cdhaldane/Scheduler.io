import React, { useState } from "react";
import { useLocation} from "react-router-dom";
import {useNavigate } from "react-router-dom";

import "./CustomerLandingPage.css";

/**
 * CustomerLandingPage Component
 * 
 * Purpose:
 * - The CustomerLandingPage component serves as the landing page for customers after they log in or navigate to the app.
 * - It displays a welcome message with the customer's name and sections for upcoming and past appointments.
 * - It provides a button to navigate to the comment page where customers can add comments for their past appointments.
 * 
 * Inputs:
 * - None directly; the component may receive customer details such as name and phone number via React Router's location state.
 * 
 * Outputs:
 * - JSX for rendering the customer landing page with welcome message, appointment sections, and navigation buttons.
 */


const CustomerLandingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { name, phoneNumber } = location.state || {};

  return (
    <div className="customerLanding-container">
      <div className="customerLanging">
        <div className="welcome-message">
          <h1>Welcome {name}</h1>
        </div>
        <div className="appointments-container">
          <div className="info-display">
            This is the place to display upcoming appointments. 
          </div>
          <div className="info-display">
            This is the place to display past appointments.
            <button onClick={() => navigate('/customer-commentPage')} className="comment-button">Add Comment</button>
          </div>
        </div>
        <div className="back-to-home">
          <button onClick={() => navigate('/')} className="button">Back to Home</button>
        </div>
      </div>
    </div>
  );
};

export default CustomerLandingPage;
