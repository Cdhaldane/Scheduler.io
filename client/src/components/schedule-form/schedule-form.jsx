import React, { useState, useEffect } from "react";
import { useDrag } from "react-dnd";
import { useNavigate } from "react-router-dom";
import Dropdown from "../Dropdown/Dropdown";
import { useAlert } from "../Providers/Alert";

import "./Schedule-form.css";

const ScheduleForm = ({ personID, selectedSlot, personnel, session }) => {
  const [person, setPerson] = useState(personnel[personID]);
  const [day, setDay] = useState(selectedSlot.day);
  const [start, setStart] = useState(selectedSlot.hour);
  const [selectedService, setSelectedService] = useState();
  const [duration, setDuration] = useState(2);
  const [price, setPrice] = useState(20);

  const navigate = useNavigate();
  const [typing, setTyping] = useState(false);
  const alert = useAlert();

  console.log(selectedSlot);

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
      }, 1000); // Duration should match the CSS animation

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

  const handleBookAppointment = () => {
    if (!selectedService)
      return alert.showAlert("error", "Please select a service");
    if (!day) return alert.showAlert("error", "Please select a day");

    const appointment = {
      personnel: person,
      day: day,
      start: start,
      end: start + 2,
      service: selectedService,
      duration: duration,
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
                  {selectedService || "Select Service"}
                </button>
              }
              options={["Haircut", "Shave", "Haircut and Shave"]}
              onClick={(service) => handleServiceChange(service)}
            />
            <span>
              <h1>Duration:</h1>
              <h2> {duration} hours</h2>
            </span>
            <span>
              <h1>Price:</h1>
              <h2> ${price}</h2>
            </span>
          </div>
          <div className="schedule-time">
            <p>
              Your appointment is on <var>{day}</var>
            </p>
            <p>
              Starting at{" "}
              <var>
                {start}:00{start <= 12 ? "AM" : "PM"}
              </var>{" "}
            </p>
            <p>
              Ending at{" "}
              <var>
                {start + 2}:00 {start + 2 <= 12 ? "AM" : "PM"}
              </var>
            </p>
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
