import React, { useState } from "react";
import data from "../../personnelData.json";
import Modal from "../Modal/Modal";

import "./Sidebar.css";

const AddPersonForm = ({ onAdd, onClose }) => {
  const [personName, setPersonName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(personName);
    onClose(); // Close modal after adding
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="personName">Person Name:</label>
      <input
        id="personName"
        type="text"
        value={personName}
        onChange={(e) => setPersonName(e.target.value)}
        required
      />
      <button type="submit">Add</button>
    </form>
  );
};

const Sidebar = (props) => {
  const [personID, setPersonID] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const isAdmin = sessionStorage.getItem("isAdmin");

  const handleSelect = (id) => {
    setPersonID(id);
    props.setPersonID(id);
  };

  const handleAddPerson = (personName) => {
    const newPerson = { name: personName };
    data.personnel.push(newPerson);
    // Update state or perform additional actions as necessary
  };

  const getPersons = () => {
    return data.personnel
      .map((person, index) => (
        <div
          key={index}
          className={`sidebar-item ${personID === index ? "selected" : ""}`}
          onClick={() => handleSelect(index)}
        >
          <div className="sidebar-item-header">{person.name}</div>
        </div>
      ))
      .concat(
        isAdmin === "true" && (
          <div
            key="addPerson"
            className="sidebar-item add"
            onClick={() => setIsOpen(true)}
          >
            <div className="sidebar-item-header admin">Add Personnel</div>
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
            onClose={() => setIsOpen(false)}
          />
        </Modal>
      )}
    </>
  );
};

export default Sidebar;
