// AppointmentsModal.js
import React, { useState, useEffect } from "react";
import Modal from "../../DevComponents/Modal/Modal";
import Spinner from "../../DevComponents/Spinner/Spinner";
import { getBookingsByClientEmail, getServiceFromId } from "../../Database";
import "./AppointmentsModal.css";

const AppointmentsModal = ({ isOpen, onClose, session }) => {
  const [appointments, setAppointments] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [loading, setLoading] = useState(false);
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
    <Modal isOpen={isOpen} onClose={onClose} className="extended">
      <div className="appointments-section">
        <h3 className="appointments-title">
          Upcoming Appointments
          <span>
            <i
              className="fa-solid fa-check"
              style={{
                backgroundColor:
                  selectedFilter === "confirmed"
                    ? "var(--green)"
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
  );
};

export default AppointmentsModal;
