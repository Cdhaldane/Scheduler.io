import React, { useState, useEffect } from "react";
import { useDrag } from "react-dnd";
import { useNavigate } from "react-router-dom";
import Dropdown from "../Dropdown/Dropdown";

import "./Schedule-form.css";

const ScheduleForm = ({ personID, selectedSlot, personnel }) => {
  const [person, setPerson] = useState(personnel[personID]);
  const [day, setDay] = useState(selectedSlot.day);
  const [start, setStart] = useState(selectedSlot.hour);
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState();
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (personID !== null) {
      setPerson(personnel[personID]);
      setDay(selectedSlot.day);
      setStart(selectedSlot.hour);
    }
  }, [personID, personnel, selectedSlot]);

  useEffect(() => {
    if (person?.first_name) {
      // Start the typing effect
      setTyping(true);

      // Wait for the animation to finish before removing the class
      const timer = setTimeout(() => {
        setTyping(false);
      }, 2000); 
      return () => clearTimeout(timer);
    }
  }, [person?.first_name]);

  //add a handler for the service change
  const handleServiceChange = (service) => {
    setSelectedService(service);
  };

  const [{ isDragging }, drag] = useDrag({
    type: "service",
    item: {
      type: "service",
      id: personID,
      service: selectedService,
      start: selectedSlot.hour,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div className="schedule-container" ref={drag}>
      <div className="body">
        <h1>APPOINTMENT</h1>

        <div className="schedule-appointment">
          <div className="schedule-header">
            PERSONEL:{" "}
            <h2
              className={`typing-animation ${typing ? "animate-typing" : ""}`}
            >
              {person?.first_name} {person?.last_name}
            </h2>
          </div>

          {/* <select onChange={handleServiceChange} value={selectedService}>
            <option value="haircut">Haircut</option>
            <option value="shave">Shave</option>
            <option value="haircut and shave">Haircut and Shave</option>
          </select> */}

          <div className="schedule-appointment-info">
            <Dropdown
              children={
                <button className="dropdown-toggle">
                  {selectedService || "Select Service"}
                </button>
              }
              options={["Haircut", "Shave", "Haircut and Shave"]}
              onClick={(service) => handleServiceChange(service)}
            />
            <span>
              <h1>Duration:</h1>
              <h2> 2 hours</h2>
            </span>
            <span>
              <h1>Price:</h1>
              <h2> $20</h2>
            </span>
          </div>
          <div className="schedule-time">
            <ul className="schedule-labels">
              <li>
                <h1>Day</h1>
              </li>
              <li>
                <h1>Start</h1>
              </li>
              <li>
                <h1>End</h1>
              </li>
            </ul>
            <ul className="schedule-values">
              <li>
                <h2>{day || "Monday"}</h2>
              </li>
              <li>
                <h2>{start || 2}:00</h2>
              </li>
              <li>
                <h2>{start + 2 || 5}:00</h2>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <footer>
        <button
          className="book-appointment"
          onClick={() => navigate("booking")}
        >
          Book Appointment
        </button>
      </footer>
    </div>
  );
};

export default ScheduleForm;
