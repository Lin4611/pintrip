# Implementation Plan：建立／編輯旅行收藏表單

- 分支：`feature/trip-create-form`（起點 `f10b1f6`）
- 建立：2026-09-05
- 狀態：**READY FOR REVIEW** —— 範圍、送出行為、鍵盤處理與四個 Test Seam 皆於 2026-09-05 經使用者確認；實作與驗證已備妥，等待正式 Reviewer

> **產出方式**：以 `Skill(pintrip-design)` 為入口，依其 precedence 表（Create / Edit collection form：
> `NewTripScreen.dc.html` → `HomeScreen.dc.html` → design system）分派到 `screens.md`、`components.md`、
> `accessibility.md`，再回查 `NewTripScreen.dc.html` 與 `_ds_bundle.js` 取精確值。
> 產品規則以 `MVP.md` §5.2 為準，技術邊界以 `ARCHITECTURE.md` §4／§4.1／§5.2 為準。

---

## Goal

實作 `/trips/new` 的建立旅行收藏表單，依 `NewTripScreen.dc.html` 完成版式、狀態與無障礙契約。

**範圍（2026-09-05 使用者確認）：create 與 edit 一起做。**

表單本體以 `mode: 'create' | 'edit'` 建置（設計明訂**不得複製成兩支表單**，否則驗證會漂移），
兩個路由各自是薄 Server Component，只負責取資料：

```text
/trips/new              → <TripForm mode="create" />
/trips/[tripId]/edit    → 讀 trip → <TripForm mode="edit" initialValues={…} />
```

**決定一起做的理由**：設計強制表單要有 `mode`，若不接 edit 路由，`mode='edit'` 在 App 內永遠到不了，
Seam B 會變成「測試綠、功能不可達」——正是上一輪 `onRetry`／Error 狀態的處境，
每一輪複審都被當成已知限制重提。一起做同時修掉 Home「重新命名」目前指向空白建立表單的錯誤接線。

**送出行為（2026-09-05 使用者確認，兩個 mode 不對稱）**：

| mode | 送出後 |
| --- | --- |
| `edit` | **完整接線**：寫回 mock、導回 `/trips`，Home 列表顯示改後的名稱 |
| `create` | **只呼叫 `onSubmit`**，不持久化、不導向 |

`create` 停在邊界的原因不是偷懶，是**設計稿沒有定義「0 個地點的收藏卡片」**：新收藏
`placeCount: 0`、沒有照片也沒有分類貼紙，而 `TripCard` 的版式繞著照片欄建立
（固定寬 148／172／196、`min-height:161`，照片是卡片高度的下限）。導回 Home 會撞到未定義的狀態。
`edit` 沒有這個問題——被編輯的收藏本來就有照片與地點，改名稱／目的地／說明不動那些欄位。

**0 地點卡片另開一支處理**（先定規格再改 `TripCard`），完成後再回頭把 `create` 接完。

## Expected Behavior

- 三個欄位固定順序：收藏名稱（必填）、目的地名稱（選填）、收藏說明（選填 textarea）。
- 名稱去除前後空白後非空才可送出；未滿足時 CTA 為**原生 `disabled`**，名稱欄下方出現一句
  `role="status"` 提示，CTA 以 `aria-describedby` 指向它。
- 提示出現時**只有 CTA 會動**，其他元素不位移。
- 名稱未填只擋送出，**不清空其他欄位、不預先標紅**。
- 過長名稱在 input 內**水平捲動**，不 ellipsis、不縮字、不換行，卡片不變高、無水平溢出。
- 三個欄位都是真 `<label for>` + `id`，不用 placeholder 當標籤；必填欄帶 `aria-required="true"`。
- 必填／選填以標籤右側 chip 表示，不用星號、不只靠顏色。
- 表單包在 `<form>` 內並支援 Enter 送出（設計稿自述 mock 未做，屬契約要補）。
- **鍵盤行為不在本輪範圍**（決定與理由見 Out of Scope）。

## Acceptance Criteria

