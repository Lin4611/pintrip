import { expect, test } from '@playwright/test'

test('removes a collection after the deletion is confirmed', async ({ page }) => {
  await page.goto('/trips')

  await page.getByRole('button', { name: '「東京」的更多選項' }).click()
  await page.getByRole('menuitem', { name: '刪除旅行收藏：東京' }).click()
  await page.getByRole('button', { name: '刪除收藏' }).click()

  await expect(
    page.getByRole('button', { name: '「東京」的更多選項' }),
  ).toHaveCount(0)
  await expect(
    page.getByRole('button', { name: '「京都」的更多選項' }),
  ).toHaveCount(1)
})

test('keeps the collection when the deletion is cancelled', async ({ page }) => {
  await page.goto('/trips')

  await page.getByRole('button', { name: '「東京」的更多選項' }).click()
  await page.getByRole('menuitem', { name: '刪除旅行收藏：東京' }).click()
  await page.getByRole('button', { name: '取消' }).click()

  await expect(
    page.getByRole('button', { name: '「東京」的更多選項' }),
  ).toHaveCount(1)
})
