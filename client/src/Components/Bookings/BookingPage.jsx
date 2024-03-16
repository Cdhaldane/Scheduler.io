import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
//import GuestBookingPage from "../GuestBookingPage/GuestBookingPage";
import { supabase } from "../../Database";
import Input from "../Input/Input";
import { useAlert } from "../Providers/Alert";

import "./Bookings.css";

/**
 * BookingPage Component
 * 
 * Purpose:
 * - The BookingPage is responsible for displaying a form allowing a guest to fill in their required information to book an appointment.
 * - It captures the user's name, phone number, email, and any additional information relevant to the appointment.
 * 
 * Actions:
 * - On mount, it attempts to set the appointment data from the `location.state` or retrieves it from `localStorage`.
 * - Validates the phone number input to ensure they match before submission.
 * - On form submission, navigates to the `BookingSubmit` page with the state containing user and appointment data.
 * 
 * Inputs:
 * - None directly; relies on React Router's `useLocation` for state passed via navigation and `localStorage`.
 * 
 * Outputs:
 * - JSX for rendering the booking form.
 * ```
 */


const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const alert = useAlert();
  const { session, appointment } = location.state || {};
  console.log("Session:", session, "Appointment:", appointment);

  const [appointmentData, setAppointmentData] = useState({
    day: "",
    start: 0,
    end: 0,
    service: "",
    personnel: {},
    price: 0,
    additionalInfo: "",
  });
  const [phoneNumber, setPhoneNumber] = useState("");
  const [confirmPhoneNumber, setConfirmPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  const [booked, setBooked] = useState(false);


/**
 * useEffect hook for setting appointment data
 * 
 * Actions:
 * - On initial render, checks for an `appointment` object in `location.state`.
 * - If `appointment` exists, it stores it in `localStorage` and updates `appointmentData` state.
 * - If `appointment` does not exist, attempts to retrieve and set `appointmentData` from `localStorage`.
 * 
 * Inputs:
 * - `appointment` object from `location.state`
 * 
 * Outputs:
 * - Side effects: updates `appointmentData` state and `localStorage`.
 */

  useEffect(() => {
    if (appointment) {
      localStorage.setItem("appointment", JSON.stringify(appointment));
      setAppointmentData(appointment);
    } else{
      setAppointmentData(JSON.parse(localStorage.getItem("appointment")));
    }
  }, []);


/**
 * handleSubmit function
 * 
 * Purpose:
 * - Handles booking page to submit page.
 * - Validates that the entered phone numbers match.
 * - Constructs the user data object and navigates to the `BookingSubmit` page with the necessary state.
 * 
 * Actions:
 * - Prevents the default form submission behavior.
 * - Uses an alert to notify the user if phone numbers do not match.
 * - Navigates to the `BookingSubmit` page with `user` and `appointmentData`.
 * 
 * Inputs:
 * - Event `e` from the Schedule Form.
 * 
 * Outputs:
 * - Navigates to a new route on successful submission.
 * - Side effects: may trigger an alert notification.
 */

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (phoneNumber !== confirmPhoneNumber) {
      alert.showAlert("error", "Phone numbers do not match");
      return;
    }

    const user = {
      name,
      email,
      phoneNumber,
    };
    if (additionalInfo) appointmentData.additionalInfo = additionalInfo;
    //console.log('Navigating with state:', { user, appointmentData });
    navigate("/booking-submit", { state: { user, appointment: appointmentData } });
  };

/**
  * Information Display
  *
  * Purpose:
  * This section displays the details of the user's chosen appointment. It provides visual confirmation of the date and times selected for the appointment, including the start and end times in a 12-hour format with AM/PM indicators.
  *
  * Output:
  * - A section with three lines displaying the day of the appointment, and the starting and ending times respectively.
  * Booking Form
  *
  * Purpose:
  * The form collects user input for creating a new appointment. It captures the user's name, phone number, email, and any additional information they might want to provide.
  * The form includes validation to ensure the phone number is entered correctly twice for confirmation.
  *
  * On submission:
  * The `handleSubmit` function is called, which processes the input data. If the phone numbers match, the user is navigated to a confirmation page with their entered details included in the state.
  *
  */

  return (
    <div className="booking-container">
      <div className="book-info">
        <a>You are not currently logged in.</a>
        <div className="book-info-display">
          <p>
            Your appointment is on <var>{appointmentData.day}</var>
          </p>
          <p>
            Starting at{" "}
            <var>
              {appointmentData.start}:00
              {appointmentData.start <= 12 ? "AM" : "PM"}
            </var>{" "}
          </p>
          <p>
            Ending at{" "}
            <var>
              {appointmentData.end}:00 {appointmentData.end <= 12 ? "AM" : "PM"}
            </var>
          </p>
        </div>

        <form className="book-form" onSubmit={handleSubmit}>
          <h1>Continue as guest...</h1>
          <Input
            label="Name"
            type="text"
            value={name}
            onInputChange={(newValue) => setName(newValue)}
            className="book-input"
          />
          <span>
            <Input
              label="Phone Number"
              type="tel"
              value={phoneNumber}
              onInputChange={(newValue) => setPhoneNumber(newValue)}
              className="book-input"
            />
            <Input
              label="Confirm Phone Number"
              type="tel"
              value={confirmPhoneNumber}
              onInputChange={(newValue) => setConfirmPhoneNumber(newValue)}
              className="book-input"
            />
          </span>
          <Input
            label="Email"
            type="email"
            value={email}
            onInputChange={(newValue) => setEmail(newValue)}
            className="book-input"
          />
          <Input
            label="Additional Information"
            type="textarea"
            value={additionalInfo}
            onInputChange={(newValue) => setAdditionalInfo(newValue)}
            className="book-input"
          />
          <button type="submit">Book Appointment</button>
        </form>
      </div>
    </div>
  );
};

export default BookingPage;
