# Implementation Plan：旅行收藏列表 — 視覺層與無障礙契約對齊

- 分支：`feature/trip-collection-list`
- 前置計畫：[`trip-collection-list.md`](trip-collection-list.md)（行為層，**已結案**——該檔記錄的 3 項 Blocking 已於本檔第 1～3b 段修畢並經複審覆核）
- 建立：2026-09-03
- 狀態：**實作與複審完成，等待使用者決定 Git 流程**（2026-09-04）——
  實作全數完成，最新一次複審為 `APPROVED`、0 Blocking。
  **審查歷程的權威記錄是 [`trip-collection-list-report.md`](trip-collection-list-report.md)
  的 Review Status**，本檔不複述版本號與次數。
  Test Seams、測試案例與通過標準已於 2026-09-03 經使用者確認。**程式尚未 Commit。**

> **產出方式**：本計畫以 `Skill(pintrip-design)` 為入口（該 Skill 已可透過 Skill 工具載入），
> 依其 precedence 表分派到五份 reference，再回查 `HomeScreen.dc.html` 與 `_ds_bundle.js` 取精確值。
> 前一輪未依此流程產出的對照清單已作廢，缺口紀錄見 `trip-collection-list.md` §流程缺口 3。

---

## 交接：從這裡接手（最後更新 2026-09-04）

> **本節於 2026-09-04 全面改寫**（Reviewer 第 4 次複審 Non-blocking 2）。它先前仍停在
> 2026-09-03「READY TO IMPLEMENT／等待第 1 次複審／六段／第 2 版報告／A 或 B 兩條路」的狀態，
> 字面上還在叫接手者從兩條早已走完的路裡選一條。這是本檔「標頭未隨內文更新」模式的第五次，
> 也是最會誤導接手者的一次。

**現在的狀態（2026-09-04）**：

- 78 列視覺對照全部實作完成。**分段經過見「偏離與計畫外的修改」一節**（該節自身即為完整清單，
  本檔不另行複述段數——複述出來的計數是本檔重複出錯最多次的東西，成因與現行做法見第 11 段）。
- Reviewer 第 1 次複審 `REQUEST_CHANGES`（2 Blocking、13 Non-blocking）→ 2 項 Blocking 已修
  → **13 項 Non-blocking 全數處置完畢** → 其後每一版皆 `APPROVED`。
  **逐版的審查結果與次數以 [`trip-collection-list-report.md`](trip-collection-list-report.md)
  的 Review Status 為準**，本檔不複述。
- 最新驗證：`npm test` 24／24、E2E 4／4、`lint`、`build`、`git diff --check` 全數 PASS。
- **程式尚未 Commit。** `APPROVED` 不等於 Git 授權——Commit／Push／PR 一律由使用者執行。

**下一步**：由使用者決定是否進入 Git 流程。建議的 Commit 拆分與應排除的檔案見下方
「working tree 但不屬本任務」與 `trip-collection-list-report.md` 的 Files Changed。

**若要繼續修改這個分支，接手第一件事**：

1. `Skill(pintrip-design)` —— 動到 UI 之前一定先叫，不要用 `cat`／`grep` 讀 skill 檔頂替。
2. 依 `SKILL.md` 的 precedence 表分派到需要的 reference。
3. 讀本檔的「實作進度」與「偏離與計畫外的修改」兩節，那裡有**逐段**的完整經過與所有偏離理由。
4. 讀 [`trip-collection-list-review-result.md`](trip-collection-list-review-result.md)
   —— **Reviewer 第 1 次複審的完整結果**（13 項 Non-blocking 逐項原文）。
   該檔是唯一未被改寫的對照基準；需要查證處置是否如實時以它為準，不要靠報告裡的摘要。
5. 讀 [`trip-collection-list-report.md`](trip-collection-list-report.md)（Developer Report，
   含驗收對照、TDD 證據、§10.6 實測、**逐版的 Review Status** 與已知限制。
   版本號與審查次數以該檔為準）。
6. 讀 [`trip-collection-list.md`](trip-collection-list.md) 取得原始行為層計畫、前一輪 Reviewer 的
   3 Blocking／16 Non-blocking，以及三個流程缺口的紀錄。

**流程規則（使用者 2026-09-03 確認，必須遵守）**：

- 列計畫與執行計畫時都要用 `Skill(pintrip-design)` 與 `claude-design-export`。
- 執行中發現計畫有問題：**停下 → 說明差異 → 說明理由 → 使用者確認 → 才改計畫 → 再繼續**。
  不得先自行實作、事後補寫。
- 每段做完，**偏離先寫回計畫，再回報**。
- 需要精確值時回查 `HomeScreen.dc.html` 與 `_ds_bundle.js`，**不採信程式碼註解**，
  也不停在 reference 的敘述——已知至少五處摘要與來源不一致。
- **同一份事實不要在兩個地方各寫一份。** 需要引用時指向來源，不要複述——複述出來的東西
  （標頭、計數標籤、狀態列、欄位值）都是下游，下游一定會漂移。這是本檔反覆出現的失效模式，
  成因與現行做法見第 11 段。**注意第 9 段的「擴充關鍵詞清單」已被取代，不要照做。**
- Git 寫入由使用者執行；`APPROVED` 前不得 Commit／Push／開 PR。

**working tree 但不屬本任務**：`.claude/`（Skill 複製、launch.json）、`.vscode/`。Commit 時建議排除。

---

## Goal

把已完成的行為層對齊設計稿的視覺層與無障礙契約，並補上 Reviewer 三項 Blocking。
不重做行為與既有測試。

## Expected Behavior

- 收藏摘要行與列表由同一份狀態推導：刪除後數字同步更新；沒有收藏時摘要行被說明句取代；讀取失敗時不算繪摘要行。
- 捲動列表會關閉已開啟的卡片選單，焦點歸還觸發鍵。
- 卡片選單錨定在 `•••` 上：右緣對齊觸發鍵右緣、左緣夾在 frame 內緣 8px、貼近 BottomNav 時向上翻轉。
- 每張卡片有單一可點區，輔助科技讀到「開啟旅行收藏：東京（28 個地點）」；`•••` 是它的兄弟節點。
- 所有裝飾（膠帶、貼紙、類別貼紙、便條、tagline）對輔助科技不可見。
- 鍵盤操作時，`•••`、選單兩列與卡片都有一致的 focus ring。
- 畫面在 360／390／430 三個寬度都不產生水平捲動。

## Acceptance Criteria

| # | 驗收條件 | 來源 |
| --- | --- | --- |
| A1 | 刪除一張收藏後，摘要行的收藏數與地點數同步更新 | `MVP.md` §5.2、`HomeScreen.dc.html` STATE RULES |
| A2 | 空資料時摘要行**被說明句取代**（不是摘要行 ＋ 額外一句） | `HomeScreen.dc.html` Empty frame |
| A3 | 錯誤狀態不算繪摘要行 | `HomeScreen.dc.html` Error frame |
| A4 | 捲動列表關閉選單，焦點歸還 `•••` | `HomeScreen.dc.html` CARD MENU §關閉條件 |
| A5 | 選單錨定、夾制與翻轉符合 CARD MENU 的量測規則 | 同上 §錨定與翻轉 |
| A6 | `•••` 命中區 44×44 且不放大 glyph、不從標題偷寬度、無 layout shift | 同上 §點擊區 |
| A7 | 卡片可點區的 `aria-label` 為「開啟旅行收藏：{名稱}（{N} 個地點）」 | ACCESSIBILITY §TripCard |
| A8 | 照片、膠帶、貼紙、類別貼紙、便條、tagline 全部 `aria-hidden` | ACCESSIBILITY §TripCard／§裝飾 |
| A9 | `•••`、選單兩列、卡片的 focus-visible 為 2px `--blue-400` + 2px offset，且不被 `overflow:hidden` 裁掉 | ACCESSIBILITY §Focus-visible |
| A10 | 摘要行與 `<ul>` 清單以 `aria-describedby` 關聯 | ACCESSIBILITY §列表語意 |
| A11 | 視覺數值逐項符合來源（Planned Changes 對照表） | `SKILL.md` precedence |
| A12 | 過長收藏名稱以 `line-clamp: 2` 安全處理，**不得以版面反推字數上限** | `MVP.md` §5.2 |
| A13 | 360／390／430 三個寬度皆無水平捲動 | `HomeScreen.dc.html` RESPONSIVE |

---

## Test Seams（2026-09-03 已確認）

視覺數值不寫成斷言 —— 那會變成抄 CSS，且隨設計微調就碎。**只有可從外部觀察的行為與 ARIA 契約進 seam**，
版面數值一律走 §10.6 手動檢查。

### Seam A：摘要行與列表的狀態一致性（新 seam，Vitest + RTL）

**公開介面**：`TripCollections` 在不同資料與狀態下算繪的結果。

**可觀察行為**
- 有資料：算繪收藏數與地點數的摘要行，數字等於傳入資料的加總
- 刪除一張後：摘要行的兩個數字同步更新
- 空資料：**摘要行不存在**，改為空狀態說明句
- 錯誤：摘要行與說明句都不存在，只有錯誤卡與重試鍵
- 摘要行與清單以 `aria-describedby` 關聯

**為何是穩定邊界**：這是「給定資料與狀態，畫面陳述什麼」的公開行為，直接對應 Blocking 1 與
`HomeScreen.dc.html` 的 STATE RULES。不綁定版式。

**為何是新 seam**：原 Seam 3 的公開介面是 `TripList`（只有列表區），摘要行在它之外。
本輪要求兩者由同一份狀態推導，邊界因此上移一層。依 `DEVELOPMENT_GUIDE.md` §3，這是**改變公開介面**，
需要你確認。

### Seam B：選單的關閉條件（既有 Seam 1 的邊界案例，Vitest + RTL）

**公開介面**：已確認的 Seam 1（TripCard `•••` 選單的互動與無障礙屬性）。

**新增的可觀察行為**
- 捲動時選單關閉，`aria-expanded` 回到 `false`，焦點回到 `•••`

**為何算 Seam 1 內**：Seam 1 已涵蓋「Esc 關閉並歸還焦點」「再點同一顆關閉」「點 B 關 A 開 B」，
捲動關閉是同一個公開介面上的第四個關閉條件，`HomeScreen.dc.html` CARD MENU §關閉條件把五個條件並列。
依 §3「可以在已確認的 Seam 內增加必要邊界案例」。**若你認為這算新增 seam，我停下重新確認。**

### Seam C：TripCard 的無障礙契約（新 seam，Vitest + RTL）

**公開介面**：算繪一張 TripCard 後，輔助科技可取得的名稱與可見性。

**可觀察行為**
- 卡片可點區的可及名稱為「開啟旅行收藏：{名稱}（{N} 個地點）」
- `•••` 與可點區是兄弟節點，不是巢狀互動元素（`•••` 可獨立取得焦點）
- 照片、裝飾、類別貼紙不出現在無障礙樹

