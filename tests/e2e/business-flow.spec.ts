import { test, expect } from '@playwright/test';

test('Parcours complet : Devis -> Acceptation -> Facture', async ({ page }) => {
  test.setTimeout(90000); 

  // 1. Connexion
  await page.goto('/');
  await page.fill('input[name="email"]', 'admin@devfact-flow.com');
  await page.fill('input[name="password"]', '4dm1nP4ss!');
  
  const submitButton = page.locator('button[type="submit"]');
  await expect(submitButton).toBeEnabled();
  
  await Promise.all([
    page.waitForURL('**/dashboard', { timeout: 30000 }),
    submitButton.click()
  ]);

  // 2. Création d'un client
  const uniqueId = Date.now();
  const clientName = `Client E2E ${uniqueId}`;
  
  await page.goto('/clients');
  await page.click('text=+ Nouveau Client');
  
  const modalNameInput = page.locator('input[name="name"]');
  await expect(modalNameInput).toBeVisible({ timeout: 10000 });
  
  await modalNameInput.fill(clientName);
  await page.fill('input[name="email"]', `e2e-${uniqueId}@test.com`);
  await page.click('text=Enregistrer le client');
  
  await expect(page.locator(`text=${clientName}`)).toBeVisible({ timeout: 15000 });

  // 3. Création d'un devis
  await page.goto('/quotes/new');
  
  const clientCombobox = page.getByRole('combobox').first();
  await expect(clientCombobox).toBeVisible({ timeout: 10000 });
  await clientCombobox.click();
  
  await page.getByRole('option', { name: clientName }).click();
  
  const descInput = page.locator('input[placeholder="Ex: Création de site web"]');
  await descInput.fill('Prestation E2E');
  await page.locator('input[placeholder="0.00"]').fill('500');
  
  const saveQuoteBtn = page.locator('button[type="submit"]:has-text("Enregistrer le devis")');
  await saveQuoteBtn.click();
  
  await page.waitForURL('**/quotes', { timeout: 30000 });

  // 4. On ouvre le devis
  const quoteCard = page.locator('a').filter({ hasText: clientName }).first();
  await expect(quoteCard).toBeVisible({ timeout: 20000 });
  
  await quoteCard.click();
  await page.waitForURL(/\/quotes\/.+/, { timeout: 20000 });

  // 5. On l'accepte
  const statusBtn = page.locator('button:has-text("DRAFT"), button:has-text("SENT")').first();
  await expect(statusBtn).toBeVisible();
  await statusBtn.click();
  
  await page.getByRole('menuitem', { name: 'ACCEPTED' }).click();
  
  // On cible précisément le badge (le premier élément) et non le toast
  await expect(page.locator('div.uppercase:has-text("ACCEPTED")').first()).toBeVisible({ timeout: 10000 });

  // 6. On le convertit en facture
  const convertBtn = page.locator('button:has-text("Convertir en Facture")');
  await expect(convertBtn).toBeVisible({ timeout: 10000 });
  await convertBtn.click();
  
  // 7. On vérifie qu'on arrive sur la facture
  await page.waitForURL(/\/invoices\/.+/, { timeout: 30000 });
  await expect(page.locator('h1')).toContainText('Facture', { timeout: 10000 });
});