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