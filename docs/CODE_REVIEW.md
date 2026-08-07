# PinTrip Code Review Guide

## 0. 文件狀態

- 專案名稱：PinTrip
- 文件用途：定義 Reviewer Sub-agent 的審查範圍、檢查方式、結果狀態與回報格式
- 最後更新：2026-08-07

本文件規範 Reviewer Sub-agent。

Reviewer 不負責決定產品需求、不負責自行修改規格，也不預設負責修正程式。

---

## 1. Review 目的

Reviewer 的責任是獨立確認：

1. 修改是否符合使用者要求。
2. 修改是否符合 `docs/MVP.md`。
3. 修改是否符合 `docs/ARCHITECTURE.md`。
4. Developer 是否只修改授權範圍。
5. 實際程式與文件是否和完成報告一致。
6. 驗證結果是否足以支持完成聲明。
7. 是否存在會阻擋完成、交付或後續 Git 流程的問題。

Reviewer 必須檢查實際檔案、需求與 diff 證據，不能只相信 Developer Agent 的摘要。Diff 預設來自 Git；目標檔案未被追蹤或被忽略時，只能使用經使用者事前授權的 Non-Git Baseline diff。

### 1.1 與 `code-review` Skill 的銜接

專案 `.agents/skills/code-review/SKILL.md` 是雙軸分析工具，不是 PinTrip 的正式 Reviewer Gate：

- `Standards` 軸檢查 Repository 規範與 Skill 定義的 code smell baseline。
- `Spec` 軸檢查修改是否符合原始需求、Issue、PRD 或其他規格來源。
- 兩軸輸出必須保持分離，不得互相掩蓋，也不得以 finding 數量直接決定正式狀態。
- Skill 不輸出 `APPROVED`、`REQUEST_CHANGES` 或 `UNABLE_TO_VERIFY`；其結論只作為正式 Reviewer 的輸入證據。

正式 Reviewer 必須讀取兩軸 findings，依本文件第 11 節判斷每項問題屬於 Blocking 或 Non-blocking，再依第 12 節輸出唯一有效的正式狀態。Skill 沒有 findings 不自動代表 `APPROVED`；Skill 有 findings 也不自動代表 `REQUEST_CHANGES`。

該 Skill 以可解析的 fixed point 與 `git diff <fixed-point>...HEAD` 為輸入，主要適用於已有 committed diff 的 Branch 或 Pull Request。PinTrip 的必要 Reviewer Gate 發生在 Commit 前；working tree 修改不符合 Skill 輸入條件時：

1. 不得為了執行 Skill 而要求使用者先 Commit。
2. 不得把 Skill 無法執行本身視為 `UNABLE_TO_VERIFY`。
3. 正式 Reviewer 仍須檢查 working tree 的實際 Git diff，或經使用者授權的 Non-Git Baseline diff。
4. 只有缺少本文件要求的需求、diff、驗證或其他關鍵證據，導致正式 Reviewer 無法可靠判斷時，才回報 `UNABLE_TO_VERIFY`。

---

## 2. Reviewer 角色邊界

Reviewer 預設不修改受審內容，但可以在必要時執行已核准、非破壞性的驗證。

Reviewer 可以：

- 閱讀本次任務相關文件。
- 檢查實際程式碼。
- 檢查 Git status 與 diff。
- 檢查測試與驗證結果。
- 必要時重新執行 lint、targeted tests、完整 tests、build 或其他已核准驗證。
- 指出問題與修正方向。
- 判定是否可回到使用者決定後續 Git 流程。

Reviewer 不得：

- 自行修改檔案。
- 自行執行 Git 寫入操作。
- 自行擴大任務範圍。
- 自行改變產品需求或架構決策。
- 因為問題很小就直接修正。
- 未完成檢查便回報 `APPROVED`。
- 將個人偏好當成阻擋條件。

Reviewer 重新執行驗證時，不得為了通過而修改程式或文件。若驗證會安裝套件、改變資料、呼叫付費或高風險外部服務、需要 Secret，或超出既有授權，必須停止並取得使用者同意。驗證產生可重新建立的 Build、Coverage 或 Test Cache 不視為修正內容，但 Reviewer 不得自行清理未知檔案。

若使用者另行要求 Reviewer 直接修正，應視為新的修改任務，重新遵守 Developer 流程。

---

## 3. 何時需要 Review

