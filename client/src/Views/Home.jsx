import React, { useState } from "react";
import Sidebar from "../Components/Sidebar/Sidebar";
import Calendar from "../Components/Calendar/Calendar";
import ScheduleForm from "../Components/Schedule-form/Schedule-form";
import GuestBooking from "../Components/GuestBookingPage/GuestBookingPage.jsx";
import { useNavigate } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import "./Home.css";

const Home = (props) => {
  const [personID, setPersonID] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(props.selectedSlot);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleSelectedSlot = (e) => {
    setSelectedSlot({ day: e.day, start:e.start,end:e.end});
  };
  
  return (
    <DndProvider backend={HTML5Backend}>
      <Sidebar setPersonID={setPersonID} />
      {/* <div className="main-header">
        <h1 onClick={() => navigate("./admin")}>Scheduler.io {personID}</h1>
      </div> */}
      <div className="main">
        <Calendar
          personID={personID}
          handleSelectedSlot={(e) => handleSelectedSlot(e)}
        />

        {/*Guest booking modal pop up*/}
        <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
          style={{ display: showModal ? "block" : "none" }}
        >
          <div className="modal-dialog  modal-dialog-scrollable">
            <div className="modal-content">
              <button
                type="button"
                className="close"
                onClick={() => setShowModal(false)}
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
              <div className="modal-body">
                <GuestBooking />
              </div>
              <div className="modal-footer"></div>
            </div>
          </div>
        </div>
        {/*End modal*/}
        <ScheduleForm personID={personID} selectedSlot={selectedSlot} />
      </div>
    </DndProvider>
  );
};

export default Home;