**為何是穩定邊界**：`HomeScreen.dc.html` ACCESSIBILITY 卡明文標示為**契約**（該卡自述「本卡是契約，
不是這份 mock 的實測描述」），且與版式無關。

**不涵蓋**：focus ring 的顏色與粗細（CSS 值，§10.6 手動）。

### 不新增 seam 的部分

Seam 2（刪除 sheet）、Seam 4（E2E 完整刪除流程）不變。本輪 sheet 只改視覺數值與動畫，
公開行為與回呼邊界完全不動。

---

## Test Cases and Passing Criteria

垂直切片，一個測試 → 一個最小實作 → 下一個。

| # | Seam | 測試檔 | 行為 | Red 時預期的失敗 | Green 後必須成立 |
| --- | --- | --- | --- | --- | --- |
| 1 | A | `trip-collections` | 有資料時算繪摘要行，數字為加總 | 找不到摘要文字 | 摘要行存在且數字正確 |
| 2 | A | `trip-collections` | 刪除一張後兩個數字都更新 | 數字停在原值 | 數字等於剩餘資料的加總 |
| 3 | A | `trip-collections` | 空資料時摘要行不存在、只有說明句 | 摘要行仍在 | 查不到摘要行，查得到說明句 |
| 4 | A | `trip-collections` | 錯誤狀態下摘要行與說明句都不存在 | 摘要行仍在 | 只有錯誤說明與重試鍵 |
| 5 | A | `trip-collections` | 摘要行與清單以 `aria-describedby` 關聯 | 屬性不存在 | `ul` 的 `aria-describedby` 指向摘要行 id |
| 6 | B | `trip-card-menu` | 捲動關閉選單並歸還焦點 | 選單維持開啟 | `aria-expanded="false"`，焦點在 `•••` |
| 7 | C | `trip-card` | 可點區名稱為「開啟旅行收藏：東京（28 個地點）」 | 名稱只有「東京」 | 名稱完全符合 |
| 8 | C | `trip-card` | `•••` 可獨立取得焦點，非巢狀於可點區 | —— | 兩者皆可個別取得焦點 |
| 9 | C | `trip-card` | 照片、裝飾、類別貼紙不在無障礙樹 | 類別貼紙以 `神社` 等名稱出現 | 查不到這些節點 |

既有 15 條測試除下列一項外斷言不動：測試 13（空資料只顯示空狀態說明與 Start New Trip）
的說明句改由 `TripCollections` 算繪，斷言目標隨 Seam A 上移一層。

---

## Out of Scope

- Loading 狀態（骨架高度 PENDING DESIGN；且 mock 同步，無觸發時機）
- 刪除的進行中與失敗回饋（`import-lifecycle.md` 決策帳本列為 **OPEN**）
- 更換 `--font-kr` / `--font-tc` 字體（`design-system.md` 列為 PENDING DESIGN，明文不得自行更換）
- 把選單提升為 DS `MenuPopover`（export 建議提升，但 `components.md` 記載使用者決定維持頁面層，不提升）
- `deleteTrip(id)` 的實作（刪除維持作用於元件 state，等資料存取方案定案）
- `/trips/new`、`/trips/[tripId]`、`/imports` 的完整頁面（只補 `AppShell` 讓 stub 不成死路）

---

## Files to Inspect

- `Skill(pintrip-design)` → `SKILL.md` 的 precedence 表與 Reference files（五份全讀）
- `docs/design/claude-design-export/HomeScreen.dc.html` —— Home 最高優先。特別是
  `<style>` 區塊、STATE RULES、LAYOUT / SPACING、CARD MENU、DELETE TRIP CONFIRM、
  INTERACTION、ACCESSIBILITY、ASSETS 各張 spec 卡
- `docs/design/claude-design-export/_ds/pintrip-design-system-*/_ds_bundle.js` ——
  `TripCard`、`LocationLine`、`StartTripCard`、`Button`、`BottomNav`、`CategoryIcon`
- `docs/MVP.md` §5.2、`docs/ARCHITECTURE.md` §2.1／§4／§8、`docs/DEVELOPMENT_GUIDE.md` §3／§10
- `src/styles/tokens/`

---

## 實作進度

| 段 | 範圍 | 狀態 |
| --- | --- | --- |
| 1 | Seam A（測試 1–5）＋ 對照表 #11–#15 | **完成** —— 20/20 測試綠、lint／build／`git diff --check` 乾淨。#11–#15 已回查 export 核對 |
| 2 | Seam C（測試 7–9）＋ 卡片視覺 #22–#38 | **完成** —— 23/23 測試綠 |
| 3a | Seam B（測試 6）＋ App Shell #1–#10、選單 z-index #48／#51 | **完成** —— 24/24 測試綠 |
| 3b | 選單錨定與翻轉 #39–#47、#49–#50、刪除 sheet #52–#65 | **完成** —— 24/24 測試綠；版面數值待 §10.6 手動量測 |
| 4 | 品牌區塊 #16–#21、Start New Trip／Empty／Error #66–#78、三個 stub | **完成** —— 24/24 測試綠；版面數值待 §10.6 手動量測 |

### 偏離與計畫外的修改

Reviewer 只看得到 diff，看不到對話。凡是與 78 列不同、或表格沒列到的，一律記在這裡。

> 下列第 1～3b 段共 10 項偏離，已於 2026-09-03 逐項向使用者說明差異與理由並**取得確認**。

**第 1 段**

- `trip-list.test.tsx` 的空狀態斷言依決定 14 上移一層；另把該檔錯誤狀態測試中一條已恆真的
  斷言換成 `queryByRole('list')` 不存在。
- `next/navigation` 在 `trip-collections.test.tsx` 以框架邊界 mock 處理（jsdom 無法掛載
  App Router），未 mock 任何內部協作者。

**第 2 段**

- **#27 的 `h3` 實作為 `h2`。** 我們的頁面用 `<h1>我的旅行收藏`，照 export 寫 `h3` 會跳級；
  export 的 frame 沒有 h1（它用 h2 當區塊標題），那個 `h3` 是相對於它自己的階層。
  語意層調整，不影響視覺。
- **表格未列：`CategoryIcon` 的 `drop-shadow(0 1px 2px rgba(122,96,58,0.18))`。**
  來源是 DS `CategoryIcon` 元件本身，78 列盤點時漏列，補做。
- **未套 DS 的 `--font-kr`。** DS 用 Noto Sans KR 排繁中是 `design-system.md` 明列的
  PENDING DESIGN，專案已於 `layout.tsx` 決定改用 TC 版本並全域套用。沿用現況，
  屬 Out of Scope 的字體議題。

**第 3a 段**

- **表格未列：`•••` 外層由 `z-10` 改為 `z-[1]`。** 卡片沒有建立 stacking context，
  原本的 `z-10` 是與 nav 的 `z-5` 在同一層級比較，等於觸發鍵排在 nav 之上，違反
  `components.md` 的層級表。實際看不到 bug（被捲動容器裁掉），但數字是錯的；
  `z-[1]` 只夠浮在標題 `::after` 覆蓋層之上。
- **`AppShell` 以 `h-dvh` 建立有界高度**供內層捲動使用。#1 只寫「唯一捲動層」，未指定高度
  來源；未改 `layout.tsx`。屬**實作決定**。

**第 6 段（Reviewer 複審退回後的修正，2026-09-03）**

Reviewer 於 2026-09-03 回報 `REQUEST_CHANGES`，2 項 Blocking，均已修正：

- **Blocking 1：Empty／Error 狀態出現兩枚便條。** `page.tsx` 的 header 無條件算繪 100px 那枚，
  `TripCollections` 又在下方加 132px 那枚。設計要求的是「**移到**下方」——export 的 Empty frame
  與 Error frame，header 右欄**只有 avatar**。
  **修法**：便條的去留取決於 client state，所以把品牌區的算繪決定權交給 `TripCollections`；
  美術素材仍在 `page.tsx`（Server）算繪，以 `ReactNode` prop 傳入，**不進 client bundle**。
  `hasCollections` 決定 header 那枚、`isEmpty` 決定下方那枚，error 時兩枚都不算繪。
  **這一項的根因是我的 §10.6 量測項目挑錯**——只量了「放大的那枚存在」，那是必然成立的，
  沒有量「原本那枚是否消失」。因此除了改程式，另把「便條是移動不是新增」補進 Seam A 的
  測試 1／3／4 的斷言（在已確認的 Seam 內增加邊界案例，符合 §3），讓它以後由測試守住。
- **Blocking 2：`--font-tc` 的註解仍寫 `Korean copy`，但計畫與 Developer Report 都聲稱已修。**
  這是把「打算做的」寫成「做過的」。已實際修正 `src/styles/tokens/_typography.css:6` 的註解。

**第 6 段的重新驗證**：`npm test` 24／24、`npm run lint`、`npm run build`、`git diff --check`、
`npm run test:e2e` 4／4 全數 PASS。§10.6 重新量測空狀態，這次量便條的**數量**：
有 2 筆收藏時 1 枚（105 = 100 旋轉後外框）、剩 1 筆時 1 枚、**刪光後 1 枚（139 = 132 旋轉後）**，
avatar 三態都在。Error 態仍無法在 App 內觸發（`NOT AVAILABLE`），改由測試 4 涵蓋。

**尚未處理**：Reviewer 的 Non-blocking 7 項——使用者於 2026-09-03 決定**納入本輪**，見「第 7 段」。

**第 7 段（Reviewer Non-blocking，2026-09-03 使用者選擇路線 B 後執行）**

本段開始前依交接節重新以 `Skill(pintrip-design)` 為入口，依 precedence 表分派到
`references/accessibility.md`（全文）與 `references/screens.md` 的 Home 段，
精確值一律回查 `HomeScreen.dc.html` 與 `_ds_bundle.js`。

Reviewer 的 7 項只有簡寫留在報告與本計畫裡（`docs/` 下沒有獨立的 Reviewer 報告檔），
因此每一項都先回到來源查證它實際指的是什麼，再動手：

