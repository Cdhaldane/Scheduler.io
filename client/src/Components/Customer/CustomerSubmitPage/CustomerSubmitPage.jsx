import React, { useState } from "react";
import { useLocation} from "react-router-dom";
import {useNavigate } from "react-router-dom";

import "./CustomerSubmitPage.css";

/**
 * CustomerSubmitPage Component
 * 
 * Purpose:
 * - The CustomerSubmitPage component confirms to the customer that their appointment has been successfully booked.
 * - It displays a thank you message with the customer's name and contact details for confirmation.
 * 
 * Inputs:
 * - None directly; the component may receive customer details such as name, email, and phone number via React Router's location state.
 * 
 * Outputs:
 * - JSX for rendering the confirmation page with a thank you message and a button to navigate back to the home page.
 */

const CustomerSubmitPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {email} = location.state || {};
  const {phoneNumber} = location.state || {};
  const {name} = location.state || {};
  

  // Render the confirmation page with a thank you message and a button to navigate back to the home page
  return (
    <div className="customerSubmit-container">
      <div className="customer-submit">
        <div>
          <h1>Your appointment has been booked!</h1>
        </div>
        <div className="info-display">
          This is the place to display service from booking page. 
        </div>
        <div className="info-display">
          <p>Thank you for booking, {name}! We will contact you at {phoneNumber} or {email}, to confirm your appointment.</p>
        </div>

        <div>
          <button onClick={() => navigate('/')} className="button">Back to Home</button>
        </div>
      </div>
    </div>
  );
};

export default CustomerSubmitPage;
