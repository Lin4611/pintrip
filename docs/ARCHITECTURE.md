# PinTrip MVP 架構

## 0. 文件狀態

- 專案名稱：PinTrip
- 文件用途：定義 MVP 的系統邊界、元件責任、資料關係、處理流程與技術決策狀態
- 最後更新：2026-07-30

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

「Google 登入已決定」只代表使用者登入方式；具體 Auth 套件、Session 儲存與 OAuth 設定仍未決定。

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
| UI 元件庫 | 不得自行安裝或替換 |
| Client 狀態管理 | 優先避免不必要的全域狀態；具體方案未決 |
| 測試框架 | 依既有專案與後續決定，不得自行安裝 |
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

- 驗證手動輸入或 Share Target payload。
- 將匯入綁定目前使用者與目標 Trip。
- 保存原始網址、可取得文字與必要來源快照。
- 建立 `received` 狀態的 Import。

不得假設分享資料一定包含完整貼文內容或圖片。

### 3.4 來源取得與地點解析

負責：

- 嘗試取得允許讀取的來源內容。
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

- 讓使用者修改候選內容、確認或拒絕 ImportItem。
- 確認時以 Trip 與 Place 檢查是否已有 TripPlace。
- 新地點建立 TripPlace；重複地點只建立新的 TripPlaceSource。
- 對既有內容顯示差異，但不自動覆蓋分類、說明、推薦品項或備註。

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
- `Trip`：使用者擁有的旅行收藏容器。
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

### 6.2 ImportItem 處置

- 每筆候選項目獨立保持待確認、被確認或被拒絕。
- 使用者確認時必須選定外部 Place。
- 只要仍有一筆候選未處置，Import 就維持 `review_required`。
- 重新處理不得未經使用者同意覆蓋已確認的正式收藏內容。

具體狀態欄位、交易邊界、併發控制與重試冪等策略仍待資料庫及背景任務方案決定。

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
/share
```

路由可以在實作規劃時調整，但不得刪除對應的登入、旅行收藏、匯入、確認、卡片、地圖與分享能力。

---

## 11. 錯誤與可觀察狀態

- 外部來源、AI、Places 與儲存操作失敗時，不得回報成功。
- 使用者可看到 Import 目前狀態、可理解的失敗原因及下一步。
- 可重試錯誤與不可繼續錯誤的技術分類，待整合方案確定後補充。
- Log 與錯誤資訊不得包含 OAuth secret、API key、Session token 或不必要的私人來源內容。

---

## 12. 架構完成條件

在開始依賴特定外部服務的實作前，相關未決項目必須先由使用者確認並更新本文件。架構文件不得以候選方案、現有套件猜測或 Agent 偏好取代正式決策。

完成實作仍以 `docs/MVP.md` 的全部適用驗收條件為準；單一核心流程可運作不代表 MVP 已完成。
