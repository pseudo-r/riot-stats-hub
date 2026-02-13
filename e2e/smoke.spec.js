import { test, expect } from '@playwright/test';

// ══════════════════════════════════════════════════════════
// Smoke Tests – verify core pages load and render correctly
// ══════════════════════════════════════════════════════════

test.describe('Homepage', () => {
  test('loads with header and game pills', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=RIOT STATS HUB')).toBeVisible();
    await expect(page.locator('.header-game-pill')).toHaveCount(4);
  });

  test('displays LoL overview content', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Riot Stats Hub/i);
  });
});

// ══════════════════════════════════════════════════════════
// Game Navigation
// ══════════════════════════════════════════════════════════

test.describe('Game Navigation', () => {
  test('navigates to TFT page', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="/tft"]');
    await expect(page).toHaveURL(/\/tft/);
  });

  test('navigates to Valorant page', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="/valorant"]');
    await expect(page).toHaveURL(/\/valorant/);
  });

  test('navigates to LoR page', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="/lor"]');
    await expect(page).toHaveURL(/\/lor/);
  });
});

// ══════════════════════════════════════════════════════════
// Game-Specific Pages
// ══════════════════════════════════════════════════════════

test.describe('Game Pages', () => {
  test('Champions page loads grid', async ({ page }) => {
    await page.goto('/champions');
    await expect(page.locator('.champs-grid')).toBeVisible({ timeout: 10_000 });
  });

  test('Valorant Agents page loads grid', async ({ page }) => {
    await page.goto('/valorant/agents');
    await expect(page.locator('.val-agents-grid')).toBeVisible({ timeout: 10_000 });
  });

  test('TFT page loads', async ({ page }) => {
    await page.goto('/tft');
    await expect(page.locator('text=RIOT STATS HUB')).toBeVisible();
  });

  test('LoR page loads', async ({ page }) => {
    await page.goto('/lor');
    await expect(page.locator('text=RIOT STATS HUB')).toBeVisible();
  });
});

// ══════════════════════════════════════════════════════════
// Mobile Menu
// ══════════════════════════════════════════════════════════

test.describe('Mobile Menu', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('opens with solid background and nav links', async ({ page }) => {
    await page.goto('/');

    // Open mobile menu
    await page.click('.mobile-menu-toggle');

    // Menu should be visible with opaque background
    const menu = page.locator('.mobile-menu');
    await expect(menu).toBeVisible();

    // Game selector should have 4 links
    await expect(menu.locator('.mobile-games a')).toHaveCount(4);

    // Nav links should be visible
    await expect(menu.locator('.mobile-nav-links a')).toHaveCount(
      await menu.locator('.mobile-nav-links a').count(),
    );
  });

  test('navigates to game page from mobile menu', async ({ page }) => {
    await page.goto('/');
    await page.click('.mobile-menu-toggle');
    await page.click('.mobile-games a:has-text("VAL")');
    await expect(page).toHaveURL(/\/valorant/);
  });
});

// ══════════════════════════════════════════════════════════
// App Availability
// ══════════════════════════════════════════════════════════

test.describe('App Availability', () => {
  test('homepage returns 200', async ({ request }) => {
    const response = await request.get('/');
    expect(response.ok()).toBeTruthy();
    expect(response.headers()['content-type']).toContain('text/html');
  });
});
