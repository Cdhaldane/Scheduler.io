import React, { useState, useEffect, useRef } from "react";
import "./DevTools.css"; // Ensure you have the corresponding CSS

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
    fetchStorageData();
  }, []);

  const fetchStorageData = () => {
    const localData = {};
    for (let i = 2; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      localData[key] = localStorage.getItem(key);
    }
    setLocalStorageData(localData);

    const sessionData = {};
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      sessionData[key] = sessionStorage.getItem(key);
    }
    setSessionStorageData(sessionData);
  };

  const clearStorage = (type) => {
    if (type === "local") {
      localStorage.clear();
      setLocalStorageData({});
    } else {
      sessionStorage.clear();
      setSessionStorageData({});
    }
  };

  const handleStorageUpdate = (e, key, type) => {
    const value = e.target.value;
    if (type === "local") {
      localStorage.setItem(key, value);
      setLocalStorageData({ ...localStorageData, [key]: value });
    } else {
      sessionStorage.setItem(key, value);
      setSessionStorageData({ ...sessionStorageData, [key]: value });
    }
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
          <div>
            {Object.entries(localStorageData).map(([key, value]) => (
              <div key={key}>
                {key}:{" "}
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleStorageUpdate(e, key, "local")}
                />
              </div>
            ))}
          </div>
          <h4>
            Session Storage{" "}
            <button onClick={() => clearStorage("session")}>CLEAR</button>
          </h4>
          <div>
            {Object.entries(sessionStorageData).map(([key, value]) => (
              <div key={key}>
                {key}:{" "}
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleStorageUpdate(e, key, "session")}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DevTools;
