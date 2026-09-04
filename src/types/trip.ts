/**
 * 旅行收藏。欄位依 `docs/MVP.md` §5.2（可輸入的內容、固定視覺樣式）與
 * `docs/ARCHITECTURE.md` §5.2（Trip 保存建立時指派、之後不再變更的視覺樣式標記）。
 *
 * `photoSrc` 與 `icons` 是卡片視覺需要、但兩份規範都未定義來源的欄位——設計稿以
 * 固定示範資料呈現，實際應來自收藏內的地點（TripPlace）。此處先作為佔位欄位，
 * 待 TripPlace 相關實作定案後改由地點推導。
 */
export type Trip = {
  id: string
  /** 收藏名稱 */
  name: string
  /** 目的地名稱 */
  destination: string
  /** 收藏說明，選填 */
  note?: string
  /** 已收藏的地點數 */
  placeCount: number
  createdAt: string
  /** 建立時等機率抽出並持久化，之後不再變更 */
  decorationPreset: TripDecorationPreset
  /** 佔位：實際應由收藏內的地點推導 */
  photoSrc: string
  /** 佔位：footer 的分類貼紙，實際應由收藏內的地點分類推導 */
  icons: { src: string; alt: string }[]
}

export type TripDecorationPreset = 'A' | 'B' | 'C' | 'D'
