import React, { useState, useEffect } from "react";

import "./Clock.css";

const Clock = () => {
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
    <div className="clock" style={{ backgroundImage: `url("./logo.png")` }}>
      <div className="clock-face"></div>
      {[...Array(12)].map((_, i) => (
        <div
          className="hour-mark"
          style={{ transform: `rotate(${i * 30}deg)` }}
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

export default Clock;
