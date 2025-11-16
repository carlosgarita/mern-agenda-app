// client/src/App.js

import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

// Importar los componentes que crearemos en el siguiente paso
import Login from "./pages/Login";
import Register from "./pages/Register";
import Agenda from "./pages/Agenda";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas Privadas (Necesitan estar dentro de ProtectedRoute) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Agenda />} /> {/* Ruta por defecto */}
          <Route path="/agenda" element={<Agenda />} />
        </Route>

        {/* Opcional: Manejo de rutas no encontradas */}
        <Route path="*" element={<h1>404: Página no encontrada</h1>} />
      </Routes>
    </div>
  );
}

export default App;
