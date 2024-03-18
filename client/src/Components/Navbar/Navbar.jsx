import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../Login/Login";
import RegisterAccount from "../Customer/CustomerRegister/CustomerRegister.jsx";
import Modal from "../Modal/Modal";
import Dropdown from "../Dropdown/Dropdown.jsx";
import { InputForm } from "../Input/Input.jsx";
import { sendEmail, supabase } from "../../Database";
import { useSelector, useDispatch } from "react-redux";
import "./Navbar.css"; // Import the CSS file for styling

/**
 * NavbarItem Component
 *
 * Purpose:
 * - The NavbarItem component represents a single item in the navigation bar.
 * - It can either navigate to a specified route or perform a custom action when clicked.
 *
 * Inputs:
 * - icon: The class name for the icon to be displayed in the navbar item.
 * - route: The route to navigate to when the item is clicked.
 * - action: An optional custom action to be performed when the item is clicked.
 *
 * Outputs:
 * - JSX for rendering the navbar item with the specified icon and click behavior.
 */

const NavbarItem = ({ icon, route, action, id }) => {
  const navigate = useNavigate();
  const onClick = action ? action : () => navigate(route);
  return (
    <li onClick={onClick} className="navbar-item">
      <i className={icon} data-testid={id}></i>
    </li>
  );
};

/**
 * Navbar Component
 *
 * Purpose:
 * - The Navbar component provides the navigation bar for the application.
 * - It includes links for admin and user actions, as well as login and registration forms.
 * - The navigation bar changes based on whether the user is logged in or has admin privileges.
 *
 * Inputs:
 * - isAdmin: A boolean indicating whether the user has admin privileges.
 * - isLoggedIn: A boolean indicating whether the user is logged in.
 * - setIsLoggedIn: A function to set the isLoggedIn state.
 * - session: The current user session object.
 *
 * Outputs:
 * - JSX for rendering the navigation bar with appropriate links and modals for login and registration.
 */

const Navbar = ({
  isAdmin,
  isLoggedIn,
  setIsLoggedIn,
  session,
  organization,
  isCalendar,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const isMobile = window.innerWidth < 768;

  const ProfilePic = () => {
    return (
      <li className="navbar-item">
        {session?.user.user_metadata.avatar_url ? (
          <img
            src={session?.user.user_metadata.avatar_url}
            alt="profile"
            className="profile-pic"
          />
        ) : (
          <i className="fa-solid fa-user"></i>
        )}
      </li>
    );
  };

  const navigate = useNavigate();

  //Handler for login success
  const handleLoginSuccess = () => {
    setShowModal(false);
    setIsLoggedIn(true);
  };

  const handleDropdownClick = (option) => {
    console.log(option);
    if (option === "Signout") {
      setShowModal(false);
      supabase.auth.signOut();
      setIsLoggedIn(false);
    }
    if (option === "Create Organization") {
      navigate("/create-organization");
    }
  };

  //Effect hook to check for session and update login status
  useEffect(() => {
    if (session) {
      setIsLoggedIn(true);
      setShowModal(false);
    }
  }, [session]);

  //Render the navigation bar with appropriate links and modals
  return (
    <nav
      className={`navbar ${isMobile ? "mobile" : ""}`}
      style={{
        marginLeft: isCalendar ? "var(--sidebar-width)" : "0",
        width: isCalendar ? "calc(100% - var(--sidebar-width))" : "100%",
        backgroundColor: isCalendar
          ? "var(--bg-primary)"
          : "var(--bg-secondary",
      }}
    >
      <div className="navbar-header"></div>
      <div className="navbar-content">
        {!isLoggedIn && (
          <NavbarItem
            icon="fa-solid fa-arrow-right-to-bracket"
            route="#"
            action={() => setShowModal(true)}
          />
        )}
        {isAdmin && isLoggedIn && (
          <>
            <NavbarItem icon="fa-solid fa-clipboard" route="/admin" />
            <NavbarItem icon="fa-regular fa-user" route="/admin/employee" />
          </>
        )}
        {isLoggedIn && (
          <>
            <NavbarItem
              icon="fa-solid fa-message"
              action={() => setIsOpen(true)}
            />
            <NavbarItem icon="fa-solid fa-circle-info" route="/info" />
            <li className="navbar-item hover-none">
              <Dropdown
                children={<ProfilePic />}
                label={session?.user.user_metadata.name}
                options={["Signout", "Create Organization"]}
                onClick={(e) => handleDropdownClick(e)}
                direction="left"
              />
            </li>
          </>
        )}
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
        </>
      </Modal>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <InputForm
          id="contact"
          states={[
            { id: "Name", type: "name", label: "Name" },
            { id: "Email", type: "email", label: "Email" },
            { id: "Message", type: "textarea", label: "Message" },
          ]}
          onClose={() => setIsOpen(false)}
          onSubmit={async (states) => {
            return sendEmail(states.name, states.email, states.message);
          }}
          buttonLabel="Send"
        >
          <p className="text-center">
            {" "}
            If you have any questions or concerns, please contact us at{" "}
            <a>timeslot@gmail.com</a>
          </p>
        </InputForm>
      </Modal>
    </nav>
  );
};

export default Navbar;
