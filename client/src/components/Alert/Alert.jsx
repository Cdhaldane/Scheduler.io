import React from "react";
import { useAlert } from "./AlertProvider"; // Import the context

import "./Alert.css";

const Alert = () => {
  const { alert } = useAlert();

  if (!alert) return null;

  let alertClass = "";
  switch (alert.type) {
    case "success":
      alertClass = "alert-success";
      break;
    case "warning":
      alertClass = "alert-warning";
      break;
    case "error":
      alertClass = "alert-error";
      break;
    default:
      alertClass = "alert-info";
  }

  return (
    <div className={`alert ${alertClass}`}>
      <i className="fas fa-exclamation-circle"></i>
      <div className="alert-body">
        {Array.isArray(alert.message) ? (
          alert.message.map((message, index) => <p key={index}>{message}</p>)
        ) : (
          <p>{alert.message}</p>
        )}
      </div>
    </div>
  );
};

export default Alert;
