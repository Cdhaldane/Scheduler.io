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
import ACMain from "./Views/AccountCreation/ACMain";
import BookingPage from "./Components/BookingPage/BookingPage";
import Sidebar from "./Components/Sidebar/Sidebar";
import GuestBookingPage from "./Components/GuestBookingPage/GuestBookingPage";
import SuccessfullyBookingPage from "./Components/Guest/SuccessfullyBookingPage/SuccessfullyBookingPage";
import CustomerLogin from "./Components/Customer/CustomerLogin/CustomerLogin";
import CustomerRegister from "./Components/Customer/CustomerRegister/CustomerRegister";
import CustomerBookingPage from "./Components/Customer/CustomerLoginBooking/CustomerBookingPage";
import CustomerSubmitPage from "./Components/Customer/CustomerSubmitPage/CustomerSubmitPage";
import CustomerRegisterSubmitPage from "./Components/Customer/CustomerRegisterSubmitPage/CustomerRegisterSubmitPage";
import AlertProvider from "./Components/Alert/AlertProvider";
import Alert from "./Components/Alert/Alert";
import Info from "./Views/Info";
import DevTools from "./Components/DevTools/DevTools";
import * as db from "./Database";
import "./index.css";

import { createClient } from "@supabase/supabase-js";

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
    const fetchData = async () => {
      const data = await db.getUsers();
      console.log(data);
    };
    fetchData();
  }, []);

  return (
    <AlertProvider>
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
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/login" element={<Login />} />
            <Route path="/info" element={<Info />} />
            <Route path="/create-account" element={<ACMain />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/guest-booking" element={<GuestBookingPage />} />
            <Route
              path="/successfully-bookingPage"
              element={<SuccessfullyBookingPage />}
            />
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
    </AlertProvider>
  );
}

export default App;
