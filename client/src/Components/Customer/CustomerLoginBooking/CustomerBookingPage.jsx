import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

import "./CustomerBookingPage.css";

/**
 * CustomerBookingPage Component
 * 
 * Purpose:
 * - The CustomerBookingPage component allows customers to view and submit their booking information.
 * - It displays a welcome message with the customer's name, email, and phone number.
 * - It provides a textarea for customers to enter additional comments about their booking.
 * 
 * Inputs:
 * - None directly; the component may receive customer details such as name, email, and phone number via React Router's location state.
 * 
 * Outputs:
 * - JSX for rendering the customer booking page with welcome message, service display, additional comments section, and submit button.
 */


const CustomerBookingPage = () => {
  const location = useLocation();
  const { name } = location.state || {};
  const { email } = location.state || {};
  const { phoneNumber } = location.state || {};

  const navigate = useNavigate();

  const handleSubmit = () => {
    // Perform login logic here
    console.log("Submitting...");
    navigate("/customer-submitPage", { state: { email, phoneNumber, name } });
  };

  return (
    <div className="guestbooking-container">
      <div className="guest-booking">
        <div>
          <h1>Customer Booking</h1>
        </div>
        <div className="info-display">
          Welcome {name}!
          <br />
          You are logged in as {email} and contact phone number is {phoneNumber}
          .
          {/*^^ This ^^ is a test line to ensure the correct data is reaching every page */}
        </div>
        <div className="info-display">
          This is the place to display service from booking page.
        </div>
        <div className="additional-comments">
          <h2>Additional Comments</h2>
          <textarea
            rows="4"
            cols="50"
            placeholder="Enter any additional comments here"
          ></textarea>
        </div>

        <button onClick={handleSubmit} className="button">
          Submit
        </button>
      </div>
    </div>
  );
};

export default CustomerBookingPage;
