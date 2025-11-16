// client/src/index.js

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom"; // Importar BrowserRouter
import { AuthProvider } from "./context/AuthContext"; // Importar el Provider

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    {/* BrowserRouter permite usar el sistema de rutas */}
    <BrowserRouter>
      {/* AuthProvider envuelve TODA la aplicación para compartir el estado de auth */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
