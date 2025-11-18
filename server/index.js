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

const frontendURL =
  "https://mern-agenda-app-vercel-k7ztzudhe-carlosgs-projects-0e7da516.vercel.app";

// Definir los orígenes permitidos
const allowedOrigins = [
  "http://localhost:3000", // <-- ¡AÑADE ESTE ORIGEN LOCAL!
  process.env.FRONTEND_URL || frontendURL, // <-- Dominio de Vercel
];

// Middleware básicos
app.use(express.json()); // Permite a Express leer JSON en el body de las peticiones
app.use(
  cors({
    origin: function (origin, callback) {
      // Permitir peticiones sin origen (como Postman o CURL)
      // O si el origen está en nuestra lista de permitidos
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("No permitido por CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"], // Permite estos métodos
    allowedHeaders: ["Content-Type", "Authorization"], // Permite estos encabezados
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

// Rutas de autenticación (Públicas)
app.use("/api/auth", authRoutes);

// Rutas de contactos (Protegidas)
app.use("/api/contacts", contactRoutes);

// Iniciar Servidor
app.listen(PORT, () => {
  console.log(`Servidor Express en funcionamiento en el puerto ${PORT}`);
  console.log(`Acceda a: http://localhost:${PORT}`);
});
