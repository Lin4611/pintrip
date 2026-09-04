# Developer Report

- 分支：`feature/trip-collection-list`
- 對應計畫：[`trip-collection-list-visual.md`](trip-collection-list-visual.md)
- 第 1 版：2026-09-03 送審 → Reviewer `REQUEST_CHANGES`（2 項 Blocking）
- 第 2 版：2026-09-03，2 項 Blocking 已修正
- 第 3 版：2026-09-03，Reviewer 第 1 次複審的 Non-blocking **13 項全數處置完畢**（含 1 項經使用者裁定只做一半、3 項為只記錄或僅文件補記，逐項見下表）；
  另修正一條間歇失敗的既有測試（等待模型）→ Reviewer 第 2 次複審（2026-09-04）**`APPROVED`**，
  0 Blocking、9 Non-blocking
- 第 4 版：2026-09-04，處理第 2 次複審 Non-blocking 1–6（**文件敘述與實際狀態不同步**），
  程式不動 → Reviewer 第 3 次複審 **`APPROVED`**，0 Blocking、4 項新 Non-blocking
  （其中 3 項仍是同一個「標頭未隨內文更新」的模式，第 1 項就殘留在該次修正自己裡面）
- 第 5 版：2026-09-04，處理第 3 次複審 Non-blocking 1–4，程式不動
  → Reviewer 第 4 次複審 **`APPROVED`**，0 Blocking、2 項 Non-blocking
- 第 6 版：2026-09-04，處理第 4 次複審 Non-blocking 1–2（`visual.md` 的過期「交接」節與
  `:4` 的狀態矛盾），程式不動 → Reviewer 第 5 次複審 **`APPROVED`**，0 Blocking、2 項 Non-blocking
- 第 7 版：2026-09-04，依 Reviewer 建議**移除錯誤的類**——`visual.md` 不再複述審查計數與段數，
  一律指向本檔的 Review Status。程式不動 → Reviewer 第 6 次複審 **`APPROVED`**，
  0 Blocking、3 項 Non-blocking
- 第 8 版：2026-09-04，處理第 6 次複審 3 項，並**停止在 `visual.md` 新增段落紀錄**。
  程式不動，**待複審**

> **標頭曾經寫錯**：第 3 版標頭原本寫「7 項中 6 項已處理、1 項待原文」，
> 但同一份報告內文早已是 13 項全數處置。這是 Reviewer 第 2 次複審 Non-blocking 3 指出的
> 「標頭與內文不同步」，方向是低報不是誇大，已於第 4 版更正。
>
> **第 5 版再次更正**：第 4 版把它寫成「全數**處理**完畢」，方向由低報翻成輕微**高報**
> （Reviewer 第 3 次複審 Non-blocking 2）——原文 11 只做後半、原文 5／12 只記錄、
> 原文 6 僅文件補記。現改為「全數**處置**完畢」並標明其中的性質差異。

## Task Status

- **READY FOR REVIEW**（第 8 版）

## 前一次審查的處理

| Reviewer Blocking | 處理 |
| --- | --- |
| 1. Empty／Error 出現兩枚便條（設計是「移到」不是「新增」） | **已修**。便條去留取決於 client state，故把品牌區的算繪決定權交給 `TripCollections`；素材仍由 `page.tsx`（Server）算繪後以 `ReactNode` prop 傳入，不進 client bundle。另把「便條是移動不是新增」補進 Seam A 的測試 1／3／4 —— 這個洞的根因是原本的 §10.6 只量「放大的那枚存在」（必然成立），沒量「原本那枚是否消失」 |
| 2. `--font-tc` 註解未改，但計畫與報告都稱已修 | **已修**。`src/styles/tokens/_typography.css:6` 的註解實際更正 |

**Reviewer 的 7 項 Non-blocking（使用者 2026-09-03 決定納入本輪，逐項回到來源查證後處理）**

