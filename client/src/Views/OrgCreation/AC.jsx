import React, { useState, useEffect } from "react";
import AnimatedDiv from "../../Components/AnimatedDiv/AnimatedDiv";
import Clock from "../../Components/AnimatedDiv/Clock/Clock";
import Button from "../../DevComponents/Button/Button";
import Input from "../../DevComponents/Input/Input";
import "./AC.css";

/**
 * AC Component
 *
 * Purpose:
 * - The AC (Account Creation) component provides a user interface for creating a new organization account.
 * - It consists of multiple pages with animations for transitioning between pages.
 * - The first page is a welcome message with a button to proceed.
 * - The second page collects information about the organization through a series of input fields.
 * - The third page displays a message indicating that the account creation process is in progress.
 *
 * Inputs:
 * - onFinish: A callback function that is called when the account creation process is completed.
 * - session: A session object containing user session information (optional).
 *
 * Outputs:
 * - JSX for rendering the different pages of the account creation process with animations and input fields.
 * - The collected organization information is passed to the onFinish callback function upon completion.
 */

const AC = ({ onFinish, session }) => {
  const [page, setPage] = useState(0);
  const [animation, setAnimation] = useState(false);
  const [inputAnimation, setInputAnimation] = useState("slideInRight");
  const [organization, setOrganization] = useState({});
  const [labelIndex, setLabelIndex] = useState(0);
  const [loginModal, setLoginModal] = useState(true);

  const options = [
    { label: "What is your organization's name?", value: "name", type: "text" },
    {
      label: "What is your organization's email?",
      value: "email",
      type: "email",
    },
    {
      label: "What is your organization's phone number?",
      value: "phone",
      type: "tel",
    },
    {
      label: "What is your organization's address?",
      value: "address",
      type: "address",
    },
  ];

  const [inputLabel, setInputLabel] = useState(options[labelIndex]);

  const [value, setValue] = useState("");

  const handleNext = () => {
    setAnimation(!animation);
    setTimeout(() => {
      setPage(page + 1);
    }, 1000);
  };

  useEffect(() => {
    if (page === 2) {
      setTimeout(() => {
        onFinish(organization);
      }, 2000);
    }
  }, [page]);

  if (page === 0)
    return (
      <div className="ac-container column" onClick={() => handleNext(1)}>
        <AnimatedDiv
          enterAnimation={"slideInTop"}
          exitAnimation={"slideOutTop"}
          exitTrigger={animation}
          className={"ac-top"}
        >
          <div className="hourglass"></div>
        </AnimatedDiv>

        <div className="typewriter">
          <h1>Hi, Welcome to TimeSlot!</h1>
        </div>
        <Button
          className="button-lg button-transparent ac-button"
          onClick={() => handleNext(1)}
        >
          <i className="fa-solid fa-arrow-right"></i>
        </Button>
      </div>
    );
  else if (page === 1)
    return (
      <div className="ac-container column">
        <AnimatedDiv
          enterAnimation={"slideInLeft"}
          exitAnimation={"slideOutLeft"}
          exitTrigger={animation}
          className={"ac-top"}
        >
          {" "}
          <Clock />
        </AnimatedDiv>

        <div className="ac-bottom">
          <div className="typewriter">
            <h1>Create your organization</h1>
          </div>
          <div
            className={`animated-div ac-span`}
            style={{ animationName: inputAnimation, animationDuration: "0.5s" }}
          >
            <Input
              label={inputLabel?.label}
              placeholder="Organization Name"
              type={inputLabel?.type}
              value={value}
              onInputChange={(newValue) => setValue(newValue)}
              className={"ac-input"}
              icon={"fa-solid fa-paper-plane"}
              onSubmit={() => {
                setInputAnimation("slideOutRight");
                setTimeout(() => {
                  setInputAnimation("slideInRight");
                }, 1000);
                setInputLabel(options[labelIndex + 1]);
                setLabelIndex(labelIndex + 1);
                setOrganization({
                  ...organization,
                  [inputLabel?.value]: value,
                });
                setValue("");
                if (labelIndex === options.length - 1) {
                  handleNext(2);
                }
              }}
            />
          </div>
        </div>
      </div>
    );
  else if (page === 2)
    return (
      <div className="ac-container column" onClick={() => handleNext(1)}>
        <AnimatedDiv
          enterAnimation={"slideInTop"}
          exitAnimation={"slideOutTop"}
          exitTrigger={animation}
          className={"ac-top"}
        >
          <div className="hourglass"></div>
        </AnimatedDiv>

        <div className="ac-content">
          <h1>Creating your organization...</h1>
        </div>
      </div>
    );
};

export default AC;