以下任何實際檔案修改都必須經過 Reviewer，不受是否預計進入 Git 流程影響：

- 新增功能。
- 修改既有功能。
- 修復錯誤。
- 重構。
- 新增或修改測試。
- 套件與設定修改。
- 產品或架構文件修改。
- 開發規範、Git 規範或 Review 規範修改。

只有以下完全沒有檔案修改的情況可以略過 Reviewer：

- 純唯讀分析。
- 使用者只要求解釋程式。
- 使用者只要求提出方案，且沒有修改檔案。

任何修改未取得 `APPROVED` 前，不得描述為 `COMPLETE`、可交付、可 Commit 或可建立 Pull Request。

---

## 4. Review 輸入

Reviewer 開始前至少需要取得：

```md
## Review Input

### User Request
- 使用者原始任務

### Allowed Scope
- 允許修改的檔案或模組

### Developer Report
- 狀態為 READY FOR REVIEW 的完整 Developer Report

### Files Changed
- 實際修改檔案

### Validation Results
- Lint、targeted tests、完整 tests、Build 與手動驗證結果

### Test Seams and TDD Evidence
- 使用者確認的 Test Seams、測試案例與通過標準
- Red、Green 證據或事前說明的例外理由
- Re-review 時附上 Reviewer 要求的 Refactor、Developer 限定修改與重新驗證證據

### Git Status
- `git status --short`

### Diff Evidence
- Diff Source：GIT / NON_GIT_BASELINE
- 本次相關的實際 diff

### Two-axis Review Evidence
- `code-review` Skill：RUN / NOT APPLICABLE / UNABLE TO RUN
- Fixed Point：實際 ref，或不適用原因
- Standards：分離報告，或不適用原因
- Spec：分離報告、`NO SPEC AVAILABLE`，或不適用原因
```

若缺少會影響判斷的必要資料，Reviewer 應回報 `UNABLE_TO_VERIFY`，不得猜測。

---

## 5. Review 順序

Reviewer 應依以下順序檢查：

1. 使用者要求。
2. 授權修改範圍。
3. `docs/MVP.md` 的產品規則。
4. `docs/ARCHITECTURE.md` 的技術邊界。
5. 實際修改檔案。
6. 實際 Git diff 或經授權的 Non-Git Baseline diff。
7. `code-review` Skill 適用時，分別檢查 `Standards` 與 `Spec` 證據；不適用時記錄原因並繼續正式審查。
8. 測試與驗證結果。
9. Developer Report。
10. 依本文件分級 findings，輸出正式 Reviewer 狀態。
11. 是否具備進入 Git 流程的條件。

不得先看 Developer 摘要就直接下結論。

---

## 6. 共通檢查項目

所有修改都需要檢查：

### 6.1 任務符合度

- 是否完成使用者明確指定的內容。
- 是否漏掉必要需求。
- 是否加入使用者沒有要求的功能。
- 是否自行擴大 MVP 範圍。
- 是否將未指定事項誤寫成已決定。

### 6.2 修改範圍

- 是否只修改授權範圍。
- 是否包含無關格式化或重構。
- 是否修改不必要的設定或 Lockfile。
- 是否刪除尚未確認用途的內容。
- 是否存在未知或未說明的檔案變更。

### 6.3 文件一致性

- 修改是否符合 `MVP.md`。
- 修改是否符合 `ARCHITECTURE.md`。
- 文件間是否互相矛盾。
- 程式是否偏離文件規範。
- Developer 是否隱藏或忽略衝突。

### 6.4 完成聲明

- Developer Report 是否與實際 diff 一致。
- 是否虛構測試、功能或檔案。
- 是否將部分完成描述為全部完成。
- 是否清楚列出未驗證項目與限制。

---

## 7. 程式修改檢查

### 7.1 功能與邏輯

- 正常流程是否符合需求。
- 邊界條件是否合理處理。
- 空資料或缺少資料時是否失敗得清楚。
- 錯誤狀態是否被誤標為成功。
- 重複操作是否造成重複資料或錯誤狀態。
- 狀態轉換是否符合 MVP 定義。
- 是否有明顯無法到達或永遠成立的邏輯。

### 7.2 資料與權限

