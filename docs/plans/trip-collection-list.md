# Implementation Plan：旅行收藏列表（Home 第一階段）

- 分支：`feature/trip-collection-list`
- 基底：`612dffa`（＝ `origin/dev`）
- 建立：2026-09-02
- 狀態：**已結案**——本檔記錄的 3 項 Blocking 已於 `trip-collection-list-visual.md` 第 1～3b 段修畢，
  並經 Reviewer 第 1 次複審（2026-09-03）與第 2 次複審（2026-09-04，`APPROVED`）逐項覆核確認。
  後續進度以 [`trip-collection-list-visual.md`](trip-collection-list-visual.md) 與
  [`trip-collection-list-report.md`](trip-collection-list-report.md) 為準。

> **這是專案第一個 TDD 適用的任務。** 前三批（測試工具鏈、UI 元件庫、DS token）都依
> `DEVELOPMENT_GUIDE.md` §10.1 聲明例外，本批有真正的產品行為，**不得聲明例外**。
> 依 §3，使用者確認 Test Seams、測試案例與通過標準之前，不得撰寫測試或開始實作。

---

## Goal

實作旅行收藏列表畫面與 App Shell，讓使用者能看見自己的旅行收藏、開啟卡片選單、並在確認影響範圍後刪除收藏。資料使用 mock，不預先決定資料庫與 Auth。

---

## Expected Behavior

- `/trips` 顯示品牌區塊、收藏數量摘要與旅行收藏卡片，最後一張永遠是 Start New Trip 卡。
- `/` 轉址至 `/trips`。
- 列表依建立時間新到舊排列。
- 點卡片的 `•••` 開啟錨定下拉，內含「重新命名」與「刪除旅行收藏」兩列。
- 同時只有一個選單開啟；點另一張卡的 `•••` 會關掉前一個並開啟新的，一次互動完成。
- 選擇「刪除旅行收藏」開啟畫面層級確認 sheet，列出影響範圍、共享地點不受影響、以及不可復原。
- 在 sheet 按「取消」畫面完全回到原狀；按「刪除收藏」該收藏從列表消失。
- 沒有收藏時顯示空狀態，唯一出口是 Start New Trip。
- 讀取失敗時顯示錯誤狀態與重試按鈕。
- BottomNav 在所有狀態維持相同位置。

---

## 已確認的三項決定（2026-09-02）

1. **路由為 `/trips`**，`/` 以 `redirect()` 轉址。BottomNav 兩格連向 `/trips` 與 `/imports`，因此 `/imports` 一併加最小 stub，避免點擊 404。
2. **本批做 normal／empty／error 三狀態，Loading 延後。** 理由見 Known Limitations。
3. **資料夾結構**如 Planned Changes 所列，並一併寫入 `docs/ARCHITECTURE.md`。

---

## Test Seams（需要你逐項確認）

依 `.agents/skills/tdd/SKILL.md`：seam 是可從外部觀察行為的公開邊界，測試只寫在事先確認的 seam 上。

### Seam 1：TripCard 的 `•••` 選單（Vitest + RTL）

**公開介面**：算繪一張或多張 TripCard 後的使用者互動與無障礙屬性。

**可觀察行為**
- 觸發鍵帶 `aria-haspopup="menu"`，`aria-expanded` 隨開關切換
- 觸發鍵的 `aria-label` 含收藏名稱（繁中）
- 開啟後焦點移到第一個 `menuitem`
- `Esc` 關閉並把焦點還給觸發鍵
- 兩列 `menuitem` 的 `aria-label` 各自帶收藏名稱
- A 開啟時點 B 的 `•••`：A 關、B 開、焦點在 B 的第一列，**單次互動完成**
- 再點同一個 `•••` 會關閉

**為何是穩定邊界**：全部是 ARIA 契約與鍵盤行為，不綁定 DOM 結構、class 或內部 state。設計來源已明文規範（`accessibility.md` §Home screen — TripCard `•••` menu）。

**不涵蓋**：選單的固定 172×109、inset 量測、向上翻轉門檻。那些是版面數值，屬 §10.6 手動檢查，寫成斷言會變成抄 CSS。

