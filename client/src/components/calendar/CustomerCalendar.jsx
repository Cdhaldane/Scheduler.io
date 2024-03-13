import React, { useState, useEffect, useRef } from "react";
import { useDrop } from "react-dnd";
import Cell from "./Cell";
import "./Calendar.css";
import { getServiceFromId } from "../../Database";

import { getDaysOfWeek, findConnectedGrouping, changeWeek } from "./Utils";

const SERVICE = "service";
const CustomerCalendar = ({
  puzzlePieces,
  personID,
  handleSelectedSlot,
  handlePersonnelServiceUpdate,
  personnelServices,
  selectedSlot,
  bookings,
}) => {
  const [currentWeek, setCurrentWeek] = useState(getDaysOfWeek(new Date()));
  const [scheduledSlots, setScheduledSlots] = useState([]);
  const [flipAnimation, setFlipAnimation] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const slots = await Promise.all(
        bookings.map(async (booking) => {
          const service = await getServiceFromId(booking.service_id);
          return {
            id: booking.booking_id,
            day: booking.booking_date,
            start: parseInt(booking.booking_time),
            end: parseInt(booking.booking_time) + service.duration,
            item: service,
          };
        })
      );
      setScheduledSlots(slots);
    };

    fetchData();
  }, [bookings]);

  const isSlotScheduled = (day, hour) => {
    // return scheduledSlots.some((slot) => {
    //   if (slot.day === day && hour >= slot.start && hour < slot.end) {
    //     return true;
    //   }
    // });
  };

  const isSlotBooked = (day, hour) => {
    return scheduledSlots.some((slot) => {
      let realDay = new Date(slot.day).getDate();
      if (realDay === day && hour >= slot.start && hour < slot.end) {
        return true;
      }
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

  const handleSlotClick = (day, hour, date) => {
    // console.log("handleSlotClick", day, hour, slots);
    // let slot = {};
    // if (!day || !hour) {
    //   handleSelectedSlot(null);
    //   return;
    // }
    // let allSlots = scheduledSlots;
    // if (slots) allSlots = slots;
    // const clickedSlot = allSlots.find(
    //   (slot) => slot.day === day && hour >= slot.start && hour < slot.end
    // );
    // if (clickedSlot) {
    //   const slotsGroupedByDay = groupSlotsByDay(allSlots);
    //   const connectedGrouping = findConnectedGrouping(
    //     slotsGroupedByDay[day],
    //     day,
    //     hour
    //   );
    //   slot = {
    //     day,
    //     hour: connectedGrouping?.end - 1,
    //     item: clickedSlot.item,
    //     start: connectedGrouping?.start,
    //     end: connectedGrouping?.end - 1,
    //   };
    // } else {
    //   slot = {
    //     day,
    //     hour,
    //   };
    // }

    handleSelectedSlot(day, hour, date);
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
    // handleSelectedSlot({ day: dayNames[day.getDay()], hour });
  };

  const handlePieceExpand = (day, hour, item) => {
    // let startingTime = Math.min(selectedSlot.hour, hour);
    // let endingTime = Math.max(selectedSlot.hour, hour);
    // let updatedSlots = scheduledSlots.filter((slot) => {
    //   return (
    //     slot.day !== day || slot.end <= startingTime || slot.start > endingTime
    //   );
    // });
    // let newSlots = [];
    // for (let i = startingTime; i <= endingTime; i++) {
    //   newSlots.push({ day, start: i, end: i + 1, item: item });
    // }
    // let connectedGrouping = findConnectedGrouping(
    //   [...updatedSlots, ...newSlots],
    //   day,
    //   hour
    // );
    // if ((item.direction === "bottom") & (hour < selectedSlot.hour)) {
    //   newSlots = [{ day, start: hour, end: hour + 1, item }];
    // }
    // if ((item.direction === "top") & (hour > connectedGrouping?.start)) {
    //   updatedSlots = updatedSlots.filter((slot) => slot.day !== day);
    // }
    // setScheduledSlots([...updatedSlots, ...newSlots]);
    // handleSlotClick(day, hour, [...updatedSlots, ...newSlots]);
  };

  const isLastInGroup = (day, hour) => {
    // const grouping = findConnectedGrouping(scheduledSlots, day, hour);
    // if (grouping?.end - 1 === grouping?.start) {
    //   return false;
    // }
    // if (!grouping) return true;
    // return grouping && hour === grouping.end - 1;
  };

  const handleScheduledSlotDelete = (day, hour) => {
    // console.log("delete");
    // let connectedGrouping = findConnectedGrouping(scheduledSlots, day, hour);
    // deleteHelper(day, hour, connectedGrouping);
  };

  const deleteHelper = (day, hour, connectedGrouping) => {
    // let updatedSlots = scheduledSlots.filter((slot) => {
    //   return (
    //     slot.day !== day ||
    //     slot.end <= connectedGrouping.start ||
    //     slot.start > connectedGrouping.end
    //   );
    // });
    // setScheduledSlots(updatedSlots);
  };

  useEffect(() => {
    // handlePersonnelServiceUpdate(scheduledSlots);
  }, [bookings]);

  return (
    <div className="calendar">
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
          <div key={hour} className="row">
            <div className="cell hours">{`${hour}:00`}</div>
            {currentWeek.map((day) => (
              <>
                <Cell
                  key={day}
                  date={day}
                  day={day.getDate()}
                  hour={hour}
                  handleSlotClick={(newDay, newHour, newDate) =>
                    handleSlotClick(newDay, newHour, newDate)
                  }
                  isSlotScheduled={isSlotScheduled}
                  isSlotBooked={isSlotBooked}
                  handleScheduledSlotDelete={handleScheduledSlotDelete}
                  handlePieceDrop={handlePieceDrop}
                  selectedSlot={selectedSlot}
                  isSlotEdge={isSlotEdge}
                  handlePieceExpand={handlePieceExpand}
                  serviceName={
                    scheduledSlots?.find(
                      (slot) =>
                        slot.day === day &&
                        hour >= slot.start &&
                        hour < slot.end
                    )?.item?.name
                  }
                  scheduledSlots={scheduledSlots}
                  isLastInGroup={isLastInGroup}
                  puzzlePieces={puzzlePieces}
                />
              </>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerCalendar;
