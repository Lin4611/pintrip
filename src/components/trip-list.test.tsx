import { expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

import type { Trip } from '@/types/trip'
import { TripList } from './trip-list'

function trip(overrides: Partial<Trip> & Pick<Trip, 'id' | 'name' | 'createdAt'>): Trip {
  return {
    destination: '日本',
    placeCount: 1,
    decorationPreset: 'C',
    photoSrc: '/design-assets/photos/trip-tokyo-clean-2x.jpg',
    icons: [],
    ...overrides,
  }
}

const kyoto = trip({ id: 'kyoto', name: '京都', createdAt: '2026-07-01T00:00:00.000Z' })
const tokyo = trip({ id: 'tokyo', name: '東京', createdAt: '2026-08-01T00:00:00.000Z' })
const seoul = trip({ id: 'seoul', name: '首爾', createdAt: '2026-09-01T00:00:00.000Z' })

test('orders collections by creation time, newest first', () => {
  render(
    <TripList
      trips={[kyoto, seoul, tokyo]}
      onRename={() => {}}
      onConfirmDelete={() => {}}
    />,
  )

  const names = screen
    .getAllByRole('button', { name: /的更多選項$/ })
    .map((trigger) => trigger.getAttribute('aria-label'))

  expect(names).toEqual([
    '「首爾」的更多選項',
    '「東京」的更多選項',
    '「京都」的更多選項',
  ])
})

// 空狀態的說明句改由 `TripCollections` 算繪——設計要求它**取代摘要行**，
// 位置在區塊標題下方而非列表區內（`HomeScreen.dc.html` STATE RULES）。
// 該行為由 `trip-collections.test.tsx` 涵蓋；這裡只驗列表區自己的責任。
test('keeps the create entry and renders no collection when there is none', () => {
  render(<TripList trips={[]} onRename={() => {}} onConfirmDelete={() => {}} />)

  expect(screen.getByRole('link', { name: /建立旅行收藏/ })).toBeInTheDocument()
  expect(screen.queryAllByRole('button', { name: /的更多選項$/ })).toHaveLength(0)
})

test('shows the error card with a retry action instead of the list', () => {
  const onRetry = vi.fn()
  render(
    <TripList
      trips={[]}
      error
      onRetry={onRetry}
      onRename={() => {}}
      onConfirmDelete={() => {}}
    />,
  )

  expect(screen.getByText('暫時載入不到收藏')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: '重新載入' })).toBeInTheDocument()
  expect(screen.queryByRole('list')).not.toBeInTheDocument()
})
