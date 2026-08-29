# PinTrip Import — Lifecycle, States, and Decision Ledger

Source: `ImportScreen.dc.html` (STATE MAPPING TABLE, UI STATE TABLE, INTERACTION, FINAL DECISION
LEDGER) and `docs/design/claude-design-export/CLAUDE.md`. Layout numbers live in
[screens.md](screens.md); component contracts in [components.md](components.md); the a11y contract
in [accessibility.md](accessibility.md).

The design file references `docs/MVP.md` and `docs/ARCHITECTURE.md` throughout. **Those two remain
the source of truth for product and technical rules** — when you need the authoritative wording,
read them, not this summary.

## The two-layer model (get this right first)

Keep data and presentation strictly separate:

- **Import lifecycle — six values only**: `received`, `processing`, `needs_input`,
  `review_required`, `completed`, `failed`.
- **Screen presentation** is *derived* from lifecycle + entry mode + each item's disposition.

Everything the handoff calls a "state" beyond those six — Batch partial failure, All processed, All
added, All rejected, Reel URL, Mixed disposition, Extreme, Keyboard open — is a **UI preview
variant**. Never persist one as a data state. A failed item's "not yet dispositioned" is not a new
state; it is the ordinary undispositioned state.

Per-item state is separate again: each result card is independently `added` / `rejected` / `failed`
/ undispositioned, and the three dispositions are mutually exclusive.

## Entry modes

| Mode | Routes | Source presentation |
|---|---|---|
| `new` | `/share`, `/imports/new` | `LinkInputSection` (editable) while no Import exists; `SourceRow` once one does |
| `resume` | `/imports/:importId/review` | `SourceRow` + `ResumeSummaryRow` |

The only differences between the two are those rows and the status-line copy. Everything else is
shared. **`ResumeSummaryRow` appears only in `entry=resume`** — a persisted `entry=new` state must
not show returning-visitor phrasing like「2 天前匯入」.

## The source-editability rule (FINAL)

**The URL is editable only in the composer stage, before an Import exists** — i.e. No collection,
Idle, Filled, Reel URL, Invalid, and the five keyboard variants.

From `received` onward, the source is *always* the read-only `SourceRow`: no editable input, no
clear button, no way to rewrite this Import's URL. The URL on screen and the URL actually being
processed can never diverge. Analyzing a different link means leaving this Import and creating
another one. 「開啟」only opens the source post in a new window; it changes nothing.

This is the rule most likely to be broken by accident, because `needs_input` and `failed` both
require user action.

## URL validation (FINAL)

Valid source formats are Instagram posts (`instagram.com/p/…`) and Reels (`instagram.com/reel/…`).
Validation checks **format only, not readability**. Exactly three things are invalid:

1. not an Instagram URL,
2. an Instagram path that isn't `/p/` or `/reel/`,
3. a malformed URL.

**A valid `/p/` or `/reel/` URL that fails because the account is private, login is required, the
content was removed, access is restricted, or the caption can't be read is never shown as invalid.**
It must create an Import and enter `needs_input` to guide the user through supplementing it.

Reels use whatever caption / Share-Target text / shared text is available; MVP does not require
fetching or analyzing the video itself. A Reel link renders through the **same layout and the same
CTA** as a post — no separate field, no branch. Only the placeholder changes.

## State → lifecycle map

| UI variant | Lifecycle | Notes |
|---|---|---|
| No collection | none (no Import) | Still the composer: the URL is preserved and editable, no Import is created, CTA disabled; the target row becomes a dashed guidance card with a 建立旅行收藏 outline button to `/trips/new`. Returning with a collection restores Filled. |
| Idle / Filled / Reel URL / Invalid / Keyboard ×5 | none (no Import) | Composer. |
| Received | `received` | Same layout as processing, different copy only. |
| Analyzing | `processing` | The composer collapses to `SourceRow`; there is no editable field and no re-pressable CTA, so double submission is impossible by construction. |
| Empty result (zero candidates) | `needs_input` | Source 2 of 2: content was read, no places parsed. |
| needs_input · insufficient data | `needs_input` | Source 1 of 2: the content couldn't be read at all. Same `NoticeCard` layout, different copy and exit ordering. |
| Success / Mixed disposition / Partial added / Match variants / Batch partial failure / Batch retry | `review_required` | Any item still undispositioned keeps the Import here. |
| All added / All processed / All rejected | `completed` | `entry=new`, user still on the page. |
| Completed · with additions / Completed · all rejected | `completed` | `entry=resume`, returning from the import history. |
| Error | `failed` | Can only retry back to `processing`. **No 結束處理 exit** — only `needs_input` has a transition to `completed`. |

`received` and `processing` deliberately share one layout: the user's next step is identical
(wait), and a second layout would create a state with no behavioral difference.

