import React, { useState, useEffect } from "react";
import { useDrop, useDrag } from "react-dnd";
import PuzzleContainer from "../Puzzle/PuzzleContainer";
import ContextMenu from "./CalendarContextMenu/ContextMenu";

/**
 * ResizeIndicator Component
 * 
 * Purpose:
 * - Displays a resize handle in a specified direction (top or bottom) for resizing scheduled slots.
 * 
 * Inputs:
 * - direction: The direction of the resize handle ('top' or 'bottom').
 * - onResize: Callback function to handle the resize action.
 * - name: The name of the service associated with the slot being resized.
 * 
 * Outputs:
 * - JSX for rendering the resize handle.
 */
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

/**
 * Cell Component
 * 
 * Purpose:
 * - Represents a single time slot cell in the calendar.
 * - Handles interactions such as clicks, right-clicks, and drag-and-drop actions.
 * 
 * Inputs:
 * - Various props for handling events and displaying data, including:
 *   - day, hour: The day and hour of the cell.
 *   - timeRange: The time range of the cell.
 *   - handleSlotClick, handlePieceDrop, handlePieceExpand: Callback functions for handling clicks and drops.
 *   - selectedSlot, setSelectedSlot: State and setter for the currently selected slot.
 *   - isSlotScheduled, isSlotEdge, isLastInGroup: Functions to determine the status of the slot.
 *   - serviceName: The name of the service associated with the slot.
 *   - scheduledSlots: The list of scheduled slots.
 *   - puzzlePieces: The list of puzzle pieces for services.
 * 
 * Outputs:
 * - JSX for rendering the cell, including resize indicators and context menu.
 * 
 * Example Usage:
 * <Cell
            key={day + hour}
            day={day}
            hour={hour}
            handleSlotClick={handleSlotClick}
            handleScheduledSlotDelete={handleScheduledSlotDelete}
            handlePieceDrop={handlePieceDrop}
            selectedSlot={selectedSlot}
            setSelectedSlot={setSelectedSlot}
            isSlotScheduled={isSlotScheduled}
            isSlotEdge={isSlotEdge}
            handlePieceExpand={handlePieceExpand}
            serviceName={
              scheduledSlots.find(
                (slot) =>
                  slot.day === day && hour >= slot.start && hour < slot.end
              )?.item?.name
            }
            scheduledSlots={scheduledSlots}
            isLastInGroup={isLastInGroup}
            puzzlePieces={puzzlePieces}
          />
 */
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

  //userDrop hook for handling drag-and-drop actions
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

  // State for manageing the visibility and position of the context menu
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


  //Effects hook to add and remove evernt listeners for the context menu
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

  //Function to check if the slot is selected
  const handleSelectedSlot = () => {
    return selectedSlot?.hour === hour;
  };

  //Function to check if the slot is part of a group selection
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

  //Variables tp determine the state of the cell
  const isSelected = selectedSlot?.day === day && handleSelectedSlot();
  const groupSelect = handleGroupSelect();
  const lastInGroup = isLastInGroup(day, hour);


  //Function to handle resize actions on thje cell
  const handleResize = (direction, dropResult) => {
    // Implement the logic to adjust the cell's size or duration based on the resize direction
    console.log(`Resizing ${direction} at ${day} ${hour}`);
  };

  //Function to handle cell click
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

  //Variables to determine the color of the cell based on the service
  const color = puzzlePieces?.find(
    (piece) => piece?.name === serviceName
  )?.color;

  return (
    //Main cell component with drag and drop and context menu functionality
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
          {true && (
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
