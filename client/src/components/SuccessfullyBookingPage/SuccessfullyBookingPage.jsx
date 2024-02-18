import React, { useState } from "react";
import { useLocation } from "react-router-dom";

import "./SuccessfullyBookingPage.css";

const SuccessfullyBookingPage = () => {
  const location = useLocation();
  const { name, phoneNumber } = location.state || {};

  return (
    <div className="successfullybooking-container">
      <div className="successfully-booking">
      <div>
        <h1>Successfully Booking</h1>
      </div>
      <div className="info-display">
        This is the place to display service from booking page. 
      </div>
      <div>
        <p>Thank you for booking, {name}! We will contact you at {phoneNumber} to confirm your appointment.</p>
      </div>
      </div>
    </div>
  );
};

export default SuccessfullyBookingPage;