| # | Reviewer 簡寫 | 查證後的實際內容（來源） | 處理 |
| --- | --- | --- | --- |
| 1 | `CategoryIcon` 缺 `object-contain` | DS `CategoryIcon` 是 `objectFit:'contain'` + `display:'block'`；我們寫死 27×27 而未給 `object-fit`。實測六顆類別貼紙的原生尺寸是 32×29／32×26／32×39／32×37／32×25／32×32，**全部非正方**，等於一直被拉扁 | `trip-card.tsx` 補 `object-contain`。實測 `object-fit: contain` ✓ |
| 2 | 捲動測試的 capture 旗標守不住 | 測試原本 `fireEvent.scroll(document)`，事件目標就是 `document`，capture 與否都會收到——拿掉元件的 `true` 測試仍綠 | 測試改為把選單掛進 `data-scroll-container`（與 `AppShell` 真實 DOM 一致）並對該容器發 scroll。**守衛已驗證**：暫時拿掉 `true` → 該條轉紅；還原 → 綠 |
| 3 | 計畫中兩處來源歸屬寫錯 | 使用者於 2026-09-03 提供 Reviewer 原文（[`trip-collection-list-review-result.md`](trip-collection-list-review-result.md)）後定位為 Non-blocking **1（worldmap 靠左的依據）** 與 **2（#37 照片圓角 ／ 430 高度 218 的歸屬）**。兩處均已回查 export 確認 Reviewer 正確：`HomeScreen.dc.html` 的 RESPONSIVE RULES 寫「世界地圖 cut-out **靠右**對齊」、LAYOUT／SPACING 卡寫「照片圓角 **13px**」與「自適應（實測 360:183 · 390:196 · **430:218**）」 | **已更正依據敘述，兩項結論皆不變**。詳見第 5 段兩處「更正」段落，以及對照表 #37／#67 與「先修正兩項先前的誤判」表 |
| 4 | Preset B 膠帶數值 | export line 87 是 `radial-gradient(circle,#D8CBEC 1.5px,transparent 1.6px) 0 0/8px 8px,#F1EDF7` + `border-radius:2px`；我們是無 `circle`、stop `1.5px`、`7px 7px`、**且漏了 radius 2**（A／C／D 都有）。註：DECORATION PRESETS 卡的 B 列沒寫 radius，**markup 才是精確值來源** | 三處對齊。實測 `radial-gradient(circle,…) / 8px 8px / radius 2px` ✓ |
| 5 | 裝飾缺 `pointer-events:none` | ACCESSIBILITY §裝飾要求「一律 `aria-hidden` **+ `pointer-events:none`**」。`trip-card-slot` 四組都有；缺的是 `trips/page.tsx` 的 tagline 與兩枚便條（100／132），**以及 `trip-card.tsx` 的類別貼紙**（Reviewer 原文明列，第一次讀簡寫時我漏了類別貼紙） | 四處補 `pointer-events-none`。實測全站裝飾圖與類別貼紙皆 `pointer-events: none` + `aria-hidden` ✓ |
| 6 | BottomNav 用 `<Link>` 未進偏離紀錄 | 屬實：ACCESSIBILITY 卡字面寫「`<nav aria-label="主要導覽">` 內兩個 `button`」，我們用 `<Link>`，而同樣情形的 Start New Trip 有記（第 4 段修正 3）、這裡沒記 | **補記於下**，程式不動 |
| 7 | A9 focus ring 無量測證據 | Reviewer 原文（Non-blocking 3）實際是**三個**驗證空缺，不只 focus ring：①A9 focus ring 無量測列；②#39 左緣夾制實測寫「11 ✓（夾制未觸發）」，代表**夾制路徑從未被驗證**；③#65「背後列表不可捲動」無量測列 | **三項全部補測**，見 §10.6 |

**第 6 項的偏離紀錄（補記）：BottomNav 兩格維持 `<Link>`，不改成 ACCESSIBILITY 卡字面的 `button`。**
理由與第 4 段修正 3（Start New Trip）同一條：該卡的重點是「要有可讀名稱與 `aria-current`，
不要 div + onClick」；export 的畫布沒有 router，只能寫 `button`。兩格實際做的是**導航**，
用 `<a>` 才對——改 `button` 會失去中鍵開新分頁，且必須靠 JS 導航。
契約要求的其餘部分全部成立：`<nav aria-label="主要導覽">`、兩格等寬、命中區 ≥44、
`aria-current="page"`、icon `aria-hidden`、未選取的去飽和不是唯一訊號。

**第 7 段的偏離與計畫外的修改**

- **表格未列（實作中發現、2026-09-03 停下說明後取得使用者核准才動手）：
  `trip-card-menu.test.tsx` 兩條焦點斷言的等待模型錯誤，導致測試間歇失敗。**

  **發現經過**：驗證第 2 項的守衛時，連跑同一個測試檔發現
  `opening another card menu closes the first one in a single interaction`（原第 125 行）
  會間歇轉紅。為確認不是本輪改出來的，另行重建**改動前**的版本對照連跑：
  改動前 4 次紅 3 次、改動後 4 次紅 1 次——**兩者都會紅，屬既有缺陷**。

  **成因**：元件刻意用 `requestAnimationFrame` 把焦點移到選單第一列（Radix 只在鍵盤開啟時
  自動移焦，`onOpenAutoFocus` 是公開型別刻意不給的私有 prop）。真實瀏覽器裡 rAF 在 paint 前
  就跑完，使用者看不到延遲；**是測試在 `await user.click()` 之後同步斷言，與 jsdom 那個
  約 16ms 計時器版本的 rAF 搶**。原第 47 行是同一個寫法，同樣有風險。

  **處理**：只改測試的等待模型——第 47、125 行的焦點斷言包 `waitFor`。
  `waitFor` **沒有放寬斷言**：焦點若真的沒落到第一列，它會逾時失敗，契約照樣守住。
  **元件的 rAF 做法不動**——那是前一輪 Reviewer 已「經查證屬實」認可的技術主張，
  改它等於動到已認可的行為層，超出本輪範圍且需重新確認 Seam。

  **另一條的處理**：`closes when the list scrolls` 對「選單消失」已用 `waitFor`，
  但「焦點歸還」是同步斷言，而關閉後的歸還由 Radix 處理、同樣可能非同步。
  依使用者指示「若也會抽到紅就一併包起來」——**修正後連跑 6 次完整測試 + 6 次該檔單跑
  都沒有轉紅，因此維持原樣**，此處記錄它是同類風險，供 Reviewer 判斷是否要一併加固。

  **穩定性證據**：修正後 `npm test` 連跑 **6 次全部 24／24 綠**；
  `trip-card-menu.test.tsx` 另單跑 **6 次全部 7／7 綠**。共 12 次無任何紅。

- 四項程式修改（第 1、4、5 項與第 2 項的測試）都是回到來源值或修正等待模型，
  沒有新的實作決定；第 3、6 項只動文件。

- **表格未列（記錄用）：報告第 2 版把 Reviewer 的 13 項 Non-blocking 簡寫成 7 項，
  過程中遺漏了 6 項，且其中兩項被縮小了範圍。** 取得 Reviewer 原文後才發現：
  簡寫漏掉 `--dur-menu`／`--dur-sheet` 兩個 token（原文 4）、`.claude/launch.json` 與
  `.vscode/settings.json` 未記錄（原文 5）、測試 3 的分類可能低報（原文 7）、
  `onRetry` 未接線使 Error 態在應用中不可達 ＋ `trip-list-error.tsx` 的 `'use client'` 冗餘
  （原文 11）、content bottom pad 的備查記錄（原文 12），以及原文 3 裡除 focus ring 外的
  另外兩個量測空缺。被縮小的兩項（原文 3 的三個空缺、原文 10 的類別貼紙）已於本段補做；
  **遺漏的 5 項經使用者 2026-09-03 逐項界定後，也一併納入本段**，處理如下。

**遺漏的 5 項（原文 4／5／7／11／12，使用者逐項界定範圍）**

- **原文 4：`--dur-menu`／`--dur-sheet` 兩個 token 移除，`@utility` 內直接寫 `140ms`／`320ms` 字面值。**
  Reviewer 正確：`--dur-*` 不在 Tailwind 的 namespace 內，放進 `@theme` **不產生任何 utility**，
  只是掛在 `:root` 的 CSS 變數；而 `_effects.css` 同檔既有註記明白記載
  `--dur-fast`／`--dur-base`／`--dur-slow` 是**刻意移除**、改用 `duration-*`——再引入同一形狀
  等於與該檔已記錄的決定矛盾。**`--ease-soft` 保留**（它有 namespace）。
  三個 `@utility` 本身符合 §2.1 第 3 條，不動。
  **編譯產物驗證**（`ARCHITECTURE.md` §2.1）：production CSS 中 `menu-motion`／`sheet-motion`／
  `dim-motion` 三者都在、**各只定義一次**（`.menu-motion` ＋ `[data-side=top]`；
  `.sheet-motion[data-state=open/closed]`；`.dim-motion[data-state=open/closed]`），
  `prefers-reduced-motion` 區塊完整，時長編譯為 `.14s`／`.32s`，**輸出中已無任何 `--dur-*`**。

- **原文 5：`.claude/launch.json` 與 `.vscode/settings.json` 兩份工具設定補記錄，檔案不動。**
  兩者**不屬本任務範圍**，屬 `AGENTS.md`「不得修改任務範圍外的檔案」的邊緣情形，
  之前兩份計畫都沒有記。`.claude/launch.json` 是為了本輪的 §10.6 dev server 量測而建；
  `.vscode/settings.json` 內容是空物件 `{}`。**Commit 時建議排除**；
  `.vscode/settings.json` 的去留由使用者決定，本輪不刪。
  （`.claude/skills/pintrip-design/` 屬已授權的流程缺口 3 處置，Reviewer 已 `diff -r`
  驗證與 `.agents/` 逐字相同。）

- **原文 7：測試 3 的分類更正——低報，不是灌水。** 前一輪 `trip-collections.tsx` 無條件算繪摘要行，
  空資料時輸出「目前有 0 個旅行收藏 · 0 個地點」，命中該測試的 `SUMMARY` regex，
  **第一次執行應為紅**，不是「一開始就綠的契約守衛」。它實際是綠的，較合理的解釋是
  測試 1／2 的 Green 一次做完三態分流，**超出「通過當前測試的最小實作」**。
  已更正報告的 TDD Evidence 分類與說明；此處同步記錄那個過大的 Green 步距。

- **原文 11：只做 `'use client'` 那一半。** `trip-list-error.tsx` 冗餘的 `'use client'`
  （父層已是 Client）**已移除**。**`onRetry` 維持不接線**（使用者裁定）：Error 態在 App 內不可達
  （mock 不會失敗），而「重試要做什麼」屬決策帳本的 `OPEN` 項，接上去等於自行發明行為，
  也會產生死碼。理由已寫進報告的 Known Limitations。

- **原文 12：content bottom pad 只記錄備查。** MOBILE LAYOUT／SAFE AREA 卡寫
  「Content bottom pad：72px + inset」，實作是 `pb-[72px]`。export 三個 frame 的實際 markup
  用的也是 `padding:12px 20px 72px`，且 nav 自身已吃掉 bottom inset、與捲動層是 flex 兄弟
  而非覆蓋——**Reviewer 自己已判斷不是缺陷**，照其理由記錄備查，程式不動。

**第 7 段的驗證**

