/* eslint-disable @next/next/no-img-element -- Canonical raster artwork rendered on the server at its natural aspect ratio. */

import { AppShell } from '@/components/app-shell'
import { AppHeader } from '@/components/app-header'
import { TripForm } from '@/components/trip-form'

export default function Page() {
  return (
    <AppShell bottomPad="compact">
      <AppHeader backIcon={<img src="/design-assets/icons/arrow-back.png" alt="" aria-hidden className="pointer-events-none block h-auto w-[19.8px]" />}>
        <img src="/design-assets/stickers/wordmark-script.png" alt="PinTrip" className="block h-10 w-auto" />
        <img src="/design-assets/stickers/sticker-envelope.png" alt="" aria-hidden className="pointer-events-none block h-auto w-[52px] rotate-4" />
      </AppHeader>
      <TripForm mode="create" />
    </AppShell>
  )
}
