import React, {
  createContext,
  useContext,
  useState,
  cloneElement,
} from "react";

import styled from "styled-components";

import "./Provider.css";

// Context for the tooltip
const TooltipContext = createContext();

export const useTooltip = () => {
  return useContext(TooltipContext);
};

export const TooltipProvider = ({ children }) => {
  const [tooltip, setTooltip] = useState({ visible: false, content: "" });

  // Function to show the tooltip
  const showTooltip = (content) => setTooltip({ visible: true, content });

  // Function to hide the tooltip
  const hideTooltip = () => setTooltip({ visible: false, content: "" });

  return (
    <TooltipContext.Provider value={{ tooltip, showTooltip, hideTooltip }}>
      {children}
    </TooltipContext.Provider>
  );
};

const ToolTip = ({ children, tooltipText, theme }) => {
  const { showTooltip, hideTooltip, tooltip } = useTooltip();
  const { className, id, onClick } = children.props;

  console.log(children.props);

  const Tooltip = styled.div`
    /* Base styles for the tooltip */
    display: inline-block;
    position: relative;
    border: 3px solid var(--${theme.color});
    box-shadow: 2px 2px 6px var(--${theme.color});

    /* Styles for the :before pseudo-element */
    &::after {
      border-top: solid var(--${theme.color}) 10px !important;
    }
  `;

  return (
    <div
      className={`tooltip-container ${className}`}
      id={id}
      onClick={onClick}
      tooltipText="Add Service"
      onMouseEnter={() => showTooltip(tooltipText)}
      onMouseLeave={hideTooltip}
    >
      {children}
      <Tooltip
        className="tooltip"
        style={{
          visibility: tooltip.visible ? "visible" : "hidden",
        }}
      >
        {tooltipText}
      </Tooltip>
    </div>
  );
};

export default ToolTip;