| 步驟 | 指令 | 結果 |
| --- | --- | --- |
| 1 | `npm run lint` | **PASS** |
| 2 | targeted：`trip-card-menu` | **PASS**（7／7，連跑 6 次） |
| 3 | `npm test` | **PASS**（24／24，連跑 6 次） |
| 4 | `npm run build` | **PASS** |
| 5 | `git diff --check` | **PASS** |
| 6 | §10.6 實機檢查 | **PASS**（focus ring 三處、#39 夾制路徑、#65 背後不可捲動、裝飾 `pointer-events`、類別貼紙 `object-fit`、Preset B 膠帶，見上） |
| 另 | `npm run test:e2e` | **PASS**（4／4） |

程式每次變動後都完整重跑。三輪重跑（修正等待模型後 6 次、補做類別貼紙後 3 次、
處理原文 4／11 後 3 次）合計 **`npm test` 12 次全部 24／24**；
lint、build、`git diff --check`、E2E 4／4 每輪皆 PASS。

動效實機複驗（移除 `--dur-*` 之後）：選單 `menu-in-down` **0.14s**、
sheet `sheet-in` **0.32s**、dim **0.32s**、ease 仍為 `cubic-bezier(.32,.72,.28,1)`——與改動前一致。

E2E 需要 3000 埠，但有個先前遺留的 `next dev`（PID 37240／埠 61933）占住 Next 的單一實例鎖，
停掉後才跑得起來；跑完已重新起一個 dev server（3000），第二次 E2E 直接重用它。

**第 8 段（Reviewer 第 2 次複審 `APPROVED` 後，處理 Non-blocking 1–6，2026-09-04）**

Reviewer 於 2026-09-04 第 2 次複審回報 **`APPROVED`**（0 Blocking、9 Non-blocking），
並指出前 6 項是同一個模式：**文件的標頭／摘要沒有隨內文更新**，而且明講這是
「同一個模式的第三次出現」。使用者決定先修完再送一次複審。

| # | Reviewer 指出的位置 | 實際問題 | 處理 |
| --- | --- | --- | --- |
| 1 | 本檔「兩項待裁定」第 2 項 | 仍寫 Start New Trip 高度 90／108／90，但第 5 段已改回靠左＋120、三寬度皆 108 | 標為過期並指向第 5 段 |
| 2 | 本檔第 3b 段 | `--dur-menu`／`--dur-sheet` 的 token 決定已於第 7 段推翻刪除，該段沒有任何交叉指向 | 加註被第 7 段推翻，明寫**不得據此實作**；原始紀錄保留供追溯 |
| 3 | 報告標頭與 Review Status | 仍寫「7 項中 6 項已處理、1 項待原文」，內文早已是 13 項全處理 | 更正並保留「標頭曾經寫錯」的紀錄 |
| 4 | 報告 Git Evidence | diff stat 寫 91 insertions，實測 90 | 更正為 90 |
| 5 | 報告 §10.6 摘要 | 「`next/image` 警告已清為 0」比本檔原文（「**尺寸**警告」）更強，而 LCP 提示仍在 | 限定為尺寸警告，並註明 LCP 提示不在清除範圍 |
| 6 | `trip-collection-list.md` 狀態列 | 仍是「REQUEST_CHANGES — 3 項 Blocking 待修」，那 3 項早已修畢並經兩次複審覆核 | 改為已結案並指向後續文件 |

第 7～9 項 Reviewer 只要求記錄備查，不要求處理：`trip-card-menu.test.tsx:154` 的同步焦點斷言
（同類風險，但 12 次連跑未紅，依使用者指示維持）、`onRetry` 未接線（使用者裁定的既有限制）、
「重新命名」導向 `/trips/new` stub（`trip-collection-list.md` 已記錄，非本輪引入）。

**第 8 段的偏離**：無。六項全部只改文件敘述，**程式與測試一行都沒動**。

**第 8 段的驗證**：純文件修改，依 `CODE_REVIEW.md` §10 不需要 `lint`／`build`；
已執行 `git diff --check`。程式未動，第 7 段的驗證結果（`npm test` 24／24、E2E 4／4、
lint、build）仍然成立。

---

**第 9 段（Reviewer 第 3 次複審 `APPROVED` 後，處理 Non-blocking 1–4，2026-09-04）**

Reviewer 第 3 次複審回報 **`APPROVED`**（0 Blocking），並確認第 8 段六項全部改對、
程式與測試一行未動（以 mtime ＋ 逐行 spot-check 兩種方式獨立證實，未採信送審訊息）。
但它同時開出 4 項新 Non-blocking，**其中 3 項仍是同一個「標頭未隨內文更新」的模式**——
而且第 1 項就殘留在第 8 段自己的修正裡。

| # | 問題 | 處理 |
| --- | --- | --- |
| 1 | 第 8 段只改了「兩項待裁定」的內文，**沒改指向它的計數標籤**：Validation Plan 的「含 2 項待裁定」與節標題「### 兩項待裁定」。實際兩項都已裁定（待裁定數為 0），且與 `report.md` 的「2 項已裁定差異」**直接對立** | **已修**：兩處都改為「已裁定」，並在節標題下加註說明這正是同一個模式殘留在修正它的那次修正裡 |
| 2 | `report.md` 標頭第 4 版改成「13 項全數**處理**完畢」，方向由低報翻成輕微**高報**——原文 11 只做後半、原文 5／12 只記錄、原文 6 僅文件補記 | **已修**：改為「全數**處置**完畢（含 1 項經使用者裁定只做一半、3 項為只記錄或僅文件補記）」，並在原有的更正紀錄裡補上這次的再更正 |
| 3 | `report.md` 的「Review-stage Refactor：`NOT YET ASSESSED`」未隨 Reviewer 兩度判定更新 | **已修**：改為 `NOT REQUIRED`，並註明是初次交審時的值未更新 |
| 4 | 第 8 段被插在第 7 段本體與「第 7 段的驗證」之間，把第 7 段切開 | **已修**：第 8 段移到第 7 段驗證之後，閱讀順序恢復 |

第 5～7 項是使用者已裁定不處理的既有限制，狀態不變。

**第 9 段的偏離**：無。四項全部只改文件敘述與段落位置，**程式與測試一行都沒動**。

**這個模式為什麼會重複出現（記錄用）**：三輪下來同一個失效模式出現四次，共同點是
**改了內容卻沒去找「誰在引用這個內容」**——標頭、計數標籤、狀態列、欄位值都是內容的下游。
可重複的做法：改任何一段結論後，用該結論的關鍵詞全檔搜尋一次，而不是只改當下那一段。

**掃描關鍵詞清單**（2026-09-04 補全）：初版只列「待裁定／7 項／NOT YET」，
Reviewer 第 4 次複審隨即指出**這份清單自己就有缺口**——它漏了 `REQUEST_CHANGES`，
因此沒掃到第 4 版把 `trip-collection-list.md` 改成「已結案」後、本檔 `:4` 仍標它為
`REQUEST_CHANGES` 的矛盾（**第五次同模式，且是第 4 版自己造成的**）。
現行清單：`待裁定`／`REQUEST_CHANGES`／`READY TO IMPLEMENT`／`NOT YET`／`NOT REVIEWED`／
`等待複審`／版本號（`第 N 版`）／段數（`六段`／`九段`）／項數（`7 項`／`13 項`）。
**清單本身也要隨新的狀態詞成長。**

> **⚠️ 這個做法已於第 11 段被取代（2026-09-04，Reviewer 第 5 次複審）**：擴充清單的路走不通——
> 它接連兩次因漏字而漏掉殘留（第 10 段漏 `REQUEST_CHANGES`、本段自己漏 `九段`）。
> 現行做法是**不要在兩個地方各寫一份同樣的事實**：計數只留在 `report.md` 的 Review Status，
> 計畫改為指向它。本段保留供追溯，**不再是現行做法**。

---

**第 10 段（Reviewer 第 4 次複審 `APPROVED` 後，處理 Non-blocking 1–2，2026-09-04）**

Reviewer 第 4 次複審回報 **`APPROVED`**（0 Blocking），確認第 9 段四項全部改對，
並特別查證了兩件我請它確認的事：**「處置」是實質修正不是換說法**
（它核對括號的分類與算術：9 完整 + 1 只做一半 + 3 只記錄 = 13，與內文兩張表逐格相符）、
**我對它第 3 次複審結論的轉述如實未誇大**。我自查掃出的「列出待裁定」殘留也經它確認屬實。

它另開 2 項 Non-blocking：

| # | 問題 | 誰造成的 | 處理 |
| --- | --- | --- | --- |
| 1 | 本檔 `:4` 仍把 `trip-collection-list.md` 標為 `REQUEST_CHANGES`，但那個狀態是**第 4 版自己改成「已結案」的** | **第 4 版造成**，且第 9 段的掃描清單漏了 `REQUEST_CHANGES` 這個詞，所以第 5 版也沒掃到 | **已修**：`:4` 改為「已結案」；**並補全第 9 段的掃描關鍵詞清單**，明寫清單自己有缺口這件事 |
| 2 | 整個「交接：從這裡接手」節全面過期：`READY TO IMPLEMENT`／「等待複審」／「六段」／「第 2 版報告」／「下一步只有兩條路 A／B」 | **不是本輪造成**——Reviewer 誠實說明這節在它第 1 次複審讀全檔時就存在，它前三輪都沒點名 | **已修**：整節改寫成反映現狀（實作完成、已通過複審、下一步是 Commit），並在節首用 blockquote 記下它先前停在哪個狀態。**後續依第 11 段改為不複述計數** |

**這一項為什麼值得修**：那節字面上還在叫接手者「從這裡接手」，並在**兩條早已走完的路**之間選一條。
它是本檔最會誤導接手者的區塊，也是第 9 段所訂方法目前最大的一塊未套用區域。

**第 10 段的偏離**：無。兩項全部只改文件敘述，**程式與測試一行都沒動**。

**掃描方法的第一次實測結果**：補全清單後全檔掃 8 個關鍵詞
（`REQUEST_CHANGES`／`READY TO IMPLEMENT`／`NOT YET`／`NOT REVIEWED`／`等待複審`／`六段`／
`第 2 版 Developer`／`兩條路`），殘留命中為 **0**——其餘命中全部是正確的歷程敘述或清單自身。
**教訓：掃描清單本身也是需要維護的下游內容**，它在第 9 段被訂出來、第 10 段就發現有缺口。

---

**第 11 段（Reviewer 第 5 次複審 `APPROVED` 後，改掉「錯誤的類」而不是再補一個實例，2026-09-04）**

Reviewer 第 5 次複審回報 **`APPROVED`**（0 Blocking），確認第 10 段兩項都改到位、
掃描清單的自我記錄準確、對它結論的轉述與責任歸屬皆如實未推責。

但它在**我為了修正第五次而重寫的那一節裡**，又找到兩個計數錯誤：

