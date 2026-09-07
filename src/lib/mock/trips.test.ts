import { expect, test } from 'vitest'
import { listTrips } from './trips'

// 測試 9：mock 含 0 地點收藏
test('9. mock 含 0 地點收藏', () => {
  const trips = listTrips()
  const zeroPlaceTrip = trips.find((t) => t.placeCount === 0)

  expect(zeroPlaceTrip).toBeDefined()
  expect(zeroPlaceTrip?.photoSrc).toBeUndefined()
  expect(zeroPlaceTrip?.icons).toEqual([])
})
