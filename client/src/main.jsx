import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/theme.css";
import "./styles/app.css";

import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { OptionsProvider } from "./context/OptionsContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <OptionsProvider>
          <App />
        </OptionsProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
