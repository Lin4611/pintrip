---
name: pintrip-design
description: Confirmed PinTrip UI/design rules distilled from the Claude Design handoff (docs/design/claude-design-export/). Use whenever implementing a Claude Design screen as PinTrip UI, adding or modifying a PinTrip page/component, reviewing UI against the design, adjusting responsive layout, spacing/typography/color/effects, wiring Import lifecycle states or accessibility, using existing icons/stickers/photos, or keeping visual language consistent across PinTrip screens. Not a general design-system skill — scope is PinTrip only.
---

# PinTrip Design

Distilled, reusable design rules for implementing PinTrip as production code. This skill does **not**
contain implementation code or copies of the source HTML/CSS — it tells you the rules and where the
canonical source lives so you can go read the exact values when you need them.

## When to use this skill

Apply `pintrip-design` for:

- Implementing a Claude Design PinTrip screen (Home / Trip Collections, or Import Link + Analyze
  Result) as real UI
- Adding a new PinTrip page or component
- Modifying an existing PinTrip UI
- Reviewing UI against the current design
- Adjusting responsive/layout behavior
- Tuning spacing, typography, color, radius, shadows, motion
- Mapping Import lifecycle states onto screen states, or wiring the documented callback boundaries
- Implementing the documented accessibility contract (aria, focus, disabled, tap targets)
- Using existing icons/stickers/photos correctly
- Keeping visual language consistent across screens

Do **not** use this to invent new screens, states, or components the design hasn't defined — see
"What this skill does not authorize" below.

## Canonical source and precedence

All rules here are extracted from `docs/design/claude-design-export/`. When you need an exact
pixel value, asset filename, or state you don't find below, go read the source file directly —
do not guess.

**The design export never outranks the product and architecture docs.** `docs/MVP.md` governs
product scope, product rules and acceptance criteria; `docs/ARCHITECTURE.md` governs technical
decisions and data boundaries. If a design file conflicts with either, the design file is what
changes — stop and report rather than implementing the design's version.

Within `claude-design-export`, precedence is **decided by question type, not by one global list**
(source: `CLAUDE.md`, both screen files, and the DS `readme.md`). Never reason backwards from a
lower-priority source:

| Question | Order |
|---|---|
| Product behavior / acceptance | `docs/MVP.md` → `docs/ARCHITECTURE.md` |
| Import screen & its interactions | decisions explicitly marked confirmed in the task → `ImportScreen.dc.html` → the DS components/tokens that genuinely apply |
| Home screen & its interactions | `HomeScreen.dc.html` → design system |
| Shared visuals & App Shell | `HomeScreen.dc.html`'s App Shell / BottomNav / FAB / safe area / responsive frame → design system |

Two standing qualifiers:

- `HomeScreen.dc.html` is the shared App Shell and visual baseline only — **do not use a Home-only
  screen rule to override Import.**
- `MvpMockups.dc.html` is **early visual reference only, never a spec source.** The file now carries
  its own banner saying so. It still shows stale photos (decoration baked in) and order-based tape.
  Never derive a value from it.

`support.js` and `ds-base.js` are canvas-preview/runtime plumbing for the Claude Design tool
(loading the DS bundle, parsing the `.dc.html` preview format) — not design rules, not implementation
guidance. Ignore them for implementation purposes.

If two canonical sources genuinely conflict and precedence doesn't resolve it, stop and report the
conflict — do not silently pick one.

## Product scope

PinTrip is a mobile-first travel place collection app: the user picks a target trip collection,
pastes/imports an Instagram **post (`/p/…`) or Reel (`/reel/…`)** link, PinTrip extracts the places
mentioned in it, and the user reviews, matches, edits, rejects or adds them into that collection.
Scope is **Trips / Add / Imports only** — MVP. Do not add Explore, Journal, Saves, Route, XP,
Levels, Quests, Achievements, budgeting, or a social feed, even if it seems like a natural
extension.

## Copy language — changed, read this before writing any string

**All product UI copy is Traditional Chinese (繁體中文).** The earlier "bilingual by role —
English structure, Korean feeling" model **no longer holds** and must not be reintroduced.

The only English left in the product is **artwork**: the wordmark, the handwritten tagline, and the
paper note on Home. Those three keep their drawn English exactly and are never treated as
translatable strings. Nothing else in the interface is English. Full details, voice rules and the
open font problem are in [references/design-system.md](references/design-system.md).

