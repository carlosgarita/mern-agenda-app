// client/tests/delete.spec.js

const { test, expect } = require("@playwright/test");
const { login, createContact } = require("./utils/ContactActions");

test.describe("E2E Contacto: Eliminación", () => {
  let contactName;
  let uniqueId;

  test.beforeEach(async ({ page }) => {
    // SETUP: Creamos un contacto único ANTES de cada prueba
    uniqueId = Date.now();
    contactName = `Contacto-Delete-${uniqueId}`; // Nombre inicial único

    await login(page);
    await createContact(page, contactName);
  });

  test("Debe eliminar el contacto de la lista", async ({ page }) => {
    // 1. Localizar la fila creada por el setup
    const contactRow = page.locator(`li:has-text("${contactName}")`);

    // 2. Aceptar el diálogo de confirmación antes del clic (previene bloqueo)
    page.once("dialog", (dialog) => {
      console.log(`[Cleanup] Aceptando diálogo: ${dialog.message()}`);
      dialog.accept();
    });

    // 2. Clic en Eliminar
    await contactRow.locator('button:has-text("Eliminar")').click();

    // 3. Verificación Clave: El contacto original NO debe ser visible
    // (Ajustar si tu UI tiene un modal de confirmación)
    await expect(page.locator(`text=${contactName}`)).not.toBeVisible();
  });
});
