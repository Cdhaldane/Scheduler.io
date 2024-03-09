import React, { useState, useEffect, useRef } from "react";
import { useDrop } from "react-dnd";
import Cell from "./Cell";
import GarbageBin from "./GarbageBin";
import "./Calendar.css";
import Modal from "../Modal/Modal";

const SERVICE = "service";
const Calendar = (props) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [scheduledSlots, setScheduledSlots] = useState([]);
  const [timeRange, setTimeRange] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const realCurrentDate = new Date();

  useEffect(() => {}, [scheduledSlots]);

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
    setSelectedSlot(null);
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

  // const handleSlotClick = (day, hour, slots) => {
  //   if (!day || !hour) {
  //     setSelectedSlot(null);
  //     return;
  //   }
  //   let allSlots = scheduledSlots;
  //   if (slots) allSlots = slots;
  //   const clickedSlot = allSlots.find(
  //     (slot) => slot.day === day && hour >= slot.start && hour < slot.end
  //   );

  //   if (clickedSlot && selectedSlot) {
  //     if (clickedSlot.day === selectedSlot.day &&
  //         clickedSlot.start === selectedSlot.start &&
  //         clickedSlot.end === selectedSlot.end) {
  //       return;
  //     }
  //   }

  //   if (clickedSlot) {
  //     const slotsGroupedByDay = groupSlotsByDay(allSlots);
  //     const connectedGrouping = findConnectedGrouping(
  //       slotsGroupedByDay[day],
  //       day,
  //       hour
  //     );
  //     setSelectedSlot({
  //       day,
  //       hour: connectedGrouping?.end - 1,
  //       item: clickedSlot.item,
  //       start: connectedGrouping?.start,
  //       end: connectedGrouping?.end - 1,
  //     });
  //   } else {
  //     setSelectedSlot({ day, hour });
  //   }
  // };
  const handleSlotClick = (day, hour, slots) => {
    if (!day || !hour) return;
    const allSlots = slots || scheduledSlots;
    const clickedSlot = allSlots.find(
      (slot) => slot.day === day && hour >= slot.start && hour < slot.end
    );

    if (clickedSlot && (!selectedSlot || (selectedSlot && (
      clickedSlot.day !== selectedSlot.day ||
      clickedSlot.start !== selectedSlot.start ||
      clickedSlot.end !== selectedSlot.end
    )))) {
      setSelectedSlot({ ...clickedSlot });
    } else {
      setSelectedSlot({ ...clickedSlot });
    }
   
  if (!clickedSlot) {
    setSelectedSlot(null);
  }
    const slotsGroupedByDay = groupSlotsByDay(allSlots);
    const connectedGrouping = findConnectedGrouping(
      slotsGroupedByDay[day],
      day,
      hour
    );
    
    setSelectedSlot({
      ...selectedSlot,
      day,
      start: connectedGrouping?.start,
      end: connectedGrouping?.end,
      item: clickedSlot.item,
    });
  };
  

  const findConnectedGrouping = (slots, clickedDay, clickedHour) => {
    if (!Array.isArray(slots)) {
      console.error('The variable is not an array:', slots);
      return;
    }
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

  // const handleSlotClick = (day, hour, slots) => {
  //   console.log('Inside handleSlotClick with:', { day, hour });
  //   if (!day || !hour) return;
  //   const allSlots = slots || scheduledSlots;
  //   const clickedSlot = allSlots.find(
  //     (slot) => slot.day === day && hour >= slot.start && hour < slot.end
  //   );

  //   if (clickedSlot && (!selectedSlot || (selectedSlot && (
  //     clickedSlot.day !== selectedSlot.day ||
  //     clickedSlot.start !== selectedSlot.start ||
  //     clickedSlot.end !== selectedSlot.end
  //   )))) {
  //     setSelectedSlot({ ...clickedSlot });
  //   } else {
  //     setSelectedSlot({ ...clickedSlot });
  //   }
   
  // if (!clickedSlot) {
  //   setSelectedSlot(null);
  // }
  //   const slotsGroupedByDay = groupSlotsByDay(allSlots);
  //   if (!Array.isArray(slotsGroupedByDay[day])) {
  //     console.error(`Expected an array for day, but got:`, slotsGroupedByDay[day]);
  //     // Handle this case, perhaps by initializing an empty array for the day
  //     slotsGroupedByDay[day] = [];
  //   }
  //   const connectedGrouping = findConnectedGrouping(
  //     slotsGroupedByDay[day],
  //     day,
  //     hour
  //   );
    
  //   setSelectedSlot({
  //     ...selectedSlot,
  //     day,
  //     start: connectedGrouping?.start,
  //     end: connectedGrouping?.end,
  //     item: clickedSlot.item,
  //   });
  // };
  //2024-03-07: edit the selected slot to updated date, start and end time 
  useEffect(() => {
    props.handleSelectedSlot(selectedSlot || { day: "Nothing selected", start: "Nothing selected", end: "Nothing selected" });
  },[selectedSlot]);

  const handlePieceDrop = (date, hour, item) => {
    console.log("handlePieceDrop", date, hour, item);
    const year = date.split("-")[0];
    const month = date.split("-")[1] - 1;
    const tempDay = date.split("-")[2];
    const day = new Date(year, month, tempDay, parseInt(hour));
    
    // const dropDate = new Date(date);
    // dropDate.setHours(hour, 0, 0, 0);
    
    // realCurrentDate.setHours(0, 0, 0, 0);
    // if (dropDate < realCurrentDate) {
    //   setIsModalOpen(true);
    //   return;
    // }

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

  const goToNextWeek = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + 7);
      return newDate;
    });
    setSelectedSlot(null);
  };

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
          {realCurrentDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
          })}
        </div>
        {weekDays.map((day, index) => (
          <div key={index} className="header-cell">
            {day.toLocaleDateString("en-US", { weekday: "long" })}
            {day.toLocaleDateString("en-US", {
              month: "numeric",
              day: "numeric",
            })}
          </div>
        ))}
        <button className="navigation-button nb-right" onClick={goToNextWeek}>
          <i className="fa-solid fa-arrow-right" />
        </button>
      </>
    );
  };

  // Render the body of the calendar with times and cells
  const renderBody = () => {
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
            puzzlePieces={props.puzzlePieces}
          />
        ))}
      </div>
    ));
  };

  return (
    <div className="main-calendar">
      <div className="calendar">
        <div className="header">{renderHeader()}</div>
        <div className="body">{renderBody()}</div>
        <GarbageBin ref={drop} />
        {/* <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <p>You cannot book an appointment on past days.</p>
        </Modal> */}
      </div>
    </div>
  );
};

export default Calendar;
