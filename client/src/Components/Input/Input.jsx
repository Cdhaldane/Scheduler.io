import React, { useState, useRef, useEffect, cloneElement } from "react";
import { useAlert } from "../Providers/Alert";
import "./Input.css";

/**
 * Input Component
 * 
 * Purpose:
 * - The Input component provides a reusable and customizable input field with dynamic label positioning.
 * 
 * Inputs:
 * - label: The label for the input field.
 * - placeholder: The placeholder text for the input field.
 * - value: The value of the input field (controlled by the parent component).
 * - onInputChange: A callback function that is called when the input value changes.
 * - type: The type of the input field (e.g., "text", "email", "password", "tel").
 * - className: Additional class names for styling the input container.
 * 
 * Outputs:
 * - JSX for rendering the input field with dynamic label positioning and optional styling.
 * 
 *EXAMPLE USE: 
  <Input
   label="Email"
   placeholder="Email"
   type="email"
   value={email}
   onInputChange={(newValue) => setEmail(newValue)}
 />;
 */

const Input = ({
  label,
  placeholder,
  value: propValue,
  onInputChange,
  onSubmit,
  type = "text",
  className,
  icon,
}) => {
  const [isActive, setIsActive] = useState(propValue ? true : false);
  const [inputValue, setInputValue] = useState(propValue || "");
  const [hasChanged, setHasChanged] = useState(false);
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
    setHasChanged(true);
  };

  const handleFocus = () => {
    setIsActive(true);
  };

  const handleBlur = () => {
    if (!inputValue) {
      setIsActive(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(inputValue);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSubmit(inputValue);
    }
  };

  return (
    <div
      id="input-container"
      className={`input-container ${
        isActive && "active"
      } type-${type} ${className} ${hasChanged && "changed"}`}
      ref={inputRef}
    >
      {type === "textarea" ? (
        <textarea
          value={inputValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          autoComplete="new-password"
        />
      ) : (
        <input
          type={type}
          value={inputValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onSubmit={(e) => handleSubmit(e)}
          autoComplete="new-password"
          required={true}
          pattern={type === "tel" ? "[0-9]{3}-[0-9]{3}-[0-9]{4}" : null}
          onKeyDown={(e) => handleKeyPress(e)}
        />
      )}
      <label className={isActive ? "active" : ""}>{label}</label>
      {icon && (
        <i onClick={(e) => handleSubmit(e)} className={`icon ${icon}`}></i>
      )}
    </div>
  );
};

export const InputForm = ({
  states,
  onSubmit,
  id,
  children,
  onClose,
  buttonLabel,
  successMessage,
}) => {
  // Ref for the form element 
  const inputRef = useRef(null);
  const alert = useAlert();
  const [compacted, setCompacted] = useState(false);
  const [values, setValues] = useState({});

  //Effect hook to adjust the form height when the input fields are too long
  useEffect(() => {
    const inputHeight = inputRef.current.getBoundingClientRect();
    const viewBox = document
      .querySelector(".modal-content")
      .getBoundingClientRect();
    if (inputHeight.bottom > viewBox.bottom) {
      setCompacted(true);
    }
  }, [inputRef]);

  // Function to handle input changes
  const handleChange = (id, newValue) => {
    setValues({ ...values, [id]: newValue });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(values);
    onClose();
  };

  // Render the input form
  return (
    <div>
      <div className="input-form-title">
        {id.toUpperCase().replace("-", " ")}
      </div>
      <form
        onSubmit={handleSubmit}
        ref={inputRef}
        className={`input-form ${compacted && "compacted"}`}
      >
        {states.map((state, index) => {
          return state.child ? (
            cloneElement(state.child, {
              onChange: (value) => handleChange(state.id, value),
              value: values[state.id],
              id: state.id,
              className: "input-container",
            })
          ) : (
            <Input
              label={state.label}
              type={state.type}
              onInputChange={(value) => handleChange(state.id, value)}
            />
          );
        })}
        {children}
        <button type="submit">{buttonLabel}</button>
      </form>
    </div>
  );
};

export default Input;


