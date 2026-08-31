# PinTrip Design System

> **本專案內實際提供的內容（2026-08-27 校正）**
>
> 這份 `_ds/` 資料夾只包含 `_ds_bundle.js`、`styles.css`、`tokens/`、`_ds_manifest.json`、
> `_adherence.oxlintrc.json` 與本檔。下面 *Sources* 與 *Index* 兩節描述的是**原始 design system 資源**，
> 其中 `uploads/01_pintrip_home_master.png`、`uploads/02_pintrip_import_result_master.png`、
> `components/`、`ui_kits/`、`guidelines/`、`assets/`、`thumbnail.html`、`SKILL.md`
> **未包含在本專案**，不可直接引用或當成可讀取的路徑。元件請透過 bundle 掛載
> （`PinTripDesignSystem_ab161c.<Component>`），素材請使用專案根目錄的 `assets/`。
>
> 規格衝突時的優先順序：`HomeScreen.dc.html` → `ImportScreen.dc.html` → `CLAUDE.md` →
> 本 design system → `MvpMockups.dc.html`（僅早期 visual reference）。

PinTrip is a mobile-first travel place collection app. A user pastes or imports an Instagram
post link; PinTrip extracts the places mentioned in it and turns them into collectible travel
results the user can review, edit, and file into trip collections to explore later.

The product feeling is **warm, clean, collectible, and slightly cute** — a Korean lifestyle app
with light sticker, postcard, and travel-journal detailing. Not childish, not a heavy collage,
not generic SaaS.

## Sources（原始 DS 資源；下列 master mockups 未包含在本專案）

Everything in this system is derived from two uploaded master mockups. No codebase, Figma file,
or brand kit was provided.

| Source | What it defined |
| --- | --- |
| `uploads/01_pintrip_home_master.png` | Home / Trip Collections: wordmark lockup, tagline, account avatar, taped note, section header, trip collection cards, Start New Trip entry card, bottom navigation |
| `uploads/02_pintrip_import_result_master.png` | Import Link + Analyze Result: inner header, screen title, link field, Analyze CTA, analysis status line, parsed place result cards, batch add panel, coral batch CTA |

Every colour in `tokens/colors.css` was sampled pixel-by-pixel from those two files. Every photo,
sticker, wordmark, and icon in `assets/` was cropped out of them (see *Assets* below) rather than
redrawn, so the system carries the original artwork rather than an approximation of it.

**Product scope is deliberately narrow.** Trips, Add, Imports. There is no Explore, Journal,
Saves, Route, XP, Levels, Quests, Achievements, budgeting, or social feed — do not add them.

## Index（原始 DS 樹狀結構；本專案只含 styles.css、tokens/ 與 bundle）

- `styles.css` — the single entry point consumers link. `@import`s only.
- `tokens/` — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `effects.css`
- `components/` — 21 React primitives in five groups: `buttons/`, `forms/`, `cards/`, `display/`, `navigation/`
- `ui_kits/pintrip-app/` — click-through recreation of the app (`index.html`, `HomeScreen.jsx`, `ImportScreen.jsx`, `ImportsScreen.jsx`, `README.md`)
- `guidelines/` — 21 foundation specimen cards (Colors, Type, Spacing, Brand)
- `assets/photos/`, `assets/stickers/`, `assets/icons/` — real artwork cropped from the masters
- `thumbnail.html` — homepage tile
- `SKILL.md` — Agent Skills front matter for use outside this project

### Components

| Group | Components |
| --- | --- |
| `buttons/` | `Button`, `IconButton`, `FabButton` |
| `forms/` | `LinkInput` |
| `cards/` | `TripCard`, `PlaceResultCard`, `StartTripCard`, `BatchAddPanel`, `NoteCard` |
| `display/` | `Wordmark`, `Avatar`, `ScreenTitle`, `SectionHeader`, `CategoryBadge`, `Tag`, `CategoryIcon`, `Sticker`, `LocationLine`, `AnalyzeStatus` |
| `navigation/` | `AppHeader`, `BottomNav` |

