import React, { useEffect, useState } from "react";
import data from "../../personnelData.json";
import Modal from "../Modal/Modal";
import { supabase } from "../../Database";
import { useAlert } from "../Providers/Alert";
import { addPersonnel, deletePersonnel } from "../../Database";
import Input from "../Input/Input";
import ContextMenu from "../ContextMenu/ContextMenu";

import "./Sidebar.css";

const Sidebar = ({ personID, setPersonID, personnel }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [personnelData, setPersonnelData] = useState([]);
  const [contextMenu, setContextMenu] = useState({
    x: 0,
    y: 0,
    visible: false,
  });
  const isAdmin = window.location.pathname === "/admin" ? "true" : "false";

  useEffect(() => {
    setPersonnelData(personnel);
  }, [personnel]);

  const handleSelect = (id) => {
    setPersonID(id);
  };

  const handleAddPerson = (e) => {
    setIsOpen(false);
    setPersonnelData([...personnelData, e]);
  };

  const handleCloseContextMenu = () => {};

  const handlePersonnelDelete = async (id) => {
    const { data, error } = await deletePersonnel(personnelData[id].id);

    if (error) console.log("Error deleting personnel: ", error);
    else {
      setPersonnelData(personnelData.filter((person, index) => index !== id));
      setPersonID(0);
    }
  };

  const contextMenuOptions = [
    { label: "Delete", onClick: (e) => handlePersonnelDelete(personID) },
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
          className={`sidebar-item ${personID === index ? "selected" : ""}`}
          onClick={() => handleSelect(index)}
          onContextMenu={(e) => {
            e.preventDefault();
            setContextMenu({
              x: e.clientX,
              y: e.clientY,
              visible: true,
            });
            setPersonID(index);
          }}
        >
          <div className="sidebar-item-header">
            <i className="fa-solid fa-user"></i>
            <h1>
              {person.first_name} {person.last_name}
            </h1>
          </div>
        </div>
      ))
      .concat(
        isAdmin === "true" && (
          <div
            key="addPerson"
            className="sidebar-item add"
            onClick={() => setIsOpen(true)}
          >
            <div className="sidebar-item-header">
              <i className="fa-solid fa-plus"></i>
              <h1>Add Personnel</h1>
            </div>
          </div>
        )
      );
  };

  return (
    <>
      <div className="sidebar">
        <div className="sidebar-header">Personnel</div>
        {getPersons()}
      </div>
      {isOpen && (
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <AddPersonForm
            onAdd={handleAddPerson}
            onClose={(e) => handleAddPerson(e)}
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
  );
};

const AddPersonForm = ({ onClose }) => {
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const alert = useAlert();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const newPersonnel = {
      first_name: first_name,
      last_name: last_name,
      email: email,
      start_date: new Date(),
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
