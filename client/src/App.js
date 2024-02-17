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
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Login from "./components/Login/Login";
import ACMain from "./Views/AccountCreation/ACMain";
import BookingPage from "./components/BookingPage/BookingPage";
import GuestBookingPage from "./components/GuestBookingPage/GuestBookingPage";

function App() {
  const location = useLocation() || "";

  const shouldRenderNavbarAndFooter = location.pathname !== "/create-account";

  return (
    <div className="app">
      {shouldRenderNavbarAndFooter && <Navbar />}
      <div className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-account" element={<ACMain />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/guest-booking" element={<GuestBookingPage />} />
        </Routes>
      </div>
      {shouldRenderNavbarAndFooter && <Footer />}
    </div>
  );
}

export default App;
