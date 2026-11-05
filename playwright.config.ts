import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  // On donne 90 secondes à chaque test pour s'exécuter (car ton app est lente en local)
  timeout: 90000,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    actionTimeout: 15000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // Bloc qui dit à Playwright de démarrer le serveur
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: false, // On force un nouveau serveur pour être sûr qu'il soit propre
    timeout: 120 * 1000, // On laisse 2 minutes au serveur pour démarrer
    stdout: 'pipe',
    stderr: 'pipe',
  },
});