# PinTrip Screen-Specific Rules

Source: `HomeScreen.dc.html` (canonical for Home), `NewTripScreen.dc.html` (canonical for the
create/edit collection form) and `ImportScreen.dc.html` (canonical for Import Link + Analyze
Result). Global rules that apply to all three live in [design-system.md](design-system.md) and
[components.md](components.md); the Import state model and decision ledger live in
[import-lifecycle.md](import-lifecycle.md). This file is only what's specific to one screen. Don't
promote a number from here to a global rule, and don't apply a Home-only number to Import or vice
versa.

All three screens share: 390×844 base frame, App Shell (BottomNav 72px, two cells, no FAB),
safe-area handling, and the "almost nothing is fluid across 360/390/430" responsive model. The
number of fluid values differs: Home and Import each have the gutter **plus** one component's fixed
column (photo 148/172/196 and 108/120/132 respectively); `/trips/new` has only the gutter.

**Numbers marked 實測 in the source are measurements, not specs.** Use them to verify your build;
never hardcode them as heights.

---

## Home / Trip Collections

### Layout (390 baseline)

- Content top inset 12px. Wordmark (58px, serif lockup) → tagline (152px wide, script) 10px below.
  Avatar (52px circle, 2.5px paper border) + note sticker, right-aligned column, 12px gap, note
  rotated −3°.
- Brand block → section header (「我的旅行收藏」) 26px. Header → collection-count
  line (「目前有 2 個旅行收藏 · 64 個地點」) 6px. Count line → trip list 14px.
- Trip cards: 16px gap between cards. Card padding 11/7/11/15 (top/right/bottom/left). Photo column
  fixed width per breakpoint: **148px @360 / 172px @390 / 196px @430**; right-anchored decorations
  never key off this. Card corner radius 20px, shadow `0 4px 14px rgba(122,96,58,.07)`. In-card
  divider 1px dashed cream. Photo corner radius 13px.
- Card height is **never fixed** — entirely driven by the text column; the photo stretches and
  re-crops with it. Measured 183 / 196 / 218px at 360/390/430, up to 225px with long content.
- Start New Trip card: 104px tall, full width, 1.5px dashed border, always the last item in the
  list; its world-map cut-out is right-aligned and does not scale with viewport width.
- Content bottom padding 72px (+ safe-area inset) so the last card / Start New Trip fully clears
  the nav.

### Responsive (the only two variables that change)

| | 360 | 390 (baseline) | 430 |
|---|---|---|---|
| Gutter | 16px | 20px | 24px |
| Photo column | 148px | 172px | 196px |

Everything else — header layout, wordmark/tagline/avatar sizes, card padding, radii, nav, every
decoration offset — is fixed across all three widths. The text column measures a near-constant
150±6px. 360 is the narrowest safe value: if the text column gets any narrower, the 28px-equivalent
title is forced onto two lines.

### Long-content rules (verified at 360)

- Title: `line-clamp: 2`, fixed 8px gap to the `•••` menu, menu is `flex-shrink:0` — the title can
  never push into the menu. **Whether collection names have a character limit is undecided
  (`docs/MVP.md` §5.2); the layout handles any length, so do not infer a product limit from the
  layout.**
- Location line: single line, ellipsis; pin icon `flex-shrink:0`.
- Description (the collection note): `line-clamp: 2` at 13px/1.6, truncated with no "more" affordance.
- Place count: `white-space:nowrap` — three digits neither wrap nor shrink.
- Category stickers: footer row `flex-wrap: wrap` + `row-gap: 6`; when there are many, the row wraps
  rather than squeezing the count. Never shrink or crop stickers to fit.
- `article overflow:hidden` + text column `min-width:0` — no long string may produce horizontal
  scroll.

The collection note is `docs/MVP.md` §5.2's optional 收藏說明 (theme or feeling of the trip; it does
not affect classification, filtering, or the map). It is **kept in the card** even though removing
it barely changes height — the square photo is the height floor, so without the note the gap between
the text column and footer inflates from 8–55px to 66–115px and the card reads as empty.

### Pitfalls called out by the source

- Header must be `space-between`, not a grid/percentage layout — both sides are fixed-size art
  assets; a grid creates a large gap at 430px.
- Photo `object-fit: cover; object-position: center` only — never `contain`, never an `aspect-ratio`
  lock (it fights the adaptive card height, whose ratio drifts 0.85–1.05).
