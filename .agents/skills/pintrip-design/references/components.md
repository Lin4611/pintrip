# PinTrip App Shell, Components, and Decoration System

Source: `_ds/pintrip-design-system-*/_ds_manifest.json` and `_ds_bundle.js`,
`HomeScreen.dc.html` (Frontend handoff section), `ImportScreen.dc.html` (spec section). Global
rules that apply across screens — screen-specific layout numbers live in
[screens.md](screens.md); tokens live in [design-system.md](design-system.md); Import state
behavior lives in [import-lifecycle.md](import-lifecycle.md).

## App Shell

- One shared shell across all three screens (Home, `/trips/new`, Import): status-bar safe area →
  scroll slot → BottomNav. The nav does not re-render or jump when switching screens. Put it in the
  layout, not per page.
- **Mobile viewport**: 390×844 base frame; 360 and 430 extend the same markup via breakpoint
  variables, not a separate design per breakpoint. Home and Import each have two (the gutter, and
  one component's fixed-width column); `/trips/new` has only the gutter.
- **Safe area**: top uses `env(safe-area-inset-top)` plus a fixed content offset (12px on Home, 8px
  on Import); the app never draws its own status bar (`status-bar.png` is preview-only, not product
  UI). Bottom nav height = 72px + `env(safe-area-inset-bottom)`; content bottom padding is 72px on
  Home and 32px on Import, so the last card / CTA can scroll fully clear of the nav.
- **Scroll**: exactly one scroll container per screen — `flex:1; min-height:0; overflow-y:auto;
  overscroll-behavior:contain`. The frame itself is `overflow:hidden`. Horizontal overflow is
  prevented by three things holding simultaneously: the scroll container `overflow-x:clip` (not
  `hidden`, which would create a second scroll container), each card `overflow:hidden`, and text
  columns `min-width:0`.
- **z-index**: content 0 → decorations 2 (tape/wash) → large stickers 3 → card menu 4 → nav 5 →
  keyboard 7 → delete-confirm dim 8 → delete-confirm sheet 9. The card menu sits above cards and
  decorations but below the nav, and must not be clipped by the card. Never stack a scrim or
  gradient above nav (the delete dim is the one listed exception, and it deliberately blocks the
  list behind it rather than hiding nav).
- **Overscroll**: `contain`; no pull-to-refresh decoration, rubber-banding is left to the system.

### Bottom Navigation

- BottomNav: 72px tall, top corners radius 26px, opaque paper (`--paper-nav`) with a soft upward
  shadow — never frosted glass. Exactly two equal destinations: 旅行收藏 — 匯入.
  Account/avatar lives only in the Home header, never in the nav.
- Inactive tabs: desaturated + 55% opacity, never swapped for an outline icon variant.
- **No FAB.** The centre `＋` is gone: every PinTrip screen passes `showFab={false}`, and the
  `fabOffset` override was withdrawn with it. The DS still ships `FabButton` and `--fab-size` /
  `--shadow-fab` / `--ease-spring` — PinTrip simply does not use them, so do not delete them from
  the design system. Creating a collection now runs through Home's Start New Trip card only.
- The nav has exactly the two cells above. Whether `/imports` (the import history list, MVP §5.10)
  ever gets a nav slot is **not decided anywhere in the handoff** — don't infer one.
- Tapping the currently-active nav item scrolls back to top rather than reloading/re-analyzing.
- On Import, the nav is **hidden** (not just covered) whenever a text field is focused — it fades
  back in over 200ms on dismiss, no slide.

### Keyboard behavior (Import composer and supplement form)

**The keyboard is the device's native system keyboard. There is no custom keyboard component to
build.** The keys drawn in the handoff are `SoftKeyboard`, explicitly labelled mockup-only — a
placeholder standing in for the system keyboard, and it does not go into product code (the same
status as the mockup status bar). What you implement is the *app's response* to the keyboard
appearing — visible-viewport sizing, nav hiding, scroll positioning — never the keyboard itself.

**The five Keyboard preview states verify the composer's keyboard layout only.** `kb-empty`,
`kb-filled`, `kb-long`, `kb-reel` and `kb-invalid` are all `created: false` / `entry: new` /
composer source — they exist to prove the LinkInput + Analyze CTA layout survives the keyboard in
its empty, filled, long-URL, long-Reel-URL and invalid variants.

**They are not the full inventory of places a keyboard appears.** Once an Import exists, the
`SupplementPanel` still has editable fields — four text fields plus the screenshot slots, reached
from `needs_input` and `failed` (`created: true`, source shown as read-only `SourceRow`). The
preview simply doesn't demo a keyboard on those states. **When the keyboard opens over the
supplement form, the same rules apply**: BottomNav hides, the focused field stays visible, the page
scrolls via container `scrollTop`, and multi-line fields grow under the compensation rule below.
Read "the source row is read-only after `received`" as being about *the URL*, not about the screen
having no inputs.

The rules themselves are a finalized spec, not suggestions:

- App Shell height follows `visualViewport.height`, **not `100vh`** — the keyboard rising just makes
  the scroll layer shorter; the relative positions of header, field and CTA don't change.
- Focus turns the field border blue with a 3px soft glow; no scale, no shift, no clearing of
  existing content.
- **The Analyze CTA must stay visible.** Field + error message + CTA are aligned to the keyboard
  edge as one group, scrolling the header if needed. Scroll into view is computed from the
  container's `scrollTop` (never `scrollIntoView`, which drags the whole App Shell), leaving 16px
  of breathing room.
- The keyboard may cover the result list, but never the field, the error message, or the Analyze
  CTA.
- **The supplement form's submit button is allowed to be covered** — this is an explicit difference
  from the Analyze CTA, because Analyze is a single field's only exit while the supplement form is
  not. Restoring `scrollTop` on dismiss is enough to bring it back.
- Multi-line supplement fields grow with content up to 5 lines, then scroll internally; while
  growing, `scrollTop` is compensated so the caret keeps its distance from the keyboard edge and
  the view never jumps. Content below moves down; content above does not move.
- Screenshot slots don't coexist with the keyboard: dismiss it before opening the picker (＋新增 or
  ✕), then restore `scrollTop` and open the picker.
