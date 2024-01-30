import React, { useState, useEffect } from "react";
import { useDrop, useDrag } from "react-dnd";

const ResizeIndicator = ({ direction, onResize, name }) => {
  const [, drag] = useDrag({
    type: "resize",
    item: () => ({ direction, type: "resize", name }),
    end: (item, monitor) => {
      if (item && monitor.didDrop()) {
        onResize(direction, monitor.getDropResult());
      }
    },
  });

  return <div ref={drag} className={`expand-indicator ${direction}`}></div>;
};

const Cell = ({
  day,
  hour,
  handleSlotClick,
  handlePieceDrop,
  handlePieceExpand,
  selectedSlot,
  isSlotScheduled,
  isSlotEdge,
  serviceName,
}) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ["service", "resize"],
    drop: (item, monitor) => {
      if (item.type === "resize") {
        console.log(item);
        handlePieceExpand(day, hour, item);
      } else if (canDrop) {
        handlePieceDrop(day, hour, item);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const isSelected = selectedSlot?.day === day && selectedSlot?.hour === hour;

  const handleResize = (direction, dropResult) => {
    // Implement the logic to adjust the cell's size or duration based on the resize direction
    console.log(`Resizing ${direction} at ${day} ${hour}`);
  };

  return (
    <div
      ref={drop}
      className={`cell ${isSelected ? "selected" : ""} ${
        isSlotScheduled(day, hour) ? "scheduled" : ""
      } ${isOver && canDrop ? "over" : ""}`}
      onClick={() => handleSlotClick(day, hour)}
    >
      {isSelected && isSlotScheduled(day, hour) ? (
        <>
          <ResizeIndicator
            direction="top"
            onResize={handleResize}
            name={serviceName}
          />
          {/* Cell content */}
          {hour}:00 {serviceName}
          <ResizeIndicator
            direction="bottom"
            onResize={handleResize}
            name={serviceName}
          />
        </>
      ) : (
        <>
          {isSlotEdge(day, hour) && (
            <div className="scheduled-slot">
              {hour}:00 {serviceName}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Cell;
