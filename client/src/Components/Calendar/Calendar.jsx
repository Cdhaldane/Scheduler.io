import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useDrop } from "react-dnd";
import Cell from "./Cell.jsx";
import CalendarHeader from "./Components/CalendarHeader/CalendarHeader.jsx";
import "./Calendar.css";
import {
  getServiceFromId,
  addPersonnelService,
  updatePersonnelService,
} from "../../Database.jsx";
import Button from "../../DevComponents/Button/Button.jsx";
import Spinner from "../../DevComponents/Spinner/Spinner.jsx";
import { useSelector, useDispatch } from "react-redux";
import { setTime } from "../../Store.js";
import Modal from "../../DevComponents/Modal/Modal.jsx";
import ContextMenu from "./CalendarContextMenu/ContextMenu";
import { isToday } from "../../Utils.jsx";
import { useAlert } from "../../DevComponents/Providers/Alert.jsx";

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
  onDeletePersonnelService,
  onUpdatePersonnelService,
  personnel,
  personnelSlots,
  selectedPersonnel,
}) => {
  // State hooks to manage current date, selected slot, and scheduled slots
  const [currentView, setCurrentView] = useState(getDaysOfWeek(new Date()));
  const [scheduledSlots, setScheduledSlots] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const times = ["Day", "Week", "Month"];
  const [timeFrameIndex, setTimeFrameIndex] = useState(0);
  const [fullView, setFullView] = useState(true);
  const timeFrame = useSelector((state) => state.timeFrame.value);
  const availability = useSelector((state) => state.availability.value);
  const [selectedCell, setSelectedCell] = useState({ day: null, hour: null });
  const [slotToCopy, setSlotToCopy] = useState(null);
  const dispatch = useDispatch();
  const alert = useAlert();
  const calendarRef = useRef(null);

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
  });

  const isMobile = window.innerWidth <= 768;
  useEffect(() => {
    handleSelectedSlot(null);
    const handleClickOutside = (e) => {
      const mainRight = document.getElementsByClassName("main-right")[0];
      const openIcon = document.getElementById("open-icon");
      if (
        calendarRef.current &&
        !calendarRef.current.contains(e.target) &&
        !mainRight?.contains(e.target) &&
        !openIcon?.contains(e.target)
      ) {
        handleSelectedSlot(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedPersonnel]);

  useEffect(() => {
    const initializeCalendar = async () => {
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
    initializeCalendar();
  }, [timeFrame]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        if (adminMode) {
          const slots = await fetchAdminData();
          setScheduledSlots(slots);
        } else {
          const slots = await Promise.all(
            bookings.map(async (booking) => {
              const service = await getServiceFromId(booking.service_id);
              return {
                id: booking.booking_id,
                day: new Date(booking.booking_date).getUTCDate(),
                start: parseInt(booking.booking_time.split(":")[0]), // Extract hours
                end:
                  parseInt(booking.booking_time.split(":")[0]) +
                  service.duration,
                item: service,
                type: "booking",
              };
            })
          );

          setScheduledSlots(slots);

          // Fetch available slots for non-admins (if needed)
          // const availableSlots = await fetchAdminData();
          setAvailableSlots(personnelSlots);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [bookings, adminMode]);

  // Helper functions
  const fetchAdminData = async () => {
    const slots = (
      await Promise.all(
        personnelSlots.map(async (service) => {
          if (!service) return [];

          const validSlots = [];
          const startHour = Math.max(service.start, 0);
          const endHour = Math.min(service.end, 24);
          for (let i = startHour; i < endHour; i++) {
            validSlots.push({
              id: service.id,
              day: new Date(service.date).getUTCDate(),
              start: service.start,
              end: service.end,
              item: service.item,
              type: "scheduled",
            });
          }

          return validSlots;
        })
      )
    ).flat();

    return slots;
  };

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
  const handleSlotClick = useCallback(
    (day, hour, date) => {
      setSelectedCell({ day, hour });
      const isSelected = findConnectedGrouping(scheduledSlots, day, hour);
      handleSelectedSlot(day, hour, date, isSelected || null);
    },
    [scheduledSlots, handleSelectedSlot]
  );

  // handlePieceDrop: Handles dropping a puzzle piece into calendar, adding a new slot to the schedule form.
  // Input: date (String), hour (Number), item (Object)
  // Output: None
  const handlePieceDrop = useCallback(
    async (day, hour, date, item) => {
      if (isSlotScheduled(day, hour)) {
        alert.showAlert("error", "This slot is already scheduled.");
        let slot = personnelSlots.find((slot) => {
          if (slot.day === day && hour >= slot.start && hour < slot.end) {
            return slot;
          }
        });

        if (
          Array.isArray(slot.item)
            ? slot.item.find((i) => i.id === item.id)
            : slot.item.id === item.id
        ) {
          alert.showAlert("error", "This service is already scheduled.");
          return;
        } else {
          const newSlot = Array.isArray(slot.item)
            ? [...slot.item, item]
            : [slot.item, item];

          onUpdatePersonnelService(slot.id, {
            item: newSlot,
          });
          alert.showAlert("success", "Services have been combined.");
        }
        return;
      }
      onAddPersonnelService({
        day: day,
        start: hour,
        end: hour + item.duration,
        date: date,
        item: item,
        id: `${item.id}-${day}-${hour}:${hour + item.duration}`,
      });
    },
    [onAddPersonnelService, scheduledSlots, onUpdatePersonnelService]
  );

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
    if (
      (isSlotScheduled(day, hour) &&
        item.direction === "top" &&
        hour < selectedSlot[0].hour) ||
      (isSlotScheduled(day, hour) &&
        item.direction === "bottom" &&
        hour > selectedSlot[selectedSlot.length - 1].hour)
    ) {
      alert.showAlert("error", "This slot is already scheduled.");
      return;
    }

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

    setScheduledSlots([...updatedSlots, ...newSlots]);
    if (item.direction === "top") {
      const id = `${
        Array.isArray(item.item) ? item.item[0].id : item.item.id
      }-${day}-${hour}:${endingTime}`;
      onUpdatePersonnelService(id, {
        start: hour,
        end: endingTime + 1,
      });
    }
    if (item.direction === "bottom") {
      const id = `${
        Array.isArray(item.item) ? item.item[0].id : item.item.id
      }-${day}-${startingTime}:${hour}`;
      onUpdatePersonnelService(id, {
        start: startingTime,
        end: hour + 1,
      });
    }

    handleSlotClick(null);
  };

  const handleScheduledSlotDelete = useCallback(
    (day, hour, e) => {
      e.stopPropagation();
      let connectedGrouping = findConnectedGrouping(scheduledSlots, day, hour);
      let id = `${
        Array.isArray(connectedGrouping.itemData)
          ? connectedGrouping.itemData[0].id
          : connectedGrouping.itemData.id
      }-${day}-${connectedGrouping.start}:${connectedGrouping.end}`;
      onDeletePersonnelService(id);
    },
    [scheduledSlots]
  );

  useEffect(() => {
    if (isMobile) dispatch(setTime("Day"));
  }, [isMobile]);

  // Function to hide the context menu
  const handleCloseContextMenu = () => {
    setContextMenu({ ...contextMenu, visible: false });
  };

  // Context menu options
  const handleKeyboardNavigation = useCallback(
    (e) => {
      console.log(selectedCell);
      if (!selectedCell) return;
      const { day, hour } = selectedCell;
      if (day === null || hour === null) return;

      let newDay = day;
      let newHour = hour;

      switch (e.key) {
        case "ArrowUp":
          newHour = Math.max(hour - 1, 0);
          handleSlotClick(newDay, newHour, currentView[newDay]);
          break;
        case "ArrowDown":
          newHour = Math.min(hour + 1, 23);
          handleSlotClick(newDay, newHour, currentView[newDay]);
          break;
        case "ArrowLeft":
          const currentIndex = currentView.findIndex(
            (d) => d.getUTCDate() === day
          );
          if (currentIndex > 0) {
            newDay = currentView[currentIndex - 1].getUTCDate();
          }
          handleSlotClick(newDay, newHour, currentView[newDay]);
          break;
        case "ArrowRight":
          const nextIndex = currentView.findIndex(
            (d) => d.getUTCDate() === day
          );
          if (nextIndex < currentView.length - 1) {
            newDay = currentView[nextIndex + 1].getUTCDate();
          }
          handleSlotClick(newDay, newHour, currentView[newDay]);
          break;
        case "c": // Start copy mode
          const slotToBeCopied = scheduledSlots.find(
            (slot) =>
              slot.day === selectedCell.day &&
              selectedCell.hour >= slot.start &&
              selectedCell.hour < slot.end
          );
          if (slotToBeCopied) startCopySlot(slotToBeCopied);
          break;
        case "Enter": // Finalize copy
          if (slotToCopy) {
            copySlotToNewDay(newDay);
          }
          break;
        case "Delete":
          handleScheduledSlotDelete(newDay, newHour, e);
          break;
        case "Escape": // Cancel copy
          cancelCopySlot();
          break;
        default:
          return;
      }

      setSelectedCell({ day: newDay, hour: newHour });
      e.preventDefault();
    },
    [selectedCell, currentView, handleSlotClick, slotToCopy]
  );

  // Function to trigger copy mode
  const startCopySlot = (slot) => {
    setSlotToCopy(slot);
    alert.showAlert(
      "info",
      "Copy mode activated. Select a new day and press 'ENTER' to copy the slot."
    );
  };

  // Function to cancel copy mode
  const cancelCopySlot = () => {
    setSlotToCopy(null);
    alert.showAlert("info", "Copy mode canceled.");
  };

  // Function to handle slot copy
  const copySlotToNewDay = (newDay) => {
    if (!slotToCopy) return;
    const newSlot = {
      ...slotToCopy,
      day: newDay,
      date: currentView[newDay - 1],
      id: `${
        Array.isArray(slotToCopy.item)
          ? slotToCopy.item[0].id
          : slotToCopy.item.id
      }-${newDay}-${slotToCopy.id.split("-")[2]}`,
    };

    // Update state and backend
    setScheduledSlots((prev) => [...prev, newSlot]);

    if (onAddPersonnelService) {
      onAddPersonnelService(newSlot);
    }

    setSlotToCopy(null);
    alert.showAlert("success", "Slot copied successfully!");
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyboardNavigation);
    return () => {
      document.removeEventListener("keydown", handleKeyboardNavigation);
    };
  }, [handleKeyboardNavigation]);

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
        adminMode={adminMode}
      />

      <div className="calendar-table" ref={calendarRef}>
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
                availableSlots={availableSlots} // Pass available slots here
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
                timeView={timeFrame}
                availability={availability}
                contextMenu={contextMenu}
                setContextMenu={setContextMenu}
                type={type}
              />
            ))}
          </div>
        ))}
        {/* <ContextMenu
          visible={contextMenu.visible}
          x={contextMenu.x}
          y={contextMenu.y}
          options={contextMenu.options || []}
          onRequestClose={handleCloseContextMenu}
        /> */}
      </div>
    </div>
  );
};

export default Calendar;
