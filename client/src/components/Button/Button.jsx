import React, { useState, useEffect } from "react";
import { useDidMountEffect } from "../../Utils";
import "./Button.css";
const Button = ({
  onClick,
  children,
  className = "default",
  type = "button",
  color = "primary",
  multiple = false,
  enterAnimation,
  exitAnimation,
  exitTrigger,
  ...props
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

  if (multiple) {
    return (
      <div className="button-group">
        {React.Children.map(children, (child, index) => {
          return (
            <button
              type={type}
              className={`button ${className}`}
              onClick={onClick}
              style={{
                backgroundColor: `var(--${color})`,
              }}
              {...props}
            >
              {child}
            </button>
          );
        })}
      </div>
    );
  }
  return (
    <button
      type={type}
      className={`button ${className}`}
      onClick={onClick}
      style={{ backgroundColor: `var(--${color})` }}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
