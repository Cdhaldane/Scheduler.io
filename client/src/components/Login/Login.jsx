import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../Alert/AlertProvider";

import "./Login.css";

const Login = ({ onLoginSuccess, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [isLoggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const alert = useAlert();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (!validateEmail(e.target.value)) {
      setEmailError(true);
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (passwordError) {
      setPasswordError("");
    }
  };

  const handleStayLoggedInChange = (e) => {
    setStayLoggedIn(e.target.checked);
  };

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
    if (!/^\d{10}$/.test(e.target.value)) {
      setPhoneNumberError(true);
    }
  };

  const handleLogin = () => {
    // Perform login logic here
    console.log("Logging in...");
    navigate("/admin");
    sessionStorage.setItem("isAdmin", "true");

    let errors = [];

    if (!validateEmail(email)) errors.push("Invalid email.");

    if (!password) errors.push("Password is required.");

    // if (!/^\d{10}$/.test(phoneNumber)) errors.push("Invalid phone number.");

    if (errors.length > 0) {
      alert.showAlert("error", errors);
      return;
    }
    onLoginSuccess();
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
      {/* <input
        type="tel"
        placeholder="Phone Number (10 digits)"
        onChange={handlePhoneNumberChange}
        className={phoneNumberError ? "input-error" : ""}
      /> */}

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={handlePasswordChange}
        className={passwordError ? "input-error" : ""}
      />
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

        <label htmlFor="stay-logged-in" className="stay-logged-in-label">
          Stay logged in
        </label>
      </div>
      <span>
        <button className="button" onClick={handleLogin}>
          Log in
        </button>
      </span>
    </div>
  );
};

export default Login;
