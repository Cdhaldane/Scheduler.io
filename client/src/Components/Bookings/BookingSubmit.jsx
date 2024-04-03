import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../Providers/Alert";
import { sendEmail, addBooking } from "../../Database";

import "./Bookings.css";

/**
 * BookingSubmit Component
 *
 * Purpose:
 * - The BookingSubmit component is responsible for displaying the confirmation details of the booking made by the user.
 * - It shows the appointment details, service, personnel, date, time, and price.
 * - It also allows the user to confirm the booking and provides feedback once the booking is confirmed.
 *
 * Actions:
 * - On mount, it retrieves the user and appointment details from `location.state` or defaults to empty objects.
 * - The `handleBook` function is called to confirm the booking, show a success alert, and update the booking status.
 * - On booking confirmation, a message is displayed to the user, and a button is provided to navigate back to the home page.
 *
 * Inputs:
 * - None directly; relies on React Router's `useLocation` for state passed via navigation.
 *
 * Outputs:
 * - JSX for rendering the booking confirmation details and interaction elements.
 */

const BookingSubmit = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, appointment } = location.state || { user: {}, appointment: {} };
  console.log("User:", user, "Appointment:", appointment);
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
      status: "confirmed",
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
          <button onClick={() => navigate("/home")}>Back to Home</button>
        ) : (
          <button onClick={handleBook}>Confirm Booking</button>
        )}
      </div>
    </div>
  );
};

export default BookingSubmit;