| # | 驗收條件 | 來源 |
| --- | --- | --- |
| A1 | 名稱為空或全空白時 CTA 為原生 `disabled`；有非空白字元時 enabled | FORM RULES §送出條件 |
| A2 | CTA disabled 時出現 `role="status"` 提示，CTA 的 `aria-describedby` 指向它的 id | FORM RULES §disabled 說明、ACCESSIBILITY |
| A3 | 提示出現／消失時，除 CTA 外沒有任何元素位移 | FORM RULES §disabled 說明 |
| A4 | 名稱清空後，目的地與說明的值不受影響 | STATE RULES §名稱未填 |
| A5 | 三個欄位皆為 `<label for>` + `id`；名稱欄帶 `aria-required="true"` | ACCESSIBILITY §標籤關聯 |
| A6 | edit 模式：標題為「編輯旅行收藏」、CTA 為「儲存變更」、三欄帶入初始值、CTA 進入時可按 | CREATE / EDIT 共用版式 |
| A7 | 送出時 `onSubmit` 收到的名稱為 **trim 後**的值 | FORM RULES §送出條件 |
| A8 | 不存在 `maxlength`、字數計數器或輸入阻擋 | FORM RULES §字數上限（MVP §5.2 未定案） |
| A9 | 表單為 `<form>`，Enter 可送出；disabled 時 Enter 不送出 | ACCESSIBILITY §目前 mock 未實作 |
| A10 | 返回鍵的可及名稱為繁體中文（DS `IconButton` 寫死英文 `"Back"`，須頁面層覆寫） | ACCESSIBILITY §語言 |
| A11 | 裝飾（膠帶、信封）`aria-hidden` + `pointer-events:none` | ACCESSIBILITY §裝飾 |
| A12 | 視覺數值逐項符合來源（見 Planned Changes 對照） | LAYOUT / SPACING |
| A13 | 360／390／430 三個寬度皆無水平捲動；過長名稱不破版 | LAYOUT / SPACING、STATE RULES §編輯｜過長名稱 |
| A14 | 從 Home「重新命名」進入編輯、改名、儲存後，Home 顯示新名稱 | 本輪範圍決定（2026-09-05） |

---

## Test Seams（**2026-09-05 經使用者確認**）

沿用上一輪確立的切分：**視覺數值不寫成斷言**（那等同抄 CSS，且隨設計微調就碎），
只有可從外部觀察的行為與 ARIA 契約進 seam；版面數值走手動檢查。

### Seam A：送出條件與 disabled 契約（Vitest + RTL）

**公開介面**：`TripForm` 在不同輸入下的可送出狀態與提示。

**可觀察行為**
- 名稱為空 → CTA 原生 `disabled`、提示存在且 `role="status"`、CTA 的 `aria-describedby` 指向提示 id
- 名稱只有空白字元 → 同上（trim 後為空）
- 名稱有值 → CTA enabled、提示消失、`aria-describedby` 移除
- 清空名稱 → 目的地與說明的值不變
- 送出 → `onSubmit` 收到 trim 後的名稱

**為何是穩定邊界**：這是「給定輸入，表單允不允許送出、以及如何告知原因」的公開行為，
直接對應 FORM RULES 的送出條件與 ACCESSIBILITY 的 disabled 原因，不綁定版式。

### Seam B：`mode` 的差異（Vitest + RTL）

**公開介面**：`TripForm` 的 `mode` 與 `initialValues` prop。

**可觀察行為**
- `create`：標題「建立旅行收藏」、CTA「建立收藏」、三欄為空、CTA disabled
- `edit` + `initialValues`：標題「編輯旅行收藏」、CTA「儲存變更」、三欄帶入值、**CTA 進入時可按**

**為何是穩定邊界**：設計明訂兩個 mode 只差三處，這個 seam 正是守住「只差這三處」的契約——
日後若有人複製成兩支表單或讓驗證漂移，這裡會紅。

### Seam C：欄位的無障礙契約（Vitest + RTL）

**公開介面**：表單算繪出的無障礙樹。

**可觀察行為**
- 三個欄位都能以 label 文字取得（`getByLabelText`），不依賴 placeholder
- 名稱欄有 `aria-required="true"`，另兩欄沒有
- 返回鍵的可及名稱是繁體中文，不是 `"Back"`
- 裝飾（膠帶、信封）不在無障礙樹內

**為何是穩定邊界**：ACCESSIBILITY 卡自述是契約而非 mock 描述；`IconButton` 寫死英文標籤是
已知的 DS 缺口（與上一輪 `TripCard` 的 `"Trip options"` 同型），需要測試守住頁面層覆寫。

### Seam D：編輯流程端到端（Playwright E2E）

**公開介面**：使用者從 Home 走完編輯的完整路徑。

**可觀察行為**
- Home 卡片 `•••` → 重新命名 → 進入編輯頁，三欄帶入既有值
- 改名稱 → 儲存變更 → 回到 Home，列表顯示新名稱

**為何是穩定邊界**：這是唯一能驗證「路由、資料讀取、表單、寫回、導向」串起來的層級，
隔離元件測試看不到。專案已有 `e2e/trip-delete.spec.ts` 的同型前例。
**只有 edit 有這個 seam**——`create` 停在 `onSubmit` 邊界，沒有可走完的流程。

