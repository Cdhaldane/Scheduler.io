import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./GuestBookingPage.css";

const GuestBookingPage = () => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPhoneNumber, setConfirmPhoneNumber] = useState("");
  const [errorMessages, setErrorMessage] = useState([]);
  const [nameErrorMessage, setNameErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleNameChange = (e) => {
    const namePattern = /^[a-zA-Z\s]*$/;

    if (!namePattern.test(e.target.value)) {
      setNameErrorMessage("Name cannot contain numbers or special characters.");
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

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    const newErrorMessages = [];
    const phoneNumberPattern = /^\d{10}$/; // Regular expression for exactly 10 digits

    if (!phoneNumberPattern.test(phoneNumber)) {
      newErrorMessages.push("Phone number must be exactly 10 digits.");
    }
    if (phoneNumber !== confirmPhoneNumber) {
      newErrorMessages.push("Phone numbers do not match.");
    }

    if (newErrorMessages.length > 0) {
      setErrorMessage(newErrorMessages);
    } else {
      setErrorMessage([]);
      // Perform any additional form submission logic here

      // Navigate to the desired page
      navigate("/successfully-bookingPage", {
        state: { name, phoneNumber, email },
      }); // Replace '/next-page' with the path of the page you want to navigate to
    }
  };

  return (
    <div className="guestbooking-container">
      <div className="guest-booking">
        <h1>Guest Booking</h1>
        <div className="info-display">
          This is the place to display service from booking page.
        </div>
        <h2>Enter your information to book an appointment</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={handleNameChange}
          />
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
          />
          <label htmlFor="tel">Telephone:</label>
          <input
            type="tel"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            title="Phone number must be exactly 10 digits."
          />
          <input
            type="tel"
            placeholder="Confirm Phone Number"
            value={confirmPhoneNumber}
            onChange={handleConfirmPhoneNumberChange}
            title="Phone number must be exactly 10 digits."
          />
          <button type="submit" className="submit-booking-button">
            Submit
          </button>
        </form>
        {nameErrorMessage && (
          <div className="error-messages">{nameErrorMessage}</div>
        )}
        {errorMessages.length > 0 && (
          <div className="error-messages">
            {errorMessages.map((message, index) => (
              <div key={index}>{message}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GuestBookingPage;
