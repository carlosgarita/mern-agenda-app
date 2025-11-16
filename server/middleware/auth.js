// server/middleware/auth.js

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware que verifica el token en el encabezado de la solicitud
const protect = async (req, res, next) => {
  let token;

  // 1. Verificar si el token está presente en el encabezado
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extraer el token (eliminar 'Bearer ')
      token = req.headers.authorization.split(" ")[1];

      // 2. Verificar y decodificar el token usando la clave secreta
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Buscar al usuario en la DB (excluyendo la contraseña)
      // Esto asegura que el token pertenece a un usuario válido y activo.
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res
          .status(401)
          .json({ msg: "Usuario no encontrado o token inválido." });
      }

      next(); // El token es válido, procede a la ruta
    } catch (error) {
      console.error(error);
      return res.status(401).json({ msg: "Token no autorizado o expirado." });
    }
  }

  if (!token) {
    return res
      .status(401)
      .json({ msg: "No se encontró token, acceso denegado." });
  }
};

module.exports = { protect };
