import Image from 'next/image'
import Link from 'next/link'

/**
 * 列表最後一項，也是移除 FAB 後唯一的建立入口（`components.md`）。
 * 版式取自 DS `StartTripCard`：`--surface-panel` 底、1.5px dashed、r20、padding 20/15、
 * gap 10、按下 `scale(0.99)`。**不設固定高度**——104 來自不具權威的 `hint-size`，
 * 說明文字在中文下折兩行時自然高度就約 104（決定 9）。
 *
 * 置中的奶油色膠帶是**固定品牌元素**，在四組 preset 的隨機池之外（`components.md`）。
 * 它必須掛在卡片外層 wrapper——卡片自身 `overflow:hidden` 會把跨邊界的膠帶切掉。
 */
export function StartNewTripCard() {
  return (
    <div className="relative">
      <span
        aria-hidden
        className="pointer-events-none absolute top-[-9px] left-1/2 z-[2] ml-[-31px] h-[18px] w-[62px] -rotate-2 rounded-[2px] bg-tape-butter opacity-92"
      />

      <Link
        href="/trips/new"
        aria-label="建立旅行收藏"
        className="dash-frame relative flex items-center gap-2.5 overflow-hidden rounded-lg bg-panel py-5 pr-[15px] pl-[120px] transition duration-120 ease-soft outline-focus focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[.99]"
      >
        <Image
          src="/design-assets/stickers/worldmap.png"
          alt=""
          aria-hidden
          width={126}
          height={120}
          className="pointer-events-none absolute top-1/2 left-1.5 h-[120px] w-[126px] -translate-y-1/2 opacity-90 mix-blend-multiply"
        />

        <span className="relative min-w-0 flex-1 text-left">
          <span className="block font-display text-display-sm leading-[1.15] font-bold text-blue-700">
            建立旅行收藏
          </span>
          <span className="mt-[7px] block font-ui text-[12.5px] leading-[1.45] font-medium text-copy">
            收藏地點，記錄回憶，開始屬於你的旅行故事。
          </span>
        </span>

        <span
          aria-hidden
          className="relative flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-pill bg-accent text-[18px] text-on-accent shadow-[0_4px_10px_rgba(60,95,160,0.26)]"
        >
          →
        </span>
      </Link>
    </div>
  )
}
