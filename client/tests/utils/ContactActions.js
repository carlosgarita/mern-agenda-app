// client/tests/utils/ContactActions.js

const { expect } = require("@playwright/test");

const USERNAME_VALIDO = "mille aguirre";
const PASSWORD_VALIDA = "12345";
const CONTACT_PHONE = "11223344"; // Teléfono fijo para todas las pruebas

async function login(page) {
  await page.goto("/login");
  await page.fill('input[placeholder="Nombre de Usuario"]', USERNAME_VALIDO);
  await page.fill('input[placeholder="Contraseña"]', PASSWORD_VALIDA);
  await page.click('button:has-text("Entrar")');
  await expect(page).toHaveURL(/.*\/agenda/);
}

// Retorna el nombre único que se creó (el ID único)
async function createContact(page, uniqueName) {
  await page.fill('input[placeholder="Nombre Completo"]', uniqueName);
  await page.fill('input[placeholder="Número de Teléfono"]', CONTACT_PHONE);
  await page.click('button:has-text("Añadir Contacto")');

  // Esperamos a que el elemento sea visible antes de continuar
  await expect(page.locator(`text=${uniqueName}`)).toBeVisible();
  return uniqueName;
}

module.exports = {
  login,
  createContact,
  CONTACT_PHONE,
};
