// client/src/services/api.js
import axios from "axios";

// 1. Obtener la URL del backend desde el entorno
const API_URL = process.env.REACT_APP_API_URL;

// 2. Crear una instancia de Axios (la base)
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 3. Interceptor (Adjuntar el Token JWT)
// Antes de cada solicitud, revisamos si hay un token y lo añadimos.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      // Añadimos el encabezado de Autorización solo si el token existe
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
