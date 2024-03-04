import React, { useState } from "react";
import Sidebar from "../components/sidebar/sidebar";
import Calendar from "../components/calendar/calendar";
import ScheduleForm from "../components/schedule-form/schedule-form";
import GuestBooking from "../components/Guest/GuestBookingPage/GuestBookingPage"
import { useNavigate } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import "./Home.css";


const Home = () => {
  const [personID, setPersonID] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleSelectedSlot = (e) => {
    setSelectedSlot({ day: e.day, hour: e.hour });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Sidebar setPersonID={setPersonID} />
      {/* <div className="main-header">
        <h1 onClick={() => navigate("./admin")}>Scheduler.io {personID}</h1>
      </div> */}
      <div className="main">
        <div className="center">
        <Calendar
          personID={personID}
          handleSelectedSlot={(e) => handleSelectedSlot(e)}
        />


        <button class="book-appointment" onClick={() => setShowModal(true)}>Book Guest Appointment</button>
      {/*Guest booking modal pop up*/}
      <div class="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: showModal ? 'block' : 'none' }}>
        <div className="modal-dialog  modal-dialog-scrollable">
          <div className="modal-content">
          <button type="button" className="close" onClick={() => setShowModal(false)} aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
          <div className="modal-body">
              <GuestBooking/>
          </div>
          <div className="modal-footer">
          </div>
        </div>
      </div>
      </div>
      {/*End modal*/}
      
        </div>
        <div className="right">
        <ScheduleForm personID={personID} selectedSlot={selectedSlot} />
        </div>
      </div>
    </DndProvider>
  );
};

export default Home;
