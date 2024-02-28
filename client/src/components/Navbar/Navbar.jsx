import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css"; // Import the CSS file

const Navbar = () => {
  const navigate = useNavigate();

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
          <li>
            <a onClick={() => navigate("/")}>
              <i class="fa-solid fa-house"></i>
              {/* Home */}
            </a>
          </li>
          <li>
            <a onClick={() => navigate()}>
              <i class="fa-solid fa-circle-info"></i>
              {/* Info */}
            </a>
          </li>
          <li>
            <a onClick={() => navigate()}>
              <i class="fa-solid fa-message"></i>
              {/* Contact */}
            </a>
          </li>
          <li>
            <a onClick={() => navigate("login")}>
              <i class="fa-solid fa-right-to-bracket"></i>
              {/* Sign-in */}
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