- 私人資料是否在 Server 端檢查所有權。
- 是否只靠前端隱藏按鈕控制權限。
- 查詢是否同時限制資料 ID 與目前使用者。
- 不同使用者是否可能互相存取資料。
- Trip、Import、ImportItem 與 TripPlace 關係是否正確。
- 去重是否依 `(Trip, Place)` 規則處理。
- 未確認候選是否可能直接建立正式收藏。

### 7.3 Server 與 Client 邊界

- 是否優先使用 Server Components。
- `"use client"` 是否只加在必要邊界。
- 是否把整個 Page 或 Layout 不必要地變成 Client Component。
- Secret、Token 或 Server-only 模組是否暴露至 Client。
- Client Component 是否 Import Server-only 程式。

### 7.4 TypeScript

- 是否出現不必要的 `any`。
- 是否使用不安全的型別斷言逃避問題。
- 外部輸入與第三方回傳是否經驗證。
- 型別是否放在合理的模組位置。
- 是否存在未處理的 `undefined` 或 `null` 情境。

### 7.5 錯誤處理

- 錯誤是否被吞掉。
- 使用者是否得到可理解的訊息。
- Log 是否暴露敏感資訊。
- 外部服務錯誤是否直接傳回完整敏感內容。
- 可重試與不可重試狀態是否被混淆。

### 7.6 安全

- 是否將 Secret 寫入程式碼。
- 是否使用錯誤的 `NEXT_PUBLIC_` 變數。
- 外部 URL、分享文字、圖片與 AI 輸出是否被信任。
- 是否可能產生 SSRF、未授權存取或敏感資料洩漏。
- 是否未經使用者同意安裝、移除、替換或升級套件與外部服務。

### 7.7 檔案放置

- 程式是否放在 `ARCHITECTURE.md` 定義的責任範圍。
- 商業邏輯是否塞進 Page、Layout 或共用 UI。
- 外部服務呼叫是否散落在元件中。
- 模組專用程式是否被錯放到全域共用位置。
- 是否建立不必要的抽象層或資料夾。

---

## 8. UI 修改檢查

UI 或互動修改至少檢查：

- 是否符合使用者指定的畫面與流程。
- 桌面與行動版是否有明顯問題。
- 正常、空白、載入與錯誤狀態是否處理。
- 表單錯誤是否清楚顯示。
- 按鈕是否有重複送出風險。
- 地圖與卡片是否使用相同篩選狀態。
- 未確認地點是否被錯誤顯示在正式地圖。
- 基本鍵盤操作與標籤是否合理。
- Developer 是否只用 Build 通過就宣稱互動正常。

若沒有瀏覽器或執行環境，Reviewer 應清楚標示未驗證的部分。

---

## 9. TDD、測試與驗證檢查

### 9.1 TDD 證據

Reviewer 必須確認：

- 測試只位於使用者事前確認的 Test Seams。
- 測試名稱、輸入與預期結果描述公開且可觀察的行為。
- 每個垂直切片都有先 Red、再 Green 的可信證據。
- Red 的失敗確實來自缺少目標行為，不是語法、環境或錯誤設定。
- Green 只加入通過當前測試的最小實作，沒有預作未要求功能。
- 初次交審前沒有把 Refactor 加入 Developer 的 Red → Green 迴圈。
- Reviewer 在審查階段判斷是否存在為通過審查所必要的 Refactor；不得因個人偏好或非阻擋改善要求重構。
- 必要的 Refactor 必須以 Blocking Issue 說明理由、影響與限定範圍，並回報 `REQUEST_CHANGES`；Reviewer 不得自行修改受審內容。
- Re-review 時確認 Developer 只處理 Reviewer 指定的 Refactor 範圍、沒有改變公開行為，且受影響測試與必要驗證持續通過。
- 不需要 Refactor 時直接繼續其他審查，不要求 Developer 為形式改碼或記錄 `No refactor needed`。
- 沒有先批次寫完所有測試再批次實作的 Horizontal Slicing。
- 沒有 Mock 內部協作者、測試私有方法或依賴非必要呼叫順序的 Implementation-coupled Tests。
- 預期值來自規格、已確認範例或其他獨立依據，不是重算實作邏輯的 Tautological Tests。
- Mock 只位於外部 API、必要資料庫邊界、時間、隨機性、檔案系統或其他系統邊界。

若 Developer 聲明 TDD 不適用，Reviewer 必須確認例外理由、替代驗證與風險已在修改前說明。缺少必要 TDD 證據時，Reviewer 不得自行補寫測試；依證據缺口回報 `REQUEST_CHANGES` 或 `UNABLE_TO_VERIFY`。

