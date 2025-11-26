// client/src/pages/Login.js

import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import styles from "./Login.module.css";

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
    <div className={styles.loginContainer}>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <p className={styles.error}>{error}</p>}

        <input
          type="text"
          placeholder="Nombre de Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className={styles.input}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.input}
        />

        <button type="submit" className={styles.button}>
          Entrar
        </button>
      </form>

      <p className={styles.linkText}>
        ¿No tienes cuenta?{" "}
        <Link to="/register" className={styles.link}>
          Regístrate aquí
        </Link>
      </p>
    </div>
  );
};

export default Login;
