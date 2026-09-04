# Reviewer 複審結果（第 1 次，2026-09-03）

- 分支：`feature/trip-collection-list`
- 受審版本：`trip-collection-list-visual.md` 78 列實作完成、送審時的 working tree
- 結果：**`REQUEST_CHANGES`**

> **行號注意**：Reviewer 原文引用的 `trip-collection-list-visual.md` 行號（290／345／390）
> 是送審當下的位置。之後該檔開頭插入了「交接」節，內容整體下移約 45 行，**行號已失效**，
> 請以下方引述的內容文字定位。

## Blocking（2 項，均已修正，見報告第 2 版）

1. **`src/app/trips/page.tsx` + `src/components/trip-collections.tsx`：Empty／Error 出現兩枚便條。**
   header 無條件算繪 100×103 那枚，`TripCollections` 又在下方算繪 132×136 那枚。設計要求「**移到**下方」
   不是新增。依據：ASSETS 卡「Home 一枚，Empty 時**移到**下方置中放大到 132px」、STATE RULES §Empty、
   Empty frame（第 277 行）與 Error frame（第 359 行）的 header 右側**只有 avatar**、
   `screens.md:218`「the note sticker **moves** below」。
   Reviewer 另指出：§10.6 宣稱 Empty 驗證 PASS 卻沒抓到，代表該項手動檢查不足以支撐完成聲明。
2. **`src/styles/tokens/_typography.css:6`：`--font-tc` 註解仍是 `/* Korean copy */`**，
   但 Developer Report 兩處聲稱已修。違反 `AGENTS.md`「不得虛構完成結果」與 `CODE_REVIEW.md` §6.4。

## Non-blocking（13 項，**尚未處理**）

1. **worldmap 靠左的依據寫反了。** 計畫說「反方的三處敘述是同一句話被轉述三次」，但其中**兩處在
   `HomeScreen.dc.html` 自身**——RESPONSIVE RULES「世界地圖 cut-out **靠右**對齊」與 ASSETS
   「worldmap…multiply 90%，**靠右**」——而 export 自訂的 SOURCE OF TRUTH 順序把
   `HomeScreen.dc.html`（第 1 順位）排在 `_ds`（第 4 順位）**之上**。按該優先序靠右才是勝出方；
   實測論證推翻的是**較高順位**的來源。決定本身有效（使用者裁定），但計畫記錄的優先序依據反了。
2. **#37 照片圓角 14px 的來源歸屬寫錯。** 13px 不只在 `screens.md`，`HomeScreen.dc.html` 的
   LAYOUT／SPACING 卡也明列「照片圓角 **13px**」。這是**最高順位來源自身**的規格卡與其算繪元件
   （`--r-md` = 14px）互相矛盾，不是「`screens.md` 摘要失準」。**430 卡片高度 218 同樣錯置**：
   它出自 `HomeScreen.dc.html` 的 RESPONSIVE RULES 與 LAYOUT／SPACING 兩處。
   兩項結論（14px、維持 183）Reviewer 不反對，但「依據」欄應更正。
3. **§10.6 有三個驗證空缺。** 計畫把 focus ring 明文排除在測試外交給 §10.6，但結果表**沒有任何
   focus ring 量測列**，A9 因此無證據；#39 的左緣夾制實測寫「11 ✓（夾制未觸發）」，代表夾制路徑
   從未被驗證；#65「背後列表不可捲動」無量測列。三者機制上成立，但完成聲明應誠實標為未量測。
4. **`src/styles/tokens/_effects.css:24-25` 的 `--dur-menu`／`--dur-sheet`。** `--dur-*` 不在
   Tailwind namespace 內，放進 `@theme` 不產生任何 utility，只是掛在 `:root` 的 CSS 變數；
   而同檔既有註記明白記載 `--dur-fast`／`--dur-base`／`--dur-slow` 是**被刻意移除**、改用 `duration-*`。
   在 `@utility` 內直接寫 `140ms`／`320ms` 字面值即可。三個 `@utility` 本身符合 §2.1 第 3 條。
5. **`.claude/launch.json` 與 `.vscode/settings.json`（內容為 `{}`）兩份工具設定，兩份計畫都沒有記錄。**
   屬 `AGENTS.md`「不得修改任務範圍外的檔案」的邊緣情形。（`.claude/skills/pintrip-design/` 屬已授權的
   流程缺口 3 處置，Reviewer 已 `diff -r` 驗證與 `.agents/` 逐字相同。）
