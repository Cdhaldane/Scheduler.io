import React, { useState } from "react";
import { useLocation} from "react-router-dom";
import {useNavigate } from "react-router-dom";

import "./CustomerSubmitPage.css";

const CustomerSubmitPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {email} = location.state || {};
  const {phoneNumber} = location.state || {};
  const {name} = location.state || {};
  

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
