# PinTrip Accessibility Contract

Source: `ImportScreen.dc.html` (ACCESSIBILITY card, plus the a11y notes in INTERACTION, PLACE RESULT
CARD and React/NEXT.JS) and `HomeScreen.dc.html` (DELETE TRIP CONFIRM). Marked **FINAL** in the
decision ledger — implement it as specified rather than approximating it.

Screen-specific layout lives in [screens.md](screens.md); the state model in
[import-lifecycle.md](import-lifecycle.md).

## Cross-cutting rules

- **Tap targets are always ≥ 44 × 44** — back, 開啟, 更換, screenshot ✕, every in-card button
  (`Button sm` was raised from 40 to 44 for exactly this reason), and each candidate row.
- **Disabled always means the native `disabled` attribute**, never `pointer-events` simulation, so
  neither pointer nor keyboard can trigger it. Visual treatment is opacity .45 (.4 for a button
  mid-retry) with no change of color, size or position.
- **Focus-visible is 2px `var(--blue-400)` outline + 2px offset**, radius following the element.
- **All decoration is `aria-hidden` + `pointer-events:none`** — tape, marks, envelope, curved arrow,
  sparkles, the mockup status bar and the mockup keyboard. Decoration is never the only signal of
  any state.
- **`prefers-reduced-motion`** turns off the sparkle pulse and every non-essential animation; state
  changes become instant and must not move the layout as a result.
- Never leave a control that looks operable but isn't. On a `completed` Import, Edit / Add / Reject /
  Retry are **absent from the DOM**, not disabled placeholders — a disabled row still announces
  capability that doesn't exist.

## Import screen

### Link field (composer only)

- Invalid: `aria-invalid="true"` + `aria-describedby="import-link-error"`; **both attributes are
  removed** when not invalid.
- The invalid message is `role="alert" aria-live="assertive"`, placed 8px below the field — the
  coral border alone is not sufficient signalling.
- The field has a visually-hidden `<label for="import-link-input">` and `inputmode="url"`.
- The clear button is 24px visually with a 44px tap target, fixed at the field's right inner edge and
  still reachable while the keyboard is open.
- Analyze disabled uses `Button`'s `disabled` prop.

### Persisted source row

- It is **not an editable input**: a `role="group"` container plus text, with
  `aria-label`「這筆匯入的來源貼文（唯讀）」. The visible small-caps label「來源貼文（唯讀）」carries
  the same information visually.

### Status line

- `aria-live="polite"`, announcing the analysis result and the number of places found.

### Result card actions

- Every action's `aria-label` includes the place name:「加入旅行收藏：春日咖啡」/「拒絕候選地點：
  春日咖啡」/「編輯候選地點：春日咖啡」.
- After adding, the label becomes「已加入旅行收藏：…」and all three of that card's action buttons go
  natively `disabled` while staying in position.
- Retry after a failure relabels the same button「重新加入旅行收藏：{地點}」; while retrying it is
  natively `disabled` with its label and position unchanged.
- `aria-label` / `aria-describedby` are passed through `Button`'s **`ariaLabel` / `ariaDescribedby`
  props** (added to the DS this round). Do not patch aria onto a wrapper element.

### Batch failure announcements

- Each failing card's notice block is `role="status" aria-live="polite"` **with a unique id**, named
  per item as `import-add-error-{itemId}`.
- That card's 加入 button points at it with `aria-describedby`, so the reason is bound to the right
  card rather than being one vague page-level message.
- When retry starts, the prefix and body both switch to retry wording — leaving the failure prefix
  in place would make the live region read out a contradiction in one breath.

## Home screen — TripCard `•••` menu

- The trigger carries `aria-haspopup="menu"` + `aria-expanded`, and a **Traditional Chinese**
  `aria-label` naming the collection (e.g.「「東京」的更多選項」). Its tap target is padded to
  44 × 44 even though the glyph is smaller.
- **The DS hard-codes that label in English.** `TripCard` emits `aria-label="Trip options"` with no
  collection name, so the Chinese label only exists because the page overrides it explicitly. Do
  not assume the component gets it right, and do not patch `_ds_bundle.js` — override at page level
  until the DS exposes a `menuLabel` prop (see the foldback list in
  [design-system.md](design-system.md)).
- Each row's `aria-label` also carries the collection name (「重新命名旅行收藏：東京」/
  「刪除旅行收藏：東京」).
- The menu is `role="menu"`; each row is `role="menuitem"`, 44px tall, single-line.
- On open, focus moves to the first row. `Esc` closes it and returns focus to the `•••` button.
  (Arrow-key movement between rows is the standard ARIA menu pattern rather than an export rule —
  the export specifies focus-in and `Esc` only.)
- **Only one menu is open at a time.** Tapping card B's `•••` while card A's is open collapses A
  and opens B on that same interaction — the outside-dismiss must not swallow the tap and force a
  second one. Focus lands on B's first row. Tapping the same `•••` again toggles it closed.
- Scrolling the list closes the menu.
- The menu is not modal: it has no dim and clicking outside simply closes it. Do not give it
  `aria-modal` — that belongs to the delete confirmation below. (The export's forward-looking note
  about a future DS `MenuPopover` mentions a focus trap; that describes the component it hopes to
  build, not this page-level menu. Flag it rather than silently adopting one.)

## Home screen — create / edit collection form

- Required vs optional is conveyed by a text chip next to each label, never by colour alone and
  never by an asterisk.
- While the CTA is disabled, the hint under the name field is `role="status"` and the CTA points at
  it with `aria-describedby`. The hint occupies its space whether or not it is visible, so revealing
  it moves nothing but the CTA.
- Disabled is the native attribute, so the CTA is skipped by the tab order rather than being
  focusable-but-inert.

## Home screen — delete confirmation sheet

- `role="dialog"` + `aria-modal="true"`, with `aria-labelledby` on the title and `aria-describedby`
  on the impact text.
- On open, focus moves into the sheet and is trapped there.
- `Esc` and clicking the dim are both equivalent to 取消.
- Both buttons are 48px tall (≥ 44).
- The list behind keeps its scroll position and cannot scroll; nothing behind moves or fades, and
  cancel restores the screen exactly.
