'use client'

import * as Dialog from '@radix-ui/react-dialog'

type DeleteTripDialogProps = {
  open: boolean
  tripId: string
  tripName: string
  placeCount: number
  onCancel: () => void
  onConfirmDelete: (tripId: string) => void
}

/**
 * 畫面層級 sheet，不是卡內就地確認——必須列出地點數與四類一併移除的資料，
 * 資訊量超過卡內一列（`screens.md` §Delete trip collection）。
 *
 * 按鈕角色固定：取消 = solid blue（flex 1.35，安全選項視覺上更重）／
 * 刪除收藏 = outline（flex 1）。**不加 destructive/danger 變體**——珊瑚色在本 App 是
 * commit CTA 的顏色，拿來當刪除會汙染兩邊語意。
 *
 * 這是全 App 唯一沒有任何裝飾的紙面：裝飾的語意是「留住它」，用在刪除上語氣不對。
 *
 * `#EDE4D2`／`#5A5A5C`／`#C77A62` 不在 DS 色票內，是 export 的頁面層字面值，
 * 依 `ARCHITECTURE.md` §2.1 以 arbitrary value 寫入並在此註明來源，不新增偽 DS token。
 */
export function DeleteTripDialog({
  open,
  tripId,
  tripName,
  placeCount,
  onCancel,
  onConfirmDelete,
}: DeleteTripDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && onCancel()}>
      <Dialog.Portal>
        {/* 平的暖色 dim，無模糊、無漸層——這是 no-scrim 規則唯一列出的例外，理由是 modality。 */}
        <Dialog.Overlay className="dim-motion fixed inset-0 z-[8] bg-[rgba(43,32,18,0.24)]" />

        {/* Radix relies on aria-hidden siblings + focus trap and does not emit
            aria-modal; the design contract asks for it explicitly
            (references/accessibility.md). */}
        <Dialog.Content
          aria-modal="true"
          className="sheet-motion fixed inset-x-0 bottom-0 z-[9] mx-auto max-w-[430px] rounded-t-xl bg-card px-5 pt-6 pb-[calc(30px+env(safe-area-inset-bottom))] shadow-[0_-8px_28px_rgba(60,45,25,0.20)]"
        >
          <Dialog.Title className="font-ui text-ui-lg font-bold tracking-tight text-heading">
            刪除「{tripName}」？
          </Dialog.Title>

          <Dialog.Description className="mt-[9px] text-body-sm leading-[1.7] text-copy-kr">
            這個旅行收藏裡的{' '}
            <strong className="font-bold text-heading">
              {placeCount} 個地點
            </strong>
            會一起刪除。
          </Dialog.Description>

          {/* Scope of impact — MVP.md §5.2 requires the affected data to be stated
              before deleting, and ARCHITECTURE.md §8 keeps shared Places out of it. */}
          <div className="mt-[14px] flex flex-col gap-[7px] border-t border-dashed border-[#EDE4D2] pt-[13px]">
            <p className="font-ui text-[11px] font-bold tracking-[.1em] text-muted">
              一併移除
            </p>
            <p className="text-[12.5px] leading-[1.75] text-[#5A5A5C]">
              這個收藏的匯入紀錄與候選地點
            </p>
            <p className="text-[12.5px] leading-[1.75] text-[#5A5A5C]">
              為這個收藏上傳的補充截圖
            </p>
            <p className="text-[12.5px] leading-[1.75] text-[#5A5A5C]">
              已收藏的 {placeCount} 個地點與它們的來源關聯
            </p>
          </div>

          <div className="mt-[13px] flex flex-col gap-[5px] border-t border-dashed border-[#EDE4D2] pt-[13px]">
            {/* Place 代表外部實際地點，可能被其他 Trip 參照，不隨單一 Trip 刪除。
                不寫出來使用者會以為地圖資料也一起消失。 */}
            <p className="text-[12.5px] leading-[1.7] text-copy-kr">
              其他收藏也在用的地點資料不會被刪除。
            </p>
            <p className="text-[12.5px] leading-[1.7] font-bold text-[#C77A62]">
              刪除後無法復原。
            </p>
          </div>

          <div className="mt-[18px] flex gap-2">
            {/* DS `Button` solid md：blue-600 底、15px、1.5px 同色邊、h48、r14、px20。 */}
            <Dialog.Close className="flex h-12 flex-[1.35] cursor-pointer items-center justify-center rounded-md border-[1.5px] border-accent-strong bg-accent-strong px-5 font-ui text-[15px] font-bold text-on-accent shadow-[0_2px_6px_rgba(60,95,160,0.16)] transition duration-120 ease-soft outline-focus focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-97 active:brightness-[.96]">
              取消
            </Dialog.Close>
            {/* DS `Button` outline md：paper 底、blue-600 字、1.5px blue-400 邊、無陰影。 */}
            <button
              type="button"
              onClick={() => onConfirmDelete(tripId)}
              className="flex h-12 flex-1 cursor-pointer items-center justify-center rounded-md border-[1.5px] border-focus bg-card px-5 font-ui text-[15px] font-bold text-link transition duration-120 ease-soft outline-focus focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-97 active:brightness-[.96]"
            >
              刪除收藏
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
