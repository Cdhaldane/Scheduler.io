import React, { useState, useEffect, useRef } from "react";
import { useDidMountEffect } from "../../Utils";
import "./AnimatedDiv.css";

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
