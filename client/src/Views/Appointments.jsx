import React, { useState, useEffect } from "react";
import {
  supabase,
  getBookingsByClientEmail,
  getServiceFromId,
  updateUser,
} from "../Database";
import Modal from "../DevComponents/Modal/Modal";
import { useNavigate } from "react-router-dom";
import Spinner from "../Components/Spinner/Spinner";
import "./Styles/Appointments.css";

/**
 * UserProfile Component
 *
 * Purpose:
 * - The UserProfile component provides a user interface for displaying the user's profile and appointments.
 * - It displays user information such as full name, email, and organization.
 * - The component also shows a list of the user's appointments with the ability to filter by status (confirmed, pending, canceled).
 * - Users can navigate to the organization creation page and toggle the visibility of the appointments modal.
 *
 * Inputs:
 * - session: A session object containing user session information.
 *
 * Outputs:
 * - JSX for rendering the user's profile card with information and appointments.
 * - A modal containing the list of appointments, with filters for different appointment statuses.
 * - Handlers for navigating to the organization creation page and toggling the appointments modal.
 */


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

    // Now, sort the updated appointments by booking_date
    const sortedAppointments = updatedAppointments.sort(
      (a, b) => new Date(a.booking_date) - new Date(b.booking_date)
    );

    // Then, set the appointments state with the sorted appointments
    setLoading(false);
    setAppointments(sortedAppointments);
  };

  console.log(session.user);

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
            </div>{" "}
          </header>
          <main className="card-main">
            <div
              className="activity"
              onClick={() => navigate("/create-organization")}
            >
              <i className="fa-solid fa-house"></i>
              <span className="activity-name">Organization</span>
              <span className="index">{organization.name}</span>
            </div>
            <div className="activity sepcial">
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
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(!isOpen)}
        className="extended"
      >
        <div className="appointments-section">
          <h3 className="appointments-title">
            Upcoming Appointments
            <span>
              <i
                className="fa-solid fa-check"
                style={{
                  backgroundColor:
                    selectedFilter === "confirmed"
                      ? "var(--primary)"
                      : "var(--bg-primary)",
                }}
                onClick={() =>
                  setSelectedFilter(
                    selectedFilter === "confirmed" ? "all" : "confirmed"
                  )
                }
              />
              <i
                className="fa-solid fa-hourglass"
                style={{
                  backgroundColor:
                    selectedFilter === "pending"
                      ? "var(--yellow)"
                      : "var(--bg-primary)",
                }}
                onClick={() =>
                  setSelectedFilter(
                    selectedFilter === "pending" ? "all" : "pending"
                  )
                }
              />
              <i
                className="fa-solid fa-x"
                style={{
                  backgroundColor:
                    selectedFilter === "cancelled"
                      ? "var(--red)"
                      : "var(--bg-primary)",
                }}
                onClick={() =>
                  setSelectedFilter(
                    selectedFilter === "cancelled" ? "all" : "cancelled"
                  )
                }
              />
            </span>
          </h3>
          {loading && <Spinner />}
          {appointments.length ? (
            <ul className="appointments-list">
              {appointments.map((appointment) => (
                <li
                  key={appointment.booking_id}
                  className={`appointment-item ${appointment.status}`}
                >
                  <div className="appointment-details">
                    <div className="top">
                      <h4>{appointment.service.name}</h4>
                      <p className="appointment-status">
                        {appointment.status === "confirmed" && (
                          <i className="fa-solid fa-check"></i>
                        )}
                        {appointment.status === "pending" && (
                          <i className="fa-solid fa-hourglass"></i>
                        )}
                        {appointment.status === "cancelled" && (
                          <i className="fa-solid fa-x"></i>
                        )}
                        {appointment.status}
                      </p>
                    </div>

                    <p className="appointment-date-time">
                      <i className="fa-solid fa-calendar-week"></i>
                      {appointment.booking_date} at {appointment.booking_time}
                    </p>

                    <p className="appointment-price">
                      <i className="fa-solid fa-money-bill"></i>
                      Price: ${appointment.service.price}
                    </p>
                    <div className="appointment-buttons">
                      <button className="cancel-appointment">Cancel</button>
                      <button className="edit-appointment">Edit</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-appointments">No upcoming appointments.</p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default UserProfile;
