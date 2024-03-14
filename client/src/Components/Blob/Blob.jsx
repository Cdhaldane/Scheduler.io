import React, { useState, useEffect, useRef } from "react";
import { useDidMountEffect } from "../../Utils";
import "./Blob.scoped.css";

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
