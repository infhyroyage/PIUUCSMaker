import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { RecoilRoot } from "recoil";

const root = document.getElementById("root");
if (root) {
  const app = (
    <RecoilRoot>
      <App />
    </RecoilRoot>
  );

  // developmentの場合のみStrictModeを外す
  ReactDOM.createRoot(root).render(
    process.env.NODE_ENV === "development" ? (
      app
    ) : (
      <StrictMode>{app}</StrictMode>
    )
  );
}
