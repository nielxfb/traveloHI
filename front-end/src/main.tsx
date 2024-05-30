import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./main.css";
import BuildProviderTree from "./tools/build-provider-tree";
import { BrowserRouter } from "react-router-dom";
import AuthContextProvider from "./providers/auth-context-provider";
import ThemeContextProvider from "./providers/theme-context-provider";
import CurrencyContextProvider from "./providers/currency-context-provider";

const Providers = BuildProviderTree([
  BrowserRouter,
  AuthContextProvider,
  ThemeContextProvider,
  CurrencyContextProvider,
])

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Providers>
    <App />
  </Providers>
);
