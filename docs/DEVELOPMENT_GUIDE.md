# PinTrip Development Guide

## 0. 文件狀態

- 專案名稱：PinTrip
- 文件用途：定義 Developer Agent 執行程式與文件修改時的工作方式、實作原則、驗證要求與完成回報
- 最後更新：2026-08-07

本文件只規範開發與驗證流程。

以下內容不在本文件中定義：

- Branch、Commit、Push 與 Pull Request：見 `docs/GIT_WORKFLOW.md`
- Reviewer Sub-agent 的審查流程：見 `docs/CODE_REVIEW.md`
- 產品需求與驗收條件：見 `docs/MVP.md`
- 架構、資料關係與技術邊界：見 `docs/ARCHITECTURE.md`

---

## 1. 開發原則

Developer Agent 必須遵守以下原則：

1. 每次只處理使用者明確指定的任務。
2. 優先進行小範圍、可驗證的修改。
3. 不得順便修改與任務無關的檔案。
4. 不得自行擴大 MVP 功能範圍。
5. 不得將未確認的技術方案當成既定決策。
6. 不得因為未來可能會使用，就提前建立大型抽象層。
7. 不得把尚未完成或尚未驗證的內容描述為完成。
8. 發現規格不足、文件衝突或未知風險時，先停止並回報。

### 1.1 任務狀態

Developer Agent 必須使用符合事實的狀態，不得將流程中的中間結果描述為完成：

- `IN PROGRESS`：仍在限定範圍內理解需求、實作或驗證。
- `WAITING FOR USER`：需要使用者釐清需求、授權、範圍或重大技術決策。停止相關修改，列出問題與恢復條件。
- `BLOCKED`：因環境、權限、外部服務或無法排除的技術條件而無法完成。提供證據、已嘗試項目與解除條件。
- `READY FOR REVIEW`：限定範圍內的修改與可執行驗證已完成，等待 Reviewer，不代表任務完成。
- `REQUEST_CHANGES`：Reviewer 發現阻擋問題。只修正 Reviewer 指出的範圍，完成後重新驗證與交審。
- `APPROVED`：Reviewer 確認沒有阻擋問題，不代表 Agent 取得任何 Git 操作權。
- `COMPLETE`：要求範圍已完成、必要驗證有可信結果、需要的 Reviewer 已核准，並已在最終回報中如實標示完成。
- `STOPPED`：使用者取消或取代任務，或繼續操作必然違反規格、授權或安全規則。除非使用者重新授權或改變要求，否則不得繼續。

`WAITING FOR USER` 與 `BLOCKED` 必須說明恢復工作的明確條件。實作完成、`READY FOR REVIEW`、`APPROVED` 與 `COMPLETE` 是不同狀態。

### 1.2 端到端流程

```text
任務確認
  → 限定範圍與驗收條件
  → 使用者確認 Test Seams、測試案例與通過標準
  → Developer 逐切片執行 Red → Green
  → lint → targeted tests → full tests → build → diff check → manual verification
  → Developer Report（READY FOR REVIEW）
  → Reviewer（必要且可執行時，先取得 code-review Skill 的 Standards／Spec 證據）
      ├─ REQUEST_CHANGES（含必要 Refactor）→ Developer 依阻擋問題修改、重新驗證、更新 Report、重新 Review
      ├─ UNABLE_TO_VERIFY → 補充證據或由使用者決定下一步
      └─ APPROVED → Final Report（COMPLETE）
  → 使用者確認
  → 使用者自行 Commit → Push → Pull Request → Merge
```

Reviewer 未 `APPROVED` 前不得進入 Final Report 的 `COMPLETE` 狀態，也不得進入任何 Git 寫入或發布流程。

---

## 2. 任務類型

開始工作前，先判斷任務類型。

### 2.1 程式修改

包含：

- 新增功能
- 修改既有功能
- 修復錯誤
- 重構
- 新增或修改測試
- 套件或設定調整

必須閱讀：

- `docs/DEVELOPMENT_GUIDE.md`
- 與任務直接相關的產品或架構文件
- 與修改範圍直接相關的現有程式碼

