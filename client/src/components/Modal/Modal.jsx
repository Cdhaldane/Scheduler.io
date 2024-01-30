import React, { useState, useEffect } from "react";
import "./Modal.css";

function Modal({ isOpen, onClose, onAddService }) {
  const [serviceName, setServiceName] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target.className === "modal") {
        onClose();
      }
    };

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddService({ serviceName, duration, price });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
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
      </div>
    </div>
  );
}

export default Modal;
