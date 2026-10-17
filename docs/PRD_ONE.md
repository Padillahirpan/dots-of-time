# PRD ONE — Dots of Time (Prototype Baseline)

**Document status**: Source of truth for Build One — the implemented behavior of
`docs/prototype.html` (single-file, dependency-free, client-side only).
**Companion docs**: `IDEA.md` (concept), `PRD.md` (aspirational full spec), `RESUME.md` (design breakdown).
**Scope note**: Where `PRD.md` and the prototype disagree, **this document wins for Build One**. Deltas are listed in §12.

---

## 1. Summary

A single-page app with four time-scale tabs (**Day / Week / Month / Year**). Each tab renders:

1. A **dot matrix** showing elapsed time as progressively filled circles.
2. A **percentage elapsed** metric (tabular numerals).
3. Up to **3 goals** for that period, shown as water-fill cards grouped under a focus line.

State persists in `localStorage`. No backend, no accounts, no network calls (fonts excepted).

---

## 2. Shell & Navigation

| Element | Behavior |
| :--- | :--- |
| Header `h1` | Today's date, long locale format, e.g. `<b>Friday, 16 October</b>`. |
| Theme button | Cycles explicit `light` ↔ `dark`. Initial value follows OS `prefers-color-scheme`; stored override wins thereafter. |
| Accent button (`aria-expanded`) | Toggles a collapsible panel with a 12-swatch hue picker (0°–330° in 30° steps). Selected swatch gets `aria-pressed="true"` and a foreground ring. |
| Tabs | `role="tablist"`, buttons `Day/Week/Month/Year` with `aria-selected`; active tab is inverted (fg bg). Selected tab is persisted and restored on load. |
| Layout | Single column, `max-width: 720px`, `20px/16px` gutters, bottom padding 48px. `viewport-fit=cover` + safe-area insets honored top/bottom. |
| Tooltip `#tip` | Fixed, non-interactive status bubble (`role="status"`), auto-hides after **2200 ms**. Used by the Year grid. |

## 3. Time Engine

- A single `tick()` runs **every 30 s** (interval), immediately on load, and on every
  `visibilitychange` → visible. A `chk()` in the same cycle detects period rollover
  (day/week/month/year key change) and re-renders goals for the new period; past-period
  data is preserved in storage.
- Dot grids are **rebuilt only when the year-month changes** (cache keyed `y-m`);
  percentages repaint every tick.
- Progress uses real timestamps, not integer day counts (DST/leap-safe).

### 3.1 Boundaries & formulas

Period boundaries `B` are `[start, end)` local-time pairs:

| Scale | Start | End | Progress `P` |
| :--- | :--- | :--- | :--- |
| `d` | today 00:00 | tomorrow 00:00 | `(T − start) / 24h` |
| `w` | Monday 00:00 | next Monday 00:00 | `(T − start) / 7d` |
| `m` | 1st 00:00 | 1st of next month | `(T − start) / monthLen` |
| `y` | Jan 1 00:00 | Jan 1 next year | `(T − start) / yearLen` (365/366 via ms diff) |

- Per-dot fraction: day dots `clamp(P.d·24 − i)`; week dots `clamp(P.w·7 − i)`;
  month/year dots `clamp((T − date_i) / 1d)` — the current dot fills continuously.
- Header percentage per view: `(P[k]·100).toFixed(1)` + a small `%` suffix.

## 4. Cadence Views

| View | Grid | Dots | Extras |
| :--- | :--- | :--- | :--- |
| Day | 12 cols × 2 rows, gap 8px | 24 (1 dot = 1 hour) | Each dot has `title="H:00"`. Sub-label "24 hours". |
| Week | 7 cols, gap 10px | 7 (Mon–Sun) | Each dot has weekday `title`. Sub-label "Mon to Sun". |
| Month | 7 cols (Monday-aligned), max-width 320px | 28–31 + hidden `.pad` cells for the leading offset `(firstDay+6)%7` | Sub-label "MonthName, N days". |
| Year | `auto-fill minmax(14px,1fr)`, gap 5px | 365/366 | Dots are buttons-by-click: tapping shows a tooltip `Wed, 16-10` (weekday short, `DD-MM`). Sub-label "YYYY, N days". |

