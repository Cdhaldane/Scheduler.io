import React, { useState, useEffect } from "react";
import data from "../../personnelData.json";
import { useDrop } from "react-dnd";
import Cell from "./Cell";
import { useNavigate } from "react-router-dom";
import "./calendar.css";
import { Route } from "react-router-dom";

const Calendar = (props) => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [scheduledSlots, setScheduledSlots] = useState([]);
  const [timeRange, setTimeRange] = useState([]);
  const navigate = useNavigate();

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const hoursInDay = Array.from({ length: 24 }, (_, i) => i);

  useEffect(() => {
    // let personID = props.personID;
    // if (personID === null) return;
    // let person = data.personnel[personID];
    // let bookings = person.bookings;
    // let slots = [];
    // for (let i = 0; i < bookings.length; i++) {
    //   const booking = bookings[i];
    //   let start = parseInt(booking.startTime);
    //   let end = parseInt(booking.endTime);
    //   let day = booking.day;
    //   slots.push({ day, start: start, end: end });
    // }
    // setScheduledSlots(slots);
  }, [props]);

  useEffect(() => {
    //event listener for click outside set selected slot to null
    const handleClickOutside = (e) => {
      if (!e.target.className.includes("cell")) {
        setSelectedSlot(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [selectedSlot]);

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
      setSelectedSlot({
        day,
        hour: connectedGrouping?.end - 1,
        item: clickedSlot.item,
        start: connectedGrouping?.start,
        end: connectedGrouping?.end - 1,
      });
    } else {
      setSelectedSlot({ day, hour });
    }
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

  const handlePieceDrop = (day, hour, item) => {
    if (isSlotScheduled(day, hour)) return;
    setScheduledSlots((prev) => [
      ...prev,
      { day, start: hour, end: hour + 1, item },
    ]);
    setSelectedSlot({ day, hour });
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

  const renderCalendar = () => {
    return (
      <div className="calendar">
        <div className="header">
          <div key={0} className="cell empty"></div>
          {daysOfWeek.map((day) => (
            <div key={day} className="header-cell">
              {day}
            </div>
          ))}
        </div>
        <div className="body">
          {hoursInDay.map((hour) => (
            <div key={hour} className="row">
              <div className={`cell hours`}>{hour}:00</div>
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
                        slot.day === day &&
                        hour >= slot.start &&
                        hour < slot.end
                    )?.item?.name
                  }
                  scheduledSlots={scheduledSlots}
                  isLastInGroup={isLastInGroup}
                  puzzlePieces={props.puzzlePieces}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return <div className="main-calendar">{renderCalendar()}</div>;
};

export default Calendar;