### 不新增 seam 的部分

版面數值（欄位 48／r12／卡 r20 padding 18／間距 16／底部留白 32）、膠帶座標、
鍵盤行為、三個寬度的無水平捲動 —— 一律走 §10.6 手動檢查。

---

## Test Cases and Passing Criteria

垂直切片，一個測試 → 一個最小實作 → 下一個。

| # | Seam | 行為 | Red 時預期的失敗 | Green 後必須成立 |
| --- | --- | --- | --- | --- |
| 1 | A | 名稱為空時 CTA `disabled` | 找不到 disabled 的 CTA | CTA 有原生 `disabled` |
| 2 | A | 名稱只有空白時仍 `disabled` | CTA 已 enabled | trim 後為空仍 disabled |
| 3 | A | 提示為 `role="status"` 且 CTA `aria-describedby` 指向它 | 屬性不存在 | 兩者關聯成立 |
| 4 | A | 名稱有值 → enabled、提示消失 | 提示仍在 | 提示不存在、`aria-describedby` 移除 |
| 5 | A | 清空名稱不影響其他兩欄 | 其他欄位被清空 | 兩欄值不變 |
| 6 | A | 送出時 `onSubmit` 收到 trim 後的名稱 | 收到未 trim 的值 | 收到 trim 後的值 |
| 7 | B | `create` 的標題與 CTA 文案 | 文案不符 | 完全相符 |
| 8 | B | `edit` 帶入初始值且 CTA 可按 | CTA 仍 disabled | 三欄有值、CTA enabled |
| 9 | C | 三欄可用 label 文字取得 | `getByLabelText` 找不到 | 三欄皆可取得 |
| 10 | C | 名稱欄 `aria-required="true"` | 屬性不存在 | 屬性存在，另兩欄無 |
| 11 | C | 返回鍵可及名稱為繁中 | 名稱是 `"Back"` | 名稱為繁中 |
| 12 | D | Home →「重新命名」→ 編輯頁帶入既有值 | 進到空白表單或 404 | 三欄為該收藏的值 |
| 13 | D | 改名 → 儲存變更 → Home 顯示新名稱 | Home 仍是舊名稱 | 列表顯示新名稱 |

---

## Out of Scope

- **收藏詳情頁 `/trips/:tripId`** —— 無設計稿，需先補設計
- **刪除收藏** —— 破壞性動作，入口在 Home 的 `•••`，設計明訂不放進這張表單
- **`create` 的持久化與導向** —— 停在 `onSubmit` 邊界，理由見 Goal
- **0 個地點的收藏卡片** —— 設計稿未定義，**另開分支先定規格再改 `TripCard`**；
  這是 Home 的既有規格缺口，不是本支造成的
- **preset 抽取的實作** —— 建立成功當下抽取並持久化，屬資料層；`create` 未持久化故本輪不需要
- **DS `TextField` 元件化** —— 設計稿建議把三個 Field 收成 DS 元件，但那是建議；
  與上一輪 `MenuPopover` 同型，不自行提升
- Loading／錯誤狀態 —— `NewTripScreen.dc.html` 的 STATE RULES 只定義五個狀態，皆為表單本身狀態
- **鍵盤行為（`visualViewport` 高度、nav 隱藏、留白降 16px、`scrollTop` 對焦）** ——
  **2026-09-05 決定不在本輪**，理由：
  1. `components.md` 該節標題自限於 **Import composer 與 supplement form**；
     `screens.md` 的表單專節只指定「nav 只有鍵盤會蓋掉它」一條
  2. 最麻煩的「CTA 必須保持可見」**不適用**——該節明訂「**補充表單的送出鍵允許被鍵盤蓋住**」，
     因為 Analyze 是單一欄位的唯一出口而補充表單不是；本畫面是三欄位表單，屬後者
  3. nav 位於畫面最底部，鍵盤浮起時本來就會蓋住它
  4. 真正需要那套機制的是 Import（Analyze CTA 必須可見、多行欄位成長補償、截圖槽與鍵盤不共存），
     到那支一次做對

  **誠實標示的落差**：不做的話 nav 是「被蓋住」而非「真的隱藏」，仍在 DOM 內、tab 走得到；
  且實機鍵盤行為無法在 §10.6 驗證（Playwright 僅 Pixel 7 + Chromium）。兩者列入 Known Limitations。

---

## Files to Inspect

- `Skill(pintrip-design)` → `SKILL.md` precedence 表 → `screens.md` §Create / Edit、`components.md`
  §App Shell／§Keyboard／§Component inventory、`accessibility.md`
