import React, { useState, useEffect, useRef } from "react";
import { useDrop } from "react-dnd";
import Cell from "./Cell";
import "./Calendar.css";
import { getServiceFromId } from "../../Database";
import Spinner from "../Spinner/Spinner.jsx";

import {
  getDaysOfWeek,
  findConnectedGrouping,
  changeWeek,
  isSlotEdge,
  deleteHelper,
} from "./Utils";

const SERVICE = "service";
const Calendar = ({
  puzzlePieces,
  handleSelectedSlot,
  selectedSlot,
  bookings,
  adminMode,
}) => {
  const [currentWeek, setCurrentWeek] = useState(getDaysOfWeek(new Date()));
  const [scheduledSlots, setScheduledSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const slots = await Promise.all(
        bookings.map(async (booking) => {
          const service = await getServiceFromId(booking.service_id);
          return {
            id: booking.booking_id,
            day: new Date(booking.booking_date).getUTCDate(),
            start: parseInt(booking.booking_time),
            end: parseInt(booking.booking_time) + service.duration,
            item: service,
            type: "booking",
          };
        })
      );
      setScheduledSlots(slots);
    };

    if (adminMode === false) {
      fetchData().then(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [bookings]);

  const isSlotScheduled = (day, hour) => {
    let status = false;
    scheduledSlots.some((slot) => {
      if (slot.day === day && hour >= slot.start && hour < slot.end) {
        if (slot.type === "booking") status = "booking";
        else status = "scheduled";
      }
    });
    return status;
  };

  const handleSlotClick = (day, hour, date) => {
    const isSelected = isSlotScheduled(day, hour);
    console.log("isSelected", isSelected);

    const connectedBookings = findConnectedGrouping(scheduledSlots, day, hour);

    if (connectedBookings)
      handleSelectedSlot(day, hour, date, connectedBookings);
    else handleSelectedSlot(day, hour, date);
  };

  const handlePieceDrop = (day, hour, date, item) => {
    const newSlot = {
      id: date,
      day: date.getUTCDate(),
      start: hour,
      end: hour + 1,
      item: { ...item, type: "scheduled" },
    };

    setScheduledSlots((prev) => [...prev, newSlot]);
    handleSlotClick(day, hour, date);
  };

  const handlePieceExpand = (day, hour, date, item) => {
    let startingTime = Math.min(selectedSlot[0].hour, hour);
    let endingTime = Math.max(selectedSlot[0].hour, hour);
    console.log(selectedSlot);
    let updatedSlots = scheduledSlots.filter((slot) => {
      return (
        slot.day !== day || slot.end <= startingTime || slot.start > endingTime
      );
    });

    let newSlots = [];
    for (let i = startingTime; i <= endingTime; i++) {
      newSlots.push({ day, start: i, end: i + 1, item: item.item });
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
    console.log("newSlots", newSlots);
    setScheduledSlots([...updatedSlots, ...newSlots]);
    handleSlotClick(day, hour, [...updatedSlots, ...newSlots]);
  };

  const handleScheduledSlotDelete = (day, hour, e) => {
    e.stopPropagation();
    let connectedGrouping = findConnectedGrouping(scheduledSlots, day, hour);
    setScheduledSlots(
      deleteHelper(day, hour, connectedGrouping, scheduledSlots)
    );
    handleSelectedSlot();
  };

  return (
    <div className="calendar">
      {loading && <Spinner />}
      <div className="header">
        <button
          className="navigation-button nb-left"
          onClick={() => setCurrentWeek(changeWeek(-1, [...currentWeek]))}
        >
          <i className="fa-solid fa-arrow-left" />
        </button>
        <div className="header-days">
          <div className="empty"></div>
          {currentWeek.map((day, index) => (
            <div key={index} className="header-cell">
              {day?.toLocaleDateString("en-US", {
                weekday: "long",
                month: "numeric",
                day: "numeric",
              })}
            </div>
          ))}
        </div>
        <button
          className="navigation-button nb-right"
          onClick={() => setCurrentWeek(changeWeek(1, [...currentWeek]))}
        >
          <i className="fa-solid fa-arrow-right" />
        </button>
      </div>
      <div className="body">
        {Array.from({ length: 24 }).map((_, hour) => (
          <div key={"row" + hour} className="row">
            <div key={hour} className="cell hours">{`${hour}:00`}</div>
            {currentWeek.map((day) => (
              <Cell
                key={day + hour}
                date={day}
                day={day.getUTCDate()}
                hour={hour}
                handleSlotClick={(newDay, newHour, newDate) =>
                  handleSlotClick(newDay, newHour, newDate)
                }
                isSlotScheduled={(newDay, newHour) =>
                  isSlotScheduled(newDay, newHour)
                }
                handleScheduledSlotDelete={handleScheduledSlotDelete}
                handlePieceDrop={(newDay, newHour, newDate, item) =>
                  handlePieceDrop(newDay, newHour, newDate, item)
                }
                selectedSlot={selectedSlot}
                isSlotEdge={isSlotEdge}
                handlePieceExpand={handlePieceExpand}
                scheduledSlots={scheduledSlots}
                puzzlePieces={puzzlePieces}
                adminMode={adminMode}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
