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
        </Routes>
      </div>
      {shouldRenderNavbarAndFooter && <Footer />}
    </div>
  );
}

export default App;
