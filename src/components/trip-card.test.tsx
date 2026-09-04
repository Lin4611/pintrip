import { expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import type { Trip } from '@/types/trip'
import { TripCard } from './trip-card'

const tokyo: Trip = {
  id: 'tokyo',
  name: '東京',
  destination: '日本',
  placeCount: 28,
  createdAt: '2026-08-01T00:00:00.000Z',
  decorationPreset: 'C',
  photoSrc: '/design-assets/photos/trip-tokyo-clean-2x.jpg',
  icons: [
    { src: '/design-assets/stickers/icon-torii.png', alt: '神社' },
    { src: '/design-assets/stickers/icon-food.png', alt: '美食' },
  ],
}

test('choosing delete opens the confirmation without deleting anything', async () => {
  const user = userEvent.setup()
  const onConfirmDelete = vi.fn()
  render(
    <TripCard trip={tokyo} onRename={() => {}} onConfirmDelete={onConfirmDelete} />,
  )

  await user.click(screen.getByRole('button', { name: '「東京」的更多選項' }))
  await user.click(
    await screen.findByRole('menuitem', { name: '刪除旅行收藏：東京' }),
  )

  expect(await screen.findByRole('dialog')).toBeInTheDocument()
  expect(onConfirmDelete).not.toHaveBeenCalled()
})

// Seam C —— `HomeScreen.dc.html` ACCESSIBILITY 卡。該卡自述「本卡是契約，不是這份 mock 的
// 實測描述」，因此依契約實作，不依 mock 現況。

test('names the card action with the collection and its place count', () => {
  render(<TripCard trip={tokyo} onRename={() => {}} onConfirmDelete={() => {}} />)

  expect(
    screen.getByRole('link', { name: '開啟旅行收藏：東京（28 個地點）' }),
  ).toBeInTheDocument()
})

test('keeps the menu trigger out of the card action rather than nested inside it', () => {
  render(<TripCard trip={tokyo} onRename={() => {}} onConfirmDelete={() => {}} />)

  const cardAction = screen.getByRole('link', {
    name: '開啟旅行收藏：東京（28 個地點）',
  })
  const menuTrigger = screen.getByRole('button', { name: '「東京」的更多選項' })

  // 巢狀互動元素在輔助科技上行為未定義；設計要求兩者為兄弟節點。
  expect(cardAction.contains(menuTrigger)).toBe(false)

  menuTrigger.focus()
  expect(menuTrigger).toHaveFocus()
  cardAction.focus()
  expect(cardAction).toHaveFocus()
})

test('hides the photo, the pin and the category stickers from assistive technology', () => {
  render(<TripCard trip={tokyo} onRename={() => {}} onConfirmDelete={() => {}} />)

  expect(screen.queryAllByRole('img')).toHaveLength(0)
  expect(screen.queryByText('神社')).not.toBeInTheDocument()
})
