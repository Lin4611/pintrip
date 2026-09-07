import { expect, test } from '@playwright/test'

test('10. shows 0-place trip card with empty hint text on collection list', async ({ page }) => {
  await page.goto('/trips')

  const card = page.locator('article', { hasText: '濟州' })
  await expect(card).toBeVisible()
  await expect(card.getByText('還沒有地點')).toBeVisible()
  await expect(card.getByText('從貼文匯入後會出現在這裡')).toBeVisible()
  await expect(card.getByText('0 個地點')).toBeVisible()
})

const widths = [
  { viewportWidth: 360, expectedPlaceholderWidth: 148, name: '360 frame (148px)' },
  { viewportWidth: 390, expectedPlaceholderWidth: 172, name: '390 frame (172px)' },
  { viewportWidth: 430, expectedPlaceholderWidth: 196, name: '430 frame (196px)' },
]

for (const { viewportWidth, expectedPlaceholderWidth, name } of widths) {
  test(`A3/A4/A10: verifies placeholder dimensions and paperclip at ${name}`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: viewportWidth, height: 844 })
    await page.goto('/trips')

    const card = page.locator('article', { hasText: '濟州' })
    await expect(card).toBeVisible()

    const placeholder = card.locator('[data-placeholder="empty-trip-photo"]')
    await expect(placeholder).toBeVisible()

    const paperclip = placeholder.locator('img[src*="paperclip"]')
    await expect(paperclip).toBeVisible()

    const textBlock = placeholder.locator('div', { hasText: '還沒有地點' })
    await expect(textBlock).toBeVisible()

    const placeholderBox = await placeholder.boundingBox()
    const cardBox = await card.boundingBox()
    const paperclipBox = await paperclip.boundingBox()
    const textBox = await textBlock.boundingBox()

    expect(placeholderBox).not.toBeNull()
    expect(cardBox).not.toBeNull()
    expect(paperclipBox).not.toBeNull()
    expect(textBox).not.toBeNull()

    // A3: 寬 148 / 172 / 196 隨斷點，min-height >= 161
    expect(Math.round(placeholderBox!.width)).toBe(expectedPlaceholderWidth)
    expect(placeholderBox!.height).toBeGreaterThanOrEqual(161)

    // A4: 迴紋針 top: -8，right: 32，width: 17，上段跨出佔位上緣且不被裁切
    expect(await paperclip.evaluate((el) => getComputedStyle(el).top)).toBe('-8px')
    expect(await paperclip.evaluate((el) => getComputedStyle(el).right)).toBe('32px')
    expect(await paperclip.evaluate((el) => getComputedStyle(el).width)).toBe('17px')
    expect(paperclipBox!.y).toBeLessThan(placeholderBox!.y)
    expect(Math.abs(placeholderBox!.y - paperclipBox!.y - 8)).toBeLessThanOrEqual(1.5)

    // A10: 文字不蓋到迴紋針，不撐破卡片
    expect(textBox!.y).toBeGreaterThan(paperclipBox!.y + paperclipBox!.height)
    expect(placeholderBox!.x + placeholderBox!.width).toBeLessThanOrEqual(cardBox!.x + cardBox!.width + 1)

    // 截圖存進 Playwright 為本次測試配置的輸出目錄（`test-results/`，已被 .gitignore）。
    // 不得寫死絕對路徑：那會綁定單一機器與單一工具 session，換機器或 CI 一定失敗。
    await card.screenshot({ path: testInfo.outputPath(`trip-empty-state-${viewportWidth}.png`) })
  })
}