### Seam 2：刪除確認 sheet（Vitest + RTL）

**公開介面**：從選單觸發到 sheet 的互動結果。

**可觀察行為**
- 「刪除旅行收藏」只開啟 sheet，**不執行刪除**
- sheet 為 `role="dialog"` + `aria-modal="true"`，`aria-labelledby` 指向標題、`aria-describedby` 指向影響說明
- 開啟後焦點進入 sheet 並被限制在內
- `Esc` 與點擊背景 dim 等同「取消」
- 取消後未觸發任何刪除回呼
- 確認後以該收藏的 id 觸發一次刪除回呼
- 內容包含地點數量、三項「一併移除」、共享地點不受影響、不可復原

**為何是穩定邊界**：對話框的 ARIA 契約與回呼邊界都是規格明訂（`MVP.md` §5.2 + `accessibility.md`），且不隨視覺調整而變。

### Seam 3：列表狀態與排序（Vitest + RTL）

**公開介面**：傳入不同資料時列表區域算繪的結果。

**可觀察行為**
- 有資料：算繪對應數量的收藏，Start New Trip 卡永遠是最後一項
- 空資料：顯示空狀態說明句，仍有 Start New Trip，且不出現任何收藏
- 錯誤：顯示錯誤說明與重試按鈕
- 排序：依建立時間新到舊
- 三種狀態下 BottomNav 都存在

**為何是穩定邊界**：這是「給定資料，畫面呈現什麼」的公開行為，直接對應 `MVP.md` §5.2「查看自己的旅行收藏列表」。

### Seam 4：完整刪除流程（Playwright E2E）

**公開介面**：`/trips` 上從 `•••` 到收藏消失的整段流程。

**可觀察行為**
- 開啟選單 → 選擇刪除 → 確認 → 該收藏不再出現在列表
- 取消則列表不變

**為何用 E2E**：跨 Server 與 Client 邊界的頁面組裝，Vitest 測不到（`next/font` 與 async Server Component 的限制記於 `docs/plans/design-system-tokens.md`）。

**只寫這一條**，不重複 Seam 1–3 已涵蓋的細節。

---

## Test Cases and Passing Criteria

以垂直切片進行，一個測試 → 一個最小實作 → 下一個。以下為預計順序，實際會依前一輪學到的調整；**新增 seam、改變公開介面或改變通過標準時會停下重新確認**。

| # | Seam | 測試檔 | 行為 | 狀態 |
| --- | --- | --- | --- | --- |
| 1 | 1 | `trip-card-menu` | `•••` 觸發鍵存在，`aria-haspopup="menu"`、`aria-expanded="false"` | ✅ Red → Green |
| 2 | 1 | `trip-card-menu` | 點擊開啟 `role="menu"`，`aria-expanded="true"`，焦點到第一列 | ✅ Red → Green |
| 3 | 1 | `trip-card-menu` | 兩列各帶「重新命名旅行收藏：X」「刪除旅行收藏：X」 | ✅ Red → Green |
| 4 | 1 | `trip-card-menu` | `Esc` 關閉並把焦點還給觸發鍵 | ✅ 契約守衛 |
| 5 | 1 | `trip-card-menu` | 再點同一個 `•••` 會關閉 | ✅ 契約守衛 |
| 6 | 1 | `trip-card-menu` | 點 B 的 `•••`：A 關、B 開、焦點在 B 第一列，單次互動 | ✅ 契約守衛 |
| 7 | 2 | `delete-trip-dialog` | `role="dialog"` + `aria-modal`，名稱含收藏名、描述含地點數，焦點進入 sheet | ✅ Red → Green |
| 8 | 2 | `delete-trip-dialog` | 取消不觸發刪除回呼 | ✅ Red → Green |
| 9 | 2 | `delete-trip-dialog` | 確認以正確 tripId 觸發一次 | ✅ Red → Green |
| 10 | 2 | `delete-trip-dialog` | 完整陳述影響範圍：三項一併移除、共享地點不受影響、不可復原 | ✅ Red → Green |
| 11 | 2 | `trip-card` | 選單的刪除項只開啟 sheet，不執行刪除 | ✅ Red → Green |
| 12 | 3 | `trip-list` | 依建立時間新到舊排列 | ✅ Red → Green |
| 13 | 3 | `trip-list` | 空資料只顯示空狀態說明與 Start New Trip | ✅ Red → Green |
| 14 | 3 | `trip-list` | 錯誤狀態顯示說明與重試按鈕 | ✅ Red → Green |
| 15 | 4 | `e2e/trip-delete` | `/trips` 完整刪除流程；取消則列表不變 | ✅ Red → Green |

