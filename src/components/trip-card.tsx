'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import type { Trip } from '@/types/trip'
import { DeleteTripDialog } from './delete-trip-dialog'
import { TripCardMenu } from './trip-card-menu'

type TripCardProps = {
  trip: Trip
  onRename: (tripId: string) => void
  onConfirmDelete: (tripId: string) => void
}

/**
 * 卡片高度不設固定值、也不鎖 aspect-ratio（設計明文禁止，會與自適應高度打架，
 * 實際比例在 0.85–1.05 之間漂移）。照片的 `min-height` 是**固定 161**（DS `TripCard`），
 * 不隨斷點變；隨斷點變的只有照片欄寬 148 / 172 / 196。
 * `overflow-hidden` 搭配文字欄的 `min-w-0` 是防止長字串產生水平捲動的必要組合。
 *
 * 無障礙契約（`HomeScreen.dc.html` ACCESSIBILITY，該卡自述是契約而非 mock 描述）：
 * 整張卡是**單一可點區**，名稱為「開啟旅行收藏：東京（28 個地點）」；`•••` **不可巢狀**
 * 在可點區內，兩者是兄弟節點。可點區以標題上的 `::after` 撐滿整張卡實作，
 * 螢幕閱讀器因此只聽到一個有意義的連結。卡內照片、pin、類別貼紙全部不進無障礙樹。
 *
 * 中文內文沿用全域 `--font-tc`，不套 DS 的 `--font-kr`——DS 用韓文字體排繁中是
 * `design-system.md` 明列的 PENDING DESIGN，專案已於 `layout.tsx` 決定改用 TC 版本。
 */
export function TripCard({ trip, onRename, onConfirmDelete }: TripCardProps) {
  // The menu's 刪除旅行收藏 row is not the executing control — it only raises the
  // confirmation (references/screens.md).
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  return (
    <article className="relative flex gap-2 overflow-hidden rounded-lg bg-card pt-[11px] pr-[7px] pb-[11px] pl-[15px] shadow-card transition duration-120 ease-soft outline-focus has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:active]:scale-97 has-[a:active]:brightness-[.96]">
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <h2 className="line-clamp-2 min-w-0 font-display text-[28px] leading-[1.05] font-medium tracking-tight text-title">
            <Link
              href={`/trips/${trip.id}`}
              aria-label={`開啟旅行收藏：${trip.name}（${trip.placeCount} 個地點）`}
              className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
            >
              {trip.name}
            </Link>
          </h2>

          {/* `•••` 是可點區的兄弟節點，不是它的子孫。z-1 只用來浮在標題的 ::after
              覆蓋層之上；不用更大的值，以免越過 components.md 的層級（選單 4 / nav 5）。 */}
          <div className="relative z-[1] shrink-0">
            <TripCardMenu
              tripId={trip.id}
              tripName={trip.name}
              onRename={onRename}
              onDelete={() => setConfirmingDelete(true)}
            />
          </div>
        </div>

        {/* 單行、超出以 ellipsis 截斷；`min-w-0` 必須同時在容器與 span 上才會生效。 */}
        <div className="mt-[5px] flex min-w-0 items-center gap-[5px] overflow-hidden">
          <Image
            src="/design-assets/icons/pin-coral.png"
            alt=""
            width={15}
            height={17}
            className="h-[17px] w-auto shrink-0"
          />
          <span className="min-w-0 truncate text-ui-sm leading-[1.4] text-copy">
            {trip.destination}
          </span>
        </div>

        <div className="divider-dash mt-[9px] mb-2" />

        {trip.note && (
          <p className="line-clamp-2 text-[13px] leading-[1.6] text-copy-kr">
            {trip.note}
          </p>
        )}

        {/* DS 用獨立 spacer 保證文字欄與 footer 至少留 8px。 */}
        <div className="min-h-2 flex-1" />

        {/* 貼紙多時整列換行，不擠壓地點數（`components.md`／export `<style>`）。 */}
        <div className="flex flex-wrap items-center justify-between gap-1.5">
          <span className="font-ui text-[12.5px] whitespace-nowrap text-copy">
            <strong className="font-bold text-link">{trip.placeCount}</strong>{' '}
            個地點
          </span>
          <span className="flex gap-1">
            {trip.icons.map((icon) => (
              <Image
                key={icon.src}
                src={icon.src}
                alt=""
                aria-hidden
                width={27}
                height={27}
                className="pointer-events-none h-[27px] w-[27px] shrink-0 object-contain drop-shadow-[0_1px_2px_rgba(122,96,58,0.18)]"
              />
            ))}
          </span>
        </div>
      </div>

      <div className="relative min-h-[161px] w-[148px] shrink-0 self-stretch overflow-hidden rounded-md w390:w-[172px] w430:w-[196px]">
        <Image
          src={trip.photoSrc}
          alt=""
          fill
          sizes="(max-width: 389px) 148px, (max-width: 429px) 172px, 196px"
          className="object-cover object-center"
        />
      </div>

      <DeleteTripDialog
        open={confirmingDelete}
        tripId={trip.id}
        tripName={trip.name}
        placeCount={trip.placeCount}
        onCancel={() => setConfirmingDelete(false)}
        onConfirmDelete={onConfirmDelete}
      />
    </article>
  )
}
