import { expect, test } from '@playwright/test'

test('removes a collection after the deletion is confirmed', async ({ page }) => {
  await page.goto('/trips')

  await page.getByRole('button', { name: '「東京」的更多選項' }).click()
  await page.getByRole('menuitem', { name: '刪除旅行收藏：東京' }).click()
  await page.getByRole('button', { name: '刪除收藏' }).click()

  await expect(
    page.getByRole('button', { name: '「東京」的更多選項' }),
  ).toHaveCount(0)
  // 不比對名稱：`trip-edit.spec.ts` 案例 13 會在 server mock 上把「京都」改名再還原，
  // 與本檔平行執行時可能落在改名視窗內。這裡要斷言的是「其餘收藏還在」（濟州與京都共 2 張），
  // 與它叫什麼無關，所以改數卡片數量。
  await expect(
    page.getByRole('button', { name: /的更多選項$/ }),
  ).toHaveCount(2)
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
