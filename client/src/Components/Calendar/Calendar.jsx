import React, { useState, useEffect, useRef } from "react";
import { useDrop } from "react-dnd";
import Cell from "./Cell";
import GarbageBin from "./GarbageBin";
import "./Calendar.css";

const SERVICE = "service";
// Calendar component displays a weekly calendar view and allows users to schedule and manage time slots.
const Calendar = ({ puzzlePieces, personID, handleSelectedSlot }) => {
  // State hooks to manage current date, selected slot, and scheduled slots
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [scheduledSlots, setScheduledSlots] = useState([]);
  const [flipAnimation, setFlipAnimation] = useState("");

  // Effect hook to update the component when scheduled slots change
  useEffect(() => {}, [scheduledSlots]);

  // getStartOfWeek: Calculates the start of the week for a given date.
  // Input: date (Date object)
  // Output: start (Date object) - The start of the week (Sunday)
  const getStartOfWeek = (date) => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay());
    start.setHours(0, 0, 0, 0);
    return start;
  };

   // weekDays: Array of week days based on the current date.
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(currentDate);
    day.setDate(day.getDate() + i);
    return day;
  });

  // dayNames: Array of day names for headers.
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // getDaysOfWeek: Generates an array of days in ISO string format for the current week.
  // Input: currentDate (Date object)
  // Output: Array of strings representing days of the week in ISO format
  const getDaysOfWeek = (currentDate) => {
    const startOfWeek = getStartOfWeek(currentDate);
    return Array.from({ length: 7 }, (_, index) => {
      const day = new Date(startOfWeek);
      day.setDate(day.getDate() + index);
      return day.toISOString().split("T")[0]; // Convert Date objects to string format to avoid React error
    });
  };

  // hoursInDay: Array of hours in a day for rendering time slots.
  const hoursInDay = Array.from({ length: 24 }, (_, i) => i);

  // daysOfWeek: Array of days of the week for the current view.
  const daysOfWeek = getDaysOfWeek(new Date()); // Pass the current date or any specific date

  // goToPreviousWeek: Updates the current date to the previous week and triggers flip animation.
  // Input: None
  // Output: None
  const goToPreviousWeek = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() - 7);
      return newDate;
    });
    setFlipAnimation("flip-left");
    setTimeout(() => {
      setFlipAnimation("");
    }, 1000);
  };

  // goToNextWeek: Updates the current date to the next week and triggers flip animation.
  // Input: None
  // Output: None
  const goToNextWeek = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + 7);
      return newDate;
    });
    setFlipAnimation("flip-right");
    setTimeout(() => {
      setFlipAnimation("");
    }, 1000);
  };

  // isSlotScheduled: Checks if a time slot is scheduled.
  // Input: day (String), hour (Number)
  // Output: Boolean - True if the slot is scheduled, false otherwise
  const isSlotScheduled = (day, hour) => {
    return scheduledSlots.some((slot) => {
      return slot.day === day && hour >= slot.start && hour < slot.end;
    });
  };

  // isSlotEdge: Determines if a slot is at the edge of a scheduled block.
  // Input: day (String), hour (Number), name (String)
  // Output: Boolean - True if the slot is at the edge, false otherwise
  const isSlotEdge = (day, hour, name) => {
    let daySlots = scheduledSlots.filter((slot) => slot.day === day);
    daySlots = daySlots.filter((slot) => slot.item.name === name);
    daySlots.sort((a, b) => a.start - b.start);
    const slotIndex = daySlots.findIndex((slot) => slot.start === hour);
    if (slotIndex === -1) return false;

    const isFirst = slotIndex === 0 || daySlots[slotIndex - 1].end !== hour;

    const isLast =
      slotIndex === daySlots.length - 1 ||
      daySlots[slotIndex + 1].start !== daySlots[slotIndex].end;

    return isFirst || isLast;
  };

  // handleSlotClick: Handles click events on slots/cells, updating the selected slot and calling the handleSelectedSlot callback.
  // Input: day (String), hour (Number), slots (Array of slots)
  // Output: None
  const handleSlotClick = (day, hour, slots) => {
    let slot = {};
    if (!day || !hour) {
      setSelectedSlot(null);
      return;
    }
    let allSlots = scheduledSlots;
    if (slots) allSlots = slots;
    const clickedSlot = allSlots.find(
      (slot) => slot.day === day && hour >= slot.start && hour < slot.end
    );
    if (clickedSlot) {
      const slotsGroupedByDay = groupSlotsByDay(allSlots);
      const connectedGrouping = findConnectedGrouping(
        slotsGroupedByDay[day],
        day,
        hour
      );
      slot = {
        day,
        hour: connectedGrouping?.end - 1,
        item: clickedSlot.item,
        start: connectedGrouping?.start,
        end: connectedGrouping?.end - 1,
      };
    } else {
      slot = {
        day,
        hour,
      };
    }

    setSelectedSlot(slot);
    handleSelectedSlot(slot);
  };

  // findConnectedGrouping: Finds the continuous grouping of slots that includes the clicked slot.
  // Input: slots (Array of slots), clickedDay (String), clickedHour (Number)
  // Output: Object - The grouping of connected slots with start, end, and itemName properties
  const findConnectedGrouping = (slots, clickedDay, clickedHour) => {
    const clickedSlotIndex = slots.findIndex(
      (slot) =>
        slot.day === clickedDay &&
        clickedHour >= slot.start &&
        clickedHour < slot.end
    );

    if (clickedSlotIndex === -1) return null;

    const clickedSlot = slots[clickedSlotIndex];
    let start = clickedSlot.start;
    let end = clickedSlot.end;
    const itemName = clickedSlot.item.name;

    // Traverse backward to find the earliest connected start time with the same item.name
    for (let i = clickedSlotIndex - 1; i >= 0; i--) {
      if (slots[i].end === start && slots[i].item.name === itemName) {
        start = slots[i].start;
      } else {
        break; // Break if slots are not connected or names don't match
      }
    }

    // Traverse forward to find the latest connected end time with the same item.name
    for (let i = clickedSlotIndex + 1; i < slots.length; i++) {
      if (slots[i].start === end && slots[i].item.name === itemName) {
        end = slots[i].end;
      } else {
        break; // Break if slots are not connected or names don't match
      }
    }
    return { start, end, itemName };
  };

  // handlePieceDrop: Handles dropping a puzzle piece into calendar, adding a new slot to the schedule form.
  // Input: date (String), hour (Number), item (Object)
  // Output: None
  const handlePieceDrop = (date, hour, item) => {
    console.log("handlePieceDrop", date, hour, item);
    const year = date.split("-")[0];
    const month = date.split("-")[1] - 1;
    const tempDay = date.split("-")[2];
    const day = new Date(year, month, tempDay, parseInt(hour));

    const newSlot = {
      id: `${day.toISOString()}_${hour}`,
      day: day.toISOString().split("T")[0],
      start: hour,
      end: hour + 1,
      item: {
        type: item.type,
        id: item.id,
        service: item.service,
        name: item.name,
        duration: item.duration,
        price: item.price,
        color: item.color,
      },
    };
    setScheduledSlots((prev) => [...prev, newSlot]);
    setSelectedSlot({ day: dayNames[day.getDay()], hour });
  };

  // groupSlotsByDay: Groups slots by day and sorts them by start time.
  // Input: scheduledSlots (Array of slots)
  // Output: Object - Slots grouped by day
  const groupSlotsByDay = (scheduledSlots) => {
    return scheduledSlots.reduce((acc, slot) => {
      if (!acc[slot.day]) {
        acc[slot.day] = [];
      }

      acc[slot.day].push(slot);
      acc[slot.day] = acc[slot.day].sort((a, b) => a.start - b.start);
      return acc;
    }, {});
  };

  // handlePieceExpand: Expands a slot to cover multiple hours when a puzzle piece is dragged (resized).
  // Input: day (String), hour (Number), item (Object)
  // Output: None
  const handlePieceExpand = (day, hour, item) => {
    let startingTime = Math.min(selectedSlot.hour, hour);
    let endingTime = Math.max(selectedSlot.hour, hour);

    let updatedSlots = scheduledSlots.filter((slot) => {
      return (
        slot.day !== day || slot.end <= startingTime || slot.start > endingTime
      );
    });

    let newSlots = [];
    for (let i = startingTime; i <= endingTime; i++) {
      newSlots.push({ day, start: i, end: i + 1, item: item });
    }
    let connectedGrouping = findConnectedGrouping(
      [...updatedSlots, ...newSlots],
      day,
      hour
    );

    if ((item.direction === "bottom") & (hour < selectedSlot.hour)) {
      newSlots = [{ day, start: hour, end: hour + 1, item }];
    }
    if ((item.direction === "top") & (hour > connectedGrouping?.start)) {
      updatedSlots = updatedSlots.filter((slot) => slot.day !== day);
    }

    setScheduledSlots([...updatedSlots, ...newSlots]);
    handleSlotClick(day, hour, [...updatedSlots, ...newSlots]);
  };

  // isLastInGroup: Checks if a slot is the last in a connected group.
  // Input: day (String), hour (Number)
  // Output: Boolean - True if the slot is the last in the group, false otherwise
  const isLastInGroup = (day, hour) => {
    const grouping = findConnectedGrouping(scheduledSlots, day, hour);
    if (grouping?.end - 1 === grouping?.start) {
      return false;
    }
    if (!grouping) return true;
    return grouping && hour === grouping.end - 1;
  };

  // handleScheduledSlotDelete: Deletes a scheduled slot and updates the state.
  // Input: day (String), hour (Number)
  // Output: None
  const handleScheduledSlotDelete = (day, hour) => {
    console.log("delete");
    let connectedGrouping = findConnectedGrouping(scheduledSlots, day, hour);
    deleteHelper(day, hour, connectedGrouping);
    setSelectedSlot(null);
  };

  // deleteHelper: Helper function to delete a slot or a group of connected slots.
  // Input: day (String), hour (Number), connectedGrouping (Object)
  // Output: None
  const deleteHelper = (day, hour, connectedGrouping) => {
    let updatedSlots = scheduledSlots.filter((slot) => {
      return (
        slot.day !== day ||
        slot.end <= connectedGrouping.start ||
        slot.start > connectedGrouping.end
      );
    });
    setScheduledSlots(updatedSlots);
  };

  //userDrop hook for handling drag-and-drop of puzzle pieces into the trash bin (this feature has been replaced by the delete option (2024-03-15))
  const [{ isOver, trashBinDrop }, drop] = useDrop({
    accept: SERVICE,
    drop: (item, monitor) => {
      setScheduledSlots((prev) => prev.filter((slot) => slot.id !== item.id));
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      //canDrop: monitor.canDrop(),
    }),
  });


  // renderHeader: Renders the calendar header with navigation buttons and day names.
  // Input: None
  // Output: JSX - The header of the calendar
  const renderHeader = () => {
    const startOfWeek = getStartOfWeek(currentDate);
    const weekDays = Array.from({ length: 7 }, (_, index) => {
      const day = new Date(startOfWeek);
      day.setDate(day.getDate() + index);
      return day;
    });
    // render the header with navigation buttons and day names
    return (
      <>
        <button
          className="navigation-button nb-left"
          onClick={goToPreviousWeek}
        >
          <i className="fa-solid fa-arrow-left" />
        </button>
        <div className="cell empty">
          {startOfWeek.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
          })}
        </div>
        {weekDays.map((day, index) => (
          <div key={index} className="header-cell">
            {day.toLocaleDateString("en-US", { weekday: "long" })}
            {/* {day.toLocaleDateString("en-US", {
              month: "numeric",
              day: "numeric",
            })} */}
          </div>
        ))}
        <button className="navigation-button nb-right" onClick={goToNextWeek}>
          <i className="fa-solid fa-arrow-right" />
        </button>
      </>
    );
  };

  // rednerWeek: Render the body of the calendar with times and cells
  // Input: None
  // Output: JSX - The body of the calendar 
  const renderWeek = () => {
    return hoursInDay.map((hour, index) => (
      <div key={index + hour} className="row">
        <div key={index + hour} className="cell hours">{`${hour}:00`}</div>
        {daysOfWeek.map((day) => (
          <Cell
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
        ))}
      </div>
    ));
  };

  // renderWeek: Render the body of the calendar with times and cells
  return (
    <div className="main-calendar">
      <div className="calendar">
        <div className="header">{renderHeader()}</div>
        <div className={`body ${flipAnimation}`}>{renderWeek("current")}</div>
        <div className="body next-page">{renderWeek("next")}</div>
      </div>
    </div>
  );
};

export default Calendar;
