import React, { useEffect, useState } from "react";
import AC from "./AC";
import { useNavigate } from "react-router-dom";
import { useDeviceType } from "../../Utils";
import { createOrganization, updateUser } from "../../Database";

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

  const handleFinish = async (organizationDetails) => {
    try {
      const { data, error } = await createOrganization(organizationDetails);
      if (data && data.id) {
        handleOrganizationCreate(data);
        navigate(`/admin/${data.org_id}`);
      } else {
        console.error("Organization creation failed or returned no ID.");
      }
    } catch (error) {
      console.error("Error creating organization:", error);
    }
  };
  return (
    <div className="ac-main">
      <AC onFinish={(org) => handleFinish(org)} />
    </div>
  );
};

export default ACMain;
