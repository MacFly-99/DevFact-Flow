import { test, expect } from '@playwright/test';

test("l'utilisateur peut se connecter", async ({ page }) => {
  const email = process.env.TEST_ADMIN_EMAIL;
  const password = process.env.TEST_ADMIN_PASSWORD;

  // Sécurité : On bloque le test si les variables ne sont pas définies
  if (!email || !password) {
    throw new Error("❌ Les variables TEST_ADMIN_EMAIL et TEST_ADMIN_PASSWORD sont manquantes dans .env.test");
  }

  await page.goto('/');
  
  // On attend que le formulaire soit visible
  await expect(page.locator('input[name="email"]')).toBeVisible();

  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  
  // On clique et on attend la redirection en même temps
  await Promise.all([
    page.waitForURL('**/dashboard', { timeout: 10000 }),
    page.click('button[type="submit"]')
  ]);

  await expect(page.locator('h1')).toContainText('Bonjour');
});