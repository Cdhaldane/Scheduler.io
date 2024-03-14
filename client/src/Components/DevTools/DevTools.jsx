import React, { useState, useEffect, useRef } from "react";
import "./DevTools.css"; // Make sure to create a corresponding CSS file for styling

const DevTools = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [localStorageData, setLocalStorageData] = useState({});
  const [sessionStorageData, setSessionStorageData] = useState({});
  const devRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (devRef.current && !devRef.current.contains(e.target)) {
        setIsCollapsed(true);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Collect and set localStorage data
    const localData = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key !== "debug" || key !== "WP_CRX_STORAGE_SNAPSHOT_/")
        localData[key] = localStorage.getItem(key);
    }
    setLocalStorageData(localData);

    // Collect and set sessionStorage data
    const sessionData = {};
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      sessionData[key] = sessionStorage.getItem(key);
    }
    setSessionStorageData(sessionData);
  }, []);

  const clearStorage = (type) => {
    if (type === "local") {
      localStorage.clear();
      setLocalStorageData({});
    } else {
      sessionStorage.clear();
      setSessionStorageData({});
    }
  };

  const getPretty = (data) => {
    const parseValue = (value) => {
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    };

    const parsedData = Object.entries(data).reduce((acc, [key, value]) => {
      acc[key] = typeof value === "string" ? parseValue(value) : value;
      return acc;
    }, {});

    return (
      <pre>
        {Object.entries(parsedData).map(([key, value], index) => (
          <div key={index} className="dev-tools-pretty">
            {key}:{" "}
            {typeof value === "object" && value !== null
              ? getPretty(value)
              : JSON.stringify(value)}
          </div>
        ))}
      </pre>
    );
  };
  return (
    <div
      className={`dev-tools ${isCollapsed ? "collapsed" : ""}`}
      style={{ position: "fixed", bottom: 0, left: 0, zIndex: 1000 }}
      ref={devRef}
    >
      <button onClick={() => setIsCollapsed(!isCollapsed)}>
        {isCollapsed ? <i className="fa-brands fa-dev"></i> : "Collapse"}
      </button>
      {!isCollapsed && (
        <div>
          <h4>
            Local Storage{" "}
            <button onClick={() => clearStorage("local")}>CLEAR</button>
          </h4>
          {/* <pre>{JSON.stringify(localStorageData, null, 2)}</pre> */}
          {getPretty(localStorageData)}
          <h4>
            Session Storage{" "}
            <button onClick={() => clearStorage("session")}>CLEAR</button>
          </h4>
          <pre>{JSON.stringify(sessionStorageData, null, 2)}</pre>
          {/* Add any other information you find useful for development */}
        </div>
      )}
    </div>
  );
};

export default DevTools;
