import Image from 'next/image'
import type { ReactNode } from 'react'

import type { TripDecorationPreset } from '@/types/trip'

/**
 * 裝飾層。依 HomeScreen.dc.html 的 DECORATION PRESETS：
 *
 * - 四組固定 preset，名稱與素材都與目的地無關；建立時整組分配，不逐件隨機拼裝。
 * - 每張卡片有且只有一條 paper tape。
 * - 容器必須是卡片外層 wrapper（`relative`，**不可 `overflow:hidden`**），否則裝飾會被裁掉，
 *   而卡片本身仍需 `overflow:hidden` 來擋長字串造成的水平捲動——兩者職責因此必須分開。
 * - 裝飾一律 `absolute` + `pointer-events-none` + `aria-hidden`，不進文件流、不改卡片高度。
 *
 * 未知 preset 一律 fallback 到 C（規格明訂）。
 */
type Decoration = {
  tape: { className: string; style: React.CSSProperties }
  sticker?: {
    src: string
    width: number
    height: number
    style: React.CSSProperties
  }
  wash?: { src: string; width: number; height: number; style: React.CSSProperties }
}

const PRESETS: Record<TripDecorationPreset, Decoration> = {
  // A — Coral Journey：珊瑚膠帶 + 通用旅行郵戳
  A: {
    tape: {
      className: '',
      style: {
        width: 46,
        height: 15,
        top: -6,
        left: 18,
        background: '#F7D9CE',
        transform: 'rotate(-14deg)',
        opacity: 0.92,
        borderRadius: 2,
        zIndex: 2,
      },
    },
    sticker: {
      src: '/design-assets/stickers/trip-decoration-postmark-generic.png',
      width: 60,
      height: 60,
      style: {
        width: 60,
        height: 60,
        top: 15,
        right: 15,
        transform: 'rotate(-7deg)',
        transformOrigin: '50% 50%',
        opacity: 0.88,
        mixBlendMode: 'multiply',
        zIndex: 2,
      },
    },
  },
  // B — Lavender Botanical：點點膠帶 + 植物貼紙 + 極淡 wash
  B: {
    tape: {
      className: '',
      style: {
        width: 50,
        height: 16,
        top: -7,
        left: 20,
        backgroundColor: '#F1EDF7',
        backgroundImage:
          'radial-gradient(circle,#D8CBEC 1.5px,transparent 1.6px)',
        backgroundSize: '8px 8px',
        transform: 'rotate(-9deg)',
        opacity: 0.92,
        borderRadius: 2,
        zIndex: 2,
      },
    },
    sticker: {
      src: '/design-assets/stickers/trip-kyoto-decoration-lavender.png',
      width: 74,
      height: 90,
      style: {
        width: 74,
        height: 90,
        bottom: -8,
        right: 12,
        transform: 'rotate(4deg)',
        transformOrigin: '50% 100%',
        zIndex: 3,
      },
    },
    wash: {
      src: '/design-assets/stickers/trip-kyoto-decoration-wash.png',
      width: 84,
      height: 38,
      style: {
        width: 84,
        height: 38,
        bottom: -12,
        right: 26,
        transform: 'rotate(-4deg)',
        transformOrigin: '50% 50%',
        opacity: 0.55,
        zIndex: 2,
      },
    },
  },
  // C — Grid Scrapbook：格紋膠帶，無大型貼紙。同時是 fallback。
  C: {
    tape: {
      className: '',
      style: {
        width: 54,
        height: 16,
        bottom: -6,
        right: 22,
        backgroundColor: '#EFE4FA',
        backgroundImage:
          'repeating-linear-gradient(90deg,#D8CBEC 0 3px,transparent 3px 7px)',
        transform: 'rotate(7deg)',
        opacity: 0.92,
        borderRadius: 2,
        zIndex: 2,
      },
    },
  },
  // D — Butter Mail：butter 膠帶 + 信封貼紙
  D: {
    tape: {
      className: '',
      style: {
        width: 58,
        height: 17,
        top: -8,
        left: 26,
        background: '#F3E3B8',
        transform: 'rotate(-6deg)',
        opacity: 0.92,
        borderRadius: 2,
        zIndex: 2,
      },
    },
    sticker: {
      src: '/design-assets/stickers/sticker-envelope.png',
      width: 44,
      height: 37,
      style: {
        width: 44,
        height: 37,
        bottom: -7,
        right: 16,
        transform: 'rotate(6deg)',
        transformOrigin: '50% 100%',
        zIndex: 3,
      },
    },
  },
}

export function TripCardSlot({
  preset,
  children,
}: {
  preset: TripDecorationPreset
  children: ReactNode
}) {
  const decoration = PRESETS[preset] ?? PRESETS.C

  return (
    <div className="relative">
      {children}

      <span
        aria-hidden
        className="pointer-events-none absolute"
        style={decoration.tape.style}
      />

      {decoration.wash && (
        <Image
          aria-hidden
          alt=""
          src={decoration.wash.src}
          width={decoration.wash.width}
          height={decoration.wash.height}
          className="pointer-events-none absolute"
          style={decoration.wash.style}
        />
      )}

      {decoration.sticker && (
        <Image
          aria-hidden
          alt=""
          src={decoration.sticker.src}
          width={decoration.sticker.width}
          height={decoration.sticker.height}
          className="pointer-events-none absolute"
          style={decoration.sticker.style}
        />
      )}
    </div>
  )
}
