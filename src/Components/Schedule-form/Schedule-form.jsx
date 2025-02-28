import React, { useState, useEffect } from "react";
import { useDrag } from "react-dnd";
import { useNavigate } from "react-router-dom";
import Dropdown from "../../DevComponents/Dropdown/Dropdown.jsx";
import { useAlert } from "../../DevComponents/Providers/Alert.jsx";
import { convertMilitaryTime } from "../../Utils.jsx";
import { useSelector, useDispatch } from "react-redux";
import { setAvailability } from "../../Store.js";
import "./Schedule-form.css";

/**
 * ScheduleForm Component
 *
 * Purpose:
 * - The ScheduleForm component displays a form for scheduling an appointment.
 * - It allows the user to select a service, view the appointment duration and price, and book the appointment.
 */

const ScheduleForm = ({
  selectedPersonnel,
  selectedSlot,
  personnel,
  session,
  selectedService,
  setSelectedService,
  services,
  organization,
}) => {
  const [day, setDay] = useState(null);
  const [start, setStart] = useState(null);
  const navigate = useNavigate();
  const alert = useAlert();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [mobileOpen, setMobileOpen] = useState(!isMobile);
  const dispatch = useDispatch();
  const availabilityStatus = useSelector((state) => state.availability.value);
  const toggleAvailability = (availabilityStatus) => {
    dispatch(setAvailability(availabilityStatus)); // Dispatching plain object
  };

  console.log("session", session);

  // Effect hooks for updating form data
  useEffect(() => {
    if (selectedSlot) {
      setDay(selectedSlot?.date || new Date());
      setStart(selectedSlot?.hour || 9);
    }
  }, [selectedSlot]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setMobileOpen(!mobile);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleServiceChange = (serviceName) => {
    if (Array.isArray(serviceName)) {
      let newService = [];
      serviceName.forEach((service) => {
        const someService = services?.find((s) => s.name === service);
        newService.push(someService);
      });

      if (newService.length === 0) newService = "SELECT SERVICE";
      setSelectedService(newService);
    } else {
      const service = services?.find((s) => s.name === serviceName);

      if (!service) service = "SELECT SERVICE";
      setSelectedService(service);
    }
  };

  // useDrag hook to make the component draggable
  const [{ isDragging }, drag] = useDrag({
    type: "service",
    item: {
      type: "service",
      id: selectedPersonnel?.id,
      service: selectedService,
      start: selectedSlot?.hour,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const handleBookAppointment = () => {
    if (!selectedService) {
      alert.showAlert("error", "Please select a service.");
      return;
    }
    if (!day) {
      alert.showAlert("error", "Please select a day.");
      return;
    }

    let appointment = {
      personnel: selectedPersonnel,
      day,
      start,
      end: start + selectedService.duration,
      service: selectedService,
      duration: selectedService.duration,
      price: selectedService.price,
    };

    if (Array.isArray(selectedService)) {
      appointment = {
        ...appointment,
        service: selectedService,
        duration: selectedService
          .map((service) => service.duration)
          .reduce((a, b) => a + b, 0),
        price: selectedService
          .map((service) => service.price)
          .reduce((a, b) => a + b, 0),
        end:
          start +
          Math.ceil(
            selectedService
              .map((service) => service.duration)
              .reduce((a, b) => a + b, 0) / 2
          ),
      };
    }

    const route = session ? "/booking-submit" : "/booking";
    const state = session
      ? { user: session?.user?.user_metadata, appointment, organization }
      : { appointment };

    navigate(route, { state });
  };

  const handleAvailability = () => {
    toggleAvailability(!availabilityStatus);
  };

  return (
    <div
      className={`schedule-container ${isDragging ? "dragging" : ""}`}
      id="schedule-form"
      ref={drag}
      style={{ opacity: isDragging ? 0.6 : 1 }}
    >
      <div className="schedule-body">
        <div className="schedule-header">
          PERSONNEL:{" "}
          <h2>
            {selectedPersonnel?.first_name} {selectedPersonnel?.last_name}
          </h2>
        </div>

        <div
          className={`schedule-appointment-info ${
            !selectedSlot?.day ? "not-selected" : "selected"
          }`}
        >
          <Dropdown
            type="button"
            listType="checkbox"
            className="service-dropdown"
            options={
              services?.map((service) => service?.name) || [
                "No Services Available",
              ]
            }
            onClick={(service) => {
              handleServiceChange(service);
            }}
          >
            <button
              className="dropdown-toggle"
              onClick={() => {
                if (!selectedSlot?.day) {
                  alert.showAlert(
                    "info",
                    "Show available Time Slots?",
                    handleAvailability
                  );
                  return;
                }
              }}
            >
              {Array.isArray(selectedService)
                ? selectedService.map((service) => service.name).join(", ")
                : selectedService?.name || "SELECT SERVICE"}
            </button>
          </Dropdown>
          <span>
            <h1>Duration</h1>
            <h2>
              {selectedSlot?.day
                ? Array.isArray(selectedService)
                  ? selectedService
                      .map((service) => service.duration)
                      .reduce((a, b) => a + b, 0) / 2
                  : selectedService?.duration || "NA"
                : ""}
            </h2>
          </span>
          <span>
            <h1>Price</h1>
            <h2>
              {selectedSlot?.day
                ? Array.isArray(selectedService)
                  ? selectedService
                      .map((service) => service.price)
                      .reduce((a, b) => a + b, 0) / 2
                  : selectedService?.price || "NA"
                : ""}
            </h2>
          </span>
          <span>
            <h1>Date</h1>
            <h2>
              {selectedSlot?.day
                ? day?.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "numeric",
                    day: "numeric",
                  })
                : ""}
            </h2>
          </span>
          <span>
            <h1>Start</h1>
            <h2>
              {selectedSlot?.day ? convertMilitaryTime(start + ":00") : ""}
            </h2>
          </span>
          <span>
            <h1>End</h1>
            <h2>
              {selectedSlot?.day
                ? Array.isArray(selectedService)
                  ? convertMilitaryTime(
                      start +
                        Math.ceil(
                          selectedService
                            .map((service) => service.duration)
                            .reduce((a, b) => a + b, 0) / 2
                        ) +
                        ":00"
                    )
                  : convertMilitaryTime(
                      start + parseInt(selectedService?.duration) + ":00"
                    )
                : ""}
            </h2>
          </span>
        </div>
      </div>
      <footer>
        <button className="book-appointment" onClick={handleBookAppointment}>
          BOOK APPOINTMENT
          <i className="fa-solid fa-computer-mouse"></i>
        </button>
      </footer>
    </div>
  );
};

export default ScheduleForm;
