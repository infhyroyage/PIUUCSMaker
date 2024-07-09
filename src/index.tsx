import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";
import App from "./App";
import "./global.css";

const root = document.getElementById("root");
if (root) {
  ReactDOM.createRoot(root).render(
    <StrictMode>
      <RecoilRoot>
        <App />
      </RecoilRoot>
    </StrictMode>
  );
}
