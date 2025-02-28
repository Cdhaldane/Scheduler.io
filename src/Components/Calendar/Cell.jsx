import React, { useState, useEffect } from "react";
import { useDrop, useDrag } from "react-dnd";
import ContextMenu from "./CalendarContextMenu/ContextMenu";
import { combineColors } from "./Utils";

import "./Cell.css";
import { availability } from "../../Store";

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
const ResizeIndicator = ({
  selectedSlot,
  scheduledSlots,
  direction,
  name,
  timeView,
  item,
}) => {
  let hasNeighbor = [];
  scheduledSlots.forEach((slot) => {
    if (
      slot.day === selectedSlot.day &&
      slot.item.id !== selectedSlot.item.id
    ) {
      if (slot.start === selectedSlot.end) {
        hasNeighbor.push("above");
      }
      if (slot.end === selectedSlot.start) {
        hasNeighbor.push("below");
      }
    }
  });

  const [, drag] = useDrag({
    type: "resize",
    item: () => ({ direction, type: "resize", item }),
    end: (item, monitor) => {},
  });

  if (hasNeighbor.includes("above") && hasNeighbor.includes("below")) {
    return;
  }

  if (hasNeighbor.includes("above") && direction === "bottom") {
    return;
  }

  if (hasNeighbor.includes("below") && direction === "top") {
    return;
  }

  return (
    <div
      ref={drag}
      className={`expand-indicator ${direction}`}
      style={{
        borderColor: item?.backgroundColor,
        left: timeView === "Month" ? "6%" : timeView === "Week" ? "40%" : "47%",
      }}
    ></div>
  );
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
  date,
  day,
  hour,
  handleSlotClick,
  handlePieceDrop,
  handlePieceExpand,
  selectedSlot,
  isSlotScheduled,
  isSlotEdge,
  scheduledSlots,
  handleScheduledSlotDelete,
  handleOperatingHours,
  adminMode,
  organization,
  timeView,
  contextMenu,
  setContextMenu,
  availableSlots,
  type,
  availability,
}) => {
  //userDrop hook for handling drag-and-drop actions
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ["service", "resize"],
    drop: (item, monitor) => {
      if (item.type === "resize") {
        handlePieceExpand(day, hour, date, item);
      } else if (canDrop) {
        handlePieceDrop(day, hour, date, item);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  // State for manageing the visibility and position of the context menu

  // Function to handle right-click
  const handleContextMenu = (e, day, hour) => {
    e.preventDefault(); // Prevent the default context menu from showing
    e.stopPropagation(); // Stop the event from propagating
    if (isSlotScheduled(day, hour))
      setContextMenu({
        id: day + hour,
        visible: true,
        x:
          e.nativeEvent.pageX -
          document.getElementsByClassName("calendar")[0].offsetLeft,
        y: e.nativeEvent.pageY,
        options: [
          {
            label: "Delete",
            onClick: (e) => {
              handleScheduledSlotDelete(day, hour, e);
              setContextMenu({ ...contextMenu, visible: false });
            },
          },
          { label: "Copy", onClick: () => console.log("Option 2 clicked") },
        ],
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

  const getSlot = (day, hour, scheduledSlots) => {
    return scheduledSlots.find((slot) => {
      if (slot.day === day && hour >= slot.start && hour < slot.end) {
        return slot;
      }
    });
  };

  const getSlotItemName = (day, hour, scheduledSlots) => {
    const slot = getSlot(day, hour, scheduledSlots);
    if (slot) {
      if (Array.isArray(slot.item)) {
        return slot.item
          .slice() // Create a copy to avoid mutating the original array
          .sort((a, b) => a.name.localeCompare(b.name)) // Sort alphabetically
          .map((item) => item.name) // Extract names
          .join(" + "); // Combine names with a " + " separator
      } else {
        return slot.item.name;
      }
    }
    return null; // Return null if no slot found
  };

  const handleCheckSelect = (day, hour) => {
    if (!selectedSlot) return;

    if (selectedSlot.length > 1) {
      if (
        selectedSlot.some((slot) => slot?.day === day && slot?.hour === hour)
      ) {
        return "group";
      }
    } else if (selectedSlot.length === 1) {
      if (selectedSlot[0].day === day && selectedSlot[0].hour === hour) {
        return "single";
      }
    }
    if (selectedSlot.day === day && selectedSlot.hour === hour) {
      return "single";
    }
    return false;
  };

  const isSelected = handleCheckSelect(day, hour);

  const getColor = () => {
    const slot = getSlot(day, hour, scheduledSlots);
    if (!slot) return;
    // If `slot.item` is an array, combine all colors
    if (Array.isArray(slot?.item)) {
      const colors = slot.item.map((item) => item.backgroundColor);
      return combineColors(colors); // Handle an array of colors
    }

    // For a single color, return it directly
    return slot?.item.backgroundColor;
  };
  const color = getColor();

  const handleCellClick = (newDay, newHour) => {
    handleSlotClick(newDay, newHour, date);
  };

  const handleCellStatus = (day, hour) => {
    return isSlotScheduled(day, hour);
  };

  const isAvailable = (day, hour, availableSlots) => {
    const slot = availableSlots.find(
      (slot) => slot.day === day && hour >= slot.start && hour < slot.end
    );
    if (!slot || adminMode) return false;

    if (hour === slot.start) return "available top";
    if (hour === slot.end - 1) return "available bottom";
    return "available middle";
  };

  const availabilityClass = isAvailable(day, hour, availableSlots);
  // const availabilityClass = "";
  return (
    <>
      <div
        ref={drop}
        key={day + hour}
        className={`cell noselect ${isSelected}-select ${
          availability ? "admin" : ""
        }
            ${availabilityClass || ""}
            ${isSlotEdge(day, hour, scheduledSlots)}
            ${handleCellStatus(day, hour)} ${isOver ? "over" : ""}
            ${handleOperatingHours(day, hour) ? "open" : "closed"}`}
        style={{
          backgroundColor: handleCellStatus(day, hour) ? color : "",
          border: handleCellStatus(day, hour) ? `1px solid ${color}` : "",
          borderColor: handleCellStatus(day, hour) ? color : "",
        }}
        onClick={(e) => handleCellClick(day, hour, e)}
        onContextMenu={(e) => {
          console.log("context menu");
          handleCellClick(day, hour, e);
          handleContextMenu(e, day, hour);
        }}
      >
        {type == "customer" ? (
          <>
            <div className="group-select">
              {handleCellStatus(day, hour) === "booking" &&
                isSlotEdge(day, hour, scheduledSlots) === "start" &&
                timeView !== "Month" &&
                "BOOKED"}
            </div>
          </>
        ) : (
          <>
            {/* Render top ResizeIndicator */}
            {isSelected &&
              type === "admin" &&
              (isSlotEdge(day, hour, scheduledSlots) === "start" ||
                isSlotEdge(day, hour, scheduledSlots) === "both") && (
                <ResizeIndicator
                  selectedSlot={getSlot(day, hour, scheduledSlots)}
                  scheduledSlots={scheduledSlots}
                  direction="top"
                  timeView={timeView}
                  item={getSlot(day, hour, scheduledSlots)?.item}
                />
              )}

            {/* Render slot content */}
            {(isSlotEdge(day, hour, scheduledSlots) === "start" ||
              isSlotEdge(day, hour, scheduledSlots) === "both") && (
              <div className="scheduled-slot">
                {handleCellStatus(day, hour) === "scheduled" &&
                  timeView !== "Month" &&
                  getSlotItemName(day, hour, scheduledSlots)}
              </div>
            )}

            {/* Render bottom ResizeIndicator */}
            {isSelected &&
              type === "admin" &&
              (isSlotEdge(day, hour, scheduledSlots) === "end" ||
                isSlotEdge(day, hour, scheduledSlots) === "both") && (
                <ResizeIndicator
                  selectedSlot={getSlot(day, hour, scheduledSlots)}
                  scheduledSlots={scheduledSlots}
                  direction="bottom"
                  timeView={timeView}
                  item={getSlot(day, hour, scheduledSlots)?.item}
                />
              )}
          </>
        )}
      </div>
    </>
  );
};

export default Cell;
