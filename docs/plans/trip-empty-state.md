# Implementation Plan — 0 個地點的旅行收藏卡片與圖示資產修正

- 分支：`feature/trip-create-form`（沿用，未推送、未開 PR）
- 建立日期：2026-09-06
- 依據：`docs/MVP.md` §5.2／§10.2、`docs/design/claude-design-export/HomeScreen.dc.html`「EMPTY TRIP CARD（0 個地點）」、`_ds_bundle.js` 的 `TripCard`、`CLAUDE.md`「圖示修正（2026-09-06）」

## Goal

1. 讓收藏內沒有任何地點時，列表卡片能正確呈現該狀態——照片欄換成佔位並說明尚未有地點。
2. 把重新匯出的三張圖示與新增的迴紋針素材同步到 `public/design-assets/`，修好返回鍵箭頭的偏移與白底、以及地點行圖釘的多餘留白。

兩件事合在同一支的理由：都源自同一次設計重匯出，資產同步是 0 地點卡片能正確顯示的前提（迴紋針是新素材）。

## Expected Behavior

- 收藏列表中，`placeCount === 0` 的卡片右側不再是照片，而是點格紙佔位：上緣夾一枚迴紋針，左下兩行文字「還沒有地點／從貼文匯入後會出現在這裡」。
- 卡片其餘部分（標題、目的地列、說明、虛線分隔、計數行、裝飾 preset）與有照片的卡片完全一致，版面不位移。
- 計數行仍顯示「0 個地點」，數字仍是藍色粗體。
- 佔位不可點；整張卡片仍是單一可點區，點擊打開該收藏。
- 新增／編輯收藏頁左上角的返回箭頭在按鈕內置中，不再左偏，且不再有白色方塊底。
- 收藏卡片地點行的圖釘與目的地文字之間的間距回到設計值。

## Acceptance Criteria

- **A1** `placeCount === 0` 時，照片欄 render 佔位而非 `next/image`；`photoSrc` 未提供也不拋錯。
- **A2** 佔位只有三個元素：點格紙底、迴紋針、兩行文字。無邊框（虛線與實線都沒有）、無第二張貼紙、無膠帶、不使用 `worldmap.png`。
- **A3** 佔位的尺寸與位置與有照片時完全一致：寬 148／172／196 隨斷點、`min-height: 161`、`align-self: stretch`、`--r-md` 圓角，且**不加 `aspect-ratio`**。
- **A4** 迴紋針寬 17px（高自動），`top: -8`、`right: 32`、`rotate(4deg)`、`drop-shadow(0 2px 4px rgba(122,96,58,.16))`，上段跨出佔位上緣且**不被裁切**。
- **A5** 迴紋針是純裝飾：`alt=""` + `aria-hidden` + `pointer-events: none`，不可聚焦、不出現在無障礙樹。
- **A6** 兩行文字錨在左下（`left: 13`、`right: 11`、`bottom: 14`），左對齊，`gap: 1`，兩行 `line-height: 1.5`，且分兩級：第一行 12px／semibold／**`--ink-700`**，第二行 11.5px／regular／**`--ink-500`**（見「已裁定的決定」#1，較設計稿各上推一階以符合 AA）。
- **A7** 計數行維持「0 個地點」，數字仍為 `--blue-600` 加粗，**不做特例文案**。
- **A8** 分類貼紙那排在 0 個分類時空著，但保留 `min-height: 27px`，計數文字不因為沒有貼紙而上移。
- **A9** 佔位不新增任何可點目標；卡片仍是單一可點區，`•••` 不巢狀。
- **A10** 照片欄 148／172／196 三個寬度都不撐破卡片、文字不蓋到迴紋針。148 時第二行折成兩行（整體三行）**屬預期**。
- **A11** `/trips/new` 與 `/trips/:tripId/edit` 左上角返回箭頭在 44px 按鈕內置中，且無不透明白底。
- **A12** 收藏卡片地點行的圖釘與目的地文字間距符合設計，不再有圖釘右側的多餘留白。
- **A13** `public/design-assets/` 的 `icons/arrow-back.png`、`icons/flower.png`、`icons/pin-coral.png`、`stickers/trip-decoration-paperclip-generic.png` 與 `docs/design/claude-design-export/assets/` 對應檔案逐位元組相同。