| # | Reviewer 簡寫 | 處理 |
| --- | --- | --- |
| 1 | `CategoryIcon` 缺 `object-contain` | **已修**。DS `CategoryIcon` 是 `objectFit:'contain'`；實測六顆類別貼紙原生尺寸 32×29／26／39／37／25／32 **全非正方**，先前一直被拉扁 |
| 2 | 捲動測試的 capture 旗標守不住 | **已修**。原本對 `document` 發 scroll，事件目標即 `document`，拿掉元件的 `true` 仍會綠；改為掛進 `data-scroll-container` 並對該容器發。**守衛已驗證**：拿掉 `true` → 轉紅，還原 → 綠 |
| 3 | 計畫中兩處來源歸屬寫錯 | **已修**（使用者提供 Reviewer 原文後定位為原文 Non-blocking 1、2）。①worldmap：反方的「靠右」有兩處在 `HomeScreen.dc.html` 自身（RESPONSIVE RULES ＋ ASSETS），依 export 的 SOURCE OF TRUTH 順位**高於** `_ds`，因此本項是以實測推翻**較高順位**來源，不是「同一句話被轉述三次」；②#37 照片圓角：13px 也明列於 `HomeScreen.dc.html` 的 LAYOUT／SPACING 卡，屬**最高順位來源自身**與其算繪元件（`--r-md`=14px）矛盾，不是 `screens.md` 摘要失準；430 高度 218 同樣出自該檔兩處。**兩項結論（靠左、14px、維持 183）皆不變，只更正依據** |
| 4 | Preset B 膠帶數值 | **已修**。export line 87 為 `radial-gradient(circle,…1.5px,transparent 1.6px) 0 0/8px 8px` + `border-radius:2px`；原本缺 `circle`、stop 1.5、size 7px、**且漏 radius 2**（A／C／D 都有） |
| 5 | 裝飾缺 `pointer-events:none` | **已修**。`trips/page.tsx` 的 tagline 與兩枚便條，**以及 `trip-card.tsx` 的類別貼紙**（Reviewer 原文明列類別貼紙；報告第 2 版的簡寫漏了它） |
| 6 | BottomNav 用 `<Link>` 未進偏離紀錄 | **已補記**（僅文件）。理由同 Start New Trip：兩格實際做的是導航，`<a>` 才對；契約其餘要求全部成立 |
| 7 | A9 focus ring 無量測證據 | **已補測，且範圍更正為三項**（Reviewer 原文 Non-blocking 3 列的是三個驗證空缺）：①focus ring——卡片／`•••`／選單兩列實測 `rgb(123,158,220) solid 2px` + offset 2px、圓角跟隨元件（20／0／11）、未被裁切；②#39 左緣夾制——360／390／430 皆**不觸發**（360 距門檻僅 1px），另以 320（超出支援範圍，僅驗證機制）確認夾制路徑成立；③#65 背後不可捲動——捲動位置 105 於開啟中不變、實際滾輪無效、取消後完全還原 |

**遺漏的 5 項（原文 4／5／7／11／12）——使用者 2026-09-03 逐項界定後也納入本版**

| 原文 # | 內容 | 處理 |
| --- | --- | --- |
| 4 | `--dur-menu`／`--dur-sheet` 不在 Tailwind namespace，放 `@theme` 不產生 utility | **已修**。兩個 token 刪除，`@utility` 內直接寫 `140ms`／`320ms`；`--ease-soft` 保留。編譯產物驗證：三個 `@utility` 都在且各只定義一次、`prefers-reduced-motion` 區塊完整、輸出中已無 `--dur-*` |
| 5 | `.claude/launch.json`、`.vscode/settings.json` 未進任何計畫記錄 | **只記錄，檔案不動**。兩者不屬本任務，Commit 建議排除；`.vscode/settings.json` 內容為 `{}`，去留由使用者決定 |
| 7 | 測試 3 的分類可能低報 | **已更正敘述**，見 TDD Evidence |
| 11 | `onRetry` 未接線使 Error 態不可達；`trip-list-error.tsx` 的 `'use client'` 冗餘 | **只做後半**：移除冗餘的 `'use client'`。`onRetry` **維持不接**——重試行為屬決策帳本 `OPEN`，接上等於自行發明且會產生死碼；理由寫入 Known Limitations |
| 12 | content bottom pad 72 vs 「72 + inset」 | **只記錄備查**。Reviewer 自己已判斷不是缺陷（export markup 亦為 `72px`，nav 自身吃掉 bottom inset 且與捲動層是 flex 兄弟） |

**另一項必須說明的事實：報告第 2 版把 Reviewer 的 13 項 Non-blocking 簡寫成 7 項，過程中遺漏 6 項、並縮小了其中 2 項的範圍。** 取得原文後才發現。遺漏的是：`--dur-menu`／`--dur-sheet` 兩個 token 不產生 utility（原文 4）、`.claude/launch.json` 與 `.vscode/settings.json` 未進任何計畫記錄（原文 5）、測試 3 的分類可能低報（原文 7）、`onRetry` 未接線使 Error 態在應用中不可達 ＋ `trip-list-error.tsx` 的 `'use client'` 冗餘（原文 11）、content bottom pad 備查（原文 12），以及原文 3 裡除 focus ring 外的兩個量測空缺（已於本版補做）。**這 5 項已於本版一併處理（見上表）。**

