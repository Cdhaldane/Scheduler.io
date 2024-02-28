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
    let formIsValid = true;
    const newErrorMessages = [];
    const phoneNumberPattern = /^\d{9}$/; // Regular expression for exactly 9 digits
  
    if(!name.trim()) {
      newErrorMessages.push("Name cannot be empty.");
      formIsValid = false;
    }
    if(!phoneNumber.trim()) {
      newErrorMessages.push("Phone number cannot be empty.");
      formIsValid = false;
    }else if (!phoneNumberPattern.test(phoneNumber)) {
      newErrorMessages.push("Phone number must be exactly 9 digits.");
      formIsValid = false;
    } 
    
    if (phoneNumber !== confirmPhoneNumber) {
      newErrorMessages.push("Phone numbers do not match.");
      formIsValid = false;
    } 
   
    if(newErrorMessages.length > 0) {
      setErrorMessage(newErrorMessages);
    } else {
      setErrorMessage([]);
      navigate('/successfully-bookingPage',{state:{name, phoneNumber}}); 
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
      </div>
      <div className="guest-booking">
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
        {errorMessages.length >0 &&(
          <div className="error-messages">
            {errorMessages.map((message, index) => (
              <div key={index}>{message}</div>
            ))}
          </div>
        )}
        <div className="additional-comments">
          <h2>Additional Comments</h2>
          <textarea rows="4" cols="50" placeholder="Enter any additional comments here"></textarea>
        </div>
      </div>
      <button onClick={(handleSubmit)} className="submit-booking-button">Submit</button>
      </div>
    </div>
  );
};

export default GuestBookingPage;
