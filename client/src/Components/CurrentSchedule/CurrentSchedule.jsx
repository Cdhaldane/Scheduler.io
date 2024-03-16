import React from 'react';
import './CurrentSchedule.css';


/**
 * CurrentSchedule Component
 * 
 * Purpose:
 * - The CurrentSchedule component displays a list of current appointments.
 * - It is a visual representation of the schedule for the day, showing appointment times, names, services, and descriptions.
 * 
 * Inputs:
 * - None directly; the component uses a hardcoded list of dummy appointments for demonstration purposes.
 * 
 * Outputs:
 * - JSX for rendering the list of appointments in a structured format.
 */

const CurrentSchedule = () => {
  const dummyAppointments = [
    { id: 1, time: '10:00 AM', name: 'John Doe' , service: 'Haircut', description: 'ExtrExtra info here extra description extra long info description hereExtra info here extra description extra long info description herea info here extra description extra long info description here'},
    { id: 2, time: '11:00 AM', name: 'Jane Doe' , service: 'Coloring', description: 'Extra info here'},
    { id: 3, time: '12:00 AM', name: 'Jane Dock' , service: 'Coloring, Styling, Facial', description: 'Extra info here ExtrExtra info here extra description extra long info description hereExtra info here extra description extra long info de'},
  ];

  return (
    <div className="main-right schedule-container">
      {dummyAppointments.map(appointment => (
        <div key={appointment.id} className="appointment">
          <div className="appointment-top">
            <div className="appointment-time">{appointment.time}</div>
            <div className="appointment-name">{appointment.name}</div>
          </div>
          <div className="appointment-service">{appointment.service}</div>
          <div className="appointment-description">{appointment.description}</div>
        </div>
      ))}
    </div>
  );
};

export default CurrentSchedule;