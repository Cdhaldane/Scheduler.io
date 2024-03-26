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
import Footer from "./Components/Footer/Footer.jsx";
import Login from "./Components/Login/Login.jsx";
import ResetPassword from "./Components/Login/LoginResetPassword.jsx";
import ACMain from "./Views/OrgCreation/ACMain.jsx";
import BookingPage from "./Components/Bookings/BookingPage.jsx";
import BookingSubmit from "./Components/Bookings/BookingSubmit.jsx";
import CookieConsent from "./Components/CookieConsent/CookieConsent.jsx";
import NotFoundPage from "./Views/404.jsx";
import Alert from "./Components/Providers/Alert";
import Modal from "./Components/Modal/Modal";
import Info from "./Views/Info";
import Spinner from "./Components/Spinner/Spinner";
import DevTools from "./Components/DevTools/DevTools";
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
      if (session?.user.user_metadata.organization) {
        setOrganization(session.user.user_metadata.organization);
      } else {
        const org = await db.getOrganization(location.pathname.split("/")[2]);
        setOrganization(org);
      }
    };

    setIsLoading(true);
    fetchData().finally(() => {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    });
  }, [session]);

  useEffect(() => {
    window.addEventListener("resize", () => {
      if (window.innerWidth < 768) {
        setIsMobile(true);
        window.location.reload();
      } else {
        setIsMobile(false);
        window.location.reload();
      }
    });
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

  const ProtectedRoute = ({ isLoggedIn, isLoading, children }) => {
    if (isLoading) return null;
    if (!isLoggedIn) {
      setLoginModal(true);
      return null;
    }

    return children;
  };

  const shouldRenderNavbarAndFooter =
    location.pathname === "/create-organization" ||
    location.pathname.includes("reset-password");

  const isCalendar =
    location.pathname === "/admin" ||
    location.pathname === "/home" ||
    location.pathname.includes("/employee");

  const handleOrganizationCreate = (org) => {
    setIsAdmin(true);
    setOrganization(org);
    db.updateUser(org, session.user);
  };
  if (isLoading) return <Spinner />;
  return (
    <>
      <Alert />
      {/* <DevTools /> */}

      <div className="app">
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
          <nav className={`navbar title`}>
            <img
              src="/logo.png"
              alt="website logo"
              className="navbar-logo"
              onClick={() => navigate("/")}
            />
            <h1>
              TIME<span>SLOT</span>
            </h1>
          </nav>
        )}

        <Routes>
          <Route path="/" element={<Landing />} />
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
          <Route
            path="/appointments"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn} isLoading={isLoading}>
                <Appointments session={session} />
              </ProtectedRoute>
            }
          />

          {/* Protect the Admin route */}
          <Route
            path="/admin/:organizationId"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn} isLoading={isLoading}>
                <Home
                  session={session}
                  type="admin"
                  organization={organization}
                />
              </ProtectedRoute>
            }
          />

          {/* Protect the Employee route */}
          <Route
            path="/admin/employee/:organizationId/:employeeId"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn} isLoading={isLoading}>
                <Home
                  session={session}
                  type="employee"
                  organization={organization}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employee"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn} isLoading={isLoading}>
                <Employee session={session} type="employee" />
              </ProtectedRoute>
            }
          />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/info" element={<Info />} />
          <Route
            path="/create-organization"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn} isLoading={isLoading}>
                <ACMain
                  handleOrganizationCreate={(val) =>
                    handleOrganizationCreate(val)
                  }
                />
              </ProtectedRoute>
            }
          />
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
