import React from "react";
import "./Spinner.css"; // Make sure to create this CSS file in the same directory

const Spinner = () => {
  return (
    <div className="spinner-container">
      <div className="hourglass fast"></div>
    </div>
  );
};

export default Spinner;