## User Request and Allowed Scope

**原始需求**：分支 `feature/trip-collection-list` 於 2026-09-03 收到 Reviewer `REQUEST_CHANGES`（3 項 Blocking、16 項 Non-blocking）。使用者要求依專案設定的 UI 開發流程（`design skill` + Claude Design export → plan → skill + plan → 開發）重走**視覺層與無障礙契約**，並修正 3 項 Blocking。**行為層與既有 15 條測試經 Reviewer 認可，不重做。**

**核准範圍**：`docs/plans/trip-collection-list-visual.md`（本輪計畫）列出的 78 列對照表、3 個 Test Seam、9 條測試案例。所有偏離與計畫外修改均逐項向使用者說明差異與理由並取得確認，記錄在該計畫的「偏離與計畫外的修改」一節。

**本輪不在範圍**：Loading 狀態、刪除的進行中／失敗回饋（決策帳本 `OPEN`）、`--font-kr`／`--font-tc` 字體更換（`PENDING DESIGN`，明文不得自行更換）、`deleteTrip(id)` 實作（使用者決定本輪不補）、選單提升為 DS `MenuPopover`。

## Requirement Coverage

| # | 驗收條件 | 實作與證據 |
| --- | --- | --- |
| A1 | 刪除後摘要行數字同步更新 | `trip-collections.tsx` 由單一 state 推導；測試 2；§10.6 實機 2/64 → 1/36 |
| A2 | 空資料時摘要行**被說明句取代** | 同上；測試 3；§10.6 實機確認取代而非並列 |
| A3 | 錯誤狀態不算繪摘要行 | `!error &&` 條件；測試 4 |
| A4 | 捲動關閉選單、焦點歸還 | `trip-card-menu.tsx` capture 階段 scroll listener；測試 6；§10.6 實機 |
| A5 | 選單錨定、夾制與翻轉 | 開啟當下量測 + Radix `collisionBoundary`／`collisionPadding`；§10.6 實測右緣差 0、左緣距 frame 11、貼近 nav 時 `data-side="top"` |
| A6 | `•••` 命中區 44×44、不放大 glyph、無 layout shift | `::before{top:-5;right:-7;44×44}`；§10.6 實測 glyph 21.2×18（契約記 22×18） |
| A7 | 可點區名稱「開啟旅行收藏：{名稱}（{N} 個地點）」 | 測試 7 |
| A8 | 照片、裝飾、類別貼紙 `aria-hidden` | 測試 9 |
| A9 | focus-visible 2px `--blue-400` + 2px offset，不被裁切 | 卡片用 `has-[a:focus-visible]:`（outline 掛在 article 自身，不受其 `overflow:hidden` 影響）；選單列與 `•••` 各自 focus-visible。**第 3 版補實測**：三處皆 `rgb(123,158,220) solid 2px` + offset `2px`，圓角 20／0／11 跟隨元件，外層 `li` 為 `overflow:visible`，截圖四邊完整；`--blue-400` 與 DS `#7B9EDC` 同值 |
| A10 | 摘要行與清單 `aria-describedby` 關聯 | 測試 5 |
| A11 | 視覺數值逐項符合來源 | 78 列對照表；§10.6 三寬度量測 |
| A12 | 長收藏名以 `line-clamp: 2` 安全處理 | `trip-card.tsx` 標題 `line-clamp-2`；export `<style>` 明載 |
| A13 | 360／390／430 無水平捲動 | §10.6 實測三個寬度皆為 0 |

## Files Changed

**已追蹤（有 Git diff）**

- `src/styles/tokens/_effects.css` —— 新增選單／sheet／dim 的 keyframes 與三個 `@utility`；**第 3 版**移除 `--dur-menu`／`--dur-sheet` 兩個 token，時長改為 `@utility` 內的字面值
- `src/app/page.tsx`、`src/app/layout.tsx`、`src/styles/globals.css`、`src/styles/tokens/_typography.css`、`docs/ARCHITECTURE.md` —— 前一輪既有修改，本輪僅 `_typography.css` 的 `--font-tc` 註解與 `_effects.css` 有新增

**未追蹤（相對 HEAD `612dffa` 全為新增）**

