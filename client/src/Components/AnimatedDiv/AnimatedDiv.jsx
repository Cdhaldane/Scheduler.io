import React, { useState, useEffect, useRef } from "react";
import { useDidMountEffect } from "../../Utils";
import "./AnimatedDiv.css";

/**
 * AnimatedDiv Component
 *
 * Purpose:
 * - A wrapper `div` component that supports customizable CSS animations for entry and exit transitions.
 * - The animation changes dynamically based on the `enterAnimation` and `exitAnimation` props.
 *
 * Notes:
 * - Ensure `useDidMountEffect` is correctly implemented to trigger effects only after the initial render.
 * - Define animations in the `AnimatedDiv.css` file to match the `enterAnimation` and `exitAnimation` prop values.
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
