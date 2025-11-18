// client/src/pages/Agenda.js

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import contactService from "../services/contactService"; // Importar el nuevo servicio

const Agenda = () => {
  const { user, logout } = useAuth();

  // Estados principales
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados del formulario (para añadir o editar)
  const [newContact, setNewContact] = useState({
    fullName: "",
    phoneNumber: "",
  });
  const [isEditing, setIsEditing] = useState(null); // ID del contacto si estamos editando

  // -----------------------------------------------------
  // FUNCIONES CRUD
  // -----------------------------------------------------

  // A. Función para Cargar Contactos (READ)
  const fetchContacts = async () => {
    try {
      setLoading(true);
      const data = await contactService.getContacts();
      setContacts(data);
      setError(null);
    } catch (err) {
      setError(
        "Error al cargar contactos. ¿Token expirado? Intente iniciar sesión de nuevo."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // B. Función para Añadir/Editar Contacto (CREATE/UPDATE)
  const handleSaveContact = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (isEditing) {
        // UPDATE (Editar)
        const updatedContact = await contactService.updateContact(
          isEditing,
          newContact
        );

        // Actualizar el estado local (map)
        setContacts(
          contacts.map((c) => (c._id === isEditing ? updatedContact : c))
        );
        setIsEditing(null); // Salir del modo edición
      } else {
        // CREATE (Añadir)
        const createdContact = await contactService.createContact(newContact);
        setContacts([...contacts, createdContact]);
      }

      // Limpiar el formulario
      setNewContact({ fullName: "", phoneNumber: "" });
    } catch (err) {
      setError(err.response?.data?.msg || "Error al guardar contacto.");
    }
  };

  // C. Función para Eliminar Contacto (DELETE)
  const handleDelete = async (id) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar este contacto?")
    ) {
      try {
        await contactService.deleteContact(id);
        // Filtrar el contacto eliminado del estado local
        setContacts(contacts.filter((c) => c._id !== id));
      } catch (err) {
        setError("Error al eliminar contacto.");
      }
    }
  };

  // D. Función para entrar en Modo Edición
  const handleEdit = (contact) => {
    setIsEditing(contact._id);
    setNewContact({
      fullName: contact.fullName,
      phoneNumber: contact.phoneNumber,
    });
  };

  // -----------------------------------------------------
  // useEffect: Cargar contactos al montar
  // -----------------------------------------------------
  useEffect(() => {
    fetchContacts();
  }, []); // Se ejecuta solo una vez al cargar la página

  // -----------------------------------------------------
  // RENDERIZADO
  // -----------------------------------------------------
  // -----------------------------------------------------

  if (loading) return <div style={styles.loading}>Cargando contactos...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>📞 Agenda de {user}</h2>
        <button onClick={logout} style={styles.logoutButton}>
          Cerrar Sesión
        </button>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {/* Formulario de Añadir/Editar */}
      <div style={styles.formContainer}>
        <h3>{isEditing ? "✏️ Editar Contacto" : "➕ Añadir Nuevo Contacto"}</h3>
        <form onSubmit={handleSaveContact} style={styles.form}>
          <input
            type="text"
            placeholder="Nombre Completo"
            value={newContact.fullName}
            onChange={(e) =>
              setNewContact({ ...newContact, fullName: e.target.value })
            }
            required
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Número de Teléfono"
            value={newContact.phoneNumber}
            onChange={(e) =>
              setNewContact({ ...newContact, phoneNumber: e.target.value })
            }
            required
            style={styles.input}
          />
          <button type="submit" style={styles.saveButton}>
            {isEditing ? "Guardar Cambios" : "Añadir Contacto"}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={() => {
                setIsEditing(null);
                setNewContact({ fullName: "", phoneNumber: "" });
              }}
              style={styles.cancelButton}
            >
              Cancelar
            </button>
          )}
        </form>
      </div>

      {/* Lista de Contactos */}
      <div style={styles.listContainer}>
        <h3>Lista de Contactos ({contacts.length})</h3>
        {contacts.length === 0 ? (
          <p>No tienes contactos guardados. ¡Añade uno!</p>
        ) : (
          <ul style={styles.ul}>
            {contacts.map((contact) => (
              <li key={contact._id} style={styles.li}>
                <div>
                  <strong>{contact.fullName}</strong>
                  <p>{contact.phoneNumber}</p>
                </div>
                <div style={styles.actions}>
                  <button
                    onClick={() => handleEdit(contact)}
                    style={styles.editButton}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(contact._id)}
                    style={styles.deleteButton}
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

// --- Estilos ---
const styles = {
  container: {
    maxWidth: "800px",
    margin: "50px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #eee",
    paddingBottom: "10px",
    marginBottom: "20px",
  },
  logoutButton: {
    padding: "8px 15px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
  loading: { textAlign: "center", padding: "50px" },
  error: {
    color: "red",
    fontWeight: "bold",
    backgroundColor: "#fdd",
    padding: "10px",
    borderRadius: "4px",
    marginBottom: "15px",
  },
  formContainer: {
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    marginBottom: "30px",
    backgroundColor: "#fff",
  },
  form: { display: "flex", gap: "10px", flexWrap: "wrap" },
  input: {
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    flexGrow: 1,
    minWidth: "150px",
  },
  saveButton: {
    padding: "10px 20px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  cancelButton: {
    padding: "10px 20px",
    backgroundColor: "#ffc107",
    color: "#333",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  listContainer: {
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#fff",
  },
  ul: { listStyle: "none", padding: 0 },
  li: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px",
    borderBottom: "1px solid #eee",
    transition: "background-color 0.2s",
  },
  actions: { display: "flex", gap: "10px" },
  editButton: {
    padding: "5px 10px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  deleteButton: {
    padding: "5px 10px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default Agenda;
