import React, { useState, useRef, useEffect } from "react";
import { CSSTransition } from "react-transition-group";
import "./Dropdown.css";

/**
 * Dropdown Component
 * 
 * Purpose:
 * - The Dropdown component provides a customizable dropdown menu with options.
 * - It uses the CSSTransition component for animation effects when opening and closing the dropdown.
 * 
 * Inputs:
 * - label: A label for the dropdown (optional).
 * - options: An array of options to be displayed in the dropdown menu.
 * - onClick: A callback function that is called when an option is clicked.
 * - children: The content to be displayed in the dropdown trigger area.
 * - direction: The direction in which the dropdown menu expands ('up' or 'down').
 * 
 * Outputs:
 * - JSX for rendering the dropdown component with the provided options and animation effects.
 * 
 * Example Usage:
 * <Dropdown
      children={
      <button className="dropdown-toggle">
      {selectedService || "Select Service"}
      </button>
      }
      options={["Haircut", "Shave", "Haircut and Shave"]}
      onClick={(service) => handleServiceChange(service)}
    />
 */

const Dropdown = ({ label, options, onClick, children, direction, type }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);
  const handleClick = (option) => {
    onClick(option);
    setIsOpen(false);
  };

  return (
    <div className="dropdown" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="dropdown-holder">
        {children}
        {type === "button" ? (
          isOpen ? (
            <i className="fa-solid fa-caret-up"></i>
          ) : (
            <i className="fa-solid fa-caret-down"></i>
          )
        ) : null}
      </div>
      <CSSTransition
        in={isOpen}
        timeout={100}
        classNames="dropdown-menu"
        unmountOnExit
      >
        <div className={"dropdown-menu " + direction}>
          {options.map((option, index) => (
            <div
              key={index}
              className="dropdown-item"
              onClick={() => handleClick(option)}
            >
              {option}
            </div>
          ))}
        </div>
      </CSSTransition>
    </div>
  );
};

export default Dropdown;
