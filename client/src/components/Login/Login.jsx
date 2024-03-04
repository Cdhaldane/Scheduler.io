import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = () => {
    // Perform login logic here
    console.log("Logging in...");
    navigate("/admin");
    sessionStorage.setItem("isAdmin", "true");
  };

  const handleCreateAccount = () => {
    // Redirect to create account page or show create account form
    navigate("/create-account");
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={handleEmailChange}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={handlePasswordChange}
      />
      <span>
        <button onClick={handleLogin}>Login</button>
        <button onClick={handleCreateAccount}>Create Account</button>
      </span>
    </div>
  );
};

export default Login;
