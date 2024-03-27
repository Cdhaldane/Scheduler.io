import React, { useState, useEffect } from "react";
import { useDrag } from "react-dnd";
import { useNavigate } from "react-router-dom";
import Dropdown from "../Dropdown/Dropdown";
import { useAlert } from "../Providers/Alert.jsx";
import Clock from "../AnimatedDiv/Clock/Clock.jsx";

import "./Schedule-form.css";

/**
 * ScheduleForm Component
 * 
 * Purpose:
 * - The ScheduleForm component displays a form for scheduling an appointment.
 * - It allows the user to select a service, view the appointment duration and price, and book the appointment.
 * 
 * Inputs:
 * - personID: The ID of the personnel associated with the appointment.
 * - selectedSlot: The selected time slot for the appointment.
 * - personnel: An array of personnel objects.
 * - session: The current user session object.
 * 
 * Outputs:
 * - JSX for rendering the appointment scheduling form with service selection, appointment details, and a booking button.
 * 
 * Example usage:
 * <ScheduleForm
    personID={personID}
    selectedSlot={selectedSlot}
    personnel={personnel}
    session={session}
  />
 */

const ScheduleForm = ({
  selectedPersonnel,
  selectedSlot,
  personnel,
  session,
  selectedService,
  setSelectedService,
  services,
}) => {
  const [day, setDay] = useState();
  const [start, setStart] = useState();

  const [price, setPrice] = useState();

  const navigate = useNavigate();
  const [typing, setTyping] = useState(false);
  const alert = useAlert();
  const isMobile = window.innerWidth < 768;
  const [mobileOpen, setMobileOpen] = useState(isMobile ? false : true);

  //Effect hooks for updating form data and handling typing animation
  useEffect(() => {
    if (selectedPersonnel !== null) {
      setDay(selectedSlot?.date || new Date());
      setStart(selectedSlot?.hour || 9);
    }
  }, [selectedPersonnel, selectedSlot]);

  //Effect hook for handling typing animation
  useEffect(() => {
    if (selectedPersonnel?.first_name) {
      setTyping(true);

      const timer = setTimeout(() => {
        setTyping(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [selectedPersonnel?.first_name]);

  const handleServiceChange = (serviceName) => {
    console.log("service name", serviceName);
    let service = services?.find((service) => service.name === serviceName);
    console.log("service", service);
    setSelectedService(service);
  };
  //useDrag hook to make the component draggable
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

  //handler for booking the appointment
  const handleBookAppointment = () => {
    if (!selectedService)
      return alert.showAlert("error", "Please select a service");
    if (!day) return alert.showAlert("error", "Please select a day");

    const appointment = {
      personnel: selectedPersonnel,
      day: day,
      start: start,
      end: start + selectedService?.duration,
      service: selectedService,
      duration: selectedService?.duration,
      price: selectedService?.price,
    };

    if (session) {
      const user = session?.user.user_metadata;
      navigate("/booking-submit", {
        state: { user, appointment },
      });
    } else {
      navigate("/booking", {
        state: { appointment },
      });
    }
  };

  //Render the schedule form with the appointment details and booking button
  return (
    <>
      {isMobile && (
        <i
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`fa-solid fa-calendar-check schedule-form-mobile-toggle ${
            mobileOpen ? "hidden" : ""
          }`}
        ></i>
      )}
      {mobileOpen && (
        <div
          className={`main-right schedule-container ${
            isMobile ? "mobile" : ""
          }`}
          ref={drag}
          style={{}}
        >
          <div className="body">
            <h1>
              <i
                class="fa-solid fa-calendar-check"
                onClick={() => setMobileOpen(!mobileOpen)}
              ></i>
              APPOINTMENT
            </h1>

            <div className="schedule-appointment">
              <div className="schedule-header">
                PERSONEL:{" "}
                <h2>
                  {selectedPersonnel?.first_name} {selectedPersonnel?.last_name}
                </h2>
              </div>

              {/* <select onChange={handleServiceChange} value={selectedService}>
            <option value="haircut">Haircut</option>
            <option value="shave">Shave</option>
            <option value="haircut and shave">Haircut and Shave</option>
          </select> */}

              <div className="schedule-appointment-info">
                <Dropdown
                  type="button"
                  options={
                    services?.map((service) => service.name) || [
                      "No Services Available",
                    ]
                  }
                  onClick={(service) => handleServiceChange(service)}
                >
                  {" "}
                  <button className="dropdown-toggle">
                    {selectedService?.name || "SELECT SERVICE"}
                  </button>
                </Dropdown>
                <span>
                  <h1>Duration</h1>
                  <h2> {selectedService?.duration || 0} hours</h2>
                </span>
                <span>
                  <h1>Price</h1>
                  <h2> ${selectedService?.price || 0}</h2>
                </span>
                <span>
                  <h1>Date</h1>
                  <h2>
                    {" "}
                    {day?.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "numeric",
                      day: "numeric",
                    })}
                  </h2>
                </span>
                <span>
                  <h1>Start</h1>
                  <h2> {start}:00</h2>
                </span>
                <span>
                  <h1>End</h1>
                  <h2>
                    {" "}
                    {start + (selectedService ? selectedService.duration : 2)}
                    :00
                  </h2>
                </span>
              </div>
            </div>
          </div>
          <footer>
            <button
              className="book-appointment"
              onClick={handleBookAppointment}
            >
              BOOK APPOINTMENT
              <i class="fa-solid fa-computer-mouse"></i>
            </button>
          </footer>
        </div>
      )}
    </>
  );
};

export default ScheduleForm;