### 2.2 文件修改

包含：

- 修改 `docs/`
- 修改 Agent 規則
- 更新已確認的技術決策
- 修正文件衝突

只閱讀與本次文件直接相關的內容，不為取得一般背景而擴大範圍。

### 2.3 唯讀審查或分析

包含：

- 檢查現有程式
- 分析錯誤原因
- 評估技術方案
- 檢查文件一致性

唯讀任務不得自行修改檔案。

---

## 3. 開始任務前

Developer Agent 在修改前必須：

1. 確認使用者要求與允許修改的範圍。
2. 整理任務目標、明確不在範圍內的事項，以及使用者可觀察的預期行為。
3. 從使用者要求與規範文件整理可逐項驗證的驗收條件、邊界情境與失敗情境。
4. 閱讀必要文件，不擴大閱讀範圍。
5. 查看與任務直接相關的現有程式碼。
6. 確認是否有尚未決定的重大技術項目。
7. 確認預計修改的檔案與每個檔案的修改原因。
8. 以唯讀 Git 指令檢查授權範圍內的工作區狀態與相關 diff，確認目標檔案是否已有未提交修改。
9. 確認修改不會超出 `docs/MVP.md`。
10. 確認修改符合 `docs/ARCHITECTURE.md` 的責任邊界。
11. 將每項驗收條件對應到預計使用的測試或其他驗證方式。
12. 確認預計交給 Reviewer 的證據；任何實際檔案修改都必須 Review。

既有修改一律視為使用者內容，不得覆寫、還原或納入本次成果。無關且不重疊的既有修改可以保留並繼續；若既有修改與本次目標檔案或修改區域重疊，進入 `WAITING FOR USER`，請使用者先自行 Commit 或決定其他處理方式。Developer Agent 不得自行 Commit、Stash、還原或搬移既有修改。

目標檔案未被 Git 追蹤或被忽略時，Git 無法提供可靠的修改前基準，Developer Agent 必須在修改前進入 `WAITING FOR USER`。使用者明確授權後，可以在 Repository 外保存修改前基準，並以 `git diff --no-index` 或等效工具產生替代 diff；Developer Report 必須標示 `Diff Source: NON_GIT_BASELINE`，且不得把替代 diff 描述為 staged 或 committed 狀態。未經授權不得修改 `.gitignore`、執行 `git add -f` 或以其他方式改變追蹤狀態。

若缺少的資訊會影響公開行為、資料、安全、架構、套件或修改範圍，進入 `WAITING FOR USER`，一次只提出一個需要決定的問題。低風險、可逆、不影響公開行為的局部實作細節，可以依現有慣例採取最小合理方案，但必須在計畫中明示，不得默默假設。

開始修改前應先回報：

```md
## Implementation Plan

### Goal
- 本次任務目標

### Expected Behavior
- 使用者或呼叫端可觀察的預期行為

### Acceptance Criteria
- 可逐項驗證的驗收條件

### Test Seams
- 公開介面
  - 可觀察行為
  - 為何是穩定邊界
  - 預計涵蓋的正常、錯誤與邊界情境

### Test Cases and Passing Criteria
- 測試案例
  - Red 時預期的失敗
  - Green 後必須成立的結果

### Out of Scope
- 本次明確不處理的事項

### Files to Inspect
- `path/to/file`

### Planned Changes
- `path/to/file`
  - 預計修改內容

### Validation Plan
- 每項驗收條件對應的測試或檢查

### Review Plan
- 預計交審的 Developer Report、驗證結果與 diff

### Open Questions
- 尚待確認事項
- 若無則填寫 None
```

若使用者只要求小幅、明確且低風險的修改，可以簡化回報，但不得省略待確認事項。需要測試的任務在使用者確認 Test Seams、測試案例與通過標準前，不得撰寫測試或開始實作。

使用者確認的是本次任務的一組 Test Seams，不是每一個 test case。Developer Agent 可以在已確認的 Seam 內增加必要邊界案例；若需要新增 Seam、改變公開介面或改變通過標準，必須進入 `WAITING FOR USER` 並重新取得確認。