## Test Seams

- **A. `TripCard`（`src/components/trip-card.tsx`）**
  - 可觀察行為：`placeCount === 0`（且無 `photoSrc`）時 render 佔位；有 `photoSrc` 時 render 照片。佔位的文字、裝飾的無障礙屬性、計數行內容。
  - 為何是穩定邊界：它已經是 `trip-collections` 與 `trip-list` 使用的公開元件，本次不新增元件（設計稿明載「不是新元件」），props 形狀只有 `photoSrc` 由必填變選填。
  - 涵蓋情境：0 地點（正常）、有地點（回歸）、0 地點且 0 分類貼紙（邊界）、迴紋針不可聚焦（無障礙）。

- **B. `listTrips()`（`src/lib/mock/trips.ts`）**
  - 可觀察行為：回傳的清單包含一筆 `placeCount: 0` 的收藏。
  - 為何是穩定邊界：`/trips` 頁面唯一的資料來源，已被既有測試使用。
  - 涵蓋情境：0 地點資料存在且欄位完整（無 `photoSrc`、`icons: []`）。

- **C. 收藏列表頁（E2E）**
  - 可觀察行為：實際瀏覽器中 0 地點卡片可見、提示文字可讀、卡片數正確。
  - 為何是穩定邊界：使用者實際看到的畫面。
  - 涵蓋情境：0 地點卡片渲染、刪除流程的卡片計數。

## Test Cases and Passing Criteria

1. **0 地點顯示提示文字** — Red：`TripCard` 收到 `placeCount: 0` 的 trip 時找不到「還沒有地點」。Green：兩行文字都在文件中。
2. **0 地點不 render 照片** — Red：仍然渲染 `img`／`next/image`。Green：佔位存在且沒有照片元素。
3. **有地點時仍 render 照片（回歸）** — Red：照片消失。Green：照片仍在，且沒有提示文字。
4. **迴紋針是純裝飾** — Red：迴紋針出現在無障礙樹或可被 query 到 role。Green：`aria-hidden` 生效，`getByRole('img')` 找不到它。
5. **計數行不特例** — Red：0 地點時文案被改寫。Green：仍是「0 個地點」，數字節點存在。
6. **0 分類時貼紙列仍佔位** — Red：貼紙容器不存在或沒有最小高度。Green：容器存在且帶 `min-height: 27px`。
7. **佔位不可點** — Red：佔位內出現第二個 link／button。Green：卡片內可點元素數量與有照片時相同。
8. **`photoSrc` 選填** — Red：型別或執行期要求 `photoSrc`。Green：不傳 `photoSrc` 也能渲染。
9. **mock 含 0 地點收藏** — Red：`listTrips()` 找不到 `placeCount === 0` 的項目。Green：找得到，且該筆沒有 `photoSrc`、`icons` 為空陣列。
10. **E2E：列表出現 0 地點卡片** — Red：頁面上找不到「還沒有地點」。Green：可見。
11. **E2E：刪除後卡片數正確（回歸）** — Red：既有斷言 `toHaveCount(1)` 因為多一張卡而失敗。Green：更新為正確張數後通過。

## Out of Scope

- **接上建立收藏流程**（`/trips/new` 的 `onSubmit` 仍未接）。本次只讓 0 地點卡片能正確顯示；真正產生 0 地點收藏是下一支。
- `photoSrc` 由 TripPlace 推導。TripPlace 未實作，`photoSrc` 仍是佔位欄位。
- 其餘仍為不透明 PNG 的資產：`heart-outline`／`pencil`／`pin-blue`／`note-paper`／`sticker-envelope`／`sticker-sparkles`／`worldmap`（`CLAUDE.md` 已列出，未測偏移）。
- `status-bar.png`：依使用者指示不修（它是狀態列整條截圖，置中會移動列內時間與電量位置）。
- 卡片高度齊一化。0 地點卡 183px、三枚貼紙的卡 195.6px 是既有的 `flex-wrap` 行為，設計稿明訂不為此更動。
- `/trips/:tripId` 收藏詳細頁、`/imports` 完整畫面。

