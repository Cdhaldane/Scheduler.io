import React, { useState } from "react";
import { useLocation} from "react-router-dom";
import {useNavigate } from "react-router-dom";

import "./CustomerLandingPage.css";

const CustomerLandingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { name, phoneNumber } = location.state || {};

  return (
    <div className="customerLanding-container">
      <div className="customerLanging">
        <div className="welcome-message">
          <h1>Welcome {name}</h1>
        </div>
        <div className="appointments-container">
          <div className="info-display">
            This is the place to display upcoming appointments. 
          </div>
          <div className="info-display">
            This is the place to display past appointments.
            <button onClick={() => navigate('/customer-commentPage')} className="comment-button">Add Comment</button>
          </div>
        </div>
        <div className="back-to-home">
          <button onClick={() => navigate('/')} className="button">Back to Home</button>
        </div>
      </div>
    </div>
  );
};

export default CustomerLandingPage;