> **表格與實作的落差已於 2026-09-02 校正。** 原表 12 條漏列三項：Seam 1 的 menuitem 標籤與同鍵切換、Seam 2 的影響範圍陳述。三者都在已確認的 Seam 可觀察行為清單內，依 `DEVELOPMENT_GUIDE.md` §3「可以在已確認的 Seam 內增加必要邊界案例」補入，Seam 本身與通過標準未變。

### 兩類測試，報告時分開標示

實作過程中出現一種原計畫沒預期的情況：**部分測試一寫就綠**，因為行為由 Radix 提供而非我們實作。

- **Red → Green 切片**：先看到失敗、再以最小實作轉綠，有完整證據。
- **契約守衛**：無 Red。行為由相依套件滿足，但契約本身是設計來源明訂的（`accessibility.md`），且我們的設定（如 `modal={false}`）會影響它。保留為回歸防護，並以**變異測試**證明非空測試——暫時破壞該行為，確認測試確實轉紅，再還原。

Developer Report 會依此分類，不把契約守衛充當 Red → Green 證據。

---

## Planned Changes

檔名採 kebab-case，元件名採 PascalCase，與 `src/app/layout.tsx` 的既有慣例一致。

### 路由

| 檔案 | 內容 |
| --- | --- |
| `src/app/page.tsx` | 改為 `redirect('/trips')`，移除 create-next-app 預設內容與 11 處 `dark:` class |
| `src/app/trips/page.tsx` | 列表頁，Server Component，讀 mock 並算繪品牌區塊 |
| `src/app/trips/new/page.tsx` | 最小 stub（`feature/trip-create-form` 才實作） |
| `src/app/trips/[tripId]/page.tsx` | 最小 stub |
| `src/app/imports/page.tsx` | 最小 stub（BottomNav 第二格的目的地） |

### 元件

| 檔案 | 邊界 |
| --- | --- |
| `src/components/app-shell.tsx` | Server；外框、safe area、響應式 gutter |
| `src/components/bottom-nav.tsx` | Client；兩格、目前頁高亮 |
| `src/components/trip-list.tsx` | **Client**；持有「哪個選單開著」與刪除後的樂觀更新 |
| `src/components/trip-card.tsx` | Client；卡片視覺與 `•••` 觸發鍵 |
| `src/components/trip-card-menu.tsx` | Client；Radix DropdownMenu，錨定與翻轉 |
| `src/components/delete-trip-dialog.tsx` | Client；Radix Dialog，sheet 版式 |
| `src/components/start-new-trip-card.tsx` | Server；虛線卡，導向 `/trips/new` |
| `src/components/trip-list-empty.tsx` | Server；空狀態 |
| `src/components/trip-list-error.tsx` | Client；錯誤狀態與重試 |

實作時若發現可合併，會在 Developer Report 說明；不預先拆得比需要更細。

### 資料與型別

| 檔案 | 內容 |
| --- | --- |
| `src/types/trip.ts` | `Trip` 型別。欄位依 `MVP.md` §5.2 與設計稿：id、收藏名稱、目的地名稱、選填說明、地點數、照片、建立時間、視覺樣式 preset、分類 |
| `src/lib/mock/trips.ts` | mock 資料與 `listTrips()`、`deleteTrip(id)` |

`mock` 獨立成子資料夾，接真實資料庫時整包移除，界線清楚。型別放 `src/types/` 而非 mock 內，避免元件相依假資料。

### 設定與測試

