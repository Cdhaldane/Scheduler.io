import React from "react";
// Import the Alert if you have it
import Alert, { AlertProvider } from "./Alert";
import Tooltip, { TooltipProvider } from "./Tooltip";

/**
 * AppProviders Component
 * 
 * Purpose:
 * - The AppProviders component is a higher-order component that wraps the application with multiple context providers.
 * - It ensures that the entire application has access to the functionalities provided by these contexts.
 * 
 * Inputs:
 * - children: The child components of the AppProviders, typically the entire application.
 * 
 * Outputs:
 * - JSX for rendering the application wrapped with the necessary context providers.
 */

export const AppProviders = ({ children }) => {
  return (
    <AlertProvider>
      <TooltipProvider>{children}</TooltipProvider>
    </AlertProvider>
  );
};