- Title and note both need `-webkit-line-clamp: 2` — not built into the DS `TripCard` yet; the
  handoff shows it as a CSS override and it should be folded into the component.
- Decoration positioning must live in the wrapper **outside** `TripCard`, and that wrapper must not
  be `overflow:hidden`, or the card can't be reused on other screens.
- Don't stack a scrim or gradient over the nav.
- The `•••` menu must render above the card and its decorations but below the nav, and must not be
  clipped by `TripCardSlot` or the card's own `overflow:hidden` — anchor it in an overlay layer, not
  inside the card's flow.
- Long place names, long hashtags and rotated tape can all push horizontal scroll — the three-part
  guard (`overflow-x:clip` on the scroll layer + `overflow:hidden` on the card + `min-width:0` on
  the text column) must all be present together.

### UI states

| State | Rule |
|---|---|
| Empty | Brand block stays; the summary line becomes one explanatory sentence; the only exit is Start New Trip; the note sticker moves below, centered, enlarged to 132px — no large illustration added. |
| Loading | Skeleton reuses the card's outer frame and dashed divider. Skeleton color is warm beige (`#F2EADC` / `#F5EFE4`) — **never gray**. Pulse: opacity 1 → 0.55 → 1, 1600ms ease-in-out; second card delayed 200ms. No shimmer sweep. **Skeleton height is unresolved — see below; do not implement a fixed 184px on the claim that it prevents layout shift.** |
| Error | Single dashed card, tone gentle and non-blaming; retry is an outline button, fixed at the card's bottom-left. |
| Long list | Card spacing unchanged; Start New Trip always last; bottom 72px padding lets it fully clear the nav. |
| Delete confirm | Screen-level sheet — see below. |
| Common to all | BottomNav exists and stays positioned identically across every state — only the content region swaps, never the surrounding frame. Home has exactly one list region that changes; normal/empty/loading/error all render into it with the outer frame and spacing unchanged. |

#### Skeleton height — export-internal conflict, PENDING DESIGN

`HomeScreen.dc.html` contradicts itself, and the contradiction is not resolvable from the export:

- The Loading state's skeleton markup hardcodes `height:184px`, and its STATE RULES row asserts
  「骨架沿用卡片外框、dashed 分隔線與 184px 高度，資料到位時無位移」— a fixed height presented as
  producing **no** shift on data arrival.
- The same file's RESPONSIVE RULES and LAYOUT / SPACING cards say TripCard 「不設固定高」, measured
  at **183 / 196 / 218px** across 360 / 390 / 430.

A single fixed 184px cannot equal an adaptive height that differs by width: it is ~1px off at 360,
**12px short at 390** and **34px short at 430** — and real cards vary further with content (up to
225px). **The "184px means no layout shift" claim therefore cannot hold as written**, and the
skeleton height is recorded here as **PENDING DESIGN**.

Until it is decided:

- **Do not implement a fixed 184px and do not describe it as matching the real card height.**
- **Do not invent a responsive skeleton height either** — deriving one from the measured 183/196/218
  would be a design decision, and those are measurements, not a spec.
- The rest of the Loading spec (outer frame, dashed divider, warm-beige palette, pulse timing,
  no shimmer) is unaffected and still applies.
- Note the likely origin, which matters for how much weight to give the number: every `TripCard` in
  this file carries `hint-size="100%,184px"`, a **canvas layout hint, not a rendered height**. 184
  appears to be that placeholder value, carried into the skeleton markup and then into the prose.
  This is the same stale-`hint-size` pattern as the no-collection guidance button, so treat
  `hint-size` values throughout the export as non-authoritative.

### Delete trip collection — confirm sheet

Basis: `docs/MVP.md` §5.2 (must clearly state scope of impact) + `docs/ARCHITECTURE.md` §8 (confirm
and verify ownership before deleting a Trip). It implements the four cross-screen destructive-action
rules in [design-system.md](design-system.md) — that card doesn't restate the rules, and neither
does this one.

- **Trigger path**: TripCard `•••` → anchored dropdown (重新命名／刪除旅行收藏) → choosing
  刪除旅行收藏 → this confirm sheet. The 刪除旅行收藏 item in the menu is **not** the executing
  control; it only opens the confirmation.
- **Form is decided: a screen-level sheet, not an in-card confirm row** (Import's reject
  confirmation uses the in-card row). The reason is information volume: it must list the place count
  plus four categories of data removed.
