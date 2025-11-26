// client/tests/edit.spec.js

const { test, expect } = require("@playwright/test");
const { login, createContact } = require("./utils/ContactActions");

test.describe("E2E Contacto: Edición", () => {
  let contactName;
  let uniqueId;

  test.beforeEach(async ({ page }) => {
    // SETUP: Creamos un contacto único ANTES de cada prueba
    uniqueId = Date.now();
    contactName = `Contacto-Edit-${uniqueId}`; // Nombre inicial único

    await login(page);
    await createContact(page, contactName);
  });

  test("Debe editar el nombre y el teléfono del contacto", async ({ page }) => {
    const NEW_NAME_UNIQUE = `Nombre-Editado-${uniqueId}`;

    // 💡 CORRECCIÓN: El nuevo número de teléfono es simplemente el ID único (Date.now())
    const NEW_PHONE_UNIQUE = uniqueId.toString();

    // 1. Localizar la fila creada por el setup y hacer clic en Editar
    const contactRow = page.locator(`li:has-text("${contactName}")`);
    await contactRow.locator('button:has-text("Editar")').click();

    // 2. Llenar los campos de edición con datos únicos
    await page.locator('input[type="text"]').nth(0).fill(NEW_NAME_UNIQUE);
    await page.locator('input[type="text"]').nth(1).fill(NEW_PHONE_UNIQUE);
    await page.click('button:has-text("Guardar Cambios")');

    // 3. Verificación Clave
    // Localizamos el contenedor de la fila con el NUEVO nombre único
    const newContactRow = page.locator(`li:has-text("${NEW_NAME_UNIQUE}")`);

    // 💡 CORRECCIÓN 1: El nombre debe ser un elemento <strong> o <h2> para que sea específico.
    await expect(
      newContactRow.locator(`strong:has-text("${NEW_NAME_UNIQUE}")`)
    ).toBeVisible();

    // 💡 CORRECCIÓN 2: Verificar que el teléfono está en la etiqueta <p> dentro de la fila.
    await expect(
      newContactRow.locator(`p:has-text("${NEW_PHONE_UNIQUE}")`) // 👈 Usamos <p>
    ).toBeVisible();

    // El nombre original NO debe ser visible
    await expect(page.locator(`text=${contactName}`)).not.toBeVisible();
  });

  // ----------------------------------------------------
  // 🗑️ Limpieza Automática (Teardown)
  // ----------------------------------------------------
  test.afterEach(async ({ page }) => {
    const UNIQUE_ID = uniqueId;
    const NAME_TO_DELETE = `Nombre-Editado-${UNIQUE_ID}`; // El nombre final del contacto

    // 1. Localizar el CONTENEDOR de la fila usando el nombre editado
    const contactLocator = page.locator(`li:has-text("${NAME_TO_DELETE}")`);

    if (await contactLocator.isVisible()) {
      console.log(`[Cleanup] Eliminando contacto editado: ${NAME_TO_DELETE}`);

      // 2. Aceptar el diálogo de confirmación antes del clic (previene bloqueo)
      page.once("dialog", (dialog) => {
        console.log(`[Cleanup] Aceptando diálogo: ${dialog.message()}`);
        dialog.accept();
      });

      // 3. Hacemos clic en el botón 'Eliminar' (dentro del contenedor único)
      await contactLocator.locator('button:has-text("Eliminar")').click();

      // 4. Verificación final: No debe estar visible
      await expect(contactLocator).not.toBeVisible();
    }
  });
});
