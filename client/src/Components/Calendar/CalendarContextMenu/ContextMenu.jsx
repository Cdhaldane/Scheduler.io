import React, { useEffect } from "react";

import "./ContextMenu.css";

const ContextMenu = ({ visible, x, y, options, onRequestClose }) => {
  return (
    <div
      className="custom-context-menu"
      style={{
        position: "absolute",
        left: x,
        top: y,
        zIndex: 1000,
        animationName: visible ? "contextGrow" : "contextHide",
        display: visible ? "block" : "none",
      }} // Ensure the menu is positioned absolutely and has a high z-index
      onClick={onRequestClose} // Close the menu when an option is clicked
    >
      {options.map((option, index) => (
        <div
          key={index}
          className="context-menu-option"
          onClick={option.onClick}
        >
          {option.label}
        </div>
      ))}
    </div>
  );
};

export default ContextMenu;