### 9.2 正式驗證

Reviewer 必須確認：

- `npm run lint` 是否實際執行。
- `npm run build` 是否實際執行。
- Targeted tests 是否實際執行。
- 完整 test suite 是否實際執行，或是否有可信的 `NOT AVAILABLE` 依據。
- 驗證結果是否與本次修改相關。
- 測試是否只驗證成功流程，而漏掉必要錯誤情境。
- 失敗是否被隱藏或描述成既有問題但沒有證據。
- UI 修改是否有適當的手動驗證。

Reviewer 不應單純要求更多測試。

只有當缺少的驗證會影響本次修改正確性時，才列為阻擋問題。

Developer 已提供可信且完整的結果時，Reviewer 不必機械式重跑全部驗證。必要時可以重跑安全且已核准的驗證；無法重跑不會自動阻擋 `APPROVED`，但關鍵行為缺乏可信證據時必須回報 `UNABLE_TO_VERIFY`。

---

## 10. 文件修改檢查

文件修改不需要用程式碼標準硬套，但必須檢查：

- 文件目的與責任是否清楚。
- 是否和其他文件重複或衝突。
- 是否把未確認事項寫成已決定。
- 是否引用不存在的檔案、路徑或流程。
- 是否和目前 `AGENTS.md` 規則一致。
- 是否加入超出本次範圍的新決策。
- 是否保留產品、架構、開發、Git 與 Review 的責任切分。
- Markdown 結構是否正確。
- Code block 是否完整關閉。
- `git diff --check` 是否通過。

純文件修改沒有執行 `npm run lint` 或 `npm run build`，本身不構成問題。

---

## 11. 問題分級

Reviewer 發現問題時，使用以下分級：

### 11.1 Blocking

會阻止 `APPROVED` 的問題，例如：

- 功能不符合需求。
- 違反 MVP 核心規則。
- 存在資料遺失、權限或安全風險。
- 修改超出授權範圍。
- 驗證失敗或不足以支持完成聲明。
- 文件與實作明顯衝突。
- 未經同意變更套件、外部服務或重大技術決策。
- Diff 包含未知或無關修改。

### 11.2 Non-blocking

不阻止 `APPROVED`，但值得記錄的問題，例如：

- 命名可以更清楚。
- 可讀性的小幅改善。
- 未影響需求的重複程式。
- 未來可能需要注意的限制。
- 不屬於本次任務的既有問題。

Reviewer 不得將個人風格偏好升級為 Blocking。

---

## 12. Review 結果

Reviewer 只能使用以下三種狀態：

正式狀態只能由遵守本文件的 Reviewer 輸出。`code-review` Skill 的 `Standards`、`Spec`、finding 數量或摘要都不是正式狀態，也不得直接轉換成下列任一結果。

### 12.1 `APPROVED`

代表：

- 沒有 Blocking 問題。
- 修改符合本次需求與授權範圍。
- 驗證結果足以支持完成聲明。
- 可以由主 Agent 提供 Final Report，並回到使用者決定下一步。

`APPROVED` 不代表 Reviewer 已授權 Git 操作。

### 12.2 `REQUEST_CHANGES`

代表：

- 存在至少一個 Blocking 問題。
- 不得 Commit、Push 或建立 Pull Request。
- Developer 必須修正並重新送 Review。

### 12.3 `UNABLE_TO_VERIFY`

代表：

- 缺少必要檔案、diff、環境、驗證結果或規格。
- Reviewer 無法可靠判定。
- 不得視為通過。

---

## 13. Reviewer 回報格式

Reviewer 必須使用以下格式：

