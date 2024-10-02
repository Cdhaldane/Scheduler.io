import React, { useEffect, useState } from "react";
import Modal from "../../DevComponents/Modal/Modal";
import { supabase } from "../../Database";
import { useAlert } from "../../DevComponents/Providers/Alert";
import { addPersonnel, deletePersonnel } from "../../Database";

import Input from "../../DevComponents/Input/Input";
import ContextMenu from "../ContextMenu/ContextMenu";
import ThemeSwitch from "../../DevComponents/ThemeSwitch/ThemeSwitch";
import Clock from "../AnimatedDiv/Clock/Clock";
import { useLocation, useNavigate } from "react-router-dom";

import "./Sidebar.css";
import { handleTwoWayCollapse } from "../../Utils";

/**
 * Sidebar Component
 *
 * Purpose:
 * - The Sidebar component provides a navigation menu for the application.
 * - It displays a list of personnel and allows the user to select a person for further actions.
 * - The component supports admin mode, where additional options like adding or deleting personnel are available.
 * - It also includes a context menu for performing actions on the selected personnel.
 * - The component is responsive and adapts to mobile view.
 *
 * Inputs:
 * - selectedPersonnel: The currently selected personnel.
 * - setSelectedPersonnel: A function to set the selected personnel.
 * - personnel: An array of personnel objects.
 * - adminMode: A boolean indicating whether the user is in admin mode.
 * - organization: An object containing organization details.
 * - services: An array of services offered by the organization.
 *
 * Outputs:
 * - JSX for rendering the sidebar with personnel list, add personnel button (in admin mode), and context menu.
 * - Handlers for selecting personnel, adding personnel, and performing actions through the context menu.
 */

const Sidebar = ({
  selectedPersonnel,
  setSelectedPersonnel,
  personnel,
  adminMode,
  organization,
  services,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isCompact, setIsCompact] = useState(window.innerWidth <= 1129);
  const [personnelData, setPersonnelData] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(isMobile ? false : true);
  const navigate = useNavigate();
  const [contextMenu, setContextMenu] = useState({
    x: 0,
    y: 0,
    visible: false,
  });
  const location = useLocation() || "";

  useEffect(() => {
    setPersonnelData(personnel);
  }, [personnel]);

  useEffect(() => {
    window.addEventListener("resize", () => {
      if (window.innerWidth <= 1177) {
        setIsCompact(true);
        setMobileOpen(false);
      } else {
        setMobileOpen(true);
        setIsCompact(false);
      }
      if (window.innerWidth <= 768) {
        setIsMobile(true);
        setMobileOpen(false);
        document.querySelector(".main-body")?.classList.remove("full-width");
      } else {
        setIsMobile(false);
        if (window.innerWidth <= 1168)
          document.querySelector(".main-body")?.classList.add("full-width");
        else
          document.querySelector(".main-body")?.classList.remove("full-width");
      }
    });
  }, []);

  const handleSelect = (e, person) => {
    e.preventDefault();
    // navigate(`/admin/${organization.org_id}/employee/${person.id}`);
    setSelectedPersonnel(person);
  };

  const handleAddPerson = (e) => {
    setIsOpen(false);
    setPersonnelData([...personnelData, e]);
  };

  const handleCloseContextMenu = () => {};

  const handlePersonnelDelete = async (person) => {
    const { data, error } = await deletePersonnel(personnelData[person.id].id);

    if (error) console.log("Error deleting personnel: ", error);
    else {
      setPersonnelData(
        personnelData.filter((person, index) => index !== person.id)
      );
      setSelectedPersonnel(null);
    }
  };

  const contextMenuOptions = [
    {
      label: "Delete",
      onClick: (e) => handlePersonnelDelete(selectedPersonnel),
    },
    { label: "Edit", onClick: () => console.log("Option 2 clicked") },
    // Add more options as needed
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (contextMenu.visible) {
        setContextMenu({ ...contextMenu, visible: false });
      }
    };
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("contextmenu", handleCloseContextMenu);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("contextmenu", handleCloseContextMenu);
    };
  }, [contextMenu.visible]);

  const handleMobileOpen = () => {
    handleTwoWayCollapse(mobileOpen, setMobileOpen, "sidebar", "left");

    const isCompact = window.innerWidth <= 1168;

    if (mobileOpen && !isMobile) {
      const main = document.querySelector(".main-body");
      main?.classList.add("full-width");
    }
    if (!mobileOpen && !isMobile && !isCompact) {
      const main = document.querySelector(".main-body");
      main?.classList.remove("full-width");
    }
  };

  const getPersons = () => {
    return personnelData
      .map((person, index) => (
        <div
          key={index}
          className={`sidebar-item ${
            person?.id === selectedPersonnel?.id ? "selected" : ""
          }`}
          onClick={(e) => {
            handleSelect(e, person);
            setOpenIndex(index === openIndex ? null : index);
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            setContextMenu({
              x: e.clientX,
              y: e.clientY,
              visible: true,
            });
            setSelectedPersonnel(person);
          }}
        >
          <div className="sidebar-item-header">
            <h1>
              <i className="fa-solid fa-user"></i>
              {person.first_name} {person.last_name}
            </h1>
            {adminMode && (
              <i
                className="fa-solid fa-ellipsis-vertical"
                onClick={(e) => {
                  e.preventDefault();
                  setContextMenu({
                    x: e.clientX,
                    y: e.clientY,
                    visible: true,
                  });
                  setSelectedPersonnel(person);
                }}
              ></i>
            )}
          </div>
          {openIndex === index && adminMode && (
            <>
              <ul
                className={`sidebar-item-body ${
                  selectedPersonnel?.id === person?.id ? "" : "none"
                }`}
              >
                {services?.map((service, i) => {
                  return <li key={i}>{service.name}</li>;
                })}
              </ul>
              <button
                className="sidebar-item-button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(
                    `/admin/${organization.org_id}/employee/${person.id}`
                  );
                }}
              >
                Bookings
              </button>
            </>
          )}
        </div>
      ))
      .concat(
        adminMode && (
          <div
            key="addPerson"
            className="sidebar-item add"
            onClick={() => setIsOpen(!isOpen)}
          >
            <h1>
              {" "}
              <i className="fa-solid fa-plus"></i>Add Personnel{" "}
              {isOpen ? "!" : ""}
            </h1>
          </div>
        )
      );
  };

  return (
    <>
      {mobileOpen ? (
        <div className={`sidebar ${isMobile && "mobile"}`}>
          {isCompact && (
            <i
              onClick={handleMobileOpen}
              className={`fa-solid  ${
                mobileOpen ? "fa-caret-left" : "fa-caret-right"
              }  sidebar-mobile-toggle ${isMobile && "mobile"}`}
            ></i>
          )}
          <div className="sidebar-title-header">
            <img
              src="/logo.png"
              alt="website logo"
              onClick={() => navigate("/")}
            />
            <h1>
              TIME<span>SLOT</span>
            </h1>
          </div>
          {location.pathname.includes("/employee") ? (
            <>
              <div className="sidebar-content employee">
                <h1>
                  {selectedPersonnel?.first_name} {selectedPersonnel?.last_name}
                </h1>
                <div className="sidebar-employee-item">
                  <span className="title">{selectedPersonnel?.job_title}</span>
                  <hr />
                  <span>{selectedPersonnel?.email}</span>
                  <span>{selectedPersonnel?.start_date}</span>
                </div>
              </div>
              {!isMobile ? (
                <div className="sidebar-employee-clock">
                  <Clock offset={5} color={"bg-primary"} />
                </div>
              ) : (
                <br />
              )}
            </>
          ) : (
            <div className="sidebar-content">
              <h1>PERSONS</h1>
              {getPersons()}{" "}
            </div>
          )}
          <ThemeSwitch className="sidebar-theme-switch" />

          {isOpen && (
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
              <AddPersonForm
                onAdd={handleAddPerson}
                onClose={(e) => handleAddPerson(e)}
                organization={organization}
              />
            </Modal>
          )}

          <ContextMenu
            visible={contextMenu.visible}
            x={contextMenu.x}
            y={contextMenu.y}
            options={contextMenuOptions}
            onRequestClose={handleCloseContextMenu}
          />
        </div>
      ) : (
        <i
          onClick={handleMobileOpen}
          className={`fa-solid fa-bars sidebar-mobile-toggle`}
        ></i>
      )}
    </>
  );
};

