import React, { useEffect, useState } from "react";
import Modal from "../../DevComponents/Modal/Modal";
import { supabase } from "../../Database";
import { useAlert } from "../Providers/Alert";
import { addPersonnel, deletePersonnel } from "../../Database";

import Input from "../../DevComponents/Input/Input";
import ContextMenu from "../ContextMenu/ContextMenu";
import ThemeSwitch from "../../DevComponents/ThemeSwitch/ThemeSwitch";
import Clock from "../AnimatedDiv/Clock/Clock";
import { useLocation, useNavigate } from "react-router-dom";

import "./Sidebar.css";
import { handleTwoWayCollapse } from "../../Utils";

const Sidebar = ({
  selectedPersonnel,
  setSelectedPersonnel,
  personnel,
  adminMode,
  organization,
  services,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = window.innerWidth < 768;
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
      {isMobile && (
        <i
          onClick={() =>
            handleTwoWayCollapse(mobileOpen, setMobileOpen, "sidebar", "left")
          }
          className="fa-solid fa-bars sidebar-mobile-toggle"
        ></i>
      )}
      {mobileOpen && (
        <>
          <div className={`sidebar ${isMobile && "mobile"}`}>
            <div className="sidebar-title-header">
              {isMobile && (
                <i
                  onClick={() =>
                    handleTwoWayCollapse(
                      mobileOpen,
                      setMobileOpen,
                      "sidebar",
                      "left"
                    )
                  }
                  className="fa-solid fa-bars sidebar-mobile-toggle"
                ></i>
              )}

              <img
                src="/logo.png"
                alt="website logo"
                className="navbar-logo"
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
                    {selectedPersonnel?.first_name}{" "}
                    {selectedPersonnel?.last_name}
                  </h1>
                  <div className="sidebar-employee-item">
                    <span className="title">
                      {selectedPersonnel?.job_title}
                    </span>
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
            <ThemeSwitch className="theme-switch" />
          </div>

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
        </>
      )}
    </>
  );
};

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