- `docs/design/claude-design-export/NewTripScreen.dc.html` —— 最高優先。FORM RULES、
  CREATE / EDIT 共用版式、LAYOUT / SPACING、STATE RULES、ACCESSIBILITY、COMPONENT TREE 六張卡
- `docs/design/claude-design-export/_ds/…/_ds_bundle.js` —— `AppHeader`、`IconButton`、
  `Wordmark`、`Button`、`LinkInput`（欄位幾何來源）、`Sticker`
- `docs/MVP.md` §5.2、`docs/ARCHITECTURE.md` §4／§4.1／§5.2／§10
- `src/components/app-shell.tsx`、`src/types/trip.ts`、`src/lib/mock/trips.ts`

## Planned Changes

### `src/app/trips/new/page.tsx`

取代現有 stub。Server Component：算繪 `AppShell` 與美術素材，把表單交給 Client 元件
（依 `ARCHITECTURE.md` §4「不得因單一互動元件把整個頁面轉成 Client」）。

### `src/components/trip-form.tsx`（新增，Client）

| 項目 | 來源值 |
| --- | --- |
| 標題 | create「建立旅行收藏」／edit「編輯旅行收藏」，26px Quicksand 700 |
| 說明 | create「先取個名字就能開始收集地點，其他欄位之後都能補。」／edit「名稱、目的地與說明都可以隨時修改，收藏裡的地點不受影響。」13px lh1.6，max-width 304 |
| 標題 → 表單卡 | 18px |
| 表單卡 | 滿寬 · r20 · padding 18 · `shadow-card` |
| 欄位間距 | 16px |
| 卡 → CTA | 16px |
| CTA | 滿寬 48px solid 藍；文案 create「建立收藏」／edit「儲存變更」 |
| 提示 | id `trip-name-hint`，文字「先填收藏名稱，才能{建立／儲存}。」 |
| 膠帶 | `top:-8 left:28 58×16 #F3E3B8 .92 r2 rotate(-6°) z2`，`aria-hidden` + `pointer-events:none` |

### `src/components/trip-form-field.tsx`（新增）

| 項目 | 來源值 |
| --- | --- |
| 標籤 | 11px Quicksand 700 `.1em`；標籤 → 欄位 6px |
| chip | 必填 `#FBEAE6` 底／選填 `#F4EFE4` 底，文字皆 `#3B3B3D` |
| 單行欄位 | 高 48 · r12 · padding 0 12 · 1.5px `#E3D9C6` · 底 `#F9F5ED` |
| textarea | min-height 82 · padding 11/12 · `resize:none` · 可捲動 |
| placeholder | 名稱「例如：京都的秋天」／目的地「例如：日本 京都」／說明「這趟旅行想留下什麼？主題或感受都可以。」 |
| 說明欄下方灰字 | 「用來描述旅行的主題或感受；不影響分類、篩選或地圖。」 |
| focus-visible | 2px `--blue-400` + 2px offset |

### `src/components/app-header.tsx`（新增）

DS `AppHeader` 的頁面層實作：返回鍵 44（DS `IconButton` 預設 40，取設計稿的 44）、
`wordmark-script` 40、信封貼紙 52 rotate(4°)。**返回鍵的 `aria-label` 必須頁面層覆寫為繁中**。
Header → 標題 14px。

### `src/app/trips/[tripId]/edit/page.tsx`（新增）

薄 Server Component：以 `getTrip(tripId)` 取資料，傳 `initialValues` 給 `TripForm mode="edit"`。
查無此收藏時的處理**待實作時依 Next.js 版本文件決定**（`notFound()` 或等效），不預設。

### `docs/ARCHITECTURE.md`（修改，**必須先於實作**）

§10 規劃路由新增 `/trips/:tripId/edit`。依 `AGENTS.md`，規格變更要先更新文件再實作。

### `src/lib/mock/trips.ts`（修改）

新增 `getTrip(id)` 與 `updateTrip(id, input)`。維持「開發期假資料」定位：
由 Server Action 寫回同一 server process 的 `globalThis` 共用 mock 陣列，換頁與瀏覽器重新整理後保留；
伺服器重啟後還原；模組熱重載可能保留。共用單例只限 `src/lib/mock/`，具明確型別、不使用 any，
並註解 Next.js dev 的路由 server chunk 為何需要共用狀態；接上正式資料存取後整包移除。
決策依據與確認紀錄見「偏離與計畫外的修改」D1、D3；與刪除的差異見 Known Limitations。

