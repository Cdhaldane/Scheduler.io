import { useState, useEffect, useCallback, useRef } from "react";

// useEventListener Hook
export const useEventListener = (eventName, handler, element = window) => {
  const savedHandler = useRef();

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const isSupported = element && element.addEventListener;
    if (!isSupported) return;

    const eventListener = (event) => savedHandler.current(event);
    element.addEventListener(eventName, eventListener);

    return () => {
      element.removeEventListener(eventName, eventListener);
    };
  }, [eventName, element]);
};

// useLocalStorage Hook
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
};

// useMediaQuery Hook
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(window.matchMedia(query).matches);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
};

//Custom keyFrames Hook
export const createKeyframes = (keyframeName, keyframeCSS) => {
  function createKeyframeStyleSheet() {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    document.head.appendChild(styleSheet);
    return styleSheet.sheet;
  }
  const sheet = createKeyframeStyleSheet();

  sheet.insertRule(
    `@keyframes ${keyframeName} ${keyframeCSS}`,
    sheet.cssRules.length
  );
};

// useDeviceType Hook
export const useDeviceType = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDeviceType = () => {
      const mobileWidthThreshold = 768;
      setIsMobile(window.innerWidth <= mobileWidthThreshold);
    };

    checkDeviceType();

    window.addEventListener("resize", checkDeviceType);

    return () => window.removeEventListener("resize", checkDeviceType);
  }, []);

  return isMobile;
};

export const getOffset = (el) => {
  const rect = el.getBoundingClientRect();
  return {
    left: rect.left + window.scrollX,
    top: rect.top + window.scrollY,
  };
};

export const useDidMountEffect = (func, deps) => {
  const didMount = useRef(false);
  useEffect(() => {
    if (didMount.current) func();
    else didMount.current = true;
  }, deps);
};

export const handleTwoWayCollapse = (state, setState, className, direction) => {
  let el = document.getElementsByClassName(className)[0];
  let animation = direction === "right" ? "slideOutRight" : "slideOutLeft";

  if (state && el) {
    console.log("collapsing");
    el.style.animation = `${animation} 0.3s ease-in-out`;
    setTimeout(() => {
      setState(false);
    }, 280);
  }
  if (!state) {
    setState(true);
  }
};

export const isToday = (someDate) => {
  if (!someDate) return false;
  const today = new Date();

  return (
    someDate.getDate() === today.getDate() &&
    someDate.getMonth() === today.getMonth() &&
    someDate.getFullYear() === today.getFullYear()
  );
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const calculateLuminance = (r, g, b) => {
  const normalize = (value) => {
    value /= 255; // Normalize to [0, 1]
    return value <= 0.03928
      ? value / 12.92
      : Math.pow((value + 0.055) / 1.055, 2.4);
  };

  const rNorm = normalize(r);
  const gNorm = normalize(g);
  const bNorm = normalize(b);

  return 0.2126 * rNorm + 0.7152 * gNorm + 0.0722 * bNorm;
};

const calculateContrastRatio = (hex1, hex2) => {
  const hexToRgb = (hex) => {
    // Remove leading '#' if present
    hex = hex.replace(/^#/, "");

    // Parse 3-character hex shorthand (e.g., #abc -> #aabbcc)
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((char) => char + char)
        .join("");
    }

    // Convert to RGB
    const bigint = parseInt(hex, 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
    };
  };

  const color1 = hexToRgb(hex1);
  const color2 = hexToRgb(hex2);
  const luminance1 = calculateLuminance(color1.r, color1.g, color1.b);
  const luminance2 = calculateLuminance(color2.r, color2.g, color2.b);
  const l1 = Math.max(luminance1, luminance2);
  const l2 = Math.min(luminance1, luminance2);

  return (l1 + 0.05) / (l2 + 0.05);
};

export const isReadable = (color1, color2) => {
  const ratio = calculateContrastRatio(color1, color2);
  return ratio >= 1.9;
};

export const convertMilitaryTime = (time) => {
  const [hour, minute] = time.split(":").map(Number);
  const period = hour >= 12 ? "PM" : "AM";
  const standardHour = hour % 12 || 12; // Use 12 for midnight and noon

  return `${standardHour}:${minute.toString().padStart(2, "0")} ${period}`;
};
