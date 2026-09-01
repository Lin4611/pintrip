import { expect, test } from '@playwright/test'

// Setup smoke check: proves the Playwright runner, the Chromium binary and the
// dev-server wiring work. It asserts nothing about page content so it stays
// valid once the Home implementation replaces the default page.
test('serves the home route', async ({ page }) => {
  const response = await page.goto('/')

  expect(response?.status()).toBe(200)
  await expect(page.locator('body')).toBeVisible()
})
