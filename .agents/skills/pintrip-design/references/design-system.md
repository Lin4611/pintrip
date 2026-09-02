# PinTrip Design System

Source: `docs/design/claude-design-export/_ds/pintrip-design-system-*/readme.md`,
`tokens/*.css` and `_ds_manifest.json`, cross-checked against `HomeScreen.dc.html` /
`ImportScreen.dc.html`. These are **global** rules — they apply to every PinTrip screen.
Screen-specific numbers live in [screens.md](screens.md).

> **What the `_ds/` folder actually contains in this project.** Only `_ds_bundle.js`, `styles.css`,
> `tokens/`, `_ds_manifest.json`, `_adherence.oxlintrc.json` and `readme.md`. The readme's *Sources*
> and *Index* sections describe the original design-system tree; `components/`, `ui_kits/`,
> `guidelines/`, `assets/`, the master mockup uploads, `thumbnail.html` and the DS's own `SKILL.md`
> are **not** in this project and must not be referenced as readable paths. Components are mounted
> from the bundle (`PinTripDesignSystem_ab161c.<Component>`); assets come from the export root's
> `assets/`.

## Design tokens

These are the design-side token names. They're reproduced here so you know what exists — never
hardcode the hex/px values below.

> **App-side code does not use these names.** The tokens were integrated into `src/styles/tokens/`
> under Tailwind's namespaces, so implementation writes utility classes (`bg-cream-100`,
> `rounded-lg`, `shadow-card`, `text-ui-sm`, `ease-soft`) rather than `var(--cream-100)`. Some
> semantic names changed to avoid class-name collisions. **The DS-name to code-name mapping, the
> rule for adding new design values, and the naming-collision rule all live in
> `docs/ARCHITECTURE.md` §2.1 — read that section before writing any styling code.** The names
> below remain canonical for reading design specs and the `.dc.html` files.

### Colors (`tokens/colors.css`)

- Warm neutrals: `--cream-50/100/200/300`, `--paper` (#FFFDFA card surface), `--paper-nav`
  (#FCFBF7 bottom bar)
- Ink (never plain black): `--ink-900` #0B1B33 (serif display), `--ink-700` #3B3B3D (rounded-sans
  headings/place names), `--ink-500` #777777 (body), `--ink-400` #81817D (secondary body / rejected
  disposition), `--ink-300` #A9A6A0 (placeholder/disabled)
- Blue accent (the only meaning-carrying accent — links, primary buttons, active nav, place
  counts, "已加入" disposition): `--blue-700`…`--blue-050`, primary fill is `--blue-500` #5B87D0
- Small-dose category accents: coral (`--coral-*`, batch CTA / Cafe badge / map pins / failure
  notice ground `--coral-100`), butter (`--butter-*`, Food badge), lavender (`--lavender-*`,
  Attraction badge)
- Tape colors: `--tape-butter` #F3E3B8, `--tape-blush` #F7D9CE, `--tape-lavender` #D8CBEC,
  `--tape-blue` #C4D8EF
- Semantic aliases exist for all of the above (`--bg-app`, `--surface-card`, `--text-body`,
  `--accent`, `--accent-action`, `--border-hairline`, `--border-dashed`, `--focus-ring`, etc.) —
  prefer these over the raw palette names in component code.

**Coral is the commit-CTA color, not a danger color.** The design explicitly refuses a
destructive/danger button variant so the two meanings don't pollute each other.

### Typography (`tokens/typography.css`, fonts from `tokens/fonts.css`)

Three roles, strictly separated — never mix them:

| Role | Font token | Font | Used for |
|---|---|---|---|
| Display | `--font-display` | Playfair Display (serif) | wordmark, trip titles, target-collection name — this is what makes the app feel like a keepsake |
| UI | `--font-ui` | Quicksand (rounded sans, mostly 700) | screen titles, place names, buttons, nav labels, small caps labels — friendly, never techy |
| Script | `--font-script` | Caveat (handwriting) | the Home tagline and margin note **only** |
| Body | `--font-kr` | Noto Sans KR, line-height 1.6 | all Chinese body copy — **see the open font gap below** |

Rules: never set Chinese copy in the script face; never set a button in the serif face.

