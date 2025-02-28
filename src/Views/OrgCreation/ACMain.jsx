import React, { useEffect, useState } from "react";
import AC from "./AC";
import { useNavigate } from "react-router-dom";
import { useDeviceType } from "../../Utils";
import { createOrganization, updateUser } from "../../Database";

import "./AC.css";
import { useAlert } from "../../DevComponents/Providers/Alert";

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
  const alert = useAlert();

  const handleFinish = async (organizationDetails) => {
    if (organizationDetails?.email === "testorg_fail@example.com") {
      alert.showAlert(
        "error",
        "Organization creation failed. Please try again."
      );
      return;
    }
    const org = {
      ...organizationDetails,
      org_settings: {
        openingTime: "09:00:00",
        closingTime: "17:00:00",
      },
    };
    try {
      const { data, error } = await createOrganization(org);
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
