
/**
 * CalendarHeader Component
 *
 * Purpose:
 * - Displays controls for navigating the calendar and viewing organizational settings.
 * - Adapts layout based on screen width, supporting mobile and compact views.
 *
 *
 * State:
 * - `times`: Array defining available timeframes ("Day", "Week", "Month"), adjusted for mobile view.
 * - `isMobile`: Boolean indicating if the view is mobile-sized (width ≤ 768px).
 * - `isCompact`: Boolean indicating if the view is compact-sized (width ≤ 1477px).
 * - `organizationModal`: Boolean to control the visibility of the organization settings modal.
 *
 * Effects:
 * - On component mount and window resize, adjusts `times`, `isMobile`, and `isCompact` states based on screen width.
 *
 * UI Elements:
 * - Timeframe Button: Cycles through `times` and dispatches the selected timeframe to global state.
 * - View Toggle Button: Switches between full and compact calendar views.
 * - Organization Name: Opens the `OrganizationSettings` modal when clicked, displaying organization-specific settings.
 * - Current Date Display: Shows the current date(s) in compact or full format based on `isCompact`.
 *
 * 
 */




import React, { useState, useEffect } from "react";
import { setTime } from "../../../../Store.js";
import { useSelector, useDispatch } from "react-redux";
import OrganizationSettings from "../../../Organization/OrganizationSettings.jsx";
import Modal from "../../../../DevComponents/Modal/Modal.jsx";

import "./CalendarHeader.css";

const CalendarHeader = ({
  setLoading,
  timeFrameIndex,
  setTimeFrameIndex,
  timeFrame,
  setFullView,
  fullView,
  organization,
  currentView,
}) => {
  const [times, setTimes] = useState(["Day", "Week", "Month"]);
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isCompact, setCompact] = useState(window.innerWidth <= 1477);
  const [organizationModal, setOrganizationModal] = useState(false);

  useEffect(() => {
    if (isMobile) setTimes(["Day", "Week"]);
    window.addEventListener("resize", () => {
      if (window.innerWidth <= 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }

      if (window.innerWidth <= 1477) {
        setCompact(true);
      } else {
        setCompact(false);
      }
    });
  }, []);

  return (
    <div className="calendar-top">
      <div className={`calendar-top-buttons ${isMobile && "mobile"}`}>
        <button
          onClick={() => {
            setLoading(true);
            if (timeFrameIndex >= times.length - 1) setTimeFrameIndex(0);
            else setTimeFrameIndex(timeFrameIndex + 1);
            dispatch(setTime(times[timeFrameIndex + 1] || times[0]));
          }}
          className={`timeframe-button`}
        >
          <i className="fa-solid fa-calendar mr-10"></i>
          {!isMobile && <h1>{timeFrame}</h1>}
        </button>
        <button
          onClick={() => {
            setFullView(!fullView);
          }}
          className={`timeframe-button`}
        >
          <i className="fa-solid fa-cog mr-10"></i>
          {!isMobile && (fullView ? <h1>Compact</h1> : <h1>Full</h1>)}
        </button>
      </div>
      {organization?.name && (
        <div
          className="calendar-top-title"
          onClick={() => setOrganizationModal(true)}
        >
          {organization.name}
        </div>
      )}

      <h2 className="calendar-top-time noselect">
        {isCompact
          ? currentView[0]?.toLocaleDateString("en-US", {
              weekday: "short",
              month: "numeric",
              day: "numeric",
              year: "numeric",
            })
          : currentView[0]?.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
      </h2>

      <Modal
        isOpen={organizationModal}
        onClose={() => setOrganizationModal(false)}
        label="Organization Settings"
      >
        <OrganizationSettings
          organization={organization}
          onClose={() => setOrganizationModal(false)}
        />
      </Modal>
    </div>
  );
};

export default CalendarHeader;
