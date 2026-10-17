# Dots of Time

A calm web app that shows how much of today, this week, this month, and this year has passed, as dots and a percent. On top of that sits a goal layer built on the **Rule of Three**: three wins per day, week, month, and year.

The dots show the time you have. The three wins show how you spend it.

- Status: prototype validated (single HTML file). This README describes the production build.
- Stack: React, Vite, Zustand, Tailwind CSS.
- Data: all in the browser (`localStorage`). No backend, no account.

---

## Table of contents

1. [Product](#1-product)
2. [Tech stack](#2-tech-stack)
3. [Getting started](#3-getting-started)
4. [Project structure](#4-project-structure)
5. [Time logic](#5-time-logic)
6. [State management](#6-state-management)
7. [Design system](#7-design-system)
8. [Components](#8-components)
9. [Accessibility](#9-accessibility)
10. [Roadmap](#10-roadmap)
11. [Decisions log](#11-decisions-log)

---

## 1. Product

### 1.1 Time view

One scale is shown at a time. The user picks it with tabs: **Day, Week, Month, Year**. The last choice is remembered.

| Scale | Dots | Unit of a dot | Notes |
|-------|------|---------------|-------|
| Day   | 24   | 1 hour        | Full 24 hours, no waking-hours filter |
| Week  | 7    | 1 day         | Week starts **Monday** |
| Month | 28-31 | 1 day        | Dynamic. 7-column grid aligned to Monday, with empty padding cells |
| Year  | 365 or 366 | 1 day   | Leap years handled. Tap a dot to see weekday and date, e.g. `Fri, 02-08` (DD-MM) |

Rules:

- Show **percent passed**, not percent left.
- The current dot is **partly filled** in proportion to how much of that unit has passed, and has a soft ring.
- Passed dots are filled, remaining dots are outlined. Color is never the only signal.
- Percent updates every 30 seconds and when the tab becomes visible again.

### 1.2 Your three (Rule of Three)

Each scale has a list called **Your three**.

- **Hard cap of 3** per period. At three, the add row is replaced by: "Three is the limit. Remove one to add another."
- Each win has an **area**: Life, Career, or Money. The area sets the color of its done-circle.
- One win per list can be starred as **the one**: the win that gives the most result (the Pareto filter). It is a prompt to choose, not a calculation. The app never shows 80/20 numbers.
- **Cascade.** A day win can link to a week win, a week win to a month win, a month win to a year win. The linked parent is shown under the title.
- Lists belong to a period. When the day, week, month, or year changes, the list for the new period starts empty. Old lists stay in storage.

Background: the Rule of Three comes from Chris Bailey's *The Productivity Project*. The cap is the point: it forces prioritization.

Guidance for users (shown in onboarding copy):

- Start with the daily three. Add the weekly three when it feels easy.
- Aim for goals that are doable in the period, but not too easy.
- Think about balance. Pick wins across Life, Career, and Money, not only work.

### 1.3 Personalization

- **Accent color:** 12 hues from the color wheel (30 degree steps).
- **Area colors:** Life, Career, and Money each have their own hue, changeable by tapping.
- **Theme:** light, dark, or follow the system.

### 1.4 Not in scope yet

Reminders and notifications, review and history screens, sync across devices, accounts. See [Roadmap](#10-roadmap).

---

## 2. Tech stack

| Concern | Choice | Why |
|---------|--------|-----|
| UI | React 18 + TypeScript | Familiar, component model fits dots and lists |
| Build | Vite | Fast dev server, small production bundle |
| State | Zustand + `persist` middleware | Tiny, no boilerplate, saves to `localStorage` out of the box |
| Styling | Tailwind CSS with design tokens as CSS variables | Utility classes plus themeable tokens |
| Dates | Native `Date` and `Intl` | No date library needed for this scope |
| Tests | Vitest + Testing Library | Same config as Vite |
| PWA (later) | `vite-plugin-pwa` | Installable, offline |

Principle: no backend and no heavy dependencies. The app should open instantly.

---

## 3. Getting started

```bash
# create the project
npm create vite@latest dots-of-time -- --template react-ts
cd dots-of-time

# dependencies
npm i zustand
npm i -D tailwindcss @tailwindcss/vite vitest @testing-library/react jsdom

npm run dev
```

Tailwind v4 with the Vite plugin:

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({ plugins: [react(), tailwindcss()] })
```

```css
/* src/styles/index.css */
@import "tailwindcss";
@import "./tokens.css";
```

Scripts:

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server |
| `npm run build` | Type-check and build |
| `npm run preview` | Preview the build |
| `npm run test` | Run Vitest |

---

## 4. Project structure

```
src/
  main.tsx
  App.tsx
  styles/
    index.css          # Tailwind import
    tokens.css         # design tokens (CSS variables)
  lib/
    time.ts            # period boundaries, progress, dot fractions
    keys.ts            # storage keys per period
    color.ts           # hue list, oklch helpers
    format.ts          # percent and date labels
  store/
    useAppStore.ts     # settings: view, hue, theme, area hues
    useWinsStore.ts    # wins by period key
  hooks/
    useNow.ts          # ticking clock (30 s + visibilitychange)
    useTheme.ts        # applies data-theme and hue to <html>
  components/
    Tabs.tsx
    PeriodHeader.tsx   # title, subtitle, big percent
    DotGrid.tsx        # generic grid of Dot
    Dot.tsx
    DayGrid.tsx / WeekGrid.tsx / MonthGrid.tsx / YearGrid.tsx
    DateTip.tsx        # year dot tooltip
    Wins/
      WinList.tsx
      WinRow.tsx
      WinAdd.tsx
    SettingsPanel.tsx
    HuePicker.tsx
  types.ts
```

---

## 5. Time logic

All progress is computed from **timestamps**, not from counting hours. This keeps daylight saving days (23 or 25 hours) and leap years correct.

```ts
// src/lib/time.ts
export type Scale = 'd' | 'w' | 'm' | 'y'

export function bounds(scale: Scale, now: Date): [Date, Date] {
  const y = now.getFullYear(), m = now.getMonth(), d = now.getDate()
  switch (scale) {
    case 'd': return [new Date(y, m, d), new Date(y, m, d + 1)]
    case 'w': {
      const monday = (now.getDay() + 6) % 7        // Monday = 0
      return [new Date(y, m, d - monday), new Date(y, m, d - monday + 7)]
    }
    case 'm': return [new Date(y, m, 1), new Date(y, m + 1, 1)]
    case 'y': return [new Date(y, 0, 1), new Date(y + 1, 0, 1)]
  }
}

export function progress(scale: Scale, now: Date): number {
  const [a, b] = bounds(scale, now)
  return (+now - +a) / (+b - +a)                    // 0..1
}

// fraction of dot i that has passed (0..1). Drives the partial fill.
export function dotFraction(p: number, count: number, i: number): number {
  return Math.min(1, Math.max(0, p * count - i))
}
```

For month and year, a dot is one calendar day, so use its own start and end date instead of `p * count`, which avoids drift on DST days:

```ts
export function dayFraction(now: Date, y: number, m: number, day: number) {
  const a = new Date(y, m, day), b = new Date(y, m, day + 1)
  return Math.min(1, Math.max(0, (+now - +a) / (+b - +a)))
}
```

Month padding: the first of the month falls on column `(new Date(y, m, 1).getDay() + 6) % 7` of the 7-column grid.

Clock hook:

```ts
// src/hooks/useNow.ts
import { useEffect, useState } from 'react'

export function useNow(intervalMs = 30_000) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const tick = () => setNow(new Date())
    const id = setInterval(tick, intervalMs)
    const vis = () => { if (!document.hidden) tick() }
    document.addEventListener('visibilitychange', vis)
    return () => { clearInterval(id); document.removeEventListener('visibilitychange', vis) }
  }, [intervalMs])
  return now
}
```

---

## 6. State management

Two small Zustand stores, each persisted under its own `localStorage` key.

```ts
// src/types.ts
export type Scale = 'd' | 'w' | 'm' | 'y'
export type Area = 0 | 1 | 2                 // Life, Career, Money

export interface Win {
  id: string
  title: string
  area: Area
  parentId?: string                          // win in the next larger scale
  done: boolean
  one: boolean                               // "the one"
}
```

Period keys group wins by period:

| Scale | Key example | Rule |
|-------|-------------|------|
| Day   | `d:2026-10-16` | local date |
| Week  | `w:2026-10-12` | date of the Monday |
| Month | `m:2026-10`    | year-month |
| Year  | `y:2026`       | year |

```ts
// src/store/useWinsStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Win } from '../types'

const MAX = 3

interface WinsState {
  byPeriod: Record<string, Win[]>
  add: (key: string, w: Omit<Win, 'id' | 'done' | 'one'>) => boolean
  toggleDone: (key: string, id: string) => void
  setOne: (key: string, id: string) => void   // only one per list
  remove: (key: string, id: string) => void
}

export const useWinsStore = create<WinsState>()(
  persist(
    (set, get) => ({
      byPeriod: {},
      add: (key, w) => {
        const list = get().byPeriod[key] ?? []
        if (list.length >= MAX || !w.title.trim()) return false
        const win: Win = { ...w, id: crypto.randomUUID(), done: false, one: false }
        set({ byPeriod: { ...get().byPeriod, [key]: [...list, win] } })
        return true
      },
      toggleDone: (key, id) => set(s => ({
        byPeriod: { ...s.byPeriod, [key]: (s.byPeriod[key] ?? []).map(w => w.id === id ? { ...w, done: !w.done } : w) },
      })),
      setOne: (key, id) => set(s => ({
        byPeriod: { ...s.byPeriod, [key]: (s.byPeriod[key] ?? []).map(w => ({ ...w, one: w.id === id ? !w.one : false })) },
      })),
      remove: (key, id) => set(s => ({
        byPeriod: { ...s.byPeriod, [key]: (s.byPeriod[key] ?? []).filter(w => w.id !== id) },
      })),
    }),
    { name: 'dots-wins', version: 1 },
  ),
)
```

```ts
// src/store/useAppStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Scale } from '../types'

interface AppState {
  view: Scale
  hue: number                                  // accent, 0..330 step 30
  theme: 'system' | 'light' | 'dark'
  areaHues: [number, number, number]           // Life, Career, Money
  setView: (v: Scale) => void
  setHue: (h: number) => void
  setTheme: (t: AppState['theme']) => void
  cycleAreaHue: (i: 0 | 1 | 2) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      view: 'd', hue: 250, theme: 'system', areaHues: [150, 250, 60],
      setView: (view) => set({ view }),
      setHue: (hue) => set({ hue }),
      setTheme: (theme) => set({ theme }),
      cycleAreaHue: (i) => set(s => {
        const a = [...s.areaHues] as AppState['areaHues']
        a[i] = (a[i] + 30) % 360
        return { areaHues: a }
      }),
    }),
    { name: 'dots-app', version: 1 },
  ),
)
```

Notes:

- Wins whose `parentId` no longer exists (the parent period rolled over or was removed) simply show no link.
- Use `version` and `migrate` in `persist` when the shape changes, so old data is not lost.
- Selectors: read only what a component needs, e.g. `useWinsStore(s => s.byPeriod[key])`.

---

## 7. Design system

### 7.1 Principles

1. **Calm.** One scale on screen, lots of space, no decoration that does not carry information.
2. **Dots are the hero.** Everything else is quiet.
3. **Color is never the only signal.** Filled versus outlined carries the meaning.
4. **One accent.** The accent color follows the user's choice.
5. **Plain words.** Sentence case, short labels, no jargon.

### 7.2 Color

Colors are defined in **OKLCH**, not HSL. In HSL a yellow looks far brighter than a blue at the same lightness, so a 12-color wheel would look uneven. In OKLCH, equal lightness looks equal.

**Accent wheel:** 12 hues at 30 degree steps.

| # | Hue | # | Hue | # | Hue |
|---|-----|---|-----|---|-----|
| 1 | 0   | 5 | 120 | 9 | 240 |
| 2 | 30  | 6 | 150 | 10 | 270 |
| 3 | 60  | 7 | 180 | 11 | 300 |
| 4 | 90  | 8 | 210 | 12 | 330 |

Default accent: **250** (blue). Default area hues: Life **150**, Career **250**, Money **60**.

**Accent recipe** (lightness and chroma depend on theme; only the hue changes):

| Theme | L | C |
|-------|---|---|
| Light | 0.62 | 0.16 |
| Dark  | 0.76 | 0.14 |

```css
/* src/styles/tokens.css */
:root {
  /* neutrals, light */
  --bg: #f6f5f2;
  --panel: #ffffff;
  --fg: #1b1b1f;
  --mut: #6c6c74;
  --line: #dcdad4;

  /* accent */
  --L: 0.62;
  --C: 0.16;
  --h: 250;
  --a: oklch(var(--L) var(--C) var(--h));
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg: #121214; --panel: #19191d; --fg: #ececf0; --mut: #8b8b95; --line: #2a2a30;
    --L: 0.76; --C: 0.14;
  }
}
:root[data-theme="dark"] {
  --bg: #121214; --panel: #19191d; --fg: #ececf0; --mut: #8b8b95; --line: #2a2a30;
  --L: 0.76; --C: 0.14;
}
```

**Semantic tokens**

| Token | Use |
|-------|-----|
| `--bg` | Page background |
| `--panel` | Cards, panels, tab bar, inputs on panels |
| `--fg` | Primary text, selected tab fill |
| `--mut` | Secondary text, labels |
| `--line` | Dividers and borders |
| `--a` | Accent: percent, filled dots, "the one" star |

**Dot colors** (derived from the accent):

| State | Fill | Border |
|-------|------|--------|
| Remaining | transparent | accent at 45% |
| Passed | accent | accent |
| Current | proportional fill | accent at 45%, plus a 3 px ring at 25% |

### 7.3 Tailwind configuration

Map tokens to Tailwind so classes like `bg-panel` and `text-mut` work (Tailwind v4, in CSS):

```css
/* src/styles/index.css */
@import "tailwindcss";
@import "./tokens.css";

@theme inline {
  --color-bg: var(--bg);
  --color-panel: var(--panel);
  --color-fg: var(--fg);
  --color-mut: var(--mut);
  --color-line: var(--line);
  --color-accent: var(--a);

  --font-sans: "Instrument Sans", ui-sans-serif, system-ui, sans-serif;

  --radius-sm: 8px;
  --radius-md: 12px;
}
```

Usage: `bg-panel border border-line text-mut rounded-md`.

### 7.4 Typography

| Role | Spec |
|------|------|
| Family | Instrument Sans (Google Fonts), fallback `system-ui, sans-serif` |
| Weights | 400 body, 500 headings and percent, 600 emphasis |
| Rendering | `-webkit-font-smoothing: antialiased` |
| Numbers | `font-variant-numeric: tabular-nums` on every percent so digits do not jump |

| Style | Size | Weight | Tailwind |
|-------|------|--------|----------|
| Percent | 34 px, tracking -0.02em | 500 | `text-[34px] font-medium tracking-tight tabular-nums text-accent` |
| Section title | 15 px | 500 | `text-[15px] font-medium` |
| Body, win title | 14.5 px | 400 | `text-[14.5px]` |
| Secondary | 12-13 px | 400 | `text-xs text-mut` |
| Inputs | 16 px (prevents iOS zoom) | 400 | `text-base` |

Rules: sentence case, no all-caps labels, line length under 80 characters.

### 7.5 Spacing, shape, elevation

- **Spacing scale:** 4, 8, 10, 14, 16, 18, 20 px. Page padding 16 px, content max width 720 px.
- **Radius:** dots fully round; buttons and inputs 8 px; panels 12 px.
- **Borders over shadows.** Panels use a 1 px `--line` border. No drop shadows, except the soft ring on the current dot and the year tooltip.
- **Section separation:** a 1 px top border, not cards.

### 7.6 Dot specification

| Scale | Grid | Gap | Notes |
|-------|------|-----|-------|
| Day   | 12 columns, 2 rows | 8 px | Hour title on press |
| Week  | 7 columns | 10 px | Larger dots, label per day |
| Month | 7 columns, max width 320 px | 8 px | Hidden padding cells before day 1 |
| Year  | `repeat(auto-fill, minmax(14px, 1fr))` | 5 px | Tap shows `Fri, 02-08` |

Dot styles:

```css
.dot {
  aspect-ratio: 1;
  border-radius: 9999px;
  border: 1.5px solid color-mix(in srgb, var(--a) 45%, transparent);
  background: linear-gradient(90deg, var(--a) calc(var(--f) * 100%), transparent calc(var(--f) * 100%));
}
.dot[data-passed="true"] { border-color: var(--a); }
.dot[data-current="true"] { box-shadow: 0 0 0 3px color-mix(in srgb, var(--a) 25%, transparent); }
```

`--f` is the fraction (0 to 1) from `dotFraction`. A dot is "passed" when `--f` is 1 and "current" when it is between 0 and 1.

### 7.7 Motion

- Only one ambient animation: a slow (2.4 s) pulse of the ring on the current dot.
- Respect `prefers-reduced-motion`: no pulse.
- No entrance animations and no hover transitions on every element.

### 7.8 Iconography and copy

- Almost no icons: star for "the one", a plain multiplication sign for remove.
- Copy examples: "Your three", "2 of 3 done", "Win 2 of 3", "Three is the limit. Remove one to add another."
- Errors say what happened and how to fix it. They do not apologize.

---

## 8. Components

| Component | Props | Notes |
|-----------|-------|-------|
| `Tabs` | `value`, `onChange` | `role="tablist"`, selected tab uses `bg-fg text-bg` |
| `PeriodHeader` | `title`, `subtitle`, `percent` | Percent in accent color, tabular numbers |
| `DotGrid` | `count`, `padStart`, `fractionFor(i)`, `cols` | Renders `Dot`s, handles padding cells |
| `Dot` | `fraction`, `label` | Sets `--f`, `data-passed`, `data-current`, `aria-label` |
| `DateTip` | `date`, `anchor` | Shows weekday and date, hides after about 2 s |
| `WinList` | `scale` | Reads the period key, shows rows or add row |
| `WinRow` | `win`, `parentTitle` | Done circle in area color, star, remove |
| `WinAdd` | `scale`, `parents` | Input, area select, optional link select, Add |
| `SettingsPanel` | none | Accent `HuePicker`, area colors, theme toggle |

Composition:

```tsx
// src/App.tsx (outline)
export default function App() {
  const now = useNow()
  const view = useAppStore(s => s.view)
  useTheme()
  return (
    <main className="mx-auto max-w-[720px] px-4 pb-12 pt-5">
      <Header now={now} />
      <Tabs />
      <PeriodView scale={view} now={now} />   {/* header + grid + WinList */}
    </main>
  )
}
```

Theme hook applies state to the document:

```ts
// src/hooks/useTheme.ts
import { useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'

export function useTheme() {
  const { hue, theme } = useAppStore()
  useEffect(() => {
    const r = document.documentElement
    r.style.setProperty('--h', String(hue))
    if (theme === 'system') r.removeAttribute('data-theme')
    else r.dataset.theme = theme
  }, [hue, theme])
}
```

---

## 9. Accessibility

- Passed and remaining dots differ by fill, not only by color.
- Every dot has an `aria-label` (for example "Tuesday" or "14:00").
- Tabs use `role="tablist"` and `role="tab"` with `aria-selected`.
- Icon buttons have `aria-label` ("Remove", "The one", "Done") and `aria-pressed` where they toggle.
- Visible keyboard focus: `outline: 2px solid var(--a); outline-offset: 2px`.
- Contrast: text on `--bg` meets WCAG AA in both themes. Check each accent hue on both themes before release.
- `prefers-reduced-motion` and `prefers-color-scheme` are respected.
- Layout is responsive from 320 px. Safe-area insets are applied on phones.

---

## 10. Roadmap

1. **Production port** of the prototype (this README).
2. **Review and history:** look back at past periods and see how many of the three were finished, with a short end-of-week prompt asking whether the goals were ambitious enough.
3. **Reminders:** a midday check ("Do you remember your three?") and milestone notices. Web push on iOS needs the app installed to the home screen, so ship as a PWA first.
4. **PWA:** installable, works offline.
5. **Export and import** of data as JSON (backup before any sync).
6. **Sync across devices:** optional backend or file-based sync. Only after export and import exist.

---

## 11. Decisions log

| Decision | Choice | Reason |
|----------|--------|--------|
| Dots per scale | Day 24, Week 7, Month 28-31, Year 365/366 | Simple units people understand |
| Percent | Percent passed | Feels like progress |
| Partial dot | Yes | The screen feels alive |
| Week start | Monday | User choice |
| Day boundary | Full 24 hours | User choice |
| Colors | 12 hues from the color wheel, user-selectable | Personal, free customization |
| Colors in OKLCH | Yes | Even perceived lightness across hues |
| One scale at a time | Tabs | Keeps the screen uncluttered |
| Wins per period | Max 3 | Rule of Three |
| Pareto | A single "the one" star, no numbers | 80/20 is a rough heuristic, not an exact law |
| Storage | `localStorage` via Zustand `persist` | No backend needed |
| Reminders | Later | Keep the first version small |