/**
 * AddPersonForm Component
 *
 * Purpose:
 * - The AddPersonForm component provides a form for adding a new person to the personnel list.
 * - It captures the first name, last name, and email of the new person.
 * - The component uses the `addPersonnel` function from the Database to add the new person to the database.
 * - It provides feedback to the user on the success or failure of the addition operation.
 *
 * Inputs:
 * - onClose: A callback function that is called when the form is successfully submitted or cancelled.
 * - organization: An object containing organization details.
 *
 * Outputs:
 * - JSX for rendering the form with input fields for first name, last name, and email, and a submit button to add the new person.
 * - Alerts to inform the user of the status of the person addition operation.
 */

const AddPersonForm = ({ onClose, organization }) => {
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const alert = useAlert();
  console.log("AddPersonForm", organization);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const newPersonnel = {
      first_name: first_name,
      last_name: last_name,
      email: email,
      start_date: new Date(),
      organization_id: organization.id,
    };

    const { data, error } = await addPersonnel(newPersonnel);

    if (error) alert.showAlert("error", error.details);
    else onClose(newPersonnel); // Close modal after successful addition

    setIsLoading(false);
  };

  return (
    <form className="sidebar-add-form" onSubmit={handleSubmit}>
      <h2 className="modal-title">Add Personnel</h2>
      <Input
        label="First Name"
        value={first_name}
        onInputChange={(newValue) => setFirst_name(newValue)}
      />
      <Input
        label="Last Name"
        value={last_name}
        onInputChange={(newValue) => setLast_name(newValue)}
      />
      <Input
        label="Email"
        value={email}
        onInputChange={(newValue) => setEmail(newValue)}
      />

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Adding..." : "Add"}
      </button>
    </form>
  );
};

export default Sidebar;