Each component directory holds `<Name>.jsx`, `<Name>.d.ts` (props contract), `<Name>.prompt.md`
(what/when + usage), and one `@dsCard` HTML showing its states.

**Intentional additions.** The masters imply, but do not draw, three things that the components
above provide: `Sticker` (a positioning wrapper for the tape/cut-out layer that appears on nearly
every surface), `CategoryIcon` (a wrapper for the die-cut sticker glyphs on trip cards), and
`IconButton` (the round back control in the inner header, generalised). Nothing else was invented.

## Content fundamentals

**All product UI copy is Traditional Chinese (繁體中文).** PinTrip is not bilingual by role: structure
and feeling are both carried in Chinese. The earlier "English carries the structure" model no longer
holds — the shipped screens set navigation, actions, and object names in Chinese too.

The shipped screens (`HomeScreen.dc.html`, `ImportScreen.dc.html`) are the source of truth for copy;
the examples below are taken from them.

- **Traditional Chinese** for navigation, actions, and object names:「我的旅行收藏」「建立旅行收藏」
  「匯入連結」「分析連結」「編輯」「查看全部」「旅行收藏」「匯入」「28 個地點」「東京」「春日咖啡」.
  Title Case does not apply to Chinese — the equivalent rule is that headings and buttons carry no
  trailing punctuation at all（no 。and no ！）, and stay as short as the action allows.
- **The only English in the product is artwork, never UI copy**: the wordmark (PinTrip), the
  handwritten tagline ("Pin your best trips. Cherish every place."), and the paper note
  ("Collect moments, not things."). These three keep their English exactly as drawn, keep their
  original Title Case and sentence periods, and are never treated as strings to translate,
  reuse, or extend. Nothing else in the interface is set in English.
- **Traditional Chinese** for anything that describes, reassures, or confirms: trip notes
  (「東京的老派風景與新的日常交會。」), place descriptions
  (「面向蔚藍海景的濟州咖啡館，招牌紅蘿蔔蛋糕很受歡迎。」), helper lines
  (「貼上 Instagram 貼文連結，PinTrip 會整理出貼文裡提到的地點 ✨」), status
  (「分析完成！找到 3 個地點。」), and the batch CTA (「加入 3 個地點」).
- Chinese voice is plain, warm, and spoken — short sentences, no formal 公文 register and no
  exhortation. The app addresses the user as a companion and speaks about「我的旅行收藏」
  (my collection) — possession sits with the user.
- **Numbers are stated, never celebrated.** 「28 個地點」,「找到 3 個地點。」There are no
  streaks, scores, or progress bars, and no growth-flavoured copy.
- One exclamation mark per screen at most, and only on a genuinely good outcome
  (「分析完成！」). Questions are used for confirmation: 「要加入這 3 個地點嗎？」
- **Emoji: exactly one sparkle, and only in Chinese helper text** (✨ at the end of a helper line).
  Emotion elsewhere comes from stickers and photography, not glyphs. Never put emoji in a button,
  a heading, or the English artwork copy.
- Full-width Chinese punctuation（，。！？「」）— never ASCII commas or periods in Chinese copy.
- Marketing voice appears once, on Home, as a handwritten tagline
  ("Pin your best trips. Cherish every place.") and one paper note
  ("Collect moments, not things."). Both are artwork, not UI copy — brand asides, used once each,
  and the reason English survives on the screen at all.
- Hashtags are Traditional Chinese, un-spaced, 2–3 per place: `#海景 #風格咖啡 #涯月咖啡`.
- Never set Chinese copy in the handwriting script face.

## Visual foundations

**Palette.** Warm neutrals plus one accent. The page is cream `#F9F5ED`; cards are a warmer white
`#FFFDFA`; the nav bar is `#FCFBF7`. Soft blue is the only accent that carries meaning — links,
primary buttons, active nav, place counts (`#4C76C2`–`#5B87D0`). Coral, butter yellow, and soft
lavender appear only in small doses: category badges, tag tints, tape, pins, and the single coral
commit CTA. Never more than two accent hues on one card. Ink is warm-dark rather than black:
navy `#0B1B33` for serif display type, `#3B3B3D` for rounded-sans headings, `#777777` for body,
`#81817D` for Korean secondary copy.