- Keyboard and bottom safe-area inset don't stack: while the keyboard is open the bottom inset is
  consumed by the keyboard and content padding drops to 16px; the 72px + inset padding returns on
  dismiss.
- The keyboard appears wherever there is an editable field: the composer (URL) and, on a persisted
  Import, the `SupplementPanel`. A persisted Import has no editable *URL* — that is the read-only
  `SourceRow` rule — but it is not input-free.

## Component inventory

### Design-system components (the bundle, `_ds_manifest.json` — 21 total)

Do not invent additional DS components. If a task needs a *design-system* component not listed here,
treat it as underspecified and ask.

| Group | Components |
|---|---|
| buttons | `Button`, `IconButton`, `FabButton` (shipped by the DS but **not used by PinTrip** — see Bottom Navigation) |
| forms | `LinkInput` |
| cards | `TripCard`, `PlaceResultCard`, `StartTripCard`, `BatchAddPanel`, `NoteCard` |
| display | `Wordmark`, `Avatar`, `ScreenTitle`, `SectionHeader`, `CategoryBadge`, `Tag`, `CategoryIcon`, `Sticker`, `LocationLine`, `AnalyzeStatus` |
| navigation | `AppHeader`, `BottomNav` |

Three of these are **intentional additions** the masters implied but didn't literally draw — treat
them as legitimate, not scope creep: `Sticker` (positioning wrapper for the tape/cut-out decoration
layer), `CategoryIcon` (wrapper for the die-cut glyphs on trip-card footers), `IconButton` (the
round back control, generalized).

**There is no standalone `PhotoFrame` component.** The white polaroid-style frame around a result
card's photo (5px white border + 6px radius + sticker shadow) is `PlaceResultCard`'s own built-in
photo treatment. Don't imply it's independently reusable in a component tree or refactor it out as
one without a documented reason.

### Page-level composites (not DS components — compose these in the app)

These appear in the handoff component trees but are **not** in the design system. Build them in the
app; don't go looking for them in the bundle, and don't push them into the DS without a decision.

