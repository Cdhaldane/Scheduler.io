import React, { useState, useEffect } from "react";
import {
  supabase,
  getBookingsByClientEmail,
  getServiceFromId,
  updateUser,
} from "../Database";
import { useNavigate } from "react-router-dom";
import Spinner from "../DevComponents/Spinner/Spinner";
import AppointmentsModal from "../Components/AppointmentsModal/AppointmentsModal";
import "./Styles/Profile.css";

const UserProfile = ({ session }) => {
  const [appointments, setAppointments] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const organization = session?.user.user_metadata.organization;

  const fetchAppointments = async () => {
    const { data, error } = await getBookingsByClientEmail(session.user.email);
    if (error) {
      console.log("Error fetching appointments:", error);
    }
    if (data) {
      updateAppointments(data);
    }
  };

  useEffect(() => {
    if (session) {
      setLoading(true);
      fetchAppointments();
    }
  }, [session, selectedFilter]);

  const updateAppointments = async (appointments) => {
    let updatedAppointments = await Promise.all(
      appointments.map(async (appointment) => {
        const service = await getServiceFromId(appointment.service_id);
        return { ...appointment, service: service };
      })
    );

    if (selectedFilter !== "all") {
      const filteredAppointments = updatedAppointments.filter(
        (appointment) => appointment.status === selectedFilter
      );
      updatedAppointments = filteredAppointments;
    }

    const sortedAppointments = updatedAppointments.sort(
      (a, b) => new Date(a.booking_date) - new Date(b.booking_date)
    );

    setLoading(false);
    setAppointments(sortedAppointments);
  };

  return (
    <div className="user-profile">
      {session && (
        <div className="card">
          <header className="card-header">
            <div className="card-title">
              <img
                src={session.user.user_metadata.avatar_url}
                alt=""
                referrerPolicy="no-referrer"
              />
              <div className="heading-box">
                <h1>{session.user.user_metadata.full_name}</h1>
                <h3>{session.user.email}</h3>
              </div>
            </div>
          </header>
          <main className="card-main">
            <div
              className="activity"
              onClick={() => navigate("/create-organization")}
            >
              <i className="fa-solid fa-house"></i>
              <span className="activity-name">Organization</span>
              <span className="index">
                {organization ? organization.name : "None"}
              </span>
            </div>
            <div className="activity special">
              <i className="fa-solid fa-clock"></i>
              <span className="activity-name">Activity</span>
              <span className="index">
                {session.user.updated_at?.split("T")[0]}
              </span>
            </div>
            <div className="activity" onClick={() => setIsOpen(!isOpen)}>
              <i className="fa-solid fa-calendar"></i>
              <span className="activity-name">Appointments</span>
              <span className="index">
                {appointments && appointments.length}
              </span>
            </div>
          </main>
        </div>
      )}
      <AppointmentsModal
        isOpen={isOpen}
        onClose={() => setIsOpen(!isOpen)}
        session={session}
      />
    </div>
  );
};

export default UserProfile;
