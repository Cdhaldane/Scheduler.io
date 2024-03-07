import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../Alert/AlertProvider";
import Input from "../Input/Input";
import { ReactComponent as GoogleIcon } from "../../Icons/Google.svg";
import { ReactComponent as GitHubIcon } from "../../Icons/GitHub.svg";
import { ReactComponent as Microsoft } from "../../Icons/Microsoft.svg";

import { loginWithGoogle } from "../../Database";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createClient } from "@supabase/supabase-js";
import { supabase, getUsers } from "../../Database";

import "./Login.css";

const Login = ({ onLoginSuccess, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const alert = useAlert();

  useEffect(() => {}, []);

  async function signInWithEmail(e) {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: "example@email.com",
      password: "example-password",
    });

    if (error) {
      setError(error.message);
      console.log(error);
    } else {
      onLoginSuccess(data);
      navigate("/");
    }
  }

  return (
    <div className="login-container">
      <div className="login-header">
        <img src={"/logo.png"} alt="logo" className="login-logo" />
        <h1> Time Slot</h1>
      </div>

      <div className="login-buttons">
        <button onClick={loginWithGoogle}>
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
        onSubmit={(e) => signInWithEmail(e)}
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
        <div className="login-error">{error && <p>{error}</p>}</div>
        <button type="submit" className="login-button">
          Login
        </button>
        <a href="/forgot-password">Forgot your Password?</a>
        <a href="/create-account">Don't have an account? Sign up </a>
      </form>

      {/* <button onClick={signInWithEmail}>Sign in with Email</button> */}
    </div>
  );
};

export default Login;