| 我寫的 | 實際 | 性質 |
| --- | --- | --- |
| 「Reviewer **連續四次**回報 `APPROVED`」 | **三次**（第 3、4、5 版）。是**四次複審**，第 1 次為 `REQUEST_CHANGES` | **高報 Reviewer 的認可次數**；且同一句的括號自己只列三個版本，自相矛盾，並與 `report.md` 正確的枚舉牴觸 |
| 「共**九段**」 | **十段**——我在同一次編輯裡就加了第 10 段 | 我宣告的掃描清單裡有「段數（六段／九段）」，但**實際搜的 8 個詞裡沒有 `九段`**。「殘留命中 0」在那 8 個詞內為真，範圍卻比宣告的窄 |

合計是同一失效模式的**第 6、7 次**，且第二項是**清單漏字導致漏掉殘留的第二次**
（上一次漏的是 `REQUEST_CHANGES`）。

**這一段沒有再補一個實例，而是改掉錯誤的類。** Reviewer 的建議、使用者裁定採納：

> 不要再擴充關鍵詞清單——這已是它第二次因漏字而漏掉殘留。真正收斂的做法是**把計數從計畫裡拿掉**：
> 審查歷程只保留一句指向 `report.md` 的 Review Status，段數改成指向「偏離與計畫外的修改」一節
> 而不寫數字。**沒有被複述的數字就不會過期。**

**做法**：本檔不再複述任何審查計數與段數——

- 標頭狀態列與交接節：改為「最新一次複審為 `APPROVED`」＋「逐版結果與次數以 `report.md`
  的 Review Status 為準，本檔不複述」
- 段數：一律改為指向「偏離與計畫外的修改」一節本身（該節即為完整清單）
- 接手清單移除「第 N 版報告」「四次複審結果」等會漂移的數字，改為指向該檔的 Review Status

**權責切分因此變得明確**：`report.md` 的 Review Status 是審查歷程的**唯一權威記錄**，
本檔只描述做了什麼與為什麼，不再持有會過期的計數。

**這個授權要如實說明它的來歷**：該節**並非從未出錯**——Reviewer 第 2 次複審的 Non-blocking 3
指名的正是它（當時 Review Status 仍寫「7 項中 6 項已處理」，內文卻已是 13 項），
**自第 4 版更正後**才可靠，其後於第 3、4、5 次複審均確認正確。
初版這裡寫「Reviewer 五次複審都確認它是對的」，**那是第二次高報 Reviewer 的認可**
（第一次是「連續四次 `APPROVED`」），已於同日更正。用不準確的背書去撐一個正確的結構決定，
反而會削弱它。

**第 11 段的偏離**：無。全部只改文件敘述，**程式與測試一行都沒動**。

**這個模式的記錄**：同一失效模式在本檔反覆出現，每一次的處理都是「補一個實例」——
改內容忘了改標頭、補關鍵詞清單、清單自己又漏字。**直到這一輪才改成移除產生錯誤的結構本身。**
教訓不是「掃描要更仔細」，而是**同一份事實不要在兩個地方各寫一份**——
複述就是下游，下游一定會漂移。（次數不寫在這裡：逐輪的實際項目見
[`trip-collection-list-report.md`](trip-collection-list-report.md) 的 Review Status。）

**這一節之後不再新增段落紀錄**（使用者 2026-09-04 裁定）：純文件修正輪不再於本檔新增「第 N 段」，
改為只記在 `report.md` 的 Review Status。理由是本檔記錄自己的審查歷程，
**每修一輪就新增一段描述上一輪的敘述，而新敘述本身又會產生新的錯誤**——
這正是迴圈不收斂的來源。切斷它的方法是不再產生新的描述性文字。

---

**第 5 段（使用者回報後修正，2026-09-03）**

- **worldmap 改回靠左，還原 `paddingLeft: 120`（推翻同日稍早的靠右判定）。**
  §10.6 實測後三個訊號一致指向靠左：①DS bundle 內部咬合（`left:6` + `paddingLeft:120` +
  箭頭最右，那個 120 正是為了空出左側 126px）；②移除 120 後高度變成 **90／108／90**，
  偏離文件記的 104；③改回靠左 + 120 後三個寬度都是 **108**，說明文字一致折兩行。
  **依據敘述更正（2026-09-03，Reviewer Non-blocking 1）**：原本寫「反方的三處敘述是**同一句話
  被轉述三次**（`screens.md` → `components.md` → export ASSETS）」——**這句是錯的**。
  反方的三處中有**兩處在 `HomeScreen.dc.html` 自身**：RESPONSIVE RULES「世界地圖 cut-out
  **靠右**對齊，不隨寬度放大」與 ASSETS「worldmap…multiply 90%，**靠右**」；
  而該檔第 47 行的 SOURCE OF TRUTH 卡自訂的優先序是
  `HomeScreen.dc.html`（1）→ `ImportScreen.dc.html`（2）→ `CLAUDE.md`（3）→ `_ds`（4）→
  `MvpMockups.dc.html`（5）。**按這個優先序，「靠右」才是勝出方**，`_ds` bundle 的 `left:6`
  只有第 4 順位。因此本項的真實性質是：**以實測論證推翻了較高順位的來源**，
  不是「較低順位的轉述被較高順位推翻」。
  **結論維持靠左不變**——那是使用者裁定，且有 §10.6 三個寬度的實測支撐（108／108／108，
  移除左內距後變成 90／108／90）；更正的只是本段記錄的依據與優先序。
  剩餘 108 vs 104 的 4px 不再追：104 出自 `hint-size`（`screens.md` 自述不具權威），
  且卡片高度明訂 never fixed。
- **430 卡片高度 183 vs 實測 218：維持不動（使用者同意）。**
  360 完全吻合（183）證明盒模型正確；218 在算術上做不出來——加寬只會讓文字變矮，
  要 218 需文字欄達 196，比 390 的 174 還高。「long content 可到 225」，
  該筆實測應為別張示範卡。實測值依 `SKILL.md` 不是規格，「修」它等於自行發明高度。
  **來源歸屬更正（2026-09-03，Reviewer Non-blocking 2）**：218 **不是只出現在 `screens.md`**，
  它出自 `HomeScreen.dc.html` 的 RESPONSIVE RULES 與 LAYOUT／SPACING 兩處
  （「自適應（實測 360:183 · 390:196 · 430:218）」）。所以這是**最高順位來源自身的實測記錄**
  與我們實測結果不符，不是低順位摘要失準。結論（維持 183、不寫死高度）不變。
- **表格未列：卡片按下效果改為只作用於自身可點區。**
  原本 `active:scale-97` 寫在 `<article>` 上，而 CSS `:active` 會沿祖先傳遞，
  按 `•••` 時整張卡也跟著縮放。改用 `has-[a:active]:`——只有標題連結
  （其 `::after` 覆蓋整張卡）被按下才觸發；`•••` 是 button 且疊在覆蓋層之上，不會誤觸。
  **註**：合成事件無法驅動 CSS `:active`，腳本只驗證了「按 `•••` 不縮放」，
  「按卡片會縮放」需目視確認。

- **表格未列：`•••` 觸發鍵補 `font-ui`。** DS 的觸發鍵**沒有設 `fontFamily`**，在 export 裡繼承
  frame 的 `font-family:Quicksand`；我們的 body 是 `--font-tc`（Noto Sans TC），該字體的
  `•`（U+2022）字身寬得多，三顆並排就明顯過開。補 `font-ui` 後實測 glyph **21.2 × 18**，
  對上 ACCESSIBILITY 卡記的 22 × 18。
- **表格未列：`•••`、選單兩列、sheet 兩顆按鈕、Error 重試鍵補 `cursor-pointer`。**
  DS `Button` 與 TripCard 觸發鍵都明寫 `cursor: 'pointer'`，export 的選單列 markup 也有；
  而 **Tailwind v4 的 preflight 把 `button` 的游標改成 `default`**（v3 是 pointer），
  所以不會自動帶上。連結（Start New Trip）不受影響。

**第 4 段（實作前先提出、2026-09-03 確認後才改計畫）**

1. **`我的旅行收藏` 維持 `h1`，不改成 #16 寫的 `h2`。** 照 #16 字面改，這頁會沒有 `h1`；
   而第 2 段已確認卡片標題維持 `h2`，兩者是綁在一起的。回查 export：整份檔案只有 1 個 `<h1>`，
   內容是「Home / Trip Collections」——那是**設計畫布的頁面標題，不是產品 UI**。
   artboard 內從 `h2` 起跳是因為 artboard 不是文件，不是設計要求沒有 h1。
   結論：整體階層比 export 高一級但內部一致；#16 只套字體、字重與 26px 間距。
2. **tagline 與便條改 `alt=""` + `aria-hidden`，不採用 export markup 裡的英文 alt。**
   export 自己打架：markup 給了 `alt="Pin your best trips…"`／`alt="Collect moments…"`，
   但 ACCESSIBILITY 卡把「便條、tagline」列在一律 `aria-hidden` 的裝飾清單裡。
   依該卡自述是契約，取 `aria-hidden`。**wordmark 不在那份裝飾清單裡**，保留 `alt="PinTrip"`。
   （第 1 段報告曾說「tagline 的 alt 要對齊 export」，那是只看 markup 沒看 a11y 卡的誤判，此處更正。）
3. **Start New Trip 維持 `<Link>`，不改成 ACCESSIBILITY 卡字面的 `button`。**
   該句的重點是「不要 div + onClick」；export 的畫布沒有 router 所以只能寫 button。
   它實際做的是導航，用 `<a>` 才對——改 button 會失去中鍵開新分頁且必須靠 JS。
   既有測試也斷言 `getByRole('link')`。補 `aria-label="建立旅行收藏"`，地圖與膠帶 `aria-hidden`。

實作過程中另外三項（事後記錄，非事前確認）：

4. **worldmap 一度改判靠右並移除 `paddingLeft: 120`；此判定已於同日被 §10.6 實測推翻，改回靠左。**
   保留原始理由供追溯：
   那個左內距存在的唯一理由是空出左側給地圖。**純鏡像做不到「靠右」**——原版是
   「地圖最左、箭頭最右」，真正的鏡像會把箭頭移到最左，而 `→` 放在左邊顯然不是設計意圖。
   因此採用：文字靠左、箭頭維持最右、地圖成為右側的淡背景（multiply .9），
   padding 回到對稱的 20/15。**若 §10.6 目視後覺得不對，改回靠左只是一行。**
5. **DS `StartTripCard` 的標題用 `<span>` 不是 `h3`（我們階層下會是 `h2`）。**
   整張卡是單一 link 且帶 `aria-label`，heading 包在 link 裡是反模式，也會在標題大綱
   多出一個與收藏並列的假節點。可見文字樣式完全照 DS。
