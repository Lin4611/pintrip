import Image from 'next/image'

import { AppShell } from '@/components/app-shell'
import { TripCollections } from '@/components/trip-collections'
import { listTrips } from '@/lib/mock/trips'

/**
 * 品牌區的美術素材在這裡（Server）算繪，再以 prop 交給 `TripCollections`。
 * 便條的去留取決於「還有沒有收藏」，而那是 client state，所以由該層決定；
 * 素材本身不因此進 client bundle。
 */
export default function Page() {
  const trips = listTrips()

  return (
    <AppShell>
      <TripCollections
        trips={trips}
        brandArt={
          <div>
            <Image
              src="/design-assets/stickers/wordmark-serif.png"
              alt="PinTrip"
              width={178}
              height={58}
              priority
              className="h-[58px] w-auto"
            />
            <Image
              src="/design-assets/stickers/tagline-script.png"
              alt=""
              aria-hidden
              width={152}
              height={51}
              className="pointer-events-none mt-2.5 h-auto w-[152px]"
            />
          </div>
        }
        avatar={
          <Image
            src="/design-assets/photos/avatar-user.png"
            alt=""
            width={52}
            height={52}
            className="h-[52px] w-[52px] rounded-full border-[2.5px] border-card shadow-card"
          />
        }
        note={
          <Image
            src="/design-assets/stickers/note-paper.png"
            alt=""
            aria-hidden
            width={100}
            height={103}
            className="pointer-events-none h-[103px] w-[100px] -rotate-3"
          />
        }
        noteLarge={
          <Image
            src="/design-assets/stickers/note-paper.png"
            alt=""
            aria-hidden
            width={132}
            height={136}
            className="pointer-events-none h-[136px] w-[132px] -rotate-3"
          />
        }
      />
    </AppShell>
  )
}