- `src/app/trips/page.tsx` —— 品牌區塊重建（wordmark／tagline 尺寸修正、補 note-paper、標題字體）；**第 3 版**補 tagline 與兩枚便條的 `pointer-events-none`
- `src/components/trip-collections.tsx` —— **Blocking 1**：摘要行與列表由同一份 state 推導、三態分流、Empty 便條
- `src/components/trip-list.tsx` —— 移除空狀態 `<li>`、`aria-describedby` 透傳
- `src/components/trip-card.tsx` —— 無障礙契約 + 卡片內部視覺（**第 3 版**另補類別貼紙 `object-contain` 與 `pointer-events-none`）（標題 28px、目的地改 ink-500、gap 8、照片 `min-height:161`／`rounded-md`、footer `flex-wrap`、按下效果改 `has-[a:active]`）
- `src/components/trip-card-menu.tsx` —— **Blocking 2＋3**：錨定／翻轉／hairline／雙層陰影／分隔線／捲動關閉／動畫／`font-ui`／`cursor-pointer`
- `src/components/delete-trip-dialog.tsx` —— sheet 版式、文案、按鈕、陰影、safe-area、z-index、動畫
- `src/components/app-shell.tsx` —— 唯一捲動容器、`overflow-x:clip`、safe-area、`data-scroll-container`
- `src/components/bottom-nav.tsx` —— 上圓角、`padding-top:12`、圖示 26／`grayscale`／`.55`、標籤 ink-500 粗體、精確路徑比對、z-5
- `src/components/start-new-trip-card.tsx` —— DS `StartTripCard` 版式、worldmap、`→` 圓鈕、固定膠帶
- `src/components/trip-list-error.tsx` —— Error 卡版式、補第二句文案、膠帶、DS outline 按鈕；**第 3 版**移除冗餘的 `'use client'`
- `src/app/imports/page.tsx`、`src/app/trips/new/page.tsx`、`src/app/trips/[tripId]/page.tsx` —— 包 `AppShell`
- `src/components/trip-collections.test.tsx` —— **新增**，Seam A 五條
- `src/components/trip-card.test.tsx`、`src/components/trip-card-menu.test.tsx` —— 各新增 Seam C 三條、Seam B 一條；**第 3 版**的 `trip-card-menu.test.tsx` 另改捲動事件的發出位置（改由 `data-scroll-container` 發，守住 capture 旗標）與兩條焦點斷言的等待模型（包 `waitFor`）
- `src/components/trip-list.test.tsx` —— 空狀態斷言依決定 14 上移一層
- `src/components/trip-card-slot.tsx` —— 裝飾 style 補寬高（消除 `next/image` 警告）；**第 3 版**另修 Preset B 膠帶三處數值（`circle`／stop 1.6px／`8px 8px`／radius 2），其餘 preset 數值未動
- `docs/plans/trip-collection-list.md`、`docs/plans/trip-collection-list-visual.md` —— 計畫與歷程
- `docs/plans/trip-collection-list-review-result.md` —— **使用者提供的 Reviewer 第 1 次複審原文**（第 3 版據此校正處理範圍）

**working tree 內但不屬本任務**：`.claude/`（Skill 複製與 launch.json）、`.vscode/`。建議 Commit 時排除或另分支處理。

## Test Seams

使用者於 2026-09-03 確認三個 Seam：

- **Seam A（新）**：`TripCollections` 在不同資料與狀態下算繪的結果。公開介面由 `TripList` 上移一層。
- **Seam B**：認定為既有 Seam 1（`•••` 選單）的邊界案例——`HomeScreen.dc.html` CARD MENU 把五個關閉條件並列，捲動是第四項。
- **Seam C（新）**：TripCard 的無障礙契約（可及名稱、非巢狀互動元素、裝飾不入無障礙樹）。

版面數值**不寫成斷言**，一律走 §10.6 手動檢查——寫成斷言等同抄 CSS，且隨設計微調即碎。

## TDD Evidence

**Red → Green（9 條新測試）**

| # | Seam | Red 的實際失敗 | Green |
| --- | --- | --- | --- |
| 1 | A | 找不到摘要文字 | PASS |
| 2 | A | 找不到摘要文字（刪除後） | PASS |
| 3 | A | —— 當時記為「一開始就綠」（**分類低報，見下方更正**） | PASS |
| 4 | A | 找到空狀態 `<li>`（error 時仍算繪） | PASS |
| 5 | A | 找不到摘要文字 | PASS |
| 6 | B | 選單維持開啟（Radix `modal={false}` 不因捲動關閉） | PASS |
| 7 | C | 找不到該名稱的 link（只有「東京」） | PASS |
| 8 | C | 同上 | PASS |
| 9 | C | **找到 2 個 img：`alt="神社"`、`alt="美食"`** | PASS |

