import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../Components/Sidebar/Sidebar.jsx";
import Calendar from "../Components/Calendar/Calendar.jsx";
import ScheduleForm from "../Components/Schedule-form/Schedule-form";
import EmployeeSchedule from "../Components/Employee/EmployeeSchedule";
import PuzzleContainer from "../Components/Puzzle/PuzzleContainer";
import Spinner from "../DevComponents/Spinner/Spinner.jsx";
import _, { set } from "lodash";

import { useNavigate, useParams } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { useAlert } from "../DevComponents/Providers/Alert.jsx";
import DragLayer from "../Components/Puzzle/Dnd/DragLayer.js";
import { usePreview } from "react-dnd-preview";
import PuzzlePiece from "../Components/Puzzle/PuzzlePiece.jsx";
import DynamicDiv from "../Components/DynamicDiv/DynamicDiv.jsx";
import { useSelector, useDispatch } from "react-redux";
import { setPersonnel } from "../Store.js";

import {
  supabase,
  getPersonnel,
  getServices,
  deleteService,
  addService,
  addPersonnelService,
  getBookings,
  getOrganization,
} from "../Database.jsx";

import "./Styles/Home.css";

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
  const selectedPersonnel = useSelector(
    (state) => state.selectedPersonnel.value
  );
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [personnel, setPersonnels] = useState([]);
  const [services, setServices] = useState([]);
  const [deletedService, setDeletedService] = useState(null);
  const [addedService, setAddedService] = useState(null);
  const [personnelServices, setPersonnelServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState();
  const [bookings, setBookings] = useState([]);
  const [personnelSlots, setPersonnelSlots] = useState([]);
  const timeFrame = useSelector((state) => state.timeFrame);
  const [org, setOrg] = useState(organization);
  const isMobile = window.innerWidth <= 768;
  const url = useParams();

  const adminMode = type === "admin";
  const alert = useAlert();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //Handlers for service-related actions
  const onDrop = (item) => {
    console.log("dropped", item);
  };

  //Fetch personnel and services data
  const fetchData = async () => {
    const orgData = await getOrganization(
      organization.org_id || session?.user.user_metadata.organization.org_id
    );
    if (orgData) {
      setOrg(orgData);
      const personnelData = await getPersonnel(orgData.id);
      setPersonnels(personnelData || []);
      if (selectedPersonnel) {
        const bookingsData = await getBookings(selectedPersonnel?.id);
        setBookings(bookingsData || []);
        setPersonnelSlots(selectedPersonnel.services || []);
      }

      const servicesData = await getServices(orgData.id);
      if (servicesData) setServices(servicesData);
    } else navigate("/404");
  };

  //Effect hook for fetching personnel and services data
  useEffect(() => {
    setLoading(true);
    fetchData().finally(() => {
      personnelState(personnel);
      setLoading(false);
    });
  }, [session, organization, selectedPersonnel, type]);

  const personnelState = async (personnel) => {
    if (!selectedPersonnel) {
      const orgData = await getOrganization(
        organization.org_id || session?.user.user_metadata.organization.org_id
      );
      if (orgData) {
        const personnelData = await getPersonnel(orgData.id);

        if (type == "employee") {
          const hashPath = window.location.hash;
          const segments = hashPath.split("/");
          const employeeId = parseInt(segments[segments.length - 1]);

          const employee = personnelData.find((p) => p.id === employeeId);
          console.log("employee", employee);

          if (employee) {
            dispatch(setPersonnel(employee));
          }
        } else {
          dispatch(setPersonnel(personnelData[0]));
        }
      }
    }
  };

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
    console.log("service", service);
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

  const onAddPersonnelService = async (service) => {
    try {
      // Add the new service to the selected personnel's existing services
      const updatedServices = [...(selectedPersonnel.services || []), service];

      // Update the database with the new list of services
      const { data, error } = await addPersonnelService(
        selectedPersonnel.id,
        updatedServices
      );

      if (error) {
        alert.showAlert("error", error.message);
        return;
      }

      // Update the local personnel state with the newly added service
      const updatedPersonnel = {
        ...selectedPersonnel,
        services: updatedServices,
      };

      dispatch(setPersonnel(updatedPersonnel)); // Update Redux state
      setPersonnelServices(updatedServices); // Update local services state
      alert.showAlert("success", "Service added successfully");
    } catch (err) {
      console.error("Error adding personnel service:", err);
      alert.showAlert("error", "Failed to add service. Please try again.");
    }
  };

  //Handler for updating the selected slot
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

  //Handler for updating personnel services
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
    session,
    handleSelectedSlot,
    deletedService,
    addedService,
    puzzlePieces: services,
    fetchData,
    onDeleteService,
    onAddPersonnelService,
    handlePersonnelServiceUpdate,
    personnelServices,
    selectedSlot,
    bookings,
    timeFrame,
    organization: org,
    type,
    homeLoading: loading,
    personnel,
    personnelSlots,
  };

  // allow vertical scrolling
  const options = {
    /*scrollAngleRanges: [
      { start: 30, end: 150 },
      { start: 210, end: 330 },
    ],*/
  };

  const MyPreview = () => {
    const preview = usePreview();
    if (!preview.display) {
      return null;
    }
    const { itemType, item, style } = preview;
    return (
      <div className="item-list__item" style={style}>
        <PuzzlePiece piece={item} />
      </div>
    );
  };

  //Render the main interface
  // if (loading)
  //   return (
  //     <div className="app-main">
  //       <Spinner />
  //     </div>
  //   );

  const backend = isMobile ? TouchBackend : HTML5Backend;
  return (
    <div className="app-main">
      <DndProvider
        key="TOUCH"
        backend={backend}
        options={{ enableMouseEvents: true }}
      >
        <Sidebar
          personnel={personnel}
          adminMode={adminMode}
          organization={org}
          services={services}
        />
        <div className="main-body">
          <Calendar {...calendarProps} />

          {type === "employee" && (
            <DynamicDiv
              sideIcon="fas fa-calendar-check"
              title="My Bookings"
              color="var(--ash)"
            >
              <EmployeeSchedule bookings={bookings} />
            </DynamicDiv>
          )}
          {type === "customer" && (
            <DynamicDiv
              sideIcon="fas fa-calendar-check"
              title="Appointment"
              color="var(--primary)"
            >
              <ScheduleForm
                selectedPersonnel={selectedPersonnel}
                selectedSlot={selectedSlot}
                personnel={personnel}
                session={session}
                selectedService={selectedService}
                setSelectedService={setSelectedService}
                services={services}
                organization={org}
              />
            </DynamicDiv>
          )}
          {type === "admin" && (
            <>
              {/* <MyPreview /> */}
              <DynamicDiv
                title="Services"
                sideIcon="fas fa-puzzle-piece"
                color="var(--bg-primary)"
                backgroundColor="var(--primary"
              >
                <PuzzleContainer
                  puzzlePieces={services}
                  onDrop={onDrop}
                  onAddService={onAddService}
                  {...calendarProps}
                />
              </DynamicDiv>
            </>
          )}
        </div>
      </DndProvider>
    </div>
  );
};

export default Home;
