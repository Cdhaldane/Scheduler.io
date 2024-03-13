import React, { useEffect, useState } from "react";
import AC from "./AC";
import { useNavigate } from "react-router-dom";
import { useDeviceType } from "../../Utils";

import "./AC.css";

const ACMain = ({ handleOrganizationCreate }) => {
  const isMobile = useDeviceType();
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (sessionStorage.introFinished) {
  //     if (sessionStorage.introFinished === "true") {
  //       sessionStorage.setItem("isAdmin", "true");
  //       navigate("/admin");
  //     }
  //   }
  // }, [sessionStorage]);

  return (
    <div className="ac-main">
      <AC
        onFinish={(org) => {
          handleOrganizationCreate(org);
          sessionStorage.setItem("isAdmin", "true");
          navigate("/admin");
        }}
      />
    </div>
  );
};

export default ACMain;