Size tokens: `--type-wordmark` 44px, `--type-display-lg/md/sm` 30/22/20px, `--type-screen-title`
26px, `--type-ui-lg/md/sm/xs` 19/16/14/12px, `--type-body` 14px, `--type-body-sm` 13px,
`--type-caption` 12px, `--type-script` 19px. Line-heights: `--lh-tight` 1.15, `--lh-snug` 1.35,
`--lh-body` 1.55, `--lh-kr` 1.6. Weights `--w-regular/medium/semibold/bold` 400/500/600/700.
Letter-spacing `--ls-tight/normal/wide/caps` −0.01em/0/0.02em/0.08em.

Screens also use a few sizes below the token scale for dense rows (11–13.5px small-caps labels,
12.5px meta/failure text). Those are documented per-component in the screen files — take them from
there, don't round them to the nearest token.

### Spacing (`tokens/spacing.css`)

4px base scale: `--sp-1` 4px … `--sp-10` 40px. Screen gutter 20px (fluid 16/20/24 across
360/390/430 — see [screens.md](screens.md)). Card gap 16px, card padding 16px, stack gap 12px.
`--nav-height` 72px, `--tap-min` 44px (`--fab-size` 60px still exists but PinTrip has no FAB).
Frame reference: 390×844. Real screens
use the 4px-derived set 6 / 10 / 12 / 14 / 16 / 20 / 26 / 72.

### Radius, shadow, motion (`tokens/effects.css`)

- Radius: `--r-xs` 8px, `--r-sm` 12px (photo inside a card, `Button sm`), `--r-md` 14px (buttons,
  input, source rows), `--r-lg` 20px (cards/panels), `--r-xl` 26px (sheets, nav top corners),
  `--r-pill` 999px. Elegant rounded everywhere except chips and CTAs, which are pill.
- Shadows — always warm, low-contrast, never gray: `--shadow-card` `0 4px 14px rgba(122,96,58,.07)`,
  `--shadow-raised`, `--shadow-sticker`, `--shadow-fab` (blue-tinted, currently unused),
  `--shadow-cta` (coral-tinted),
  `--shadow-nav` (upward), `--shadow-inset-field`. The delete-confirm sheet uses its own upward
  `0 -8px 28px rgba(60,45,25,.20)` — same "shadow points up" technique as the nav.
- Borders: `--border-1` (1px solid hairline), `--border-dash` (1.5px dashed — the "not a thing yet"
  affordance for Start-New-Trip / batch-add / notice cards), `--divider-dash` (1px dashed — in-card
  section divider, never a solid line). **Overlay exception:** the `•••` menu's row divider is 1px
  **solid** `#F2EADC` inset 8px on both sides — it deliberately does not reuse the card's dashed
  cream divider, because the overlay must read as a different surface.
