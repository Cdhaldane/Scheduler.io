import React, { useState, useEffect } from "react";
import { useDrag } from "react-dnd";
import data from "../../personnelData.json";

import "./schedule-form.css";

const ScheduleForm = (props) => {
  const [personID, setPersonID] = useState(props.personID);
  const [person, setPerson] = useState(data.personnel[personID]);
  const [day, setDay] = useState(props.selectedSlot.day);
  const [start, setStart] = useState(props.selectedSlot.hour);
  const [selectedSlot, setSelectedSlot] = useState(props.selectedSlot);
  const [selectedService, setSelectedService] = useState(props.selectedService);

  //console.log(start, day);

  // useEffect(() => {
  //   let personID = props.personID;
  //   if (personID === null) return;
  //   let person = data.personnel[personID];
  //   setPerson(person);
  //   console.log(props.selectedSlot);
  //   setDay(props.selectedSlot.day);
  //   setStart(props.selectedSlot.hour);
  // }, [props]);

  useEffect(() => {
    if (props.personID !== null) {
      setPerson(data.personnel[props.personID]);
      setDay(props.selectedSlot.day);
      setStart(props.selectedSlot.hour);
    }
  }, [props]);

  //add a handler for the service change
  const handleServiceChange = (event) => {
    setSelectedService(event.target.value);
    
  }

  const[{isDragging}, drag] = useDrag({
    type: 'service',
    item: {type:'service', id:personID, service: selectedService, start: selectedSlot.hour},
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });


  return (
    <div className="schedule-container" ref={drag}>
      <h1>Personel: {person.name}</h1>
      <div className="schedule-appointment">
        <span className="row">
          <h1>Appointment type:</h1>
            <select onChange={handleServiceChange} value={selectedService}>
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
      {/* <div className="schedule-time">
        <h1>Start {start}:00</h1>
        <h1>End {start + 2}:00</h1>
      </div> */}
    </div>
  );
};

export default ScheduleForm;
