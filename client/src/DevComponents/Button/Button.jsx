import React, { useState, useEffect } from "react";
import { useDidMountEffect } from "../../Utils";
import "./Button.css";

/**
 * Button Component
 *
 * Purpose:
 * - The Button component provides a reusable button element with customizable styles and animations.
 * - It supports different colors, animations for enter and exit, and can be used individually or as part of a button group.
 *
 * Inputs:
 * - onClick: A callback function that is called when the button is clicked.
 * - children: The content to be displayed inside the button.
 * - className: Additional CSS classes to be applied to the button.
 * - type: The type attribute of the button (e.g., "button", "submit").
 * - color: The color of the button, which corresponds to a CSS variable.
 * - multiple: A boolean indicating whether the button is part of a group of buttons.
 * - enterAnimation: The CSS class for the enter animation.
 * - exitAnimation: The CSS class for the exit animation.
 * - exitTrigger: A dependency that triggers the exit animation when changed.
 * - ...props: Additional props to be passed to the button element.
 *
 * Outputs:
 * - JSX for rendering a single button or a group of buttons with the specified styles and animations.
 */

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