## Files to Inspect

**設計規則（先讀）**

- `.agents/skills/pintrip-design/SKILL.md` —— 來源優先順序（依問題類型決定，不是單一清單）、design-to-code 規則、最後的 Visual QA checklist
- `.agents/skills/pintrip-design/references/components.md` —— `TripCard` 的 props（含 `empty` / `emptyHint` / `emptyStickerSrc`）、footer 的 `min-height: 27px`、decoration preset 系統與迴紋針素材的定位
- `.agents/skills/pintrip-design/references/screens.md` —— Home 的版面數值、響應式規則、UI states（含「0 places」列，明寫它不是 Empty）
- 需要 token、字級或無障礙細節時再讀 `references/design-system.md`、`references/accessibility.md`；不必全部讀完

skill 是規則的索引，不是來源的替代品。**確切數值一律以下列來源檔為準。**

**設計來源**

- `docs/design/claude-design-export/HomeScreen.dc.html`（EMPTY TRIP CARD 段）
- `docs/design/claude-design-export/_ds/pintrip-design-system-*/_ds_bundle.js`（`TripCard`）
- `docs/design/claude-design-export/CLAUDE.md`（圖示修正、TripCard 0 個地點狀態）
- `src/components/trip-card.tsx`
- `src/components/trip-card.test.tsx`
- `src/types/trip.ts`
- `src/lib/mock/trips.ts`
- `src/styles/tokens/_colors.css`
- `e2e/trip-delete.spec.ts`

## Planned Changes

- `src/types/trip.ts` — `photoSrc` 由必填改為選填；更新註解說明 0 地點時不提供。
- `src/components/trip-card.tsx` —
  - 照片欄依 `placeCount === 0` 分支：0 時 render 佔位，否則維持 `next/image`。
  - **佔位分支不套 `overflow-hidden`**：該 class 原本只為了裁切 `next/image` 的圓角；留著會把迴紋針的 `top:-8` 切掉。佔位自帶 `rounded-md`，沒有要裁切的內容。
  - 分類貼紙那排補 `min-h-[27px]`。
  - 提示文字套 `text-wrap: balance`（見「已裁定的決定」#3）。
- `src/components/trip-card.test.tsx` — 新增測試 1–8。
- `src/styles/tokens/_colors.css` — 新增點格顏色 token（承載 `#E7E0D0`），見「已裁定的決定」#2。
- `src/lib/mock/trips.ts` — 新增一筆 0 地點收藏（沿用設計稿示範資料：濟州／大韓民國／「海岸線、咖啡館與日出峰，慢慢走完一整圈。」／preset C／無 `photoSrc`／`icons: []`），`createdAt` 較 `東京` 新並排在陣列最前（列表依建立時間新到舊，目前由陣列順序表達）。新增測試 9。
- `e2e/trip-delete.spec.ts` — 刪除 `東京` 後剩餘卡片數由 1 改為 2（多了 0 地點的那張）。
- `e2e/trip-empty-state.spec.ts`（新增）— 測試 10。
- `public/design-assets/icons/arrow-back.png`、`flower.png`、`pin-coral.png` — 以匯出版本覆蓋。
- `public/design-assets/stickers/trip-decoration-paperclip-generic.png` — 新增。

**流程規範修正**（使用者已於 2026-09-07 明確授權；見「已裁定的決定」#5）

- `AGENTS.md` — Required Reading 新增一行「UI 實作、修改或審查：`.agents/skills/pintrip-design/`」，並補一段說明：`SKILL.md` 是索引不需全讀、確切數值仍以設計來源檔為準、無法自動載入 Skill 的工具改為直接讀檔且不得因此略過、`.claude/` 另有一份被 `.gitignore` 的副本兩份必須同步。
  **此檔不在本計畫原定範圍內**，屬使用者授權的範圍擴充，於此明列以供審查。

**Skill 修正**（使用者已於 2026-09-07 明確授權）

這個 skill 在專案裡有**兩份副本**，改前內容一致（已以 md5 驗證）：

