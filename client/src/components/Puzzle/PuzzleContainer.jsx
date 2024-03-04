import React, { useState } from "react";
import { useDrop, useDrag } from "react-dnd";
import Calendar from "../Calendar/calendar";
import Modal from "../Modal/Modal";

import "./Puzzle.css";

const ServiceForm = ({ onAdd, onClose }) => {
  const [serviceName, setServiceName] = useState("");
  const [duration, setDuration] = useState(0);
  const [price, setPrice] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ serviceName, duration, price });
    onClose(); // Close modal after adding
  };

  return (
    <>
      <h2>Add a Service</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Service Name:</label>
        <input
          type="text"
          id="name"
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
          required
        />

        <label htmlFor="duration">Duration (hrs):</label>
        <input
          type="number"
          id="duration"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
        />

        <label htmlFor="price">Price ($):</label>
        <input
          type="number"
          id="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <button type="submit">Add Service</button>
      </form>
    </>
  );
};

const PuzzlePiece = ({ piece }) => {
  // Use `useDrag` hook from react-dnd to make this component draggable
  const [{ isDragging }, drag] = useDrag({
    type: "service",
    item: { id: piece.id, name: piece.name, color: piece.color },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "grab",
        backgroundColor: piece.color,
        borderColor: piece.color,
      }}
      className="puzzle-piece"
    >
      <h1>{piece.name}</h1>
      {/* <p>{piece.duration} hrs</p>
      <p>${piece.price}</p> */}
    </div>
  );
};

const PuzzleContainer = ({
  onDrop,
  puzzlePieces,
  personID,
  handleSelectedSlot,
  onAddService,
}) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: "puzzlePiece",
    drop: (item, monitor) => {
      onDrop(item); // Call the onDrop function passed as prop with the dropped item
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        ref={drop}
        className="puzzle-container"
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: isOver && canDrop ? "lightblue" : "#2D2D2A",
          position: "relative",
        }}
      >
        <Calendar
          personID={personID}
          handleSelectedSlot={(e) => handleSelectedSlot(e)}
          puzzlePieces={puzzlePieces}
        />
        <div className="pieces-container">
          {puzzlePieces.map((piece, index) => (
            <PuzzlePiece key={index} piece={piece} />
          ))}
          <div
            className="puzzle-piece btn-piece"
            onClick={() => setIsOpen(true)}
          >
            Add Service
          </div>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ServiceForm onAdd={onAddService} onClose={() => setIsOpen(false)} />
      </Modal>
    </>
  );
};

export default PuzzleContainer;
