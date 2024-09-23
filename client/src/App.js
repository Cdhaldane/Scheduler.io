import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
  Navigate,
} from "react-router-dom";

import "./App.css";
import Landing from "./Views/Landing.jsx";
import Home from "./Views/Home.jsx";
import Admin from "./Views/Admin.jsx";
import Employee from "./Views/Employee.jsx";
import Appointments from "./Views/Appointments.jsx";
import Navbar from "./Components/Navbar/Navbar.jsx";
import Login from "./Components/Login/Login.jsx";
import ResetPassword from "./Components/Login/LoginResetPassword.jsx";
import ACMain from "./Views/OrgCreation/ACMain.jsx";
import BookingPage from "./Components/Bookings/BookingPage.jsx";
import BookingSubmit from "./Components/Bookings/BookingSubmit.jsx";
import NotFoundPage from "./Views/404.jsx";
import Alert from "./Components/Providers/Alert";
import Info from "./Views/Info";
import Spinner from "./Components/Spinner/Spinner";
import CookieConsent from "./DevComponents/CookieConsent/CookieConsent.jsx";
import Modal from "./DevComponents/Modal/Modal.jsx";
import DevTools from "./DevComponents/DevTools/DevTools.jsx";
import Footer from "./DevComponents/Footer/Footer.jsx";

import { initializeTheme } from "./DevComponents/ThemeSwitch/ThemeSwitch.jsx";

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
  const [organization, setOrganization] = useState({});
  const location = useLocation() || "";
  const [users, setUsers] = useState([]);
  const [session, setSession] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [loginModal, setLoginModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (session) {
        const isAdmin = localStorage.getItem("isAdmin");
        setIsAdmin(true);
        setIsLoggedIn(true);
      }
      // if (session?.user.user_metadata.organization) {
      //   setOrganization(session.user.user_metadata.organization);
      // } else {
      if (location.pathname === "/") return;
      const org = await db.getOrganization(location.pathname.split("/")[2]);
      if (org) {
        setOrganization(org);
      }
      // }
    };
    fetchData().finally(() => {
      setIsLoading(false);
    });
  }, [session, location.pathname]);

  useEffect(() => {
    window.addEventListener("resize", () => {
      if (window.innerWidth <= 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    });
    initializeTheme();
  }, []);

  useEffect(() => {
    db.supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("session", session);
      setSession(session);
    });

    const {
      data: { subscription },
    } = db.supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (event === "INITIAL_SESSION") {
        // handle initial session
      } else if (event === "SIGNED_IN") {
        // handle sign in event
      } else if (event === "SIGNED_OUT") {
        setIsLoggedIn(false);
        navigate("/");
      } else if (event === "PASSWORD_RECOVERY") {
        console.log("PASSWORD_RECOVERY");
      } else if (event === "TOKEN_REFRESHED") {
        // handle token refreshed event
      } else if (event === "USER_UPDATED") {
        // handle user updated event
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const shouldRenderNavbarAndFooter =
    location.pathname === "/create-organization";

  const isCalendar =
    location.pathname === "/admin" ||
    location.pathname === "/home" ||
    location.pathname.includes("/employee");

  const handleOrganizationCreate = (org) => {
    setIsAdmin(true);
    setOrganization(org);
    db.updateUser(org, session.user);
  };

  const setOrgDefault = async () => {
    if (session) {
      const o = await db.getOrganization(
        "bce8fd49-4a09-4d41-83e9-7c0a13bca6c3"
      );
      if (o) console.log("o", o);
      db.updateUser(o, session.user);
    }
  };

  if (isLoading) return <Spinner />;
  return (
    <>
      <Alert />

      <DevTools setOrgDefault={setOrgDefault} />

      <div className="app" id="app">
        {!shouldRenderNavbarAndFooter ? (
          <Navbar
            isLoggedIn={isLoggedIn}
            isAdmin={isAdmin}
            setIsLoggedIn={(e) => setIsLoggedIn(e)}
            session={session}
            organization={organization}
            isCalendar={isCalendar}
          />
        ) : (
          <nav className={`navbar title`}></nav>
        )}

        <Routes>
          <Route path="/" element={<Landing />} />
          {session ? (
            <>
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
              <Route
                path="/admin/:organizationId/employee/:employeeId"
                element={
                  <Home
                    session={session}
                    type="employee"
                    organization={organization}
                  />
                }
              />
              <Route
                path="/appointments"
                element={<Appointments session={session} />}
              />
              <Route
                path="/admin/:organizationId"
                element={
                  <Home
                    session={session}
                    type="admin"
                    organization={organization}
                  />
                }
              />
              <Route
                path="/employee"
                element={<Employee session={session} type="employee" />}
              />
            </>
          ) : (
            <Route
              path="/create-organization"
              element={<Login type="page" />}
            />
          )}
          <Route
            path="/home/:organizationId"
            element={
              <Home
                session={session}
                type="customer"
                organization={organization}
              />
            }
          />

          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/info" element={<Info />} />

          <Route path="/booking" element={<BookingPage />} />
          <Route path="/booking-submit" element={<BookingSubmit />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        <CookieConsent />
        {!shouldRenderNavbarAndFooter && <Footer />}
      </div>
      <Modal isOpen={loginModal} onClose={() => setLoginModal(false)}>
        <Login
          onLoginSuccess={() => {
            setIsLoggedIn(true);
            setLoginModal(false);
          }}
        />
      </Modal>
    </>
  );
}

export default App;
