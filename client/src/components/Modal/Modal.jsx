import React, { useState, useEffect, Children } from "react";
import "./Modal.css";

function Modal({ isOpen, onClose, onAddService, type }) {
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

  const serviceModal = (
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

  const messageModal = (
    <div className="message-modal">
      <h1>Contact</h1>
      <form>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" required />
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" required />
        <label htmlFor="message">Message:</label>
        <textarea id="message" required />
        <button type="submit">Send</button>
      </form>
      <p>
        If you have any questions or concerns, please contact us at{" "}
        <a>timeslot@gmail.com</a>
      </p>
    </div>
  );

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        {type === "service" && serviceModal}
        {type === "message" && messageModal}
      </div>
    </div>
  );
}

export default Modal;