**Type.** Three roles, strictly separated. A high-contrast serif (Playfair Display) for the
wordmark, trip titles, and section headings — this is what makes the app feel like a keepsake.
A rounded geometric sans (Quicksand, 700 almost everywhere) for screen titles, place names,
buttons, and nav labels — friendly, never techy. A handwriting script (Caveat) for the tagline and
margin notes only. Korean is Noto Sans KR at 300–700, line-height 1.6. Never set Korean in the
script face, and never set a button in the serif.

**Backgrounds.** Flat cream. No gradients, no textures, no full-bleed imagery, no illustration
backdrops. The one tinted surface is the Start New Trip panel (`#ECF2F6`) with a faint world-map
cut-out behind its text, multiplied into the panel. Depth comes from paper stacking, not colour.

**Cards.** 20px radius, `#FFFDFA` fill, no border, and a single soft warm shadow
(`0 4px 14px rgba(122,96,58,0.07)`). Inside a card, sections are separated by a **1px dashed
cream rule**, never a solid line. Trip cards are two-column: text left, a 172px square photo
right, sitting nearly flush to the card's right and bottom edges. Result cards put a
120×136 photo in a 5px white polaroid frame on the left. Special cards (Start New Trip, batch
add) use a 1.5px **dashed** border instead of a shadow — dashed means "not a thing yet".

**Stickers and tape.** One or two per surface, never a collage. Washi tape strips are
semi-transparent, 15–18px tall, tilted −8° to +7°, and cross an edge so they read as physically
holding something down; they come solid, gingham, or dotted. Cut-out stickers (envelope, luggage,
sparkles, category glyphs, stamps) carry a white die-cut outline and a 2px drop shadow. Tape and
stickers are always decorative — never the only signifier of anything, never interactive.

**Photography.** Natural travel photography, warm and softly lit: hazy cherry blossom, dusk lanes,
ocean glare, food from above. No filters, no duotone, no black and white, no grain. Photos are
square-ish, 12–14px radius (or the white polaroid frame), and always carry a real place — no stock
gloss, no people posed to camera. The account avatar is the only portrait.

**Buttons and states.** Primary is a blue fill at 14px radius with a soft blue shadow; the single
per-screen commit action is coral. In-card actions pair an outline button (white fill, 1.5px blue
hairline) with a solid blue one — never two fills of the same colour side by side. Press state is
uniform: `scale(0.97)` plus `brightness(0.96)` over 120ms. There are no hover states in the app
itself (touch); on web surfaces, hover darkens a fill by one step and never changes size.
Disabled is 45% opacity with no colour change. Selected/added state keeps the button in place and
swaps the label to a checked "Added" — nothing disappears from the layout.

**Motion.** Gentle and short: `cubic-bezier(0.32,0.72,0.28,1)` for state changes at 200ms,
`cubic-bezier(0.34,1.32,0.52,1)` for the FAB and anything that should feel slightly springy,
320ms for sheets. Fades rather than slides for content; no bounce, no confetti, no parallax.

**Transparency and blur.** Almost none. Tape uses 92% opacity; the map cut-out multiplies at 90%.
No frosted glass, no scrim overlays, no protection gradients — the bottom bar is opaque paper with
a soft upward shadow instead, and the FAB wears a 5px cream ring so it reads as sitting on top of
the bar rather than floating in glass.

**Layout.** 390×844 frame, 20px gutters, 16px between cards. Two fixed elements only: the status
bar and the bottom navigation (72px, top corners rounded 26px). Everything else scrolls. The
bottom bar is exactly Trips — centred Add — Imports; account lives in the Home header and never in
the bar. Minimum tap target 44px.

## Iconography

