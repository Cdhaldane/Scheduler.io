import React, { useState, useRef, useEffect } from "react";
import "./Input.css";

const Input = ({
  label,
  placeholder,
  value: propValue,
  onInputChange,
  type = "text",
}) => {
  const [isActive, setIsActive] = useState(propValue ? true : false);
  const [inputValue, setInputValue] = useState(propValue || "");
  const inputRef = useRef(null);

  // Update local state when propValue changes
  useEffect(() => {
    setInputValue(propValue || "");
    setIsActive(!!propValue);
  }, [propValue]);

  const handleChange = (event) => {
    setInputValue(event.target.value);
    if (onInputChange) {
      onInputChange(event.target.value);
    }
  };

  const handleFocus = () => {
    setIsActive(true);
  };

  const handleBlur = () => {
    if (!inputValue) {
      setIsActive(false);
    }
  };

  return (
    <div
      className={`input-container ${isActive ? "active" : ""}`}
      ref={inputRef}
    >
      <input
        type={type}
        value={inputValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        autoComplete="new-password"
      />
      <label className={isActive ? "active" : ""}>{label}</label>
    </div>
  );
};

export default Input;