### 4.1 Dot states

| State | Rule | Visual |
| :--- | :--- | :--- |
| Partial (`.now`) | `0 < f < 1` | Horizontal gradient fill to fraction; accent border; ambient pulse ring (`box-shadow` 3px, 2.4 s ease-in-out infinite; disabled under `prefers-reduced-motion`). |
| Full (`.on`) | `f ≥ 1` | Fully filled, accent border. |
| Open | `f = 0` | Transparent, 1.5px border at 45% accent (`color-mix`). |
| Pad (`.pad`) | Month leading cells | `visibility:hidden` spacers. |

## 5. Goals — Rule of Three & Cascade

### 5.1 Cardinality

- **Hard cap: 3 goals per period per scale** (`d`, `w`, `m`, `y` independently — not per category).
- While `count < 3`, a dashed "＋ Add goal — N of 3" card renders; at 3 it disappears.
- Creation is additionally blocked in code if `count ≥ 3` (silent guard).

### 5.2 Goal record

```js
{ id: uid7, c: categoryId, t: "title ≤80 chars", s: 0|1|2, o: bool, p: parentId|"" }
```

- **Status** `s`: `0 To do / 1 Doing / 2 Done` → card water fill `s × 50%` (0 / 50 / 100%).
- **★ The One** `o`: exclusive within the period list — setting it clears `o` on all
  siblings; it can also be toggled off (zero starred is allowed). Starred goals show
  a ★ prefix on the card title and the toggle renders `aria-pressed`.
- **Cascade** `p`: mandatory parent link for `d→w`, `w→m`, `m→y`. Year goals have no
  parent (`PAR.y = ''`). A child **inherits its category from the parent goal**;
  only year goals choose a category directly.

### 5.3 Focus line

Under each grid: `Focus: CatA, CatB` — categories of the period's goals, ordered by
goal count (desc). Empty state: `No goals yet`.

### 5.4 Goal card (`.cb`)

- Water level `span.wt` behind content; a wave crest (::before, 7 s translate loop)
  animates the meniscus when level > 0; hidden at 0%.
- Border tinted by category hue; text shows ★ (if The One) + title (3-line clamp) and
  `Category, Status`.
- Click → view/edit dialog. Click add-card → create dialog.

## 6. Categories

- Defaults: `Life (hue 150)`, `Career (hue 250)`, `Money (hue 60)`.
- Unbounded user categories: name (≤24 chars) + hue from the same 12-swatch picker.
- Created inline inside the goal dialog ("＋ New" chip → name field + hue swatches +
  "Add category"); new category is auto-selected for the goal being created/edited.
- Categories are global (shared across scales); goals reference them by `id`.
- Deleted parent-period goals degrade gracefully: children keep stale `p`, and the
  "Serves:" line simply stops rendering.

## 7. Dialog Flows (native `<dialog>`)

Backdrop click closes. All actions persist immediately and re-render.

### 7.1 Create (`New <scale> goal`, "N of 3")

1. Title input (≤80 chars, required — inline error `Write the goal first.`).
2. Parent scale exists (d/w/m):
   - Parent list non-empty → chip list of parent-period goals; exactly one must be
     selected (error `Pick the goal it serves.`). If only one candidate, preselected.
   - Parent list empty → message "Set a `<parent>` goal first. Every goal serves a
     bigger one." + `Go to <parent>` button (closes dialog, switches tab).
3. Year goals → category chip list (+ inline new-category form).
4. `Create goal` (or Enter in the title field) → append, save, close.

### 7.2 View / Edit

