import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../Providers/Alert";
import { sendEmail, addBooking } from "../../Database";

import "./Bookings.css";

const BookingSubmit = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, appointment } = location.state || {};
  const alert = useAlert();

  const [booked, setBooked] = useState(false);

  const handleBook = async () => {
    const time = appointment.day;
    time.setHours(appointment.start, 0, 0, 0);
    console.log(appointment);

    const { res, error } = await addBooking({
      client_email: user.email,
      client_name: user.name,
      client_phone: user.phoneNumber,
      personnel_id: appointment.personnel.id,
      service_id: appointment.service.id,
      booking_date: appointment.day,
      booking_time: time.toLocaleTimeString("en-US"),
      status: "confrimed",
    });
    if (error) {
      alert.showAlert("error", "Booking Failed");
      return;
    }
    await sendEmail(
      user.name,
      user.email,
      appointment,
      "appointment_template"
    ).finally(() => {
      alert.showAlert("success", "Booking Confirmed");
      setBooked(true);
    });

    const handleBookEmail = async () => {};
  };

  return (
    <div className="booking-container">
      <div className="book-info">
        {booked ? <h1>Booking Confirmed</h1> : <h1>Confirm booking</h1>}
        <div className="book-info-display">
          <p>
            Your appointment for a <var>{appointment.service.name}</var> with{" "}
            <var>{appointment.personnel.first_name}</var> is on{" "}
            <var>
              {appointment.day &&
                appointment.day.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
            </var>
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
