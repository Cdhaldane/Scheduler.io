import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./CustomerLogin.css";

const CustomerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const [emialError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if(emialError) { setEmailError("");}
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

  const handleLogin = () => {
    // Perform login logic here
    setEmailError("");
    setPasswordError("");

    if(!validateEmail(email)) {
      setEmailError("Invalid email address.");
      return;
    }

    if(!password) {
      setPasswordError("Password is required.");
      return;
    }

    console.log("Logging in...",{email, password, stayLoggedIn});
    navigate("/customer-bookingPage");
  };

  return (
    <div className="login-container">
      <h2>Please log in to your account:</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={handleEmailChange}
        className={emialError ? "input-error" : ""}
      />
      {emialError && <div className="error-message">{emialError}</div>}
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
