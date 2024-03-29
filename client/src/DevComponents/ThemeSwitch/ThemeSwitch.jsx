import React, { useState, useRef, useEffect } from "react";
import "./ThemeSwitch.css";

/**
 * ThemeSwitch Component
 *
 * Purpose:
 * - The ThemeSwitch component provides a toggle switch for switching between light and dark modes.
 * - It updates the theme of the application and persists the theme selection in local storage.
 *
 * Inputs:
 * - props: An object containing the className prop for additional styling.
 *
 * Outputs:
 * - JSX for rendering the theme switch with icons for light and dark modes.
 */

function ThemeSwitch(props) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const sunRef = useRef(null);
  const moonRef = useRef(null);

  //Effect hook to update theme based on local storage
  useEffect(() => {
    if (isDarkMode) {
      moonRef.current?.classList.add("switch-active");
      sunRef.current?.classList.remove("switch-active");
      document.body.classList.remove("light-mode");
      localStorage.setItem("isDarkMode", true);
    } else {
      moonRef.current?.classList.remove("switch-active");
      sunRef.current?.classList.add("switch-active");
      document.body.classList.add("light-mode");
      localStorage.setItem("isDarkMode", false);
    }
  }, [isDarkMode]);

  //Render the theme switch with icons for light and dark modes
  return (
    <div className={props.className}>
      <label className="switch">
        <i
          ref={sunRef}
          className="fa-solid fa-sun"
          onClick={() => setIsDarkMode(false)}
          aria-label="Activate Light Mode"
        ></i>
        <div
          className={`slider-theme ${
            isDarkMode ? "slider-moon" : "slider-sun"
          }`}
        ></div>
        <i
          ref={moonRef}
          className="fa-solid fa-moon"
          onClick={() => setIsDarkMode(true)}
          aria-label="Activate Dark Mode"
        ></i>
      </label>
    </div>
  );
}

export default ThemeSwitch;
