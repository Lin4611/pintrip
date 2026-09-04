# PinTrip MVP 架構

## 0. 文件狀態

- 專案名稱：PinTrip
- 文件用途：定義 MVP 的系統邊界、元件責任、資料關係、處理流程與技術決策狀態
- 最後更新：2026-09-01

本文件是架構與實作邊界的規範來源。產品目標、功能範圍與驗收條件以 `docs/MVP.md` 為準。

本次架構內容只根據 `docs/MVP.md`、本文件原始內容與 `AGENTS.md` 整理，尚未對照現有程式碼、套件或部署環境。未驗證的實作狀態不得標示為已完成。

---

## 1. 架構目標

架構必須支援以下產品能力：

1. 以 Google 驗證使用者身分，並隔離每位使用者的資料。
2. 接收手動貼上的單篇 Instagram 網址與 Android PWA 分享資料。
3. 保留來源及補充資料，並誠實呈現處理狀態。
4. 從一次匯入產生零個、一個或多個候選地點。
5. 將候選資料與外部實際地點比對。
6. 在使用者確認後建立正式收藏，並避免同一旅行收藏出現重複地點。
7. 讓卡片清單與地圖共用相同的分類篩選結果。

架構不得假設能直接同步 Instagram 私人珍藏，也不得依賴不穩定爬蟲作為唯一匯入路徑。

---

## 2. 技術決策狀態

### 2.1 已決定

| 項目 | 決定 | 依據 |
| --- | --- | --- |
| 應用型態 | 響應式 Next.js Web 應用 | `AGENTS.md` 與產品平台範圍 |
| Android 入口 | 可安裝 PWA，提供 Web Share Target | MVP 必要能力 |
| iOS 入口 | Safari 手動貼上連結，不做原生 Share Extension | MVP 平台範圍 |
| React 邊界 | 優先使用 Server Components；需要瀏覽器互動時才使用 Client Components | `AGENTS.md` |
| 登入方式 | Google 是唯一的 MVP 身分提供者 | MVP 登入範圍 |
| 正式收藏門檻 | 必須由使用者確認，且匹配外部 Place | 核心產品規則 |
| 去重範圍 | 同一 Trip 與 Place 的組合唯一 | 核心產品規則 |
| Instagram 匯入網址 | 支援單篇一般貼文（`/p/`）與 Reel（`/reel/`）網址 | MVP 匯入範圍 |
| Import 來源識別 | Import 建立後，其原始來源網址不因畫面輸入變更而改寫；不同網址建立另一筆 Import | 避免處理來源與顯示來源不一致 |
| 批次確認失敗語意 | 允許部分成功；成功項目保留，失敗項目維持尚未處置並可重試，不回滾整批 | ImportItem 獨立處置與使用者體驗決定 |
| 測試工具鏈 | Vitest + React Testing Library 負責單元與元件測試；Playwright 負責端對端測試 | 2026-09-01 Dependency Proposal 與 Reviewer 核准的工具鏈設定 |
| UI 元件庫 | Tailwind CSS 搭配 Design System token 手刻視覺層；需要焦點管理、鍵盤模型或 ARIA 契約時才逐個引入 Radix primitive | 2026-09-01 Dependency Proposal |

「Google 登入已決定」只代表使用者登入方式；具體 Auth 套件、Session 儲存與 OAuth 設定仍未決定。

Vitest 使用 `jsdom`、`@testing-library/react`、`@testing-library/user-event` 與 `@testing-library/jest-dom` 驗證 Client Component 及純函式的公開可觀察行為。Playwright 目前只啟用 Pixel 7 裝置設定與 Chromium，驗證跨頁流程、Next.js 頁面組裝及需要真實瀏覽器的行為；Firefox、WebKit 與 production server E2E 尚未納入。每項功能仍須依 `docs/DEVELOPMENT_GUIDE.md` 事前確認 Test Seams、測試案例與通過標準，工具鏈 smoke test 不代表產品功能已有測試覆蓋。

