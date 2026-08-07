<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# PinTrip Agent Instructions

## Required Reading

開始任務前，只依任務範圍閱讀必要文件：

- 產品需求、功能或驗收：`docs/MVP.md`
- 架構、資料流、技術邊界或資料夾結構：`docs/ARCHITECTURE.md`
- 程式修改與驗證：`docs/DEVELOPMENT_GUIDE.md`
- Branch、Commit 或 PR：`docs/GIT_WORKFLOW.md`
- 程式或文件修改的 Reviewer 審查：`docs/CODE_REVIEW.md`

不得為了取得一般背景而主動擴大閱讀範圍。使用者若明確限制可讀檔案，以該限制為準；確實需要擴大時，先說明原因並取得同意。

索引文件不存在、無法讀取或彼此衝突時，停止相關工作並回報。

## Source of Truth and Conflicts

- 使用者指定的任務範圍與操作授權必須遵守。
- `docs/MVP.md` 是產品範圍、產品規則與驗收條件的規範來源。
- `docs/ARCHITECTURE.md` 是技術決策與實作邊界的規範來源。
- 程式碼現況是需要檢查的證據，不得自行推翻產品或架構文件。
- 若任務目的就是審查或修改規格，可以提出與現行文件不同的方案，但必須逐項取得使用者確認，並先更新文件後再實作。
- 一般實作任務若發現文件彼此衝突、程式碼偏離文件，或使用者要求與現行產品／架構規則衝突，停止相關修改並回報，不得自行猜測或默默改變規格。

## Core Rules

- 只處理本次明確指定的任務。
- 不得自行擴大 MVP 範圍。
- 不得修改任務範圍外的檔案。
- 不得自行決定未指定的重大技術方案，或安裝、移除、替換、升級套件與外部服務。
- 優先使用 Server Components。
- 只有需要瀏覽器互動時才使用 `"use client"`。
- 不得把敏感資訊寫入程式碼。
- 不得虛構測試或完成結果。
- 發現需求、文件、程式碼或使用者要求互相衝突時，停止相關工作並回報。
- Git 寫入與發布由使用者處理；Agent 不得執行建立或切換分支、`git add`、Commit、Push、建立或合併 Pull Request。
- 任何實際檔案修改都必須交由 Reviewer 審查；未取得 `APPROVED` 前，不得宣稱可交付或完成，也不得進入 Git 寫入或發布流程。
