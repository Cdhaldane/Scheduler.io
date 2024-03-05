import React, { useState, useRef, useEffect } from "react";
import { CSSTransition } from "react-transition-group";
import "./Dropdown.css";

const Dropdown = ({ label, options, onClick }) => {
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
      <button className="dropdown-toggle" onClick={() => setIsOpen(!isOpen)}>
        {label}
      </button>
      <CSSTransition
        in={isOpen}
        timeout={100}
        classNames="dropdown-menu"
        unmountOnExit
      >
        <div className="dropdown-menu">
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
