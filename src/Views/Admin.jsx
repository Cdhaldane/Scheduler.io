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

const Admin = ({ session }) => {};

export default Admin;
