import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import "./App.css";
import Home from "./Views/Home";
import Admin from "./Views/Admin";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import Login from "./Components/Login/Login";
import ACMain from "./Views/OrgCreation/ACMain";
import BookingPage from "./Components/Bookings/BookingPage";
import Sidebar from "./Components/Sidebar/Sidebar";
import GuestBookingPage from "./Components/GuestBookingPage/GuestBookingPage";
import BookingSubmit from "./Components/Bookings/BookingSubmit";
import CustomerLogin from "./Components/Customer/CustomerLogin/CustomerLogin";
import CustomerRegister from "./Components/Customer/CustomerRegister/CustomerRegister";
import CustomerBookingPage from "./Components/Customer/CustomerLoginBooking/CustomerBookingPage";
import CustomerSubmitPage from "./Components/Customer/CustomerSubmitPage/CustomerSubmitPage";
import CustomerRegisterSubmitPage from "./Components/Customer/CustomerRegisterSubmitPage/CustomerRegisterSubmitPage";
import Alert from "./Components/Providers/Alert";
import Info from "./Views/Info";
import DevTools from "./Components/DevTools/DevTools";
import { FlexBoxWrapper } from "./Utils";
import * as db from "./Database";
import "./index.css";

import { createClient } from "@supabase/supabase-js";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [organization, setOrganization] = useState({});
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

  const shouldRenderNavbarAndFooter =
    location.pathname !== "/create-organization";

  const isCalendar =
    location.pathname === "/admin" || location.pathname === "/";

  useEffect(() => {
    if (session) {
      const isAdmin = localStorage.getItem("isAdmin");
      if (isAdmin === "true") {
        setIsAdmin(true);
      }
      setIsLoggedIn(true);
    }
    const org = JSON.parse(localStorage.getItem("organization"));

    if (org) {
      setOrganization(org);
      setIsAdmin(true);
    }
  }, []);

  const handleOrganizationCreate = (org) => {
    setIsAdmin(true);
    setOrganization(org);
    localStorage.setItem("organization", JSON.stringify(org));
  };

  return (
    <>
      <Alert />
      {/* <DevTools /> */}

      <div className="app">
        {shouldRenderNavbarAndFooter && (
          <Navbar
            isLoggedIn={isLoggedIn}
            isAdmin={isAdmin}
            setIsLoggedIn={(e) => setIsLoggedIn(e)}
            session={session}
            organization={organization}
            isCalendar={isCalendar}
          />
        )}

        <Routes>
          <Route
            path="/"
            element={<Home session={session} type="customer" />}
          />
          <Route
            path="/admin"
            element={
              <Home
                session={session}
                type="admin"
                organization={organization}
              />
            }
          />
          <Route
            path="/admin/employee"
            element={
              <Home
                session={session}
                type="employee"
                organization={organization}
              />
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/info" element={<Info />} />
          <Route
            path="/create-organization"
            element={
              <ACMain
                handleOrganizationCreate={(val) =>
                  handleOrganizationCreate(val)
                }
              />
            }
          />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/guest-booking" element={<GuestBookingPage />} />
          <Route path="/booking-submit" element={<BookingSubmit />} />
          <Route path="/customer-login" element={<CustomerLogin />} />
          <Route path="/customer-register" element={<CustomerRegister />} />
          <Route
            path="/customer-bookingPage"
            element={<CustomerBookingPage />}
          />
          <Route path="/customer-submitPage" element={<CustomerSubmitPage />} />
          <Route
            path="/customer-register-submitPage"
            element={<CustomerRegisterSubmitPage />}
          />
        </Routes>
        {shouldRenderNavbarAndFooter && <Footer />}
      </div>
    </>
  );
}

export default App;
