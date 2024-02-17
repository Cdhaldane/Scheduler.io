import React, { useState, useEffect } from "react";
import Blob from "../../components/Blob/Blob";

import "./AC.css";

const AC = ({ onFinish }) => {
  const [page, setPage] = useState(0);
  const [animation, setAnimation] = useState(false);

  const handleNext = (x) => {
    if (x === 1) {
      setAnimation(!animation);
      setTimeout(() => {
        setPage(page + 1);
      }, 1000);
    } else if (x === 2) {
      setAnimation(!animation);
      setTimeout(() => {
        setPage(page + 1);
      }, 1000);
    }
  };

  useEffect(() => {
    if (page === 2) {
      setTimeout(() => {
        onFinish();
      }, 2000);
    }
  }, [page]);

  if (page === 0)
    return (
      <div className="ac-container" onClick={() => handleNext(1)}>
        <Blob
          className={"ac"}
          blobAnimation={true}
          width={300}
          height={300}
          enterAnimation={"fadeIn"}
          exitAnimation={"moveUp"}
          exitTrigger={animation}
        />

        <div class="typewriter">
          <h1>Hi! Welcome to TimeSlot!</h1>
        </div>
      </div>
    );
  else if (page === 1)
    return (
      <div
        className="ac-container-2"
        onClick={(e) => {
          let el = document.querySelector(".airis-2-span");
          if (e.target !== el && !el.contains(e.target)) {
            el.className = "airis-2-span glow";
          }
        }}
      >
        <div>
          <Blob
            className={"ac-2"}
            blobAnimation={false}
            width={1300}
            height={1300}
            enterAnimation={"slideInLeft"}
            exitAnimation={"slideOutLeft"}
            exitTrigger={animation}
          />
        </div>
        <div className="ac-2-main">
          <div>
            <div class="typewriter">
              <h1>Your business organization system</h1>
            </div>
            <div className="ac-2-content">
              <h1>What is your company name?</h1>
              <span onClick={() => handleNext(2)} className="airis-2-span">
                <input type="text" placeholder="Find anything..." />
                <i class="fa-solid fa-paper-plane"></i>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  else if (page === 2)
    return (
      <div className="ac-container" onClick={() => handleNext(1)}>
        <Blob
          className={"ac"}
          blobAnimation={true}
          width={300}
          height={300}
          enterAnimation={"fadeIn"}
          exitAnimation={"moveUp"}
          exitTrigger={animation}
        />
        <div>
          <h1>Finding the right one...</h1>
        </div>
      </div>
    );
};

export default AC;
