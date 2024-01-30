import React, { useState, useEffect } from "react";
import data from "../../personnelData.json";
import { useDrop } from "react-dnd";
import Cell from "./Cell";

import "./Calendar.css";

const Calendar = (props) => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [scheduledSlots, setScheduledSlots] = useState([]);
  const [serviceName, setServiceName] = useState("");

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

  const isSlotEdge = (day, hour) => {
    const daySlots = scheduledSlots.filter((slot) => slot.day === day);
    daySlots.sort((a, b) => a.start - b.start);

    const slotIndex = daySlots.findIndex((slot) => slot.start === hour);
    if (slotIndex === -1) return false;

    const isFirst = slotIndex === 0 || daySlots[slotIndex - 1].end !== hour;

    const isLast =
      slotIndex === daySlots.length - 1 ||
      daySlots[slotIndex + 1].start !== daySlots[slotIndex].end;

    return isFirst || isLast;
  };

  const handleSlotClick = (day, hour) => {
    setSelectedSlot({ day, hour });
    props.handleSelectedSlot({ day, hour });
  };

  const handlePieceDrop = (day, hour, item) => {
    setScheduledSlots((prev) => [
      ...prev,
      { day, start: hour, end: hour + 1, item },
    ]);
    setSelectedSlot({ day, hour });
  };

  const handlePieceExpand = (day, hour, item) => {
    let startingTime = Math.min(selectedSlot.hour, hour);
    let endingTime = Math.max(selectedSlot.hour, hour);
    console.log(item);
    // Remove any slots that overlap with the new expanded range for the selected day
    const updatedSlots = scheduledSlots.filter((slot) => {
      return (
        slot.day !== day || slot.end <= startingTime || slot.start > endingTime
      );
    });

    // Generate new slots to fill the expanded range
    let newSlots = [];
    for (let i = startingTime; i <= endingTime; i++) {
      newSlots.push({ day, start: i, end: i + 1, item: item });
    }
    console.log(newSlots);

    // Update the scheduled slots with the filtered slots plus the new slots
    setScheduledSlots([...updatedSlots, ...newSlots]);

    // Update the selected slot if necessary
    setSelectedSlot({ day, hour: endingTime });
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
                  handlePieceDrop={handlePieceDrop}
                  selectedSlot={selectedSlot}
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
