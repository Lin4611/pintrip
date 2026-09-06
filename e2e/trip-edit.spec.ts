import { expect, test } from '@playwright/test'

test('12: rename opens the collection edit page with its existing values', async ({ page }) => {
  await page.goto('/trips')
  await page.getByRole('button', { name: '「東京」的更多選項' }).click()
  await page.getByRole('menuitem', { name: '重新命名旅行收藏：東京' }).click()
  await expect(page).toHaveURL('/trips/tokyo/edit')
  await expect(page.getByLabel('收藏名稱')).toHaveValue('東京')
  await expect(page.getByLabel('目的地名稱')).toHaveValue('日本')
  await expect(page.getByLabel('收藏說明')).toHaveValue('東京的老派風景與新的日常交會。')
  await expect(page.getByRole('navigation', { name: '主要導覽' }).getByRole('link', { name: '旅行收藏' })).toHaveAttribute('aria-current', 'page')
})

test('13: saving edits returns to Home with the updated collection', async ({ page }) => {
  await page.goto('/trips')
  await page.getByRole('button', { name: '「京都」的更多選項' }).click()
  await page.getByRole('menuitem', { name: '重新命名旅行收藏：京都' }).click()
  await page.getByLabel('收藏名稱').fill('京都的秋天')
  await page.getByLabel('目的地名稱').fill('日本 京都')
  await page.getByLabel('收藏說明').fill('秋天的散步收藏')
  await page.getByRole('button', { name: '儲存變更' }).click()
  await expect(page).toHaveURL('/trips')
  await expect(page.getByRole('button', { name: '「京都的秋天」的更多選項' })).toBeVisible()

  await page.getByRole('button', { name: '「京都的秋天」的更多選項' }).click()
  await page.getByRole('menuitem', { name: '重新命名旅行收藏：京都的秋天' }).click()
  await expect(page.getByLabel('收藏名稱')).toHaveValue('京都的秋天')
  await expect(page.getByLabel('目的地名稱')).toHaveValue('日本 京都')
  await expect(page.getByLabel('收藏說明')).toHaveValue('秋天的散步收藏')

  // Restore the development fixture through the same public edit flow.
  await page.getByLabel('收藏名稱').fill('京都')
  await page.getByLabel('目的地名稱').fill('日本')
  await page.getByLabel('收藏說明').fill('慢慢散步，感受京都的四季與街景。')
  await page.getByRole('button', { name: '儲存變更' }).click()
  await expect(page.getByRole('button', { name: '「京都」的更多選項' })).toBeVisible()
})