- Motion: `--ease-soft` `cubic-bezier(.32,.72,.28,1)` for state changes, `--ease-spring`
  `cubic-bezier(.34,1.32,.52,1)` is still defined for anything that should feel slightly springy,
  but nothing in PinTrip currently uses it (it was the FAB's vocabulary) — never bouncy-cartoon. Durations: `--dur-fast` 120ms (press), `--dur-base` 200ms (state),
  `--dur-slow` 320ms (sheets). Press state: `--press-scale` 0.97 + brightness(0.96). Sticker tilt
  default −4deg.

## Content and voice — Traditional Chinese

**All product UI copy is Traditional Chinese (繁體中文).** This replaced the earlier
"bilingual by role, English structure + Korean feeling" model; do not reintroduce it. Structure and
feeling are both carried in Chinese, including navigation, actions and object names
(「我的旅行收藏」「建立旅行收藏」「匯入連結」「分析連結」「編輯」「重新命名」「28 個地點」).

The shipped screens are the source of truth for copy — take strings from them, not from the DS
readme's examples.

- **The only English in the product is artwork, never UI copy**: the wordmark (PinTrip), the
  handwritten tagline ("Pin your best trips. Cherish every place.") and the paper note
  ("Collect moments, not things."). All three appear once, only on Home. They keep their drawn
  English, Title Case and sentence periods exactly, and are never treated as strings to translate,
  reuse or extend.
- Title Case does not apply to Chinese. The equivalent rule: **headings and buttons carry no
  trailing punctuation at all** (no 。, no ！) and stay as short as the action allows.
- Voice is plain, warm and spoken — short sentences, no formal 公文 register, no exhortation. The
  app addresses the user as a companion and speaks about「我的旅行收藏」— possession sits with the
  user.
- **Full-width Chinese punctuation** （，。！？「」）— never ASCII commas or periods in Chinese copy.
- Numbers are stated, never celebrated:「28 個地點」「找到 3 個地點。」No streaks, scores, progress
  bars, or growth-flavoured copy.
- At most one exclamation mark per screen, only on a genuinely good outcome (「分析完成！」).
  Questions are used for confirmation (「要加入這 3 個地點嗎？」).
- **Emoji: exactly one sparkle (✨), only at the end of a Chinese helper line.** Never in a button,
  a heading, or the English artwork copy. Emotion elsewhere comes from stickers and photography.
- Hashtags are Traditional Chinese, un-spaced, 2–3 per place:`#海景 #風格咖啡 #涯月咖啡`.
- Never set Chinese copy in the handwriting script face.

### Wording that carries a decision

A few strings are load-bearing and were argued out in the handoff — don't paraphrase them into
something with a different meaning:

- Ending an import is **not** irreversible (the same link can be pasted again as a new import), so
  its confirmation must **not** say「不可復原」.
- Deleting a trip collection **is** irreversible, so its confirmation **must** say「刪除後無法復原。」
- A completed import with zero added places must not be worded as「已完成」— nothing was added, and
  that reads as misleading.

## Destructive-action confirmation (cross-screen, final)

Derived from `docs/MVP.md` §3 core principle 10 — this is the design-layer specification of a
product rule, not a design-side invention. Applies to every action that removes, rejects or deletes
existing content.

1. A destructive action must be **confirmed before it executes** — never one-tap.
2. The confirmation must **state the scope of impact** — what is affected, and how much.
3. If the action **cannot be undone, the confirmation must say so.** If it can be undone, do not
   write that line.
4. **Button roles are fixed in destructive confirmations**: confirm is always outline, cancel is
   always solid blue — the safe option is the visually heavier one. This applies **only** to
   destructive confirmations; the BatchAddPanel's coral commit CTA is solid with no cancel and is
   not governed by this rule.

The *form* of the confirmation follows information volume — it is deliberately not standardized:

- Import → rejecting a candidate place: **in-card confirm row** (spec in `ImportScreen.dc.html`).
- Home → TripCard「•••」→ delete collection: **screen-level sheet**, because it must list "N places
  will be deleted too" plus four categories of removed data — more than one in-card row can hold.

Removing a not-yet-submitted screenshot from the supplement form is **not** a destructive action
(per `docs/MVP.md` §5.4) — it needs no confirmation. That is the rule's premise failing, not an
exemption from it.

## Visual foundations (apply on every screen)

**Backgrounds.** Flat cream (`--bg-app`). No gradients, no textures, no full-bleed imagery, no
illustration backdrops. The one tinted surface anywhere is the Start New Trip panel (`--blue-050`)
with a faint world-map cut-out multiplied into it. Depth comes from paper stacking, not color.

**Cards.** 20px radius, paper fill, no border, single soft warm shadow
(`0 4px 14px rgba(122,96,58,0.07)`), `overflow:hidden`. Sections inside a card are separated by a
1px **dashed** cream rule, never solid. Special/"not committed yet" cards (Start New Trip, batch
add, notice cards) use a 1.5px dashed border instead of a shadow.

**Stickers and tape.** One or two per surface, never a collage. Washi tape: semi-transparent
(opacity .92), 15–17px tall, tilted roughly −14° to +7°, crosses an edge (reads as physically
holding something down); comes solid, gingham, or dotted — **CSS-generated, not image files**.
Cut-out stickers (envelope, luggage, sparkles, postmark, category glyphs) are transparent PNGs.
Decorations are always `pointer-events:none` + `aria-hidden`, always positioned in a wrapper
outside the component they decorate (never inside it, so the component stays reusable), and never
the sole signifier of any information. See [components.md](components.md) for the full decoration
system.

**Photography.** Natural, warm, softly lit travel photography — no filters, duotone, black &
white, grain, or generative fill; color temperature stays as shot. Always a real place, no stock
gloss, no people posed to camera; the account avatar is the only portrait. Photos are
`object-fit: cover; object-position: center` — never `contain`, never an `aspect-ratio` lock
fighting an adaptive card height. The decoration-free `*-clean*.jpg` plates at 1x/2x/3x are what
specify photo treatment; the older `*.png` files have decoration composited into the pixels and
serve as before/after reference and demo-frame fixtures inside the export — they are not runtime
assets. These plates define *how a photo is treated*, not where a production photo comes from —
**the production source for place and trip photos is `OUT OF SCOPE / UNDECIDED`** (neither
`docs/MVP.md` nor `docs/ARCHITECTURE.md` settles it), so don't commit to one in implementation.

**Buttons and states.** Sizes are `sm` 44px / `md` 48px / `lg` 54px — **`sm` was raised from 40 to
44** so every in-card control meets the 44px tap minimum. `sm` is used by **`PlaceResultCard` and by
the page-level `EndImportConfirm`** — any change to `sm`'s size or styling must be regression-checked
against both. Variants are `primary` (blue fill), `action` (coral — the single per-screen
commit action), `solid` (deeper blue, used as the safe option in destructive confirmations),
`outline` (white fill, 1.5px blue hairline) and `ghost`. In-card action rows pair outline buttons
with one solid/primary button — never two same-color fills side by side. Press is uniform:
`scale(0.97)` + `brightness(0.96)` over 120ms. No hover in-app (touch); web hover darkens fill one
step, never changes size. Disabled uses the **native `disabled` attribute** (never
`pointer-events`), opacity .45, no change of color or size. Selected/added states keep the button
in place and swap only the label/icon — nothing disappears from layout. Focus-visible: 2px
`--blue-400` outline + 2px offset, radius follows the element.

**Layout shift.** State changes swap content, not layout skeleton. Reserved space (the 24px status
line, the error slot that only fills when invalid, the 44px disposition row that replaces a 44px
action row) exists specifically to prevent shift. There are exactly **two documented exceptions**,
both on Import: the composer → SourceRow collapse at the moment the user presses Analyze, and
user-triggered in-card expansions (reject confirm, candidate list, failure notice). Both are
user-initiated and predictable; system-driven shift is not allowed.

**Motion.** `--ease-soft` 200ms for state changes, 320ms for sheets, 140ms for the card menu
(fade + 2px travel, reversed when it opens upward; instant under `prefers-reduced-motion`).
Fades rather than slides for content. No bounce, no confetti, no parallax. Under
`prefers-reduced-motion`, the sparkle pulse and all non-essential animation are switched off and
state changes become instant — layout must not move as a result.

**Transparency and blur.** Almost none. Tape 92% opacity; the Start-New-Trip map cut-out multiplies
at 90%. No frosted glass, no protection gradients — the bottom bar is opaque paper with a soft
upward shadow. The delete-confirm dim (`rgba(43,32,18,.24)`, flat, no blur, no gradient)
is the single listed exception, justified by modality.

**Layout.** 390×844 base frame, 20px gutters (fluid 16/20/24), 16px between cards. Only two fixed
elements: the status-bar area and the bottom navigation (72px, top corners 26px radius) —
everything else scrolls. Bottom bar is exactly two equal cells, 旅行收藏 — 匯入; there is no centre
FAB, and the account lives in the Home header, never in the bar. Minimum tap target 44px.

## Iconography

No icon font, sprite sheet, or SVG icon set — every icon in `assets/icons/` and category sticker in
`assets/stickers/` was cropped from the original master mockups at full resolution, to keep the
hand-drawn feel a CDN icon library (Lucide, Heroicons, etc.) would fight against. **Never substitute
a generic icon library icon for a missing PinTrip icon** — if the icon you need doesn't exist as an
asset, stop and report it.

- Map pins: `pin-coral.png` (a collection's country, Home) vs. `pin-blue.png` (a place's
  Google-Maps-matched street address, result cards) — color signals precision level, not decoration.
- Actions: `pencil.png` (編輯), `sparkle.png` (Analyze CTA icon, pulses only while analyzing),
  `check-circle.png` (success status), `check-outline.png`, `arrow-back.png`, `clear-x.png`.
- Navigation: `nav-trips.png`, `nav-imports.png`. Inactive tabs are desaturated + dropped to 55%
  opacity — never swapped for an outline variant.
- Third-party: `stickers/icon-instagram.png` — the only source badge. **One badge serves both posts
  and Reels**; do not make a second variant, and MVP has no other platform icon.
- Marginalia (one tiny mark per result card, purely affective, driven by `category` — see
  [components.md](components.md)): `place-mark-heart.png` (coral), `place-mark-star.png` (yellow),
  `place-mark-flower.png` (purple). Exported at 60px, displayed at 20px.
- Decorative cut-outs: `stickers/arrow-curve-3x.png` (108px source, displayed 36px — the hand-drawn
  pointer beside the success status line only), `sticker-sparkles-transparent.png` (102px source,
  displayed 34px, Batch panel), `sticker-luggage.png` (52px, Batch panel),
  `sticker-envelope.png` (Import header 52px; Home preset D 44×37),
  `trip-decoration-postmark-generic.png` (240px source, displayed 60px; destination-agnostic —
  PINTRIP / BON VOYAGE / blank date line, no city or country wording).
  The sparkles and arrow assets are genuinely transparent now — `multiply` is a legacy component
  default, no longer a way to hide a background.
- Category stickers (trip-card footer only, 27px die-cut, hint at collection contents):
  `icon-torii`, `icon-food`, `icon-train`, `icon-pagoda`, `icon-maple`, `icon-matcha`.
- Typographic glyphs carry a few small jobs instead of icons: `•••` (card menu), `›` (on the match
  slot), `＋` (加入), `→` (Start New Trip), `✓` / `✕` (added / rejected disposition).

Emoji is never used as iconography — the one ✨ is Chinese helper text, not an icon.

## Noted substitutions / open gaps (not blockers, but don't "fix" silently)

- **`--font-kr` is a Korean face setting Traditional Chinese — PENDING DESIGN, and the biggest open
  typography item.** Both shipped screens set all Chinese copy in `--font-kr`, whose value is Noto
  Sans KR. **Noto Sans KR is not a confirmed-suitable face for Traditional Chinese** — it is the
  face currently in place, and two real consequences follow: characters outside the Korean face's
  Han subset silently fall back to the platform `sans-serif`, so one line can mix two faces; and
  shared Han characters render in Korean regional forms instead of Traditional Chinese forms. The
  shipped Chinese copy is therefore not correctly typeset today. No replacement face has been
  chosen, and the token name is semantically wrong now and needs renaming as part of the same
  decision.
  - **This must be decided before the frontend font implementation** — it swaps an external webfont
    dependency, so it can't be deferred past the point where type is built.
  - **After any face change, every screen must be re-checked**, along with every size and
    line-height in `tokens/typography.css` — a different face changes metrics, not just glyphs.
  - **Do not change the font yourself.** Nothing in `tokens/` or the screens was changed for this —
    flag it and wait for the decision.
- Fonts overall are Google Fonts stand-ins for unsupplied licensed faces, loaded from the Google
  Fonts CDN via `tokens/fonts.css`. If PinTrip later owns licensed faces, that file becomes
  `@font-face` rules.
- No vector logo file — wordmark PNGs are mockup-resolution crops; the `Wordmark` component has a
  type-only fallback (Playfair + coral pin dot) for when the PNG can't load.
- Type sizes in the tokens are scaled up from the masters' literal (too-small) mockup sizes while
  holding the masters' proportions/hierarchy — treat token sizes as canonical, not the visual
  scale you might eyeball from a screenshot.
- The DS readme still describes photos as having stickers baked in; that has since been superseded
  by the clean-plate + layered-decoration approach (see `CLAUDE.md` and [components.md](components.md)).
  The readme keeps the old text as background only.
- Two DS overrides still live in the handoff and should be folded back into the components:
  `TripCard`'s `photoWidth` + `line-clamp`, and the `•••` trigger's **`menuLabel`** — `TripCard`
  hard-codes `aria-label="Trip options"` (English, no collection name), so PinTrip overrides it at
  page level until the DS exposes a `menuLabel` prop. (`BottomNav`'s `fabOffset` override was
  withdrawn when the FAB was removed.)

These are documented by the design system itself as open items for review, not decisions this
skill should resolve — flag rather than silently change if you hit one.
