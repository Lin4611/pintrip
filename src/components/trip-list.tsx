'use client'

import type { Trip } from '@/types/trip'
import { StartNewTripCard } from './start-new-trip-card'
import { TripCard } from './trip-card'
import { TripCardSlot } from './trip-card-slot'
import { TripListError } from './trip-list-error'

type TripListProps = {
  trips: Trip[]
  error?: boolean
  onRetry?: () => void
  /** 收藏數量行的 id，依 `HomeScreen.dc.html` ACCESSIBILITY §列表語意關聯到清單。 */
  describedBy?: string
  onRename: (tripId: string) => void
  onConfirmDelete: (tripId: string) => void
}

/** 建立時間新到舊。MVP 不提供排序功能，順序固定。 */
function newestFirst(trips: Trip[]): Trip[] {
  return [...trips].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function TripList({
  trips,
  error,
  onRetry,
  describedBy,
  onRename,
  onConfirmDelete,
}: TripListProps) {
  if (error) {
    return <TripListError onRetry={() => onRetry?.()} />
  }

  return (
    <ul aria-describedby={describedBy} className="flex flex-col gap-card">
      {newestFirst(trips).map((trip) => (
        <li key={trip.id}>
          <TripCardSlot preset={trip.decorationPreset}>
            <TripCard
              trip={trip}
              onRename={onRename}
              onConfirmDelete={onConfirmDelete}
            />
          </TripCardSlot>
        </li>
      ))}

      {/* Always the last item — the only creation entry now that the FAB is gone. */}
      <li>
        <StartNewTripCard />
      </li>
    </ul>
  )
}
