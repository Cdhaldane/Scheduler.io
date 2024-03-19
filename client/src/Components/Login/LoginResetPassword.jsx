import React, { useState } from "react";
import Input from "../Input/Input";
import { supabase } from "../../Database";
import { useAlert } from "../Providers/Alert";
import { useNavigate } from "react-router-dom";

import "./Login.css";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const alert = useAlert();
  const navigate = useNavigate();

  const handleNewPassword = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      alert.showAlert("error", error.message);
    } else {
      alert.showAlert("success", "Password updated successfully");
      setTimeout(() => {
        navigate("/home");
      }, 2000);
    }
  };

  return (
    <div className="password-reset">
      <h2>Set New Password</h2>
      <form onSubmit={handleNewPassword}>
        <Input
          type="password"
          label="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Update Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