| 檔案 | 內容 |
| --- | --- |
| `vitest.setup.ts` | 補 `next/font/google` mock（程式碼見 `docs/plans/design-system-tokens.md` Known Limitations） |
| `src/components/trip-card-menu.test.tsx` | Seam 1 |
| `src/components/delete-trip-dialog.test.tsx` | Seam 2 |
| `src/components/trip-list.test.tsx` | Seam 3 |
| `e2e/trip-delete.spec.ts` | Seam 4 |

### 文件

| 檔案 | 內容 |
| --- | --- |
| `docs/ARCHITECTURE.md` | 新增資料夾結構章節。該文件目前 §0–§12 沒有這一節，結構若不寫進規範，下一批仍會重問 |

### Server 與 Client 邊界（依 `ARCHITECTURE.md` §4）

`/trips` 外層為 Server Component，負責讀 mock 與算繪品牌區塊；列表區域因需持有選單開啟狀態與刪除後的更新，為 Client Component。不因單一互動元件把整頁轉成 Client。

---

## Known Limitations

**Loading 狀態本批不做。** 兩個理由：

1. 骨架高度為 **PENDING DESIGN**（`screens.md`）：`HomeScreen.dc.html` 自身矛盾——骨架寫死 184px 並宣稱「無位移」，但同檔卡片規則寫「不設固定高」，實測 183／196／218px。Skill 明文禁止實作 184px，也禁止自行推導響應式高度。
2. **更關鍵**：mock 資料是同步的，Loading 沒有觸發時機。要讓它出現得刻意加人工延遲，那是為展示狀態而製造假行為。

等資料庫方案定案、有真正的非同步讀取時再實作；屆時骨架高度大概也已有答案。

**Error 狀態沒有真實觸發來源。** 規格完整（單張虛線卡、outline 重試鍵、語氣不責備），但 mock 不會失敗，因此以獨立元件實作並在 Seam 3 隔離測試，不接上假的失敗注入。

**刪除不會持久化。** 作用於記憶體中的 mock，重新整理即還原。符合「資料先用 mock」的既定範圍。

**「重新命名」與建立入口都是 stub。** `•••` 的重新命名、空狀態主按鈕、Start New Trip 卡都導向 `/trips/new` 的 stub，要到 `feature/trip-create-form` 才可用。

**刪除的進行中與失敗處理未定義。** `screens.md` 明載 `MVP.md` 與 `ARCHITECTURE.md` 都未定義（重試入口、部分刪除如何呈現），本批只做確認 UI 與 `onConfirmDelete(tripId)` / `onCancel` 邊界，不自行發明。

---

## Out of Scope

- 建立與編輯表單（`/trips/new` 實作）：屬 `feature/trip-create-form`
- `/trips/:tripId`、`/imports` 的完整頁面：只做最小 stub
- Loading 狀態（見 Known Limitations）
- 分類篩選、地圖、搜尋
- Auth 與登入流程；`/` 的轉址不依登入狀態判斷
- 資料庫與持久化
- 視覺樣式 preset 的抽樣邏輯（屬建立流程，mock 直接帶既有 preset）
- 升級 `next` 以處理 `npm audit` 的 5 個 high severity 漏洞
- 修改 `docs/design/` 任何檔案

---

## Files to Inspect

- `.agents/skills/pintrip-design/SKILL.md`、`references/screens.md`、`references/accessibility.md`、`references/components.md`
- `docs/design/claude-design-export/HomeScreen.dc.html`（精確數值來源）
- `docs/MVP.md` §5.2
- `docs/ARCHITECTURE.md` §2.1、§4、§5.2、§8、§10
- `src/app/layout.tsx`、`src/app/page.tsx`
- `src/styles/tokens/`（token 與 utility 名稱）

---

## Validation Plan

| 驗收條件 | 驗證方式 |
| --- | --- |
| Seam 1–3 的可觀察行為 | `npm test` |
| Seam 4 的完整流程 | `npm run test:e2e` |
| 版面數值（選單 172×109、卡片間距 16、photo column 148／172／196、底部 72px 留白） | §10.6 手動檢查，360／390／430 三個寬度 |
| 三狀態切換時 BottomNav 位置不變 | §10.6 手動檢查 |
| 無水平捲動（含長標題、長標籤、旋轉膠帶） | §10.6 手動檢查 |
| `/` 正確轉址至 `/trips` | `npm run test:e2e`（既有 smoke 仍須通過） |