- **Home**: `BrandLockup`, `CollectionSummary`, `TripList`, `TripCardSlot` (decoration wrapper),
  `TripCardSkeleton`, `ErrorCard`, the `•••` card menu (anchored dropdown), and the delete-confirm
  sheet. The card menu is page-level markup — `_ds_manifest.json` has no menu/dropdown/popover
  component. Its spec is `HomeScreen.dc.html`'s own markup. **Known gap:** that same export
  recommends folding the behavior into a DS `MenuPopover` rather than leaving it Home-specific.
  The user's decision is to keep it page-level and **not** ask Claude Design to promote it. When it
  should be promoted is not settled — a second consumer (e.g. the target-collection picker landing
  on a popover) would be the natural trigger, but treat that as a suggestion, not a rule.
- **Import**: `ImportHeader`, `ScreenIntro`, `TargetCollectionRow`, `LinkInputSection` (composer
  only), `FieldError`, `SourceRow`, `ResumeSummaryRow`, `AnalyzeStatusArea`, `NoticeCard`,
  `ExitStack`, `EndImportConfirm`, `SupplementPanel` / `SupplementField` / `ShotSlots`, `ResultList`,
  `ResultCardSlot` (decoration wrapper), `AddFailureNotice`, `DispositionRow`, `BatchAddSection`,
  `CompletedSummaryCard`.

### Design-system changes made this round (fold back into component source)

The handoff notes these as **component responsibility, currently carried as local modifications to
`_ds_bundle.js`** — they should be written back into the DS component source rather than living as
page-level overrides:

- `Button` — added `ariaLabel` / `ariaDescribedby` pass-through. Use these props; do not patch aria
  onto a wrapper element.
- `Button` size `sm` — height raised **40 → 44px** to meet the 44px tap minimum. The token itself
  was changed rather than overridden per usage, because `sm` has a small, enumerable set of
  consumers. Every result card grew 4px as a result and nothing else moved.

  **Full list of `sm` consumers — treat this as the regression scope whenever `sm`'s height,
  padding, type size or icon gap changes:**

  | Consumer | Buttons |
  |---|---|
  | `PlaceResultCard` — action row | 3 (編輯 / 拒絕 / 加入) |
  | `PlaceResultCard` — reject confirm row | 2 (取消 solid flex 1.35 / 拒絕 outline flex 1) |
  | `PlaceResultCard` — 重新搜尋 | 1 per match form (full-width in the expanded candidate list, and again in the unmatched form) |
  | `EndImportConfirm` — end-import confirm row | 2 (取消 solid flex 1.35 / 結束處理 outline flex 1), full-width |

  `EndImportConfirm` is a **page-level composite, not part of `PlaceResultCard`** — it is the
  in-card confirm row on the `NoticeCard`, so a change to `sm` reaches it without touching
  `PlaceResultCard` at all. Verify it alongside the result card; don't scope regression checks to
  the DS component. Note the action row's width budget only constrains `PlaceResultCard`'s 3-button
  row — the two 2-button confirm rows have far more room at 360.
- `PlaceResultCard` — added `readOnly` + `dispositionLabel` (completed read-only disposition row),
  `failed` + `failureText` + `failureId` + `failureLabel` (batch failure notice), `adding` (retry
  loading), `editAriaLabel` / `rejectAriaLabel` / `addAriaLabel`, and `onRetry`.
- `BottomNav` — added `showFab` (defaults to `true`; all three PinTrip screens pass `false`). The
  previous `fabOffset` (−14px) override was withdrawn along with the FAB.
- `CategoryBadge` / `PlaceResultCard` — `KINDS` and `TAG_TONE` realigned to the five MVP
  categories (`shop` → `shopping`, `stay` removed, `other` added), with `_adherence.oxlintrc.json`
  updated to reject anything outside them.

`docs/ARCHITECTURE.md` §2.1 carries the same list — keep the two in step when the bundle changes.

### Notable component contracts

- **`Button`** — sizes `sm` 44 / `md` 48 / `lg` 54; variants `primary`, `action` (coral),
  `solid`, `outline`, `ghost`. `sm` uses 13px type, 10px horizontal padding, 5px icon gap and
  `white-space:nowrap`, so its real width is content-driven, not flex-ratio-driven. `sm` is used by
  `PlaceResultCard` **and** by `EndImportConfirm` — see the consumer table above before changing it.
