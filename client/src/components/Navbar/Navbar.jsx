import React, {useState} from "react";
import LoginForm from "../Login/Login.jsx";
import BookingPage from "../Customer/CustomerLoginBooking/CustomerBookingPage.jsx"
import RegisterAccount from "../Customer/CustomerRegister/CustomerRegister.jsx"
import { useNavigate } from "react-router-dom";
import "./Navbar.css"; // Import the CSS file
import GuestBookingPage from "../Guest/GuestBookingPage/GuestBookingPage.jsx";




const AdminNavbar = ({ isAdmin }) => {
  const navigate = useNavigate();


  {/* if the user is an Admin only show them these icons on the navbar*/}
  return (
    <div>
      {isAdmin && (
        <div className="admin-navbar">
        <li>
          {/* Info */}
          <a onClick={() => navigate("/admin")}>
          <i class="fa-solid fa-clipboard"></i>
          </a>
      </li>

      <li>
        {/* Contact */}
        <a onClick={() => navigate("/admin")}>
        <i class="fa-solid fa-plus"></i>
        </a>
      </li>
      <li>
            {/* Sign-in */}
            <a onClick={() => navigate("login")}>
            <i class="fa-regular fa-user"></i>
            </a>
          </li> 
      </div>
      )}
    </div>
  );
};


{/* if the user is logged in as a customer ONLY, show them these icons on the navbar*/}
const LoggedInNavbar =  ({isLoggedIn}) => {
  const navigate = useNavigate();
  

  {/*Dashboard page*/}
  return (
    <div>
      {isLoggedIn && (
        <div className="loggedin-navbar">

      <li>
        {/* Contact */}
        <a onClick={() => navigate("customer-commentpage")}>
          <i className="fa-solid fa-message"></i>
        </a>
      </li>
      <li>
            {/* Sign-in */}
            <a onClick={() => navigate("customer-landingpage")}>
            <i class="fa-solid fa-user"></i>
            </a>
          </li> 
      </div>
      )}
    </div>
  );

}


const Navbar = ({isAdmin}) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  
  const handleLoginSuccess = () => {
    setLoggedIn(true);
    setShowModal(false);
    setShowLogin(false);
  };
  const handleModalClose = () => {
    setShowModal(false);
  }

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-header">
          <img src={"./logo.png"} alt="website logo" />
          {/*Click on the image and navigate to the admin side of the pages*/}
          <h1 onClick={() => navigate("./admin")}>Time Slot</h1>
            </div>
        <ul>
          <li>
            {/*Open the log in Modal, Dissapear when logged in*/}
          {showLogin && (
            <a href="#" onClick={() => setShowModal(true)}>
              <i class="fa-solid fa-arrow-right-to-bracket"></i>
            </a>
          )}
          </li>
          {/*Conditionally render items based on booleans from AdminNavbar and isLoggedIn navbar */}
          <AdminNavbar isAdmin={isAdmin}/>
          <LoggedInNavbar isLoggedIn={isLoggedIn}/>
        </ul>

      {/*Log in pop up page (modal)*/}
      <div className="modal fade top-centered" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: showModal ? 'block' : 'none' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <button type="button" className="close" onClick={() => setShowModal(false)} aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            <div className="modal-body" style={{maxHeight: '80vh', overflowY: 'auto'}}>
                    {/* Render dynamic content based on modalContent */}
                    {(showRegister && <RegisterAccount onClose={handleModalClose}/> ) || (showLoginForm && <LoginForm onLoginSuccess={handleLoginSuccess} onClose={handleModalClose} />)}
            </div>
            <div className="modal-footer">
              {/* Additional modal footer content if needed */}
              {showRegister ? (
                <>
                  <button onClick={() => { setShowRegister(false); setShowLoginForm(true); }}>
                    Back to Login
                  </button>
                </>
              ) : (
                <button onClick={() => { setShowRegister(true); setShowLoginForm(false); }}>
                  Want to create an account?
                </button>
              )}
              </div>
          </div>
        </div>
      </div>
      {/*End Modal*/}
  </div>
 </nav>
  );
  
};

export default Navbar;
