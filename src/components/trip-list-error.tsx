/**
 * 單張 dashed 卡，語氣不責備（`screens.md` §UI states）。
 * 版式與文案取自 `HomeScreen.dc.html` 的 Error frame：`#FFFDFA` 底、1.5px dashed `#E3D9C6`、
 * r20、padding 20/18。虛線色刻意不是 DS 的 `--border-dash`（blue-200）——那是 DS 元件的語彙，
 * 這張是頁面層 markup，export 給的就是 `#E3D9C6`。
 *
 * 上方外距由 `TripCollections` 的容器負責（列表區一律 14px），這裡不再自帶。
 */
export function TripListError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="relative rounded-lg border-[1.5px] border-dashed border-[#E3D9C6] bg-card px-[18px] py-5">
      {/* 這張卡是錯誤狀態，不是「留住某樣東西」，但 export 仍給了一條珊瑚膠帶。 */}
      <span
        aria-hidden
        className="pointer-events-none absolute top-[-8px] left-6 h-4 w-[52px] -rotate-10 rounded-[2px] bg-tape-blush opacity-92"
      />

      <p className="font-ui text-ui-md font-bold text-heading">
        暫時載入不到收藏
      </p>
      <p className="mt-[7px] text-[12.5px] leading-[1.65] text-copy-kr">
        網路連線好像不太穩定，稍後再試一次就好。
      </p>

      {/* DS `Button` outline md：paper 底、blue-600 字、1.5px blue-400 邊、無陰影。 */}
      <div className="mt-3.5 flex gap-2">
        <button
          type="button"
          onClick={onRetry}
          className="flex h-12 cursor-pointer items-center justify-center rounded-md border-[1.5px] border-focus bg-card px-5 font-ui text-[15px] font-bold text-link transition duration-120 ease-soft outline-focus focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-97 active:brightness-[.96]"
        >
          重新載入
        </button>
      </div>
    </div>
  )
}
