import React, { useState, useEffect } from "react";
import data from "../../personnelData.json";
import { useNavigate } from "react-router-dom";

import "./schedule-form.css";

const ScheduleForm = (props) => {
  const [personID, setPersonID] = useState(props.personID);
  const [person, setPerson] = useState(data.personnel[personID]);
  const [day, setDay] = useState(props.selectedSlot.day);
  const [start, setStart] = useState(props.selectedSlot.hour);
  const navigate = useNavigate();

  useEffect(() => {
    let personID = props.personID;
    if (personID === null) return;
    let person = data.personnel[personID];
    setPerson(person);
    console.log(props.selectedSlot);
    setDay(props.selectedSlot.day);
    setStart(props.selectedSlot.hour);
  }, [props]);

  return (
    <div className="schedule-container">
      <div className="body">
        <h1>Personel: {person.name}</h1>
        <div className="schedule-appointment">
          <span className="row">
            <h1>Appointment type:</h1>
            <select>
              <option value="haircut">Haircut</option>
              <option value="shave">Shave</option>
              <option value="haircut and shave">Haircut and Shave</option>
            </select>
          </span>

          <div className="schedule-appointment-info">
            <h2>Duration: 2 hours</h2>
            <h2>Price: $20</h2>
          </div>
        </div>
        <div className="schedule-time">
          <h1>Start {start}:00</h1>
          <h1>End {start + 2}:00</h1>
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
