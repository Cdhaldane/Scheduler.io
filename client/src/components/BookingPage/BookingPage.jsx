import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./BookingPage.css";

const BookingPage = () => {
  //   const [email, setEmail] = useState("");
  //   const [password, setPassword] = useState("");
  const navigate = useNavigate();

  //   const handleEmailChange = (e) => {
  //     setEmail(e.target.value);
  //   };

  //   const handlePasswordChange = (e) => {
  //     setPassword(e.target.value);
  //   };

  //   const handleLogin = () => {
  //     // Perform login logic here
  //     console.log("Logging in...");
  //   };

  //   const handleCreateAccount = () => {
  //     // Redirect to create account page or show create account form
  //     navigate("/create-account");
  //   };

  return (
    <div className="booking-container">
      <div className="book-info">
        <h2>
          Please, register, login or book as a guest to continue with your
          booking:
        </h2>
        <div className="guest-booking">
          <button onClick={() => navigate("/guest-booking")} className="button">
            Guest Booking
          </button>
        </div>

        <div className="or-label">
          <h1>OR</h1>
        </div>

        <div className="customer-login-register">
          <button
            onClick={() => navigate("/customer-login")}
            className="button"
          >
            Customer Login
          </button>
          <button
            onClick={() => navigate("/customer-register")}
            className="button"
          >
            Customer Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
