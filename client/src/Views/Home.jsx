import React, { useState } from "react";
import Sidebar from "../Components/Sidebar/Sidebar";
import Calendar from "../Components/Calendar/Calendar";
import ScheduleForm from "../Components/Schedule-form/Schedule-form";
import { useNavigate } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const Home = () => {
  const [personID, setPersonID] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(0);
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
        <Calendar
          personID={personID}
          handleSelectedSlot={(e) => handleSelectedSlot(e)}
        />
        <ScheduleForm personID={personID} selectedSlot={selectedSlot} />
      </div>
    </DndProvider>
  );
};

export default Home;
