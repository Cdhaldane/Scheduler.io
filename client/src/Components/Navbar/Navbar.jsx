import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LoginForm from "../Login/Login";
import Modal from "../../DevComponents/Modal/Modal.jsx";
import Dropdown from "../../DevComponents/Dropdown/Dropdown.jsx";
import { InputForm } from "../../DevComponents/Input/Input.jsx";
import { sendEmail, supabase } from "../../Database";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "../../DevComponents/Providers/Alert.jsx";

import "./Navbar.css"; // Import the CSS file for styling
import AppointmentsModal from "../AppointmentsModal/AppointmentsModal.jsx";

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

const NavbarItem = ({
  icon,
  route,
  action,
  id,
  setCurrentPage,
  currentPage = "",
}) => {
  const navigate = useNavigate();
  const onClick = action
    ? action
    : () => {
        setCurrentPage(route.split("/")[1]);
        navigate(route);
      };
  return (
    <li
      onClick={onClick}
      className={`navbar-item ${
        currentPage === route?.split("/")[1] && "current"
      }`}
    >
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
  const [currentPage, setCurrentPage] = useState("home");
  const [showAppointments, setShowAppointments] = useState(false);
  const isMobile = window.innerWidth <= 768;
  const location = useLocation();
  const alert = useAlert();

  let orgId = "";
  if (isLoggedIn) {
    orgId = session.user.user_metadata.organization
      ? session.user.user_metadata.organization.org_id
      : "no_org";
  }

  /**
   * ProfilePic Component
   *
   * Purpose:
   * - The ProfilePic component displays the user's profile picture in the navigation bar.
   * - If the user has set a profile picture (avatar_url), it is shown as an image.
   * - If the user has not set a profile picture, a default icon is displayed instead.
   *
   * Inputs:
   * - None (assumes access to a global `session` object containing user information)
   *
   * Outputs:
   * - JSX for rendering the user's profile picture or a default icon in the navigation bar.
   */

  const ProfilePic = () => {
    return (
      <div className="navbar-item profile-item">
        {session?.user.user_metadata.avatar_url ? (
          <img
            src={session.user.user_metadata.avatar_url}
            alt="profile"
            className="profile-pic"
            referrerPolicy="no-referrer"
          />
        ) : (
          <i className="fa-solid fa-user"></i>
        )}
      </div>
    );
  };

  const navigate = useNavigate();

  //Handler for login success
  const handleLoginSuccess = () => {
    navigate("/");
    setShowModal(false);
    setIsLoggedIn(true);
  };

  //Handler for dropdown click
  const handleDropdownClick = (option) => {
    setCurrentPage(option);
    if (option === "Signout") {
      setShowModal(false);
      supabase.auth.signOut();
      setIsLoggedIn(false);
    }
    if (option === "Appointments") {
      setShowAppointments(true);
    }
    if (option === "Profile") {
      navigate("/profile");
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
        backgroundColor: isCalendar ? "var(--bg-primary)" : "var(--bg-primary)",
      }}
    >
      <div className="navbar-header">
        {!isCalendar && (
          <>
            {!isMobile && (
              <>
                <img
                  src="/logo.png"
                  alt="website logo"
                  className="navbar-logo"
                  onClick={() => navigate("/")}
                />
                <h1 className="timeslot-title">
                  TIME<span>SLOT</span>
                </h1>
              </>
            )}
            {!(
              location.pathname.includes("/admin") ||
              location.pathname.includes("/home")
            ) &&
              isMobile && (
                <h1 className="timeslot-title">
                  T<span>S</span>
                </h1>
              )}
          </>
        )}
      </div>
      <div className="navbar-content">
        {!isLoggedIn && (
          <>
            <NavbarItem
              icon="fa-solid fa-message"
              action={() => setIsOpen(true)}
            />

            <NavbarItem
              icon="fa-solid fa-circle-info"
              route="/info"
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
            />
            <NavbarItem
              icon="fa-solid fa-arrow-right-to-bracket"
              route="#"
              action={() => setShowModal(true)}
            />
          </>
        )}
        {isAdmin && isLoggedIn && orgId !== "no_org" && (
          <>
            <NavbarItem
              icon="fa-solid fa-home"
              route={`/home/${orgId}`}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
            />
            <NavbarItem
              icon="fa-solid fa-clipboard"
              route={`/admin/${orgId}`}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
            />
          </>
        )}
        {isLoggedIn && (
          <>
            <NavbarItem
              icon="fa-solid fa-message"
              action={() => setIsOpen(true)}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
            />
            <NavbarItem
              icon="fa-solid fa-circle-info"
              route="/info"
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
            />
            <li className="navbar-item hover-none profile">
              <Dropdown
                children={<ProfilePic />}
                label={session?.user.user_metadata.name}
                options={[
                  { label: "Profile", icon: "fa-regular fa-user" },
                  { label: "Appointments", icon: "fa-solid fa-calendar" },
                  { label: "Signout", icon: "fa-solid fa-sign-out" },
                ]}
                onClick={(e) => handleDropdownClick(e)}
                direction="left"
              />
            </li>
          </>
        )}
      </div>

      {/* Modal for login and registration */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <>
          <div className="modal-body">
            <LoginForm onLoginSuccess={handleLoginSuccess} />
          </div>
        </>
      </Modal>

      {/* Modal for contact form */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <InputForm
          id="contact"
          states={[
            { id: "name", type: "name", label: "Name" },
            { id: "email", type: "email", label: "Email" },
            { id: "message", type: "textarea", label: "Message" },
          ]}
          onClose={() => setIsOpen(false)}
          onSubmit={async (states) => {
            if (!states.name || !states.email || !states.message) {
              alert.showAlert("warning", "Please fill in all fields");
              return;
            }
            const res = await sendEmail(
              states.name,
              states.email,
              states.message
            );
            if (res) {
              alert.showAlert("success", "Message sent successfully");
            } else {
              alert.showAlert("erro", "Failed to send message");
            }
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

      {/* Modal for appointments */}
      <AppointmentsModal
        isOpen={showAppointments}
        onClose={() => setShowAppointments(false)}
        session={session}
      />
    </nav>
  );
};

export default Navbar;
