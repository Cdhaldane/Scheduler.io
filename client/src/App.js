import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import "./App.css";
import Home from "./Views/Home.jsx";
import Admin from "./Views/Admin.jsx";
import Employee from "./Views/Employee.jsx";
import Navbar from "./Components/Navbar/Navbar.jsx";
import Footer from "./Components/Footer/Footer.jsx";
import Login from "./Components/Login/Login.jsx";
import ACMain from "./Views/AccountCreation/ACMain.jsx";
import BookingPage from "./Components/Bookings/BookingPage.jsx";
import Sidebar from "./Components/Sidebar/Sidebar.jsx";
import GuestBookingPage from "./Components/GuestBookingPage/GuestBookingPage.jsx";
import BookingSubmit from "./Components/Bookings/BookingSubmit.jsx";
import CustomerLogin from "./Components/Customer/CustomerLogin/CustomerLogin.jsx";
import CustomerRegister from "./Components/Customer/CustomerRegister/CustomerRegister.jsx";
import CustomerBookingPage from "./Components/Customer/CustomerLoginBooking/CustomerBookingPage.jsx";
import CustomerSubmitPage from "./Components/Customer/CustomerSubmitPage/CustomerSubmitPage.jsx";
import CustomerRegisterSubmitPage from "./Components/Customer/CustomerRegisterSubmitPage/CustomerRegisterSubmitPage.jsx";
import Alert from "./Components/Providers/Alert";
import Info from "./Views/Info";
import DevTools from "./Components/DevTools/DevTools";
import { FlexBoxWrapper } from "./Utils";
import * as db from "./Database";
import "./index.css";

import { createClient } from "@supabase/supabase-js";

/**
 * App Component
 * 
 * Purpose:
 * - The App component serves as the root component of the application.
 * - It manages the authentication state, session data, and routing for the application.
 * 
 * Inputs:
 * - None.
 * 
 * Outputs:
 * - JSX for rendering the application layout, including the navbar, footer, and main content based on the current route.
 */

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation() || "";
  const [users, setUsers] = useState([]);
  const [session, setSession] = useState(null);

  useEffect(() => {
    db.supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = db.supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const shouldRenderNavbarAndFooter = location.pathname !== "/create-account";

  useEffect(() => {
    const adminAuthClient = db.supabase.auth.admin;

    const fetchData = async () => {
      const {
        data: { users },
        error,
      } = await db.supabase.auth.admin.listUsers();
    };
    fetchData();
  }, []);

  return (
    <>
      <Alert />
      <DevTools />

      <div className="app">
        {shouldRenderNavbarAndFooter && (
          <Navbar
            isLoggedIn={isLoggedIn}
            isAdmin={isAdmin}
            setIsLoggedIn={(e) => setIsLoggedIn(e)}
            session={session}
          />
        )}

        <div className="app-main">
          <Routes>
            <Route
              path="/"
              element={<Home session={session} isAdmin={isAdmin} />}
            />
            <Route
              path="/admin"
              element={<Home session={session} type="admin" />}
            />
            <Route
              path="/employee"
              element={<Employee session={session} type="employee"/>}
            />
            <Route path="/login" element={<Login />} />
            <Route path="/info" element={<Info />} />
            <Route path="/create-account" element={<ACMain />} />
            <Route path="/booking" element={<BookingPage />} /> {/* Book Appointments button directs to BookingPage */}
            {/* merge guest booking page with customer booking page */}
            {/* <Route path="/guest-booking" element={<GuestBookingPage />} /> */}
            <Route path="/booking-submit" element={<BookingSubmit />} />
            <Route path="/customer-login" element={<CustomerLogin />} />
            <Route path="/customer-register" element={<CustomerRegister />} />
            <Route
              path="/customer-bookingPage"
              element={<CustomerBookingPage />}
            />
            <Route
              path="/customer-submitPage"
              element={<CustomerSubmitPage />}
            />
            <Route
              path="/customer-register-submitPage"
              element={<CustomerRegisterSubmitPage />}
            />
          </Routes>
        </div>
        {shouldRenderNavbarAndFooter && <Footer />}
      </div>
    </>
  );
}

export default App;
