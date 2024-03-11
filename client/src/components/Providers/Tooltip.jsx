import React, {
  createContext,
  useContext,
  useState,
  cloneElement,
} from "react";

import styled from "styled-components";

import "./Provider.css";

const Tooltip = ({ tooltipText, children, theme, direction }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { className, onClick } = children.props;

  const showTooltip = () => setIsVisible(true);
  const hideTooltip = () => setIsVisible(false);

  let colorVar = theme.color;

  if (!colorVar?.includes("#")) {
    colorVar = `var(--${colorVar})`;
  }

  const TooltipDiv = styled.div`
    /* Base styles for the tooltip */
    display: inline-block;
    position: relative;
    border: 3px solid ${colorVar};
    box-shadow: 2px 2px 6px ${colorVar});

    /* Styles for the :before pseudo-element */
    &::after {
      border-top: solid ${colorVar} 10px !important;
      border-bottom: ${
        direction === "down" ? "solid" + colorVar + " 10px" : "none"
      }; 
    }


  `;

  return (
    <div
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      className={"tooltip-container " + className}
      onClick={onClick}
    >
      {children}
      {isVisible && (
        <TooltipDiv className={"tooltip " + direction}>
          {tooltipText}
        </TooltipDiv>
      )}
    </div>
  );
};

export default Tooltip;
