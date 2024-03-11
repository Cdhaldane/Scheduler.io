import React, { useState, useEffect, useRef } from "react";
import { useDrop } from "react-dnd";
import Cell from "./Cell";
import GarbageBin from "./GarbageBin";
import "./Calendar.css";

const SERVICE = "service";
const Calendar = ({
  puzzlePieces,
  personID,
  handleSelectedSlot,
  handlePersonnelServiceUpdate,
  personnelServices,
  selectedSlot,
  setSelectedSlot,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [scheduledSlots, setScheduledSlots] = useState([]);
  const [flipAnimation, setFlipAnimation] = useState("");

  useEffect(() => {
    if (personnelServices) setScheduledSlots(personnelServices);
  }, [personnelServices]);

  const getStartOfWeek = (date) => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay());
    start.setHours(0, 0, 0, 0);
    return start;
  };

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(currentDate);
    day.setDate(day.getDate() + i);
    return day;
  });

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const getDaysOfWeek = (currentDate) => {
    const startOfWeek = getStartOfWeek(currentDate);
    return Array.from({ length: 7 }, (_, index) => {
      const day = new Date(startOfWeek);
      day.setDate(day.getDate() + index);
      return day.toISOString().split("T")[0]; // Convert Date objects to string format to avoid React error
    });
  };

  const hoursInDay = Array.from({ length: 24 }, (_, i) => i);

  const daysOfWeek = getDaysOfWeek(new Date()); // Pass the current date or any specific date

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

  const isSlotScheduled = (day, hour) => {
    return scheduledSlots.some((slot) => {
      return slot.day === day && hour >= slot.start && hour < slot.end;
    });
  };

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

  const handleSlotClick = (day, hour, slots) => {
    let slot = {};
    if (!day || !hour) {
      handleSelectedSlot(null);
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

    handleSelectedSlot(slot);
  };

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

  const handlePieceDrop = (date, hour, item) => {
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

  const isLastInGroup = (day, hour) => {
    const grouping = findConnectedGrouping(scheduledSlots, day, hour);
    if (grouping?.end - 1 === grouping?.start) {
      return false;
    }
    if (!grouping) return true;
    return grouping && hour === grouping.end - 1;
  };

  const handleScheduledSlotDelete = (day, hour) => {
    console.log("delete");
    let connectedGrouping = findConnectedGrouping(scheduledSlots, day, hour);
    deleteHelper(day, hour, connectedGrouping);
    setSelectedSlot(null);
  };

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

  useEffect(() => {
    handlePersonnelServiceUpdate(scheduledSlots);
  }, [scheduledSlots]);

  const renderHeader = () => {
    const startOfWeek = getStartOfWeek(currentDate);
    const weekDays = Array.from({ length: 7 }, (_, index) => {
      const day = new Date(startOfWeek);
      day.setDate(day.getDate() + index);
      return day;
    });

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

  // Render the body of the calendar with times and cells

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
              scheduledSlots?.find(
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

  return (
    <div className="calendar">
      <div className="header">{renderHeader()}</div>
      <div className={`body ${flipAnimation}`}>{renderWeek("current")}</div>
      {/* <div className="body next-page">{renderWeek("next")}</div> */}
    </div>
  );
};

export default Calendar;
