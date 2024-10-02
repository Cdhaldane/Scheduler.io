import React from "react";
import Clock from "../Components/AnimatedDiv/Clock/Clock.jsx";
import { useNavigate } from "react-router-dom";
import "./Styles/Landing.css"; // Ensure you have the corresponding CSS file

/**
 * Landing Component
 *
 * Purpose:
 * - The Landing component provides the landing page for the application.
 * - It features a hero section with a clock animation, a title, a brief description, and a 'Get Started' button.
 * - The features section highlights the key functionalities of the application, such as seamless scheduling, mobile optimization, and client management.
 * - The testimonials section showcases quotes from users praising the application's impact on their businesses.
 *
 * Inputs:
 * - None
 *
 * Outputs:
 * - JSX for rendering the landing page with a hero section, features section, and testimonials section.
 * - A handler for navigating to the organization creation page when the 'Get Started' button is clicked.
 */

const Landing = () => {
  const navigate = useNavigate();
  const isMobile = window.innerWidth <= 768;
  return (
    <div className="landing-page">
      {/* <img src="/banner.png" alt="banner" /> */}
      <section className="hero">
        {!isMobile && (
          <div className="landing-clock-container">
            <Clock className="landing-clock" offset={4} color="bg-secondary" />
            {/* <ThreeClock /> */}
          </div>
        )}
        <span>
          <h1 className="timeslot-title">
            TIME<span>SLOT</span>
          </h1>
          <h1>Simplify Your Scheduling</h1>
          <p>
            Effortless appointment booking and management for professionals.
          </p>
          {/* <Button
            onClick={() => navigate("/create-organization")}
            className="hero-button"
            color="secondary"
          >
            <span>Get Started</span>
          </Button> */}
        </span>
      </section>

      <section className="features">
        <h2>Features That Empower You</h2>
        <div className="feature-list">
          <div className="feature">
            <h3>
              <i className="fa-solid fa-calendar"></i>
              Seamless Scheduling
            </h3>
            <p>
              Intuitive calendar integration for hassle-free appointment setups.
            </p>
          </div>
          <div className="feature">
            <h3>
              <i className="fa-solid fa-mobile"></i>Mobile Optimized
            </h3>
            <p>
              Manage your appointments on the go with our responsive design.
            </p>
          </div>
          <div className="feature">
            <h3>
              <i className="fa-solid fa-landmark"></i>Client Management
            </h3>
            <p>
              Easily track client information and history for personalized
              service.
            </p>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <h2>Hear From Our Users</h2>
        <div className="testimonial">
          <blockquote>
            "TimeSlot has transformed how we handle bookings. It's incredibly
            user-friendly and efficient."
          </blockquote>
          <p>- Jane Doe, Salon Owner</p>
        </div>
        <div className="testimonial">
          <blockquote>
            "The ability to customize and integrate the scheduling tool into our
            daily operations has been a game-changer."
          </blockquote>
          <p>- John Smith, Fitness Studio Manager</p>
        </div>
      </section>
    </div>
  );
};

export default Landing;