6. **Error 卡的虛線色用 `#E3D9C6`，不是 `dash-frame`（blue-200）。**
   看起來與 Start New Trip 不一致，但有依據：Error 卡是 export 的**頁面層 markup**，
   明寫 `1.5px dashed #E3D9C6`；`dash-frame` 對應的是 DS `--border-dash`，
   用在 DS 元件（Start New Trip）上。兩者本來就是不同語彙。

**第 3b 段**

- **#40 的做法改了。** 計畫寫「`align="end"` + **自算** `alignOffset`／`side`／`sideOffset`、
  `avoidCollisions={false}`」。實際只自算 `side` 與 `sideOffset`（垂直錨定與翻轉門檻），
  **水平夾制改用 Radix 內建的 shift**：`collisionBoundary`＝捲動層、`collisionPadding={8}`，
  `avoidCollisions` 維持預設。理由有二：floating-ui 的 `alignmentAxis` 在 `end` 對齊下方向
  容易寫反，而 `collisionBoundary` + `collisionPadding` 正好就是規範說的「夾制對 frame、
  左緣不越過內緣 8px」；又因為我選 side 的門檻（+132）比 Radix 判斷「放不下」更早，
  Radix 的 flip 不會再翻一次。**行為與規範一致，手段不同。**
- **表格未列：`AppShell` 捲動層加上 `data-scroll-container` 標記。** 選單需要它來取得
  夾制邊界，以及「捲動層下緣＝nav 上緣」這個翻轉門檻的基準。
- **表格未列：`_effects.css` 新增動畫定義** —— `menu-motion`／`sheet-motion`／`dim-motion`
  三個 `@utility`、六組 keyframes，以及 `--dur-menu: 140ms`／`--dur-sheet: 320ms` 兩個 token。
  #50／#64 只寫要有動畫、沒寫怎麼做。依 `ARCHITECTURE.md` §2.1 的判斷順序，時長本可用
  Tailwind 內建的 `duration-*` 表達，**但這兩個值用在 `@utility` 的 CSS 內部，該處無法寫 class**，
  因此定義為 token。`prefers-reduced-motion` 下三者一律 `animation: none`。
  > **⚠️ 此決定已於第 7 段被推翻（2026-09-03，Reviewer 原文 Non-blocking 4）**：`--dur-*` 不在
  > Tailwind 的 namespace 內，放進 `@theme` 不會產生任何 utility；兩個 token 已刪除，
  > `@utility` 內改寫 `140ms`／`320ms` 字面值。三個 `@utility` 與 keyframes 的部分維持有效。
  > 本段保留原始紀錄供追溯，**不得據此實作**。
- **選單只有進場動畫，沒有離場。** CARD MENU §Motion 只規定「140ms 淡入 + 2px 位移」，
  未定義關閉動畫；sheet 的「close 同長反向」則已實作（Radix Presence 會等 CSS 動畫跑完才卸載）。
- **表格未列：sheet 加 `max-w-[430px] mx-auto`。** export 的 sheet 在 390 frame 內是滿寬；
  本專案 App Shell 在桌面瀏覽器上限 430，sheet 若不跟著收會超出外框。屬**實作決定**。

---

## Planned Changes

每一列標明性質：**來源明載**（可指到 export 的行或 DS 屬性）／**依規範推導**（由來源值換算）／
**實作決定**（規範只給契約，手段由實作選）。

### 先修正兩項先前的誤判

重讀 `HomeScreen.dc.html` 的 `<style>` 與 ACCESSIBILITY／ASSETS 卡後，前一輪的兩個結論要推翻：

| 項目 | 前一輪結論 | 更正 |
| --- | --- | --- |
| 照片 `alt` | 依 DS `alt: title` 用 `alt={trip.name}` | **維持 `alt=""`**。ACCESSIBILITY 卡明文「卡內照片、膠帶、貼紙、類別貼紙全部 `aria-hidden`」，且該卡自述是契約。DS 的 `alt: title` 被頁面層契約覆蓋 |
| worldmap 對齊 | 依 DS bundle `left: 6` 靠左 | **一度改判為靠右，2026-09-03 依 §10.6 實測改回靠左**——見「第 5 段」。註：靠右是 `HomeScreen.dc.html` 自身（RESPONSIVE RULES ＋ ASSETS）的敘述，依 export 的 SOURCE OF TRUTH 順位**高於** `_ds`；本項是以實測推翻較高順位來源，非摘要失準 |

`•••` 的 44×44 命中區前一輪標為「實作決定」，實際是**來源明載**：
`[data-card="trip"] article button::before{content:'';position:absolute;top:-5px;right:-7px;width:44px;height:44px}`。

### `src/components/app-shell.tsx`、`src/components/bottom-nav.tsx`

| # | 現況 | 來源值 | 性質 |
| --- | --- | --- | --- |
| 1 | 無捲動容器，整頁捲動 | 唯一捲動層 `flex:1; overflow-y:auto; overscroll-behavior:contain`（RESPONSIVE §Scroll container） | 來源明載 |
| 2 | 無 `overflow-x:clip` | 內容區 `overflow-x:clip`；卡片 `overflow:hidden`；文字欄 `min-width:0` 三者同時成立（§Horizontal） | 來源明載 |
| 3 | 無 z-index 層級 | content 0 → 裝飾 2 → 大貼紙 3 → 選單 4 → nav 5 → dim 8 → sheet 9 | 來源明載 |
| 4 | 無 `env(safe-area-inset-top)` | 上緣 inset-top + 12px | 來源明載 |
| 5 | nav 無上圓角、無 `padding-top:12`、非 `items-start` | DS `BottomNav`：`r-xl` 上圓角、`paddingTop:12`、`align-items:flex-start` | 來源明載 |
| 6 | nav 高度未含 bottom inset | 72px + `env(safe-area-inset-bottom)` | 來源明載 |
| 7 | 圖示 24px、`saturate-[.45] opacity-70` | DS：height **26**、未選取 `grayscale(1)` + `opacity .55` | 來源明載 |
| 8 | 未選取文字 ink-300、非粗體 | DS：`--w-bold`、未選取 **ink-500**、選取 blue-600 | 來源明載 |
| 9 | 格內 `gap-1`（4px） | DS `gap: 5` | 來源明載 |
| 10 | `pathname.startsWith(cell.href)` | `/trips/new` 會一起高亮 | 實作決定：改精確比對 |

### `src/app/trips/page.tsx`、`src/components/trip-collections.tsx`（Blocking 1）

| # | 現況 | 來源值 | 性質 |
| --- | --- | --- | --- |
| 11 | 摘要行在 Server Component 以 `listTrips()` 算，與刪除無連動 | 摘要行與列表須由同一份狀態推導 | 依規範推導（STATE RULES + Reviewer Blocking 1） |
| 12 | 空狀態時摘要行仍算繪 | Empty：「品牌區保留，**摘要行換成一句說明**，只留 Start New Trip 一個出口」 | 來源明載 |
| 13 | 錯誤狀態時摘要行仍算繪 | Error frame：標題之後直接接錯誤卡，無摘要行 | 來源明載 |
| 14 | 摘要行與清單無 `aria-describedby` | ACCESSIBILITY §列表語意 | 來源明載 |
| 15 | 摘要行 `text-ui-sm`(14px)、ink-300 | **12.5px**、`line-height:1.6`、**ink-400**、`margin-top:6` | 來源明載 |
| 16 | `h1` + `mt-6`(24px)、無字體字重 | `margin:26px 0 0`、Playfair、20px、**weight 500**、ink-900、`ls -0.01em` | 來源明載。**標籤維持 `h1`**，不改成 export 的 `h2`——見第 4 段修正 1 |
| 17 | wordmark `width=58 height=20` | export `height:58px`；素材 319×104 → 寬 178 | 高度來源明載／寬度依規範推導 |
| 18 | tagline `152×24`、`alt=""` | `width:152px`（素材 261×87 → 高 51）；**`alt=""` + `aria-hidden`** | 寬高來源明載／推導；`aria-hidden` 依 ACCESSIBILITY 卡——見第 4 段修正 2 |
| 19 | avatar `alt="我的帳號"`、無陰影 | export `alt=""` + `box-shadow 0 4px 14px rgba(122,96,58,.07)` | 來源明載 |
| 20 | **無 note-paper 便條貼紙** | avatar 下方同一右側直欄，`width:100px`、`rotate(-3°)`、欄 `gap:12`、`padding-top:6`；`aria-hidden` | 來源明載 |
| 21 | Empty 缺放大的 note-paper | Start New Trip 下方 `margin-top:26`、置中、`width:132`、`rotate(-3°)` | 來源明載 |

### `src/components/trip-card.tsx`

| # | 現況 | 來源值 | 性質 |
| --- | --- | --- | --- |
| 22 | 可點區名稱只有收藏名 | `aria-label`「開啟旅行收藏：東京（28 個地點）」 | 來源明載（ACCESSIBILITY 契約） |
| 23 | 類別貼紙帶 `alt`（神社／美食／鐵道） | 類別貼紙 `aria-hidden` | 來源明載 |
| 24 | `•••` glyph 是按鈕文字 | glyph 本身 `aria-hidden`，標籤不靠 `•••` 字元傳達 | 來源明載 |
| 25 | `•••` 是 44×44 實體按鈕，glyph 置中 | glyph 維持 22×18，命中區以 `::before`（`top:-5; right:-7; 44×44`）擴大，不放大 glyph、不偷標題寬度、無 layout shift | 來源明載 |
| 26 | 無 focus-visible 樣式 | `outline:2px solid var(--blue-400); outline-offset:2px`，圓角跟隨元件；卡片的 outline 不得被 `overflow:hidden` 裁掉 | 來源明載 |
| 27 | 標題 `text-display-lg`(30px)、無字體字重行高 | `h3`、`--font-display`、**28px**、weight **500**、ink-900、`lh 1.05`、`ls -0.01em` | 來源明載。**標籤實作為 `h2` 不是 `h3`**——見「偏離與計畫外的修改」 |
| 28 | 文字欄以 `pr-3`(12px) 與照片分隔 | article 層 `gap: 8` | 來源明載 |
| 29 | 目的地文字 `text-action`(coral-500) | `LocationLine` 文字固定 **ink-500**、`--font-kr`、14px、`lh 1.4`；`tone` 只作用在無 `iconSrc` 時的替代圓點 | 來源明載 |
| 30 | pin 圖示 12×12、`gap-1` | icon `height = size + 3` = **17**、寬度 auto、`gap: 5` | 來源明載 |
| 31 | 目的地列無 ellipsis 保護 | `white-space:nowrap; overflow:hidden; text-overflow:ellipsis`，且 div 與 span 兩層都要 | 來源明載 |
| 32 | 說明文字 `text-copy`(ink-500) | DS note：**ink-400**、`--font-kr`、13px、`lh 1.6` | 來源明載 |
| 33 | footer 用 `mt-auto` | DS spacer `flex:1; min-height:8` | 來源明載 |
| 34 | footer 列無 `flex-wrap` | `flex-wrap:wrap; row-gap:6px`（export `<style>` 明列） | 來源明載 |
| 35 | 地點數缺 `--font-ui`、數字與「個地點」間無空格 | `font-ui` 12.5px ink-500；`{count}` + 空格 + `countLabel` | 來源明載 |
| 36 | 照片 `min-h` 隨斷點 148／172／196 | DS img `minHeight: **161**`（固定）；161 + 上下 padding 22 = 183 = 360 的實測值 | 來源明載 |
| 37 | 照片 `rounded-[13px]` | DS img `borderRadius: var(--r-md)` = **14px** | 來源明載。**13px 不是「`screens.md` 摘要失準」**——`HomeScreen.dc.html`（第 1 順位）的 LAYOUT／SPACING 卡也明列「照片圓角 **13px**」，與它自己算繪用的 DS 元件（`--r-md` = 14px）互相矛盾。屬**最高順位來源自身的內部衝突**；結論仍取 14px |
| 38 | 照片欄寬 `w390`／`w430` 變體 | `[data-w="360"] width:148px` / 預設 172 / `[data-w="430"] width:196px` | 來源明載，現況已正確 |