- **Layout**: bottom-aligned, full width, top corners 26px, `#FFFDFA`, padding 24/20/30 (+ safe-area
  inset), upward shadow `0 -8px 28px rgba(60,45,25,.20)`. Height is content-driven, never fixed
  (390 measured 383px ≈ 45% of 844; 410px with a two-line title). The button row is full width,
  `md` 48, gap 8, split flex 1.35 : 1.
- **Content order**: title (19px Quicksand 700, includes the collection name, `line-clamp: 2`) →
  one sentence with the place count (13px, the number in bolder ink) → dashed divider + the three
  「一併移除」rows → dashed divider + what is *kept* + the irreversibility line → button row.
- **Scope of impact** names four things: the import records and candidate places, the supplementary
  screenshots uploaded for this collection, the saved places and their source links, and the
  collection's place count. These map to ARCH §8's Import + ImportItem / attachments / TripPlace +
  TripPlaceSource / the Trip itself.
- **Shared places**: 「其他收藏也在用的地點資料不會被刪除。」 must be stated — a `Place` represents
  an external real-world location and may be referenced by other Trips, so it is not deleted with a
  single Trip. Without this line users assume the map data disappears too.
- **Irreversibility**: 「刪除後無法復原。」on its own line, 12.5px 700 coral `#C77A62`. This is the
  deliberate opposite of Import's 結束處理, which *can* be redone with a new import and therefore
  must not claim irreversibility.
- **Button roles**: 取消 = solid blue (flex 1.35, the visually heavier safe option) / 刪除收藏 =
  outline (flex 1). **No destructive/danger variant is added** — coral is the commit-CTA color in
  this app and reusing it for delete pollutes both meanings.
- **No decoration**: no tape, no stickers. Decoration here means "keep this, hold onto it", which is
  tonally wrong for deletion; this is the one paper surface in the app with no decoration.
- **Background dim**: `rgba(43,32,18,.24)`, flat warm, **no blur, no gradient** — the listed
  exception to the no-scrim rule, justified by modality. z-index dim 8 / sheet 9, both above nav 5;
  nav is not hidden but is blocked.
- **Behind the sheet**: the list keeps its scroll position and cannot scroll (`overflow:hidden`);
  cards, decorations and BottomNav do not move or fade. Cancel returns the screen exactly as it was.
- **Motion**: sheet slides up over 320ms `cubic-bezier(.32,.72,.28,1)` with the dim fading in
  together; the close is the same length in reverse. No spring.
- **OPEN — do not invent**: in-progress feedback and failure handling for the delete itself (retry
  entry point, how a partial delete is shown) are undefined in both `MVP.md` and `ARCHITECTURE.md`.
  This round defines only the confirmation UI and the `onConfirmDelete(tripId)` / `onCancel`
  boundaries.

### Interaction boundaries

- The whole TripCard is tappable → navigates into that collection (**destination not designed this
  round**). Press: `scale(.97)` + `brightness(.96)`, 120ms.
- Card `•••` menu: `stopPropagation`, opens an **anchored dropdown**, not a screen-level sheet —
  two single-line rows (重新命名 / 刪除旅行收藏), each 44px, no title row and no cancel button
  (tapping outside closes it). The `•••` tap target is padded to 44×44. 重新命名 routes to the
  `/trips/new` form with existing values; 刪除旅行收藏 opens the confirm sheet above. Only one menu
  is open at a time: tapping card B's `•••` while card A's is open must collapse A **and** open B
  on that same interaction — the outside-click close must not swallow it and force a second tap.
  Tapping the same `•••` again toggles it closed; scrolling the list closes it.

  **Anchoring — take these from the export, they are measured, not approximate:**

  - Fixed **172 × 109**, r14, padding 6, 1px `#E3D9C6` hairline plus a two-layer shadow
    (`0 14px 32px rgba(60,45,25,.24)` / `0 2px 6px rgba(60,45,25,.10)`). The menu and the card are
    both `#FFFDFA` — the boundary comes from the hairline and shadow, never from a different fill.
    The width is fixed rather than `max-content` because the shift clamp needs a known width.
  - Horizontally the menu's right edge aligns to the `•••`'s right edge, and the inset must be
    **measured at open time** (`wrapper right − trigger right`): the photo column steps 148/172/196
    across breakpoints, so a hard-coded value silently becomes "aligned to the whole card" with
    ~187px of slack. That alignment is only a *preference* — clamp it so the left edge never crosses
    8px inside the frame, and **clamp against the frame, not the card**: clamping to the card makes
    the left edge sit flush with the card and the menu reads as part of it. Overhanging the card
    slightly is intended.
  - Vertically the top edge is `max(trigger bottom, title text bottom) + 8px`. The 28px title line
    box sits ~13px below the 18px `•••`, so anchoring to the trigger alone **clips the collection
    name**; measured, the menu sits 8px below the title and 19px below the `•••`. Covering the
    destination line underneath is expected — an overlay covers content, that is not clipping.
  - Flips upward when `trigger bottom + 132px` (109 menu + 23 breathing room) would pass the nav's
    top edge, anchoring 8px above the trigger instead. Direction is measured at open time, so
    scrolling a card close to the nav and opening it there flips it.