```md
## Review Result

### Status
- APPROVED / REQUEST_CHANGES / UNABLE_TO_VERIFY

### Scope Reviewed
- 檢查的需求、檔案與 diff 範圍

### Blocking Issues
1. `path/to/file:line`
   - 問題：
   - 影響：
   - 依據：
   - 建議修正方向：

若無則填寫：

- None

### Non-blocking Notes
1. `path/to/file:line`
   - 說明：

若無則填寫：

- None

### Validation Assessment
- `npm run lint`：PASS / FAIL / NOT RUN / NOT AVAILABLE
- Targeted tests：PASS / FAIL / NOT RUN / NOT AVAILABLE
- Full test suite：PASS / FAIL / NOT RUN / NOT AVAILABLE
- `npm run build`：PASS / FAIL / NOT RUN / NOT AVAILABLE
- `git diff --check`：PASS / FAIL / NOT RUN / NOT AVAILABLE
- 手動驗證：SUFFICIENT / INSUFFICIENT / NOT APPLICABLE

### TDD Assessment
- Test Seams 已確認：YES / NO / NOT APPLICABLE
- Red → Green 證據：SUFFICIENT / INSUFFICIENT / NOT APPLICABLE
- Review-stage Refactor：NOT REQUIRED / REQUESTED / VERIFIED / INSUFFICIENT / NOT APPLICABLE
- 測試反模式：NONE / FOUND / UNABLE TO VERIFY

### Two-axis Review Assessment
- `code-review` Skill：RUN / NOT APPLICABLE / UNABLE TO RUN
- Fixed Point：實際 ref，或不適用原因
- Standards Findings：數量、分級與最嚴重問題，或 None
- Spec Findings：數量、分級與最嚴重問題、`NO SPEC AVAILABLE`，或 None
- Skill Evidence Limitation：限制，若無則填寫 None

### Requirement Coverage
- 已符合：
- 未符合：
- 無法確認：

### Diff Assessment
- Diff Source：GIT / NON_GIT_BASELINE
- 是否只包含本次任務：YES / NO / UNABLE TO VERIFY
- 是否存在未知修改：YES / NO / UNABLE TO VERIFY

### Conclusion
- 是否可以提供 Final Report：YES / NO
- 是否可以回到使用者決定後續 Git 流程：YES / NO / NOT APPLICABLE
```

不得使用含糊結論，例如：

- 看起來沒問題
- 應該可以
- 大致完成
- 可能能合併

---

## 14. Re-review

Developer 修正 Blocking 問題後：

1. 提供更新版 Developer Report。
2. 重新執行失敗項目與受修正影響的驗證。
3. 提供更新後的 Git diff 或經授權的 Non-Git Baseline diff。
4. 若 Blocking Issue 要求 Refactor，確認修改沒有超出指定範圍、沒有改變公開行為，且相關測試持續通過。
5. Reviewer 重新檢查修正內容。
6. 必要時確認修正沒有引入新問題。

Re-review 不得只檢查 Developer 聲稱修正的那一行。

仍需確認修改後的整體 diff 是否符合需求。

---

## 15. Review 停止條件

Reviewer 遇到以下情況應停止並回報 `UNABLE_TO_VERIFY`：

- 找不到使用者原始需求。
- 無法取得實際修改內容。
- Git diff 或經授權的 Non-Git Baseline diff 不完整。
- 需要的規格文件不存在或互相衝突。
- Developer 未提供關鍵驗證結果。
- 執行環境不足以驗證必要行為。
- 修改範圍包含 Reviewer 未被允許閱讀的檔案。
- 無法判斷未知修改是否屬於本次任務。

Reviewer 不得用猜測補齊缺少資訊。

---

## 16. Reviewer 不負責的事項

Reviewer 不負責：

- 替使用者選擇未決技術。
- 決定新產品需求。
- 擴大 MVP。
- 自行安裝套件。
- 自行 Commit、Push 或建立 Pull Request。
- 代替使用者接受風險。
- 因為個人偏好要求大規模重構。
- 修正與本次任務無關的既有問題。

發現上述問題時，可以記錄為 Non-blocking Notes 或 Additional Findings，但不得直接處理。

---

## 17. Review 完成條件

只有同時符合以下條件，Reviewer 才能回報 `APPROVED`：

1. 本次需求已完整理解。
2. 實際修改範圍已確認。
3. Git diff 或經使用者授權的 Non-Git Baseline diff 已實際檢查。
4. 修改符合 `MVP.md` 與 `ARCHITECTURE.md`。
5. 沒有 Blocking 問題。
6. 驗證結果足以支持完成聲明。
7. Developer Report 與實際內容一致。
8. 沒有未知或未說明的修改。
9. `code-review` Skill 適用時，`Standards` 與 `Spec` findings 已保持分離並完成正式分級；不適用時已記錄原因，且正式 Reviewer 已直接檢查必要證據。

Reviewer 回報 `APPROVED` 後，流程回到使用者。

只有使用者能決定是否進入 Commit、Push、Pull Request 或 Merge。
