# Implementation Plan：Design System Token 整合（v3）

- 分支：`chore/design-system-tokens`
- 基底：`5f5a213`（＝ `origin/dev`）
- 建立：2026-09-02；v2 單層改寫、v3 class 化：2026-09-02
- 狀態：Open Questions 為 None，可開始實作

> **版本沿革**
>
> - **v1**：`@theme inline` + `:root` 兩層。已完成並通過 Reviewer，但那是 shadcn 為「執行時以 class 切換主題」設計的模式，PinTrip 沒有該需求，卻付出 11 個值被複製兩份的代價。
> - **v2**：改為單層 `@theme`，消除重複。已完成並通過 Reviewer。
> - **v3（本版）**：把仍留在 `:root`、無法寫成 Tailwind class 的 token 處理掉。目標是**切版時不需要在 `className` 或 `style` 裡寫 `var()`**。
>
> **v3 只調整 `src/styles/tokens/_effects.css` 與 `_spacing.css` 兩支檔案。** 其餘皆已完成且正確，不動。

---

## Goal

讓所有 Design System 的設計值都能以 Tailwind class 使用，切版時不需要 `var()`。

本次不實作任何畫面或元件。

---

## 現況（v2 已完成，不動的部分）

```text
 M docs/ARCHITECTURE.md          字體載入偏離記錄        → 不動
 D src/app/globals.css           已刪除                  → 不動
 M src/app/layout.tsx            四種字體 + zh-TW        → 不動
?? e2e/theme.spec.ts             深色模式 guard          → 不動
?? src/styles/globals.css        12 行入口               → 不動
?? src/styles/tokens/_colors.css 單層 @theme，52 色      → 不動
?? src/styles/tokens/_typography.css 單層 @theme         → 不動
?? src/styles/tokens/_effects.css    @theme + :root      → 改寫
?? src/styles/tokens/_spacing.css    :root only          → 改寫
```

---

## v2 剩下的問題

`_effects.css` 與 `_spacing.css` 仍有 26 個 token 只存在於 `:root`，沒有對應的 Tailwind class。要用它們就得寫：

```tsx
style={{ minHeight: 'var(--tap-min)', transitionTimingFunction: 'var(--ease-soft)' }}
```

這違背使用 Tailwind 的意義，也與使用者既有專案的寫法不一致。

---

## 三種處理方式的判斷順序

實測依據：以 `@tailwindcss/postcss` 4.3.3 對本專案實際編譯驗證。

1. **內建 class 已能表達 → 兩者都不用，直接刪除 token。**
   Tailwind v4 的 `duration-*`、`scale-*`、`rotate-*`、`p-*`、`h-*` 是功能式 utility，吃任意數字，不需事先註冊。實測 `duration-120`、`scale-97`、`-rotate-4`、`h-18`、`min-h-11` 皆可產生。

2. **落在 Tailwind 的 18 個 namespace 內 → `@theme`。**
   實測對照：`--ease-soft` 放進 `@theme` 後 `.ease-soft` 產生；`--ease-spring` 未放則 `.ease-spring` 不產生。namespace 清單見 `node_modules/tailwindcss/theme.css`。

3. **不在 namespace 內、但需要 class → `@utility`。**
   實測 `@utility` 可定義於被 `@import` 的檔案內；名稱與內建功能式 utility 前綴相同也不衝突（`duration-fast` 與 `duration-200` 並存、`px-gutter` 與 `px-5` 並存）。

---

## Planned Changes

### 改寫 `src/styles/tokens/_effects.css`

**移入 `@theme`**：`--ease-soft`、`--ease-spring`。值不變，只換區塊。它們在 `ease` namespace 內，且 cubic-bezier 不是數字，Tailwind 無從推導，必須註冊才有 class。

**改為 `@utility`**：