---

## 4. 修改範圍

Developer Agent 只能修改：

- 使用者明確指定的檔案。
- 完成任務不可避免需要調整的直接相關檔案。
- 為使本次修改通過驗證所必須修改的檔案。

不得：

- 順便重構無關程式。
- 統一整理整個專案格式。
- 修復未被要求的其他錯誤。
- 刪除看似未使用但尚未確認用途的程式。
- 修改使用者未授權的文件或設定。
- 以「保持一致」為由擴大修改範圍。

發現其他問題時，應記錄在完成報告的 `Additional Findings`，不得直接處理。

若使用者限制檔案範圍，檢查、Git status、diff、Reviewer 與完成回報也必須限制在該範圍。完成驗證需要修改範圍外檔案時，不得把該檔案視為自動獲得授權；應進入 `WAITING FOR USER`。

---

## 5. Next.js 開發規則

PinTrip 使用目前安裝版本的 Next.js App Router。

實作前必須依 `AGENTS.md` 閱讀：

```text
node_modules/next/dist/docs/
```

中與本次任務相關的指南。

不得只依賴模型記憶中的舊版 Next.js 慣例。

基本原則：

- 優先使用 Server Components。
- 只有需要瀏覽器 API、事件處理或即時互動時才使用 `"use client"`。
- 不得因單一互動元件，把整個 Page 或 Layout 改成 Client Component。
- 身分驗證、所有權檢查、敏感資料與外部服務憑證必須留在 Server 端。
- 不得使用與目前 App Router 不相容或已棄用的 API。
- Route、快取與資料取得方式必須依目前安裝版本的文件確認。

---

## 6. 程式碼原則

### 6.1 TypeScript

- 使用明確型別。
- 避免使用 `any`。
- 型別未知時優先使用 `unknown`，並在使用前縮小型別。
- 不得使用 `as any` 逃避型別問題。
- 不得為了通過編譯而加入不安全的型別斷言。
- 模組專用型別應放在該模組範圍內。
- 只有跨模組共用型別才放入共用位置。

### 6.2 元件與函式

- 保持單一責任。
- 使用能表達用途的名稱。
- 優先使用直接、容易驗證的實作。
- 不提前建立尚未使用的共用層。
- 不保留未使用的變數、函式或 Import。
- 不留下無說明的暫時程式碼。
- 不使用註解掩蓋不清楚的邏輯。

### 6.3 錯誤處理

- 不得將失敗結果回報為成功。
- 使用者可預期的錯誤應提供可理解的訊息。
- 外部服務錯誤不得直接洩漏敏感回應。
- 不得吞掉錯誤而沒有紀錄或狀態處理。
- 無法判斷錯誤是否可重試時，標記為待確認。

---

## 7. 檔案與責任放置

檔案位置以 `docs/ARCHITECTURE.md` 為準。

Developer Agent 必須先判斷程式的責任，再選擇位置。

基本原則：

- 路由、頁面與 Layout 放在 `src/app/`。
- 跨功能且不含商業邏輯的 UI 元件放在共用 UI 區域。
- 特定功能的元件、型別與邏輯放在對應模組。
- Server-only 能力不得被 Client Component Import。
- 外部服務整合不得散落在頁面或元件內。
- 不得把所有工具、型別或服務集中堆進單一共用資料夾。
- 不得為單一檔案建立不必要的新資料夾。

若目前架構文件沒有定義合適位置，先回報，不得自行建立新的頂層結構。

---

## 8. 套件與技術選型

目前尚未決定的套件或外部服務，不得由 Developer Agent 自行選擇。

安裝、移除、替換或升級套件前，必須先回報：

```md
## Dependency Proposal

### Package
- 套件名稱與預計版本

### Purpose
- 要解決的問題

### Why Existing Code Is Insufficient
- 現有工具為何無法完成

### Alternatives
- 不安裝套件的替代方式
- 其他候選方案

### Impact
- Bundle、設定、維護與安全影響

### Files Affected
- 預計修改的檔案
```