Radix primitive 不帶樣式，不對視覺做任何主張；外觀一律由 Design System token 決定。目前只安裝 `@radix-ui/react-dialog`（刪除確認 sheet）與 `@radix-ui/react-dropdown-menu`（TripCard 錨定下拉），不安裝整包 `radix-ui`；日後需要其他 primitive 時逐個提出 Dependency Proposal，不得預先引入。使用這些 primitive 的元件必須是 Client Component，符合 §4 的 Server 與 Client 邊界。不得引入自帶樣式主張的元件庫，以免與設計稿的視覺語彙衝突。

設計交付使用的 Design System 以編譯後的 `docs/design/claude-design-export/_ds/<design-system>/_ds_bundle.js` 形式存在，原始 `components/` 未包含在本專案。目前該 bundle 帶有以下本地修改，屬元件責任而非頁面覆寫：

- `Button`：`sm` 高度由 40 調整為 44，以符合 44px 最小點擊區；並新增 `ariaLabel` 與 `ariaDescribedby` 透傳。
- `BottomNav`：新增 `showFab`（預設 `true`；PinTrip 三張設計稿皆傳 `false`）。
- `PlaceResultCard`：新增 `readOnly`、`dispositionLabel`、`failed`、`failureText`、`failureId`、`failureLabel`、`adding`、`editAriaLabel`、`rejectAriaLabel`、`addAriaLabel` 與 `onRetry`。
- `CategoryBadge` 與 `PlaceResultCard`：`KINDS` 與 `TAG_TONE` 對齊 §5.9 固定五分類——`shop` 更名為 `shopping`、移除 `stay`、新增 `other`。同批更新 `_adherence.oxlintrc.json`，使不在五類內的 `kind` 或 `category` 在 lint 階段被擋下，而非靜默 fallback。

若日後改為由原始碼重新編譯 Design System，必須先確認這些修改不會遺失。設計交付端的對應紀錄見 `docs/design/claude-design-export/CLAUDE.md`。

以上關於 Design System bundle 的敘述只描述設計交付本身，不構成應用端的實作依據；應用端 UI 元件庫的決定見本節上方。

**應用端 token 實作**

本小標以下各段為應用端的規範性內容，實作時必須遵守。

應用端字體透過 `next/font/google` 於建置時下載並自架，不採用 Design System `tokens/fonts.css` 的 Google CDN `@import`。字族與 fallback 順序仍以 Design System `tokens/typography.css` 為準；這項偏離只改變載入方式，不改變視覺。如此可避免瀏覽器直接向 Google Fonts 發出請求，也避免同一字體同時由自架資產與 CDN 重複載入。

DS 的設計值在應用端一律以 Tailwind class 表達，切版時不得在 `className` 或 `style` 中寫 `var()`。token 定義於 `src/styles/tokens/`，由 `src/styles/globals.css` 單一入口匯入；每個值只有一個定義來源，不使用 `@theme inline` 與平行的 `:root` token 層。

**新增設計值時的判斷順序**

1. **Tailwind 內建 class 已能表達 → 不要定義 token。** `duration-*`、`scale-*`、`rotate-*`、`p-*`、`h-*` 是功能式 utility，接受任意數字，例如 200ms 直接寫 `duration-200`、0.97 倍寫 `scale-97`、-4deg 寫 `-rotate-4`。DS 的 `--sp-1` 至 `--sp-10` 與 Tailwind 預設 4px scale 完全重合，同樣不需定義。
2. **落在 Tailwind namespace 內 → `@theme`。** namespace 清單以已安裝版本的 `node_modules/tailwindcss/theme.css` 為準。值不是數字（例如 `cubic-bezier`）時必須註冊才有 class。
3. **不在 namespace 內但需要 class → `@utility`。** 可定義於被 `@import` 的檔案內。

**命名必須同時避開兩類既有 utility**

- Tailwind 內建 utility：例如 `--color-*` 若命名為 `dashed`，產生的 `border-dashed` 會覆蓋內建的 border-style。
- `@theme` 自動產生的 utility：色票一旦定義 `--color-x`，`border-x`、`text-x`、`bg-x`、`ring-x` 即被佔用；`@utility` 不得再使用同名，否則編譯後同名規則互相覆蓋且無任何錯誤訊息。

驗證方式：以 `@tailwindcss/postcss` 編譯後檢查產物，確認目標 class 存在且沒有任何 class 名稱被定義兩次。

