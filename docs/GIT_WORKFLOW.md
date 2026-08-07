# PinTrip Git Workflow

## 0. 文件狀態

- 專案名稱：PinTrip
- 文件用途：定義 Branch、Commit、Push、Pull Request 與 Merge 流程
- 最後更新：2026-07-31

本文件只規範 Git 協作流程。

以下內容由其他文件負責：

- 程式修改與驗證：`docs/DEVELOPMENT_GUIDE.md`
- Reviewer 審查：`docs/CODE_REVIEW.md`
- 產品範圍與驗收：`docs/MVP.md`
- 架構與技術邊界：`docs/ARCHITECTURE.md`

---

## 1. 核心原則

1. `main` 與 `dev` 不直接進行一般功能開發。
2. 每個明確任務使用獨立工作分支。
3. 工作分支預設從最新的 `dev` 建立。
4. 工作分支只能發 Pull Request 到 `dev`。
5. `dev` 累積成穩定里程碑後，才可發 Pull Request 到 `main`。
6. 任何實際檔案修改都必須先通過 Reviewer 審查。
7. Reviewer 未回報 `APPROVED`，不得 Commit、Push 或建立 Pull Request。
8. Branch、Commit、Push、Pull Request 與 Merge 由使用者執行；Agent 只進行必要的唯讀 Git 檢查並提供建議。
9. Reviewer `APPROVED` 後，流程必須先回到使用者，由使用者決定是否進入 Git 流程。
10. Git 操作必須以實際 Repository 狀態為依據，不得猜測。
11. Agent 不得為了整理歷史而執行破壞性 Git 指令。

---

## 2. 長期分支

### 2.1 `main`

`main` 代表目前穩定、可部署或可展示的版本。

規則：

- 不直接在 `main` 開發。
- 一般工作分支不得直接發 Pull Request 到 `main`。
- 只有穩定里程碑可以由 `dev` 合併至 `main`。
- 合併前必須確認適用驗收條件已通過。
- 不得使用 `main` 儲存尚未完成或尚未確認的功能。

### 2.2 `dev`

`dev` 是日常開發整合分支。

規則：

- 所有一般工作分支都從最新 `dev` 建立。
- 一般功能、錯誤修正、文件與維護工作都先合併到 `dev`。
- 不直接在 `dev` 修改程式或文件。
- 建立工作分支前，應先確認本機 `dev` 與遠端狀態。
- `dev` 不代表已達正式穩定版本。

---

## 3. 工作分支

### 3.1 分支類型

依任務性質使用以下前綴：

| 類型 | 用途 | 範例 |
| --- | --- | --- |
| `feature/` | 新增產品功能 | `feature/trip-create-form` |
| `update/` | 修改既有功能或行為 | `update/import-status-ui` |
| `fix/` | 修復一般錯誤 | `fix/duplicate-trip-place` |
| `hotfix/` | 修復已影響穩定版本的緊急問題 | `hotfix/auth-session-error` |
| `refactor/` | 不改變功能行為的重構 | `refactor/import-service` |
| `test/` | 測試相關工作 | `test/trip-authorization` |
| `docs/` | 文件修改 | `docs/development-guide` |
| `chore/` | 設定、工具或維護工作 | `chore/eslint-config` |
| `style/` | 純樣式與視覺調整 | `style/trip-card-layout` |
| `perf/` | 效能改善 | `perf/map-marker-loading` |

分支名稱應：

- 使用英文。
- 簡短描述單一任務。
- 避免使用模糊名稱，例如 `feature/update`、`fix/bug`。
- 不把多個不相關任務放在同一分支。

### 3.2 建立工作分支

若任務預計交付至 Git，使用者在 Developer 開始修改前負責：

1. 檢查目前分支與工作區狀態。
2. 更新本機 `dev`。
3. 從最新 `dev` 建立工作分支。
4. 通知 Developer 可以開始修改。

Agent 只能以 `git status`、`git diff`、`git log`、`git branch --show-current` 等唯讀指令確認狀態。Branch 不正確，或工作區存在會與本次範圍重疊的修改時，Agent 進入 `WAITING FOR USER`；不得直接切換分支、覆蓋內容、Stash 或還原修改。

概念流程：

```bash
git status --short
git switch dev
git pull --ff-only
git switch -c <branch-name>
```

