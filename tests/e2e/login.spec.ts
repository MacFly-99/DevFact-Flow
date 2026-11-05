import { test, expect } from '@playwright/test';

test("l'utilisateur peut se connecter", async ({ page }) => {
  // 1. On va sur la page de login
  await page.goto('/');
  
  // 2. On attend que le réseau soit calme (React est chargé)
  await page.waitForLoadState('networkidle');

  // 3. On remplit les champs
  await page.fill('input[name="email"]', 'admin@devfact-flow.com');
  await page.fill('input[name="password"]', '4dm1nP4ss!');
  
  // 4. On clique ET on attend la redirection en même temps
  await Promise.all([
    page.waitForURL('**/dashboard', { timeout: 10000 }), // Attend 10s max
    page.click('button[type="submit"]')
  ]);

  // 5. On vérifie qu'on est bien arrivé sur le dashboard
  await expect(page.locator('h1')).toContainText('Bonjour');
});