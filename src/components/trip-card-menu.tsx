'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

type TripCardMenuProps = {
  tripId: string
  tripName: string
  onRename: (tripId: string) => void
  onDelete: (tripId: string) => void
}

/** 實測 172 × 109。**只有寬度是規格**（shift 夾制需要已知寬度）；109 是實測值，
 *  依 `SKILL.md` 不得寫成高度，這裡只當作向上翻轉的門檻常數用——export 的腳本也是這樣用。 */
const MENU_HEIGHT = 109
/** 109 + 23 = 132：觸發鍵下緣加這個距離超過 nav 上緣就改向上開啟。 */
const BREATHING = 23
const GAP = 8

export function TripCardMenu({
  tripId,
  tripName,
  onRename,
  onDelete,
}: TripCardMenuProps) {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const firstItemRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [side, setSide] = useState<'top' | 'bottom'>('bottom')
  const [sideOffset, setSideOffset] = useState(GAP)
  const [boundary, setBoundary] = useState<Element | null>(null)

  /**
   * 錨定與翻轉方向都**在開啟那一刻量測**，不寫死：照片欄寬 148／172／196 隨斷點變，
   * 寫死會變成對齊整張卡、右側多出約 187px。
   *
   * - 水平：`align="end"` 讓右緣對齊觸發鍵右緣（偏好值），再由 Radix 的 shift
   *   夾住「左緣不越過 frame 內緣 8px」。**夾制對 frame，不對卡片**——對卡片夾會讓
   *   左緣正好貼齊卡片左緣，看起來就成了卡片的一部分。
   * - 垂直：（觸發鍵下緣、標題文字下緣）**較低者** + 8。標題行框比 `•••` 低約 13px，
   *   只錨定觸發鍵會切到收藏名稱。
   * - 翻轉：觸發鍵下緣 + 132 超過 nav 上緣就改向上，距觸發鍵上緣 8px。
   */
  const measure = useCallback(() => {
    const trigger = triggerRef.current
    if (!trigger) return

    const scroller = trigger.closest('[data-scroll-container]')
    setBoundary(scroller)

    const triggerRect = trigger.getBoundingClientRect()
    // 捲動層的下緣就是 nav 的上緣。
    const navTop = scroller
      ? scroller.getBoundingClientRect().bottom
      : window.innerHeight
    const flipsUp = triggerRect.bottom + MENU_HEIGHT + BREATHING > navTop

    const title = trigger.closest('article')?.querySelector('h2')
    const titleBottom =
      title?.getBoundingClientRect().bottom ?? triggerRect.bottom

    setSide(flipsUp ? 'top' : 'bottom')
    setSideOffset(
      flipsUp ? GAP : GAP + Math.max(0, titleBottom - triggerRect.bottom),
    )
  }, [])

  // The design requires focus on the first row on open; Radix only does that for
  // keyboard opens, and its `onOpenAutoFocus` escape hatch is a private prop that
  // the public types deliberately omit (references/accessibility.md).
  useEffect(() => {
    if (!open) return
    // Queued after Radix's own mount-time focus, which lands on the content box.
    const frame = requestAnimationFrame(() => firstItemRef.current?.focus())
    return () => cancelAnimationFrame(frame)
  }, [open])

  // 關閉條件之一：列表捲動（CARD MENU §關閉條件五項之一）。Radix 在 `modal={false}`
  // 下的 DismissableLayer 只處理 pointerdown／focus／Escape，Popper 只做重新定位，
  // 因此選單會跟著卡片飄。scroll 不冒泡，必須掛在 capture 階段才接得到內層捲動容器
  // 的事件——export 自己也是 `document.addEventListener('scroll', h, true)`。
  useEffect(() => {
    if (!open) return

    const close = () => setOpen(false)
    document.addEventListener('scroll', close, true)
    return () => document.removeEventListener('scroll', close, true)
  }, [open])

  // Not modal: the design forbids a dim and aria-modal here — those belong to the
  // delete confirmation sheet (references/accessibility.md).
  return (
    <DropdownMenu.Root
      modal={false}
      open={open}
      onOpenChange={(next) => {
        if (next) measure()
        setOpen(next)
      }}
    >
      {/* glyph 維持 22×18 原尺寸與原位置，命中區以 ::before 外擴到 44×44
          （export `<style>`：`top:-5px; right:-7px; width:44px; height:44px`）。
          不放大 glyph、不從標題偷寬度、不造成 layout shift；標籤不靠 `•••` 字元傳達，
          因此 glyph 本身 aria-hidden。 */}
      <DropdownMenu.Trigger
        ref={triggerRef}
        aria-label={`「${tripName}」的更多選項`}
        className="relative cursor-pointer pt-[2px] font-ui text-[16px] leading-none tracking-[.1em] text-muted outline-focus before:absolute before:top-[-5px] before:right-[-7px] before:h-11 before:w-11 before:content-[''] focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <span aria-hidden>•••</span>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        {/* 選單與卡片同為 `#FFFDFA`，**邊界靠 hairline 與雙層陰影建立**，不靠底色差異。 */}
        <DropdownMenu.Content
          side={side}
          sideOffset={sideOffset}
          align="end"
          collisionBoundary={boundary ?? undefined}
          collisionPadding={GAP}
          className="menu-motion z-[4] w-[172px] rounded-md border border-[#E3D9C6] bg-card p-1.5 shadow-[0_14px_32px_rgba(60,45,25,0.24),0_2px_6px_rgba(60,45,25,0.10)]"
        >
          <DropdownMenu.Item
            ref={firstItemRef}
            aria-label={`重新命名旅行收藏：${tripName}`}
            onSelect={() => onRename(tripId)}
            className="min-h-tap flex cursor-pointer items-center rounded-[11px] px-[10px] font-ui text-[15px] font-bold whitespace-nowrap text-heading outline-focus focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            重新命名
          </DropdownMenu.Item>

          {/* 浮層自己的分隔線：1px **solid** #F2EADC、左右內縮 8。
              不沿用卡片內的 dashed cream——那是紙感卡片的語彙，浮層要讀起來像另一個表面。 */}
          <DropdownMenu.Separator className="mx-2 my-[3px] h-0 border-t border-[#F2EADC]" />

          <DropdownMenu.Item
            aria-label={`刪除旅行收藏：${tripName}`}
            onSelect={() => onDelete(tripId)}
            className="min-h-tap flex cursor-pointer items-center rounded-[11px] px-[10px] font-ui text-[15px] font-bold whitespace-nowrap text-heading outline-focus focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            刪除旅行收藏
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
