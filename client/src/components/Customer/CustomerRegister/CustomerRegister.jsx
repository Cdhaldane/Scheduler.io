import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


import "./CustomerRegister.css";

const CustomerRegister = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifiedPassword, setVerifiedPassword] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errorMessages, setErrorMessage] = useState([]);
  const [homeAddress, setHomeAddress] = useState("");
  const navigate = useNavigate();
  
  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const isPhoneNumberValid = (phoneNumber) => /^\d{10}$/.test(phoneNumber);
  const doPasswordsMatch = (password, verifiedPassword) => password === verifiedPassword;


  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setErrorMessage((preErrorMessages) => preErrorMessages.filter((message) => message !== "Invalid email format."));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleVerifiedPasswordChange = (e) => {
    setVerifiedPassword(e.target.value);
  }

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handlePhoneNumberChange = (e) => {
    const newPhoneNumber = e.target.value;
    setPhoneNumber(newPhoneNumber);
    setErrorMessage((preErrorMessages) => preErrorMessages.filter((message) => message !== "Phone number cannot be empty."));

    if (/^\d{10}$/.test(newPhoneNumber)) {
      setErrorMessage((prevErrorMessages) => prevErrorMessages.filter((message) => !message.includes("Phone number must be 10 digits.")));
    }
  };

  const handleHomeAddressChange = (e) => {
    setHomeAddress(e.target.value);
  };

  const handleRegister = () => {
    const newErrorMessages = [];
    if(!email) {
      newErrorMessages.push("Email cannot be empty.");
    }else if(!validateEmail(email)) {
      newErrorMessages.push("Invalid email format.");
    }
    if(!password) {
      newErrorMessages.push("Password cannot be empty.");
    }
    if(!verifiedPassword) {
      newErrorMessages.push("Verified password cannot be empty.");
    }else if(!doPasswordsMatch(password, verifiedPassword)) {
      newErrorMessages.push("Passwords do not match.");
    }

    if(!phoneNumber) {
      newErrorMessages.push("Phone number cannot be empty.");
    }else if(!isPhoneNumberValid(phoneNumber)) {
      newErrorMessages.push("Phone number must be 10 digits.");
    }

    if(newErrorMessages.length > 0) {
      setErrorMessage(newErrorMessages);
      return
    }
    console.log("Registering in...",{email, password, name, phoneNumber, homeAddress});
    navigate('/customer-register-submitPage', {state: {email, password, name, phoneNumber, homeAddress}});
  };


  return (
    <div className="customer-register-container">
      <h2>Register</h2>
      <div>
        <h3>Please enter your account information:</h3>
      </div>
      <input
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={handleEmailChange}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={handlePasswordChange}
      />
      <input
        type="password"
        placeholder="Verify Password"
        value={verifiedPassword}
        onChange={handleVerifiedPasswordChange}
      />
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={handleNameChange}
      />
      <input
        type="text"
        placeholder="Phone Number"
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
      />
      <input
        type="text"
        placeholder="Home Address (Optional)"
        value={homeAddress}
        onChange={handleHomeAddressChange}
      />
      <div className="error-messages">
        {errorMessages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
      <span>
        <button className= "button" onClick={handleRegister}>Register</button>
      </span>
    </div>
  );
};

export default CustomerRegister;