取得使用者明確同意後才能執行。

### 8.1 必須由使用者確認的重大決策

下列事項若未被使用者要求、產品規格或架構文件指定，Developer Agent 必須進入 `WAITING FOR USER`：

- 安裝、移除、替換或升級套件。
- 新增或更換外部服務。
- 改變公開 API、資料格式或資料模型。
- 選擇 Auth、權限、儲存、快取或敏感資料處理方案。
- 建立新的頂層目錄、跨模組抽象或架構邊界。
- 採用會造成遷移、相容性或長期維護成本的方案。
- 偏離現有產品或架構文件。

局部、低風險、可逆且不影響公開行為的實作細節，可依現有慣例採取最小方案並在 Implementation Plan 明示，不需要逐項詢問。

不得：

- 自行安裝 UI 元件庫。
- 自行選擇資料庫、Auth、AI、地圖或儲存服務。
- 執行 `npm audit fix --force`。
- 為解除 Audit 警告而擅自降級 Next.js。
- 在任務不需要時修改 `package.json` 或 Lockfile。
- 使用 Override 強制替換 Next.js 內部相依套件，除非使用者明確核准。

---

## 9. 資料與安全

開發時至少遵守：

- 不得將 API Key、Token、密碼或 Secret 寫入程式碼。
- 真實環境變數不得寫入 `.env.example`。
- 只有可公開資訊才能使用 `NEXT_PUBLIC_`。
- 所有外部輸入都必須在 Server 端驗證。
- 不信任使用者輸入、分享 Payload、AI 輸出與第三方 API 回傳內容。
- 權限控制不能只靠前端隱藏。
- 所有私人資料操作都必須驗證目前使用者與資料所有權。
- Log 不得記錄完整 Token、Cookie 或不必要的私人來源內容。
- 未確認的安全處理方式不得自行補成看似完整的實作。

---

## 10. 測試與驗證

### 10.1 TDD：Red → Green

新增功能與錯誤修正預設必須採用專案 `.agents/skills/tdd/SKILL.md`。純重構也必須先以既有或新增測試鎖定公開行為。

每次只處理一個已確認 Test Seam 中的垂直切片：

1. **Red**：新增一個因缺少目標行為而失敗的測試，執行並確認失敗原因正確。
2. **Green**：只加入使該測試通過的最小實作，不預作尚未被下一個測試要求的功能。
3. 完成一個切片後，再依前一輪學到的資訊進入下一個 Red。

Refactor 不屬於 Developer 初次交審前的 Red → Green 迴圈。Developer 完成 Green 與正式驗證後先提交 Developer Report，由 Reviewer 在審查階段判斷是否存在需要處理的結構、命名或重複邏輯問題。

Reviewer 不得自行修改受審內容。若 Refactor 為通過審查所必要，Reviewer 必須將理由、影響與限定範圍列為 Blocking Issue，回報 `REQUEST_CHANGES`。Developer 只依該阻擋問題執行 Refactor，不改變公開行為，並重新執行受影響測試與必要驗證後提交更新版 Developer Report，再交由 Reviewer 完整複審。若 Reviewer 判斷不需要 Refactor，直接繼續其他審查，不要求 Developer 為形式進行改碼或記錄 `No refactor needed`。

純文件、無行為的設定修改，或客觀上無法先建立有效測試的任務可以例外。Developer Agent 必須在修改前說明例外原因、替代驗證方式與風險，不得默默略過 TDD，也不得為了形式上的 Red 建立沒有行為價值的測試。

### 10.2 公開行為測試原則

測試應優先透過公開介面驗證可觀察行為，例如：

- 使用者操作與畫面結果。
- 公開函式的輸入與輸出。
- API 的請求、回應與狀態碼。
- 資料操作後可觀察的結果。
- 權限、錯誤與恢復行為。

除非某項內部協作本身就是必要且穩定的契約，測試不得綁定私有函式、內部 state、非必要 DOM 結構、實作步驟或精確呼叫順序。需要測試內部細節時，必須說明該細節為何屬於穩定契約。

測試還必須避免：

