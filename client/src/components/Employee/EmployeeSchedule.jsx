import React, { useState, useEffect } from "react";
import { getServiceFromId } from "../../Database";
import "./EmployeeSchedule.css"; // Importing the CSS file

const EmployeeSchedule = ({ bookings }) => {
  const [services, setServices] = useState({});
  const [isOpen, setIsOpen] = useState(0);
  const isMobile = window.innerWidth <= 768;
  const [mobileOpen, setMobileOpen] = useState(isMobile ? false : true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      const servicesTemp = {};
      // Assuming getService is a function that returns a promise with service details
      for (const booking of bookings) {
        if (!servicesTemp[booking.service_id]) {
          try {
            const serviceDetails = await getServiceFromId(booking.service_id);
            servicesTemp[booking.service_id] = serviceDetails.name; // Assuming the service details have a 'name' property
          } catch (error) {
            console.error("Failed to fetch service details:", error);
          }
        }
      }
      setServices(servicesTemp);
    };

    fetchServices().finally(() => setLoading(false));
  }, [bookings]); // Re-run effect if bookings array changes

  if (loading) return <p>Loading...</p>;

  return (
    <>
      {isMobile && (
        <i
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`fa-solid fa-calendar-check schedule-form-mobile-toggle ${
            mobileOpen ? "hidden" : ""
          }`}
        ></i>
      )}
      {mobileOpen && (
        <div className={`schedule-view ${isMobile ? "mobile" : ""}`}>
          <h2>
            <i
              onClick={() => isMobile && setMobileOpen(false)}
              className={`fa-solid fa-calendar-check schedule-view-mobile-toggle`}
            ></i>
            My Bookings
          </h2>
          <ul className="booking-list">
            {bookings.map((booking, index) => (
              <div className="booking-list-container">
                <li
                  key={index}
                  className="booking-item"
                  onClick={() => setIsOpen(index === isOpen ? -1 : index)}
                >
                  <span className="booking-time">
                    {booking.booking_date} {booking.booking_time}{" "}
                    {parseInt(booking.booking_time) <= 12 ? "AM" : "PM"}
                  </span>
                  <span className="booking-client">{booking.client_name}</span>
                  <span className="booking-service">
                    {services[booking.service_id] || "Loading..."}
                  </span>
                </li>
                {isOpen === index && (
                  <div className="booking-details yellow">
                    <i className="pin"></i>
                    <p>Client Email: {booking.client_email}</p>
                    <p>Client Phone: {booking.client_phone}</p>
                    <p>Booking Status: {booking.status}</p>
                  </div>
                )}
              </div>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default EmployeeSchedule;
