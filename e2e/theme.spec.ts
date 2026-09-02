import { expect, test } from '@playwright/test'

test('keeps the light paper theme in dark color scheme', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('/')
  const darkBackground = await page.locator('body').evaluate((body) =>
    getComputedStyle(body).backgroundColor,
  )

  await page.emulateMedia({ colorScheme: 'light' })
  await page.reload()
  const lightBackground = await page.locator('body').evaluate((body) =>
    getComputedStyle(body).backgroundColor,
  )

  expect(darkBackground).toBe(lightBackground)
})
