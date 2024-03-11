import React, { useState, useEffect } from "react";
import { useDrop, useDrag } from "react-dnd";
import PuzzleContainer from "../Puzzle/PuzzleContainer";
import ContextMenu from "./CalendarContextMenu/ContextMenu";

const ResizeIndicator = ({ direction, onResize, name, color }) => {
  const [, drag] = useDrag({
    type: "resize",
    item: () => ({ direction, type: "resize", name }),
    end: (item, monitor) => {
      if (item && monitor.didDrop()) {
        onResize(direction, monitor.getDropResult());
      }
    },
  });

  return (
    <div
      ref={drag}
      className={`expand-indicator ${direction}`}
      style={{ borderColor: color }}
    ></div>
  );
};

const Cell = ({
  day,
  hour,
  timeRange,
  handleSlotClick,
  handlePieceDrop,
  handlePieceExpand,
  selectedSlot,
  setSelectedSlot,
  isSlotScheduled,
  isSlotEdge,
  serviceName,
  scheduledSlots,
  isLastInGroup,
  handleScheduledSlotDelete,
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

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
  });

  // Function to handle right-click
  const handleContextMenu = (e, day, hour) => {
    e.preventDefault(); // Prevent the default context menu from showing
    console.log(e, e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    if (isSlotScheduled(day, hour))
      setContextMenu({
        id: day + hour,
        visible: true,
        x: e.nativeEvent.offsetX,
        y: e.nativeEvent.offsetY,
      });
  };

  // Function to hide the context menu
  const handleCloseContextMenu = () => {
    setContextMenu({ ...contextMenu, visible: false });
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (contextMenu.visible) {
        setContextMenu({ ...contextMenu, visible: false });
      }
    };
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("contextmenu", handleCloseContextMenu);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("contextmenu", handleCloseContextMenu);
    };
  }, [contextMenu.visible]);

  // Context menu options
  const contextMenuOptions = [
    { label: "Delete", onClick: () => handleScheduledSlotDelete(day, hour) },
    { label: "Copy", onClick: () => console.log("Option 2 clicked") },
    // Add more options as needed
  ];

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
    if (selectedSlot?.start && selectedSlot?.end) {
      if (selectedSlot.day === day)
        if (hour >= selectedSlot.start && hour < selectedSlot.end) {
          return;
        }
    }
    if (selectedSlot?.hour === hour && selectedSlot?.day === day) {
      console.log("deselect");
      return;
    }

    handleSlotClick(day, hour);
  };
  const color = puzzlePieces?.find(
    (piece) => piece?.name === serviceName
  )?.backgroundColor;

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
      onContextMenu={(e) => {
        handleCellClick(day, hour, e);
        handleContextMenu(e, day, hour);
      }}
    >
      {groupSelect && isSlotEdge(day, hour, serviceName) && (
        <div className="group-select">
          <ResizeIndicator
            direction="top"
            onResize={handleResize}
            name={serviceName}
            color={color}
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
              color={color}
            />
          )}
          {/* Cell content */}
          {lastInGroup ? `${hour + 1}:00 ` : `${hour}:00 `}
          {serviceName}
          {true && (
            <ResizeIndicator
              direction="bottom"
              onResize={handleResize}
              name={serviceName}
              color={color}
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
      <ContextMenu
        visible={contextMenu.visible}
        x={contextMenu.x}
        y={contextMenu.y}
        options={contextMenuOptions}
        onRequestClose={handleCloseContextMenu}
      />
    </div>
  );
};

export default Cell;
