import React, { useEffect, useState } from "react";
import AC from "./AC";
import { useNavigate } from "react-router-dom";
import { useDeviceType } from "../../Utils";

import "./AC.css";

/**
 * ACMain Component
 * 
 * Purpose:
 * - The ACMain component is a wrapper for the AC component that handles navigation after the animation sequence is completed.
 * - It checks if the introductory animation has been finished previously and navigates to the admin page if so.
 * 
 * Inputs:
 * - None.
 * 
 * Outputs:
 * - JSX for rendering the AC component with navigation logic.
 */

const ACMain = () => {
  const isMobile = useDeviceType();
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.introFinished) {
      if (sessionStorage.introFinished === "true") {
        sessionStorage.setItem("isAdmin", "true");
        navigate("/admin");
      }
    }
  }, [sessionStorage]);

  return (
    <div className="ac-main">
      <AC
        onFinish={() => {
          sessionStorage.setItem("introFinished", true);
          sessionStorage.setItem("isAdmin", "true");
          navigate("/admin");
        }}
      />
    </div>
  );
};

export default ACMain;
