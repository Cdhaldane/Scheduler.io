import React, { useEffect } from "react";

import "./ContextMenu.css";


/**
 * ContextMenu Component
 *
 * Purpose:
 * This component renders a custom context menu at a given position on the screen. It's shown or hidden
 * based on the `visible` prop and positioned according to `x` and `y` coordinates. The menu animates
 * in and out based on its visibility and provides a list of options that a user can click on.
 *
 * Example Usage:
 * <ContextMenu
        visible={contextMenu.visible}
        x={contextMenu.x}
        y={contextMenu.y}
        options={contextMenuOptions}
        onRequestClose={handleCloseContextMenu}
      />
    </div>
 */


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
