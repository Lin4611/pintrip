import { redirect } from 'next/navigation'

/** 旅行收藏列表是應用進入點；路由以 ARCHITECTURE.md §10 的 `/trips` 為準。 */
export default function Page() {
  redirect('/trips')
}