## `needs_input` — two sources, one layout

`docs/MVP.md` §5.5「資料不足或沒有候選地點」/ ARCH §6.1「資料不足／零候選」are two causes sharing one
`NoticeCard`. Do not build two layouts. All three exits exist in both cases; only the copy and the
primary/secondary ordering change:

- **Zero candidates** — 換一個連結 (primary) → 沒有可用地點，結束處理 (outline) → 補充資料後重試 (text).
- **Insufficient data** — 補充資料後重試 (primary) → 換一個連結 (outline) → 沒有可用地點，結束處理 (text).

「換一個連結」clears the field back to idle. It neither supplements nor ends the import, so it
cannot by itself satisfy §5.5's two exits.

## Supplement flow (FINAL)

- Five content types: 貼文文字 / 貼文截圖 / 店名或景點名稱 / 地址或區域 / 其他有助於辨識的資訊.
- **At least one must have a value to submit** (`docs/MVP.md` §5.4); submit is `disabled` at 45%
  while all are empty.
- It expands **in place inside the card** — no bottom sheet, no new route. Submitting returns to
  `processing`. Both `needs_input` and `failed` can enter it. Boundary:
  `onSupplementSubmit(payload)`.
- **Screenshots: at most 3 selected per import — FINAL** (`docs/MVP.md` §5.4). At 3 the ＋新增 slot
  is removed and a message explains that one must be deleted first.
- **Removing a not-yet-submitted screenshot needs no confirmation** — per §5.4 it does not
  constitute a destructive action, so the confirmation rule's premise never applies. This is not an
  exemption. Removing screenshots after submission is out of MVP scope.
- Storage provider, file size limits and retention are **OUT OF SCOPE** — do not write them into the
  design as settled.

## Ending an import (結束處理)

Moves a `needs_input` Import to `completed`. It **requires confirmation** (§5.5 makes `completed` a
terminal state and ARCH §6.1 gives it no outgoing transitions), rendered as an in-card confirm row.

The confirmation states real impact — this import ends now and will no longer wait for supplementary
data; the same link can be pasted again later as a new import — and **must not say「不可復原」**,
because it can be redone. Buttons follow the destructive-confirmation role rule: 取消 solid (flex
1.35) / 結束處理 outline (flex 1), `sm` 44. Boundary: `onEndImport()`.

**The boundary that's easy to misread**: ending an import lets you create a *new* Import reusing the
same link. It does **not** let you reopen the completed one. `completed → processing` would be a
transition neither governing document defines.

## `completed` is read-only (FINAL)

Once an Import is `completed` — All added, All processed, All rejected, or a returning visit — it
cannot be reopened, returned to `processing`, re-analyzed, re-targeted, supplemented, re-searched,
or ended again, and no Batch CTA is shown.

`ImportItem` becomes a read-only disposition record:

