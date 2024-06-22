import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { NextUIProvider } from "@nextui-org/react";
import { AppProvider } from "./context.jsx";
import { Provider } from "react-redux";
import store from "./store/store.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
    <AppProvider>
      <NextUIProvider>
        <App />
      </NextUIProvider>
    </AppProvider>
    </Provider>
  </React.StrictMode>
);