## Visual direction (hold this shape)

**Warm, clean, collectible, slightly cute** — Korean-lifestyle-app feel with light sticker/postcard/
travel-journal detailing. Not childish, not a heavy collage, not generic SaaS.

Keep:
- Flat cream backgrounds, warm paper-white cards, one soft warm shadow — never gray shadows
- One or two decorative elements (tape/sticker) per surface, never a collage
- A single blue accent carrying meaning (links, primary actions, active states); coral/butter/
  lavender only in small doses, never more than two accent hues per card
- Three strictly-separated type roles (serif display / rounded-sans UI / handwriting script) —
  see [references/design-system.md](references/design-system.md)
- Natural, unfiltered travel photography
- Gentle, short motion — fades, not slides; a soft spring only on the FAB

Avoid (visual drift to catch in review):
- Gradients, textures, full-bleed imagery, illustrated backdrops
- Frosted glass / scrim overlays / blur — the app uses opaque paper + shadow instead. The **one**
  documented exception is the delete-collection confirm sheet's flat warm dim (no blur, no
  gradient), justified by modality
- More than one paper tape per Trip Collection Card, or two large stickers on one surface
- Icon fonts or a generic icon library (Lucide/Heroicons/etc.) — every icon is a cropped raster
  asset from the source mockups; see the Assets sections in
  [references/screens.md](references/screens.md)
- Emoji anywhere except the single ✨ already used in Chinese helper copy
- Coral used as a destructive/danger color — coral is the commit-CTA color; a delete button in
  coral pollutes both meanings
- Hover states inside the app itself (touch product); web hover only darkens fill by one step,
  never resizes

## Reference files

- **[references/design-system.md](references/design-system.md)** — color/typography/spacing/radius/
  shadow/motion tokens, the Traditional-Chinese content & voice rules, the cross-screen destructive-
  action confirmation rules, and global visual foundations (cards, stickers, photography, buttons/
  states, layout, iconography).
- **[references/components.md](references/components.md)** — the App Shell (mobile viewport, safe
  area, BottomNav, FAB, keyboard behavior), the design-system component inventory and its current
  props, the page-level composites that are *not* DS components, and the decoration system (Home
  presets, Import category mapping).
- **[references/screens.md](references/screens.md)** — screen-specific layout numbers, responsive
  variables, UI states, and the pitfalls each canonical file calls out, for Home and Import.
- **[references/import-lifecycle.md](references/import-lifecycle.md)** — the Import data lifecycle
  vs. UI variants, entry modes, the source-read-only rule, completed read-only, batch partial
  failure, place matching, supplement flow, and the FINAL / OPEN / PENDING DESIGN / OUT OF SCOPE
  decision ledger.
- **[references/accessibility.md](references/accessibility.md)** — the documented a11y contract:
  aria wiring, live regions, native `disabled`, focus, tap targets, reduced motion.

Read the reference file(s) relevant to your task; you rarely need all of them at once.

## Design-to-code rules

- Prefer existing design tokens (`_ds/…/tokens/*.css` variables) over hardcoded hex/px values.
  Spacing follows a 4px base scale.
- Reuse existing assets exactly as named. Never redraw, recolor, regenerate, or substitute a
  similar-looking icon/sticker/photo. If an asset you need doesn't exist, stop and report it — don't
  invent one. **Two locations, two responsibilities**: verify against the canonical design source
  `docs/design/claude-design-export/assets/**`, but reference assets from App code as
  `/design-assets/...` (served from `public/design-assets/**`). Raw material in `uploads/`, and
  anything no shipped screen references, is never used by the App. Details in
  [references/components.md](references/components.md).
- **Keep the two layers separate: data lifecycle vs. screen presentation.** Import lifecycle has
  exactly six values (`received`, `processing`, `needs_input`, `review_required`, `completed`,
  `failed`). Everything else — "Batch partial failure", "All processed", "Reel URL" — is a UI
  variant derived from lifecycle + entry mode + per-item disposition. Never persist a UI variant as
  a data state. See [references/import-lifecycle.md](references/import-lifecycle.md).
- Don't redesign a screen for engineering convenience. If a rule is inconvenient to implement (e.g.
  adaptive card height, no aspect-ratio lock), implement the rule — see each screen's "Pitfalls"
  section in [references/screens.md](references/screens.md).
- Don't change visual hierarchy, spacing, typography, or component proportions on your own
  judgment. If something looks wrong, check the canonical file's exact values before changing
  anything.