| DS token | DS 原值 | utility | 產出的 CSS | 為何不用內建 |
| --- | --- | --- | --- | --- |
| `--border-dash` | `1.5px dashed var(--border-dashed)` | `dash-frame` | `border: 1.5px dashed var(--color-dash)` | 1.5px 非預設寬度，否則要寫 `border-[1.5px] border-dashed border-dash` |
| `--divider-dash` | `1px dashed var(--cream-300)` | `divider-dash` | `border-top: 1px dashed var(--color-cream-300)` | 1px 單邊虛線，`border-t border-dashed border-cream-300` 三個 class 才寫得出來 |

> **兩者寬度不同**：`--border-dash` 是 **1.5px**，`--divider-dash` 是 **1px**。
> 值一律以 `docs/design/design-system/tokens/effects.css` 為準，不得因相鄰而套用同一個寬度。

> **`dash-frame` 這個名字是刻意的，不要改回 `border-dash`。**
> `_colors.css` 的 `--color-dash` 會讓 Tailwind 自動產生 `border-dash` 作為**邊框顏色** utility。
> 若 `@utility` 也叫 `border-dash`，兩者會編出同名 class，`@utility` 排在後面直接蓋掉顏色版——
> 寫 `border border-dash` 會拿到 1.5px 虛線框，而 `--color-dash` 的顏色 utility 永遠取不到。
> 命名時必須同時避開 Tailwind 內建 utility **以及 `@theme` 自動產生的 utility**。

**刪除**（內建 class 已涵蓋，於檔尾以註解記錄對應）：

| DS token | 改寫成 |
| --- | --- |
| `--border-1` | `border border-hairline` |
| `--dur-fast` 120ms | `duration-120` |
| `--dur-base` 200ms | `duration-200` |
| `--dur-slow` 320ms | `duration-320` |
| `--press-scale` 0.97 | `scale-97` |
| `--sticker-tilt` -4deg | `-rotate-4` |

`:root` 區塊整個消失。

### 改寫 `src/styles/tokens/_spacing.css`

**改為 `@utility`**，值直接寫，並以註解標註對應的 DS token：

| DS token | utility |
| --- | --- |
| `--screen-gutter` 20px | `px-gutter` |
| `--card-pad` 16px | `p-card` |
| `--card-gap` 16px | `gap-card` |
| `--stack-gap` 12px | `gap-stack` |
| `--nav-height` 72px | `h-nav` |
| `--nav-safe-bottom` 24px | `pb-nav-safe` |
| `--tap-min` 44px | `min-h-tap` |

**刪除**：

- `--sp-1` 至 `--sp-10`：與 Tailwind 預設 4px scale 完全相同，`p-5` 即 20px
- `--fab-size`：PinTrip 已移除 FAB
- `--frame-width` / `--frame-height`：設計畫布尺寸，應用端無意義

`:root` 區塊整個消失。

### 修改 `docs/ARCHITECTURE.md`

於 §2.1 既有段落後補一句：DS 的設計值在應用端一律以 Tailwind class 表達，對應關係見本計畫。

### 不動的檔案

`src/styles/globals.css`、`_colors.css`、`_typography.css`、`src/app/layout.tsx`、`e2e/*.spec.ts`、`docs/ARCHITECTURE.md` 既有的字體偏離段落。

---

## Acceptance Criteria

1. `src/styles/` 底下**沒有任何 `:root` 區塊**；所有設計值以 `@theme` 或 `@utility` 表達。
2. 每個 token 只有單一定義來源，全庫不存在同一數值出現在兩個檔案。
3. 不使用 `@theme inline`。
4. `_effects.css` 的 `@theme` 含 6 個圓角、7 個陰影、2 個 easing，共 15 項。
5. `_effects.css` 定義 `dash-frame`、`divider-dash` 兩個 `@utility`；不得使用 `border-dash` 這個名稱。
6. `_spacing.css` 定義 7 個 `@utility`，且不含任何 `@theme` 或 `:root`。
7. 被刪除的 token 在檔尾以註解記錄對應的內建 class 寫法。
8. `ease-soft`、`ease-spring`、`dash-frame`、`divider-dash`、`px-gutter`、`p-card`、`gap-card`、`gap-stack`、`h-nav`、`pb-nav-safe`、`min-h-tap` 共 11 個 class 實際可產生，且編譯產物中沒有任何 class 名稱被定義兩次。
9. v2 既有行為不受影響：`prefers-color-scheme: dark` 不改變 `globals.css` 定義的顏色、字體仍由 `next/font` 自架且頁面不對 Google 發出請求、`<html lang>` 為 `zh-TW`。
10. `npm test`、`e2e/smoke.spec.ts`、`e2e/theme.spec.ts` 全數通過。