編輯頁定義 inline `async` Server Action（函式內 `use server`），經 `onSubmit` prop 傳入表單。
寫入前在 Server 檢查三欄型別與名稱 trim 非空；完成後依序呼叫
`revalidatePath('/trips')`、`revalidatePath('/trips/' + tripId + '/edit')`、`redirect('/trips')`。
前者更新 Home 快取，後者使再次編輯取得新值；`redirect` 放在 revalidation 之後且不被 catch 吞掉。
依據已安裝 Next.js 16.2.12 文件：`01-app/01-getting-started/07-mutating-data.md`
（inline action、props、mutation 後 revalidation／redirect），以及
`01-app/03-api-reference/04-functions/revalidatePath.md`、`redirect.md`，皆位於
`node_modules/next/dist/docs/`。Home 的 client state 是否接收新資料由案例 13 實際驗證。
編輯頁的 `params` 依 `03-file-conventions/dynamic-routes.md` await；查無收藏依
`04-functions/not-found.md` 呼叫 `notFound()`，不另設計查無資料畫面。

### `src/components/trip-collections.tsx`（修改）

`onRename` 由 `router.push('/trips/new')` 改為導向 `/trips/{tripId}/edit`，
修掉目前點「重新命名」會開空白建立表單的錯誤接線。

### `src/components/app-shell.tsx`（修改）

底部留白 72px 是 Home 專用；本畫面為 **32px + safe-area inset**（與 Import 同）。

**做法（2026-09-05 確認）**：加一個具名 prop，預設值維持現況。

```tsx
AppShell({ children, bottomPad = 'nav' }: {
  children: ReactNode
  bottomPad?: 'nav' | 'compact'   // nav = 72px（Home）／compact = 32px（Import、本畫面）
})
```

- 用**語意名稱**而非數字 prop——`bottomPad={32}` 會把魔術數字散到呼叫端，也鼓勵填入第三個值
- **預設 = 現況**，Home 的呼叫端零修改
- **`AppShell` 維持 Server Component**

已評估並排除的做法：由頁面各自加底部留白（「最後一項要避開 nav」會被複製到每頁、遲早漂移）、
`AppShell` 讀 `usePathname` 自行判斷（會把 shell 變成 Client，且版式規則藏在 shell 裡，
從頁面看不出來）、做成 token 讓頁面覆寫（兩個值而已，過度設計）。

---

### `src/components/bottom-nav.tsx`（修改，2026-09-05 使用者確認）

修正依據與上一支誤判見 D2。以明確路由對應 `/trips`、`/trips/new`、
`/trips/:tripId/edit` 為旅行收藏 active；編輯路由只接受一個非空 tripId segment，
不使用 `startsWith('/trips')`。其他未定路由見 Known Limitations。
案例 12 在既有 Seam D 補驗編輯頁 `aria-current="page"`；其餘路由邊界走實頁檢查。

## 偏離與計畫外的修改

實作過程中凡是與本計畫不同的，一律記在這裡。Reviewer 只看得到 diff、看不到對話，
所以「改了什麼、為什麼」必須存在於產出物裡。

**記錄順序**：發現差異 → 停下來說明差異與理由 → 使用者確認 → 寫進本節 → 才繼續執行。
唯一例外是不需要決定的事實補登（來源明確且無其他選擇的數值），可事後記錄，
但**必須標明是事後記錄**。

