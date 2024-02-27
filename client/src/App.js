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
import SuccessfullyBookingPage from "./components/SuccessfullyBookingPage/SuccessfullyBookingPage";
import CustomerLogin from "./components/Customer/CustomerLogin/CustomerLogin";
import CustomerRegister from "./components/Customer/CustomerRegister/CustomerRegister";
import CustomerBookingPage from "./components/Customer/CustomerLoginBooking/CustomerBookingPage"; 
import CustomerSubmitPage from "./components/Customer/CustomerSubmitPage/CustomerSubmitPage";
import CustomerRegisterSubmitPage from "./components/Customer/CustomerRegisterSubmitPage/CustomerRegisterSubmitPage";

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
          <Route path="/successfully-bookingPage" element={<SuccessfullyBookingPage />} />
          <Route path="/customer-login" element={<CustomerLogin />} />
          <Route path="/customer-register" element={<CustomerRegister />} />
          <Route path="/customer-bookingPage" element={<CustomerBookingPage />} />
          <Route path="/customer-submitPage" element={<CustomerSubmitPage />} />
          <Route path="/customer-register-submitPage" element={<CustomerRegisterSubmitPage/>}/>
        </Routes>
      </div>
      {shouldRenderNavbarAndFooter && <Footer />}
    </div>
  );
}

export default App;
