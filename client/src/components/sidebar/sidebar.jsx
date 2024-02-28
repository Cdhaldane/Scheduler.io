import React, { useState } from "react";
import data from "../../personnelData.json";

import "./sidebar.css";

const Sidebar = (props) => {
  const [personID, setPersonID] = useState(null);

  const handleSelect = (id) => {
    setPersonID(id);
    props.setPersonID(id);
  };

  const getPersons = () => {
    let out = [];

    let persons = data.personnel;

    for (let i = 0; i < persons.length; i++) {
      const person = persons[i];
      out.push(
        <div
          key={i}
          className={`sidebar-item ${personID === i ? "selected" : "none"}`}
        >
          <div className="sidebar-item-header" onClick={() => handleSelect(i)}>
            {person.name}
          </div>
          {/* <div className={`sidebar-item-body ${personID === i ? 'selected' : 'none'}`}>
                            <div className="sidebar-item-row">
                                <div className="sidebar-item-label">Name</div>
                                <div className="sidebar-item-value">{person.name}</div>
                            </div>
                            <div className="sidebar-item-row">
                                <div className="sidebar-item-label">Email</div>
                                <div className="sidebar-item-value">{person.email}</div>
                            </div>
                        </div> */}
        </div>
      );
    }

    return out;
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">Personnel</div>
      {getPersons()}
      {/* Add more sidebar items here */}
    </div>
  );
};

export default Sidebar;
