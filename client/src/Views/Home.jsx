import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  getBookings,
  getOrganization,
  updatePersonnelService,
  addPersonnelService,
  deletePersonnelService,
  deleteallPersonnelService,
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
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState();
  const [bookings, setBookings] = useState([]);
  const [personnelSlots, setPersonnelSlots] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const timeFrame = useSelector((state) => state.timeFrame);
  const [org, setOrg] = useState(organization);
  const isMobile = useMemo(() => window.innerWidth <= 768, []);
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
  const fetchData = useCallback(async () => {
    try {
      // deleteallPersonnelService(19, []);
      setLoading(true);
      const orgData = await getOrganization(
        organization?.org_id ||
          session?.user?.user_metadata?.organization?.org_id
      );
      if (!orgData) {
        navigate("/404");
        return;
      }
      setOrg(orgData);

      const personnelData = await getPersonnel(orgData.id);
      setPersonnels(personnelData || []);
      if (selectedPersonnel) {
        const bookingsData = await getBookings(selectedPersonnel.id);
        setBookings(bookingsData || []);
        setPersonnelSlots(selectedPersonnel.services || []);
        console.log("personnelSlots", selectedPersonnel.services);
      }

      const servicesData = await getServices(orgData.id);
      setServices(servicesData || []);
    } catch (err) {
      console.error("Error fetching data:", err);
      alert.showAlert("error", "Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [organization, session, selectedPersonnel, navigate]);

  useEffect(() => {
    fetchData();
    personnelState(personnel);
  }, [fetchData]);

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
  const onDeleteService = useCallback(
    async (service) => {
      try {
        const response = await deleteService(service.id);
        if (response.error) {
          alert.showAlert("error", response.error.message);
        } else {
          alert.showAlert("warning", "Service deleted");
          fetchData();
        }
      } catch (err) {
        console.error("Error deleting service:", err);
        alert.showAlert("error", "Failed to delete service. Please try again.");
      }
    },
    [fetchData, alert]
  );

  //Handler for adding a new service
  const onAddService = useCallback(
    async (service) => {
      try {
        const response = await addService(service);
        if (response.error) {
          alert.showAlert("error", response.error.message);
        } else {
          alert.showAlert("success", "Service added");
          fetchData();
        }
      } catch (err) {
        console.error("Error adding service:", err);
        alert.showAlert("error", "Failed to add service. Please try again.");
      }
    },
    [fetchData, alert]
  );

  const onAddPersonnelService = useCallback(
    async (service) => {
      try {
        const response = await addPersonnelService(
          selectedPersonnel.id,
          service
        );
        if (response.error) {
          alert.showAlert("error", response.error.message);
        } else {
          alert.showAlert("success", "Service added");
          dispatch(setPersonnel(response.data[0]));
          fetchData();
        }
      } catch (err) {
        console.error("Error adding service:", err);
        alert.showAlert("error", "Failed to add service. Please try again.");
      }
    },
    [fetchData, alert]
  );

  const onDeletePersonnelService = useCallback(
    async (serviceId) => {
      try {
        const response = await deletePersonnelService(
          selectedPersonnel.id,
          serviceId
        );
        if (response.error) {
          alert.showAlert("error", response.error.message);
        } else {
          alert.showAlert("warning", "Service deleted");
          dispatch(setPersonnel(response.data[0]));
          setPersonnelSlots(response.data[0].services);
          setSelectedSlot(null);
          fetchData();
        }
      } catch (err) {
        console.error("Error deleting service:", err);
        alert.showAlert("error", "Failed to delete service. Please try again.");
      }
    },
    [fetchData, alert]
  );

  //Handler for updating a personnel service
  const onUpdatePersonnelService = useCallback(
    async (serviceId, updatedService) => {
      try {
        const response = await updatePersonnelService(
          selectedPersonnel.id,
          serviceId,
          updatedService
        );
        if (response.error) {
          alert.showAlert("error", response.error.message);
        } else {
          alert.showAlert("success", "Service updated");
          dispatch(setPersonnel(response.data[0]));
          setPersonnelSlots(response.data[0].services);
          fetchData();
        }
      } catch (err) {
        console.error("Error updating service:", err);
        alert.showAlert("error", "Failed to update service. Please try again.");
      }
    },
    [fetchData, alert]
  );

  //Handler for updating the selected slot
  const handleSelectedSlot = useCallback((day, hour, date, group) => {
    if (group) {
      const slots = Array.from({ length: group.end - group.start }, (_, i) => ({
        day,
        hour: group.start + i,
        date,
      }));
      setSelectedSlot(slots);
    } else {
      setSelectedSlot({ day, hour, date });
    }
  }, []);

  //Props for the calendar component
  const calendarProps = useMemo(
    () => ({
      adminMode,
      selectedPersonnel,
      session,
      handleSelectedSlot,
      puzzlePieces: services,
      bookings,
      timeFrame,
      organization: org,
      personnel,
      personnelSlots,
      onDeleteService: onDeleteService,
      onAddService: onAddService,
      onAddPersonnelService: onAddPersonnelService,
      onDeletePersonnelService: onDeletePersonnelService,
      onUpdatePersonnelService: onUpdatePersonnelService,
      selectedSlot,
      type,
    }),
    [
      adminMode,
      selectedPersonnel,
      session,
      handleSelectedSlot,
      services,
      bookings,
      timeFrame,
      org,
      personnel,
      personnelSlots,
      onDeleteService,
      onAddService,
      onAddPersonnelService,
      onDeletePersonnelService,
      onUpdatePersonnelService,
      selectedSlot,
      type,
    ]
  );

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
    const displayItem = Array.isArray(item.item)
      ? {
          ...item.item[0], // Use the first item as a base
          name: item.item.map((i) => i.name).join(", "), // Combine names
        }
      : item.item || item; // Fallback to `item` if `item.item` is not present
    return (
      <div className="item-list__item" style={style}>
        <PuzzlePiece piece={displayItem} />
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

  useEffect(() => {
    setAvailableServices([]);
    // Find all available services for the selected personnel
    if (selectedSlot) {
      personnelSlots.forEach((slot) => {
        if (
          selectedSlot.day === slot.day &&
          selectedSlot.hour >= slot.start &&
          selectedSlot.hour < slot.end
        ) {
          const slotServices = slot.item.map((service) => {
            return service;
          });
          setAvailableServices(slotServices);
        }
      });
    }
  }, [selectedSlot]);

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
                services={availableServices}
                organization={org}
              />
            </DynamicDiv>
          )}
          {type === "admin" && (
            <>
              <MyPreview />
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
