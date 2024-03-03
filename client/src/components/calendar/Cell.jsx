import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDrop, useDrag } from "react-dnd";
import ScheduleForm from "../schedule-form/schedule-form";
import PuzzleContainer from "../Puzzle/PuzzleContainer";



const ResizeIndicator = ({ direction, onResize, name }) => {
  const [, drag] = useDrag({
    type: "resize",
    item: () => ({ direction, type: "resize", name }),
    end: (item, monitor) => {
      if (item && monitor.didDrop()) {
        onResize(direction, monitor.getDropResult());
      }
    },
  });

  return <div ref={drag} className={`expand-indicator ${direction}`}></div>;
};

// const onDropService = (item, day, hour) => {
//   console.log("Dropped service", item, day, hour);
// }

const Cell = ({
  day,
  hour,
  timeRange,
  handleSlotClick,
  handlePieceDrop,
  handlePieceExpand,
  selectedSlot,
  isSlotEdge,
  serviceName,
  scheduledSlots,
  setScheduledSlots,
  isLastInGroup,
  puzzlePieces,
  onDropService,
}) => {
  const SERVICE = 'service';

  const matchingSlot = scheduledSlots.find(slot => {
    const slotStart = new Date(slot.start);
    return slotStart.getHours() === hour && slotStart.toDateString() === day.toDateString();
  });

  const ref = useRef(null);
  // const [{isDragging}, drag] = useDrag({
  //   type: SERVICE,
  //   item: {type: SERVICE, day, hour, ...matchingSlot ?.item},
  //   canDrag: !!matchingSlot,
  //   collect: (monitor) => ({
  //     isDragging: !!monitor.isDragging(),
  //   }),
  //   end:(item, monitor) => {
  //     const dropResult = monitor.getDropResult();
  //     if(!dropResult){
  //       setScheduledSlots((prev) => prev.filter(slot => slot.id !== item.id));
  //     }
  //   }
  // });
  const [{ isDragging }, drag] = useDrag({
    type: SERVICE,
    item: matchingSlot ? { type: SERVICE, id: matchingSlot.id } : undefined,
    canDrag: !!matchingSlot,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
       if(!dropResult){
        setScheduledSlots((prev) => prev.filter(slot => slot.id !== item.id));
        }
    },
  });

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: SERVICE,
     drop: (item, monitor) => {
       if(onDropService){
         onDropService(item, monitor, day, hour);
       }
       handlePieceDrop(day, hour, item);
     },
     collect: monitor => ({
       isOver: !!monitor.isOver(),
       canDrop: !!monitor.canDrop(),
     }),
   });

  const isSlotScheduled = useCallback((day, hour) => {
    return scheduledSlots.some(slot => {
      const slotStart = new Date(slot.start);
      const slotEnd = new Date(slot.end);
      return (
        slotStart.getHours() === hour &&
        slotStart.toDateString() === day.toDateString() 
      );
    });
  }, [scheduledSlots]);

  const isScheduled = useCallback((day, hour) => {
    return scheduledSlots.some(slot => {
      const slotStart = new Date(slot.start);
      return slotStart.getHours() === hour && slotStart.toDateString() === day.toDateString();
    });
  }, [scheduledSlots]);

  let cellClass = "cell";
  if (isScheduled) {
    cellClass += " scheduled";
  }
  if(selectedSlot && selectedSlot.day === day && selectedSlot.hour === hour){
    cellClass += " selected";
  }
  if(isOver && canDrop){
    cellClass += " over";
  }




  const handleSelectedSlot = () => {
    return selectedSlot?.hour === hour;
  };

  const handleGroupSelect = () => {
    if (!selectedSlot) return;
    if (selectedSlot?.start && selectedSlot?.end) {
      return (
        selectedSlot?.day === day &&
        hour >= selectedSlot.start &&
        hour < selectedSlot.end
      );
    }
    return false;
  };
  const isSelected = selectedSlot?.day === day && handleSelectedSlot();
  const groupSelect = handleGroupSelect();
  const lastInGroup = isLastInGroup(day, hour);

  const handleResize = (direction, dropResult) => {
    console.log(`Resizing ${direction} at ${day} ${hour}`);
  };

  const handleCellClick = (day, hour) => {
    const slot = scheduledSlots.find(s =>
      s.day === day.toISOString() && hour >= new Date(s.start).getHours() && hour < new Date(s.end).getHours()
  );
    if (slot) {
      setScheduledSlots({
        ...slot,
        item: {
          ...slot.item,
          serviceName,
        },
      });
      }
    //handleSlotClick(day, hour);
  };
  const color = puzzlePieces?.find(
    (piece) => piece?.name === serviceName
  )?.color;

  // const ref = useRef(null);
  drag(drop(ref));
  return (

    <div ref={ref} className={cellClass} onClick={(e) => handleCellClick(day, hour, e)}>
      {groupSelect && isSlotEdge(day, hour, serviceName) && (
        <div className="group-select">
          <ResizeIndicator
            direction="top"
            onResize={handleResize}
            name={serviceName}
          />
        </div>
      )}
      {isScheduled(day, hour) && (
        <div className="scheduled-slot">
          {scheduledSlots.filter(slot => {
            const slotDay = new Date(slot.day).toDateString();
            const slotHour = new Date(slot.start).getHours();
            return slotDay === day.toDateString() && slotHour === hour;
          }).map((slot, index) => (
            <div key={index} className="scheduled-service-info">
              <div className="service-name">{slot.item.serviceName}</div>
              <div className="person-name">{slot.item.personName}</div>
              <div className="appointment-type">{slot.item.appointmentType}</div>
              <div className="duration">{`Duration: ${slot.item.duration || 'N/A'} hours`}</div>
              <div className="price">{`Price: $${slot.item.price}`}</div>
              <div className="start-time">{`Start: ${new Date(slot.start).toLocaleTimeString()}`}</div>
              <div className="end-time">{`End: ${new Date(slot.end).toLocaleTimeString()}`}</div>
            </div>
          )
            )}
          {lastInGroup ? `${hour + 1}:00 ` : `${hour}:00 `}
          {serviceName}
        </div>
      )}
      {isSelected && isSlotScheduled(day, hour) ? (
        <>
          {!lastInGroup && (
            <ResizeIndicator
              direction="top"
              onResize={handleResize}
              name={serviceName}
            />
          )}
          {/* Cell content */}
          {lastInGroup ? `${hour + 1}:00 ` : `${hour}:00 `}
          {serviceName}
          {lastInGroup && (
            <ResizeIndicator
              direction="bottom"
              onResize={handleResize}
              name={serviceName}
            />
          )}
        </>
      ) : (
        <>
          {isSlotEdge(day, hour, serviceName) && (
            <div className="scheduled-slot">
              {lastInGroup ? `${hour + 1}:00 ` : `${hour}:00 `}
              {serviceName}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Cell;
