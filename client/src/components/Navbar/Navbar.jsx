import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal/Modal";
import "./Navbar.css"; // Import the CSS file

const MessageModal = () => {
  return (
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
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isAdmin = sessionStorage.getItem("isAdmin");

  const navigate = useNavigate();

  const getItem = (icon, text, onClick) => {
    return (
      <li>
        <a
          onClick={() => {
            onClick();
            console.log("clicked");
          }}
        >
          <i class={`fa-solid fa-${icon}`}></i>
          {/* {text} */}
        </a>
      </li>
    );
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-header">
          <img src={"./logo.png"} alt="website logo" />
          <h1 onClick={() => navigate("./admin")}>Time Slot</h1>
          {isAdmin === "true" && <h2>AdminMode</h2>}
          <button
            onClick={() => sessionStorage.setItem("introFinished", false)}
          >
            TEST
          </button>
        </div>
        <ul>
          {getItem("house", "Home", () => navigate("/"))}
          {getItem("circle-info", "Info", () => navigate("/info"))}
          {getItem("message", "Contact", () => setIsOpen(true))}

          {sessionStorage.isAdmin === "true"
            ? getItem("user", "Admin", () => {
                sessionStorage.setItem("isAdmin", "false");
                navigate("/");
              })
            : getItem("right-to-bracket", "Login", () => {
                sessionStorage.setItem("isAdmin", "false");
                navigate("/login");
              })}
        </ul>
      </div>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <MessageModal />
      </Modal>
    </nav>
  );
};

export default Navbar;
