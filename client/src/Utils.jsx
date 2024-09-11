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
    el.style.animation = `${animation} 0.2s ease-in-out`;
    setTimeout(() => {
      setState(false);
    }, 180);
  }
  if (!state) {
    setState(true);
  }
};