**DS 名稱與程式碼名稱的對應**

設計稿與 `pintrip-design` Skill 使用 DS 原名，實作時依 Tailwind namespace 轉換：

| DS | 程式碼 | 範例 class |
| --- | --- | --- |
| 色票 `--cream-100` 等 | 加 `--color-` 前綴 | `bg-cream-100` |
| `--r-*` | `--radius-*` | `rounded-lg` |
| `--shadow-*` | 同名 | `shadow-card` |
| `--font-display/ui/script/kr` | 同名 | `font-display` |
| `--type-*` | `--text-*` | `text-ui-sm` |
| `--w-*` | `--font-weight-*` | `font-bold` |
| `--lh-*` | `--leading-*` | `leading-tight` |
| `--ls-*` | `--tracking-*` | `tracking-wide` |
| `--ease-soft` / `--ease-spring` | 同名 | `ease-soft` |

語意色去掉 DS 的方向前綴後套用 Tailwind namespace，其中部分為避開命名衝突而另行改名：`--bg-app` → `bg-app`、`--surface-card` → `bg-card`、`--surface-nav` → `bg-nav`、`--surface-panel` → `bg-panel`、`--text-display` → `text-title`、`--text-heading` → `text-heading`、`--text-body` → `text-copy`、`--text-body-kr` → `text-copy-kr`、`--text-muted` → `text-muted`、`--text-accent` → `text-link`、`--text-on-accent` → `text-on-accent`、`--accent` → `bg-accent`、`--accent-strong` → `bg-accent-strong`、`--accent-action` → `bg-action`、`--border-hairline` → `border-hairline`、`--border-dashed` → `border-dash`、`--border-field` → `border-field`、`--focus-ring` → `ring-focus`。

`--text-body` 不可命名為 `--color-body`：會與字級 `--text-body` 產生同名 class。`--border-dashed` 不可命名為 `--color-dashed`：會覆蓋 Tailwind 內建的 `border-dashed`。

具名間距與複合邊框以 `@utility` 提供：`px-gutter`（DS `--screen-gutter`）、`p-card`、`gap-card`、`gap-stack`、`h-nav`、`pb-nav-safe`、`min-h-tap`、`dash-frame`（DS `--border-dash`，1.5px）、`divider-dash`（DS `--divider-dash`，1px）。`dash-frame` 刻意不叫 `border-dash`，因該名稱已被 `--color-dash` 佔用。

完整規劃與決策過程見 `docs/plans/design-system-tokens.md`。

### 2.2 尚未決定

| 項目 | 決定前的限制 |
| --- | --- |
| Next.js 實際版本與路由慣例 | 實作前依 `AGENTS.md` 閱讀已安裝版本的官方指南，不依訓練資料猜測 |
| Authentication 套件或服務 | 不得自行安裝；必須支援 Google 登入與安全 Session |
| 資料庫與資料存取方案 | 不得自行選擇或更換 |
| 地圖服務與 Places API | 不得把任何供應商寫成既定方案 |
| AI 模型與供應商 | 不得自行選擇；輸出必須視為候選資料 |
| 背景任務與重新嘗試機制 | 同步或非同步策略尚未決定 |
| 截圖儲存與保存期限 | 必須支援隨 Trip 刪除，但供應商與期限未決 |
| Client 狀態管理 | 優先避免不必要的全域狀態；具體方案未決 |
| 部署與環境配置 | 尚未指定 |
| Instagram 公開內容取得方式 | 必須保留手動補充路徑，具體方法未決 |

未決項目只能記錄需求、限制與候選方案；未經使用者確認，不得被 Agent 選定、安裝或實作為唯一方案。

---

## 3. 系統邊界與責任

以下是邏輯責任，不代表已選定獨立服務或部署單位。

### 3.1 Web 與 PWA 介面

負責：

- Google 登入與登出入口。
- 旅行收藏、匯入紀錄、待確認項目、卡片及地圖介面。
- 手動貼上來源資料與上傳補充截圖。
- Android PWA 安裝資訊與 Web Share Target 接收入口。

### 3.2 身分與授權邊界

負責：

