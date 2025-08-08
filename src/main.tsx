import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom"; // use hash while we debug
import App from "./App";
import "./index.css";

const root = document.getElementById("root");
if (!root) {
  throw new Error("Missing #root element");
}
createRoot(root).render(
  <HashRouter>
    <App />
  </HashRouter>
);
