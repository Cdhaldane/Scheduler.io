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
import Navbar from "./components/Navbar/Navbar.jsx";
import Footer from "./components/Footer/Footer.jsx";
import Login from "./components/Login/Login.jsx";
import ACMain from "./Views/AccountCreation/ACMain";
import BookingPage from "./components/BookingPage/BookingPage.jsx";
import GuestBookingPage from "./components/GuestBookingPage/GuestBookingPage.jsx";
import SuccessfullyBookingPage from "./components/SuccessfullyBookingPage/SuccessfullyBookingPage.jsx";
import CustomerLogin from "./components/Customer/CustomerLogin/CustomerLogin.jsx";
import ForgotPassword from "./components/Customer/CustomerLogin/ForgotPassword.jsx";
import CustomerRegister from "./components/Customer/CustomerRegister/CustomerRegister.jsx";
import CustomerBookingPage from "./components/Customer/CustomerLoginBooking/CustomerBookingPage.jsx";
import CustomerSubmitPage from "./components/Customer/CustomerSubmitPage/CustomerSubmitPage.jsx";
import CustomerRegisterSubmitPage from "./components/Customer/CustomerRegisterSubmitPage/CustomerRegisterSubmitPage.jsx";
import AlertProvider from "./components/Alert/AlertProvider.jsx";
import Alert from "./components/Alert/Alert.jsx";
import Info from "./Views/Info.jsx";

function App() {
  const location = useLocation() || "";

  const shouldRenderNavbarAndFooter = location.pathname !== "/create-account";

  return (
    <AlertProvider>
      <Alert />
      <div className="app">
        {shouldRenderNavbarAndFooter && <Navbar />}
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
            <Route path="/forgot-password" element={<ForgotPassword />} />
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
