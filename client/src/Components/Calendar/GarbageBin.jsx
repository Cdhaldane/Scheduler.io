import React, { useState } from "react";
import { useDrop } from "react-dnd";
import "./GarbageBin.css";

const ItemType = {
  APPOINTMENT: "appointment",
};

/**
 * GarbageBin Component
 * 
 * Purpose:
 * - The GarbageBin component represents a drop target for draggable items, typically used for deleting items.
 * - It uses the useDrop hook from react-dnd to handle the drop events.
 * 
 * Inputs:
 * - onDrop: A callback function that is invoked when an item is dropped into the garbage bin.
 * 
 * Outputs:
 * - JSX for rendering the garbage bin icon, with visual feedback when an item is being dragged over it.
 */


// This is your GarbageBin component
const GarbageBin = ({ onDrop }) => {
  const [{ isOver, canDrop }, dropRef] = useDrop({
    accept: ["service"],
    drop: (item, monitor) => {
      onDrop(item);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  // const isEditMode = window.location.pathname.includes("admin") ? true : false;
  // Render the garbage bin icon with drop ref and class name based on the isOver state
  return (
    <div
      ref={dropRef}
      id="garbage-bin"
      className={`${isOver ? "is-over" : ""}`}
    >
      <i class="fa-regular fa-trash-can"></i>
    </div>
  );
};
export default GarbageBin;