6. **`src/components/trip-card-menu.test.tsx:129` 的捲動測試守不住它要守的東西。**
   以 `fireEvent.scroll(document)` 驅動，事件目標就是 `document`，**即使拿掉 `addEventListener` 的
   capture 旗標測試仍會綠**；而實際場景是內層捲動容器的 `scroll`（不冒泡），capture 才是必要條件。
7. **測試 3 的分類可能低報。** 前一輪 `trip-collections.tsx` 無條件算繪摘要行，空資料時會輸出
   「目前有 0 個旅行收藏 · 0 個地點」，正好命中 `SUMMARY` regex，第一次執行應為紅。較合理的解釋是
   測試 1／2 的 Green 一次做完三態分流，超出「通過當前測試的最小實作」。方向是低報證據不是灌水。
8. **`src/components/trip-card.tsx:94-103`：`CategoryIcon` 缺 `object-contain`。**
   DS `CategoryIcon` 設 `objectFit: 'contain'`，素材非正方（`icon-torii.png` 為 47×43），
   固定 27×27 會被拉伸。
9. **`src/components/trip-card-slot.tsx:71-74`：Preset B 膠帶數值。** 點點底紋
   `backgroundSize: '7px 7px'` 與 `transparent 1.5px`，export frame markup 是 `0 0/8px 8px`
   與 `transparent 1.6px`。屬前一輪產物，本輪明載「preset 數值未動」。
10. **裝飾缺 `pointer-events:none`。** ACCESSIBILITY §裝飾要求「一律 `aria-hidden` **+
    `pointer-events:none`**」。`trip-card-slot.tsx` 四組都有，但 `page.tsx` 的 tagline／note-paper
    與 `trip-card.tsx` 的類別貼紙只有 `aria-hidden`。目前無功能影響。
11. **`trip-list.tsx` 的 `onRetry` 從未由 `TripCollections` 傳入**，Error 卡的「重新載入」在應用內是
    no-op；`error` prop 也沒有呼叫端會傳 true，Error 態在應用中不可達。與 Known Limitations 一致，
    屬既有限制。另 `trip-list-error.tsx` 的 `'use client'` 冗餘（父層已是 Client）。
12. **`src/components/app-shell.tsx:23` 的內容底部留白。** MOBILE LAYOUT／SAFE AREA 卡寫
    「Content bottom pad：**72px + inset**」，實作是 `pb-[72px]`。export 三個 frame 的實際 markup
    用的也是 `padding:12px 20px 72px`，且 nav 自身已吃掉 bottom inset、與捲動層是 flex 兄弟而非覆蓋，
    Reviewer 判斷不是缺陷，記錄備查。
13. **`src/components/bottom-nav.tsx:46` 用 `<Link>` 而非 ACCESSIBILITY 卡寫的 `button`。**
    與 Start New Trip 的同類判斷（第 4 段修正 3）一致且對導航更正確，但**這一項沒有進偏離紀錄**。

## Reviewer 明確認可的部分

- 前一輪 3 項 Blocking **逐項確認已修**（摘要不隨刪除更新、選單錨定、捲動關閉選單）。
- 前一輪 16 項 Non-blocking 中計畫摘要列出的 10 項逐一查證通過，**唯一未落地的是 `--font-tc` 註解**。
- 78 列抽驗約五十列並回查原始來源，**全部與來源相符**；素材固有尺寸換算亦正確。
- Server／Client 邊界符合 §4；token 與命名符合 §2.1；無 `var()` 寫進 `className`／`style`。
- TDD：無測試反模式、未 mock 內部協作者、`next/navigation` 屬可接受的框架邊界 mock、
  預期值可回溯至設計來源、版面數值不寫成斷言的切分合理。
- Reviewer 自行重跑 `lint`／`vitest`／`build`／`git diff --check` 全數 PASS。

## Reviewer 無法查證的部分

- E2E 4／4（未重跑，採信 Developer 證據）。
- A9 focus ring 實際呈現、#39 左緣夾制觸發時的行為、#65 背後不可捲動——無量測證據。
- 前一輪 16 項 Non-blocking 中未被計畫摘錄的那幾項。
- Firefox／WebKit／實機觸控／`prefers-reduced-motion`。
