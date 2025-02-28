import React, { useState, useEffect } from "react";

import "./Clock.css";

/**
 * Clock Component
 *
 * Purpose:
 * - Displays an analog clock with hour, minute, and second hands.
 * - Updates in real-time, providing a visually dynamic clock interface.
 *
 * State:
 * - `time` (Date): Tracks the current time and updates every second.
 *
 * Effects:
 * - `useEffect`: Sets up an interval to update the `time` state every second and clears the interval on component unmount.
 */

const Clock = ({
  width,
  height,
  offset,
  color = "bg-secondary",
  className,
}) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const getRotation = (hand, time) => {
    let deg = 0;
    let offset = -50;
    if (!time) time = new Date();
    if (hand === "hr") {
      const hour = time.getHours();
      const minute = time.getMinutes();
      deg = ((hour % 12) / 12) * 360 + (minute / 60) * 30; // 30 degrees per hour, plus a fraction based on minutes
    } else if (hand === "min") {
      const minute = time.getMinutes();
      deg = (minute / 60) * 360; // 360 degrees in a full minute cycle
    } else if (hand === "sec") {
      const second = time.getSeconds();
      deg = (second / 60) * 360; // 360 degrees in a full second cycle
      offset = 20;
    }

    return `rotate(${deg}deg) translate(0, ${offset}%)`;
  };

  return (
    <div
      className={`clock ${className}`}
      style={{
        backgroundImage: `url("/logo.png")`,
        backgroundPositionX: offset ? offset : 10 + "px",
        backgroundColor: `var(--${color})`,
        width: width,
        height: height,
      }}
      role="presentation"
    >
      <div className="clock-face"></div>
      {[...Array(12)].map((_, i) => (
        <div
          className="hour-mark"
          style={{ transform: `rotate(${i * 30}deg)` }}
          key={i}
        ></div>
      ))}
      <div
        className="hand hour"
        id="hr"
        style={{ transform: getRotation("hr") }}
      ></div>
      <div
        className="hand minute"
        id="min"
        style={{ transform: getRotation("min") }}
      ></div>
      <div
        className="hand second"
        id="sec"
        style={{ transform: getRotation("sec") }}
      ></div>
    </div>
  );
};

export const BackgroundClockContainer = ({ children }) => {
  const containerStyle = {
    position: "relative", // This allows absolute positioning inside the div
  };

  const overlayContentStyle = {
    position: "absolute", // This positions the content over the clock
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white", // Change the text color as needed
    // Add more styling here as needed
  };

  return (
    <div style={containerStyle}>
      <Clock />
      <div style={overlayContentStyle}>{children}</div>
    </div>
  );
};

export default Clock;
