import React, { useState, useEffect } from "react";
import { useDrop, useDrag } from "react-dnd";
import ContextMenu from "./CalendarContextMenu/ContextMenu";

const ResizeIndicator = ({ direction, name, item }) => {
  const [, drag] = useDrag({
    type: "resize",
    item: () => ({ direction, type: "resize", item }),
    end: (item, monitor) => {},
  });

  return (
    <div
      ref={drag}
      className={`expand-indicator ${direction}`}
      style={{ borderColor: item?.backgroundColor }}
    ></div>
  );
};

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
  adminMode,
}) => {
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

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
  });

  useEffect(() => {}, [scheduledSlots]);

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
    {
      label: "Delete",
      onClick: (e) => {
        handleScheduledSlotDelete(day, hour, e);
        handleCloseContextMenu();
      },
    },
    { label: "Copy", onClick: () => console.log("Option 2 clicked") },
  ];

  const getSlot = (day, hour, scheduledSlots) => {
    return scheduledSlots.find((slot) => {
      if (slot.day === day && hour >= slot.start && hour < slot.end) {
        return slot;
      }
    });
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
  const color = getSlot(day, hour, scheduledSlots)?.item.backgroundColor;

  const handleCellClick = (newDay, newHour) => {
    handleSlotClick(newDay, newHour, date);
  };

  const handleCellStatus = (day, hour) => {
    return isSlotScheduled(day, hour);
  };

  return (
    <div
      ref={drop}
      key={day + hour}
      className={`cell ${isSelected}-select 
            ${isSlotEdge(day, hour, scheduledSlots)}
            ${handleCellStatus(day, hour)} ${isOver ? "over" : ""}`}
      style={{
        backgroundColor: handleCellStatus(day, hour) ? color : "",
        border: handleCellStatus(day, hour) ? `1px solid ${color}` : "",
        borderColor: handleCellStatus(day, hour) ? color : "",
      }}
      onClick={(e) => handleCellClick(day, hour, e)}
      onContextMenu={(e) => {
        handleCellClick(day, hour, e);
        handleContextMenu(e, day, hour);
      }}
    >
      {!adminMode ? (
        <>
          <div className="group-select">
            {handleCellStatus(day, hour) === "booking" &&
              isSlotEdge(day, hour, scheduledSlots) === "middle" &&
              "BOOKED"}
          </div>
        </>
      ) : (
        <>
          {isSelected && isSlotEdge(day, hour, scheduledSlots) === "start" && (
            <ResizeIndicator
              direction="top"
              item={getSlot(day, hour, scheduledSlots)?.item}
            />
          )}

          {isSlotEdge(day, hour, scheduledSlots) === "start" && (
            <div className="scheduled-slot">
              {handleCellStatus(day, hour) === "scheduled" &&
                getSlot(day, hour, scheduledSlots)?.item.name}
            </div>
          )}

          {isSelected &&
            (isSlotEdge(day, hour, scheduledSlots) === "end" ||
              isSelected === "single") && (
              <ResizeIndicator
                direction="bottom"
                item={getSlot(day, hour, scheduledSlots)?.item}
              />
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
