import React from "react";
// Import the Alert if you have it
import Alert, { AlertProvider } from "./Alert";
import Tooltip, { TooltipProvider } from "./Tooltip";

export const AppProviders = ({ children }) => {
  return (
    <AlertProvider>
      <TooltipProvider>{children}</TooltipProvider>
    </AlertProvider>
  );
};
