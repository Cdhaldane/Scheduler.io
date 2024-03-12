import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../Providers/Alert";

import "./Bookings.css";

const BookingSubmit = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, appointment } = location.state || {};
  console.log("User:", user, "Appointment:", appointment);
  const alert = useAlert();

  const [booked, setBooked] = useState(false);

  const handleBook = async () => {
    // Logic to book the appointment
    // Update your state here
    alert.showAlert("success", "Booking Confirmed");
    setBooked(true);
  };

  return (
    <div className="booking-container">
      <div className="book-info">
        {booked ? <h1>Booking Confirmed</h1> : <h1>Confirm booking</h1>}
        <div className="book-info-display">
          <p>
            Your appointment for a <var>{appointment.service}</var> with{" "}
            <var>{appointment.personnel.first_name}</var> is on{" "}
            <var>{appointment.day}</var>
          </p>
          <p>
            Starting at{" "}
            <var>
              {appointment.start}:00{appointment.start <= 12 ? "AM" : "PM"}
            </var>{" "}
            & Ending at{" "}
            <var>
              {appointment.end}:00 {appointment.end <= 12 ? "AM" : "PM"}
            </var>
          </p>
          <p>
            Price: <var>${appointment.price}</var>
          </p>
        </div>
        {booked && (
          <div className="book-message">
            <p>
              Thank you for booking, {user.name}!<br /> We will contact you at{" "}
              {user.email} to confirm your appointment.
            </p>
          </div>
        )}
        {booked ? (
          <button onClick={() => navigate("/")}>Back to Home</button>
        ) : (
          <button onClick={handleBook}>Confirm Booking</button>
        )}
      </div>
    </div>
  );
};

export default BookingSubmit;