| 編號 | 確認 | 原計畫與錯誤原因 | 修正與依據 |
| --- | --- | --- | --- |
| D1 | 2026-09-05 使用者於實作前確認；不是事後補登 | 原寫「模組層陣列變動，換頁後仍在、重新整理即還原，與現行刪除的行為一致」。既有刪除只作用於 client state；編輯跨 `/trips/:tripId/edit` → `/trips`，單頁 client state 無法承接跨頁寫回，而 server 模組不會因瀏覽器重新整理重建。這是計畫錯誤，非既有程式錯誤。 | edit 透過 Server Action 更新 server mock、更新 Home 並導回 `/trips`；還原時機及快取做法見 Planned Changes 的 mock 段落。依據 `ARCHITECTURE.md` §4「寫入操作留在 Server 端」。 |
| D2 | 2026-09-05 使用者於修改前確認；不是事後補登 | 原計畫漏列 BottomNav。上一支 `trip-collection-list-visual.md` 第 10 列原文：`pathname.startsWith(cell.href)` ／ `/trips/new` 會一起高亮 ／ `實作決定：改精確比對`。它將設計要求誤判為缺陷。 | `NewTripScreen.dc.html` 明載 `active-id="trips"`，來源明載優先於實作決定；本次修正上一支誤判，不是變更設計決定。明確路由對應見 Planned Changes，不改回會誤命中 `/tripsomething` 的 startsWith。 |
| D3 | 2026-09-05 使用者於修改前確認；不是事後補登 | 「還原時機」第三版：原始計畫「重新整理即還原」錯誤；第一次修正「伺服器重啟／模組重載後還原」仍未經實測。前兩版均為計畫作者未經驗證的敘述，不是反覆改變偏好。案例 13 實測：Action 寫入並執行 revalidatePath 後，全新分頁的 Home 仍讀到「京都」、edit 讀到「京都的秋天」；dev 編譯產物包含多份 mock 模組。 | 依實測採用 Planned Changes 的共用 server mock 與第三版還原保證。`playwright.config.ts` 使用 `npm run dev`，此修正為通過已確認 Seam D 所必要。禁止將 globalThis 模式外溢到正式資料層或 `src/lib/mock/` 之外。 |
| R1 | 2026-09-05 Reviewer 第 1 次複審後，使用者逐項指定修正 | 不適用（非計畫錯誤，是複審發現） | **Non-blocking 9**：`e2e/trip-edit.spec.ts` 案例 13 會改寫 server 端共用 mock（京都 → 京都的秋天再還原），而 `playwright.config.ts` 為 `fullyParallel: true`，`trip-delete.spec.ts` 同時斷言「京都」。Reviewer 連跑 5 次未重現，但 CI 設 `retries: 2`，重試可能落入改名視窗。**修法**：`trip-delete.spec.ts` 改為斷言 `/的更多選項$/` 的按鈕數量而非特定名稱——該處要驗的是「另一個收藏還在」，與它叫什麼無關。類層級問題見 Known Limitations |
| R2 | 同上 | 不適用（非計畫錯誤，是複審發現） | **Non-blocking 2**：`bottom-nav.tsx` 刪除舊註解後未補新的，推翻上一支「實作決定」的依據只存在於計畫 D2，未來讀者在程式內看不到、容易再改回。**修法**：補註解說明明確路由對應的理由、`active-id="trips"` 的來源、以及它推翻了哪一列，並標明未涵蓋的兩條路由 |
| F1 | 事後記錄：來源明確的數值與盤點事實，無新增產品決策 | reference 摘要不足以決定精確外觀；既有 field token 為 `#EAE5DB`，與本畫面來源不同。 | 依 `NewTripScreen.dc.html`：header 為返回鍵／右側 wordmark+信封兩組（非 DS AppHeader 三欄）；上方 8px 加 header 6px，在既有 shell 12px 後補 2px；helper 上距 8px；chip 10.5px、padding 2/7、標籤間距 7px；hint 12px/1.55、上距 7px且保留行高；說明灰字 11.5px/1.55、上距 7px。依 `_ds_bundle.js`：Button solid 為 blue-600、md 圓角14、字級15、陰影 `0 2px 6px rgba(60,95,160,.16)`；IconButton 接受 label，英文 Back 寫在 AppHeader；返回圖寬為44×.45＝19.8px。欄位依畫面來源取 `#E3D9C6`，不採錯色 token；膠帶依畫面 CSS，不套 Sticker 的 mask／陰影。 |

## Known Limitations

- 刪除與編輯的還原行為不一致：刪除重新整理即復原，編輯要伺服器重啟；模組熱重載可能保留。
  成因是既有刪除只作用於 client state，不是本輪造成；等真正的資料層定案時一併解決。
- 鍵盤排除項與實機驗證限制見 Out of Scope 的鍵盤決策。
- `/trips/:tripId` 與 `/trips/:tripId/map`（`ARCHITECTURE.md` §10）未涵蓋於 active 對應，
  目前兩格都不亮。這兩頁沒有設計稿，active 狀態尚未定義；本輪不自行決定，待補設計時處理。
- **Server Action 無所有權檢查**（Reviewer 第 1 次複審 Non-blocking 6）。
  `ARCHITECTURE.md` 要求所有 Trip 修改在 Server 端驗證所有權，但 Auth 套件於 §2.2 明列
  「尚未決定、不得自行安裝」、§4.1 明載「登入狀態的判斷待 Auth 方案定案後再加入」，
  且 `Trip` 型別無使用者維度。現階段實作所有權檢查等同自行決定未定技術方案（`AGENTS.md` 禁止），
  故 Reviewer 判定**目前可接受**。惟這是本專案第一個瀏覽器可觸發的 Server 端寫入，記錄備查，
  Auth 方案定案時必須補上。
