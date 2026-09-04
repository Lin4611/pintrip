import type { Trip } from '@/types/trip'

/**
 * 開發期間的假資料。資料庫方案定案前用來驅動畫面（ARCHITECTURE.md §2.2）。
 * 接上真實資料存取時整個 `src/lib/mock/` 移除。
 *
 * 數值取自 HomeScreen.dc.html 的示範資料：東京 28 個地點、京都 36 個，
 * 合計 64，對應設計稿的「目前有 2 個旅行收藏 · 64 個地點」。
 */
const TRIPS: Trip[] = [
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
