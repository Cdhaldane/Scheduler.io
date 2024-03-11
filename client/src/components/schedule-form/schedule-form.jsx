import React, { useState, useEffect } from "react";
import { useDrag } from "react-dnd";
import { useNavigate } from "react-router-dom";
import Dropdown from "../Dropdown/Dropdown";
import { useAlert } from "../Providers/Alert";

import "./Schedule-form.css";

const ScheduleForm = ({
  personID,
  selectedSlot,
  personnel,
  session,
  selectedService,
  setSelectedService,
}) => {
  const [person, setPerson] = useState(personnel[personID]);
  const [day, setDay] = useState(selectedSlot.day);
  const [start, setStart] = useState(selectedSlot.hour);

  console.log(selectedService);

  const [price, setPrice] = useState(20);

  const navigate = useNavigate();
  const [typing, setTyping] = useState(false);
  const alert = useAlert();

  useEffect(() => {
    if (personID !== null) {
      setPerson(personnel[personID]);
      setDay(selectedSlot.day);
      setStart(selectedSlot.hour);
    }
  }, [personID, personnel, selectedSlot]);

  useEffect(() => {
    if (person?.first_name) {
      setTyping(true);

      const timer = setTimeout(() => {
        setTyping(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [person?.first_name]);

  const handleServiceChange = (serviceName) => {
    let service = person.services.find(
      (service) => service.name === serviceName
    );

    setSelectedService(service);
  };

  const [{ isDragging }, drag] = useDrag({
    type: "service",
    item: {
      type: "service",
      id: personID,
      service: selectedService?.name,
      start: selectedSlot.hour,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const handleBookAppointment = () => {
    if (!selectedService)
      return alert.showAlert("error", "Please select a service");
    if (!day) return alert.showAlert("error", "Please select a day");

    const appointment = {
      personnel: person,
      day: day,
      start: start,
      end: start + 2,
      service: selectedService?.name,
      duration: selectedService?.duration,
      price: price,
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

  return (
    <div className="main-right schedule-container" ref={drag}>
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
                  {selectedService?.name || "Select Service"}
                </button>
              }
              options={person?.services?.map((service) => service.name) || []}
              onClick={(service) => handleServiceChange(service)}
            />
            <span>
              <h1>Duration:</h1>
              <h2> {selectedService?.duration} hours</h2>
            </span>
            <span>
              <h1>Price:</h1>
              <h2> ${selectedService?.price}</h2>
            </span>
          </div>
          <div className="schedule-time">
            <span>
              <h1>Date:</h1>
              <h2> {day} hours</h2>
            </span>
            <span>
              <h1>Start:</h1>
              <h2> {start}:00</h2>
            </span>
            <span>
              <h1>End:</h1>
              <h2> {start + selectedService?.duration}:00</h2>
            </span>
          </div>
        </div>
      </div>
      <footer>
        <button className="book-appointment" onClick={handleBookAppointment}>
          Book Appointment
        </button>
      </footer>
    </div>
  );
};

export default ScheduleForm;
