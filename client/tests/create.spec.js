// client/tests/contact_crud.spec.js (Crea este nuevo archivo)

const { test, expect } = require("@playwright/test");

// Usar el mismo usuario válido o uno nuevo
const USERNAME_VALIDO = "mille aguirre";
const PASSWORD_VALIDA = "12345";

const UNIQUE_ID = Date.now();
const CONTACT_NAME = `Contacto-Test-${UNIQUE_ID}`;

test.describe("Pruebas E2E de Gestión de Contactos", () => {
  test.beforeEach(async ({ page }) => {
    // Ejecutar el login antes de cada prueba para asegurar que estamos autenticados
    await page.goto("/login");
    await page.fill('input[placeholder="Nombre de Usuario"]', USERNAME_VALIDO);
    await page.fill('input[placeholder="Contraseña"]', PASSWORD_VALIDA);
    await page.click('button:has-text("Entrar")');
    await expect(page).toHaveURL(/.*\/agenda/);
  });

  test("Debe permitir crear un nuevo contacto y mostrarlo en la tabla", async ({
    page,
  }) => {
    // 1. Localizar y llenar el formulario de creación
    await page.fill('input[placeholder="Nombre Completo"]', CONTACT_NAME);
    await page.fill('input[placeholder="Número de Teléfono"]', "123456789");

    // 2. Simular el clic en el botón de creación (Ajusta el texto si es diferente)
    await page.click('button:has-text("Añadir Contacto")');

    // 3. Verificación: El nuevo contacto debe estar visible en la tabla
    // Buscamos una celda de tabla o un elemento que contenga el nombre del contacto
    //await expect(page.locator(`text=${CONTACT_NAME}`)).toBeVisible();
    await expect(
      page.locator(`strong:has-text("${CONTACT_NAME}")`)
    ).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    // 1. Localizar el CONTENEDOR de la fila usando el nombre editado
    const contactLocator = page.locator(`li:has-text("${CONTACT_NAME}")`);

    if (await contactLocator.isVisible()) {
      console.log(`[Cleanup] Eliminando contacto editado: ${CONTACT_NAME}`);

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
