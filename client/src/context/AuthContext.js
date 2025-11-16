// client/src/context/AuthContext.js

import React, { createContext, useState, useEffect, useContext } from "react";
import authService from "../services/authService";
import { useNavigate } from "react-router-dom";

// 1. Creación del Contexto
const AuthContext = createContext(null);

// Hook personalizado para usar el contexto fácilmente
export const useAuth = () => useContext(AuthContext);

// 2. Creación del Componente Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Almacena el ID del usuario o datos
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado de sesión
  const navigate = useNavigate();

  // Al cargar, verificar si hay un token en localStorage
  useEffect(() => {
    const token = authService.getCurrentUser();
    const userId = localStorage.getItem("userId");

    if (token && userId) {
      // Idealmente, se debe validar el token contra el servidor.
      // Por ahora, asumimos que si el token existe, el usuario está logueado.
      setIsAuthenticated(true);
      setUser(userId);
    }
  }, []); // Se ejecuta solo al montar el componente

  // Función de LOGIN
  const login = async (username, password) => {
    const data = await authService.login(username, password);

    if (data.token) {
      setIsAuthenticated(true);
      setUser(data.userId);
      navigate("/agenda"); // Redirigir a la página de contactos después del login
    }
    return data;
  };

  // Función de LOGOUT
  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
    navigate("/login"); // Redirigir a la página de login
  };

  // El valor que se comparte con todos los componentes
  const value = {
    isAuthenticated,
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
