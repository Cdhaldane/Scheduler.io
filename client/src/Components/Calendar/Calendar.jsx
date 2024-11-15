import React, { useState, useEffect, useRef } from "react";
import { useDrop } from "react-dnd";
import Cell from "./Cell.jsx";
import CalendarHeader from "./Components/CalendarHeader/CalendarHeader.jsx";
import "./Calendar.css";
import { getServiceFromId, addPersonnelService } from "../../Database.jsx";
import Button from "../../DevComponents/Button/Button.jsx";
import Spinner from "../../DevComponents/Spinner/Spinner.jsx";
import { useSelector, useDispatch } from "react-redux";
import { setTime } from "../../Store.js";
import Modal from "../../DevComponents/Modal/Modal.jsx";
import ContextMenu from "./CalendarContextMenu/ContextMenu";
import { isToday } from "../../Utils.jsx";

import {
  getDaysOfWeek,
  getDaysOfMonth,
  findConnectedGrouping,
  changeView,
  isSlotEdge,
  deleteHelper,
  handleOperatingHours,
} from "./Utils.jsx";

const SERVICE = "service";
// Calendar component displays a weekly calendar view and allows users to schedule and manage time slots.
const Calendar = ({
  puzzlePieces,
  handleSelectedSlot,
  selectedSlot,
  bookings,
  adminMode,
  organization,
  type,
  homeLoading,
  onAddPersonnelService,
  personnel,
  personnelSlots,
}) => {
  // State hooks to manage current date, selected slot, and scheduled slots

  const [currentView, setCurrentView] = useState(getDaysOfWeek(new Date()));
  const [scheduledSlots, setScheduledSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const times = ["Day", "Week", "Month"];
  const [timeFrameIndex, setTimeFrameIndex] = useState(0);
  const [fullView, setFullView] = useState(true);
  const timeFrame = useSelector((state) => state.timeFrame.value);
  const dispatch = useDispatch();
  const isMobile = window.innerWidth <= 768;
  const isCompact = window.innerWidth <= 1054;
  const [mobileOpen, setMobileOpen] = useState(isMobile ? false : true);
  const [organizationModal, setOrganizationModal] = useState(false);

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      switch (timeFrame) {
        case "Day":
          setCurrentView([new Date()]);
          break;
        case "Week":
          setCurrentView(getDaysOfWeek(new Date()));
          break;
        case "Month":
          setCurrentView(getDaysOfMonth(new Date()));
          break;
        default:
          setCurrentView(getDaysOfWeek(new Date()));
      }
      setLoading(false);
    };
    fetchData();
  }, [timeFrame]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setScheduledSlots([]);
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

    const fetchAdminData = async () => {
      setLoading(true);
      setScheduledSlots([]);
      const slots = await Promise.all(
        personnelSlots.map(async (service) => {
          return {
            id: service.service_id,
            day: new Date(service.date.id).getUTCDate(),
            start: service.date.start,
            end: service.date.end,
            item: service.date.item,
            type: "scheduled",
          };
        })
      );

      setScheduledSlots(slots);
    };

    if (adminMode) fetchAdminData().finally(() => setLoading(false));
    else fetchData().finally(() => setLoading(false));
  }, [bookings]);

  // isSlotScheduled: Checks if a time slot is scheduled.
  // Input: day (String), hour (Number)
  // Output: Boolean - True if the slot is scheduled, false otherwise
  const isSlotScheduled = (day, hour) => {
    let status = false;
    scheduledSlots.some((slot) => {
      if (slot.day === day && hour >= slot.start && hour < slot.end) {
        if (slot.type === "booking" && type == "customer") status = "booking";
        else status = "scheduled";
      }
    });
    return status;
  };

  // handleSlotClick: Handles click events on slots/cells, updating the selected slot and calling the handleSelectedSlot callback.
  // Input: day (String), hour (Number), slots (Array of slots)
  // Output: None
  const handleSlotClick = (day, hour, date) => {
    const isSelected = isSlotScheduled(day, hour);
    const connectedBookings = findConnectedGrouping(scheduledSlots, day, hour);

    if (connectedBookings)
      handleSelectedSlot(day, hour, date, connectedBookings);
    else handleSelectedSlot(day, hour, date);
  };

  // handlePieceDrop: Handles dropping a puzzle piece into calendar, adding a new slot to the schedule form.
  // Input: date (String), hour (Number), item (Object)
  // Output: None
  const handlePieceDrop = async (day, hour, date, item) => {
    const newSlot = {
      id: date,
      day: date.getUTCDate(),
      start: hour,
      end: hour + 1,
      item: { ...item, type: "scheduled" },
    };
    setScheduledSlots((prev) => [...prev, newSlot]);

    const newService = {
      service_id: item.id,
      date: newSlot,
    };
    onAddPersonnelService(newService);
    handleSlotClick(day, hour, date);
  };

  // handlePieceExpand: Expands a slot to cover multiple hours when a puzzle piece is dragged (resized).
  // Input: day (String), hour (Number), item (Object)
  // Output: None
  const handlePieceExpand = (day, hour, date, item) => {
    let startingTime = Math.min(
      Array.isArray(selectedSlot) ? selectedSlot[0].hour : selectedSlot.hour,
      hour
    );
    let endingTime = Math.max(
      Array.isArray(selectedSlot)
        ? selectedSlot[selectedSlot.length - 1].hour
        : selectedSlot.hour,
      hour
    );
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

    if (connectedGrouping) {
      if (item.direction === "top" && connectedGrouping.start < hour) {
        let x = newSlots.filter((slot) => {
          return slot.start >= hour;
        });
        newSlots = x;
      }
      if (item.direction === "bottom" && connectedGrouping.end > hour) {
        let x = newSlots.filter((slot) => {
          return slot.start <= hour;
        });
        newSlots = x;
      }
    }

    console.log("newSlots", newSlots);
    setScheduledSlots([...updatedSlots, ...newSlots]);
    handleSlotClick(null);
  };

  const handleScheduledSlotDelete = (day, hour, e) => {
    e.stopPropagation();
    let connectedGrouping = findConnectedGrouping(scheduledSlots, day, hour);
    setScheduledSlots(
      deleteHelper(day, hour, connectedGrouping, scheduledSlots)
    );
    handleSelectedSlot();
  };

  useEffect(() => {
    if (isMobile) dispatch(setTime("Day"));
  }, [isMobile]);

  // Function to hide the context menu
  const handleCloseContextMenu = () => {
    setContextMenu({ ...contextMenu, visible: false });
  };

  // Context menu options

  return (
    <div className={`calendar ${isMobile ? "mobile" : ""}`}>
      {loading && <Spinner className={"fast"} />}
      <CalendarHeader
        setLoading={setLoading}
        setTimeFrameIndex={setTimeFrameIndex}
        timeFrameIndex={timeFrameIndex}
        timeFrame={timeFrame}
        setFullView={setFullView}
        fullView={fullView}
        organization={organization}
        currentView={currentView}
      />

      <div className="calendar-table">
        <div className={`calendar-header ${timeFrame}`}>
          <div className={`header-cell ${timeFrame}`}>
            <button
              className="navigation-button nb-left"
              onClick={() =>
                setCurrentView(changeView(-1, [...currentView], timeFrame))
              }
            >
              <i className="fa-solid fa-arrow-left" />
            </button>
            <button
              className="navigation-button nb-right"
              onClick={() =>
                setCurrentView(changeView(1, [...currentView], timeFrame))
              }
            >
              <i className="fa-solid fa-arrow-right" />
            </button>
          </div>
          {currentView.map((day, index) => (
            <div
              key={index}
              className={`header-cell noselect ${loading ? "loading" : ""} ${
                isToday(day) && "today"
              }`}
            >
              {timeFrame === "Day" &&
                day?.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "numeric",
                  day: "numeric",
                })}
              {timeFrame === "Week" &&
                day?.toLocaleDateString(
                  "en-US",
                  window.innerWidth <= 1054
                    ? {
                        weekday: "short",
                        day: "numeric",
                      }
                    : {
                        weekday: "short",
                        month: "numeric",
                        day: "numeric",
                      }
                )}
              {timeFrame === "Month" &&
                day?.toLocaleDateString("en-US", {
                  day: "numeric",
                })}
            </div>
          ))}
        </div>

        {Array.from({ length: 24 }).map((_, hour) => (
          <div
            key={"row" + hour}
            className={`calendar-row noselect  ${
              fullView
                ? "full"
                : handleOperatingHours(hour, organization)
                ? "open"
                : "closed"
            } ${timeFrame}
         `}
          >
            <div
              key={hour}
              className={`cell hours ${timeFrame}`}
            >{`${hour}:00`}</div>
            {currentView.map((day) => (
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
                handleOperatingHours={(day, hour) =>
                  handleOperatingHours(hour, organization)
                }
                isSlotEdge={isSlotEdge}
                handlePieceExpand={handlePieceExpand}
                scheduledSlots={scheduledSlots}
                puzzlePieces={puzzlePieces}
                adminMode={adminMode}
                organization={organization}
                timeView={times[timeFrameIndex]}
                contextMenu={contextMenu}
                setContextMenu={setContextMenu}
                type={type}
              />
            ))}
          </div>
        ))}
        {console.log("contextMenu", contextMenu)}
        <ContextMenu
          visible={contextMenu.visible}
          x={contextMenu.x}
          y={contextMenu.y}
          options={contextMenu.options || []}
          onRequestClose={handleCloseContextMenu}
        />
      </div>
    </div>
  );
};

export default Calendar;