另依 §10.3 執行 `npm run lint`、`npm run build`、`git diff --check`。

---

## Review Plan

- 狀態為 `READY FOR REVIEW` 的 Developer Report
- 限定範圍的 `git status --short` 與 diff
- **每個垂直切片的 Red → Green 證據**（本批 TDD 適用，這是 Reviewer 依 `CODE_REVIEW.md` §9.1 必查項目）
- 五項驗證的實際輸出
- §10.6 的 UI 檢查結果（三個寬度、三種狀態）

---

## Open Questions

None。三項已於 2026-09-02 確認，見上方「已確認的三項決定」。


---

## Reviewer 回報（2026-09-03）：REQUEST_CHANGES

TDD 證據與「契約守衛」分類**經審查認可，不需重做測試**。3 項 Blocking 全屬行為與需求缺口。

### Blocking 1 — 收藏數量摘要不隨刪除更新

`src/app/trips/page.tsx:9-10` 與 `src/components/trip-collections.tsx:17`

摘要在 Server Component 以 `listTrips()` 計算，刪除只作用於 `TripCollections` 的 state，兩者沒有連動。刪一張後仍顯示「2 個旅行收藏 · 64 個地點」；全刪後空列表上方還是同一行。

同時堵死 `screens.md` 的 Empty 規則——規範要求摘要行**被說明句取代**，目前是「錯誤的摘要行 ＋ 列表多一句說明」。

E2E 沒攔下是因為 `trip-delete.spec.ts` 只斷言卡片出現／消失，未涵蓋摘要行。

**修正方向**：摘要與列表由同一份狀態推導；空狀態時摘要行改為說明句。品牌區塊與 `AppShell` 可維持 Server。

### Blocking 2 — 選單錨定與邊界未依 export 實作

`src/components/trip-card-menu.tsx:49-52`

`DropdownMenu.Content` 未設 `align`／`alignOffset`／`side`／`collisionPadding`，走 Radix 預設 `side="bottom"` + `align="center"`。規範要求右緣對齊 `•••`、inset 開啟時量測、以 frame（非卡片）夾住左緣 8px。另缺固定高 109、缺 1px `#E3D9C6` hairline，陰影用 `shadow-raised` 取代規範的兩層陰影。

選單與卡片同為 `#FFFDFA`，規範明言邊界來自 hairline 與陰影——少了就幾乎看不出邊界。

**併同**：計畫列為 §10.6 手動項的「選單 172×109」未量測。

### Blocking 3 — 「捲動列表關閉選單」未實作

`accessibility.md` 與 `screens.md` 都明文要求。Radix 在 `modal={false}` 下不會因捲動關閉。**未實作、未測試、也未列入 Known Limitations 或 Out of Scope**——屬靜默漏掉的需求。

**範圍決定（使用者，2026-09-03）：實作它，不列為限制。**

理由不只是體驗——設計規定選單的向上翻轉方向「在開啟當下量測」，捲動後該量測即過期，選單可能翻錯邊或蓋到 BottomNav，而那是設計特別花篇幅避免的事。

目前實際行為：Radix 在 `modal={false}` 下不會因捲動關閉（`DismissableLayer` 只處理 pointerdown／focus／Escape，Popper 只做重新定位），因此選單會跟著卡片在畫面上滑動。

### Non-blocking（16 項，摘要）

`--font-tc` 註解仍寫 Korean copy／sheet 分隔線用實線非 dashed／sheet 缺上方陰影與 safe-area／分類貼紙缺 `flex-wrap`／全域無 z-index（選單應在 nav 之下，目前在其上）／`pathname.startsWith` 會誤高亮／三個 stub 未套 AppShell 成死路／`deleteTrip()` 未實作但計畫有列／空狀態文案未標來源／`rounded-[13px]` 未用 token。

### Reviewer 認可的部分

- TripCard 的 `::after` 覆蓋層做法**正確避開巢狀互動元素**
- 手動補 `aria-modal` 與 `requestAnimationFrame` focus 補位，兩處技術主張**經查證屬實**
- 版面數值不寫成斷言的切分**合理**；問題在手動驗證沒做完
- 測試無反模式、無 mock 內部協作者、預期值可追溯至規範