以上為提供給使用者的概念指令，Agent 不得代為執行。純唯讀分析、規劃，或使用者明確表示不進入 Git 交付的任務，不要求先建立工作分支。

---

## 4. 任務進行期間

工作分支只包含本次任務直接相關的修改。

不得：

- 混入其他功能。
- 順便修改無關文件。
- 將多個獨立問題塞進同一分支。
- 未經確認修改套件或 Lockfile。
- 使用 Git 指令隱藏未知修改。
- 為了讓 diff 看起來乾淨而刪除使用者內容。

開發過程中的驗證依 `docs/DEVELOPMENT_GUIDE.md` 執行。

---

## 5. Reviewer Gate

Developer Agent 完成修改與驗證後，必須：

1. 停止繼續修改。
2. 依 `docs/DEVELOPMENT_GUIDE.md` 提供狀態為 `READY FOR REVIEW` 的 Developer Report。
3. 提供限定範圍的 `git status --short`。
4. 提供限定範圍的 diff 與 diff stat；未追蹤或被忽略的檔案依已取得使用者授權的 Non-Git Baseline 流程處理。
5. 將實際檔案、Developer Report 與 diff 交給 Reviewer Sub-agent。
6. 等待 Reviewer 回報 `APPROVED`、`REQUEST_CHANGES` 或 `UNABLE_TO_VERIFY`。

Reviewer 狀態：

- `APPROVED`
- `REQUEST_CHANGES`
- `UNABLE_TO_VERIFY`

只有 `APPROVED` 可以進入 Commit 階段。

### 5.1 `REQUEST_CHANGES`

若 Reviewer 回報 `REQUEST_CHANGES`：

1. Developer Agent 只修正 Reviewer 指出的阻擋問題。
2. 重新執行相關驗證。
3. 提供更新版 Developer Report。
4. 再次提交 Reviewer 完整複審。
5. 未重新取得 `APPROVED` 前，不得進入任何 Git 寫入或發布流程。

### 5.2 `UNABLE_TO_VERIFY`

若 Reviewer 無法取得必要資訊或驗證環境：

- 不得視為通過。
- 必須回報缺少的資料或環境。
- 由使用者決定是否補充資訊、調整範圍或停止任務。

---

## 6. 使用者確認與 Commit

Reviewer 回報 `APPROVED` 且主 Agent 已提供 Final Report 後，流程回到使用者。只有使用者能決定是否執行：

```bash
git add
git commit
```

Agent 不得執行上述指令，只能依實際 diff 建議 Stage 範圍與 Commit Message。下列情況都不代表已進入 Git 流程：

- 使用者說「完成了」。
- 使用者要求查看結果。
- Reviewer 已通過。
- 任務內容看起來沒有問題。
- 使用者先前曾執行其他任務的 Commit。

使用者執行前應確認 Reviewer 最終狀態仍為 `APPROVED`、Final Report 與最後一版 Developer Report 一致，且實際 diff 沒有新增未知修改。

---

## 7. Commit Message

Commit Message 使用英文，格式為：

```text
category: action
```

可用類別：

| 類別 | 用途 |
| --- | --- |
| `feat` | 新增功能 |
| `update` | 修改既有功能或行為 |
| `fix` | 修復錯誤 |
| `style` | 樣式或版面修改 |
| `perf` | 效能改善 |
| `chore` | 工具、設定與維護 |
| `refactor` | 不改變行為的重構 |
| `docs` | 文件修改 |
| `test` | 測試修改 |

範例：

```text
feat: add trip creation form
fix: prevent duplicate trip places
docs: define development workflow
test: cover import status transitions
```

規則：

- 使用現在式動詞。
- 描述實際完成的修改。
- 不使用模糊訊息，例如 `update code`、`fix issue`、`changes`。
- Commit Message 必須依實際 staged diff 判斷。
- 不得只依 Developer Agent 的文字摘要產生訊息。
- 一個 Commit 應代表一個可理解的變更目的。

若 staged diff 包含不相關修改，停止 Commit 並先回報。

---

## 8. Push

Commit 完成後，由使用者決定並執行 Push。Agent 只能提供概念指令與 Push 前檢查清單，不得代為執行。

概念指令：

```bash
git push -u origin <branch-name>
```

Push 前必須確認：

- 目前所在分支正確。
- Commit 內容正確。
- 沒有未預期的 staged 或 committed 檔案。
- 不包含 Secret、Token、私人設定或本機專用文件。
- Remote 指向正確 Repository。

