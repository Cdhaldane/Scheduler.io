import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../Login/Login";
import RegisterAccount from "../Customer/CustomerRegister/CustomerRegister.jsx";
import Modal from "../Modal/Modal";
import Dropdown from "../Dropdown/Dropdown.jsx";
import { supabase } from "../../Database";
import "./Navbar.css"; // Import the CSS file for styling

const NavbarItem = ({ icon, route, action }) => {
  const navigate = useNavigate();
  const onClick = action ? action : () => navigate(route);
  return (
    <li onClick={onClick} className="navbar-item">
      <i className={icon}></i>
    </li>
  );
};

const Navbar = ({ isAdmin, isLoggedIn, setIsLoggedIn, session }) => {
  const [showModal, setShowModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const ProfilePic = () => {
    return (
      <li className="navbar-item">
        <img
          src={session.user.user_metadata.avatar_url}
          alt="profile"
          className="profile-pic"
        />
      </li>
    );
  };

  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    setShowModal(false);
    setIsLoggedIn(true);
  };

  const handleDropdownClick = (e) => {
    console.log("Dropdown Click:", e);
    if (e) {
      setShowModal(false);
      supabase.auth.signOut();
    }
  };

  useEffect(() => {
    if (session) {
      setIsLoggedIn(true);
      setShowModal(false);
    }
  }, [session]);

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-header">
          <img
            src="./logo.png"
            alt="website logo"
            className="navbar-logo"
            onClick={() => navigate("/admin")}
          />
          <h1>Time Slot</h1>
        </div>
        <ul>
          {!isLoggedIn && !isAdmin && (
            <NavbarItem
              icon="fa-solid fa-arrow-right-to-bracket"
              route="#"
              action={() => setShowModal(true)}
            />
          )}
          {isAdmin && (
            <>
              <NavbarItem
                icon="fa-solid fa-clipboard"
                route="/admin/dashboard"
              />
              <NavbarItem icon="fa-solid fa-plus" route="/admin/add" />
              <NavbarItem icon="fa-regular fa-user" route="/admin/profile" />
            </>
          )}
          {isLoggedIn && !isAdmin && (
            <>
              <NavbarItem
                icon="fa-solid fa-message"
                action={() => setIsOpen(true)}
              />
              <NavbarItem icon="fa-solid fa-circle-info" route="/info" />
              <Dropdown
                children={<ProfilePic />}
                label={session?.user.user_metadata.name}
                options={["Signout"]}
                onClick={(e) => handleDropdownClick(e)}
                direction="left"
              />
            </>
          )}
        </ul>
      </div>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <>
          <div className="modal-body">
            {isRegistering ? (
              <RegisterAccount onClose={() => setShowModal(false)} />
            ) : (
              <LoginForm onLoginSuccess={handleLoginSuccess} />
            )}
          </div>
          {/* <div className="modal-footer">
            {isRegistering ? (
              <button onClick={() => setIsRegistering(false)}>
                Back to Login
              </button>
            ) : (
              <button onClick={() => setIsRegistering(true)}>
                Want to create an account?
              </button>
            )}
          </div> */}
        </>
      </Modal>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
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
      </Modal>
    </nav>
  );
};

export default Navbar;
