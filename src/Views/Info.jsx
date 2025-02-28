import React from "react";

/**
 * InfoPage Component
 * 
 * Purpose:
 * - The InfoPage component serves as an informational page for TimeSlot, providing details about the platform, its features, and how to get started.
 * 
 * Inputs:
 * - None.
 * 
 * Outputs:
 * - JSX for rendering the informational content, including sections for the mission, features, getting started, contact information, and testimonials.
 */

const InfoPage = () => {
  return (
    <div className="info-page">
      <h1>Welcome to TimeSlot!</h1>
      <p>
        At TimeSlot, we understand the value of your time. That's why we've
        developed a cutting-edge appointment scheduling platform designed to
        streamline the booking process for businesses and their clients alike.
        Whether you're a small salon, a bustling dental clinic, or a vibrant
        fitness studio, TimeSlot is here to transform how you manage your
        appointments.
      </p>

      <h2>Our Mission</h2>
      <p>
        To provide a seamless, efficient, and user-friendly scheduling
        experience that not only meets the needs of service-based businesses but
        also enhances the booking process for clients.
      </p>

      <h2>Why Choose TimeSlot?</h2>
      <ul>
        <li>
          <strong>Simplicity Meets Efficiency:</strong> Our intuitive interface
          makes booking and managing appointments a breeze for both businesses
          and clients.
        </li>
        <li>
          <strong>Customizable Scheduling:</strong> Tailor your available times,
          services, and special scheduling needs with our flexible customization
          options.
        </li>
        <li>
          <strong>Integrated Reminders:</strong> Reduce no-shows with automated
          email, SMS, and push notification reminders.
        </li>
        <li>
          <strong>Scalable Solutions:</strong> Whether you're booking 5 or 500
          appointments a day, TimeSlot scales with your business.
        </li>
        <li>
          <strong>Analytics and Insights:</strong> Access valuable insights into
          your business's performance, helping you make informed decisions.
        </li>
        <li>
          <strong>Mobile Optimized:</strong> Manage your appointments on the go
          with our responsive web and mobile applications.
        </li>
      </ul>

      <h2>Features</h2>
      <ul>
        <li>
          <strong>Online Booking:</strong> Allow your clients to book
          appointments anytime, anywhere.
        </li>
        <li>
          <strong>Client Management:</strong> Keep track of client information,
          appointment history, and preferences with ease.
        </li>
        <li>
          <strong>Customizable Time Slots:</strong> Set specific durations for
          different services, ensuring efficient scheduling.
        </li>
        <li>
          <strong>Automated Notifications:</strong> Send out appointment
          confirmations, reminders, and follow-ups automatically.
        </li>
        <li>
          <strong>Comprehensive Analytics:</strong> Gain insights into your most
          popular services, peak booking times, and client retention rates.
        </li>
        <li>
          <strong>Integration:</strong> Seamlessly sync with Google Calendar and
          other popular calendar systems for maximum accessibility.
        </li>
      </ul>

      <h2>Getting Started</h2>
      <p>
        Ready to take your appointment scheduling to the next level? Join
        TimeSlot today and experience the ultimate in scheduling convenience and
        efficiency. Sign up on our website, and our team will guide you through
        the setup process, ensuring a smooth transition for your business and
        your clients.
      </p>

      <h2>Contact Us</h2>
      <p>Have questions or need support? Our dedicated team is here to help:</p>
      <ul>
        <li>
          <strong>Email:</strong> support@timeslot.com
        </li>
        <li>
          <strong>Phone:</strong> 1-800-TIMESLOT
        </li>
        <li>
          <strong>Live Chat:</strong> Available on our website
        </li>
      </ul>

      <h2>Follow Us</h2>
      <p>Stay connected and up-to-date with the latest from TimeSlot:</p>
      <ul>
        <li>
          <strong>Facebook:</strong> @TimeSlotApp
        </li>
        <li>
          <strong>Twitter:</strong> @TimeSlotApp
        </li>
        <li>
          <strong>Instagram:</strong> @timeslot_app
        </li>
      </ul>

      <h2>Testimonials</h2>
      <p>Hear from our satisfied clients:</p>
      <blockquote>
        <p>
          "TimeSlot has revolutionized how we manage our appointments. It's
          user-friendly, efficient, and has significantly reduced our no-shows."
          - Alex, Salon Owner
        </p>
        <p>
          "The customizable time slots and automated reminders have been
          game-changers for our clinic. TimeSlot understands the needs of
          businesses and clients alike." - Dr. Johnson, Dental Clinic Manager
        </p>
      </blockquote>

      <p>
        Join the TimeSlot community today and transform your appointment
        scheduling process!
      </p>
    </div>
  );
};

export default InfoPage;