- **The entire action row is removed** and replaced by a static disposition line (✓ 已加入 blue-500
  / ✕ 已拒絕 ink-400, `min-height: 44` so card height doesn't change). Edit / Add / Reject / Retry /
  re-search / supplement do not exist in the DOM. **Never leave disabled buttons in place** — they
  still read as operable and still announce capability that isn't there.
- 「更換」is natively `disabled`, staying in position at opacity .45 with no color or size change.
- `BatchAddPanel` and the coral commit CTA are replaced by `CompletedSummaryCard`. The older
  "the Batch panel switches to a completion message" behavior is **obsolete**.
- All-rejected uses the same layout with different copy and must not be worded as「已完成」— nothing
  was added, so that reads as misleading. There is no undo-reject entry (§5.7).
- Editing the content of an added place targets **`TripPlace`**, not `ImportItem`. Its route and
  screen are OUT OF SCOPE and undesigned — do not invent a modal, sheet or page for it here.
- `ResumeSummaryRow` on a completed import lists added and rejected counts only. The candidate total
  is omitted deliberately: since `completed` means every candidate was confirmed or rejected, the
  total is just the sum of the other two. **This derivation applies only to `completed`** —
  `review_required` must keep both the candidate count and the undispositioned count, since the
  latter can't be derived.

## Place matching

The address row doubles as the real-place match slot, with three forms:

| Form | Address row | 編輯 | 拒絕 | 加入 |
|---|---|---|---|---|
| matched | official name + address + blue pin (with a `›` and 44px tap target when candidates exist) | ○ | ○ | ○ |
| awaiting selection | 「請選擇實際地點 · N 筆候選 ›」 | ○ | ○ | ✕ (disabled 45%) |
| unmatched | 「找不到對應的實際地點」+ a full-width 重新搜尋 outline button | ○ | ○ | ✕ |

**Reject stays available in all three forms** — otherwise an unmatched item can never be
dispositioned and the Import can never leave `review_required`.

Candidates expand **in place, full width, in the card** (not a sheet — each candidate is a name plus
an address, and the screen already has one surface of undecided form: the change-target picker).
Each row: 13px/700 official name + 12px address, single-select mark, row height ≥ 44, r12 border
(selected turns blue-400 + blue-050). The last row is always a full-width 重新搜尋 (`sm`, 44).
Selecting collapses the list, replaces the address row, and enables Add.

When an expanded card sits near the bottom edge, align "card top (name + photo) through the last
candidate row" into view using the container's `scrollTop` (not `scrollIntoView`), leaving 16px of
breathing room; if the span exceeds the visible height, preserve the card top.

Unmatched and awaiting-selection items can never become saved places or map markers (§5.7), and are
excluded from batch add.

Boundaries: `onToggleCandidates(placeId)`, `onPickCandidate(placeId, candidate)`,
`onResearch(placeId)`.

## Per-item disposition

- **Add (FINAL)** — confirms adding to the already-selected target collection; it never asks *where*.
  Add → Adding (button stays in place, label unchanged, 40% opacity + **native `disabled`** against
  double-tap) → Added (＋ → ✓, label 已加入). On the same card, 拒絕 and 編輯 go to disabled 45% and
  stay in the layout. Only applies to `review_required`. Boundaries: `onAdd(placeId)`,
  `onRetryAdd(placeId)`.
- **Reject (FINAL)** — `docs/MVP.md` §5.7 plus core principle 10 require confirmation first. The
  action row is replaced in place by a confirm row; the card stays at its original position and
  ordering. Only one card may be in the confirming state at a time. `onReject(placeId)` fires only
  after confirmation; `onCancelReject` cancels. The rejected button stays in place with the label
  已拒絕 (still no icon — the width budget forbids one), the ground turns cream-200 with ink-400
  text, and it becomes disabled. **MVP provides no undo-reject** (§5.7).
  - The confirm row **adds +53px to the card**, pushing the cards below it down. This is an
    explicitly listed exception to the no-layout-shift principle: that principle constrains
    system-driven, unexpected movement, whereas this is user-initiated, predictable, and reversible
    with Cancel. Photo column, decoration and card order do not change.
  - Confirmation is cancelled by: the Cancel button, any action on another card, or **the card
    scrolling entirely out of view** (`IntersectionObserver` ratio 0). A pixel-displacement threshold
    is deliberately *not* used — it is unpredictable across screens and momentum scrolling, and users
    often scroll to look at what the confirmation affects.
- **Edit (FINAL, layout still 待設計)** — a **full-screen page** (multiple fields plus a phone
  keyboard would crush a bottom sheet), route `/imports/:importId/items/:itemId/edit`, fields 名稱／
  分類／介紹／推薦品項／標籤. Save or cancel returns to `/imports/:importId/review` **preserving both
  the analysis results and the scroll position**. Edit is available in all three match forms. **The
  route serves `review_required` only**; a `completed` Import must not enter it, and completed cards
  show no Edit entry. This round defines only the button's normal/pressed/disabled/focus-visible
  states and the `onEdit(placeId)` boundary — the page layout is a separate design task.

## Batch add

- The count comes from **"matched to a real Place AND not yet dispositioned"** — never the candidate
  total. Added, rejected and unmatched items are all excluded from the count and from the operation,
  and the excluded ones are named in the panel subtitle.
- If every undispositioned item is still unmatched, **no CTA is shown**; the panel says N places need
  a real place selected first.
- **Partial success is the finalized external behavior** (`docs/MVP.md` §5.7 · ARCH decision table):
  successful items are immediately and permanently added and are **never rolled back**; failed items
  stay undispositioned, must never render as added, and can be retried individually; the Import
  stays `review_required`. Do not implement whole-batch rollback or a full re-run.
- **Internal transactions, batch coordination, concurrency control and idempotency are explicitly
  not decided** (ARCH §6.2, pending the database and background-job decisions). The design must not
  be written up as though they were.
- The failure notice is a **single-responsibility block inside the card** — not another card variant,
  not an overlay. It sits below Tags and above the action row, never compresses the action row, and
  never overlaps the next card. **Retry is the same 加入 button** — no fourth button, because the
  action row's width budget is exhausted.
- While retrying, the notice's prefix and body both switch to retry wording (leaving the failure
  prefix in place would make the live region announce two contradictory things at once), and both
  the 加入 button and the Batch CTA use native `disabled` with unchanged position and size.
- The Batch panel drops its sparkles on failure — it doesn't celebrate one. So does the success
  arrow beside the status line.
- Boundaries: `onBatchAdd(eligibleIds)`, `onRetryAdd(placeId)`.