- **測試 3 的分類更正（第 3 版，Reviewer Non-blocking 7）**：原本記為「契約守衛，不是 Red → Green」，理由是空狀態句本來就在 `TripList` 內。**這個分類低報了證據。** Reviewer 的推論成立且已查證：前一輪 `trip-collections.tsx` **無條件算繪摘要行**，空資料時會輸出「目前有 0 個旅行收藏 · 0 個地點」，正好命中該測試的 `SUMMARY` regex，**因此第一次執行應為紅**。它之所以在實際執行時已是綠的，較合理的解釋是測試 1／2 的 Green 一次做完了三態分流——即那一步的實作超出「通過當前測試的最小實作」。
  **方向是低報證據，不是灌水**：真實情況比原本聲稱的更接近 Red → Green。已據此更正分類；同時記下「一次做完三態分流」這個過大的 Green 步距，供 Reviewer 判斷是否要求拆細。
- 測試 1／2／5 的第一次執行因 `useRouter` 在 jsdom 拋錯而全紅，那是環境問題不是行為缺口；補上 `next/navigation` 的**框架邊界** mock（未 mock 任何內部協作者）後才取得真正的 Red。
- **Review-stage Refactor：`NOT REQUIRED`** —— Reviewer 於第 2 次（2026-09-04）與第 3 次複審**兩度判定不需要**。第 4 版之前此欄仍寫 `NOT YET ASSESSED`（初次交審時的值），屬同類過期狀態列，於第 5 版更正（Reviewer 第 3 次複審 Non-blocking 3）。

## Validation

- `npm run lint`：**PASS**
- Targeted tests（`trip-collections`／`trip-card-menu`／`trip-card`）：**PASS**
- Full test suite（`npm test`）：**PASS**（24／24；既有 15 + 新增 9）
- `npm run build`：**PASS**
- `git diff --check`：**PASS**
- E2E（`npm run test:e2e`）：**PASS**（4／4）
- Manual verification（§10.6）：**PASS，含 2 項已裁定差異與 2 項 NOT AVAILABLE**

**第 3 版重跑結果**：上述六項全部重跑，全數 PASS（`npm test` 24／24、E2E 4／4、lint、build、`git diff --check`）。
`npm test` 在本版累計連跑 **12 次全部 24／24**（修正等待模型後 6 次、補做類別貼紙後 3 次、處理原文 4／11 後 3 次）。
移除 `--dur-*` 後另做動效實機複驗：選單 0.14s、sheet 0.32s、dim 0.32s、ease 不變；
編譯產物中三個 `@utility` 各只定義一次、`prefers-reduced-motion` 區塊完整、已無 `--dur-*`。

> **更正第 2 版的驗證證據**：第 2 版報告寫的「`npm test` **PASS**（24／24）」
> **是不可靠證據**。`trip-card-menu.test.tsx` 有兩條焦點斷言在 `await user.click()` 之後**同步**
> 斷言 rAF 才會完成的移焦，與 jsdom 的 rAF 計時器競態，**會間歇失敗**——第 2 版那次 24／24
> 是抽到綠的那一次。第 3 版已修正等待模型（第 47、125 行包 `waitFor`，不放寬斷言、不動元件的
> rAF 做法），並連跑 **`npm test` 6 次全部 24／24**、`trip-card-menu.test.tsx` **另單跑 6 次
> 全部 7／7**，共 12 次無任何紅。
>
> 對照證據：改動前的版本連跑 4 次紅 3 次，改動後（未修等待模型時）4 次紅 1 次——**兩者都會紅**，
> 確認是既有缺陷而非本輪改出來的。
>
> `closes when the list scrolls` 的「焦點歸還」是同類的同步斷言，但在上述 12 次中未曾轉紅，
> 依使用者指示的條件維持原樣，於此標記供 Reviewer 判斷。

**第 2 版重跑結果（保留供追溯）**：六項全部重跑，結果不變（`npm test` 24／24、E2E 4／4）。
§10.6 重新量測空狀態，這次量便條**數量**：2 筆收藏 1 枚（105）、1 筆 1 枚（105）、
**刪光後 1 枚（139）**，avatar 三態都在。

**§10.6 實測（dev server，360／390／430）**

