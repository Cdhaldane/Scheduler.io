import React, { useState, useRef, useEffect, cloneElement } from "react";
import { useAlert } from "../Providers/Alert";
import "./Input.css";

const Input = ({
  label,
  placeholder,
  value: propValue,
  onInputChange,
  type = "text",
  className,
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
          autoComplete="new-password"
          required={true}
          pattern={type === "tel" ? "[0-9]{3}-[0-9]{3}-[0-9]{4}" : null}
        />
      )}
      <label className={isActive ? "active" : ""}>{label}</label>
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
  const inputRef = useRef(null);
  const alert = useAlert();
  const [compacted, setCompacted] = useState(false);
  const [values, setValues] = useState({});

  useEffect(() => {
    const inputHeight = inputRef.current.getBoundingClientRect();
    const viewBox = document
      .querySelector(".modal-content")
      .getBoundingClientRect();
    if (inputHeight.bottom > viewBox.bottom) {
      setCompacted(true);
    }
  }, [inputRef]);

  const handleChange = (id, newValue) => {
    setValues({ ...values, [id]: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(values);
    onClose();
  };

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

// EXAMPLE USE

// <Input
//   label="Email"
//   placeholder="Email"
//   type="email"
//   value={email}
//   onInputChange={(newValue) => setEmail(newValue)}
// />;

// END
