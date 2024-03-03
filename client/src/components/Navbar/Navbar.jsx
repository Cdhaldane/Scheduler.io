import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal/Modal";
import "./Navbar.css"; // Import the CSS file

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
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
            ? getItem("user", "Admin", () =>
                sessionStorage.setItem("isAdmin", "false")
              )
            : getItem("right-to-bracket", "Login", () => {
                sessionStorage.setItem("isAdmin", "false");
                navigate("/login");
              })}
        </ul>
      </div>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} type="message" />
    </nav>
  );
};

export default Navbar;