---

## 遵循度驗證結果（2026-09-03）

以下三項**一律標示為待確認，不假設已遵循**。原因是這三件事的證據目前只存在於實作當下的對話紀錄，**不存在於任何產出物**；程式碼註解中的來源引用（`references/accessibility.md`、`HomeScreen.dc.html` 等）是 Developer 的宣稱，不是可獨立驗證的證據。

### 1. 是否確實依照本計畫執行 — 待確認

**已知不符之處（部分由 Reviewer 獨立標出）**

| 項目 | 計畫 | 實際 |
| --- | --- | --- |
| `deleteTrip(id)` | Planned Changes 列出 | 未實作，刪除作用於元件 state |
| `trip-list-empty.tsx` | 列為獨立元件 | 併入 `trip-list.tsx` |
| `trip-card-slot.tsx`、`trip-collections.tsx` | 未列 | 實際建立 |
| `layout.tsx` 的 `metadata` | **Out of Scope** | 中途修改（有取得使用者同意，但計畫表未先更新） |

**驗證方式**：比對 Planned Changes 的檔案清單與 `git status --porcelain -uall` 的實際檔案集合，逐項確認差異是否都有記錄與依據。

### 2. 是否讀取並遵守 `pintrip-design` Skill — 待確認

Developer 是以 `grep`／`sed` 直接讀取 `.agents/skills/pintrip-design/` 底下的檔案內容，**未透過任何 Skill 載入機制**。專案規則要求「任何 PinTrip UI 工作都必須先使用 `pintrip-design` Skill」；「讀取該 Skill 的檔案內容」是否等同「使用該 Skill」，**不由 Developer 自行認定**。

實際讀過的檔案：`SKILL.md`、`references/screens.md`、`references/accessibility.md`、`references/design-system.md`（部分段落）。未讀：`references/components.md`、`references/import-lifecycle.md`。

**驗證方式**：由使用者裁定該規則的認定標準；若要求透過 Skill 機制載入，本批需重新確認遵循度。

### 3. 是否實際參考 export 設計稿 — 待確認

Developer 宣稱曾以 `grep`／Python 讀取 `docs/design/claude-design-export/HomeScreen.dc.html` 取得文案、TripCard props、DECORATION PRESETS，並讀取 `_ds/.../_ds_bundle.js` 比對 TripCard 的 footer 實作。

**但這些宣稱無法從產出物驗證。** 可驗證的替代方式是**逐項比對實作值與來源值**：

| 實作位置 | 應核對的來源 |
| --- | --- |
| 刪除 sheet 的五段文案 | `HomeScreen.dc.html` |
| 空狀態與 Start New Trip 文案 | 同上（空狀態文案為唯一未標註來源者，見 Reviewer Non-blocking 12） |
| 四組 decoration preset 的尺寸／位移／旋轉／opacity／z | `HomeScreen.dc.html` DECORATION PRESETS |
| 卡片 padding、圓角、照片欄寬、分隔線位置、地點數樣式 | `_ds_bundle.js` 的 TripCard |
| mock 的示範資料 | `HomeScreen.dc.html` 的 TripCard props |

**驗證方式**：以腳本逐項比對上述數值，產出可重跑的對照結果；不接受「程式碼註解有寫來源」作為證據。

### 恢復工作時的處理順序

1. 先完成上述三項的實際驗證，結果不論是否符合都如實記錄。
2. 再處理 Reviewer 的 3 項 Blocking。

兩者不得混為一談：遵循度是流程問題，Blocking 是實作缺口。


---

## 驗證結果與三個流程缺口（2026-09-03）

### 已驗證：數值層面完全吻合

以腳本逐項比對，**不採信程式碼註解**：

