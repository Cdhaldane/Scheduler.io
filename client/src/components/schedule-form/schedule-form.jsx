import React, { useState, useEffect } from "react";
import { useDrag } from "react-dnd";
import data from "../../personnelData.json";
import { useNavigate } from "react-router-dom";
import Dropdown from "../Dropdown/Dropdown";

import "./Schedule-form.css";

const ScheduleForm = (props) => {
  const [personID, setPersonID] = useState(props.personID);
  const [person, setPerson] = useState(data.personnel[personID]);
  const [day, setDay] = useState(props.selectedSlot.day);
  const [start, setStart] = useState(props.selectedSlot.hour);
  const navigate = useNavigate();
  const [selectedSlot, setSelectedSlot] = useState(props.selectedSlot);
  const [selectedService, setSelectedService] = useState(props.selectedService);

  useEffect(() => {
    if (props.personID !== null) {
      setPerson(data.personnel[props.personID]);
      setDay(props.selectedSlot.day);
      setStart(props.selectedSlot.hour);
    }
  }, [props]);

  //add a handler for the service change
  const handleServiceChange = (service) => {
    console.log(service);
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

  const useScheduleGrid = (initialDay = "Monday", initialStartHour = 3) => {
    const [day, setDay] = useState(initialDay);
    const [startHour, setStartHour] = useState(initialStartHour);

    const changeDay = (newDay) => setDay(newDay);
    const changeStartHour = (hour) => setStartHour(hour);

    const ScheduleGridComponent = () => (
      <div className="schedule-time">
        <ul className="schedule-labels">
          <li>
            <h1>Day:</h1>
          </li>
          <li>
            <h1>Start:</h1>
          </li>
          <li>
            <h1>End:</h1>
          </li>
        </ul>
        <ul className="schedule-values">
          <li>
            <h2>{day}</h2>
          </li>
          <li>
            <h2>{startHour}:00</h2>
          </li>
          <li>
            <h2>{startHour + 2}:00</h2>
          </li>
        </ul>
      </div>
    );

    return { ScheduleGridComponent, changeDay, changeStartHour };
  };

  return (
    <div className="schedule-container" ref={drag}>
      <div className="body">
        <h1>APPOINTMENT</h1>

        <div className="schedule-appointment">
          <div className="schedule-header">
            PERSONEL: <h2>{person.name}</h2>
          </div>

          {/* <select onChange={handleServiceChange} value={selectedService}>
            <option value="haircut">Haircut</option>
            <option value="shave">Shave</option>
            <option value="haircut and shave">Haircut and Shave</option>
          </select> */}

          <div className="schedule-appointment-info">
            <Dropdown
              label={selectedService || "Service"}
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