使用者應避免：

- 使用 `--force` 或 `--force-with-lease`，除非使用者已明確評估並接受影響。
- 將工作分支 Push 到錯誤 Remote。
- 直接 Push 至 `main` 或 `dev`。
- 因 Push 失敗而自行重寫歷史。

---

## 9. Pull Request

### 9.1 工作分支到 `dev`

一般流程：

```text
工作分支 → Pull Request → dev
```

PR 建立前必須：

- Reviewer 回報 `APPROVED`。
- 使用者確認可以 Commit 與 Push。
- 工作分支已 Push 至遠端。
- 驗證結果已整理完成。
- PR 不包含無關修改。

Pull Request 由使用者在 GitHub 建立。Agent 可以依 Final Report 與實際 diff 提供 PR 草稿，但不得代為建立或送出。

### 9.2 PR 內容

PR 說明至少包含：

```md
## Summary
- 完成內容

## Files Changed
- 主要修改檔案

## Validation
- 執行的指令與結果

## Manual Verification
- 實際確認項目

## Known Limitations
- 已知限制

## Risks
- 已知風險

## Reviewer Result
- APPROVED
```

不得在 Reviewer 尚未通過時填寫 `APPROVED`。

### 9.3 `dev` 到 `main`

只有當 `dev` 達成明確的穩定里程碑時，才建立：

```text
dev → Pull Request → main
```

建立前應確認：

- 本里程碑範圍明確。
- 適用驗收條件已通過。
- 沒有已知阻擋問題。
- 相關文件已同步。
- 使用者明確同意。

---

## 10. Merge

Merge 由使用者決定並執行。Agent 可以提供檢查結果與風險說明，但不得代為合併 Pull Request。

Merge 前必須確認：

- PR 目標分支正確。
- Reviewer 狀態為 `APPROVED`。
- 必要檢查已通過。
- 沒有未解決的阻擋問題。
- 使用者已確認合併。

Merge 方法目前為「未指定」。

在正式決定前，不得把以下任何方法寫成 PinTrip 的既定規則：

- Merge Commit
- Squash and Merge
- Rebase and Merge

---

## 11. Hotfix

`hotfix/` 只用於已影響穩定版本，且需要優先處理的問題。

使用 hotfix 前必須由使用者確認：

- 問題確實影響 `main`。
- 不適合等待一般 `dev` 流程。
- 修改範圍已縮到最小。

Hotfix 的分支來源、合併回 `main` 與同步至 `dev` 的方式目前為「未指定」。

Hotfix 流程由使用者啟動；Agent 只能在使用者確認範圍後進行唯讀檢查、開發與 Review 階段工作。

---

## 12. 禁止操作

Agent 不得執行：

```text
git reset --hard
git clean -fd
git checkout -- .
git restore .
git restore --staged .
git rebase
git commit --amend
git push --force
git push --force-with-lease
```

也不得：

- 刪除 Branch。
- 刪除 Tag。
- 改寫已 Push 的歷史。
- 自行解決不確定的 Merge Conflict。
- 使用 Stash 隱藏未知修改。
- 將 Secret 或本機文件加入 Git。

若 Repository 確實需要上述操作，Agent 必須停止並說明原因、影響與替代方式，由使用者自行決定及執行。

---

## 13. Git 完成回報

使用者完成 Git 操作後，可以要求 Agent 以唯讀指令核對並整理 Git Summary。Agent 只能根據實際 Repository 狀態與使用者提供的 Pull Request 資訊回報：

````md
## Git Summary

### Branch
- 目前分支

### Commit
- Commit Hash
- Commit Message

### Push
- PUSHED / NOT PUSHED
- Remote Branch

### Pull Request
- CREATED BY USER / NOT CREATED / UNABLE TO VERIFY
- PR URL：未指定或實際網址

### Working Tree
```text
git status --short 的實際輸出
```

### Notes
- 已知限制或後續事項
````

不得虛構 Commit Hash、Push 結果或 PR 狀態。

---

## 14. 尚未決定

以下項目目前為「未指定」：

- Merge 方法。
- Branch 是否在 Merge 後刪除。
- Hotfix 完整流程。
- Release Tag 規則。
- Versioning 規則。
- 自動化 CI Required Checks。
- GitHub Branch Protection 設定。

以上項目需由使用者確認後再更新本文件。
