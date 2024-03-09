import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom"; // Import BrowserRouter
import { AppProviders } from "./Components/Providers/Provider";
import App from "./App"; // Import your App component

ReactDOM.render(
  <Router>
    <AppProviders>
      <App />
    </AppProviders>
  </Router>,
  document.getElementById("root")
);