| 項目 | 來源值 | 實測 |
| --- | --- | --- |
| gutter | 16／20／24 | 16／20／24 ✓ |
| photo column | 148／172／196 | 148×161／172×173／196×161 ✓ |
| 卡片間距 | 16 | 16 ✓ |
| 內容底部留白／上緣 inset | 72／inset+12 | 72／12 ✓ |
| 水平捲動 | 0 | 0／0／0 ✓ |
| 選單尺寸 | 172 × 109 | **172 × 109**（高度自然撐出，未寫死）✓ |
| 選單右緣對齊 `•••` | 差 0 | 0 ✓ |
| 選單左緣距 frame 內緣 | ≥ 8 | 11 ✓（夾制未觸發） |
| 貼近 nav 向上翻轉 | 門檻 +132 | `data-side="top"`，下緣在 nav 上方 51px ✓ |
| 捲動關閉 + 焦點歸還 | 要 | 兩者成立 ✓ |
| `•••` glyph | 22 × 18 | 21.2 × 18 ✓ |
| normal／empty 下 nav 位置 | 不變 | 完全相同 ✓ |
| console | —— | `next/image` **尺寸**警告已全數清除（0）。**第 4 版更正**：原寫「`next/image` 警告已清為 0」屬過度概括——dev server 仍會轉出瀏覽器端的 `next/image` **LCP 提示**（建議為首屏圖加 `loading="eager"`），那是另一類建議性訊息，不在本次清除範圍 |

## Known Limitations and Risks

1. **430 卡片高度 183，`screens.md` 記的實測是 218。** 360 完全吻合（183）、390 差 1。218 在算術上做不出來——加寬只會讓文字變矮，要 218 需文字欄達 196（比 390 的 174 還高）；`screens.md` 自述「long content 可到 225」，該筆應為別張示範卡。實測值依 `SKILL.md` **不是規格**，卡片高度明訂 never fixed。**使用者已裁定維持不動。**
2. **Start New Trip 高度三寬度皆 108，文件記 104。** 4px 差；104 出自 `hint-size`（`screens.md` 自述不具權威）。關鍵是「不隨寬度改變」已恢復。
3. **Error 狀態實機檢查：`NOT AVAILABLE`，且 Error 態在 App 內不可達。** mock 不會失敗，`TripCollections` 也從未傳入 `error` 或 `onRetry`，因此 `trip-list-error.tsx` 的「重新載入」在應用內是 no-op（Reviewer Non-blocking 11）。**第 3 版決定維持不接線**（使用者裁定）：重試要做什麼屬決策帳本的 `OPEN` 項，接上去等於自行發明行為，而在資料仍是 mock 的情況下也只會產生死碼。Error 態由隔離元件測試涵蓋（測試 4）。同項的另一半——`trip-list-error.tsx` 冗餘的 `'use client'`（父層已是 Client）——**已移除**。
4. **`has-[a:active]` 的正向案例未經腳本驗證。** 合成事件無法驅動 CSS `:active`；已驗證反向（按 `•••` 時卡片不縮放）與編譯產物中的選擇器，正向由使用者目視確認。
5. **未涵蓋**：Firefox／WebKit／實機觸控／`prefers-reduced-motion`（Playwright 僅 Pixel 7 + Chromium）。
6. **選單只有進場動畫**，CARD MENU §Motion 只規定 140ms 淡入；sheet 的「close 同長反向」已實作。
7. **`--font-tc` 是否適合繁中仍為 `PENDING DESIGN`**，本輪只修正註解，未動字體。
8. **刪除不持久化**、`deleteTrip(id)` 未實作（使用者決定）、「重新命名」與建立入口仍為 stub。
9. **`overflow-x: clip` 在瀏覽器計算為 `hidden`**：CSS 規範規定另一軸為 `auto` 時 `clip` 會被強制成 `hidden`。`components.md` 要求用 `clip` 不用 `hidden` 的理由是「避免產生第二個捲動容器」，而該元素本身就是捲動容器，故無實質差異；水平溢位實測為 0。

## Git Evidence

- **Diff Source：GIT**
- **重要限制**：本分支**從未 Commit**（Reviewer gate 規定 `APPROVED` 前不得進入 Git 寫入流程），因此**無法提供「相對前一次審查版本」的 delta diff**。已追蹤的 6 個檔案有真實 `git diff`；其餘檔案相對 `HEAD`（`612dffa`）全部是新增，需以完整檔案內容審查。
- `git status --short`：見下
- diff stat（已追蹤）：6 files changed, **90** insertions(+), 67 deletions(-)（第 4 版更正：原寫 91，實測為 90）

