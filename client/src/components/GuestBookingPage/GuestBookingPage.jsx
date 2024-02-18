import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./GuestBookingPage.css";

const GuestBookingPage = () => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [confirmPhoneNumber, setConfirmPhoneNumber] = useState("");
  const [errorMessages, setErrorMessage] = useState([]); 
  const [nameErrorMessage, setNameErrorMessage] = useState([]);
  const navigate = useNavigate();

  const handleNameChange = (e) => {
    const namePattern = /^[a-zA-Z\s]*$/;
  
    if (!namePattern.test(e.target.value)) {
      setNameErrorMessage("Name cannot contain numbers.");
    } else {
      setNameErrorMessage("");
    }
  
    setName(e.target.value);
  };
  

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleConfirmPhoneNumberChange = (e) => {
    setConfirmPhoneNumber(e.target.value);
  };

  const handleSubmit = () => {
    const phoneNumberPattern = /^\d{9}$/; // Regular expression for exactly 9 digits
  
    if (!phoneNumberPattern.test(phoneNumber)) {
      setErrorMessage("Phone number must be exactly 9 digits.");
    } else if (phoneNumber !== confirmPhoneNumber) {
      setErrorMessage("Phone numbers do not match.");
    } else {
      setErrorMessage("");
      // Perform any additional form submission logic here
  
      // Navigate to the desired page
      navigate('/SuccessfullyBookingPage',{state:{name, phoneNumber}}); // Replace '/next-page' with the path of the page you want to navigate to
    }
  };
  
  



  return (
    <div className="guestbooking-container">
      <div className="guest-booking">
      <div>
        <h1>Guest Booking</h1>
      </div>
      <div className="info-display">
        This is the place to display service from booking page. 
      </div>
      <div className="guest-booking">
        <h2>Enter your email and password to book an appointment</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={handleNameChange}
        />
        {nameErrorMessage && <div className="error-messages">{nameErrorMessage}</div>}
        <input
          type="tel"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          pattern="\d{9}"
          title="Phone number must be exactly 9 digits."
        />

        <input
          type="tel"
          placeholder="Confirm Phone Number"
          value={confirmPhoneNumber}
          onChange={handleConfirmPhoneNumberChange}
          pattern="\d{9}"
          title="Phone number must be exactly 9 digits."
        />
        {errorMessages && <div className="error-messages">{errorMessages}</div>}
      </div>
      <button onClick={(handleSubmit)} className="submit-booking-button">Submit
      </button>
      </div>
    </div>
  );
};

export default GuestBookingPage;
