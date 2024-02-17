import React, { useState } from "react";
import Sidebar from "../components/sidebar/sidebar";
import Calendar from "../components/calendar/calendar";
import PuzzleContainer from "../components/Puzzle/PuzzleContainer";
import { useNavigate } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const Admin = () => {
  const [personID, setPersonID] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(0);
  const navigate = useNavigate();

  const handleSelectedSlot = (e) => {
    setSelectedSlot({ day: e.day, hour: e.hour });
  };

  const puzzlePieces = [
    { id: 1, duration: 1, price: 50, name: "Piece 1", color: "#3F5E5A" },
    { id: 2, duration: 4, price: 200, name: "Piece 2", color: "#9DC0BC" },
    { id: 3, duration: 0.5, price: 20, name: "Piece 3", color: "#2D2D2A" },
  ];

  const handleDrop = (item) => {
    // Logic to add the dropped service to the scheduledSlots or any other state you're maintaining
    // Update your state here
  };

  const onAddService = (service) => {
    let newService = {
      id: puzzlePieces.length + 1,
      duration: parseFloat(service.duration),
      price: parseFloat(service.price),
      name: service.serviceName,
    };
    puzzlePieces.push(newService);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Sidebar setPersonID={setPersonID} />
      <div className="main">
        <PuzzleContainer
          puzzlePieces={puzzlePieces}
          onDrop={handleDrop}
          personID={personID}
          handleSelectedSlot={handleSelectedSlot}
          onAddService={onAddService}
        />
      </div>
    </DndProvider>
  );
};

export default Admin;