- **`CategoryBadge`** — kinds are `cafe`, `food`, `attraction`, `shopping`, `other`, matching
  `docs/MVP.md` §5.9 exactly. `TAG_TONE` was aligned in the same pass, and
  `_adherence.oxlintrc.json` now fails lint on a `kind` / `category` outside those five, so a wrong
  value is caught rather than silently falling through `KINDS[kind] || KINDS.cafe` to a cafe badge.
  `category` is an enum, never free text — never widen it to match something the DS happens to
  ship. `flex-shrink:0`; with the labels fixed at two Chinese characters the badge no longer
  squeezes the place name, but if longer labels ever return, the **badge** truncates, not the name.
  **Known gap:** at 12px bold white-on-fill none of the five reaches WCAG AA 4.5:1 — measured
  `other` 3.91, `shopping` 2.89, `cafe` 2.80, `attraction` 2.36, `food` 1.51. This predates the
  category work and is a property of the pastel palette, not of any one kind. Flag it; don't
  recolour the palette on your own.
- **`Tag`** — tones `blue`, `butter`, `lavender`.
- **`Sticker`** — tape patterns `solid`, `gingham`, `dots`, all CSS-generated.
- **`TripCard`** — two-column: text left, square photo right (photo column is the breakpoint value,
  text absorbs remaining width). Title + note both need `-webkit-line-clamp: 2` — **not built into
  the DS component yet**; the handoff demonstrates it as a CSS override and it should be folded in.
  Card height is never fixed — it's whatever the text column needs; the photo `align-self: stretch`es
  to match and re-crops with `cover` (ratio drifts 0.85–1.05). Footer row (category stickers +
  place count) is `flex-wrap: wrap` with `row-gap: 6` so stickers never squeeze the count, and the
  count is `white-space:nowrap`.
- **`PlaceResultCard`** — two-column: fixed/breakpoint photo column left (in the 5px white frame),
  text right, `gap 12`, text column `flex:1; min-width:0`. Place name is single-line `nowrap` +
  ellipsis (not clamped). Description and address are each `line-clamp: 2`. One shared decorative
  mark slot (`markSrc`) at a fixed position (`right:10 top:46`, 20×20) driven by `category`.
  **The action row spans the full card width** (across both the photo and text columns), pinned to
  the bottom — it is no longer inside the text column. Three actions: 編輯 (outline, flex 1) : 拒絕
  (outline, text only, no icon, flex 1) : 加入 (solid, ＋/✓, flex 1.35). Beyond `matched`, the
  address row has `待選擇` and `未匹配` states — see [import-lifecycle.md](import-lifecycle.md).
- **Action-row width budget (hard constraint)** — at 360 the row has 304px usable. The terminal
  labels (✎ 編輯 / 已拒絕 / ✓ 已加入) measure 88 + 88 + 111 + 16 gap = **303px**. There is 1px of
  slack: do not add a fourth action, do not lengthen any terminal label, and the reject button must
  stay icon-less. Retry reuses the 加入 button rather than adding a button.
