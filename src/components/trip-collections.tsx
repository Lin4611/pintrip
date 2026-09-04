'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

import type { Trip } from '@/types/trip'
import { TripList } from './trip-list'

/**
 * 摘要行、列表與**品牌區的便條**必須由同一份狀態推導
 * （`HomeScreen.dc.html` STATE RULES／ASSETS）。三者都隨「還有沒有收藏」改變：
 *
 * - 有資料：摘要行「目前有 N 個旅行收藏 · M 個地點」；便條在品牌區右欄，100px
 * - 空資料：**摘要行被說明句取代**；便條**移到**列表下方置中放大到 132px
 *   ——是「移動」不是「再加一枚」，Empty frame 的 header 右欄只有 avatar
 * - 讀取失敗：摘要行與便條都不算繪（Error frame 的 header 同樣只有 avatar）
 *
 * 品牌區的美術素材以 `ReactNode` prop 由 Server Component 傳入，在 Server 算繪、
 * 不進 client bundle；這一層只決定「便條要不要出現、出現在哪」。
 */
const SUMMARY_ID = 'trip-collection-summary'

const EMPTY_MESSAGE =
  '還沒有任何旅行收藏。先建立一個，就能把 Instagram 貼文裡的地點收進來。'

type TripCollectionsProps = {
  trips: Trip[]
  error?: boolean
  /** 品牌區左側：wordmark 與 tagline。 */
  brandArt?: ReactNode
  /** 品牌區右欄上方，任何狀態都顯示。 */
  avatar?: ReactNode
  /** 便條 100px，只在有收藏時出現在品牌區右欄。 */
  note?: ReactNode
  /** 便條 132px，只在空狀態時出現在列表下方置中。 */
  noteLarge?: ReactNode
}

export function TripCollections({
  trips,
  error,
  brandArt,
  avatar,
  note,
  noteLarge,
}: TripCollectionsProps) {
  const router = useRouter()
  // Mock-scope only: the removal lives in component state, so a reload restores it.
  // Persistence waits on the data-access decision (ARCHITECTURE.md §2.2).
  const [visible, setVisible] = useState(trips)

  const hasCollections = !error && visible.length > 0
  const isEmpty = !error && visible.length === 0
  const placeCount = visible.reduce((total, trip) => total + trip.placeCount, 0)

  return (
    <>
      {/* Header 必須是 space-between，不能用 grid／百分比——兩側都是固定尺寸的
          美術素材，grid 在 430 會拉出一大塊空隙。 */}
      <header className="flex items-start justify-between gap-2.5">
        {brandArt}
        <div className="flex flex-col items-end gap-3 pt-1.5">
          {avatar}
          {hasCollections && note}
        </div>
      </header>

      {/* 標籤維持 h1（見計畫第 4 段修正 1）；字體字重間距依 export。 */}
      <h1 className="mt-[26px] font-display text-display-sm leading-tight font-medium tracking-tight text-title">
        我的旅行收藏
      </h1>

      {!error && (
        <p
          id={SUMMARY_ID}
          className="mt-1.5 text-[12.5px] leading-[1.6] text-copy-kr"
        >
          {isEmpty
            ? EMPTY_MESSAGE
            : `目前有 ${visible.length} 個旅行收藏 · ${placeCount} 個地點`}
        </p>
      )}

      <div className="mt-3.5">
        <TripList
          trips={visible}
          error={error}
          describedBy={error ? undefined : SUMMARY_ID}
          onRename={() => router.push('/trips/new')}
          onConfirmDelete={(tripId) =>
            setVisible((current) => current.filter((trip) => trip.id !== tripId))
          }
        />
      </div>

      {isEmpty && (
        <div className="mt-[26px] flex justify-center">{noteLarge}</div>
      )}

    </>
  )
}