There is no icon font, sprite sheet, or SVG set in the sources — the masters render icons as small
soft-filled raster glyphs with a hand-drawn feel. Rather than substitute a CDN icon library
(Lucide, Heroicons) whose stroke language would fight the brand, **every icon in `assets/icons/`
was cropped from the masters at full resolution**:

- **Map pins** — `pin-coral.png` (a trip's country, on Home) and `pin-blue.png` (a place's street
  address, on result cards). The pin colour is the only difference; the meaning is the level of
  precision.
- **Actions** — `pencil.png` (Edit), `sparkle.png` (Analyze Link), `check-circle.png` (analysis
  complete), `check-outline.png` (batch confirm), `arrow-back.png`, `clear-x.png`. The hand-drawn
  pointer beside the status line is `arrow-curve.png`, which lives in `assets/stickers/`.
- **Navigation** — `nav-trips.png` (suitcase), `nav-imports.png` (download tray). Inactive tabs are
  desaturated and dropped to 55% opacity rather than swapped for an outline variant.
- **Third-party** — `icon-instagram.png` (in `assets/stickers/`), the source badge inside the link field.
- **Marginalia** — `heart-outline.png`, `star-outline.png`, `flower.png`: one tiny mark per result
  card at the right edge, purely affective.
- **Category stickers** live in `assets/stickers/` (`icon-torii`, `icon-food`, `icon-train`,
  `icon-pagoda`, `icon-maple`, `icon-matcha`) — these are die-cut stickers, not icons, and are used
  only in the trip-card footer to hint at what a collection holds.
- **Typographic glyphs** carry a few small jobs where an icon would be too heavy: `•••` for a card
  menu, `›` after "View all", `+` in Add to Trip and the FAB, `→` in Start New Trip, `✓` for added.

Emoji is not used as iconography anywhere. The one ✨ in Korean helper copy is text, not an icon.

## Substitutions and gaps — please review

- **`--font-kr` is a Korean face being used to set Traditional Chinese — UNDECIDED.** The shipped
  screens (`HomeScreen.dc.html`, `ImportScreen.dc.html`) set all Chinese copy in `--font-kr`, whose
  value is Noto Sans KR. Two real consequences: (1) **coverage gaps** — characters outside the
  Korean face's Han subset silently fall back to the platform `sans-serif`, so a single line can mix
  two faces; (2) **wrong glyph forms** — shared Han characters render in Korean regional forms
  rather than Traditional Chinese forms. The shipped Chinese copy is therefore not correctly
  typeset today. Fixing this means replacing an external webfont dependency, which also forces a
  re-check of every type size and line-height in `tokens/typography.css` — out of scope here, and
  no replacement face has been chosen. The token name `--font-kr` is also semantically wrong now
  and needs renaming as part of the same decision. Nothing in `tokens/` or the screens was changed
  for this entry — it is a recorded gap awaiting a product/type decision.
- **Fonts are Google Fonts stand-ins.** No font binaries were supplied, so `tokens/fonts.css`
  loads Playfair Display, Quicksand, Caveat, and Noto Sans KR from the Google Fonts CDN as the
  nearest matches to the masters. If PinTrip owns licensed faces (a Korean display face in
  particular), send the files and this file becomes `@font-face` rules over local binaries.
- **No logo file was provided.** The wordmark PNGs in `assets/stickers/` are crops of the masters,
  which is the real artwork but at mockup resolution. `Wordmark` also has a type-only fallback
  (Playfair + a coral pin dot) for cases where the PNG can't load. A vector wordmark would replace
  both.
- **Some cropped photos have stickers baked in** — 本專案已改用 clean plates + 分層裝飾（見 `CLAUDE.md`）。原始說明保留為背景： (the Tokyo stamp, the Kyoto lavender sprig, the
  Jeju stamps and heart) because they were composited into the source imagery. Clean plates would
  let the sticker layer be composed properly per card.
- **Type sizes are readable-first, not literal.** Measured against a 390pt frame, the masters'
  body copy would land around 8pt — too small to ship. Sizes here are scaled up to real mobile
  minimums while holding the masters' proportions and hierarchy.