- Start New Trip routes to `/trips/new`. It is the only entry point for creating a collection now
  that the FAB is gone, so it must stay reachable in every list state.
- Nav 旅行收藏 tapped while already active scrolls to top without reloading. Nav 匯入 switches
  screen; the inactive icon desaturates to 55%, same icon (no swap).
- Retry re-enters the loading skeleton then retries; disabled during retry at 45% opacity, no color
  change.

### Assets specific to this screen

`wordmark-serif.png` (58px — inner screens use the script wordmark), `tagline-script.png` (152px,
appears exactly once in the whole app), `note-paper.png` (rotate −3°; enlarged to 132px and centered
in the empty state), `avatar-user.png` (52px circle + 2.5px paper border — the only portrait in the
app), `trip-*-clean.jpg` (square 200/400/600), the preset decoration PNGs
(`trip-decoration-postmark-generic.png`, `trip-kyoto-decoration-lavender.png`,
`trip-kyoto-decoration-wash.png`, `sticker-envelope.png`), `pin-coral.png` (country level — street
level uses `pin-blue.png` on Import), the 27px `icon-*` category stickers (footer only),
`worldmap.png` (Start New Trip background cut-out, multiply 90%, right-aligned),
`nav-trips.png` / `nav-imports.png`.

#### `place-*.png` in the Home demo frames — mock fixtures, not product assets

Four Home cards use legacy `place-*.png` files as trip-card covers:

| Frame | Card | Reference |
|---|---|---|
| Home extreme | 濟州島慢步旅行 | `place-nature-jeju.png` |
| Home long list | 濟州 | `place-nature-jeju.png` |
| Home long list | 首爾 | `place-cafe-jeju.png` |
| Home long list | 大阪 | `place-food-jeju.png` |

That is the complete set. Every other photo reference on Home (the 360/390/430 responsive frames,
the remaining Extreme and Long-list cards, and the delete-confirm frame) uses
`trip-{tokyo,kyoto}-clean-2x.jpg`.

**These are mocks/fixtures for layout work and visual comparison — not production imagery, and not
a spec.** Their purpose in those two frames is stress-testing long content and list length; which
photo sits in the card is incidental. So there is nothing here to "fix":

- **Don't treat them as assets to be replaced.** They are fine where they are — legacy files may
  stay in the design export and be used for local visual comparison.
- **Don't ship them.** They are not runtime assets and not fixed product content; don't copy these
  references into app code or bundle the files as product imagery.
- **Where production trip and place photos come from is `OUT OF SCOPE / UNDECIDED`** — neither
  `docs/MVP.md` nor `docs/ARCHITECTURE.md` settles it. Don't write any source into implementation as
  settled: not a named vendor, not "the Places provider", and not these repo assets.
- **Nothing needs adding for 濟州, 首爾 or 大阪 to work with the current design files.** The asset
  set has clean covers only for Tokyo and Kyoto; that gap doesn't affect layout work or visual
  comparison against these frames, which is all these fixtures serve. That is a statement about the
  design files only — **it says nothing about runtime**, where the photo source is undecided; don't
  read it as a guarantee that no asset will ever be needed. For now: don't request, generate, or
  substitute one, and don't repurpose an Import place plate (132×150) as a square Home cover.

### React / Next.js boundary

AppShell belongs in the layout (status-bar safe area + scroll slot + BottomNav), shared with Import
so the nav never re-renders or jumps between pages. `TripCard` takes data props only; decoration
is rendered by `TripCardSlot` from the collection's **persisted `decorPreset`** — never from card
index or render order, never re-randomized on render, falling back to C when the field is missing.
Photos go through `next/image` with `sizes` matching 148/172/196 and `fill` + `object-cover`;
decoration PNGs stay plain `<img>` + `aria-hidden`.

