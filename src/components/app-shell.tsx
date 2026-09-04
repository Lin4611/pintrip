import type { ReactNode } from 'react'

import { BottomNav } from './bottom-nav'

/**
 * 三張設計稿共用的外框：status bar safe area → 捲動槽 → BottomNav。
 *
 * **每個畫面恰好一個捲動容器**（`components.md`）：外框 `overflow:hidden`，
 * 捲動層 `flex-1 min-h-0 overflow-y-auto overscroll-contain`。
 * 水平溢位靠三件事同時成立來擋——捲動層 `overflow-x:clip`（**不能用 `hidden`**，
 * 那會產生第二個捲動容器）、卡片 `overflow:hidden`、文字欄 `min-width:0`。
 *
 * gutter 是唯二隨寬度變動的變數之一（16 / 20 / 24 @ 360 / 390 / 430）；其餘固定。
 * 上緣為 `env(safe-area-inset-top)` + 12px；內容底部留白 72px，
 * 讓最後一張卡完全避開 nav（nav 自身另含 bottom inset）。
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-app">
      <div className="mx-auto flex w-full max-w-[430px] min-h-0 flex-1 flex-col">
        <div
          data-scroll-container
          className="min-h-0 flex-1 overflow-x-clip overflow-y-auto overscroll-contain px-4 pt-[calc(env(safe-area-inset-top)+12px)] pb-[72px] w390:px-5 w430:px-6"
        >
          {children}
        </div>
        <BottomNav />
      </div>
    </div>
  )
}