---

## Test Seams

**TDD 不適用**（`docs/DEVELOPMENT_GUIDE.md` §10.1）：宣告式設定整合，沒有可先以失敗測試鎖定的產品行為；斷言 CSS 數值屬 §10.2 禁止的 Tautological Test。

`e2e/theme.spec.ts` 已於 v1 建立並保留。**v3 不新增測試。**

驗收條件 8 以編譯產物檢查，不寫成測試——目前沒有任何元件使用這些 class，寫測試等於斷言「我剛寫的 CSS 存在」。

---

## Known Limitations

**DS token 名稱在程式碼中消失。** `--screen-gutter`、`--tap-min`、`--dur-base` 等不再以變數形式存在。每個 `@utility` 以 `/* DS --xxx */` 註解保留追溯，被刪除者於檔尾集中記錄。設計稿與 `pintrip-design` Skill 仍講 DS 原名，實作時需依對應表轉換。

**`pb-nav-safe` 是固定 24px**，未包含 `env(safe-area-inset-bottom)`。DS 給的即為平值，不自行擴充；真正的安全區處理是另一個設計決定。

**本批不加 `next/font` mock。** `src/smoke.test.tsx` 未 import 任何會拉到 `next/font` 的模組。Home 若需測試會匯入字體的元件，先在 `vitest.setup.ts` 補上：

```ts
vi.mock('next/font/google', () => {
  const font = (variable: string) => () => ({ variable, className: '' })
  return {
    Playfair_Display: font('--font-playfair'),
    Quicksand: font('--font-quicksand'),
    Caveat: font('--font-caveat'),
    Noto_Sans_KR: font('--font-noto-kr'),
  }
})
```

**`src/app/page.tsx` 仍有 11 處 `dark:` class**，屬 create-next-app 預設頁，將隨 Home 實作移除。

---

## Out of Scope

- 任何 Home 畫面、元件或路由
- `_colors.css`、`_typography.css`、`globals.css`、`layout.tsx`、`e2e/*.spec.ts`
- 排版的 `@utility` 包裝（DS 未定義組合，待 Home 出現重複再抽）
- 修改 `docs/design/` 任何檔案
- `next/font` mock
- 安裝任何套件
- 升級 Next 以處理 `npm audit` 的 5 個 high severity 漏洞

---

## Validation Plan

| 驗收條件 | 驗證方式 |
| --- | --- |
| 1、3 | 搜尋 `src/styles/` 確認無 `:root` 與 `@theme inline` |
| 2 | 掃描所有 `--x:` 宣告，確認無重複定義 |
| 4、5、6、7 | 檢視兩支檔案 |
| 8 | 以 `@tailwindcss/postcss` 編譯，確認 11 個 class 出現在產物中 |
| 9 | `e2e/theme.spec.ts`；實際頁面攔截網路請求確認 Google 為 0；檢視 `<html lang>` |
| 10 | `npm test`、`npm run test:e2e` |

另依 §10.3 執行 `npm run lint`、`npm run build`、`git diff --check`。
依 §10.6 在 360／390／430 三個寬度確認背景色、四種字體、圓角與陰影仍正確套用。

---

## Review Plan

- 狀態為 `READY FOR REVIEW` 的 Developer Report
- 限定範圍的 `git status --short` 與 diff
- 各項驗證的實際輸出
- §10.6 的 UI 檢查結果
- 修改前已聲明的 TDD 例外理由與替代驗證

---

## Open Questions

None。