- `.agents/skills/pintrip-design/` — **有進 Git 版控**，Codex 與 Gemini 從這裡讀取。**這份是正規來源**，diff 用一般 `git diff` 即可。
- `.claude/skills/pintrip-design/` — 被 `.gitignore` 第 55 行忽略，Claude Code 從這裡讀取。

兩份都要套用相同修改，否則不同工具會讀到不同規則。修改內容：

- `references/components.md` —
  (a) `TripCard` 補上 `empty` / `emptyHint` / `emptyStickerSrc` 與 footer 的 `min-height: 27px`（含「這不是讓卡片同高」的說明）；
  (b) 迴紋針那條原本寫「未經產品決定不得接上」，現在已有決定且已指定用途，改為「仍不屬於任何 preset、不進分配池，但已是 0 地點佔位專用」，並把 stamp 拆成獨立一條維持原狀。
- `references/screens.md` — Home 的 UI states 表新增「0 places」一列，並明寫**它不是 Empty**（Empty 指一個收藏都沒有）。
- `SKILL.md` — **不修改**。「不得用來發明 design 沒定義的狀態」依然成立，該狀態現在有定義。

`src/components/app-header.tsx`、`src/app/trips/new/page.tsx`、`src/app/trips/[tripId]/edit/page.tsx` **不需修改**：返回鍵的 CSS 與設計系統 `IconButton` 逐項一致（`size=44`、`width: size*0.45`、`justify-content:center`），偏移的成因在圖檔，換檔即修好。

## Validation Plan

| 驗收條件 | 驗證方式 |
|---|---|
| A1、A2、A6、A7 | 測試 1／2／5 |
| A3 | 測試 2 ＋ 瀏覽器實測三個寬度 |
| A4 | 瀏覽器實測（迴紋針未被裁切） |
| A5 | 測試 4 |
| A8 | 測試 6 |
| A9 | 測試 7 |
| A10 | 瀏覽器實測 360／390／430 |
| A11、A12 | 逐像素量測腳本 ＋ 瀏覽器截圖 |
| A13 | `md5sum` 逐檔比對 |
| 回歸 | 測試 3、11 ＋ `npm test` 全綠 ＋ Playwright 全綠 |

逐像素量測會重跑本次已用過的腳本（解 PNG、計算不透明區域的 bounding box 與置中偏移），把改前改後的數字一併記入 Developer Report，不以「看起來對了」作為證據。

## Review Plan

- 交付 diff、`npm test` 與 Playwright 的實際輸出、三個寬度的截圖、圖示量測數字。
- 依 `docs/CODE_REVIEW.md` 送審；未取得 `APPROVED` 前不宣稱完成，也不進入 Git 寫入流程。
- 本支分支先前已就建立／編輯表單取得 `APPROVED`；**本次新增的修改不在該次核准範圍內**，需重新複審。

## 已裁定的決定（2026-09-06，使用者逐項確認）

1. **文字對比往上推一階。** 設計稿實作的 `--ink-500`（3.9:1）／`--ink-400`（3.4:1）低於 AA 4.5:1；改用 `--ink-700`（#3B3B3D，9.7:1）／`--ink-500`，版面完全不動、層次仍是兩級。**這是設計稿自己在同一列提供的替代方案**，非本計畫自創。

2. **點格顏色收成 token。** `#E7E0D0` 不在 `src/styles/tokens/` 也不在匯出的 `tokens/*.css`；skill 明訂優先使用 token。新增一個承載它，避免日後調色票時漏掉。

3. **提示文字採用 `text-wrap: balance`。** 使用者裁定「符合通用開發方式就做」。它是為短文字區塊避免末行孤字而設計的標準屬性，Chrome／Safari／Firefox 自 2023–2024 起支援，不支援的瀏覽器照常斷行（漸進增強）。**不改文案、不改字級**，設計稿禁止的兩件事都沒碰，只影響斷行位置。仍記入偏離（見 D2）。

4. **mock 新增 0 地點收藏。** 沿用設計稿示範資料。連動修改 `e2e/trip-delete.spec.ts` 的剩餘卡片數斷言（1 → 2）；那是資料筆數變動的必然結果，非行為變更。

