// server/controllers/authController.js

const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Función auxiliar para generar el token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1h", // El token expira en 1 hora
  });
};

// ----------------------
// 1. Lógica de Registro
// ----------------------
exports.registerUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // 1. Verificar si el usuario ya existe
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ msg: "El usuario ya existe." });
    }

    // 2. Crear un nuevo usuario (el hash de la contraseña ocurre en el 'pre-save' hook)
    user = new User({ username, password });
    await user.save();

    // 3. Generar Token de Autenticación
    const token = generateToken(user._id);

    res.status(201).json({
      msg: "Usuario registrado exitosamente",
      token, // Enviamos el token al cliente
      userId: user._id,
      username: user.username,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor durante el registro.");
  }
};

// ----------------------
// 2. Lógica de Login
// ----------------------
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // 1. Verificar si el usuario existe
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: "Credenciales inválidas." });
    }

    // 2. Comparar la contraseña (usando el método creado en el modelo)
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Credenciales inválidas." });
    }

    // 3. Generar Token de Autenticación
    const token = generateToken(user._id);

    res.json({
      msg: "Inicio de sesión exitoso",
      token,
      userId: user._id,
      username: user.username,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor durante el login.");
  }
};
