// server/index.js

const express = require("express");
const cors = require("cors");
// ...

// Definir los orígenes permitidos en un array
// 1. Siempre se permite el origen local (http://localhost:3000)
// 2. Se permite el origen de producción (leído de la variable de Render)
const allowedOrigins = [
  "http://localhost:3000",
  // Aseguramos que solo se añada si la variable existe en Render
  process.env.FRONTEND_URL,
].filter(Boolean); // .filter(Boolean) elimina entradas nulas o vacías

// Configuración de CORS
app.use(
  cors({
    origin: function (origin, callback) {
      // Permitir peticiones sin origen (ej: Postman, CURL, o el mismo servidor)
      if (!origin) return callback(null, true);

      // Si el origen está en nuestra lista (localhost o Vercel), permitir
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        // Rechazar si no está en la lista (este es el error que estás viendo)
        callback(new Error("No permitido por CORS. Origen: " + origin));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// ...
