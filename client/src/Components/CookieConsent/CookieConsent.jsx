import React, { useState, useEffect } from "react";
import "./CookieConsent.css"; // Make sure to create a corresponding CSS file

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setIsVisible(false);
  };

  return (
    isVisible && (
      <div className="modal">
        <div className="cookie-consent">
          <p>
            We use cookies to enhance your browsing experience. By continuing to
            browse, you consent to our use of cookies.
          </p>
          <button onClick={handleAccept}>I Accept</button>
        </div>
      </div>
    )
  );
};

export default CookieConsent;
