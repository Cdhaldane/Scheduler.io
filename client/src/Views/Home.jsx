import React, { useState, useEffect } from "react";
import Sidebar from "../Components/Sidebar/Sidebar.jsx";
import Calendar from "../Components/Calendar/Calendar.jsx";
import ScheduleForm from "../Components/Schedule-form/Schedule-form";
import GuestBooking from "../Components/GuestBookingPage/GuestBookingPage.jsx";
import { useNavigate } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { supabase, getPersonnel } from "../Database.jsx";

import "./Home.css";

const Home = () => {
  const [personID, setPersonID] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [personnel, setPersonnel] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getPersonnel();
      setPersonnel(data);
    };
    fetchData();
  }, []);

  const handleSelectedSlot = (e) => {
    setSelectedSlot({ day: e.day, hour: e.hour });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Sidebar
        setPersonID={setPersonID}
        personID={personID}
        personnel={personnel}
      />
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
        <ScheduleForm
          personID={personID}
          selectedSlot={selectedSlot}
          personnel={personnel}
        />
      </div>
    </DndProvider>
  );
};

export default Home;
