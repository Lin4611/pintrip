# PinTrip — 已定案決定（勿在未經確認下變更）

## Source of truth 優先順序

依問題類型判斷來源，**不用單一全域順序**；不要從低順位反推規格。

**產品行為與驗收條件**：1. `docs/MVP.md` → 2. `docs/ARCHITECTURE.md`

**Import 畫面與互動**：1. 對話中明確標示為「已確認」的決定 → 2. `ImportScreen.dc.html` → 3. Design System 中確實適用的共用元件與 token

**Home 畫面與互動**：1. `HomeScreen.dc.html` → 2. Design System

**共用視覺與 App Shell**：1. `HomeScreen.dc.html` 的 App Shell／BottomNav／safe area／響應式框架 → 2. Design System

`CLAUDE.md`（本檔）記錄跨畫面的已定案決定。`MvpMockups.dc.html` **僅早期 visual reference，不是規格依據**，不得用來推導或覆蓋正式規則。設計檔不得凌駕 `docs/MVP.md` 與 `docs/ARCHITECTURE.md`；既有設計檔與這兩份文件衝突時，修改的是設計檔。

## App Shell：BottomNav 兩格、無 FAB（2026-08-30 確認）

- BottomNav 固定兩格等寬：**旅行收藏**與**匯入**，中央不再有 ＋ 按鈕，兩格之間不留缺口。
- HomeScreen、ImportScreen 與 NewTripScreen 共用同一個 shell，三張稿一致；nav 上緣不再有任何凸出物。
- 頁面以 `showFab={false}` 傳入 BottomNav；`fabOffset`（-14px）的 CSS 覆寫已一併移除。
- **不從 Design System 移除** `FabButton`、`--fab-size`、`--shadow-fab`、`--ease-spring` — PinTrip 只是不再使用。
- Home 新增旅行收藏的入口只剩列表最後的 Start New Trip 卡。
- ImportScreen 內容底部留白由 **72px → 32px**：舊值是為了閃過上凸 14px 的 FAB（72 − 14 ＝ 距 FAB 頂端 58px），FAB 移除後只需 CTA 與 nav 之間的呼吸，取 2× 卡片間距。已於 360／390／430 × Success／Batch partial failure／Extreme 共 9 組捲到底實測：CTA 下緣距 nav 上緣 32px、完整可見、水平溢出 0px。

## Design System 本地修改（需回寫 DS 元件原始碼）

`_ds/…/_ds_bundle.js` 目前帶有四處本地修改，屬元件責任而非頁面覆寫：

- `Button` — 新增 `ariaLabel` / `ariaDescribedby` 透傳。
- `BottomNav` — 新增 `showFab`（預設 `true`，PinTrip 三張稿傳 `false`）。
- `PlaceResultCard` — 新增 `readOnly` + `dispositionLabel`（completed 的唯讀處置列）、`failed` + `failureText` + `failureId` + `failureLabel`（批次失敗提示區）、`adding`（重試 loading）、`editAriaLabel` / `rejectAriaLabel` / `addAriaLabel`、`onRetry`。
- `CategoryBadge` / `PlaceResultCard` — `KINDS` 與 `TAG_TONE` 對齊 MVP 固定五分類：`shop` → `shopping`、移除 `stay`、新增 `other`（底色 `--ink-400` 暖灰，不沿用任何既有 kind）。原本 `shopping` 與 `other` 會靜默 fallback 成 `cafe` 的珊瑚色。

## Home Screen 素材（2026-08-26 確認，2026-08-27 校正敘述）

**檔案狀態**：`HomeScreen.dc.html`、`assets/` 目前為定稿，未經指示不得再修改 layout、decorations 或 assets。

**照片**
- Clean source：`uploads/tokyo-clean.jpg`（2179×3371）、`uploads/kyoto-clean.jpg`（4000×6000）— 原始上傳，永不覆蓋。
- 輸出：`assets/photos/trip-{tokyo,kyoto}-clean{,-2x,-3x}.jpg`，正方 200／400／600，皆由原圖真實縮小。
- 檔名的 `@2x` 會被 pipeline 正規化為 `-2x`，命名以 `-2x` / `-3x` 為準。
- **色溫維持原始**：不調色、不加濾鏡、不用生成式改變照片。

