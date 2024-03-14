import React, { createContext, useContext, useState } from "react";

import "./Provider.css";

const AlertContext = createContext();

export const useAlert = () => {
  return useContext(AlertContext);
};

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState(null);

  // Function to show the alert
  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => {
      setAlert(null); // Hide the alert after 5 seconds
    }, 5000);
  };

  return (
    <AlertContext.Provider value={{ alert, showAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

const Alert = () => {
  const { alert } = useContext(AlertContext);

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
