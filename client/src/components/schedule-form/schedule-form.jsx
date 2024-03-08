// import React, { useState, useEffect } from "react";
// import { useDrag } from "react-dnd";
// import data from "../../personnelData.json";
// import { useNavigate } from "react-router-dom";
// import Dropdown from "../Dropdown/Dropdown";

// import "./Schedule-form.css";


// const ScheduleForm = (props) => {
//   const [personID, setPersonID] = useState(props.personID);
//   const [person, setPerson] = useState(data.personnel[personID]);
//   const [day, setDay] = useState(props.selectedSlot?.day);
//   const [start, setStart] = useState(props.selectedSlot?.start);
//   const [end, setEnd] = useState(props.selectedSlot?.end);
//   const navigate = useNavigate();
//   const [selectedSlot, setSelectedSlot] = useState(null);
//   const [selectedService, setSelectedService] = useState(props.selectedService);
  
//   const [currentAppointment, setCurrentAppointment] = useState(null);


//   //add a handler for the service change
//   const handleServiceChange = (service) => {
//     console.log(service);
//     setSelectedService(service);
//   };

//   const [{ isDragging }, drag] = useDrag({
//     type: "service",
//     item: {
//       type: "service",
//       id: personID,
//       service: selectedService,
//       slot: selectedSlot,
//     },
//     collect: (monitor) => ({
//       isDragging: monitor.isDragging(),
//       slotUpdated: monitor.didDrop(),
//     }),
//   });

  // useEffect(() => {
  //   setDay(props.selectedSlot?.day);
  //   setStart(props.selectedSlot?.start);
  //   setEnd(props.selectedSlot?.end);
  // }, [props.selectedSlot]);

//   // const useScheduleGrid = (initialDay = "Monday", initialStartHour = 3) => {
//   //   const [day, setDay] = useState(initialDay);
//   //   const [startHour, setStartHour] = useState(initialStartHour);

//   //   const changeDay = (newDay) => setDay(newDay);
//   //   const changeStartHour = (hour) => setStartHour(hour);

//   //   const ScheduleGridComponent = () => (
//       // <div className="schedule-time">
//       //   <ul className="schedule-labels">
//       //     <li>
//       //       <h1>Day:</h1>
//       //     </li>
//       //     <li>
//       //       <h1>Start:</h1>
//       //     </li>
//       //     <li>
//       //       <h1>End:</h1>
//       //     </li>
//       //   </ul>
//       //   <ul className="schedule-values">
//       //     <li>
//       //       <h2>{gridDay}</h2>
//       //     </li>
//       //     <li>
//       //       <h2>{`${gridStartHour}:00`}</h2>
//       //     </li>
//       //     <li>
//       //       <h2>{`${gridStartHour + 2}:00`}</h2>
//       //     </li>
//       //   </ul>
//       // </div>
//   //   );

//   //   return { ScheduleGridComponent, changeDay, changeStartHour };
//   // };

//   return (
//     <div className="schedule-container" ref={drag}>
//       <div className="body">
//         <h1>APPOINTMENT</h1>

//         <div className="schedule-appointment">
//           <div className="schedule-header">
//             PERSONEL: <h2>{person.name}</h2>
//           </div>

//           {/* <select onChange={handleServiceChange} value={selectedService}>
//             <option value="haircut">Haircut</option>
//             <option value="shave">Shave</option>
//             <option value="haircut and shave">Haircut and Shave</option>
//           </select> */}

//           <div className="schedule-appointment-info">
//             <Dropdown
//               label={selectedService || "Service"}
//               options={["Haircut", "Shave", "Haircut and Shave"]}
//               onClick={(service) => handleServiceChange(service)}
//             />
//             <span>
//               <h1>Duration:</h1>
//               <h2> 2 hours</h2>
//             </span>
//             <span>
//               <h1>Price:</h1>
//               <h2> $20</h2>
//             </span>
//           </div>
//           <div className="schedule-time">
//         <ul className="schedule-labels">
//           <li>
//             <h1>Day:</h1>
//           </li>
//           <li>
//             <h1>Start:</h1>
//           </li>
//           <li>
//             <h1>End:</h1>
//           </li>
//         </ul>
//         <ul className="schedule-values">
//           <li>
//             <h2>{day}</h2>
//           </li>
//           <li>
//             <h2>{start}</h2>
//           </li>
//           <li>
//           <h2>{end}</h2>
//           </li>
//         </ul>
//       </div>
//         </div>
//       </div>
//       <footer>
//         <button
//           className="book-appointment"
//           onClick={() => navigate("/booking")}
//         >
//           Book Appointment
//         </button>
//       </footer>
//     </div>
//   );
// };

// export default ScheduleForm;

import React, { useState, useEffect } from "react";
import { useDrag } from "react-dnd";
import data from "../../personnelData.json";
import { useNavigate } from "react-router-dom";
import Dropdown from "../Dropdown/Dropdown";

import "./Schedule-form.css";


const ScheduleForm = ({ personID, selectedSlot, personnel, selectedService }) => {
  const personnelData = personnel || data.personnel;
  const slot = selectedSlot || {};
  const [person, setPerson] = useState(personnelData[personID]);
  const [day, setDay] = useState(slot.day); 
  const [start, setStart] = useState(slot.start); 
  const [end, setEnd] = useState(slot.end || start); 
  const [localSelectedService, setSelectedService] = useState(selectedService); 
  
  const navigate = useNavigate();

  const [typing, setTyping] = useState(false);


  useEffect(() => {
    setPerson(personnelData[personID]);
    setDay(slot.day);
    setStart(slot.start);
    setEnd(slot.end);
  }, [personID, personnelData, slot]);

  useEffect(() => {
    if (person?.first_name) {
      setTyping(true);
      const timer = setTimeout(() => {
        setTyping(false);
      }, 2000); // Match this duration with CSS animation duration
      return () => clearTimeout(timer);
    }
  }, [person?.first_name]);


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
      slot: selectedSlot,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      slotUpdated: monitor.didDrop(),
    }),
  });

  useEffect(() => {
    setDay(selectedSlot?.day);
    setStart(selectedSlot?.start);
    setEnd(selectedSlot?.end);
  }, [selectedSlot]);

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
            <h2>{start}</h2>
          </li>
          <li>
          <h2>{end}</h2>
          </li>
        </ul>
      </div>
        </div>
      </div>
      <footer>
        <button
          className="book-appointment"
          onClick={() => navigate("/booking")}
        >
          Book Appointment
        </button>
      </footer>
    </div>
  );
};

export default ScheduleForm;