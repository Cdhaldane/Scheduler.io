import React, { useState, useEffect } from "react";
import Sidebar from "../Components/Sidebar/Sidebar.jsx";
import Calendar from "../Components/Calendar/Calendar.jsx";
import CustomerCalendar from "../Components/Calendar/CustomerCalendar.jsx";
import ScheduleForm from "../Components/Schedule-form/Schedule-form";
import GuestBooking from "../Components/GuestBookingPage/GuestBookingPage.jsx";
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
  addPersonnelService,
  getBookings,
} from "../Database.jsx";

import "./Home.css";

const Home = ({ session, type }) => {
  const [personID, setPersonID] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [personnel, setPersonnel] = useState([]);
  const [services, setServices] = useState([]);
  const [deletedService, setDeletedService] = useState(null);
  const [addedService, setAddedService] = useState(null);
  const [personnelServices, setPersonnelServices] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedService, setSelectedService] = useState();
  const [bookings, setBookings] = useState([]);

  const adminMode = type === "admin";
  const alert = useAlert();
  const navigate = useNavigate();

  const onDrop = (item) => {
    console.log("dropped", item);
  };

  const fetchData = async () => {
    const personnel = await getPersonnel();
    if (personnel) {
      setPersonnel(personnel);
    }
    const data = await getServices();
    if (data) setServices(data);

    const bookingsData = await getBookings(personID + 1);
    if (bookingsData) setBookings(bookingsData);
  };

  useEffect(() => {
    fetchData();
  }, [personID]);

  useEffect(() => {}, [personID]);

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
        addPersonnelService(personID, res.data);
        fetchData();

        alert.showAlert("success", "Service added");
      }
    });

    setTimeout(() => {}, 1000);
  };

  const handleSelectedSlot = (day, hour, date, group) => {
    if (group) {
      let slots = [];
      for (let i = group.start; i < group.end; i++) {
        slots.push({
          day: day,
          hour: i,
          date: date,
        });
      }
      setSelectedSlot(slots);
    } else
      setSelectedSlot({
        day: day,
        hour: hour,
        date: date,
      });
  };

  const handlePersonnelServiceUpdate = async (services) => {
    const allServices = await getServices();
    const { data, error } = await addPersonnelService(personID, allServices);
    if (error) {
      alert.showAlert("error", error.message);
    } else {
      alert.showAlert("success", "Service added");
    }
  };

  const calendarProps = {
    adminMode,
    personID,
    onAddService,
    session,
    handleSelectedSlot,
    deletedService,
    addedService,
    puzzlePieces: services,
    fetchData,
    onDeleteService,
    handlePersonnelServiceUpdate,
    personnelServices,
    selectedSlot,
    bookings,
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Sidebar
        setPersonID={setPersonID}
        personID={personID}
        personnel={personnel}
      />
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
            selectedService={selectedService}
            setSelectedService={setSelectedService}
          />
        </div>
      )}
    </DndProvider>
  );
};

export default Home;
