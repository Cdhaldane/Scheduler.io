import React, { useState } from "react";
import { useAlert } from "../../../DevComponents/Providers/Alert";
import { useNavigate } from "react-router-dom";

import "./CustomerRegister.css";

/**
 * CustomerRegister Component
 *
 * Purpose:
 * - The CustomerRegister component allows customers to register for an account by providing their details.
 * - It includes input fields for email, password, name, phone number, and home address.
 * - It performs validation on the email and phone number and ensures that the password and verified password match.
 *
 * Inputs:
 * - onClose: A callback function that is called when the registration process is complete.
 *
 * Outputs:
 * - JSX for rendering the registration form with input fields and a register button.
 */

const CustomerRegister = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifiedPassword, setVerifiedPassword] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errorMessages, setErrorMessage] = useState([]);
  const [homeAddress, setHomeAddress] = useState("");
  const alert = useAlert();
  const navigate = useNavigate();

  //Validation functions for email, phone number, and password matching
  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const isPhoneNumberValid = (phoneNumber) => /^\d{10}$/.test(phoneNumber);
  const doPasswordsMatch = (password, verifiedPassword) =>
    password === verifiedPassword;

  //Event handlers for input fields
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleVerifiedPasswordChange = (e) => {
    setVerifiedPassword(e.target.value);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handlePhoneNumberChange = (e) => {
    const newPhoneNumber = e.target.value;
    setPhoneNumber(newPhoneNumber);
  };

  const handleHomeAddressChange = (e) => {
    setHomeAddress(e.target.value);
  };

  //Event handler for register button
  const handleRegister = () => {
    const newErrorMessages = [];
    if (!email) {
      newErrorMessages.push("Please enter a valid email"); //no email is entered
    } else if (!validateEmail(email)) {
      newErrorMessages.push("Invalid email format."); //invalid email format
    }
    if (!password) {
      newErrorMessages.push("Password cannot be empty."); //no password is entered
    }
    if (!doPasswordsMatch(password, verifiedPassword) || !verifiedPassword) {
      newErrorMessages.push("Passwords do not match."); //verify password is empty or does not match
    }

    if (!phoneNumber) {
      newErrorMessages.push("Please enter a phone number"); //no phone number is entered
    } else if (!isPhoneNumberValid(phoneNumber)) {
      newErrorMessages.push("Phone number must be 10 digits."); //Phone number is not valid
    }

    if (newErrorMessages.length > 0) {
      console.log("Error messages", newErrorMessages);
      alert.showAlert("error", newErrorMessages);
      return;
    }
    console.log("Registering in...", {
      email,
      password,
      name,
      phoneNumber,
      homeAddress,
    });
    navigate("/customer-register-submitPage", {
      state: { email, password, name, phoneNumber, homeAddress },
    });

    onClose();
  };

  //Render the registration form
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

      <span>
        <button className="button" onClick={handleRegister}>
          Register
        </button>
      </span>
    </div>
  );
};

export default CustomerRegister;
