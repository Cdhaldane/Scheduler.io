import React, { useState, useEffect, useRef } from "react";
import { useDrop } from "react-dnd";
import Cell from "./Cell";
import GarbageBin from "./GarbageBin";
import "./calendar.css";

const SERVICE = 'service';
const Calendar = (props) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [scheduledSlots, setScheduledSlots] = useState([]);
  const [timeRange, setTimeRange] = useState([]);

  
  useEffect(() => {
    console.log("Scheduled slots", scheduledSlots);
  }, [scheduledSlots]);

  const getStartOfWeek = (date) => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay());
    start.setHours(0, 0, 0, 0);
    return start;
  };

  // This will generate an array of dates representing the current week
  const daysOfWeek = Array.from({ length: 7 }, (_, index) => {
    const startOfWeek = getStartOfWeek(currentDate);
    return new Date(startOfWeek.setDate(startOfWeek.getDate() + index));
  });

  const hoursInDay = Array.from({ length: 24 }, (_, i) => i);

  // Handlers for navigating weeks
  const goToPreviousWeek = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() - 7);
      return newDate;
    });
  };

  const goToNextWeek = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + 7);
      return newDate;
    });
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
    console.log(daySlots);
    const slotIndex = daySlots.findIndex((slot) => slot.start === hour);
    if (slotIndex === -1) return false;

    const isFirst = slotIndex === 0 || daySlots[slotIndex - 1].end !== hour;

    const isLast =
      slotIndex === daySlots.length - 1 ||
      daySlots[slotIndex + 1].start !== daySlots[slotIndex].end;

    return isFirst || isLast;
  };

  const handleSlotClick = (day, hour, slots) => {
    let allSlots = scheduledSlots;
    if (slots) allSlots = slots;
    const clickedSlot = allSlots.find(
      (slot) => slot.day === day && hour >= slot.start && hour < slot.end
    );
    if (clickedSlot) {
      console.log(clickedSlot.item);
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

    props.handleSelectedSlot({ day, hour });
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
    console.log('Received day:', day);

      const startTime = new Date(day.setHours(hour, 0, 0, 0));
      const endTime = new Date(day.setHours(hour + 1, 0, 0, 0));

    const newSlot = {
      id: `${day.toISOString()}_${hour}`,
      day: day.toISOString(),
      start: startTime.toISOString(),
      end: endTime.toISOString(),
      item: {
        type: item.type,
        id: item.id,
        service: item.service,
        name: personalbar.name,
        duration:item.duration,
        price:item.price,
      }
    };
    // if (isSlotScheduled(day, hour)){
    //   console.log('Slot already scheduled');
    //   return;
    // }

    if(scheduledSlots.some(slot => slot.id === newSlot.id)){
      console.log('Slot already scheduled');
      return;
    }
    setScheduledSlots(prev => [...prev,newSlot,]);
    setSelectedSlot(newSlot);

  
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
    return grouping && hour === grouping.end - 1;
  };


  const renderHeader = () => {
    const startOfWeek = getStartOfWeek(currentDate);
    const weekDays = Array.from({ length: 7 }, (_, index) => {
      const day = new Date(startOfWeek);
      day.setDate(day.getDate() + index);
      return day;
    });
  
    return (
      <div className="header">
        <button className="navigation-button" onClick={goToPreviousWeek}>
          &#8592;
        </button>
        {weekDays.map((day, index) => (
          <div key={index} className="header-cell">
            {day.toLocaleDateString("en-US", { weekday: "long" })}
            <br />
            {day.toLocaleDateString("en-US", { month: "numeric", day: "numeric" })}
          </div>
        ))}
        <button className="navigation-button" onClick={goToNextWeek}>
          &#8594;
        </button>
      </div>
    );
  };
  
  // const [{ isOver, trashBinDrop }, drop] = useDrop({
  //   accept: SERVICE,
  //   drop: (item, monitor) => {
  //     setScheduledSlots((prev) => 
  //       prev.filter(slot => slot.id !== item.id));
  //   },
  //   collect: (monitor) => ({
  //     isOver: !!monitor.isOver(),
  //     //canDrop: monitor.canDrop(),
  //   }),
  // });

  const [{ isOver }, drop] = useDrop({
    accept: SERVICE, // Make sure to use the correct type
    drop: (item, monitor) => {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        return;
      }
      // Perform the cancellation logic here
      setScheduledSlots((prevSlots) =>
        prevSlots.filter(slot => slot.id !== item.id));
    },
    
  });
  // Render the body of the calendar with times and cells
  const renderBody = () => {
    return hoursInDay.map((hour, index) => (
      <div key={index} className="row">
        <div className="cell hours">{`${hour}:00`}</div>
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
            scheduledSlots={scheduledSlots}
            setScheduledSlots={setScheduledSlots}
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
        <div className="header">
          {renderHeader()}
        </div>
        <div className="body">
          {renderBody()}
        </div>
        <GarbageBin ref={drop} />
      </div>
    </div>
  );
};

export default Calendar;
