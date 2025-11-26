// client/tests/login.spec.js

const { test, expect } = require("@playwright/test");

// ⚠️ Reemplaza con credenciales válidas que existan en tu DB
const USERNAME_VALIDO = "mille aguirre";
const PASSWORD_VALIDA = "12345";

test.describe("Pruebas E2E de Autenticación", () => {
  test("Debe permitir al usuario iniciar sesión y redirigir a la Agenda", async ({
    page,
  }) => {
    // 1. Navegar a la página principal (que redirige a /login)
    await page.goto("/login");

    // 2. Localizar y llenar los campos de formulario
    await page.fill('input[placeholder="Nombre de Usuario"]', USERNAME_VALIDO);
    await page.fill('input[placeholder="Contraseña"]', PASSWORD_VALIDA);

    // 3. Simular el clic en el botón "Entrar"
    await page.click('button:has-text("Entrar")');

    // 4. Verificación Clave: Asegurarse de que la URL cambió a /agenda
    await expect(page).toHaveURL(/.*\/agenda/);

    // 5. Verificación de Contenido: Asegurarse de que el nombre del usuario se muestra
    const headerText = await page.textContent("h2");
    await expect(headerText).toContain(`Agenda de ${USERNAME_VALIDO}`);

    // 6. Verificación de Interfaz: El botón de cerrar sesión debe ser visible
    await expect(
      page.locator('button:has-text("Cerrar Sesión")')
    ).toBeVisible();
  });
});