- 驗證 Google 登入結果並建立應用程式 Session。
- 在 Server 端取得目前使用者身分。
- 對所有 Trip、Import、ImportItem、TripPlace、TripPlaceSource 與補充資料操作執行所有權檢查。

UI 隱藏不是授權控制。任何讀取、修改、重新處理或刪除動作都必須在 Server 端驗證所有權。

### 3.3 匯入接收

負責：

- 驗證手動輸入或 Share Target payload，並區分「不支援的來源網址」與「有效網址但內容無法取得」。
- 將匯入綁定目前使用者與目標 Trip。
- 保存原始網址、可取得文字與必要來源快照。
- 建立 `received` 狀態的 Import。

不得假設分享資料一定包含完整貼文內容或圖片。

一般貼文（`/p/`）與 Reel（`/reel/`）網址通過來源格式驗證後才可建立 Import。Import 建立後，原始來源網址是該筆任務的來源識別；`received`、`processing` 與後續回訪畫面不得以可編輯輸入取代它。使用者改用其他網址時必須建立另一筆 Import，不得改寫正在處理或既有 Import 的來源。

### 3.4 來源取得與地點解析

負責：

- 嘗試取得允許讀取的來源內容。
- 對 Reel 優先使用可取得的 caption、Share Target 文字或其他文字內容，不要求必須取得影片內容。
- 結合使用者補充文字、截圖或位置提示。
- 將一次 Import 解析為零筆或多筆 ImportItem。
- 保存結構化候選資料與信心資訊。

解析結果不得直接寫入 TripPlace。

### 3.5 實際地點比對

負責：

- 使用候選名稱、區域、地址與搜尋關鍵字查詢 Places API。
- 回傳包含外部識別碼、名稱、地址與座標的候選 Place。
- 允許使用者重新搜尋及選擇正確結果。

無法匹配外部 Place 時，ImportItem 不能建立 TripPlace。

### 3.6 人工確認與正式收藏

負責：

- 在 Import 處於 `review_required` 時，讓使用者修改候選內容、確認或拒絕 ImportItem。
- 確認時以 Trip 與 Place 檢查是否已有 TripPlace。
- 新地點建立 TripPlace；重複地點只建立新的 TripPlaceSource。
- 對既有內容顯示差異，但不自動覆蓋分類、說明、推薦品項、標籤或備註。

Import 進入 `completed` 後，ImportItem 只作為唯讀處置紀錄。後續若要修改已加入的正式收藏內容，寫入目標必須是 TripPlace，不得透過 ImportItem 編輯流程間接改寫；已拒絕的 ImportItem 不再提供編輯入口。

### 3.7 查詢與呈現

負責：

- 查詢 Trip 的正式收藏地點。
- 為卡片與地圖套用同一份分類篩選條件。
- 只把已確認的 TripPlace 顯示在正式地圖。

MVP 不需要一般關鍵字搜尋。

---

## 4. Server 與 Client 邊界

- 頁面與資料讀取優先使用 Server Components。
- 身分驗證、所有權檢查、資料存取、外部服務憑證與寫入操作留在 Server 端。
- 只有需要瀏覽器 API 或即時互動的部分使用 Client Components，例如地圖互動、檔案選擇、分享接收後的互動表單及分類篩選控制。
- 不得因單一互動元件把整個頁面轉成 Client Component。
- 敏感金鑰、OAuth secret、AI 憑證與 Places API 私密設定不得送至 Client 或寫入程式碼。

實作任何 Next.js API、檔案慣例或快取行為前，必須依 `AGENTS.md` 查閱已安裝版本的相關文件。

### 4.1 專案資料夾結構

資料夾配置同時決定了 Server 與 Client 元件的落點：`app/` 內的頁面預設為 Server Component，需要瀏覽器互動的元件放在 `components/` 並自行標註 `use client`。

```text
src/
├─ app/            App Router：頁面、layout、Route Handlers
├─ components/     跨畫面共用的 UI 元件
├─ lib/            共用工具與資料存取
│  └─ mock/        開發期間的假資料；接上真實資料存取後整包移除
├─ types/          跨模組共用型別
└─ styles/         globals.css 單一入口 + tokens/
```

規則：

