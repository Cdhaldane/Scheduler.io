import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../Providers/Alert";

import "./GuestBookingPage.css";

/******************************************
*
*THIS PAGE IS OBSOLETE, IT HAS BEEN INCORPORATED INTO:  This page had been copied to GuestBookingPage.jsx under Guest/GuestBookingPage
*
*
*
*
*DO NOT UPDATE THIS PAGE AS IT IS UNOBTAINABLE
*
*
*
*
*
*********************************/
const GuestBookingPage = () => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPhoneNumber, setConfirmPhoneNumber] = useState("");
  const [errorMessages, setErrorMessage] = useState([]);
  const [nameErrorMessage, setNameErrorMessage] = useState("");

  const alert = useAlert();
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
    const phoneNumberPattern = /^\d{10}$/; // Regular expression for exactly 10 digits

    if (!phoneNumberPattern.test(phoneNumber)) {
      alert.showAlert("error", "Phone number must be exactly 10 digits.");
    } else if (phoneNumber !== confirmPhoneNumber) {
      alert.showAlert("error", "Phone numbers do not match.");
    } else {
      navigate("/successfully-bookingPage", {
        state: { name, phoneNumber, email },
      }); // Replace '/next-page' with the path of the page you want to navigate to
    }
  };

  return (
    <div className="guestbooking-container app">
      <div className="guest-booking">
        <h1>Guest Booking</h1>
        <div className="info-display">
          This is the place to display service from booking page.
        </div>
        <h2>Enter your information to book an appointment</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">
            Name:{" "}
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={handleNameChange}
            />
          </label>

          <label htmlFor="email">
            Email:{" "}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
            />
          </label>

          <label htmlFor="tel">
            Telephone:{" "}
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
          </label>

          <button type="submit" className="submit-booking-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default GuestBookingPage;
