// server/routes/contactRoutes.js

const express = require("express");
const { protect } = require("../middleware/auth"); // Importamos el middleware de protección
const {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
} = require("../controllers/contactController");

const router = express.Router();

// Todas estas rutas usan el middleware 'protect'
router
  .route("/")
  .get(protect, getContacts) // GET /api/contacts (Protegida)
  .post(protect, createContact); // POST /api/contacts (Protegida)

router
  .route("/:id")
  .put(protect, updateContact) // PUT /api/contacts/:id (Protegida)
  .delete(protect, deleteContact); // DELETE /api/contacts/:id (Protegida)

module.exports = router;
