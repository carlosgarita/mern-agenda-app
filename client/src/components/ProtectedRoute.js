// client/src/components/ProtectedRoute.js

import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Este componente recibe el elemento (la página) que debe renderizar
const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth(); // Obtenemos el estado del contexto

  // Si no está autenticado, lo enviamos al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, renderizamos las rutas hijas (la página solicitada)
  return <Outlet />;
};

export default ProtectedRoute;
