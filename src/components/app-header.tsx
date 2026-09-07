'use client'

import { useRouter } from 'next/navigation'
import type { ReactNode } from 'react'

export function AppHeader({ backIcon, children }: { backIcon?: ReactNode; children?: ReactNode }) {
  const router = useRouter()
  return (
    <header className="flex items-center justify-between gap-3 pt-0.5">
      <button
        type="button"
        aria-label="返回"
        onClick={() => router.back()}
        className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-pill border border-[rgba(122,96,58,0.06)] bg-card shadow-card transition-transform duration-120 ease-soft outline-focus focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-97 motion-reduce:transform-none motion-reduce:transition-none"
      >
        {backIcon ?? '返回'}
      </button>
      <div className="flex items-center gap-1.5">{children}</div>
    </header>
  )
}
