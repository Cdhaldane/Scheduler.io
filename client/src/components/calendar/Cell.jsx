import React, { useState, useEffect } from "react";
import { useDrop, useDrag } from "react-dnd";
import PuzzleContainer from "../Puzzle/PuzzleContainer";

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
  timeRange,
  handleSlotClick,
  handlePieceDrop,
  handlePieceExpand,
  selectedSlot,
  isSlotScheduled,
  isSlotEdge,
  serviceName,
  scheduledSlots,
  isLastInGroup,
  puzzlePieces,
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

  const handleSelectedSlot = () => {
    return selectedSlot?.hour === hour;
  };

  const handleGroupSelect = () => {
    if (!selectedSlot) return;
    if (selectedSlot?.start && selectedSlot?.end) {
      return (
        selectedSlot?.day === day &&
        hour >= selectedSlot.start &&
        hour < selectedSlot.end
      );
    }
    return false;
  };
  const isSelected = selectedSlot?.day === day && handleSelectedSlot();
  const groupSelect = handleGroupSelect();
  const lastInGroup = isLastInGroup(day, hour);

  const handleResize = (direction, dropResult) => {
    // Implement the logic to adjust the cell's size or duration based on the resize direction
    console.log(`Resizing ${direction} at ${day} ${hour}`);
  };

  const handleCellClick = (day, hour, e) => {
    handleSlotClick(day, hour);
  };
  const color = puzzlePieces?.find(
    (piece) => piece?.name === serviceName
  )?.color;
  return (
    <div
      ref={drop}
      className={`cell ${isSelected ? "selected" : ""} ${
        isSlotScheduled(day, hour) ? "scheduled" : ""
      } ${isOver && canDrop ? "over" : ""}
      ${groupSelect ? "group-selected" : ""}
      `}
      style={{
        backgroundColor: isSlotScheduled(day, hour) ? color : color,
        border: isSlotScheduled(day, hour) ? `1px solid ${color}` : "",
      }}
      onClick={(e) => handleCellClick(day, hour, e)}
    >
      {groupSelect && isSlotEdge(day, hour, serviceName) && (
        <div className="group-select">
          <ResizeIndicator
            direction="top"
            onResize={handleResize}
            name={serviceName}
          />
        </div>
      )}
      {isSelected && isSlotScheduled(day, hour) ? (
        <>
          {!lastInGroup && (
            <ResizeIndicator
              direction="top"
              onResize={handleResize}
              name={serviceName}
            />
          )}
          {/* Cell content */}
          {lastInGroup ? `${hour + 1}:00 ` : `${hour}:00 `}
          {serviceName}
          {lastInGroup && (
            <ResizeIndicator
              direction="bottom"
              onResize={handleResize}
              name={serviceName}
            />
          )}
        </>
      ) : (
        <>
          {isSlotEdge(day, hour, serviceName) && (
            <div className="scheduled-slot">
              {lastInGroup ? `${hour + 1}:00 ` : `${hour}:00 `}
              {serviceName}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Cell;
