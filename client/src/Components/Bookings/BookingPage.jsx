import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
//import GuestBookingPage from "../GuestBookingPage/GuestBookingPage";
import { supabase } from "../../Database";
import Input from "../Input/Input";
import { useAlert } from "../Providers/Alert";

import "./Bookings.css";

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

  useEffect(() => {
    if (appointment) {
      localStorage.setItem("appointment", JSON.stringify(appointment));
      setAppointmentData(appointment);
    } else{
      setAppointmentData(JSON.parse(localStorage.getItem("appointment")));
    }
  }, []);

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
