/* eslint-disable @next/next/no-img-element -- Canonical raster artwork rendered on the server at its natural aspect ratio. */

import { notFound, redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

import { AppShell } from '@/components/app-shell'
import { AppHeader } from '@/components/app-header'
import { TripForm } from '@/components/trip-form'
import { getTrip, updateTrip } from '@/lib/mock/trips'

export default async function Page({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params
  const trip = getTrip(tripId)
  if (!trip) notFound()

  async function saveTrip(values: unknown) {
    'use server'
    if (
      typeof values !== 'object' || values === null ||
      !('name' in values) || typeof values.name !== 'string' || !values.name.trim() ||
      !('destination' in values) || typeof values.destination !== 'string' ||
      !('note' in values) || typeof values.note !== 'string'
    ) throw new Error('旅行收藏欄位格式不正確。')

    updateTrip(tripId, { name: values.name.trim(), destination: values.destination, note: values.note })
    revalidatePath('/trips')
    revalidatePath(`/trips/${encodeURIComponent(tripId)}/edit`)
    redirect('/trips')
  }

  return (
    <AppShell bottomPad="compact">
      <AppHeader backIcon={<img src="/design-assets/icons/arrow-back.png" alt="" aria-hidden className="pointer-events-none block h-auto w-[19.8px]" />}>
        <img src="/design-assets/stickers/wordmark-script.png" alt="PinTrip" className="block h-10 w-auto" />
        <img src="/design-assets/stickers/sticker-envelope.png" alt="" aria-hidden className="pointer-events-none block h-auto w-[52px] rotate-4" />
      </AppHeader>
      <TripForm mode="edit" initialValues={{ name: trip.name, destination: trip.destination, note: trip.note }} onSubmit={saveTrip} />
    </AppShell>
  )
}
