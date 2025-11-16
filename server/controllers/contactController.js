// server/controllers/contactController.js

const Contact = require("../models/Contact");
// El modelo ya implementa el campo 'owner'

// 1. Obtener todos los contactos del usuario (R)
exports.getContacts = async (req, res) => {
  try {
    // Solo busca contactos donde el owner sea el ID del usuario autenticado
    const contacts = await Contact.find({ owner: req.user.id }).sort({
      fullName: 1,
    });
    res.json(contacts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor.");
  }
};

// 2. Crear un nuevo contacto (C)
exports.createContact = async (req, res) => {
  const { fullName, phoneNumber } = req.body;

  try {
    // El requisito Senior: El ID del dueño viene del token autenticado
    const newContact = new Contact({
      fullName,
      phoneNumber,
      owner: req.user.id, // <--- Aislamiento de datos
    });

    const contact = await newContact.save();
    res.status(201).json(contact);
  } catch (err) {
    console.error(err.message);
    // Si falla por unicidad u otro error de DB
    res.status(500).send("Error del servidor al crear contacto.");
  }
};

// 3. Actualizar un contacto (U)
exports.updateContact = async (req, res) => {
  const { fullName, phoneNumber } = req.body;

  try {
    // Buscamos y actualizamos, asegurando el DOBLE FILTRO: ID del contacto + ID del dueño
    let contact = await Contact.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      { fullName, phoneNumber },
      { new: true, runValidators: true } // Devolver el documento actualizado
    );

    if (!contact) {
      // 404 si no existe, o 401/403 si no le pertenece a este usuario
      return res
        .status(404)
        .json({ msg: "Contacto no encontrado o no autorizado." });
    }

    res.json(contact);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor al actualizar.");
  }
};

// 4. Eliminar un contacto (D)
exports.deleteContact = async (req, res) => {
  try {
    // Buscamos y eliminamos con DOBLE FILTRO
    const contact = await Contact.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!contact) {
      return res
        .status(404)
        .json({ msg: "Contacto no encontrado o no autorizado." });
    }

    res.json({ msg: "Contacto eliminado." });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor al eliminar.");
  }
};
