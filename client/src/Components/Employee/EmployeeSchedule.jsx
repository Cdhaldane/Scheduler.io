import React, { useState, useEffect } from "react";
import { getServiceFromId } from "../../Database";
import "./EmployeeSchedule.css"; // Importing the CSS file

/**
 * EmployeeSchedule Component
 *
 * Purpose:
 * - Displays a list of employee bookings with an expandable view for detailed information on each booking.
 * - Provides a mobile-responsive layout for managing booking information efficiently.
 *
 * Props:
 * - `bookings`: Array of booking objects, each containing details like `service_id`, `booking_date`, `booking_time`, `client_name`, and other client information.
 *
 * State:
 * - `services`: An object that maps service IDs to their corresponding names, fetched from the database.
 * - `isOpen`: Index of the currently expanded booking item; -1 if no item is expanded.
 * - `mobileOpen`: Boolean indicating if the schedule view is open on mobile.
 * - `loading`: Boolean to indicate if service data is being loaded.
 *
 * Effects:
 * - `useEffect` on `bookings`: Fetches service names for each unique `service_id` in `bookings` using `getServiceFromId`. Populates `services` state for display.
 *
 *
 * Notes:
 * - Ensure the CSS classes, such as `schedule-view`, `booking-list`, `booking-item`, and `booking-details`, are defined in `EmployeeSchedule.css`.
 * - The `getServiceFromId` function should be an asynchronous function that retrieves service information from the database.
 */

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
    <div className={`schedule-view`}>
      <ul className="booking-list">
        {bookings.map((booking, index) => (
          <div className="booking-list-container" key={index}>
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
                <p>
                  <span>Client Email:</span> {booking.client_email}
                </p>
                {booking.client_phone && (
                  <p>
                    <span>Client Phone:</span>
                    {booking.client_phone}
                  </p>
                )}
                <p>
                  <span>Booking Status:</span> {booking.status}
                </p>
              </div>
            )}
          </div>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeSchedule;
