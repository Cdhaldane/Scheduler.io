import React, { useState, useEffect, useRef } from "react";
import { useDidMountEffect } from "../../Utils";
import "./AnimatedDiv.css";


/**
 * AnimatedDiv Component
 *
 * Purpose:
 * - Provides a wrapper `div` with support for customizable CSS animations on entry and exit.
 * - Allows animations to be dynamically triggered based on specified props.
 *
 *
 * Notes:
 * - Ensure that CSS animations corresponding to `enterAnimation` and `exitAnimation` are defined in the stylesheets.
 * - The `useDidMountEffect` hook should be defined to apply effects only after the component has initially mounted.
 */



const AnimatedDiv = ({
  className = "",
  enterAnimation,
  exitAnimation,
  exitTrigger,
  children,
}) => {
  const [animationClass, setAnimationClass] = useState("");

  useEffect(() => {
    if (enterAnimation) {
      setAnimationClass(enterAnimation);
    }
  }, [enterAnimation]);

  useDidMountEffect(() => {
    if (exitAnimation) {
      setAnimationClass(exitAnimation);
    }
  }, [exitTrigger]);

  return (
    <div
      className={`animated-div ${className}`}
      style={{ animationName: animationClass }}
    >
      {children}
    </div>
  );
};

export default AnimatedDiv;
