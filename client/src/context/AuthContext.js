// client/src/context/AuthContext.js

import React, { createContext, useState, useEffect, useContext } from "react";
import authService from "../services/authService";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Ahora 'user' almacenará el nombre de usuario (string)
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Al cargar, verificar si hay un token y el NOMBRE DE USUARIO
  useEffect(() => {
    const token = authService.getCurrentUser();
    // ⚠️ CAMBIO 1: Leer el nombre de usuario ('username')
    const username = localStorage.getItem("username");

    if (token && username) {
      setIsAuthenticated(true);
      // ⚠️ CAMBIO 2: Guardar el nombre de usuario en el estado
      setUser(username);
    }
  }, []);

  // Función de LOGIN
  const login = async (username, password) => {
    // Asegúrate de que tu authService.login() devuelve { token, userId, username }
    const data = await authService.login(username, password);

    if (data.token) {
      // ⚠️ CAMBIO 3: Guardar el nombre de usuario en localStorage
      localStorage.setItem("username", data.username);

      // Mantenemos el userId por si lo usas en otros sitios
      localStorage.setItem("userId", data.userId);

      setIsAuthenticated(true);
      // ⚠️ CAMBIO 4: Guardar el nombre de usuario en el estado del contexto
      setUser(data.username);
      navigate("/agenda");
    }
    return data;
  };

  // Función de LOGOUT
  const logout = () => {
    authService.logout();
    // ⚠️ CAMBIO 5: Limpiar la nueva clave 'username'
    localStorage.removeItem("username");
    localStorage.removeItem("userId"); // Limpia el ID también

    setIsAuthenticated(false);
    setUser(null);
    navigate("/login");
  };

  // El valor que se comparte con todos los componentes
  const value = {
    isAuthenticated,
    user, // user ahora contiene el nombre de usuario
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
