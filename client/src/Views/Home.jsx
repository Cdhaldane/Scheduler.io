import React, { useState, useEffect } from "react";
import Sidebar from "../Components/Sidebar/Sidebar.jsx";
import Calendar from "../Components/Calendar/Calendar.jsx";
import ScheduleForm from "../Components/Schedule-form/Schedule-form.jsx";
//import GuestBooking from "../Components/GuestBookingPage/GuestBookingPage.jsx";
import { useNavigate } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import PuzzleContainer from "../Components/Puzzle/PuzzleContainer";
import { useAlert } from "../Components/Providers/Alert.jsx";
import {
  supabase,
  getPersonnel,
  getServices,
  deleteService,
  addService,
} from "../Database.jsx";

import "./Home.css";

const Home = ({ session, type }) => {
  const [personID, setPersonID] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(0);
  const [personnel, setPersonnel] = useState([]);
  const [services, setServices] = useState([]);
  const [deletedService, setDeletedService] = useState(null);
  const [addedService, setAddedService] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const adminMode = type === "admin";
  const alert = useAlert();
  const navigate = useNavigate();

  const onDrop = (item) => {
    console.log("dropped", item);
  };

  const fetchData = async () => {
    const personnel = await getPersonnel();
    if (personnel) setPersonnel(personnel);

    const data = await getServices();
    if (data) setServices(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onDeleteService = async (item) => {
    setDeletedService(item);
    setTimeout(() => {
      deleteService(item.id).then((res) => {
        if (res.error) {
          alert.showAlert("error", res.error.message);
        } else {
          alert.showAlert("warning", "Service deleted");
        }
      });
      fetchData();
    }, 500);
  };

  const onAddService = async (service) => {
    await addService(service).then((res) => {
      if (res.error) {
        alert.showAlert("error", res.error.message);
      } else {
        setAddedService(res.data);
        fetchData();

        alert.showAlert("success", "Service added");
      }
    });

    setTimeout(() => {}, 1000);
  };

  const handleSelectedSlot = (slot) => {
    setSelectedSlot(slot);
  };

  const calendarProps = {
    personID,
    onAddService,
    session,
    handleSelectedSlot,
    deletedService,
    addedService,
    puzzlePieces: services,
    fetchData,
    onDeleteService,
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Sidebar
        setPersonID={setPersonID}
        personID={personID}
        personnel={personnel}
      />

      <button className="admin-button" onClick={() => navigate("/admin")}>
        ADMIN
      </button>
      <button className="employee-button" onClick={() => navigate("/employee")}>
        EMPLOYEE
      </button>

      {adminMode ? (
        <PuzzleContainer
          puzzlePieces={services}
          onDrop={onDrop}
          {...calendarProps}
        />
      ) : (
        <div className="main-body">
          <Calendar {...calendarProps} />
          <ScheduleForm
            personID={personID}
            selectedSlot={selectedSlot}
            personnel={personnel}
            session={session}
          />
        </div>
      )}
    </DndProvider>
  );
};

export default Home;