- Header: title, `<Scale> goal, <Category>`, `Adjust` toggle, `×` close.
- Static view: `Serves: <parent title>` (when resolvable); status segmented control
  (To do / Doing / Done); `★ The One` toggle.
- Edit mode (`Adjust`): title input (saves on change), category chips (year goals
  only), plus `Delete goal` with **two-tap confirmation** ("Tap again to delete").
- Enter in a text field triggers the primary action of that section.

## 8. Theming & Visual System

- **Tokens (CSS custom properties)**: `--bg --fg --mut --line --panel` + accent
  channel vars `--L --C --h` composed as `oklch(var(--L) var(--C) var(--h))`.
- Light: paper `#f6f5f2`, panel `#fff`, fg `#1b1b1f`, mut `#6c6c74`, line `#dcdad4`.
- Dark: `#121214 / #19191d / #ececf0 / #8b8b95 / #2a2a30`; accent lightness `.76`, chroma `.14`.
- Category hues: `oklch(var(--L) var(--C) var(--ch))` — same perceptual tuning.
- Type: Instrument Sans (400/500/600); percentages in 34px with
  `font-variant-numeric: tabular-nums`.
- Motion: wave (7 s) + dot pulse (2.4 s) only, both gated on
  `prefers-reduced-motion: no-preference`.
- Focus: `:focus-visible` gets a 2px accent outline on all interactive elements.

## 9. Data & Persistence

| Key | Contents |
| :--- | :--- |
| `dots` | `{ h: accentHue, t: "light"\|"dark"\|null, v: "d"\|"w"\|"m"\|"y" }` |
| `dots-c2` | `[{ id, n, h }]` categories |
| `dots-g2` | goals keyed `"<scale>:<periodKey>"` → array of goal records |

Period keys (local time): day `YYYY-MM-DD`; week = **Monday's** `YYYY-MM-DD`;
month `YYYY-MM`; year `YYYY`. All writes are wrapped in try/catch (storage-safe).
Malformed JSON falls back to defaults.

## 10. Accessibility

- Tabs: `role="tablist"/"tab"`, `aria-selected`; accent panel: `aria-expanded`; swatches,
  chips, segments, star: `aria-pressed`; tooltip: `role="status"`.
- Color is never the sole signal (states also differ by fill/outline/animation).
- Reduced-motion support; visible focus rings; text contrast meets AA on both themes.

## 11. Acceptance Criteria (Build One)

1. Percentages and dot fills track wall-clock time across all 4 scales, updating at
   least every 30 s and on tab re-focus, without reload.
2. Leaving the tab open across midnight / week / month / year boundary switches goal
   lists to the new period; previous period goals remain retrievable in storage.
3. Adding a 4th goal is impossible (add card hidden; guard blocks direct call).
4. Starring a goal clears the star from siblings; the star can be removed entirely.
5. A day/week/month goal cannot be created without a parent; with no parent goals,
   the UI offers navigation to create one first.
6. Theme, accent hue, and last tab survive reload; goals/categories survive reload.
7. Backdrop click, `×`, and `Escape` (native) all close the dialog without data loss
   beyond unsaved draft fields.
8. File works fully offline (fonts gracefully degrade to system sans).

## 12. Deltas vs `PRD.md` (aspirational)

| Topic | PRD.md | Build One (this doc) |
| :--- | :--- | :--- |
| Cap unit | 3 per **category** per scale | 3 per **period** per scale |
| Goal progress | 0–100% slider + notes | 3-state status (0/50/100% water) |
| Parent link | Optional | Mandatory for d/w/m |
| Categories | Fixed 3 domains (+custom) | Free-form, 3 seeded defaults |
| Modals | Inspect dialog + Adjust modal | One combined view/edit dialog |
| Stack | React/Vite/Zustand/Tailwind | Vanilla single HTML file |

---
*Derived line-by-line from `docs/prototype.html`. Update this file whenever the prototype changes.*
