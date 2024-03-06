import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../Alert/AlertProvider";
import { loginWithGoogle } from "../../Database";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "../../Database";

import "./Login.css";

const Login = ({ onLoginSuccess, onClose }) => {
  const navigate = useNavigate();
  const alert = useAlert();

  return (
    <div className="login-container">
      <div className="login-header">
        <img src={"/logo.png"} alt="logo" className="login-logo" />
        <h1> Time Slot</h1>
      </div>

      <Auth
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,
          className: {
            divider: "login-divider",
            container: "login-super-container",
            form: "login-form",
            button: "login-button",
            input: "login-input",
            //..
          },
        }}
        theme="dark"
      />
    </div>
  );
};

export default Login;