---

## Create / Edit Trip Collection — /trips/new

`NewTripScreen.dc.html`. One form serves both `/trips/new` and rename/edit — the same fields, order,
spacing, validation and disabled rules. Build it as **one component with `mode: 'create' | 'edit'`
and `initialValues`**; copying it into two forms lets the validation drift. Only three things differ:
the screen title (建立旅行收藏 / 編輯旅行收藏), the CTA label (建立收藏 / 儲存變更), and whether
values are prefilled.

### Fields — exactly three, per MVP §5.2

| Field | Required | Notes |
|---|---|---|
| 收藏名稱 | required | Trimmed non-empty is the only submit condition |
| 目的地名稱 | optional | |
| 收藏說明 | optional | `textarea`, min-height 82, `resize:none`, scrollable; grey line below says it does not affect category/filter/map |

Required vs optional is shown by a chip beside the label (required `--coral-100`, optional
`--cream-200`, both with `--ink-700` text — the background carries the meaning, the text colour
carries contrast). No asterisks, and never colour alone.

**No character limit.** MVP §5.2 leaves it undecided, so: no `maxlength`, no counter, no input
blocking. The layout must survive any length — never reason backwards from the layout to a product
rule. While typing, a long name **scrolls horizontally inside the input** (no ellipsis, no shrink,
no wrap) — same rule as Import's long URLs. Truncation is the *display* side's job (`TripCard`
title `line-clamp: 2`, target-collection row single-line ellipsis), not this form's.

**Not on this screen**: dates, itinerary, cover photo picker, decoration picker. MVP §5.2 has no
such fields, and the visual style is assigned automatically at creation (see Home's preset
assignment) — the user never chooses it. Deleting a collection is also not here: it is a
destructive action and its entry point is Home's `•••` → screen-level confirm sheet.

### Submit and disabled

- CTA is full-width 48px solid blue, a single commit action.
- Disabled uses **native `disabled`** (45%, no colour/size/position change) — never
  `pointer-events` or a fake translucent state.
- While disabled, a `role="status"` line appears under the name field and the CTA's
  `aria-describedby` points at it. The line reserves its space: nothing except the CTA moves.
- Missing name only blocks submit — it never clears the other fields, and nothing is pre-marked red.
- In edit mode the CTA is enabled on entry (the name is already filled). Whether it should disable
  until something changes is **not decided** — don't assume either way.

### Layout

