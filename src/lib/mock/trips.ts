import type { Trip } from '@/types/trip'

/**
 * 開發期間的假資料。資料庫方案定案前用來驅動畫面（ARCHITECTURE.md §2.2）。
 * 接上真實資料存取時整個 `src/lib/mock/` 移除。
 *
 * 數值取自 HomeScreen.dc.html 的示範資料：東京 28 個地點、京都 36 個，
 * 合計 64，對應設計稿的「目前有 2 個旅行收藏 · 64 個地點」；濟州為 0 個地點。
 */
// Next.js dev 將路由編成各自的 server chunk，模組陣列不一定共用。
// 只在可整包移除的 mock 層使用 process 共用單例，讓編輯與 Home 讀到同份資料。
// 伺服器重啟後還原；熱重載可能保留。不得複製此模式到正式資料存取。
const mockGlobal = globalThis as typeof globalThis & { pintripMockTrips?: Trip[] }
const TRIPS: Trip[] = mockGlobal.pintripMockTrips ??= [
  {
    id: 'jeju',
    name: '濟州',
    destination: '大韓民國',
    note: '海岸線、咖啡館與日出峰，慢慢走完一整圈。',
    placeCount: 0,
    createdAt: '2026-08-15T09:00:00.000Z',
    decorationPreset: 'C',
    icons: [],
  },
  {
    id: 'tokyo',
    name: '東京',
    destination: '日本',
    note: '東京的老派風景與新的日常交會。',
    placeCount: 28,
    createdAt: '2026-08-14T09:00:00.000Z',
    decorationPreset: 'A',
    photoSrc: '/design-assets/photos/trip-tokyo-clean-2x.jpg',
    icons: [
      { src: '/design-assets/stickers/icon-torii.png', alt: '神社' },
      { src: '/design-assets/stickers/icon-food.png', alt: '美食' },
      { src: '/design-assets/stickers/icon-train.png', alt: '鐵道' },
    ],
  },
  {
    id: 'kyoto',
    name: '京都',
    destination: '日本',
    note: '慢慢散步，感受京都的四季與街景。',
    placeCount: 36,
    createdAt: '2026-07-02T09:00:00.000Z',
    decorationPreset: 'B',
    photoSrc: '/design-assets/photos/trip-kyoto-clean-2x.jpg',
    icons: [
      { src: '/design-assets/stickers/icon-pagoda.png', alt: '寺院' },
      { src: '/design-assets/stickers/icon-maple.png', alt: '紅葉' },
      { src: '/design-assets/stickers/icon-matcha.png', alt: '抹茶' },
    ],
  },
]

export function listTrips(): Trip[] {
  return TRIPS
}

export function getTrip(id: string): Trip | undefined {
  return TRIPS.find((trip) => trip.id === id)
}

export function updateTrip(id: string, input: Pick<Trip, 'name' | 'destination' | 'note'>): void {
  const index = TRIPS.findIndex((trip) => trip.id === id)
  if (index < 0) throw new Error('找不到旅行收藏。')
  TRIPS[index] = { ...TRIPS[index], name: input.name, destination: input.destination, note: input.note }
}
