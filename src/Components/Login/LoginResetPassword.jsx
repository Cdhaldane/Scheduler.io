import React, { useState } from "react";
import Input from "../../DevComponents/Input/Input";
import { supabase } from "../../Database";
import { useAlert } from "../../DevComponents/Providers/Alert";
import { useNavigate } from "react-router-dom";

import "./Login.css";

/**
 * ResetPassword Component
 *
 * Purpose:
 * - The ResetPassword component provides a user interface for resetting the user's password.
 * - It allows the user to enter a new password and update it in the system.
 * - The component uses Supabase for authentication and updates the user's password in the database.
 * - It provides feedback to the user on the success or failure of the password update.
 *
 * Inputs:
 * - None
 *
 * Outputs:
 * - JSX for rendering the password reset form with an input field for the new password and a submit button.
 * - Alerts to inform the user of the status of their password update.
 */

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
    <div className="min-height">
      <div className="password-reset">
        <h2 className="no-margin">Set New Password</h2>
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
    </div>
  );
};

export default ResetPassword;
