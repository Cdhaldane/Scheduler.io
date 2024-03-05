import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

import "./CustomerRegisterSubmitPage.css";

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