**舊素材**
- `assets/photos/trip-tokyo.png`、`trip-kyoto.png`（309×315／318×315，裝飾已壓平）保留為 Before／After 對照用，不刪除、不覆蓋、不從中抽取裝飾、不用於產生 2x／3x。

## Home decoration presets（已定案）

四組固定 Preset，名稱與素材都與目的地無關。**每張 Trip Collection Card 有且只有一條 paper tape。** 完整規格（尺寸、位移、角度、opacity、z、blend）以 `HomeScreen.dc.html` 的 DECORATION PRESETS 與 PRESET ASSIGNMENT 兩張卡為準。

| Preset | 內容 |
|---|---|
| A — Coral Journey | 珊瑚實色膠帶 + `trip-decoration-postmark-generic.png`（60×60、opacity .88、multiply） |
| B — Lavender Botanical | 點點膠帶 + `trip-kyoto-decoration-lavender.png`（74×90、opacity 1）+ `trip-kyoto-decoration-wash.png`（84×38、**opacity .55**、僅作貼紙襯底） |
| C — Grid Scrapbook | 格紋膠帶，無大型貼紙；**同時是 fallback** |
| D — Butter Mail | butter 膠帶 + `sticker-envelope.png`（44×37） |

**分配規則**
- 收藏集**建立當下**從 A／B／C／D 等機率抽一組**完整 preset** 並持久化，之後永久沿用。
- **不得依 card index、render order 或每次 render 隨機**；排序、刪除、reload、重開 App、切換 viewport 後都必須不變。
- 舊資料沒有 preset 欄位時 **fallback C（Grid Scrapbook）**，不重抽、不變成無裝飾。
- 不依目的地挑 preset；MVP 不提供使用者挑選／更換／關閉裝飾的入口。
- `trip-tokyo-decoration-paperclip.png`、`trip-tokyo-decoration-stamp.png`：素材保留不刪除，但**目前不屬於任何 preset，也不進分配池**（paperclip 與 paper tape 重複表達「固定照片」；stamp 是 destination-specific 參考素材）。
- lavender 貼紙為手繪近似，已接受並繼續使用。

**視覺身份一致性**
- 同一個 Trip Collection 在 360／390／430 frame、Long list、Extreme content 示範中必須使用相同照片與相同 preset。
- 本頁 handoff 以 `data-decor-preset="A|B|C|D"` 標記每組裝飾的第一個節點，僅供對照，不是產品屬性。

## Import decoration mapping（已定案）

依 `category` 固定，**不依 index、不依 render order、不依序輪替**：

| category | tape | mark |
|---|---|---|
| `cafe` | 藍格紋 | `place-mark-heart.png`（珊瑚） |
| `food` | butter | `place-mark-star.png`（黃） |
| `attraction` | lavender 點點 | `place-mark-flower.png`（紫） |
| `shopping` / `other` | butter | 無 mark |

- 同一筆 Place Result 在排序、Added 狀態、三個 viewport 與所有 state 下維持相同裝飾。
- Nature 只是照片內容描述，不是 category；城山日出峰為 `attraction`。
- 三個 mark 維持三個獨立透明 PNG，但 UI 只有一個共用 mark slot（`PlaceResultCard` 的 `markSrc`）：variant heart／star／flower、size 20、`aria-hidden`、`pointer-events:none`、absolute 不參與文件流。

## Import place photos（已定案）

- Clean source：`uploads/place-{cafe,food,nature}-jeju-clean.jpg`（4032×3024／5472×3648／8064×6048）— 原始上傳，永不覆蓋。
- 輸出：`assets/photos/place-{cafe,food,nature}-jeju-clean{,-2x,-3x}.jpg`，132×150／264×300／396×450，1x／2x／3x 共用同一個 crop 與 focal point。
- 只做 crop／resize／object-position；不調色、不使用 generative fill。照片本身不含 paper frame、tape、stamp、sticker、corner decoration 或文字。
- 舊 `place-{cafe,food,nature}-jeju.png` 保留作 handoff 對照，不出現在任何手機 state。

