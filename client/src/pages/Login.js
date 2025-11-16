// client/src/pages/Login.js

import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Login = () => {
  // 1. Estados para los campos del formulario
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 2. Obtener la función 'login' de nuestro Contexto
  const { login } = useAuth();

  // 3. Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Limpiar errores previos

    try {
      // Llamada a la función de login del contexto (que usa authService.js)
      await login(username, password);
      // Si tiene éxito, el AuthContext redirigirá a /agenda
    } catch (err) {
      // Manejo de errores de la API (ej: credenciales inválidas 400)
      const errorMsg =
        err.response?.data?.msg || "Error de conexión. Intente más tarde.";
      setError(errorMsg);
    }
  };

  return (
    <div style={styles.container}>
      <h2>🔑 Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        {error && <p style={styles.error}>{error}</p>}

        <input
          type="text"
          placeholder="Nombre de Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Entrar
        </button>
      </form>

      <p style={styles.linkText}>
        ¿No tienes cuenta?{" "}
        <Link to="/register" style={styles.link}>
          Regístrate aquí
        </Link>
      </p>
    </div>
  );
};

// --- Estilos básicos (para que se vea presentable) ---
const styles = {
  container: {
    maxWidth: "400px",
    margin: "50px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    textAlign: "center",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    fontSize: "16px",
  },
  button: {
    padding: "12px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    fontWeight: "bold",
    backgroundColor: "#fdd",
    padding: "10px",
    borderRadius: "4px",
  },
  linkText: {
    marginTop: "20px",
  },
  link: {
    color: "#007bff",
    textDecoration: "none",
    fontWeight: "bold",
  },
};

export default Login;
