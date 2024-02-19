import React, { useState } from "react";
import { useLocation} from "react-router-dom";
import {useNavigate } from "react-router-dom";

import "./CustomerSubmitPage.css";

const CustomerSubmitPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {email} = location.state || {};
  const {phoneNumber} = location.state || {};
  

  return (
    <div className="customerSubmit-container">
      <div className="customer-submit">
        <div>
          <h1>Successfully Booking</h1>
        </div>
        <div className="info-display">
          This is the place to display service from booking page. 
        </div>
        <div className="info-display">
          <p>Thank you for booking, {email}! We will contact you at {phoneNumber} to confirm your appointment.</p>
        </div>

        <div>
          <button onClick={() => navigate('/')} className="button">Back to Home</button>
        </div>
      </div>
    </div>
  );
};

export default CustomerSubmitPage;
