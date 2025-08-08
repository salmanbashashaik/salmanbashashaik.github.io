import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { HashRouter } from "react-router-dom";
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
    <HashRouter>
      <App />
      </HashRouter>
  </BrowserRouter  >
  </React.StrictMode>
);