- **`StartTripCard`** — full width, fixed 104px height, 1.5px dashed border (no shadow — "not a
  thing yet" affordance), world-map cut-out background multiplied at 90%, right-aligned, does not
  scale with viewport width.
- **`BatchAddPanel`** — dashed 1.5px, r20; luggage sticker left, sparkles sticker right. It exists
  **only in `review_required`**. Its count is derived from "matched and not yet dispositioned" —
  never the candidate total. When every candidate is dispositioned the Import becomes `completed`
  and the panel plus its commit CTA are replaced by `CompletedSummaryCard`; the old "panel switches
  to a completion message" behavior is **obsolete**. The sparkles are removed on batch failure —
  the panel doesn't celebrate a failure.
- **`AnalyzeStatus`** — reserves a fixed 24px min-height even when idle/empty, specifically so
  nothing shifts when status text appears or disappears.

## Decoration system

Decorations (paper tape, cut-out stickers) are **never** part of the component they decorate — they
live in a `position:relative` wrapper *around* the card, are `position:absolute`, and always carry
`pointer-events:none` + `aria-hidden`. This keeps the card itself reusable elsewhere. The wrapper
must never be `overflow:hidden` (it would clip the tape crossing the card edge) — horizontal
clipping is handled by the scroll container's `overflow-x:clip` instead. Decorations never enter
document flow and never change card height.

### Home: Trip Collection Card presets (final)

**Every Trip Collection Card has exactly one paper tape — no card ships without one, and none gets
a second.** There are four destination-agnostic presets, assigned as a complete set (not built
piece-by-piece). Layering discipline: base tape (always, doesn't count as a sticker) → at most one
primary large sticker → at most one secondary low-weight element. Never two tapes, two large
stickers, or three-plus high-contrast decorations.

| Preset | Tape | Extra element(s) |
|---|---|---|
| A — Coral Journey | CSS solid coral `#F7D9CE`, 46×15, top −6 / left 18, rotate −14°, opacity .92, r2, z2 | `trip-decoration-postmark-generic.png` 60×60, top 15 / right 15, rotate −7°, opacity .88, z2, **multiply**, no shadow |
| B — Lavender Botanical | CSS dotted lavender (`#D8CBEC` on `#F1EDF7`), 50×16, top −7 / left 20, rotate −9°, opacity .92, z2 | `trip-kyoto-decoration-lavender.png` 74×90, bottom −8 / right 12, rotate 4°, opacity 1, z3 (shadow baked into the PNG) + `trip-kyoto-decoration-wash.png` 84×38, bottom −12 / right 26, rotate −4°, **opacity .55**, z2 — sticker underlay only |
| C — Grid Scrapbook | CSS grid `repeating-linear-gradient(90deg,#D8CBEC 0 3px,transparent 3px 7px)` on `#EFE4FA`, 54×16, bottom −6 / right 22, rotate 7°, opacity .92, r2, z2 | none — **this is also the fallback preset** |
| D — Butter Mail | CSS butter `#F3E3B8`, 58×17, top −8 / left 26, rotate −6°, opacity .92, z2 | `sticker-envelope.png` 44×37, bottom −7 / right 16, rotate 6°, opacity 1, z3 |

Assignment rules (do not deviate):
- A collection draws one full preset **at creation time**, equal probability A/B/C/D, persists it,
  and keeps it permanently.
- Never derive the preset from card index, render order, or re-randomize on render — it must be
  stable across sort, delete, reload, app restart, and viewport change.
- Legacy records without a stored `decorPreset` fall back to **C** — never re-roll, never render
  with no decoration.
- Presets are never chosen by destination; MVP has no user-facing control to pick, change, or
  disable decoration.
- When several collections are created in a row, *try* to avoid repeating the immediately previous
  preset — best-effort only; it must never block creation.
- `trip-tokyo-decoration-paperclip.png` and `trip-tokyo-decoration-stamp.png` are kept in the repo
  but are **not** in any preset and **not** in the assignment pool (the paperclip duplicates what
  tape already signals; the stamp is destination-specific reference art) — do not wire them up
  without a product decision.
- The Start New Trip card's centered butter tape is a fixed brand element, outside the preset pool
  and outside the randomization.
- The `data-decor-preset="A|B|C|D"` attribute on the first node of each decoration group exists only
  for handoff cross-checking — it is not a product attribute.

### Import: Place Result Card decoration (final, category-driven)

Both the tape variant and the marginal mark are derived from `category` — **never** from list index
or render order. Tape geometry: 60–64 × 17px, `top:-7`, `left` 24/26/30 by breakpoint, opacity .92,
r2, crossing the card's top edge, z2.

| category | tape | mark |
|---|---|---|
| `cafe` | blue gingham, −8° | `place-mark-heart.png` (coral) |
| `food` | butter, +6° | `place-mark-star.png` (yellow) |
| `attraction` | lavender dotted, −5° | `place-mark-flower.png` (purple) |
| `shopping` / `other` | butter, +6° | none — don't pass `markSrc` |

- The same place keeps the same tape + mark across sort order, disposition state, all three
  viewports, and every screen state — decoration is a stable visual identity per place, not per
  position.
- All three marks share one component slot (`markSrc`): size 20, `aria-hidden`,
  `pointer-events:none`, absolute, outside document flow, same coordinates for every variant —
  implement one shared slot, not three per-variant elements or CSS rules.
- "Nature" is photo content, not a category — e.g. Seongsan Ilchulbong is `attraction`.
- Non-card decorations on Import: one envelope in the header (52px, rotate 4°, the page's only one),
  one curved arrow beside the status line (36px, `right:2 top:-8`) that appears **only** for a
  freshly-analyzed `review_required` — not on `completed` and not on batch failure, because neither
  is a moment worth celebrating. The Analyze CTA's sparkle is button content, not a decoration
  layer.

### General decoration rules (all screens)

- Rotation: Home's rules give −14°…+6° (preset C's tape sits at +7°), Import's give −9°…+6°. Two
  decorations in the same preset or on the same card never share the exact same angle.
- All px offsets are fixed across 360/390/430 — never use `%` positioning for decoration (it risks
  crowding titles, menu buttons, or category badges on narrow screens). Right-side decorations are
  right-anchored, never positioned off the photo column width.
- Counts are capped and not to be increased: Import header 1, status line 1, each card at most one
  tape + one mark.
- Decorations never carry the only signifier of information — they're always supplementary to real
  text/props, and they never appear on the delete-confirm sheet (the one paper surface with no
  decoration at all, because "keeping something" is the wrong tone for deleting).

## Assets — the two locations and what each is for

The same asset files exist in two places with **different responsibilities**. Use the right one for
the job; they are not interchangeable.

| Location | Responsibility |
|---|---|
| `docs/design/claude-design-export/assets/**` | **Canonical source** for design delivery and review. Look here to confirm an asset exists, check its real filename, or verify a build against the design. Never referenced by app code. |
| `public/design-assets/**` | **The App runtime location.** Application code references these as **`/design-assets/...`** — the served path, not a repo-relative one and never a `docs/...` path. |
| `uploads/` (and any raw material no shipped screen references) | Original high-resolution plates kept for provenance and for regenerating outputs. **Never used directly by the App**, in either location. |

So the working rule is: **verify against the design export, reference `/design-assets/...` from
code.** If an asset you need is missing from either location, stop and report it — don't add one,
and don't reach into `uploads/` to fill the gap.

## Assets — usage principles

- Always reuse the exact existing file, by its documented filename — never redraw, recolor, upscale,
  or approximate with a different icon. Filenames are identical in both locations, so a name checked
  against the design export is the name to use in `/design-assets/...`.
- `assets/photos/*-clean*.jpg` (1x/2x/3x) are the current, decoration-free photo plates — use
  these. Trip covers are square 200/400/600; place photos are 132×150 / 264×300 / 396×450, all
  true downscales of the original high-resolution uploads, sharing one crop and focal point across
  1x/2x/3x. The older `*.png` files have decoration composited into the pixels; they remain valid
  **within the design export** — as before/after reference, and as mock fixtures in demo frames —
  but they are **not runtime assets**: don't ship them, and don't treat them as fixed product
  content.
- **Where production place and trip photos come from is `OUT OF SCOPE / UNDECIDED`.** Neither
  `docs/MVP.md` nor `docs/ARCHITECTURE.md` settles it. Do not write any source into implementation
  as settled — not a named vendor, not "the Places provider", and not the repo's own clean plates.
  What the plates here *do* specify is **treatment**: crop, ratio, radius, framing, `cover` /
  `center`. Treat the source as an open question to raise, not one to answer.
- The originals in `uploads/` are never overwritten, and never referenced by the App — they exist to
  regenerate outputs from. Photo work is limited to crop / resize / object-position — no color
  grading, no filters, no generative fill, no upscaling a low-res asset to fake a high-res one.
- Decorative PNGs are plain `<img>` + `aria-hidden`, **not** run through `next/image` — they're
  layout decoration, not content images. Place/trip photos do go through `next/image` with `sizes`
  set to the documented breakpoint widths (148/172/196 on Home, 108/120/132 on Import), `fill` +
  `object-cover`.
- Washi tape textures are CSS gradients (solid / gingham / dotted), not image files — don't ship a
  tape PNG.
- The design handoff maintains only 1x/2x/3x JPG + transparent decoration PNG — WebP/AVIF
  conversion is a build-pipeline concern, not something to add to the design asset set.
- Asset paths **inside the handoff files** are relative `./assets/**`. That is the handoff's own
  addressing, not the App's — don't copy those paths into code; translate them to
  `/design-assets/...`. Fonts come from the DS `tokens/fonts.css`.