### `src/components/trip-card-menu.tsx`（Blocking 2、3）

| # | 現況 | 來源值 | 性質 |
| --- | --- | --- | --- |
| 39 | 未設 `align`／`side`／`collisionPadding` | 右緣對齊 `•••` 右緣（**偏好值**）；左緣夾在 frame 內緣 8px，**夾制對 frame 不對卡片**；垂直 = `max(觸發鍵下緣, 標題文字下緣) + 8`；`觸發鍵下緣 + 132 > nav 上緣` 時改向上、距觸發鍵上緣 8px | 來源明載 |
| 40 | —— | 換算成 Radix：`align="end"` + 自算 `alignOffset`／`side`／`sideOffset`、`avoidCollisions={false}`；在 `onOpenChange(true)` 當下量測 | **實作決定** |
| 41 | 寬 172、r14、padding 6 | 相同 | 現況已正確 |
| 42 | 高度未處理 | 只固定寬度；`172 × 109` 的 109 標為**實測**，`SKILL.md` 禁止把實測值寫死成高度。109 僅作為翻轉門檻常數 | 來源明載 + 依規範推導 |
| 43 | 無 hairline | `1px solid #E3D9C6` | 來源明載 |
| 44 | `shadow-raised` | 雙層 `0 14px 32px rgba(60,45,25,.24)` / `0 2px 6px rgba(60,45,25,.10)` | 來源明載 |
| 45 | 兩列間無分隔線 | `height:0; border-top:1px **solid** #F2EADC; margin:3px 8px`（`design-system.md` 明列這是唯一不用 dashed 的分隔線） | 來源明載 |
| 46 | 列 `px-3`、14px、`text-heading` | `min-height:44`、`padding:0 10px`、`border-radius:11px`、Quicksand **15px/700**、`#3B3B3D`、`nowrap` | 來源明載 |
| 47 | 無 focus ring | 兩列與 `•••` 同用 `2px var(--blue-400)` + 2px offset | 來源明載 |
| 48 | **捲動不關閉**（Blocking 3） | 關閉條件五項：同鍵切換／點外部／ESC／**列表捲動**／選了任一列 | 來源明載 |
| 49 | —— | 實作：`open` 期間掛 capture 階段 `scroll` listener，關閉時歸還焦點 | **實作決定**（export 自身用 `document.addEventListener('scroll', h, true)`） |
| 50 | 無動畫 | 140ms `cubic-bezier(.32,.72,.28,1)` 淡入 + 2px 位移（向上開啟反向）；`prefers-reduced-motion` 即時顯示 | 來源明載 |
| 51 | 無 z-index | z4 | 來源明載 |

### `src/components/delete-trip-dialog.tsx`

| # | 現況 | 來源值 | 性質 |
| --- | --- | --- | --- |
| 52 | 「{n} 個地點會一起刪除」 | 「這個旅行收藏裡的 **28 個地點**會一起刪除。」數字 700 ink-700；13px／`lh 1.7`／ink-400；`margin:9px 0 0` | 來源明載 |
| 53 | 分隔線 `border-t border-dash` = 1px **實線** blue-200 | `1px dashed #EDE4D2` | 來源明載 |
| 54 | 「一併移除」12px、`.08em` | Quicksand **11px**/700、`ls .1em`、ink-300 | 來源明載 |
| 55 | 三列 12px、ink-500 | **12.5px**、`lh 1.75`、`#5A5A5C` | 來源明載 |
| 56 | 保留說明 12px、ink-500 | **12.5px**、`lh 1.7`、ink-400 | 來源明載 |
| 57 | 不可復原句 coral-500 | **`#C77A62`**、12.5px/700、`lh 1.7` | 來源明載 |
| 58 | `mt-4 pt-4`、按鈕列 `mt-6` | `margin-top:14 / padding-top:13`、第二段 `13/13`、按鈕列 `margin-top:18` | 來源明載 |
| 59 | 取消 blue-500、16px、無邊框陰影 | DS `Button solid md`：blue-**600**、**15px**、`1.5px solid blue-600`、`0 2px 6px rgba(60,95,160,.16)`、h48、r14、px20 | 來源明載 |
| 60 | 刪除收藏 1px cream 邊框、`text-heading` | DS `Button outline md`：底 `--paper`、字 **blue-600**、`1.5px solid blue-400`、無陰影 | 來源明載 |
| 61 | 無向上陰影 | `0 -8px 28px rgba(60,45,25,.20)` | 來源明載 |
| 62 | 底部 padding 未含 safe area | `padding: 24 20 30` + inset | 來源明載 |
| 63 | dim 與 sheet 無 z-index | dim 8 / sheet 9，皆在 nav 5 之上；nav 不隱藏但被擋住 | 來源明載 |
| 64 | 無動畫 | 320ms `cubic-bezier(.32,.72,.28,1)` 上滑 + dim 同步淡入；`prefers-reduced-motion` 即時 | 來源明載 |
| 65 | 背後列表仍可捲動 | 背後保持捲動位置且不可捲動；取消後完全還原 | 來源明載 |

### `start-new-trip-card.tsx`、`trip-list.tsx`、`trip-list-error.tsx`

| # | 現況 | 來源值 | 性質 |
| --- | --- | --- | --- |
| 66 | `dash-frame` + `p-card`，底色透明 | DS `StartTripCard`：底 **`--surface-panel`**(blue-050)、`padding:20px 15px`、`padding-left:120`、`gap:10`、`items-center`、r20、按下 `scale(0.99)` | 來源明載 |
| 67 | **無 worldmap 底圖** | `worldmap.png`、`width:126`、`opacity .9`、`multiply`、**靠左（`left:6`）＋ `paddingLeft:120`**、`aria-hidden` | 來源明載（DS `StartTripCard`，SOURCE OF TRUTH 第 4 順位）。**`HomeScreen.dc.html`（第 1 順位）的 RESPONSIVE RULES 與 ASSETS 兩處寫「靠右」**，本項是使用者依 §10.6 實測裁定採用較低順位的 `_ds`；見「第 5 段」 |
| 68 | **無 → 圓鈕** | `42×42` pill、blue-500、白色 `→` 18px、`0 4px 10px rgba(60,95,160,.26)` | 來源明載 |
| 69 | 標題 22px、ink-900 | `--font-display`、**20px**、**700**、**blue-700**、`lh 1.15` | 來源明載 |
| 70 | 說明 13px、ink-500 | `--font-ui`、**12.5px**、weight **500**、ink-500、`lh 1.45`、`margin-top:7` | 來源明載 |
| 71 | **無固定的奶油色膠帶** | 置中奶油膠帶是固定品牌元素，在 preset 池外：`top:-9`、`left:50%`、`margin-left:-31`、`62×18`、`#F3E3B8`、`.92`、r2、`rotate(-2°)`、z2 | 來源明載 |
| 72 | `h-26`（寫死 104px） | DS 元件不設高度。104 是**說明文字在中文下折兩行時的自然高度**（20×1.15 + 7 + 12.5×1.45×2 + 40 padding ≈ 104），不是設定值 | 依規範推導：移除固定高 |
| 73 | 是 `<Link>` 無 `aria-label` | 整張卡一個可點區、`aria-label`「建立旅行收藏」；地圖與膠帶 `aria-hidden` | 來源明載。**維持 `<Link>` 不改 `button`**——見第 4 段修正 3 |
| 74 | Error 卡 `dash-frame`(blue-200) + `p-card` | 底 `#FFFDFA`、`1.5px dashed #E3D9C6`、r20、`padding:20px 18px` | 來源明載 |
| 75 | Error **缺第二句文案** | 「網路連線好像不太穩定，稍後再試一次就好。」12.5px／`lh 1.65`／ink-400；標題「暫時載入不到收藏」Quicksand 16px/700 ink-700 | 來源明載 |
| 76 | Error 缺膠帶 | `top:-8`、`left:24`、`52×16`、`#F7D9CE`、`.92`、r2、`rotate(-10°)` | 來源明載 |
| 77 | 重試鍵自刻 1px cream 邊框 | DS `Button outline **md**`（export 標的 40px 是過期註記） | 來源明載 |
| 78 | 標題與說明的 `line-clamp: 2` | export `<style>` 對 `article h3` 與 `article p` 明列 | 來源明載，現況已正確 |

### 三個 stub

`/trips/new`、`/trips/[tripId]`、`/imports` 目前是裸 `<p>`，沒有 `AppShell`，進去沒有 nav 可回頭。
三者一律包 `AppShell`，文案不變。

### 新增設計值的處理

`#EDE4D2`、`#5A5A5C`、`#C77A62`、`#F2EADC`、`#E3D9C6` 與兩層選單陰影都**不在 DS 色票／token 內**，
是 export 的頁面層字面值。依 `ARCHITECTURE.md` §2.1 的判斷順序，它們不會重複使用，
**以 Tailwind arbitrary value 寫入並註明來源**，不新增看起來像 DS 名稱的 token。

`12.5px`／`11px`／`28px` 同理：`design-system.md` 明文說這些密集列的字級由畫面檔取值，
不要四捨五入到最近的 token。

---

## Validation Plan

依 `DEVELOPMENT_GUIDE.md` §10.3 的順序執行，狀態用 §10.4 的四種。

| 步驟 | 指令／動作 | 狀態 |
| --- | --- | --- |
| 1 | `npm run lint` | **PASS** |
| 2 | targeted tests：`trip-collections`、`trip-card-menu`、`trip-card` | **PASS** |
| 3 | 完整 test script：`npm test` | **PASS**（24／24） |
| 4 | `npm run build` | **PASS** |
| 5 | `git diff --check` | **PASS** |
| 6 | §10.6 實際頁面與狀態檢查 | **PASS，含 2 項已裁定差異**（見下） |
| 另 | `npm run test:e2e` | **PASS**（4／4） |

