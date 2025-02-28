import React, { useState, useEffect } from "react";
import Input, { InputForm } from "../../DevComponents/Input/Input.jsx";
import TimePicker from "../../DevComponents/TimePicker/TimePicker.jsx";
import { getOrganization, updateOrganization } from "../../Database.jsx";
import { useAlert } from "../../DevComponents/Providers/Alert.jsx";
import { useDispatch, useSelector } from "react-redux";
import { HexColorPicker } from "react-colorful";
import RadioGroup from "../../DevComponents/RadioGroup/RadioGroup.jsx";
import { isReadable } from "../../Utils.jsx";

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
  const [selected, setSelected] = useState(["primary"]);
  const [orgDetails, setOrgDetails] = useState({
    openingTime: organization?.org_settings?.openingTime,
    closingTime: organization?.org_settings?.closingTime,
    primaryColor: organization?.org_settings?.primaryColor || "#4CAF50",
    secondaryColor: organization?.org_settings?.secondaryColor || "#FF9800",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const prevDetails = organization.org_settings;

    const updatedDetails = {
      ...prevDetails,
      ...orgDetails,
    };

    const { error } = await updateOrganization(organization.org_id, {
      org_settings: updatedDetails,
    });
    if (!error) {
      document.documentElement.style.setProperty(
        "--primary",
        updatedDetails.primaryColor
      );
      document.documentElement.style.setProperty(
        "--secondary",
        updatedDetails.secondaryColor
      );
      alert.showAlert("success", "Organization updated successfully");
      onClose();
      window.location.reload();
    } else {
      alert.showAlert("error", "Error updating organization");
    }
  };

  const handleColorChange = (color) => {
    const isDarkMode = localStorage.getItem("isDarkMode") === "true";
    const backgroundColor = isDarkMode ? "#2d2d2a" : "#fdfdfd";
    const readable = isReadable(color, backgroundColor);

    if (!readable) {
      alert.showAlert("error", "Color combination not readable");
      return;
    }
    if (selected[0] === "primary") {
      setOrgDetails((prevDetails) => ({
        ...prevDetails,
        primaryColor: color,
      }));
    } else {
      setOrgDetails((prevDetails) => ({
        ...prevDetails,
        secondaryColor: color,
      }));
    }
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

        <div className="org-theme-container">
          <div className="org-form-sub">
            <RadioGroup
              options={[
                { label: "Primary", value: "primary" },
                { label: "Secondary", value: "secondary" },
              ]}
              selectedValues={selected}
              onChange={(selected) => setSelected(selected)}
              multiSelect={false}
            />
            <HexColorPicker
              color={
                selected[0] === "primary"
                  ? orgDetails.primaryColor
                  : orgDetails.secondaryColor
              }
              onChange={handleColorChange}
            />
          </div>
        </div>

        <button type="submit" className="org-form-button">
          Save
        </button>
      </form>
    </div>
  );
};

export default OrganizationSettings;
