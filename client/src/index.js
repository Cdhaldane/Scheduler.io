import React from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import { HashRouter as Router } from "react-router-dom"; // Import BrowserRouter
import { AppProviders } from "./Components/Providers/Providers";
import store from "./Store";
import { Provider } from "react-redux";
import App from "./App"; // Import your App component

const container = document.getElementById("root");
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
  <Router>
    <Provider store={store}>
      <AppProviders>
        <App />
      </AppProviders>
    </Provider>
  </Router>
);