- **Implementation-coupled**：Mock 內部協作者、測試私有方法或以旁路觀察內部實作。
- **Tautological**：以和實作相同的計算方式產生預期值，使測試無法獨立發現錯誤。
- **Horizontal slicing**：先批次寫完所有測試，再批次寫實作。應維持一個測試、一個最小實作的垂直切片。

Mock 只用於外部 API、必要的資料庫邊界、時間、隨機性、檔案系統或其他不適合在測試中直接執行的系統邊界。不得 Mock 自己控制的內部模組，也不得以大量 Mock 重現被測模組自身的實作；可行時優先使用 Test Database 或真實公開介面。

### 10.3 程式修改的最低驗證

程式修改完成後，依序執行：

1. `npm run lint`。
2. 與本次行為直接相關的 targeted tests。
3. 專案既有的完整 test script；若不存在，標示 `NOT AVAILABLE`。
4. `npm run build`。
5. `git diff --check`。
6. UI 或互動修改所需的實際頁面與主要狀態檢查。

如果完整測試成本異常高、需要未授權服務或受環境限制，必須先說明原因與風險，不得自行省略。不得以 lint 或 build 通過取代測試，也不得因沒有找到相關測試就宣稱功能已驗證。

任何必要驗證失敗時，不得進入 `READY FOR REVIEW`。Developer Agent 應判斷失敗是否由本次修改造成，並繼續執行其他安全且具有獨立診斷價值的驗證；若後續驗證依賴前一步成功、成本異常高或可能造成副作用，可以停止，但必須說明理由。修正後至少重跑失敗項目與所有可能受修正影響的項目。

不得自行安裝新的測試框架。

### 10.4 驗證結果狀態

每項驗證都必須使用以下其中一種狀態：

- `PASS`：已執行且成功。
- `FAIL`：已執行但失敗。
- `NOT RUN`：可執行但未執行，必須說明原因與交付影響。
- `NOT AVAILABLE`：專案沒有對應指令、測試或環境，必須提供確認依據與風險。

### 10.5 驗證範圍

驗證應涵蓋本次任務適用的情況：

- 正常流程
- 空資料
- 必填資料缺失
- 錯誤輸入
- 權限不足
- 外部服務失敗
- 重新嘗試
- 重複操作
- 既有功能是否受影響

不是所有任務都需要涵蓋全部情境，只需執行與本次修改相關的項目。

### 10.6 UI 修改

UI 或互動修改需要回報：

- 實際檢查的頁面或元件
- 測試的畫面尺寸或裝置情境
- 正常、空白、載入及錯誤狀態是否確認
- 尚未驗證的瀏覽器或互動

不得只以 `npm run build` 通過，宣稱 UI 功能正常。

### 10.7 文件修改

純文件修改不要求執行：

```bash
npm run lint
npm run build
```

應改為檢查：

- Markdown 結構
- 文件間一致性
- 是否引用不存在的文件或路徑
- 是否把未決事項誤寫成已決定
- `git diff --check`

並在完成報告說明未執行程式驗證的原因。

---

## 11. 驗證失敗

若任何驗證失敗，Developer Agent 必須回報：

- 執行的指令
- 錯誤摘要
- 是否可能由本次修改造成
- 已進行的排查
- 尚未確認的原因
- 是否阻擋交付

不得：

- 隱藏失敗。
- 只貼完整錯誤輸出而不整理。
- 為了通過驗證而修改無關檔案。
- 在驗證失敗時宣稱任務完成。

若錯誤明確與本次修改無關，也必須保留證據並標示為既有問題。

---

## 12. Git 權限邊界

Git 寫入與發布由使用者處理。Developer Agent 可以依任務需要執行 `git status`、`git diff`、`git log` 等唯讀檢查，但不得執行：

- 建立或切換 Branch。
- `git add`。
- Commit。
- Push。
- 建立或合併 Pull Request。
- Stash、Reset、Checkout 還原或其他會改變既有工作區狀態的操作。
- 任何破壞性 Git 操作。

