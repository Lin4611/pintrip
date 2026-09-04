'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

/**
 * 固定 72px（+ bottom safe-area inset）、上圓角 26、兩格等寬（旅行收藏／匯入）、無 FAB；
 * 尺寸不隨寬度改變。未選取的圖示去飽和並降到 55% 不透明度——但那不是唯一訊號，
 * `aria-current="page"` 才是（`HomeScreen.dc.html` ACCESSIBILITY §BottomNav）。
 *
 * z-5：在卡片選單（4）之上、刪除 dim（8）之下。
 */
// 圖示顯示高 26；寬度依素材原始比例換算（nav-trips 34×32、nav-imports 31×32），
// 兩軸都明確給值，避免 `w-auto` 被 next/image 判定成「只改了一邊」。
const CELLS = [
  {
    href: '/trips',
    label: '旅行收藏',
    icon: '/design-assets/icons/nav-trips.png',
    width: 28,
    iconClass: 'h-[26px] w-[28px]',
  },
  {
    href: '/imports',
    label: '匯入',
    icon: '/design-assets/icons/nav-imports.png',
    width: 25,
    iconClass: 'h-[26px] w-[25px]',
  },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="主要導覽"
      className="z-[5] flex h-[calc(72px+env(safe-area-inset-bottom))] shrink-0 items-start rounded-t-xl bg-nav pt-3 pb-[env(safe-area-inset-bottom)] shadow-nav"
    >
      {CELLS.map((cell) => {
        // 精確比對：`/trips/new` 不該讓「旅行收藏」也高亮。
        const active = pathname === cell.href

        return (
          <Link
            key={cell.href}
            href={cell.href}
            aria-current={active ? 'page' : undefined}
            className="min-h-tap flex flex-1 flex-col items-center gap-[5px]"
          >
            <Image
              src={cell.icon}
              alt=""
              aria-hidden
              width={cell.width}
              height={26}
              className={`${cell.iconClass} ${active ? '' : 'opacity-55 grayscale'}`}
            />
            <span
              className={`font-ui text-ui-sm font-bold ${active ? 'text-link' : 'text-copy'}`}
            >
              {cell.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
