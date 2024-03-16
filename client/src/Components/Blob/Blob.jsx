import React, { useState, useEffect, useRef } from "react";
import { useDidMountEffect } from "../../Utils";
import "./Blob.scoped.css";

/**
 * `Blob` is a functional component that renders a decorative, animated blob composed of circles. It supports custom entrance and exit animations.
 *
 * Inputs:
 * - className: A string for the CSS class to be applied to the blob container for additional styling.
 * - blobAnimation: A boolean to toggle the animation on the blob's circles.
 * - width: A string or number defining the width of the blob container.
 * - height: A string or number defining the height of the blob container.
 * - enterAnimation: A string representing the CSS class for the entrance animation.
 * - exitAnimation: A string representing the CSS class for the exit animation.
 * - exitTrigger: A dependency that triggers the exit animation when changed.
 *
 * Output:
 * - JSX: The output is a JSX element that contains a div with four child divs, each representing a circle of the blob.
 * 
 * Example usage:
 * <Blob
    className={"ac-2"}
    blobAnimation={false}
    width={1300}
    height={1300}
    enterAnimation={"slideInLeft"}
    exitAnimation={"slideOutLeft"}
    exitTrigger={animation}
  />
 *
 * Purpose:
 * - The component is used to add animated decorative elements to calendar and schedule form componments, with the ability to control its appearance and disappearance through animations.
 */


const Blob = ({
  className,
  blobAnimation,
  width,
  height,
  enterAnimation,
  exitAnimation,
  exitTrigger,
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
    <div className={`${className} ${animationClass}`} style={{ width, height }}>
      <div className={`circle1 ${!blobAnimation ? "noanimate" : ""}`}></div>
      <div className={`circle2 ${!blobAnimation ? "noanimate" : ""}`}></div>
      <div className={`circle3 ${!blobAnimation ? "noanimate" : ""}`}></div>
      <div className={`circle4 ${!blobAnimation ? "noanimate" : ""}`}></div>
    </div>
  );
};

export default Blob;
