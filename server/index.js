// server/index.js

// Importar dotenv para cargar variables de entorno
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5001;

const authRoutes = require("./routes/authRoutes");

const contactRoutes = require("./routes/contactRoutes");

// Definir los orígenes permitidos
const allowedOrigins = [
  "http://localhost:3000", // Desarrollo local
  // Utiliza la variable de Render. Se incluirá si existe; si no, será 'undefined'
  process.env.FRONTEND_URL,
].filter(Boolean); // .filter(Boolean) elimina las entradas 'undefined' o 'null' de la lista

// Middleware básicos
app.use(express.json());

app.use(
  cors({
    // Usa el OR de JavaScript para decirle al servidor que use el dominio de Render,
    // pero que caiga en localhost:3000 si la variable no existe (sólo para desarrollo)
    origin: process.env.FRONTEND_URL || "http://localhost:3000",

    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api/auth", authRoutes); // 2. Usar

// Middleware de registro simple para ver cada solicitud recibida
app.use((req, res, next) => {
  console.log(`[REQUEST] Método: ${req.method} - URL: ${req.url}`);
  next(); // Continúa al siguiente middleware o ruta
});

// --- Conexión a la Base de Datos ---
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Conectado a MongoDB Atlas."))
  .catch((err) => console.error("Error al conectar a MongoDB:", err));

// --- Rutas ---
// La ruta principal para verificar que el servidor funciona
app.get("/", (req, res) => {
  res.send("API de Agenda en funcionamiento.");
});

// Rutas de contactos (Protegidas)
app.use("/api/contacts", contactRoutes);

// Iniciar Servidor
app.listen(PORT, () => {
  console.log(`Servidor Express en funcionamiento en el puerto ${PORT}`);
  console.log(`Acceda a: http://localhost:${PORT}`);
});