## 用語

- **沒有獨立的 `PhotoFrame` 元件。** 結果卡的白框是 `PlaceResultCard` 內建的 photo frame／photo treatment（5px 白框 + r6 + sticker shadow）。撰寫 component tree 時不要暗示它是可獨立引用的元件。

## Import 來源與生命週期（2026-08-28 確認）

- **URL 支援格式｜FINAL** — Instagram 一般貼文 `instagram.com/p/…` 與 Reel `instagram.com/reel/…`（`docs/MVP.md` §5.3、`docs/ARCHITECTURE.md` 決策表）。只有「非 Instagram 網址／非 /p/ 或 /reel/ 路徑／格式不完整」算 invalid。**合法網址因私人帳號、需要登入、內容已移除、存取限制或讀不到 caption 而失敗時，不得顯示為 invalid**，必須建立 Import 並進入 `needs_input` 引導補充。Reel 優先使用可取得的 caption／Share Target 文字／分享附帶文字，MVP 不要求取得或分析影片本身。
- **來源 URL 的可編輯邊界｜FINAL** — URL 只有在**尚未建立 Import 的 composer 階段**可編輯（`LinkInputSection`）。Import 進入 `received` 之後的所有狀態，來源一律以唯讀 `SourceRow` 呈現：不用可編輯 input、不顯示 Clear、不可改寫本筆 Import 的 URL。要分析其他網址＝離開目前 Import，建立另一筆。
- **`ResumeSummaryRow` 只在 entry=resume 出現** — entry=new 的持久狀態（received／processing／review_required／completed 停留）只有 SourceRow，不顯示「N 天前匯入」這類回訪語。
- **completed 唯讀｜FINAL** — `completed` 是處理終態：不可重開、不可回 `processing`、不可重新分析本筆、不可更換目標收藏、不可補充資料、不可重新搜尋、不可再次結束處理、不顯示 Batch CTA。`ImportItem` 是唯讀處置紀錄，**卡內動作列整條移除**換成靜態處置標示（不是把按鈕設成 disabled 留在畫面上）。已加入地點的內容修改對象是 `TripPlace`，其路由與畫面 OUT OF SCOPE，不得在 Import 畫面自行發明 modal／sheet／新頁。
- **全部處置完即 completed** — 因此 `BatchAddPanel` 只存在於 `review_required`；舊作法「Batch 面板改完成語」已作廢，改由 `CompletedSummaryCard` 承接。All added／All processed／All rejected 三個 UI variant 都對應 lifecycle `completed`。
- **批次加入採部分成功｜FINAL（對外行為）** — 成功項目立即保留為已加入且**不回滾**；失敗項目維持尚未處置、不得顯示為已加入、可單獨重試；Import 維持 `review_required`。批次數量必須由「已匹配實際 Place 且尚未處置」推導，不得使用候選總數。內部交易、批次協調、併發控制與冪等策略不在設計端定案。
- **UI variant ≠ 資料狀態** — 正式 Import lifecycle 只有 `received`／`processing`／`needs_input`／`review_required`／`completed`／`failed`。Batch partial failure、All processed、Reel URL 等名稱都只是畫面變體，不得存成新的資料狀態。
- **Places 候選數量｜OPEN** — 設計檔裡的 3 筆候選只是測試資料，不是產品或 API 上限，待 Places API 與搜尋策略決定後重新檢視。與「每筆匯入最多**選取** 3 張補充截圖」（已定案）無關。

## 建立／編輯旅行收藏表單（2026-08-30 確認）

檔案：`NewTripScreen.dc.html`（路由 `/trips/new`）。

