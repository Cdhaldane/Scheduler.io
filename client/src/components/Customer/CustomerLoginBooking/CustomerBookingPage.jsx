import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

import "./CustomerBookingPage.css";

const CustomerBookingPage = () => {
  const location = useLocation();
  const {email} = location.state || {};
  const {phoneNumber} = location.state || {};
 
  const navigate = useNavigate();

 

  const handleSubmit = () => {
    // Perform login logic here
    console.log("Submitting..."); 
    navigate("/customer-submitPage",{state: {email, phoneNumber}});
  };



  return (
    <div className="guestbooking-container">
      <div className="guest-booking">
      <div>
        <h1>Customer Booking</h1>
      </div>
      <div className="info-display">
        You are loggin as {email} and contact phone number is {phoneNumber}.
      </div>
      <div className="info-display">
        This is the place to display service from booking page. 
      </div>
      <div className="additional-comments">
        <h2>Additional Comments</h2>
        <textarea rows="4" cols="50" placeholder="Enter any additional comments here"></textarea>
      </div>

      
      <button onClick={(handleSubmit)} className="button">Submit
      </button>
      </div>
    </div>
  );
};

export default CustomerBookingPage;
