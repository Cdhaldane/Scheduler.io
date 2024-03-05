import React, { useState } from "react";
import { useDrop } from "react-dnd";
import "./GarbageBin.css";

const ItemType = {
  APPOINTMENT: "appointment",
};

// This is your GarbageBin component
const GarbageBin = ({ onDrop }) => {
  const [, dropRef] = useDrop({
    accept: ItemType.APPOINTMENT,
    drop: (item, monitor) => {
      onDrop(item.id); // Assuming each appointment has a unique id
    },
  });

  const isEditMode = window.location.pathname.includes("admin") ? true : false;

  if (!isEditMode) return null;
  return (
    <div className="garbage-bin-container">
      <div ref={dropRef} className="garbage-bin">
        Drag appointments here to cancel
      </div>
    </div>
  );
};
export default GarbageBin;