### §10.5 驗證範圍

| 情境 | 適用 | 結果 |
| --- | --- | --- |
| 正常流程 | 是 | PASS（測試 + E2E + 實機） |
| 空資料 | 是 | PASS（實機刪光兩張後確認） |
| 必填資料缺失／錯誤輸入 | 否 | 本批無表單輸入 |
| 權限不足 | 否 | Auth 未實作 |
| 外部服務失敗 | 否 | 資料為 mock |
| 重新嘗試 | 部分 | Error 態為隔離元件測試；**`NOT AVAILABLE`**——mock 不會失敗，實機無觸發來源 |
| 重複操作 | 是 | PASS（連開同一顆 `•••`、A→B 切換、連續刪除兩張） |
| 既有功能是否受影響 | 是 | PASS（既有 15 條全綠、`/` 轉址 smoke 通過） |

### §10.6 UI 檢查結果（dev server 實機量測，2026-09-03）

| 項目 | 來源值 | 360 | 390 | 430 |
| --- | --- | --- | --- | --- |
| gutter | 16／20／24 | 16 ✓ | 20 ✓ | 24 ✓ |
| photo column | 148／172／196 | 148×161 ✓ | 172×173 ✓ | 196×161 ✓ |
| 卡片間距 | 16 | — | 16 ✓ | — |
| 內容底部留白 | 72 | — | 72 ✓ | — |
| 上緣 inset | inset-top + 12 | — | 12 ✓ | — |
| 水平捲動 | 0 | 0 ✓ | 0 ✓ | 0 ✓ |
| 卡片高度（實測，非規格） | 183／196／218 | **183 ✓** | 195（−1） | **183（−35，見下）** |

選單（390 量測）：

| 項目 | 來源值 | 實測 |
| --- | --- | --- |
| 尺寸 | 172 × 109 | **172 × 109 ✓**（高度自然撐出，未寫死——驗證了決定 11） |
| 右緣對齊 `•••` | 差 0 | **0 ✓** |
| 左緣距 frame 內緣 | 不得 < 8 | 11 ✓（偏好值未越界，夾制未觸發） |
| 左緣相對卡片 | 略微超出 | −9 ✓ |
| 上緣距標題下緣 | 8 | 7（−1，rounding） |
| hairline | 1px `#E3D9C6` | ✓ |
| 雙層陰影 | `.24` / `.10` | ✓ |
| z-index | 4 | ✓ |
| 捲動關閉 + 焦點歸還 | 要 | **✓ 兩者都成立** |
| 貼近 nav 向上翻轉 | 門檻 +132 | **✓ `data-side="top"`**，選單下緣在 nav 上方 51px；距觸發鍵上緣 6（規範 8，−2） |

Focus ring（A9，2026-09-03 第 7 段補測；390 frame，鍵盤 Tab 驅動，確認 `:focus-visible` 成立）：

| 元件 | 來源值 | 實測 |
| --- | --- | --- |
| 卡片可點區 | 2px `--blue-400` + offset 2 | outline `rgb(123,158,220) solid 2px`、offset `2px`、radius 20（跟隨元件）✓ |
| `•••` 觸發鍵 | 同上 | 同上，radius 0（元件本身無圓角）；glyph 21.2×18、命中區 `::before` 44×44 ✓ |
| 選單第一列 | 同上 | 同上，radius 11、列高 44 ✓ |
| 選單第二列 | 同上 | 同上，radius 11、列高 44 ✓ |
| `--blue-400` 對值 | DS `tokens/colors.css` `#7B9EDC` | 專案 `_colors.css` `--color-blue-400: #7b9edc` → 算繪 `rgb(123,158,220)` ✓ 同值 |
| 卡片 outline 不被裁切 | ACCESSIBILITY §Focus-visible | ✓ outline 掛在 `article` 自身（其 `overflow:hidden` 不裁自己的 outline），外層 `li` 為 `overflow:visible`；螢幕截圖四邊完整 |
| 連結自身 | —— | `outline-style: none`（`focus-visible:outline-none`），確認環由 `article` 提供、不重疊 ✓ |

選單左緣夾制路徑（#39，第 7 段補測——Reviewer 指出原本的「11 ✓（夾制未觸發）」代表夾制從未被驗證）：

| 寬度 | 選單左緣距 frame 內緣 | 右緣對齊 `•••` | 判讀 |
| --- | --- | --- | --- |
| 430 | 11 | 差 0 | 偏好值成立，夾制未觸發 |
| 390 | 11 | 差 0 | 同上 |
| **360**（規範最窄） | **9** | 差 0 | **仍未觸發**，距 8px 門檻只差 1px |
| 320（**超出規範支援範圍**，僅為驗證機制） | **8（夾住）** | 差 39（偏好值讓位） | **夾制路徑成立**：左緣被釘在 frame 內緣 8px，右緣對齊自動讓位 |

結論：夾制**在 360／390／430 都不會觸發**（360 差 1px），機制本身正確。
320 那列只用來驗證程式路徑，不是支援寬度，也不作為規格。

刪除 sheet 開啟時背後不可捲動（#65，第 7 段補測；390）：

| 項目 | 來源值 | 實測 |
| --- | --- | --- |
| 背後保持捲動位置 | 要 | 開啟前 105 → 開啟中 105 ✓ |
| 背後不可捲動 | 要 | 於背後列表區實際滾動滾輪 5 格後仍為 105 ✓（`body` `overflow:hidden`） |
| 取消後完全還原 | 要 | 關閉後 105、兩張卡片都在、`body` `overflow` 回到 `visible` ✓ |
| sheet 語意 | `role="dialog"` + `aria-modal` | ✓ |

裝飾與貼紙（第 7 段補測）：

| 項目 | 來源值 | 實測 |
| --- | --- | --- |
| 裝飾 `pointer-events` | ACCESSIBILITY §裝飾 | 6 張裝飾圖全為 `none` + `aria-hidden` ✓；類別貼紙同樣補上 ✓ |
| 類別貼紙 `object-fit` | DS `CategoryIcon` | `contain` ✓（原生尺寸 32×29／26／39／37／25／32，全非正方） |
| Preset B 膠帶 | export line 87 | `radial-gradient(circle,…)`、`8px 8px`、radius 2、50×16 ✓ |

狀態切換：

| 項目 | 結果 |
| --- | --- |
| 摘要行隨刪除更新 | 2 個／64 → 1 個／36 → 說明句 ✓（Blocking 1 實機確認） |
| Empty 時摘要行**被取代** | ✓（不是摘要行 ＋ 額外一句） |
| Empty 的放大便條 | 132×136 ✓ |
| normal／empty 下 nav 位置 | 完全相同 ✓ |
| Error 態實機檢查 | **NOT AVAILABLE**——mock 不會失敗，無觸發來源；由隔離元件測試涵蓋 |
| 尚未驗證 | Firefox／WebKit／實機觸控／`prefers-reduced-motion`（Playwright 僅 Pixel 7 + Chromium） |
| console | `next/image` 尺寸警告已全數清除（0） |

### 兩項已裁定差異

> **標題與計數已於 2026-09-04 更正**（Reviewer 第 3 次複審 Non-blocking 1）。原本是「兩項**待**裁定」，
> 但兩項其實都已裁定：第 1 項使用者裁定維持不動（見 `report.md` Known Limitations 1），
> 第 2 項已於同日結案（worldmap 改回靠左，三寬度皆 108）。**待裁定數為 0**，
> 與 `report.md` 的「2 項已裁定差異」一致。這兩處標籤沒跟著內文更新，
> 正是同一個「標頭未隨內文更新」的模式殘留在修正它的那一次修正裡。

1. **430 的卡片高度是 183，`screens.md` 記的實測是 218。** 360 完全吻合（183）、390 差 1。
   430 這一格差 35：我們的文字欄內容在 430 只有約 149，低於照片的 `min-height: 161`，
   所以由照片決定高度。export 若為 218，其文字欄需達 196——比 390 的還高，而加寬不會讓文字變高，
   因此該筆實測很可能量的是別張示範卡（`screens.md` 自己也寫「up to 225px with long content」）。
   實測值依 `SKILL.md` **不是規格**，且卡片高度明訂「never fixed」，所以我判定不是缺陷；但差距夠大，提出給使用者裁定。
   **裁定結果：維持不動**（見 `report.md` Known Limitations 1）。
2. **Start New Trip 高度。** ~~90／108／90，差異來自靠右決定連帶移除 `paddingLeft: 120`。~~
   **此項已於同日結案，內容已過期（2026-09-04 依 Reviewer 第 2 次複審 Non-blocking 1 更正）**：
   worldmap 已於第 5 段改回靠左並還原 `paddingLeft: 120`，**三個寬度實測皆為 108**，
   文件記的 104 出自不具權威的 `hint-size`，4px 差不再追。以第 5 段與報告的 Known Limitations 2 為準。

---

## Review Plan

- 狀態為 `READY FOR REVIEW` 的 Developer Report
- 限定範圍的 `git status --short` 與 diff
- 新增的 9 條測試各自的 Red → Green 證據（`CODE_REVIEW.md` §9.1）
- 五項驗證的實際輸出與 §10.4 狀態
- Planned Changes 78 列逐項標示：已改／已確認吻合／未改與理由
- §10.6 的量測結果（三個寬度、三種狀態）

---

## Open Questions

None。三個 Seam 與九條測試案例已於 2026-09-03 經使用者確認：

- **Seam A**（摘要行與列表的狀態一致性，公開介面由 `TripList` 上移到 `TripCollections`）—— 新 seam，已確認。
- **Seam B**（捲動關閉選單）—— 認定為既有 Seam 1 的邊界案例，不視為新 seam，已確認。
- **Seam C**（TripCard 的無障礙契約）—— 新 seam，已確認。
- 九條測試案例與各自的 Red／Green 通過標準照表執行。

---

## 實作時的流程要求（使用者指示，2026-09-03）

- **列計畫時與執行計畫時都要用 `Skill(pintrip-design)` 與 `claude-design-export`**。
  不是只有寫計畫那一次——每一段實作開始前都要重新以 Skill 為入口、依其 precedence 表
  回查 `HomeScreen.dc.html` 與 `_ds_bundle.js`。不得用 `cat`／`grep` 直接讀 skill 檔案頂替。
- **開始動工前必須先告知使用者**，取得同意後才進行。
- **執行到一半發現計畫有問題時的順序（2026-09-03 確認）**：

  1. 停下來，**先說明差異**：計畫怎麼寫、我想改成什麼。
  2. **說明理由**。
  3. 等使用者確認。
  4. 確認後**才修改計畫**。
  5. 再依修改後的計畫繼續實作。

  **不得**先自行實作、事後才補寫計畫與告知——那會讓使用者只能追認，也讓計畫失去約束力。