Frame 390×844, gutter 16/20/24. Header back 44 / wordmark 40 / envelope 52 rotate(4°) → title 14px;
title → form card 18px; card full-width r20 padding 18 with `--shadow-card`; 16px between fields;
label → field 6px. Single-line fields 48px, r12, 1.5px `#E3D9C6` border on `#F9F5ED`. Card → CTA
16px. **Content bottom padding 32px** + safe-area inset, matching Import (not Home's 72px).
BottomNav 72px, two cells, no FAB — the nav stays visible in every state; only the keyboard hides
it, following Import's keyboard rules.

### States

Empty / filled / name-missing / edit-prefilled / edit-long-name. State changes swap values and CTA
availability only — the title, the three fields and the CTA never move between states.

### OPEN — do not invent

- **Post-submit destination.** Whether a successful create returns to Home, opens the new
  collection, or continues into the import flow is undecided. This screen defines the form and the
  `onSubmit` boundary only.
- Preset assignment happens at the moment of successful creation and persists; **editing an existing
  collection never re-rolls it.**

---

## Import Link + Analyze Result

One screen, one set of components — every viewport (360/390/430) and every UI state renders through
the *same* markup switched by state, not separate static screens. App Shell (BottomNav, safe area,
scroll rules, keyboard behavior) is shared with Home.

Two mount points share this design: **`entry=new`** (`/share`, `/imports/new`) shows the composer;
**`entry=resume`** (`/imports/:importId/review`) shows the read-only source row plus a summary row.
The state model, lifecycle mapping and decision ledger are in
[import-lifecycle.md](import-lifecycle.md) — this section covers layout, responsive behavior,
pitfalls and assets.

### Layout (390 baseline)

- Content top inset 8px + 6px before the header row. Header: 44×44 back `IconButton` (paper variant)
  left; `wordmark-script.png` (40px) + `sticker-envelope.png` (52px, rotate 4°, gap 6) right;
  `space-between`.
- Header → title 14px. Title「匯入連結」at 26px Quicksand 700. Subtitle 13px/1.6, max-width 304px
  (deliberately capped so it doesn't stretch at 430; it may run to three lines at 360).
- Title → **TargetCollectionRow** 16px. That row: full width, 64px tall, r14, padding 10/10/10/14,
  card shadow. Small-caps label 11px Quicksand 700 / .1em; collection name 17px Playfair 500 with a
  13px pin and 5px gap; 「更換」14px Quicksand 600 with a 44×44 tap target and `flex-shrink:0`.
  The name is `nowrap` + ellipsis with `min-width:0`; available text width measures 230/252/284.
- **No-collection guidance card** (replaces the target row when the user has no collections): same
  treatment as `NoticeCard` — r20, 1.5px dashed, padding 20/18. Its 建立旅行收藏 action is
  `Button variant="outline" size="md"` → **48px tall**, which also satisfies the ≥ 44px tap minimum.
  **The export's `hint-size="auto,40px"` on this button, and the「outline 動作 40px」line in its
  LAYOUT / SPACING row, are stale annotations — do not implement 40px.** The rendered component is
  `md`; the 40px figures predate `Button`'s size change and were never updated. This matches the
  `NoticeCard` exit stack below, which is also `md` 48.
- Composer (only while no Import exists): TargetCollectionRow → LinkInput 14px. LinkInput full
  width, 52px, r14, padding 0 12 0 14; IG source icon and clear button 24px visual / 44px tap.
  Inline error 8px below the field, 12px/1.55, coral. LinkInput → Analyze CTA 12px; CTA full width,
  50px, r14.
- **SourceRow** (every persisted state, replacing the composer): 14px above, 64px tall, r14, padding
  10/10/10/14, IG icon 24, single-line truncated URL (`min-width:0` + ellipsis), 「開啟」44px tap.
- **ResumeSummaryRow** (`entry=resume` only): 10px gap below SourceRow, 46px tall, r14, padding
  11/14; status chip 11.5px r999; meta 12px, always one line.
- **The source block therefore has exactly three heights, identical at all three widths**: composer
  118 (field 52 + gap 12 + CTA 54) → SourceRow alone 64 (−54, persisted `entry=new`) → SourceRow +
  summary 120 (+2, `entry=resume`).
- CTA/source → status line 20px. The status line reserves **24px min-height even when idle**, so
  nothing shifts when status text appears.
- Status → result cards 16px. Result cards: 16px gap, 12px padding, 20px radius, the same warm
  shadow, `overflow:hidden`. Photo column fixed per breakpoint at ratio 0.88: **108×122 @360 /
  120×136 @390 / 132×150 @430**, with a 5px white frame + 6px radius + sticker shadow.
- In-card action row: **full width across both columns**, 12px above, gap 8, ratio 編輯 1 : 拒絕 1 :
  加入 1.35, buttons 44px tall.
- Cards → Batch panel 20px. Batch panel padding 16/14, 1.5px dashed, r20. Panel → commit CTA 12px;
  commit CTA full width, 50px.
- **CompletedSummaryCard** (replaces panel + CTA when completed): 20px above, r20, padding 18/18/19,
  title 15.5 / body 12.5; measured 106px tall.
- In-card **failure notice**: 12px above, padding 10/12, r12, `--coral-100` ground, 12.5px/1.55,
  prefix in Quicksand 700 coral-600 followed by a full-width space. Sits below Tags, above the
  action row.
- In-card **disposition row** (completed): replaces the action row, 12px above, `min-height: 44`
  so card height is unchanged; ✓/✕ 15px + 13.5px Quicksand 700 label; 已加入 in blue-500, 已拒絕 in
  ink-400; **no buttons**.
- `NoticeCard` exit stack: 15px above, gap 10, `md` 48 full-width buttons, 44px text buttons.
  End-import confirm row: 15px above, 14px top padding, 1px dashed `#EDE4D2`, 13/12px copy, button
  row 13px above with gap 8, `sm` 44.
- Supplement panel: 15px above, 14px top padding, field group gap 14, labels 11px/.1em with 6px
  below. Fields: single-line 46, post text 78, other info 66; r12, 1.5px `#E3D9C6`, `#F9F5ED`
  ground, 13px. Screenshot slots 76×76, r12, gap 8 in one row with a dashed ＋新增 slot; each slot's
  ✕ is 22px visual / 44×44 tap, offset `top:-6 right:-6` so it overflows only up and right and keeps
  3px clear of the neighbouring slot. Submit `md` 48 full width + 44px text button, gap 8.
- Content bottom padding 72px + safe-area inset.

### Responsive (the only two variables that change)

| | 360 | 390 (baseline) | 430 |
|---|---|---|---|
| Gutter | 16px | 20px | 24px |
| Photo column | 108×122 | 120×136 | 132×150 |

Fixed at every width: BottomNav 72, back 44, wordmark 40, envelope 52, IG icon 24,
clear 24, input 52, both CTAs 50, TargetCollectionRow 64 and its 13px pin, 「更換」44 tap target, and
every decoration offset. Fluid: content width and everything that spans it — LinkInput, SourceRow,
both CTAs, cards, text columns, the Batch panel, the failure notice, the target row (its name column
absorbs the width).

Text:photo ratio stays ~62:38 at every width (measured 184:108 / 194:120 / 214:132); the text column
never drops below 184px. At 360 the fixed order for reclaiming space is: shrink photo column →
shrink gutter → let Tags wrap → clamp text. **Type never shrinks.** At 430 the photo column absorbs
the extra width; text, tags and buttons do not scale up. Never change card layout, never change
field direction, never hide an element because of width.

Allowed to wrap: the subtitle, the address (max 2 lines), Tags (multi-line), the Batch panel title.
Line clamps: description 2, address 2; place name is single-line ellipsis (built into the DS
component).

### Place result card sizing

Height floor = photo height + 12 + 44 (action row) + 24 → 202 / 216 / 230 at 360/390/430. Height is
never fixed; the photo height is fixed and the text column drives the card. The action row is always
at the bottom and always full width, in every state.

Measured heights, for verification only: regular 255/227/230; shortest 206/216/230; long content 301
at all three; awaiting-selection 282/254/254; unmatched 309/281/284; candidates expanded 507/479/479;
batch-failure 346/327/302 (+91/+72/+72 over the same card succeeding); retrying 307/307/282;
completed read-only cards match the regular card exactly (255/227/230). Raising `Button sm` from 40
to 44 added a flat +4px to every card and changed nothing else.

Three fields are deliberately **not** shown on this card — 推薦品項, 城市或區域, 辨識信心程度. That
is a FINAL decision (see [import-lifecycle.md](import-lifecycle.md)), not an omission: 推薦品項 still
has to appear in Edit Place and on the trip-collection page card, both of which are undesigned.

### Pitfalls called out by the source

- **The source row must never regress into an input.** `needs_input` and `failed` ask the user to do
  something, which tempts you to put `LinkInput` back. Once an Import exists the source is *always*
  the read-only `SourceRow`; 「換一個連結」creates a new Import rather than rewriting this one's URL.
- **Content bottom padding on Import is 32px + inset, not Home's 72px.** The old 72px existed to
  clear a FAB that protruded 14px above the nav; with the FAB gone it was recomputed. Verified
  across 9 combinations (Success / Batch partial failure / Extreme × 360/390/430): the CTA's bottom
  edge sits 32px above the nav's top edge, fully visible, with 0px horizontal overflow everywhere.
  Don't copy Home's 72px onto Import.
- Long URLs scroll horizontally *inside* the input — no `text-overflow` ellipsis (the user would
  lose track of what they're editing), no wrapping, no shrinking; the clear button stays fixed at
  the right inner edge.
- Place name: single-line `nowrap` + ellipsis, not `line-clamp`. The category badge is
  `flex-shrink:0` and always wins the space fight — the name yields first and the two never overlap.
- Address allows a second line then clamps; the pin icon is `flex-shrink:0`. A long address only
  makes the card taller — it never compresses the buttons.
- Tags: `flex-wrap` + 5px gap, allowed to run to two or more lines — never `nowrap`, never a smaller
  font, never horizontal scroll.
- Photo is `cover` + `center`; the 5px white frame is a **border, not outer padding** — include the
  10px when computing the column's total width.
- The decoration wrapper can't be `overflow:hidden` (the tape crosses the top edge and would be
  clipped); use the scroll layer's `overflow-x:clip`, not `overflow-x:hidden` (which would create an
  unwanted second scroll container).
- Layout shift: the status line is a fixed 24px, the error message only takes space when invalid, and
  analyzing reflows nothing. Don't replace the whole result region with a skeleton (unlike Home's
  list). Only two exceptions exist, both user-initiated: the composer → SourceRow collapse (−54px,
  at the moment the user presses Analyze) and in-card expansion (reject confirm, candidate list,
  failure notice).
