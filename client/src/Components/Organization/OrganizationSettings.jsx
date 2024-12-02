import React, { useState, useEffect } from "react";
import Input, { InputForm } from "../../DevComponents/Input/Input.jsx";
import TimePicker from "../../DevComponents/TimePicker/TimePicker.jsx";
import { getOrganization, updateOrganization } from "../../Database.jsx";
import { useAlert } from "../../DevComponents/Providers/Alert.jsx";

import "./Organization.css";

/**
 * OrganizationSettings Component
 *
 * Purpose:
 * - The OrganizationSettings component allows the user to modify the settings of an organization.
 * - It provides a form to update the opening and closing times of the organization.
 * - The component uses the `updateOrganization` function from the Database to update the organization's settings in the database.
 * - It provides feedback to the user on the success or failure of the update operation.
 *
 * Inputs:
 * - organization: An object containing the details of the organization.
 * - onClose: A callback function that is called when the settings update is completed or cancelled.
 *
 * Outputs:
 * - JSX for rendering the organization settings form with TimePicker components for opening and closing times, and a submit button to save changes.
 * - Alerts to inform the user of the status of the organization settings update.
 */

const OrganizationSettings = ({ organization, onClose }) => {
  const alert = useAlert();
  const [orgDetails, setOrgDetails] = useState({
    openingTime: organization?.org_settings?.openingTime,
    closingTime: organization?.org_settings?.closingTime,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const prevDetails = organization.org_settings;

    const updatedDetails = {
      ...prevDetails,
      ...orgDetails,
    };

    const { data, error } = await updateOrganization(organization.org_id, {
      org_settings: updatedDetails,
    });
    setOrgDetails(updatedDetails);
    if (!error) {
      alert.showAlert("success", "Organization updated successfully");
      onClose();
      window.location.reload();
    } else alert.showAlert("error", "Error updating organization");
  };

  return (
    <div>
      <div className="input-form-title">ORGANIZATION SETTINGS</div>
      <form onSubmit={handleSubmit} className="org-form">
        <span className="org-form-span">
          <div className="org-form-sub">
            <span>Opening</span>
            <TimePicker
              label="Operating Hours"
              onChange={(time) => {
                setOrgDetails((prevDetails) => ({
                  ...prevDetails,
                  openingTime: time,
                }));
              }}
              defaultValue={orgDetails.openingTime}
            />
          </div>

          <div className="org-form-sub">
            <span>Closing</span>

            <TimePicker
              label="Operating Hours"
              onChange={(time) =>
                setOrgDetails((prevDetails) => ({
                  ...prevDetails,
                  closingTime: time,
                }))
              }
              defaultValue={orgDetails.closingTime}
            />
          </div>
        </span>

        {/* <Input type="text" label="Operating Hours" /> */}

        <button type="submit" className="org-form-button">
          Save
        </button>
      </form>
    </div>
  );
};

export default OrganizationSettings;
