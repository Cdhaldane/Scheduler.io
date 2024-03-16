import React, { useState, useEffect } from "react";
import Sidebar from "../Components/Sidebar/Sidebar.jsx";
import Calendar from "../Components/Calendar/Calendar.jsx";
import PuzzleContainer from "../Components/Puzzle/PuzzleContainer";
import { useNavigate } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  supabase,
  getPersonnel,
  getServices,
  deleteService,
  addService,
} from "../Database.jsx";
import AvailabilityForm from '../Components/AvailabilityForm/AvailabilityForm';
import CurrentSchedule from '../Components/CurrentSchedule/CurrentSchedule';

/**
 * Employee Component
 * 
 * Purpose:
 * - The Employee component provides the main interface for an employee, including the availability form and the calendar.
 * - It also provides a button for navigating to the admin page.
 * 
 * Inputs:
 * - session: The current user session object.
 * 
 * Outputs:
 * - JSX for rendering the employee interface with the availability form, calendar, and admin navigation button.
 */
const Employee = ({ session }) => {
    const navigate = useNavigate();

    const calendarProps = {
        // Define the necessary props here
    };

    return (
        <DndProvider backend={HTML5Backend}>
        <AvailabilityForm />
        <button className="admin-button" onClick={() => navigate("/admin")}>
            ADMIN
        </button>
    
        <div className="main-body">
            <Calendar {...calendarProps} />
            <CurrentSchedule />
        </div>
        </DndProvider>
    );
};

export default Employee;