// client/src/services/contactService.js

import api from "./api";

const contactService = {
  // 1. OBTENER TODOS LOS CONTACTOS (GET /api/contacts)
  getContacts: async () => {
    try {
      // El token se añade automáticamente por el interceptor de 'api'
      const response = await api.get("/contacts");
      return response.data; // Devuelve el array de contactos
    } catch (error) {
      // Manejo de errores de la API (ej: token expirado 401)
      throw error;
    }
  },

  // 2. CREAR UN NUEVO CONTACTO (POST /api/contacts)
  createContact: async (contactData) => {
    try {
      // contactData debe contener { fullName, phoneNumber }
      const response = await api.post("/contacts", contactData);
      return response.data; // Devuelve el nuevo contacto con su ID
    } catch (error) {
      throw error;
    }
  },

  // 3. ACTUALIZAR UN CONTACTO (PUT /api/contacts/:id)
  updateContact: async (id, contactData) => {
    try {
      // contactData debe contener { fullName, phoneNumber }
      const response = await api.put(`/contacts/${id}`, contactData);
      return response.data; // Devuelve el contacto actualizado
    } catch (error) {
      throw error;
    }
  },

  // 4. ELIMINAR UN CONTACTO (DELETE /api/contacts/:id)
  deleteContact: async (id) => {
    try {
      const response = await api.delete(`/contacts/${id}`);
      return response.data; // Devuelve un mensaje de éxito
    } catch (error) {
      throw error;
    }
  },
};

export default contactService;
