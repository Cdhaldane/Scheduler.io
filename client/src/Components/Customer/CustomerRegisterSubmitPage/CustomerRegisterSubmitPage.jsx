import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

import "./CustomerRegisterSubmitPage.css";

/**
 * CustomerRegisterSubmitPage Component
 * 
 * Purpose:
 * - The CustomerRegisterSubmitPage component is the final step in the customer registration process.
 * - It prompts the customer to verify their email address by entering a verification code.
 * - The verification step is currently a placeholder and will be implemented once the backend is set up.
 * 
 * Inputs:
 * - None directly; the component may receive customer details such as name, email, and phone number via React Router's location state.
 * 
 * Outputs:
 * - JSX for rendering the verification page with an input field for the verification code and a verify button.
 */

const CustomerRegisterSubmitPage = () => {
  //Pull the accounts' name, phone number and email
  const { email, phoneNumber, name } = useLocation().state || {};
  const navigate = useNavigate();

  const handleVerifyClick = () => {
    // The function will be edited when the backend is implemented
    navigate("/customer-bookingPage", { state: { email, phoneNumber, name } });
  };

  return (
    <div className="customer-register-submit-container">
      <h1>Register Verification</h1>
      <div className="info-display">
        One last step {name}, before you book!
        <br />
        Please verify your email address, {email}, to complete your account
        registration.
      </div>

      <input
        type="text"
        // value = {verificationCode} will be used to store the verification code entered by the user
        // the function will be edit when the backend is implemented
        placeholder="Enter the verification code"
      />

      <button className="button" onClick={handleVerifyClick}>
        Verify
      </button>
    </div>
  );
};

export default CustomerRegisterSubmitPage;