- **`compact` 底部留白在 `safe-area-inset-bottom > 0` 的裝置上可能多算一份 inset**
  （Reviewer 第 1 次複審 Non-blocking 5）。`BottomNav` 是捲動層的 flex 兄弟且自身已含
  `pb-[env(safe-area-inset-bottom)]`，而 `compact` 又加了一次。
  **但這是設計來源自身的衝突，不由我們裁定**：`NewTripScreen.dc.html` 的 LAYOUT 卡明寫
  「32px（+ safe-area inset，與 ImportScreen 同）」，實作照抄無誤；而
  `claude-design-export/CLAUDE.md` 記錄的 Import 實測結果是「CTA 下緣距 nav 上緣 **32px**」，
  兩者在 inset > 0 時互斥。Playwright 僅 Pixel 7（inset = 0）結構性無法分辨。
  依 `pintrip-design` skill「兩份來源衝突時停下回報、不自行選一邊」，**維持照設計稿實作並回報**。
- **E2E 與 server mock 的隔離是類層級問題，本輪只修了實例。**
  整個 E2E 套件跑在同一個 dev server、共用同一份可變的 mock 狀態，而 `fullyParallel: true`。
  本輪把 `trip-delete.spec.ts` 的斷言改為不依賴名稱以消除已知衝突，但**任何未來會改寫 mock 的
  E2E 都可能再撞上**。真正的解法是每個測試有自己的資料隔離，那要等真實資料層定案；
  在那之前新增會寫入的 E2E 時必須檢查與既有斷言的交互作用。

---

## TDD Evidence

**來源**：Codex 本次執行的原始紀錄
`C:/Users/User/.codex/sessions/2026/09/05/rollout-2026-09-05T17-08-29-01a070d3-92d4-7143-8d8a-02ae695b1667.jsonl`。
**13 條全部找回實際 Red，沒有無紀錄、也沒有第一次執行即全綠的案例。**

**Claude 的獨立驗證（2026-09-05）**：該檔實際存在（4,956,808 bytes），並以字串比對確認下列
引用的失敗訊息確實出現在紀錄中——`Received element is not disabled`（9 次）、
`Unable to find a label with the text of`（8 次）、`Number of calls: 0`（8 次）、
`Unable to find an element with the placeholder text of`（8 次）、`aria-current`（25 次）、
`Google Fonts`（13 次）、`error-context.md`（22 次）、`trips/kyoto/edit`（17 次）、
`element(s) not found`（10 次）。**證據有來源，非事後重建。**

| # | Seam | Red 的實際失敗 | Green |
| --- | --- | --- | --- |
| 1 | A | 找不到 role `button`：`Unable to find an accessible element with the role "button"`，DOM 只有空 `<div />` | PASS（1/1） |
| 2 | A | 輸入純空白後 `toBeDisabled()` 失敗：`Received element is not disabled` | PASS（2/2） |
| 3 | A | 找不到提示：`Unable to find an accessible element with the role "status"` | PASS（3/3） |
| 4 | A | 輸入名稱後 `not.toBeInTheDocument()` 失敗，仍找到 `trip-name-hint` 的 `<p role="status">` | PASS（4/4） |
| 5 | A | 找不到目的地欄位：`Unable to find an element with the placeholder text of: 例如：日本 京都` | PASS（5/5） |
| 6 | A | 輸入名稱並按 Enter 後 `onSubmit` 未被呼叫：`Number of calls: 0` | PASS（6/6） |
| 7 | B | 找不到 role `heading`、名稱「建立旅行收藏」的元素 | PASS（7/7） |
| 8 | B | 找不到 role `heading`、名稱「編輯旅行收藏」的元素，實際仍顯示「建立旅行收藏」 | PASS（8/8） |
| 9 | C | `getByLabelText` 失敗：`Unable to find a label with the text of: 收藏名稱` | PASS（9/9） |
| 10 | C | 名稱欄預期 `aria-required="true"`，實際 `Received: null` | PASS（10/10） |
| 11 | C | 找不到 role `button`、名稱「返回」的元素，DOM 只有空 `<div />` | PASS（11/11） |
| 12 | D | 點重新命名後 `toHaveURL` 預期 `/trips/tokyo/edit`，實際 `/trips/new`，等待 5 秒失敗 | PASS；後續正常退出的執行為 1/1 |
| 13 | D | 儲存後 `toHaveURL` 預期 `/trips`，實際仍為 `/trips/kyoto/edit`，等待 5 秒失敗 | PASS（與案例 12 合跑，2/2） |

**Red 的涵蓋範圍限制（Codex 主動揭露，未經詢問）**：1–11 的 Green 數字是逐條新增後的累計結果；
**實際失敗不等於該條測試的所有斷言都曾紅過**——案例 5 尚未走到清空名稱、6 並非收到未 trim 值、
8 尚未走到 CTA 斷言、11 並非讀到英文 `Back`。這項資訊直接影響 `CODE_REVIEW.md` §9.1
「Green 只加入通過當前測試的最小實作」的判斷，交由 Reviewer 裁定。

