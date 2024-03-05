import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./CustomerLogin.css";

/******************************************
*
*THIS PAGE IS OBSOLETE, IT HAS BEEN INCORPORATED INTO: navbar modal for log in code has been copied to Login.jsx
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



const CustomerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if(emailError) { setEmailError("");}
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if(passwordError) { setPasswordError("");}
  };

  const handleStayLoggedInChange = (e) => {
    setStayLoggedIn(e.target.checked);
  }

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
    if(phoneNumberError) { setPhoneNumberError("");}
  };

  const handleLogin = () => {
    // Perform login logic here
    setEmailError("");
    setPasswordError("");
    setPhoneNumberError("");

    if(!validateEmail(email)) {
      setEmailError("Invalid email address.");
      return;
    }

    if(!password) {
      setPasswordError("Password is required.");
      return;
    }

    if(!/^\d{10}$/.test(phoneNumber)) {
      setPhoneNumberError("Phone number must be exactly 10 digits.");
      return;
    }

    console.log("Logging in...",{email, password, phoneNumber, stayLoggedIn});
    navigate("/customer-bookingPage",{state: {email, phoneNumber}});
  };

  return (
    <div className="login-container">
      <h2>Please log in to your account:</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={handleEmailChange}
        className={emailError ? "input-error" : ""}
      />
      {emailError && <div className="error-message">{emailError}</div>}
      <input
        type="tel"
        placeholder="Phone Number (10 digits)"
        onChange={handlePhoneNumberChange}
        className={phoneNumberError ? "input-error" : ""}
      />
      {phoneNumberError && <div className="error-message">{phoneNumberError}</div>}
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={handlePasswordChange}
        className={passwordError ? "input-error" : ""}
      />
      {passwordError && <div className="error-message">{passwordError}</div>}
      <div className="forgot-password">
        <a href="/forgot-password">Forgot password?</a>
      </div>
      <div className="checkbox-container">
        <input 
          id="stay-logged-in"
          type="checkbox"
          checked={stayLoggedIn}
          onChange={handleStayLoggedInChange}
        />

        <label htmlFor="stay-logged-in" className="stay-logged-in-label">Stay logged in</label>
      </div>
      <span>
        <button className="button" onClick={handleLogin}>Submit</button>
      </span>
    </div>
  );
};

export default CustomerLogin;
