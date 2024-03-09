import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAlert } from "../Providers/Alert";
import Input from "../Input/Input";
import { ReactComponent as GoogleIcon } from "../../Icons/Google.svg";
import { ReactComponent as GitHubIcon } from "../../Icons/GitHub.svg";
import { ReactComponent as Microsoft } from "../../Icons/Microsoft.svg";

import { loginWithGoogle } from "../../Database";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createClient } from "@supabase/supabase-js";
import { supabase, getUsers, signUp, signIn } from "../../Database";

import "./Login.css";

const Login = ({ onLoginSuccess, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [signUpFlag, setSignUpFlag] = useState(false);
  const navigate = useNavigate();
  const alert = useAlert();
  const location = useLocation();
  console.log("Location:", window.location);

  useEffect(() => {}, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = { data: {}, error: null };

    if (signUpFlag) {
      if (password !== confirmPassword) {
        setError("Passwords do not match");
      } else {
        const { data, error } = await signUp(email, password, name);
        if (error) setError(error.message);
        else {
          alert.showAlert("success", "Signed up successfully");
          // onLoginSuccess(data);
        }
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) setError(error.message);
      else {
        alert.showAlert("success", "Logged in successfully");
        onLoginSuccess(data);
      }
    }
  };

  const handleSSO = (provider) => async () => {
    if (provider === "google") {
      await loginWithGoogle(window.location.href);
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <img src={"/logo.png"} alt="logo" className="login-logo" />
        <h1> Time Slot</h1>
      </div>

      <div className="login-buttons">
        <button onClick={handleSSO("google")}>
          <GoogleIcon />
        </button>
        <button>
          <GitHubIcon />
        </button>
        <button>
          <Microsoft />
        </button>
      </div>
      <form
        className="login-form"
        onSubmit={handleSubmit}
        autoComplete="new-password"
      >
        <Input
          label="Email"
          placeholder="Email"
          type="email"
          value={email}
          onInputChange={(newValue) => setEmail(newValue)}
        />
        <Input
          label="Password"
          placeholder="Password"
          type="password"
          value={password}
          onInputChange={(newValue) => setPassword(newValue)}
        />

        {signUpFlag && (
          <>
            <Input
              label="Confirm Password"
              placeholder="Password"
              type="password"
              value={confirmPassword}
              onInputChange={(newValue) => setConfirmPassword(newValue)}
            />
            <Input
              label="Name"
              placeholder="Name"
              type="name"
              value={name}
              onInputChange={(newValue) => setName(newValue)}
            />
          </>
        )}
        <div className="login-error">{error ? <p>{error}</p> : <></>}</div>
        <button type="submit" className="login-button">
          {signUpFlag ? "Sign Up" : "Sign In"}
        </button>
        <a href="/forgot-password">Forgot your Password?</a>
        <a onClick={() => setSignUpFlag(!signUpFlag)}>
          {signUpFlag ? "Back to sign in" : "Don't have an account? Sign up"}{" "}
        </a>
      </form>

      {/* <button onClick={signInWithEmail}>Sign in with Email</button> */}
    </div>
  );
};

export default Login;