- **`min-width:0` on the collection name**: the name span is a flex item — `nowrap` + ellipsis alone
  will not trigger. `min-width:0` must be on the innermost span *and* its two ancestor levels. Miss
  one and a long name overflows straight into 「更換」.
- **Don't leave disabled buttons as placeholders on completed cards.** Read-only means the action row
  is *removed* and replaced by disposition text — a disabled row still reads as "operable" and still
  exposes non-existent capability to screen readers.
- Don't treat UI variants as data states, and don't implement batch add as all-or-nothing — see
  [import-lifecycle.md](import-lifecycle.md).

### Scrolling reference

Visible height is 736px (601px with the keyboard open). States that need no scrolling: No
collection, Idle, Filled, Reel URL, Invalid, received, analyzing, Empty result, Error, End confirm,
Resume/queued, and all five keyboard variants — with one exception, `needs_input` (資料不足) at 360
measures 756px and needs a small scroll. Everything containing a result list, and the supplement
form, does scroll (measured 1250–1981px).

### Assets specific to this screen

`wordmark-script.png` (40px — Home uses the serif lockup), `sticker-envelope.png` (header, one per
page, 52px rotate 4°), `icon-instagram.png` (24px — the LinkInput source badge in the composer and
the SourceRow source icon; **one badge for both posts and Reels**, and MVP has no other platform),
`arrow-back.png` (inside the 44px paper `IconButton`), `sparkle.png` (Analyze CTA icon, pulsing only
while analyzing), `check-circle.png` (success status icon), `arrow-curve-3x.png` (108px source,
displayed 36px — decorative, success only), `pin-blue.png` (Google-Maps-matched street address —
Home's country level uses `pin-coral.png`), `pencil.png` (編輯),
`place-{cafe,food,nature}-jeju-clean.jpg` at 1x/2x/3x (132×150 / 264×300 / 396×450),
`place-mark-{heart,star,flower}.png` (60px source, displayed 20px),
`sticker-luggage.png` (52px, rotate −4°) and `sticker-sparkles-transparent.png` (102px source,
displayed 34px) on the Batch panel, `nav-trips.png` / `nav-imports.png`.

The older `place-*.png` files have decoration baked in. They are not runtime assets and shouldn't be
shipped, but they stay valid inside the export for the PREVIOUS / CLEAN / RECOMPOSED comparison —
which documents the change and is not a switchable product state. As on Home, these files are
reference and fixture material; **where production photos come from is `OUT OF SCOPE / UNDECIDED`**
and must not be written into implementation as settled. Washi tape is CSS, not a file.
`status-bar.png` and the soft keyboard are mockup-only.

> The earlier conflict in this file — an ASSETS summary line describing the heart/star/flower marks
> as cycling in sequence — **has been resolved in the current export**. The ASSETS table now states
> the mark is fixed by `category`, never by index or rotation, matching the decoration rules, the
> component tree and `CLAUDE.md`.

### React / Next.js boundary

Split as: `ImportHeader` / `ScreenIntro` / `TargetCollectionRow` / `LinkInputSection` (composer only)
/ `SourceRow` + `ResumeSummaryRow` (persisted) / `AnalyzeStatusArea` / `NoticeCard` / `ResultList` /
`ResultCardSlot` / `BatchAddSection` / `CompletedSummaryCard`.

`ResultCardSlot` derives tape and mark from the place's `category` (not index, not render order);
`PlaceResultCard` only receives data and state. Keeping those responsibilities apart is what lets
the card be reused on other pages.

Server/client boundary sits **above `LinkInputSection`**: AppShell, header, `ScreenIntro` and static
spec content can stay Server Components; everything from `LinkInputSection` down (input, validation,
analyzing, add/added, keyboard handling) is a Client Component — so the header and subtitle don't
repaint on every keystroke.

Markup: one scroll container; gutter and photo column as two breakpoint variables (CSS variables or
a container query), everything else shared. Place photos get `sizes` for 108/120/132 and keep
`cover`; decoration PNGs stay plain `<img>` + `aria-hidden`, out of `next/image`. Render every state
from the same tree — never fork the layout per state.
