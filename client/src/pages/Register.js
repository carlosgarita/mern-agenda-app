// client/src/pages/Register.js

import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Register = () => {
  // 1. Estados para los campos del formulario
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // El contexto de Auth no tiene una función 'register', pero el servicio sí.
  // Usaremos el servicio de forma indirecta, ya que el login maneja la redirección.
  // Vamos a usar la función 'login' del contexto para la simplicidad de la redirección.
  // PERO: Aquí llamaremos directamente al servicio para registrar.

  const { login } = useAuth(); // Usaremos login solo para la redirección post-registro

  // 2. Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      // Importar el servicio directamente para el registro
      const authService = (await import("../services/authService")).default;

      // 1. Llama al servicio de registro (POST /api/auth/register)
      const data = await authService.register(username, password);

      setMessage("✅ Registro exitoso. Iniciando sesión...");

      // 2. Usar la función login del contexto para forzar la actualización del estado y la redirección.
      // Esto es un pequeño truco ya que register() ya guarda el token.
      await login(username, password);
    } catch (err) {
      // Manejo de errores de la API (ej: usuario ya existe 400)
      const errorMsg =
        err.response?.data?.msg || "Error de conexión. Intente más tarde.";
      setError(errorMsg);
    }
  };

  return (
    <div style={styles.container}>
      <h2>✍️ Registrar Usuario</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        {error && <p style={styles.error}>{error}</p>}
        {message && <p style={styles.success}>{message}</p>}

        <input
          type="text"
          placeholder="Nombre de Usuario (Único)"
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
          Registrar
        </button>
      </form>

      <p style={styles.linkText}>
        ¿Ya tienes cuenta?{" "}
        <Link to="/login" style={styles.link}>
          Inicia Sesión
        </Link>
      </p>
    </div>
  );
};

// --- Reutilizando los estilos del Login ---
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
    backgroundColor: "#28a745",
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
  success: {
    color: "#155724",
    fontWeight: "bold",
    backgroundColor: "#d4edda",
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

export default Register;
