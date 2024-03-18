import React, { useState, useEffect } from "react";
import Sidebar from "../Components/Sidebar/Sidebar.jsx";
import Calendar from "../Components/Calendar/Calendar.jsx";
import ScheduleForm from "../Components/Schedule-form/Schedule-form";
import EmployeeSchedule from "../Components/Employee/EmployeeSchedule";
import PuzzleContainer from "../Components/Puzzle/PuzzleContainer";
import Spinner from "../Components/Spinner/Spinner.jsx";

import { useNavigate } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useAlert } from "../Components/Providers/Alert.jsx";
import { useSelector } from "react-redux";

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

/**
 * Home Component
 *
 * Purpose:
 * - The Home component serves as the main interface for customer, admin and employee users.
 * - It includes a sidebar for selecting personnel, a calendar for scheduling, and forms for managing services.
 *
 * Inputs:
 * - session: The current user session object.
 * - type: A string indicating the type of user ("admin" or "employee" or "customer" or "null").
 *
 * Outputs:
 * - JSX for rendering the main interface with the appropriate components based on the user type.
 */

const Home = ({ session, type, organization }) => {
  const [selectedPersonnel, setSelectedPersonnel] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [personnel, setPersonnel] = useState([]);
  const [services, setServices] = useState([]);
  const [deletedService, setDeletedService] = useState(null);
  const [addedService, setAddedService] = useState(null);
  const [personnelServices, setPersonnelServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState();
  const [bookings, setBookings] = useState([]);
  const timeFrame = useSelector((state) => state.timeFrame);
  const isMobile = window.innerWidth < 768;

  const adminMode = type === "admin";
  const alert = useAlert();
  const navigate = useNavigate();

  //Handlers for service-related actions
  const onDrop = (item) => {
    console.log("dropped", item);
  };

  //Fetch personnel and services data
  const fetchData = async () => {
    const personnel = await getPersonnel();

    if (personnel) {
      setPersonnel(personnel);
      if (selectedPersonnel === null) setSelectedPersonnel(personnel[0]);
      const bookingsData = await getBookings(selectedPersonnel?.id);
      if (bookingsData) setBookings(bookingsData);
    }

    const data = await getServices();
    if (data) setServices(data);
  };

  //Effect hook for fetching personnel and services data
  useEffect(() => {
    fetchData().finally(() => setLoading(false));
    setSelectedSlot(null);
  }, [selectedPersonnel]);

  //Handlers for service-related actions
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

  //Handler for adding a new service
  const onAddService = async (service) => {
    await addService(service).then((res) => {
      if (res.error) {
        alert.showAlert("error", res.error.message);
      } else {
        setAddedService(res.data);
        addPersonnelService(selectedPersonnel.id, res.data);
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
    const { data, error } = await addPersonnelService(
      selectedPersonnel.id,
      allServices
    );
    if (error) {
      alert.showAlert("error", error.message);
    } else {
      alert.showAlert("success", "Service added");
    }
  };

  //Props for the calendar component
  const calendarProps = {
    adminMode,
    selectedPersonnel,
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
    timeFrame,
    organization,
  };

  //Render the main interface
  if (loading)
    return (
      <div>
        <Spinner />
      </div>
    );
  return (
    <DndProvider backend={HTML5Backend}>
      <Sidebar
        setSelectedPersonnel={setSelectedPersonnel}
        selectedPersonnel={selectedPersonnel}
        personnel={personnel}
        adminMode={adminMode}
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
          {type === "employee" ? (
            <EmployeeSchedule bookings={bookings} />
          ) : (
            <ScheduleForm
              selectedPersonnel={selectedPersonnel}
              selectedSlot={selectedSlot}
              personnel={personnel}
              session={session}
              selectedService={selectedService}
              setSelectedService={setSelectedService}
              services={services}
            />
          )}
        </div>
      )}
    </DndProvider>
  );
};

export default Home;