Reviewer 的 `APPROVED` 是交付門檻，不是 Git 操作授權。Developer Agent 只能提供狀態、diff、建議 Commit 範圍或 Pull Request 內容，不得從功能實作授權推定 Git 寫入或發布權限。

---

## 13. 停止與阻塞條件

遇到以下情況時，停止相關修改並回報：

- 產品需求與架構文件衝突。
- 使用者要求與現行規格衝突。
- 需要安裝、移除、替換或升級未核准的套件。
- 需要決定目前仍未指定的重大技術方案。
- 必須修改超出授權範圍的檔案。
- 目標檔案或修改區域存在會重疊的既有修改。
- 無法確認資料或責任應放置的位置。
- 驗證方式不足以支持完成聲明。
- 需要破壞性操作才能繼續。
- 發現敏感資料可能被提交或暴露。

需要使用者決定或授權時，狀態設為 `WAITING FOR USER`；因環境、權限或外部條件現階段無法繼續時，狀態設為 `BLOCKED`；使用者取消任務或繼續必然違反規則時，狀態設為 `STOPPED`。

停止後應清楚說明：

1. 目前狀態與卡住的位置。
2. 已確認的事實與證據。
3. 已進行的安全排查。
4. 需要使用者決定或外部改變的事項。
5. 可選方案與主要差異。
6. 恢復工作的明確條件。

---

## 14. Developer Report 與 Reviewer 交接

任何實際檔案修改都必須 Review。Developer Agent 完成限定範圍的修改與所有必要驗證後，停止新增變更，將狀態設為 `READY FOR REVIEW`，並先輸出 Developer Report：

專案 `.agents/skills/code-review/SKILL.md` 是 Reviewer 可使用的雙軸分析工具，只產生彼此分離的 `Standards` 與 `Spec` 證據，不產生 PinTrip 的正式 Reviewer 狀態。該 Skill 需要可解析的 fixed point 與非空 committed diff；Commit 前 working tree 尚不符合其輸入條件時，Reviewer 不得為了執行 Skill 而要求先 Commit，也不得因此略過正式審查。正式 Reviewer 仍須依 `docs/CODE_REVIEW.md` 檢查實際 working tree diff 或經授權的 Non-Git Baseline diff。

````md
## Developer Report

### Task Status
- READY FOR REVIEW

### User Request and Allowed Scope
- 原始需求、已確認決策與核准範圍

### Requirement Coverage
- 驗收條件
  - 對應實作與證據

### Files Changed
- `path/to/file`
  - 修改原因

### Test Seams
- 已由使用者確認的公開介面與可觀察行為

### TDD Evidence
- Red：失敗測試與正確失敗原因
- Green：最小實作與通過結果
- Review-stage Refactor：初次交審填寫 `NOT YET ASSESSED`；若 Reviewer 曾要求 Refactor，更新版報告列出 Blocking Issue、限定修改與重新驗證結果
- 不適用時：修改前說明的例外理由、替代驗證與風險

### Validation
- `npm run lint`：PASS / FAIL / NOT RUN / NOT AVAILABLE
- Targeted tests：PASS / FAIL / NOT RUN / NOT AVAILABLE
- Full test suite：PASS / FAIL / NOT RUN / NOT AVAILABLE
- `npm run build`：PASS / FAIL / NOT RUN / NOT AVAILABLE
- `git diff --check`：PASS / FAIL / NOT RUN / NOT AVAILABLE
- Manual verification：PASS / FAIL / NOT RUN / NOT AVAILABLE

### Known Limitations and Risks
- 已知限制、風險與範圍外發現

### Git Evidence
- Diff Source：GIT / NON_GIT_BASELINE
- 限定範圍的 `git status --short`
- 限定範圍的 diff 與 diff stat

### Review Status
- NOT REVIEWED
````

`FAIL` 不得進入 `READY FOR REVIEW`。`NOT RUN` 或 `NOT AVAILABLE` 必須說明原因、證據與正確性風險；只有不影響本次修改正確性時，才能交由 Reviewer 判斷是否足夠。

Reviewer 依 `docs/CODE_REVIEW.md` 檢查實際檔案、需求、驗收條件、TDD 證據、驗證結果與 diff：