```
 M docs/ARCHITECTURE.md
 M src/app/layout.tsx
 M src/app/page.tsx
 M src/styles/globals.css
 M src/styles/tokens/_effects.css
 M src/styles/tokens/_typography.css
?? .claude/
?? .vscode/
?? docs/plans/trip-collection-list-report.md
?? docs/plans/trip-collection-list-review-result.md
?? docs/plans/trip-collection-list-visual.md
?? docs/plans/trip-collection-list.md
?? e2e/trip-delete.spec.ts
?? src/app/imports/
?? src/app/trips/
?? src/components/
?? src/lib/
?? src/styles/tokens/_layout.css
?? src/types/
```

## Review Status

- **第 1 版：`REQUEST_CHANGES`**（2 Blocking、13 Non-blocking）
- **第 2 版：NOT REVIEWED** —— 2 項 Blocking 已修
- **第 3 版：`APPROVED`**（2026-09-04 第 2 次複審）—— 0 Blocking、9 Non-blocking。
  Reviewer 自行重跑 `lint`／`npm test`（24／24）／`build`／`git diff --check`／E2E（4／4），
  並獨立驗證編譯產物（`--dur-` 出現 0 次、三個 motion `@utility` 各只定義一次）；
  13 項 Non-blocking 逐項開檔查證，前一輪 2 項 Blocking 一併覆核確認已修
- **第 4 版：`APPROVED`**（2026-09-04 第 3 次複審）—— 0 Blocking、4 項新 Non-blocking。
  Reviewer 確認六項全部改對且位置精準，並以 mtime ＋ 逐行 spot-check **兩種方式獨立證實**
  程式與測試一行未動；亦確認本報告對第 2 次複審結果的轉述如實、未誇大。
  但 4 項新 Non-blocking 中有 3 項仍是同一個「標頭未隨內文更新」的模式
- **第 5 版：`APPROVED`**（2026-09-04 第 4 次複審）—— 0 Blocking、2 項 Non-blocking。
  Reviewer 確認四項全改對，並查證「處置」是實質修正而非換說法（核對分類與算術
  9 + 1 + 3 = 13 與內文相符）、本報告對第 3 次複審結論的轉述如實未誇大；
  程式與測試未動一事以 `git diff --stat`、mtime 與 `git status` **三方交叉證實**
- **第 6 版：`APPROVED`**（2026-09-04 第 5 次複審）—— 0 Blocking、2 項 Non-blocking
  （皆為 `visual.md` 在改寫「交接」節時新增的計數錯誤：「連續四次 `APPROVED`」實為三次、
  「共九段」實為十段）
- **第 7 版：`APPROVED`**（2026-09-04 第 6 次複審）—— 0 Blocking、3 項 Non-blocking。
  Reviewer 自行掃描確認**計數是真的被移除而非搬家**，並確認本節可承擔權威角色
- **第 8 版：NOT REVIEWED** —— 處理第 6 次複審的 3 項 Non-blocking：`visual.md` 流程規則
  仍指向已作廢的第 9 段做法、兩處高報 Reviewer 的背書、「最終記錄」的計數與斷言。
  **並依使用者裁定：純文件修正輪不再於 `visual.md` 新增「第 N 段」，改為只記在本節。**
  程式不動，待複審

### 第 6 次複審的 3 項 Non-blocking

| # | 內容 | 第 8 版處理 |
| --- | --- | --- |
| 1 | `visual.md:62` 的流程規則仍寫「重複五次」（同檔另處寫七次），且把讀者導向**本輪剛作廢的**第 9 段掃描清單。本輪自己造成 | **已修**：改為不帶次數的原則敘述「同一份事實不要在兩個地方各寫一份」，指向第 11 段，並明寫第 9 段做法已被取代、不要照做 |
| 2 | `visual.md` 與本檔兩處寫「Reviewer 五次複審都確認本節正確」——不準確，**方向是高報 Reviewer 的背書**。本節是自第 4 版更正後才可靠（第 2 次複審指名的正是它），確認過三次 | **已修**：兩處都改為如實說明本節曾被指出不同步、自第 4 版起可靠、其後三次確認；並記下這是**第二次高報 Reviewer 的認可** |
| 3 | 「這個模式的**最終**記錄：共出現**七次**」——依本輪自訂原則，數字與「最終」都該拿掉 | **已修**：改為不帶計數的敘述，次數指向本節 |

### 第 5 次複審的 2 項 Non-blocking

