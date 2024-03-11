import React, { useState } from "react";
import { useDrop } from "react-dnd";
import "./GarbageBin.css";

const ItemType = {
  APPOINTMENT: "appointment",
};

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

  return (
    <div
      ref={dropRef}
      id="garbage-bin"
      className={`${isOver ? "is-over" : "no"}`}
    >
      <i class="fa-regular fa-trash-can"></i>
    </div>
  );
};
export default GarbageBin;