## Target collection

- **FINAL**: the target trip collection is chosen **before the import task is created**; each import
  belongs to one user and one collection. The screen shows the target before a link is even pasted,
  with a 「更換」entry. Single Add and Batch Add both mean "confirm adding to the already-chosen
  collection" — never "choose where to put this".
- With only one collection, 「更換」stays visible and enabled (the picker doubles as the create
  entry) — consistent with "elements don't vanish from the layout" and it avoids the button
  appearing and disappearing as the collection count changes.
- On a `completed` Import, 「更換」is natively `disabled` and stays in position.
- The **picker's own form (bottom sheet vs. page) is PENDING DESIGN** — only the entry point, the
  44px tap target, and the `onChangeTarget` boundary are defined. Do not decide it yourself.
- With **no collections at all**, the row becomes a dashed guidance card whose 建立旅行收藏 outline
  button routes to `/trips/new` (that screen is out of scope). The pasted or shared URL must be
  preserved across leaving and returning (§5.3), and the screen returns to Filled once a collection
  exists.

## Import time formatting — a design assumption, not a product rule

`ResumeSummaryRow` shows relative time within 7 days (「3 小時前」「2 天前」) and an absolute date
without time beyond that (「8 月 26 日」). **The format and the 7-day threshold are design
assumptions; `docs/MVP.md` doesn't define them** (§5.10 only requires import time and status).
Time-of-day belongs to the `/imports` list page, which is not designed here — and §5.10's
"candidate count" requirement likewise belongs to `/imports`, so `completed` omitting it here does
not fail §5.10.

## Decision ledger

Every item carries exactly one marker, consistent across the whole handoff.

### FINAL

- URL formats: `/p/` and `/reel/`; a valid-but-unreadable link is not a format error and goes to
  `needs_input`.
- Reel text strategy: use available caption / Share-Target text / shared text; the video itself is
  not required.
- Source presentation: `LinkInputSection` before an Import exists; `SourceRow` (read-only, no clear,
  not rewritable) from `received` onward, shared by every persisted state.
- Lifecycle mapping: six states; everything else is a UI variant.
- No collection: still the composer; URL kept and editable, no Import created, CTA disabled,
  create-collection exit to `/trips/new`, return restores Filled.
- Completed behavior and completed `ImportItem` read-only (action row removed, not disabled).
- Target trip chosen before import creation; Add and Batch Add both confirm into it.
- Add, Reject, Batch Add, Batch partial failure (external behavior), match-candidate selection,
  supplement flow, the 3-screenshot cap, responsive behavior, accessibility.
- Edit Place: full-screen page, route and field list settled — **the page layout itself is still
  待設計** (a separate design task, not a PENDING marker).
- The three fields *not* shown on the result card (推薦品項, 城市或區域, 辨識信心程度), with reasons.
- The DS changes made this round (`Button` aria props, `PlaceResultCard`'s new props) — these are
  component responsibility and should be written back into DS source rather than left as page
  overrides.

### OPEN — do not decide

- **Post-add navigation** — whether to navigate, show a toast, or go to the collection page. No
  navigation wording anywhere in the handoff counts as decided. `completed` therefore presents a
  read-only summary instead of redirecting: `/trips/:tripId` isn't designed, so a redirect couldn't
  be verified, and redirecting to an unchanged collection page after an all-rejected import makes no
  sense.
- **Places candidate count** — the 3 candidates in the preview are design test data, not a product
  or API limit. `MVP.md` and `ARCHITECTURE.md` don't specify a count, and ARCH §2.2 forbids assuming
  a maps/Places provider. The UI for more than 3 (scroll, paging, map preview, promotion to a sheet)
  is undefined. **Unrelated to the 3-screenshot cap, which is FINAL.**
- **Delete-in-progress / delete-failure feedback** on Home's delete-collection flow.

### PENDING DESIGN

- **Re-search flow — required before frontend implementation.** It is the *only* escape hatch when
  the correct match isn't in the returned candidate list, and it needs a keyboard, an input and a
  results list — a full page, not a row. This round covers only the entry point, its trigger
  condition (`review_required` only), and the `onResearch(placeId)` boundary. **Do not read
  "the entry exists" as "the flow is designed."**
- **Target-collection picker UI** — bottom sheet vs. page undecided.

### OUT OF SCOPE

- `TripPlace` editing (route and screen) for already-added places.
- `/trips/new`, the create-collection screen itself.
- Technical choices that must not be written up as settled: the Instagram public-content fetching
  service, AI model/provider, database, background-job approach, batch coordination, concurrency
  control, idempotency strategy, authentication library, Places API provider and candidate cap,
  screenshot storage provider and retention, and the application-side UI component library.