- 欄位依 `docs/MVP.md` §5.2 只有三個：**收藏名稱（必填）**、目的地名稱（選填）、收藏說明（選填）。**不得加入日期、行程、封面照片選擇或裝飾挑選**。
- 同一份表單版式同時服務「建立」與「重新命名／編輯收藏」，差異只有三處：畫面標題、CTA 文案、初始值。實作為一個元件 + `mode: 'create' | 'edit'` + `initialValues`，不複製成兩支表單。
- 送出條件：名稱 trim 後非空。CTA 用**原生 `disabled`**（45%、不變色、不移位），名稱欄下方一句 `role="status"` 提示，CTA 以 `aria-describedby` 指向它。
- 字數上限尚未決定：不設 `maxlength`、不顯示計數器。輸入中過長名稱在 input 內**水平捲動**（不 ellipsis）；截字是顯示面（TripCard line-clamp 2、目標收藏列 ellipsis）的責任。
- 刪除收藏**不在**這張表單，入口仍是 Home 的 ••• → 畫面層級 sheet。
- **OPEN**：送出後導向何處尚未定案；「編輯模式未變更時是否 disabled」亦未定案，本稿不假設。
- 建立成功的那一刻抽 decoration preset 並持久化；編輯既有收藏不重抽。

## Navigation / 流程狀態

- **目標旅行收藏｜已定案（MVP 第 4 章 · §5.3）** — 目標旅行收藏在建立匯入任務之前就已選定，每筆匯入屬於一位使用者與一個旅行收藏。Import 畫面在貼上連結前即呈現目標旅行收藏並提供「更換」入口；單筆 Add 與 Batch Add 的語意是「確認加入已選定的收藏」，不是選擇要加到哪裡。「更換」所開啟的選擇介面形式（bottom sheet／頁面）仍未確認，只定義入口與 `onChangeTarget` 邊界。**回訪 completed Import 時「更換」必須原生 disabled 且保持原位。**
- Edit Place 的畫面版面仍 **待設計**（路由與欄位已定案，只服務 `review_required`）；**「加入後導向」為 OPEN**（是否跳頁、toast、收藏頁如何更新尚未定案，不得自行決定）；**重新搜尋實際地點為 PENDING DESIGN — required before frontend implementation**，目前只有入口與 `onResearch` 邊界。
- 目前只定義 UI states（Add / Adding / Added / Retry、按鈕的 normal / pressed / disabled / focus-visible）與 callback 邊界（`onEdit`、`onAdd`、`onBatchAdd`），handoff 內任何 navigation 敘述都不視為已定案。

## 破壞性動作確認規則（跨畫面 · 已定案）

**上位依據**：`docs/MVP.md` §3 核心產品原則第 10 條——「破壞性動作執行前必須先確認，並說明影響範圍；該動作不可復原時，必須明確告知不可復原。」以下四條是該原則在設計層的具體化，不是設計端自訂規則。

適用於所有會移除、拒絕或刪除既有內容的動作。

1. **破壞性動作在執行前必須確認**，不得一按即生效。
2. **確認內容必須寫明影響範圍**（參照 `docs/MVP.md` §5.2 刪除旅行收藏的作法）：講清楚這個動作會影響到什麼、影響多少。
3. **若該動作不可復原，確認內容必須寫明不可復原。** 可復原的動作不適用此條，不要硬寫。
4. **破壞性確認中的按鈕角色固定**：確認鍵一律 outline、取消鍵一律 solid 藍，安全選項是視覺較重者。此條**只限破壞性確認**，不是通則——BatchAddPanel 的珊瑚 commit CTA 是 solid 且無取消鍵，不受此條約束。

**確認介面的形式依資訊量選擇，不強制統一：**
- Import 的拒絕候選地點 — 卡內就地確認列（規格見 `ImportScreen.dc.html`）。
- Home 的 TripCard「•••」→ 刪除旅行收藏 — 同樣適用上述四條，但因必須列出「N 個地點會一起刪除」，資訊量超過卡內一列，**採畫面層級 sheet 而非卡內就地確認**。實際設計另案處理，本次未設計。

## 圖片格式
- Design Handoff 只維護 1x／2x／3x JPG + 透明 decoration PNG。
- 不在 handoff 產出 WebP／AVIF — 由前端建置流程決定，避免維護重複格式。

## 通則
- MVP 範圍固定為 Trips／Add／Imports，不擴充。
- 不使用 generative inpainting 補圖，不放大低解析素材冒充高解析版本。
