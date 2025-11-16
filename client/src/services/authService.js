// client/src/services/authService.js
import api from "./api";

const authService = {
  // Función para registrar un usuario
  register: async (username, password) => {
    // POST /api/auth/register
    const response = await api.post("/auth/register", { username, password });

    // Almacenamos el token al recibirlo
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.userId);
    }
    return response.data;
  },

  // Función para iniciar sesión
  login: async (username, password) => {
    // POST /api/auth/login
    const response = await api.post("/auth/login", { username, password });

    // Almacenamos el token al recibirlo
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.userId);
    }
    return response.data;
  },

  // Función para cerrar sesión
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
  },

  // Verificar si hay token
  getCurrentUser: () => {
    return localStorage.getItem("token");
  },
};

export default authService;