| # | 內容 | 第 7 版處理 |
| --- | --- | --- |
| 1 | `visual.md` 三處寫「Reviewer 連續四次 `APPROVED`」，實為三次（四次複審，第 1 次是 `REQUEST_CHANGES`），屬**高報認可次數**，且與本檔正確的枚舉牴觸 | **已修，且改的是結構**：`visual.md` 不再複述審查次數與版本號，改為指向本檔 Review Status |
| 2 | `visual.md` 兩處寫「共九段」，實為十段；`九段` 雖列在掃描清單卻未被實際搜尋 | **已修，且改的是結構**：段數改為指向「偏離與計畫外的修改」一節，不寫數字 |

> **本檔的 Review Status 是審查歷程的唯一權威記錄**，`trip-collection-list-visual.md`
> 自第 7 版起不再複述這些計數，以免下游漂移。
>
> **但本節並非從未出錯**：Reviewer 第 2 次複審的 Non-blocking 3 指名的正是它——當時本節仍寫
> 「Non-blocking 7 項中 6 項已處理、1 項待原文」，內文卻已是 13 項。**自第 4 版更正後**才可靠，
> 其後於第 3、4、5 次複審均確認正確。第 7 版初稿曾寫「Reviewer 五次複審均確認本節正確」，
> 屬高報 Reviewer 的認可，已於第 8 版更正。

### 第 4 次複審的 2 項 Non-blocking

| # | 內容 | 第 6 版處理 |
| --- | --- | --- |
| 1 | `visual.md:4` 仍把行為層計畫標為 `REQUEST_CHANGES`，而該狀態是第 4 版自己改成「已結案」的；第 9 段的掃描清單漏了這個關鍵詞 | **已修**：`:4` 改為「已結案」，並補全掃描關鍵詞清單、明寫清單自身有缺口 |
| 2 | 整個「交接：從這裡接手」節全面過期（`READY TO IMPLEMENT`／等待複審／六段／第 2 版／兩條路），**非本輪造成，Reviewer 前三輪未點名** | **已修**：整節改寫成反映現狀，節首記下先前停在哪個狀態 |

### 第 3 次複審的 4 項 Non-blocking

| # | 內容 | 第 5 版處理 |
| --- | --- | --- |
| 1 | `visual.md` 的「含 2 項待裁定」與節標題「兩項待裁定」未隨內文更新，與本報告的「2 項已裁定」直接對立 | **已修**：兩處改為「已裁定」並加註成因 |
| 2 | 本報告標頭「13 項全數處理完畢」屬輕微高報 | **已修**：改為「全數處置完畢」並標明性質差異 |
| 3 | 「Review-stage Refactor：`NOT YET ASSESSED`」未隨兩度判定更新 | **已修**：改為 `NOT REQUIRED` |
| 4 | 第 8 段插在第 7 段本體與其驗證之間 | **已修**：移到第 7 段驗證之後 |

### 第 2 次複審的 9 項 Non-blocking

| # | 內容 | 第 4 版處理 |
| --- | --- | --- |
| 1 | `visual.md` 「兩項待裁定」第 2 項仍寫 90／108／90，與第 5 段矛盾 | **已修**：標為過期並指向第 5 段（三寬度皆 108） |
| 2 | `visual.md` 第 3b 段的 `--dur-*` token 決定已被第 7 段推翻，缺交叉指向 | **已修**：加註被第 7 段推翻，明寫不得據此實作 |
| 3 | 報告標頭仍寫「7 項中 6 項已處理」，內文已是 13 項 | **已修**：標頭更正並保留錯誤紀錄 |
| 4 | diff stat 91 vs 實測 90 | **已修**：更正為 90 |
| 5 | 「`next/image` 警告已清為 0」屬過度概括 | **已修**：限定為「尺寸警告」，並註明 LCP 提示仍在 |
| 6 | `trip-collection-list.md` 狀態列仍是 `REQUEST_CHANGES` | **已修**：改為已結案並指向後續文件 |
| 7 | `trip-card-menu.test.tsx:154` 的同步焦點斷言屬同類風險 | **不處理**（Reviewer 記錄備查）：12 次連跑未紅，依使用者指示維持原樣 |
| 8 | `onRetry` 未接線，Error 態在 App 內不可達 | **不處理**：使用者裁定的既有限制，見 Known Limitations |
| 9 | 「重新命名」導向 `/trips/new` stub | **不處理**：`trip-collection-list.md` 已記錄的 stub 限制，非本輪引入 |