- **檔名採 kebab-case，元件名採 PascalCase**，與 `src/app/layout.tsx` 的既有慣例一致。
- **單元測試與被測檔案 colocate**（`*.test.tsx` 放在同一層）；E2E 集中於頂層 `e2e/`（`*.spec.ts`）。此分工由 `vitest.config.mts` 的 `include` 與 `playwright.config.ts` 的 `testDir` 強制。
- **元件不得相依 `lib/mock/`**。共用型別放 `types/`，讓元件與假資料解耦，之後替換資料來源不需要改元件。
- **目錄依實際需要建立，不預先開空目錄。** 需要跨功能領域的分區時（例如 `modules/`）另行提出並更新本節。

`src/app/` 內的路由對應 §10 的規劃路由。`/` 以 `redirect()` 導向 `/trips`；登入狀態的判斷待 Auth 方案定案後再加入。

---

## 5. 資料模型與所有權

### 5.1 關係

```text
User 1 ── * Trip
Trip 1 ── * Import
Import 1 ── * ImportItem
ImportItem * ── 0..1 Place
Trip 1 ── * TripPlace
Place 1 ── * TripPlace
TripPlace 1 ── * TripPlaceSource
Import 1 ── * TripPlaceSource
```

### 5.2 實體責任

- `User`：應用程式使用者身分，對應已驗證的 Google 帳號。
- `Trip`：使用者擁有的旅行收藏容器，保存建立時指派、之後不再變更的視覺樣式標記。
- `Import`：一次單篇來源匯入及其整體處理狀態。
- `ImportItem`：單一候選地點及其確認結果。
- `Place`：外部地點服務中的實際地點；不直接表示收藏所有權。
- `TripPlace`：某 Trip 對某 Place 的正式收藏與旅行收藏專屬內容。
- `TripPlaceSource`：TripPlace 與來源 Import 的關聯。

### 5.3 不變條件

- 每個 Trip、Import 與 TripPlace 都必須能追溯至擁有它的 User。
- Import 必須屬於一個 Trip，且兩者擁有者相同。
- TripPlace 必須屬於一個 Trip。
- 同一 Trip 與 Place 的組合必須唯一。
- TripPlaceSource 只能連結同一 Trip 範圍內的 TripPlace 與 Import。
- 未確認或未匹配 Place 的 ImportItem 不得產生 TripPlace。

實際欄位、主鍵、索引、約束語法與資料庫層授權方式，需在資料庫方案決定後補充。

---

## 6. 匯入狀態與流程

### 6.1 Import 狀態

```text
received
   │
   ▼
processing ──技術錯誤──▶ failed
   │                         │
   ├──資料不足／零候選──▶ needs_input
   │                         │
   └──產生候選──────────▶ review_required
                             │
                             └──全部確認或拒絕──▶ completed

failed / needs_input ──重新嘗試──▶ processing
needs_input ──使用者結束零候選匯入──▶ completed
```

`completed` 是 Import 的處理終態，不代表每個 ImportItem 都已成為正式收藏。

`completed` 不得轉回 `processing` 或其他非終態，也不得變更其目標 Trip。再次分析相同或不同來源網址時，匯入接收邊界必須建立新的 Import。

### 6.2 ImportItem 處置

- 每筆候選項目獨立保持待確認、被確認或被拒絕。
- 使用者確認時必須選定外部 Place。
- 只要仍有一筆候選未處置，Import 就維持 `review_required`。
- 批次確認只能接收屬於同一 Import、已匹配 Place 且尚未處置的 ImportItem；Server 必須逐筆驗證所有權、Import 歸屬、匹配狀態與處置狀態，不得信任 Client 計算的批次數量。
- 已確認、已拒絕或尚未匹配 Place 的 ImportItem 不得進入批次確認集合。
- 批次確認必須逐項產生成功或失敗結果。成功項目的 ImportItem、TripPlace 與 TripPlaceSource 寫入完成後不得因同批其他項目失敗而回滾；失敗項目不得標示為已確認，並維持可重試狀態。
- 批次回應必須讓 Client 能將成功項目更新為已加入，並對每個失敗項目呈現可理解的原因。只要仍有尚未處置項目，Import 就維持 `review_required`。
- 重新處理不得未經使用者同意覆蓋已確認的正式收藏內容。
- Import 進入 `completed` 後，不得再修改、重新匹配、確認、拒絕或重新處理其 ImportItem。已確認項目的正式收藏內容只能透過 TripPlace 的編輯邊界修改；該修改不改變原 ImportItem 的處置紀錄。

