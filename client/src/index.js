import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom"; // Import BrowserRouter
import { AppProviders } from "./Components/Providers/Providers";
import store from "./Store";
import { Provider } from "react-redux";
import App from "./App"; // Import your App component

ReactDOM.render(
  <Router>
    <Provider store={store}>
      <AppProviders>
        <App />
      </AppProviders>
    </Provider>
  </Router>,
  document.getElementById("root")
);