5. **把「UI 任務必須讀 design skill」寫進 `AGENTS.md`。** 查證後確認這條先前**不存在於任何文件**——`AGENTS.md` 只有一處提到 Skill，講的是「使用 Skill 時誰優先」，不是「必須先用」。實際運作一直依賴使用者手動載入：Codex 那次它明確回報「工具清單沒有可呼叫的 Skill 載入工具，我也沒有用檔案讀取替代」，是使用者打 `/pintrip-design` 注入才解決的。工具看得到 skill 不等於 agent 有義務使用它，兩者是不同問題；前者已解決（三個工具都從 `.agents/` 讀得到），後者到此才寫下來。

## 偏離與計畫外的修改

（實作過程中逐項補上；未經使用者確認不得自行擴大。）

- **D1**（預期）佔位分支移除 `overflow-hidden`。理由見 Planned Changes；這是我方實作為了圓角加的 class，設計稿的照片欄容器本身沒有 `overflow:hidden`。
- **D2**（預期）提示文字套 `text-wrap: balance`。設計稿明載 148px 折成三行「屬預期」，本次仍加上均分斷行以收掉末行孤字。**這改變了設計稿已核准的呈現結果**（不改文案、不改字級），依使用者 2026-09-06 的裁定納入。
- **D3**（預期）文字顏色由設計稿實作的 `--ink-500`／`--ink-400` 改為 `--ink-700`／`--ink-500`。依使用者裁定，採用設計稿自己提供的 AA 替代方案。
- **D4**（預期）新增點格顏色 token，不沿用設計稿的硬編碼 `#E7E0D0`。值不變，只是改由 token 承載。

以下三項是**事後補記**：實作者未於當下回報，由交付後的獨立檢查發現。計畫要求「遇到跟計畫不一致時停下來先問」，這三項都沒有停。

- **D5**（事後補記）迴紋針使用原生 `<img>` 搭配 inline `eslint-disable @next/next/no-img-element`，而非 `next/image`。**同一張卡片的裝飾貼紙（`trip-card-slot.tsx`）用的是 `next/image` 並傳入明確 `width`／`height`**，兩者做法不一致。迴紋針來源尺寸已知（84×250），技術上可用 `next/image`。此處保留實作者的選擇不代為更動，交由 Reviewer 判斷。
- **D6**（事後補記）`src/styles/tokens/_colors.css` 新增了**兩個** token：`--color-grid-dot: #e7e0d0` 與別名 `--color-dot-grid: var(--color-grid-dot)`。計畫（已裁定的決定 #2）只要求新增一個。別名目前無任何使用處。
- **D7**（事後補記）`src/lib/mock/trips.ts` 的檔頭註解刪去了原本的「合計 64，對應設計稿的『目前有 2 個旅行收藏 · 64 個地點』」，改為列出三筆地點數。註解與設計稿示範資料的對應關係因此消失。

**另記一項交付後修正**：`e2e/trip-empty-state.spec.ts` 原本把截圖路徑寫死為 `C:/Users/User/.gemini/antigravity-ide/brain/<session-id>/…`——綁定單一機器與單一工具 session，換機器或 CI 必然失敗。已改為 `testInfo.outputPath()`，輸出到 Playwright 既有的 `test-results/`（已在 `.gitignore`）。改後 `npx playwright test e2e/trip-empty-state.spec.ts` 4 passed。

## Known Limitations

- 設計稿的散文在兩處寫「dashed 紙感佔位」，但 `_ds_bundle.js` 與 EMPTY TRIP CARD 段的「刻意沒有的」列都明訂**沒有邊框**（虛線與實線都沒有）。以後者為準；記錄於此避免日後有人依字面補上邊框。
- 設計稿 EMPTY TRIP CARD 段對文字定位同時寫了 `padding 14/13/15 · justify-content:flex-end` 與「絕對定位錨在左下（`left:13` · `right:11` · `bottom:14`）」。`_ds_bundle.js` 實作的是後者（絕對定位），以實作為準。
- 迴紋針的 `drop-shadow` 在同一列被寫了兩次（`.16` 與 `.14`）。`_ds_bundle.js` 實作的是 `.16`，以實作為準。
- 0 地點卡片 183px、三枚貼紙的卡片 195.6px。設計稿明訂這是既有的 `flex-wrap` 行為、不為此狀態更動。
