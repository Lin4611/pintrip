/** Stub — 單一旅行收藏頁尚未設計（references/screens.md）。 */

import { AppShell } from '@/components/app-shell'

export default async function Page({
  params,
}: {
  params: Promise<{ tripId: string }>
}) {
  const { tripId } = await params

  return (
    <AppShell>
      <p className="text-body-sm text-copy">旅行收藏 {tripId}（尚未實作）</p>
    </AppShell>
  )
}