**過程中的意外**

- **案例 11 沒有發生 jsdom `useRouter` 拋錯。** 執行前已加入 `next/navigation` 框架邊界 mock，
  實際 Red 是缺少返回按鈕。**本次查無**套件、jsdom 或測試設定導致 1–11 全紅的紀錄。
  （上一支曾有此類情形，Claude 在索取證據時以它為例；Codex 查證後明確否認本次發生，未順著提問作答。）
- **案例 12 的 Playwright 程序未正常結束。** 首次已輸出失敗標記但程序持續執行，
  URL 錯誤取自當次 `error-context.md`，之後以 Ctrl+C 中止；最小實作後曾輸出 `ok 1` 仍未正常退出，
  該次不算完整成功執行。後來另啟 dev server 讓 Playwright 重用，才取得 exit code 0。
- **案例 12 追加 BottomNav 斷言後再次 Red**：`aria-current` 預期 `"page"`，實際屬性不存在（`null`）。
  修正明確路由對應後 1/1 PASS。
- **案例 13 加入 Server Action 後仍 Red，失敗位置改變**：已返回 `/trips` 但找不到
  「「京都的秋天」的更多選項」，錯誤為 `element(s) not found`。另開分頁實測 Home 仍是「京都」、
  edit 已是「京都的秋天」，確認是真實的跨路由資料共享缺口而非測試環境雜訊；
  依 D3 改為 `globalThis` 單例後 2/2 PASS。
- **build 曾因 Google Fonts 下載失敗，未計入任何 Red**；同一 build 命令取得網路權限後通過。

**Review-stage Refactor**：`NOT YET ASSESSED`（初次交審）。

---

## Validation Plan

| 步驟 | 動作 |
| --- | --- |
| 1 | `npm run lint` |
| 2 | targeted tests：`trip-form` |
| 3 | `npm test` |
| 4 | `npm run build` |
| 5 | `git diff --check` |
| 6 | §10.6 實機檢查：三寬度版面數值、五個狀態、鍵盤行為、focus ring、過長名稱不破版 |

驗收條件對應：A1–A11 由測試 1–11 涵蓋；A14 由測試 12–13（E2E）涵蓋；A12、A13 走 §10.6。

## Review Plan

- 狀態為 `READY FOR REVIEW` 的 Developer Report（寫在 Review Input，不另產檔案）
- 限定範圍的 `git status --short` 與 diff
- 13 條測試的 Red → Green 證據 —— **已補齊，見上方 TDD Evidence 一節**（初次交審時漏未提供，為 Reviewer 第 1 次複審的唯一 Blocking）
- 六項驗證的實際輸出
- §10.6 的量測結果

---

## Open Questions

### 1. 編輯模式的入口與路由 —— **已決定（2026-09-05）**

**路由為 `/trips/:tripId/edit`**，理由是 `ARCHITECTURE.md` §10 已有 `/imports/:importId/items/:itemId/edit`
的同型前例，屬照既有慣例延伸而非新發明。未採用 `?edit=<id>`（語意錯誤，那不是「新增」）
與 Home 上的 modal（違背設計稿——那是一個有自己 header、標題與 BottomNav 的完整畫面）。

**依 `AGENTS.md`，改路由是規格變更，必須先更新 `ARCHITECTURE.md` §10 再實作。**

附帶：設計稿明訂「編輯模式的 CTA 是否要在未變更時 disabled」**尚未定案**，本輪不碰那半；
已定案的是「進入時 CTA 可按」（名稱已有值），照做。

### 2／3. 送出後的持久化與導向 —— **已決定（2026-09-05）**

見 Goal 的對照表：`edit` 完整接線（寫回 mock、導回 `/trips`），`create` 只到 `onSubmit` 邊界。
設計稿把送出後導向標為 `OPEN`，本輪只為 `edit` 裁定「導回 Home」——那是「重新命名」的來處，
不是憑空指定；`create` 的導向仍為未定，留待 0 地點卡片定案後一併處理。

### 4. Test Seams —— **已確認（2026-09-05）**

四個 Seam（A 送出條件與 disabled 契約／B `mode` 差異／C 無障礙契約／D 編輯流程 E2E）
與 13 條測試案例經使用者確認，照計畫執行。

### 5. 鍵盤行為 —— **已決定不做（2026-09-05）**

見 Out of Scope。

---

**四項 Open Question 全部結案，計畫進入 READY TO IMPLEMENT。**
實作順序：先更新 `ARCHITECTURE.md` §10（規格先於實作），再依測試案例逐段 Red → Green。