- `code-review` Skill 能依其規則執行時，Reviewer 將 `Standards` 與 `Spec` 報告保留為分離證據，再依正式分級規則逐項判斷是否 Blocking；Skill 的摘要或 finding 數量不得直接等同 `APPROVED`。
- `code-review` Skill 因缺少 committed fixed point 而不適用時，Reviewer 直接使用本次實際 diff 完成正式審查；只有缺少正式判斷所需的需求、diff、驗證或其他必要證據時，才回報 `UNABLE_TO_VERIFY`。
- 有 Blocking 問題時回報 `REQUEST_CHANGES`。若 Blocking Issue 要求 Refactor，Reviewer 必須說明理由、影響與限定範圍；Developer Agent 只處理指出的範圍，重新執行受影響驗證，輸出更新版 Developer Report，再交完整複審。
- 沒有 Blocking 問題時，由 Reviewer 回報 `APPROVED`。
- 缺少可靠判斷所需的證據時，由 Reviewer 回報 `UNABLE_TO_VERIFY`，不得視為通過。
- Developer Agent 不得自行輸出 `APPROVED`。
- Reviewer `APPROVED` 前，不得把任務描述為 `COMPLETE` 或可交付，也不得進入 Git 寫入或發布流程。

只有完全沒有檔案修改的唯讀審查、分析、解釋或規劃可以略過 Reviewer。Reviewer 指南不存在、無法讀取或與本文件衝突時，停止交審並回報，不得自行推測正式核准標準。

---

## 15. Final Report

要求範圍已完成、必要驗證有可信結果且 Reviewer 已 `APPROVED` 後，主 Agent 才能輸出以下 Final Report，並在該次回報將任務狀態標示為 `COMPLETE`。Final Report 必須能和最後一版 Developer Report 對照，不得默默改寫完成範圍或驗證結果：

````md
## Implementation Summary

### Task Status
- COMPLETE

### Completed
- 實際完成的內容

### Requirement Coverage
- 驗收條件
  - 對應結果與證據

### Files Changed
- `path/to/file`
  - 修改原因

### TDD Evidence
- Red
- Green
- Review-stage Refactor：Reviewer 是否要求；若要求，列出 Blocking Issue、Developer 修改、重新驗證與複審結果
- 不適用時說明原因、替代驗證與風險

### Validation
- `npm run lint`
  - PASS / FAIL / NOT RUN / NOT AVAILABLE
- Targeted tests
  - PASS / FAIL / NOT RUN / NOT AVAILABLE
- Full test suite
  - PASS / FAIL / NOT RUN / NOT AVAILABLE
- `npm run build`
  - PASS / FAIL / NOT RUN / NOT AVAILABLE
- `git diff --check`
  - PASS / FAIL / NOT RUN / NOT AVAILABLE

### Manual Verification
- 實際確認內容
- 未執行時說明原因與影響

### Review
- Reviewer 最終結果：APPROVED
- REQUEST_CHANGES 與修正／複審紀錄

### Developer Report Comparison
- Final Report 與最後一版 Developer Report 的差異
- 若無則填寫 None

### Known Limitations
- 已知限制
- 若無則填寫 None

### Risks
- 已知風險
- 若無則填寫 None

### Additional Findings
- 本次未處理的其他問題
- 若無則填寫 None

### Git Status
```text
限定範圍內 git status --short 的實際輸出
```

### Diff Summary
```text
限定範圍內 git diff --stat 的實際輸出
```

### Git Actions
- 未建立或切換 Branch
- 未執行 git add、Commit 或 Push
- 未建立或合併 Pull Request
````

`FAIL`、`NOT RUN` 與 `NOT AVAILABLE` 必須說明原因、證據與交付影響。若仍有必要工作、驗證失敗或 Reviewer 尚未 `APPROVED`，不得使用 `COMPLETE`，應回報符合事實的任務狀態。Final Report 交付後，流程回到使用者；只有使用者能決定是否進入 Commit、Push、Pull Request 或 Merge。
