import React, { useState } from "react";
import ErrorPage from "../../Views/404";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../DevComponents/Providers/Alert";
import { sendEmail, addBooking } from "../../Database";
import { validateEmail, convertMilitaryTime } from "../../Utils";
import queryString from "query-string";

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
  const alert = useAlert();
  const [booked, setBooked] = useState(false);

  let { user, appointment, organization } = location.state || {
    user: {},
    appointment: {},
    organization: {},
  };

  const parsedQuery = queryString.parse(location.search);

  const userFromQuery = parsedQuery.user ? JSON.parse(parsedQuery.user) : {};
  const appointmentFromQuery = parsedQuery.appointment
    ? JSON.parse(parsedQuery.appointment)
    : {};
  const organizationFromQuery = parsedQuery.organization
    ? JSON.parse(parsedQuery.organization)
    : {};

  if (
    Object.keys(userFromQuery).length > 0 &&
    Object.keys(appointmentFromQuery).length > 0 &&
    Object.keys(organizationFromQuery).length > 0
  ) {
    user = userFromQuery;
    appointment = appointmentFromQuery;
    organization = organizationFromQuery;
  }

  const handleBook = async () => {
    let time = appointment.day;
    if (typeof time === "string") time = new Date(time);
    time.setHours(appointment.start, 0, 0, 0);

    if (!validateEmail(user.email))
      return alert.showAlert("error", "Invalid Email");

    if (
      appointment.service === undefined ||
      appointment.personnel === undefined
    ) {
      alert.showAlert(
        "error",
        "Booking Failed, No Service or Personnel Selected"
      );
      return;
    }

    console.log(user, appointment);
    const booking = {
      client_email: user.email,
      client_name: user.name,
      client_phone: user.phoneNumber,
      personnel_id: appointment.personnel.id,
      service_id: Array.isArray(appointment.service)
        ? appointment.service[0].id
        : appointment.service.id,
      booking_date: appointment.day,
      booking_time: time.toLocaleTimeString("en-US"),
      status: "confirmed",
    };

    console.log(booking);
    const { res, error } = await addBooking(booking);
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

  if (!user?.name || !appointment?.day) return <ErrorPage />;

  return (
    <div className="booking-container">
      <div className="book-info">
        {booked ? <h1>Booking Confirmed</h1> : <h1>Confirm booking</h1>}
        <div className="book-info-display">
          <p>
            Your appointment for a{" "}
            <var>
              {Array.isArray(appointment.service)
                ? appointment.service.map((service) => service.name).join(" + ")
                : appointment.service?.name}
            </var>{" "}
            with <var>{appointment.personnel?.first_name}</var> is on{" "}
            <var>
              {typeof appointment.day == "object"
                ? appointment.day.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })
                : appointment.day}
            </var>
          </p>
          <p>
            Starting at{" "}
            <var>{convertMilitaryTime(appointment.start + ":00")} </var> &
            Ending at{" "}
            <var>
              {convertMilitaryTime(
                appointment.start + appointment.duration + ":00"
              )}
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
          <button onClick={() => navigate(`/home/${organization?.org_id}`)}>
            Back to Home
          </button>
        ) : (
          <button onClick={handleBook}>Confirm Booking</button>
        )}
      </div>
    </div>
  );
};

export default BookingSubmit;
