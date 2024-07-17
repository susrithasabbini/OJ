import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { NextUIProvider } from "@nextui-org/react";
import { AppProvider } from "./context.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AppProvider>
    <NextUIProvider>
      <App />
    </NextUIProvider>
  </AppProvider>
);