- Responsive adaptation must preserve the original design intent: only the values documented as
  fluid (gutter, and one component's fixed column per screen) actually change across 360/390/430 —
  everything else is fixed, and type never shrinks at 360.
- Before implementing, check which canonical file governs the screen you're touching (Home vs.
  Import) and read its full component tree / layout / decoration / interaction sections — this
  skill is a distilled index, not a replacement for the source when exact values matter.
- Prefer Server Components per project convention (`AGENTS.md`); the source handoff itself documents
  the intended server/client boundary per screen (see [references/screens.md](references/screens.md)).
- Measured numbers in the source (marked 實測) are **measurement results, not specs** — they exist
  so you can verify your build, not so you can hardcode heights.

## What this skill does not authorize

- Do not implement Home or Import screens under this skill alone — implementation requires a
  separate, explicitly scoped task per `AGENTS.md`.
- Do not invent specs for anything still marked `OPEN`, `PENDING DESIGN`, 待設計, or
  `OUT OF SCOPE`. The current ledger lives in
  [references/import-lifecycle.md](references/import-lifecycle.md); as of this handoff it includes
  the change-target picker UI, the re-search flow (explicitly *required before frontend
  implementation*), the Edit Place page layout, post-add navigation, the Places candidate count,
  TripPlace editing, `/trips/new`, and delete-in-progress/failure feedback.
- Do not treat a navigation description found anywhere in the handoff as a decided destination.
- Do not create a second design system or duplicate the token source — always reference
  `_ds/pintrip-design-system-*/tokens/*.css`.
- Do not resolve a documented conflict, substitution, or open gap on your own — flag it.

## Visual QA checklist

Run this after implementing or changing PinTrip UI:

- [ ] **Layout** — matches the canonical screen's component tree and section order; no invented
      sections or reordering
- [ ] **Spacing** — uses the 4px-scale tokens and the exact gaps documented for the screen (not
      "close enough" values)
- [ ] **Copy** — Traditional Chinese with full-width punctuation; English only in the three Home
      artwork elements; no headings/buttons carrying trailing punctuation
- [ ] **Typography** — correct font role per text (serif display / rounded-sans UI / script /
      Chinese body), correct size token, no button set in the serif face, no Chinese set in the
      script face
- [ ] **Colors** — token-driven; no more than two accent hues on one card; ink colors used per
      role, never plain black; coral never used as a destructive color
- [ ] **Component sizing** — matches documented dimensions (card radius, photo column widths per
      breakpoint, button heights — `Button sm` is **44px**, not 40 — tap targets ≥ 44px)
- [ ] **Assets** — only existing assets, by their documented filenames, referenced from code as
      `/design-assets/...` (never a `docs/...` path, never straight from `uploads/`); no decorated
      `*.png` plate shipped as a runtime asset — those are export fixtures; the production photo
      source is `OUT OF SCOPE / UNDECIDED`, so don't commit to one
- [ ] **Bottom Navigation / FAB** — 72px nav with 26px top corners, FAB 60px lifted 14px with the
      5px cream ring, FAB is a child of nav (not an independent fixed layer)
- [ ] **Safe area** — top/bottom safe-area insets respected; content bottom padding is 72px + inset
      so the last card / commit CTA clears nav *and* FAB; no product UI drawn in the mockup-only
      status bar area
- [ ] **Responsive behavior** — only the documented fluid values change across 360/390/430; fixed
      elements stay fixed; type never shrinks; no layout reflow beyond what's specified
- [ ] **Decoration** — outside the component, in a non-`overflow:hidden` wrapper, `aria-hidden` +
      `pointer-events:none`; Home preset comes from the persisted `decorPreset` (fallback C), Import
      tape/mark come from `category` — never from index or render order
- [ ] **UI states** — every state the screen defines is implemented; state switches swap content
      only, with the two documented layout-shift exceptions (composer → SourceRow, and
      user-triggered in-card expansion)
- [ ] **Read-only completed** — completed Import cards **remove** the action row and show a static
      disposition line; no disabled buttons left sitting in the layout
- [ ] **Accessibility** — the contract in [references/accessibility.md](references/accessibility.md)
      is implemented, not approximated: native `disabled`, aria-labels carrying the place name,
      live regions, per-item failure ids
- [ ] **Consistency with Claude Design** — side-by-side check against the relevant `.dc.html` for
      anything not covered by this checklist