| 對照項目 | 來源 | 結果 |
| --- | --- | --- |
| 四組 decoration preset 的尺寸／位移／旋轉／opacity／圓角／z-index | `HomeScreen.dc.html` DECORATION PRESETS | **49 項全數吻合** |
| 卡片內部：標題列 gap、目的地 marginTop 與 coral tone、分隔線 margin 與 divider-dash、footer 對齊、地點數 12.5px 與 blue-600、貼紙 size 27 gap 4、照片圓角、minHeight | `_ds_bundle.js` 的 TripCard | **12 項全數吻合** |
| 使用者可見字串 | `HomeScreen.dc.html` | 多數命中，四處未命中（見下） |

### 未命中來源的四處字串

| 字串 | 位置 | 判定 |
| --- | --- | --- |
| `我的帳號` | 頭像 `alt` | **自行發明，需補來源或由使用者裁定** |
| `PinTrip｜旅遊收藏地圖` | `layout.tsx` metadata | 依 `MVP.md` §1，非設計稿，已註明 |
| `建立旅行收藏（尚未實作）`、`匯入（尚未實作）` | 兩個 stub | 設計稿無 stub 設計，屬合理範圍 |
| `日本・東京` | `trip-card.test.tsx` fixture | 改 mock 時漏改測試 fixture，應同步 |

### 兩份來源自身不一致

**照片圓角**：`screens.md` 寫 13px，`_ds_bundle.js` 用 `var(--r-md)` = **14px**。實作跟著 `screens.md` 走。這是**兩份來源本身衝突**，需使用者裁定以哪份為準（`SKILL.md` 的精度順序：需要精確值時以 export 來源為準，則應為 14px）。

---

### 流程缺口 1：計畫階段未讀完應讀的 Skill 檔案

計畫的 Files to Inspect 列出 `references/components.md`，**實際未讀**；`references/import-lifecycle.md` 亦未讀。

實際讀過：`SKILL.md`、`references/screens.md`、`references/accessibility.md`、`references/design-system.md`（部分段落）。

計畫本身確實是在讀過上述來源後才寫的——「骨架高度 PENDING DESIGN」「選單 172×109」「刪除 sheet 的四類影響範圍」等細節只可能來自那些來源——但**應讀清單沒有讀完**。

### 流程缺口 2：開發階段未重新走 Skill

使用者原本設定的流程是：

```text
design skill + export  →  產出開發 plan
                  ↓
   skill + plan  →  依序開發
```

實際執行時，**開發階段是照 plan 加上臨時 grep 設計稿**，沒有重新以 Skill 為入口系統性地查證每個元件。

**後果具體且可追溯**：卡片內部第一版依 `screens.md` 的敘述實作，之後才發現與 DS 元件有五處不同（分隔線位置、目的地色調、footer 對齊、地點數樣式、照片欄與文字欄間距）。若開發階段先走 Skill、再依其指引回查 export，這五處應在第一次就對。

Reviewer 的 Blocking 2（選單錨定、固定高、hairline、陰影未依 export 實作）與 Blocking 3（捲動關閉選單未實作）**同源於此缺口**——兩者都明載於 `screens.md` 與 `accessibility.md`，是開發時沒有系統性回查造成的遺漏。

### 流程缺口 3：修流程的那一輪，本身也沒走對流程

2026-09-03 依「以 Skill 為入口重走視覺層」重做時，**產出對照清單的當下 `pintrip-design` 仍無法載入**
——當時專案沒有 `.claude/` 目錄，Claude Code 不會從 `.agents/skills/` 載入 Skill。實際做法是以
`cat`／`grep` 直接讀 skill 檔案，**與缺口 2 被判定為錯誤的做法相同**；`Skill(pintrip-design)`
是在清單寫完之後才呼叫的，只用於驗證機制。

產出的文件因此自我矛盾：要求下一輪「第一步先叫 Skill」，但它自己不是那樣產出的。

這比缺口 1、2 更值得記錄，因為它發生在**明確知道規則、而且正在修那條規則的當下**。
成因是把「機制不可用」處理成「先用替代方法做完」，而不是「停下來，先讓機制可用」。

**處置**：`pintrip-design` 已複製一份到 `.claude/skills/pintrip-design/`（`.agents/skills/` 那份保留，
兩套工具鏈各一份，內容須逐字相同），Skill 現已可透過 `Skill` 工具載入。該輪產出的對照清單不予採用，
後續修改另立計畫，從 Skill 入口重新推導。
