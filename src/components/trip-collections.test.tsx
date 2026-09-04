import { expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import type { Trip } from '@/types/trip'
import { TripCollections } from './trip-collections'

// `useRouter` needs an App Router provider that jsdom has no way to mount. This
// stubs the framework boundary only — no internal collaborator is mocked, and
// nothing these tests assert on depends on the router.
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: () => {} }) }))

function trip(
  overrides: Partial<Trip> & Pick<Trip, 'id' | 'name' | 'createdAt' | 'placeCount'>,
): Trip {
  return {
    destination: '日本',
    decorationPreset: 'C',
    photoSrc: '/design-assets/photos/trip-tokyo-clean-2x.jpg',
    icons: [],
    ...overrides,
  }
}

const tokyo = trip({
  id: 'tokyo',
  name: '東京',
  placeCount: 28,
  createdAt: '2026-08-14T09:00:00.000Z',
})
const kyoto = trip({
  id: 'kyoto',
  name: '京都',
  placeCount: 36,
  createdAt: '2026-07-02T09:00:00.000Z',
})

/** 摘要行的字串取自 `HomeScreen.dc.html`：「目前有 2 個旅行收藏 · 64 個地點」。 */
const SUMMARY = /^目前有 (\d+) 個旅行收藏 · (\d+) 個地點$/

/** Empty 時摘要行**被這句取代**，不是額外多一句（`HomeScreen.dc.html` STATE RULES）。 */
const EMPTY_MESSAGE =
  '還沒有任何旅行收藏。先建立一個，就能把 Instagram 貼文裡的地點收進來。'

async function deleteCollection(name: string) {
  const user = userEvent.setup()
  await user.click(screen.getByRole('button', { name: `「${name}」的更多選項` }))
  await user.click(
    await screen.findByRole('menuitem', { name: `刪除旅行收藏：${name}` }),
  )
  await user.click(screen.getByRole('button', { name: '刪除收藏' }))
}

/** 便條在有收藏時待在品牌區、沒收藏時**移到**下方放大——是移動不是加一枚。 */
const NOTES = {
  note: <span>NOTE_IN_HEADER</span>,
  noteLarge: <span>NOTE_ENLARGED</span>,
}

test('states the collection count and the total place count', () => {
  render(<TripCollections trips={[tokyo, kyoto]} {...NOTES} />)

  expect(screen.getByText('NOTE_IN_HEADER')).toBeInTheDocument()
  expect(screen.queryByText('NOTE_ENLARGED')).not.toBeInTheDocument()

  expect(screen.getByText(SUMMARY)).toHaveTextContent(
    '目前有 2 個旅行收藏 · 64 個地點',
  )
})

test('updates both numbers in the summary after a collection is deleted', async () => {
  render(<TripCollections trips={[tokyo, kyoto]} {...NOTES} />)

  await deleteCollection('東京')

  expect(screen.getByText(SUMMARY)).toHaveTextContent(
    '目前有 1 個旅行收藏 · 36 個地點',
  )
})

test('replaces the summary line with the empty-state sentence when there is no collection', () => {
  render(<TripCollections trips={[]} {...NOTES} />)

  expect(screen.queryByText(SUMMARY)).not.toBeInTheDocument()
  expect(screen.getByText(EMPTY_MESSAGE)).toBeInTheDocument()
  // 便條移到下方放大，品牌區那枚必須消失（不是兩枚並存）。
  expect(screen.queryByText('NOTE_IN_HEADER')).not.toBeInTheDocument()
  expect(screen.getByText('NOTE_ENLARGED')).toBeInTheDocument()
})

test('renders neither the summary line nor the empty-state sentence when loading failed', () => {
  render(<TripCollections trips={[]} error {...NOTES} />)

  expect(screen.queryByText(SUMMARY)).not.toBeInTheDocument()
  expect(screen.queryByText(EMPTY_MESSAGE)).not.toBeInTheDocument()
  // Error frame 的 header 右欄同樣只有 avatar，兩枚便條都不算繪。
  expect(screen.queryByText('NOTE_IN_HEADER')).not.toBeInTheDocument()
  expect(screen.queryByText('NOTE_ENLARGED')).not.toBeInTheDocument()
  expect(screen.getByText('暫時載入不到收藏')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: '重新載入' })).toBeInTheDocument()
})

test('associates the list with the summary line', () => {
  render(<TripCollections trips={[tokyo, kyoto]} />)

  const summaryId = screen.getByText(SUMMARY).getAttribute('id')

  expect(summaryId).toBeTruthy()
  expect(screen.getByRole('list')).toHaveAttribute('aria-describedby', summaryId)
})