具體狀態欄位、單一 ImportItem 的原子寫入邊界、批次協調方式、併發控制與重試冪等策略仍待資料庫及背景任務方案決定；無論採用何種實作，都必須維持上述部分成功的對外語意。

---

## 7. 去重與更新責任

1. 使用者確認 ImportItem 後，以外部地點身分尋找 Place。
2. 以 `(Trip, Place)` 判斷是否已有正式收藏。
3. 若不存在，建立 TripPlace 與 TripPlaceSource。
4. 若已存在，只新增尚未存在的 TripPlaceSource。
5. 新解析資料只能作為更新候選；使用者明確選擇後才能改寫既有內容。

資料庫方案決定後，必須以唯一約束或等效的原子機制保證 `(Trip, Place)` 與來源關聯不重複，不能只依賴 UI 檢查。

---

## 8. 刪除與資料生命週期

刪除 Trip 前必須取得使用者確認並驗證所有權。刪除範圍包含：

- 該 Trip 的 Import 與 ImportItem。
- 該 Trip 上傳的補充截圖或其他附件。
- 該 Trip 的 TripPlace 與 TripPlaceSource。
- 該 Trip 本身。

Place 代表外部實際地點，可能被其他 Trip 參照，不隨單一 Trip 直接刪除。無引用 Place 是否清理，以及來源快照與截圖的保存期限，需在儲存方案確定後決定。

---

## 9. 平台與入口

### 9.1 Web

- 支援桌面瀏覽器、Android 手機瀏覽器與 iPhone Safari 的核心操作。
- 具體瀏覽器版本矩陣尚未指定。

### 9.2 Android PWA

- 必須具備可安裝所需的 Web App 設定。
- 必須提供 Web Share Target 接收網址或文字。
- Share Target 只建立或預填匯入，不得把收到 payload 視為已成功解析。
- PWA 安裝不等於完整離線支援；離線地圖不在 MVP。

### 9.3 iOS

- 使用 Safari Web 流程手動貼上單篇連結。
- 不建立原生 App 或 Share Extension。

---

## 10. 規劃路由

以下路由對應 MVP 核心能力，實際 Next.js 檔案結構須依已安裝版本文件確認：

```text
/login
/trips
/trips/new
/trips/:tripId
/trips/:tripId/map
/imports
/imports/:importId/review
/imports/:importId/items/:itemId/edit
/share
```

路由可以在實作規劃時調整，但不得刪除對應的登入、旅行收藏、匯入、確認、卡片、地圖與分享能力。

`/imports/:importId/items/:itemId/edit` 只服務尚在 `review_required` 的候選編輯。Import 進入 `completed` 後不得再進入此路由；已加入地點的後續修改必須使用 TripPlace 的正式收藏編輯邊界，其路由與畫面不在本次 Import Screen 設計範圍，尚未於本文件定案。

---

## 11. 錯誤與可觀察狀態

- 外部來源、AI、Places 與儲存操作失敗時，不得回報成功。
- 非 Instagram 網址或不支援的 Instagram 路徑屬於來源格式錯誤，不建立 Import；已通過格式驗證但無法取得內容時，Import 進入 `needs_input` 並提供手動補充流程，不得回報為格式錯誤。
- 使用者可看到 Import 目前狀態、可理解的失敗原因及下一步。
- 可重試錯誤與不可繼續錯誤的技術分類，待整合方案確定後補充。
- Log 與錯誤資訊不得包含 OAuth secret、API key、Session token 或不必要的私人來源內容。

---

## 12. 架構完成條件

在開始依賴特定外部服務的實作前，相關未決項目必須先由使用者確認並更新本文件。架構文件不得以候選方案、現有套件猜測或 Agent 偏好取代正式決策。

完成實作仍以 `docs/MVP.md` 的全部適用驗收條件為準；單一核心流程可運作不代表 MVP 已完成。
