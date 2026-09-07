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

const emptyTrip: Trip = {
  id: 'jeju',
  name: '濟州',
  destination: '大韓民國',
  note: '海岸線、咖啡館與日出峰，慢慢走完一整圈。',
  placeCount: 0,
  createdAt: '2026-08-15T09:00:00.000Z',
  decorationPreset: 'C',
  icons: [],
}

// 測試 1：0 地點顯示提示文字
test('1. 0 地點顯示提示文字', () => {
  render(<TripCard trip={emptyTrip} onRename={() => {}} onConfirmDelete={() => {}} />)

  expect(screen.getByText('還沒有地點')).toBeInTheDocument()
  expect(screen.getByText('從貼文匯入後會出現在這裡')).toBeInTheDocument()
})

// 測試 2：0 地點不 render 照片
test('2. 0 地點不 render 照片', () => {
  const { container } = render(
    <TripCard trip={emptyTrip} onRename={() => {}} onConfirmDelete={() => {}} />,
  )

  expect(container.querySelector('img[src*="photos"]')).toBeNull()
})

// 測試 3：有地點時仍 render 照片（回歸）
test('3. 有地點時仍 render 照片（回歸）', () => {
  const { container } = render(
    <TripCard trip={tokyo} onRename={() => {}} onConfirmDelete={() => {}} />,
  )

  expect(container.querySelector('img[src*="photos"]')).toBeInTheDocument()
  expect(screen.queryByText('還沒有地點')).not.toBeInTheDocument()
  expect(screen.queryByText('從貼文匯入後會出現在這裡')).not.toBeInTheDocument()
})

// 測試 4：迴紋針是純裝飾
test('4. 迴紋針是純裝飾', () => {
  render(<TripCard trip={emptyTrip} onRename={() => {}} onConfirmDelete={() => {}} />)

  expect(screen.queryAllByRole('img')).toHaveLength(0)
})

// 測試 5：計數行不特例
test('5. 計數行不特例', () => {
  render(<TripCard trip={emptyTrip} onRename={() => {}} onConfirmDelete={() => {}} />)

  const countNode = screen.getByText('0')
  expect(countNode.tagName).toBe('STRONG')
  expect(countNode.parentElement).toHaveTextContent('0 個地點')
})

// 測試 6：0 分類時貼紙列仍佔位
test('6. 0 分類時貼紙列仍佔位', () => {
  const { container } = render(
    <TripCard trip={emptyTrip} onRename={() => {}} onConfirmDelete={() => {}} />,
  )

  const stickerContainer = container.querySelector('.min-h-\\[27px\\]')
  expect(stickerContainer).toBeInTheDocument()
})

// 測試 7：佔位不可點
test('7. 佔位不可點', () => {
  const { unmount } = render(
    <TripCard trip={tokyo} onRename={() => {}} onConfirmDelete={() => {}} />,
  )
  const normalLinks = screen.getAllByRole('link').length
  const normalButtons = screen.getAllByRole('button').length
  unmount()

  render(<TripCard trip={emptyTrip} onRename={() => {}} onConfirmDelete={() => {}} />)
  expect(screen.getAllByRole('link')).toHaveLength(normalLinks)
  expect(screen.getAllByRole('button')).toHaveLength(normalButtons)
})

// 測試 8：photoSrc 選填
test('8. photoSrc 選填', () => {
  const tripWithoutPhoto: Trip = {
    id: 'jeju-no-photo',
    name: '濟州',
    destination: '大韓民國',
    placeCount: 0,
    createdAt: '2026-08-15T09:00:00.000Z',
    decorationPreset: 'C',
    icons: [],
  }

  expect(() =>
    render(
      <TripCard
        trip={tripWithoutPhoto}
        onRename={() => {}}
        onConfirmDelete={() => {}}
      />,
    ),
  ).not.toThrow()
})
