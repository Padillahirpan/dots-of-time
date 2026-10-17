# Product Requirements Document (PRD): Dots of Time

**Document Status**: Approved / Ready for Engineering & QA  
**Version**: 1.0  
**Target Platform**: Desktop & Responsive Mobile Web (React, Vite, Zustand, Tailwind CSS)  
**Related Specs**: Design Resume (`DOCUMENT_2`), Prototype Baseline (`DOCUMENT_23`), Design System (`DESIGN_SYSTEM_1`)  
**Core Screens**: `SCREEN_6` (Day), `SCREEN_7` (Week), `SCREEN_8` (Month), `SCREEN_14` (Year), `SCREEN_5` (Inspection Dialog), `SCREEN_3` (Adjust Goal Modal)

---

## 1. Executive Summary & Vision

### 1.1 Product Purpose
**Dots of Time** is an intentional, calm temporal awareness and priority execution application. Traditional time and task management tools trigger cortisol through red countdown timers, infinite backlogs, and endless notifications. **Dots of Time** reimagines time-awareness as an unhurried, mindful rhythm that unites two foundational pillars:
1. **The Cadence Matrix (Objective Temporal Horizon)**: Depicts time strictly as positive *elapsed progress* (dots filled vs. open outline), removing countdown anxiety while imparting visceral awareness of the finite day, week, month, and year.
2. **Liquid Reservoir Dimensions (Bounded Rule of Three)**: Replaces bottomless todo lists with finite, fluid containers across life domains (**Career**, **Life & Vitality**, **Money**). Enforces a hard limit of three active commitments per cycle, celebrating completion without inviting backlog bloat.

### 1.2 Core Product Principles
- **Calm over Urgency**: Only show percent passed (e.g. `60.4% elapsed`), never countdowns or time-remaining alerts.
- **Dots are the Hero**: Clean, uncluttered UI with maximum whitespace; color is never the sole visual signal.
- **Rule of Three Hard Cap**: Strictly maximum 3 active commitments per category per temporal scale. When 3 are present, the user must complete or archive before adding another.
- **Top-Down & Bottom-Up Alignment**: Daily commitments cascade naturally into Weekly milestones, Monthly objectives, and Annual anchors.
- **Zero-Friction Privacy**: 100% client-side execution via `localStorage`. No accounts, no servers, zero telemetry or data extraction.

---

## 2. User Personas & Problems Solved

### 2.1 Personas
1. **The Overwhelmed Knowledge Worker**: Drowning in task trackers and calendar fragmentation; needs a calm anchor to see how their afternoon or week is progressing and focus on just 1–3 high-leverage outcomes.
2. **The Mindful Founder / Creator**: Juggling business growth, physical health, and personal finances; needs a holistic view that prevents work from eclipsing vitality and life stability.
3. **The Intentional Pacer**: Values time-awareness, seasonal transitions, and annual equilibrium; appreciates tactile, visual progress over rigid Gantt charts.

### 2.2 Core Problems Solved
| Traditional Task & Time Tools | Dots of Time Solution |
| :--- | :--- |
| Anxious countdowns ("3 hours left!") | Positive elapsed cadence ("60.4% day elapsed · Afternoon focus window") |
| Infinite task lists leading to guilt and backlog debt | Hard-capped Rule of Three with physical liquid reservoir metaphors |
| Disconnected daily busywork | Cascading linkages from Daily actions up to Yearly anchors |
| Visually aggressive notifications and alarms | Passive 30-second ticking cadence with gentle ambient dot pulses |

---

## 3. System Architecture & Temporal Logic

### 3.1 Cadence Scales & Dot Specifications
All progress calculations are derived from UTC/local timestamps, not simple integer increments, ensuring seamless daylight savings time (DST) and leap year handling.

| Scale | Dot Unit | Grid Structure | Boundary Formula | Display Format |
| :--- | :--- | :--- | :--- | :--- |
| **Day** | 1 Hour (00–23) | 2 rows × 12 cols (8px gap) | `(Timestamp - StartOfDay) / 86,400,000` | `60.4% day elapsed` · `14:30` |
| **Week** | 1 Day (Mon–Sun) | 1 row × 7 cols (10px gap, labeled Mo–Su) | `(Timestamp - Monday00:00) / (7 * 86,400,000)` | `68.5% week elapsed` · `Day 5 of 7` |
| **Month** | 1 Calendar Day | 7-col calendar matrix (Monday-aligned, dynamic 28–31 dots) | `(Timestamp - MonthStart) / MonthDuration` | `51.6% time elapsed` · `Day 16 of 31` |
| **Year** | 1 Calendar Day | Responsive grid (~24 rows × 15–16 cols, 365/366 dots) | `(Timestamp - Jan1_00:00) / YearDuration` | `79.2% annual elapsed` · `Day 289 of 365` |

### 3.2 Dot Rendering States
- **Passed**: Solid fill in accent color (`--a` in OKLCH). Border matching accent.
- **Current (Active)**: Proportional horizontal/vertical split gradient fill matching exact elapsed fraction ($0.0 \dots 1.0$), surrounded by an ambient $2.4\text{s}$ breathing focus ring (`box-shadow: 0 0 0 3px color-mix(in srgb, var(--a) 25%, transparent)`).
- **Remaining**: Transparent fill with $1.5\text{px}$ outline in $45\%$ muted accent.
- **Accessibility**: Dots carry screen-reader accessible `aria-label`s (e.g. `aria-label="Hour 14:00, 50% passed, active focus"`).

---

## 4. Feature Requirements: Liquid Reservoirs & Rule of Three

### 4.1 Liquid Reservoir Dimensions
Each temporal view displays three standard dimension cards, with support for up to 4 custom dimensions:
1. **Career (Domain 0)**: Royal Blue (`oklch(0.62 0.16 250)`).
2. **Life & Vitality (Domain 1)**: Sage Mint (`oklch(0.62 0.16 150)`).
3. **Money (Domain 2)**: Warm Amber (`oklch(0.62 0.16 60)`).

#### Functional Specifications:
- **Liquid Fill Level**: Proportional fluid height corresponding to completed units ($0/3 = 0\%$, $1/3 = 33\%$, $2/3 = 66\%$, $3/3 = 100\%$).
- **Wave Motion**: Smooth ambient SVG wave crest along the meniscus.
- **Capacity Reached Badge**: When a container reaches $3/3$ units ($100\%$), render a pill badge: `Capacity reached`.
- **The One (Pareto Filter)**: Exactly one commitment per dimension may hold the **★ The One** designation, representing maximum leverage.
- **Inspection Trigger**: Clicking or tapping any reservoir triggers the **Category Inspection Dialog** (`SCREEN_5`).

### 4.2 Cascading Goal Architecture
To ensure alignment without database complexity, commitments support an optional parent reference:
$$\text{Day Win} \longrightarrow \text{Parent: Week Win} \longrightarrow \text{Parent: Month Win} \longrightarrow \text{Parent: Year Anchor}$$
- If a parent period rolls over or is removed, the child gracefully falls back to displaying without a parent link.

---

## 5. Screen Inventory & UX Flows

### 5.1 Main Cadence Views
1. **Day View (`SCREEN_6`)**:
   - Header with current circadian time (`Friday, Oct 16 · 14:30`) and contextual subtitle (`Afternoon focus window`).
   - 24-hour cadence grid (Hours 00–23).
   - 3 Daily Dimension reservoirs with primary anchors and inspect buttons.
   - Pacing guidance card: *Liquid Pacing & Daily Rhythm*.
2. **Week View (`SCREEN_7`)**:
   - Week 42 tracker with Monday–Sunday 7-day cadence.
   - Weekend buffer pacing (Days 1–5 work cycle wrap, Days 6–7 recovery buffer).
   - Weekly Dimension reservoirs with month linkage breadcrumbs.
3. **Month View (`SCREEN_8`)**:
   - Dynamic 31-day calendar dot matrix with empty leading padding cells.
   - Monthly progress (`51.6%`) bridging weekly deliverables and yearly objectives.
4. **Year View (`SCREEN_14`)**:
   - Macro trajectory with 365-day panoramic grid (Q1–Q4 seasonal balance).
   - Annual anchors and long-term equilibrium metrics.

### 5.2 Modal Workflows
1. **Category Inspection Dialog (`SCREEN_5`)**:
   - Triggered by clicking **"Inspect"** or tapping any reservoir card.
   - Displays all 3 commitments for that category with status icons, completion timestamps, and cascade links.
   - Displays capacity enforcement notice when 3 slots are populated.
   - Actions: **Adjust** (opens adjust modal), **Archive Completed**, **Save Changes**, **Cancel**.
2. **Adjust Goal Modal (`SCREEN_3`)**:
   - Triggered by clicking **"Adjust"** on any commitment row.
   - Category allocation selector (Career / Life / Money).
   - Title & scope text input.
   - Parent cascade dropdown selector.
   - Interactive progress slider ($0\% \dots 100\%$) with rapid $+5\%, +10\%, +25\%$ chips and a one-click `Mark 100% (Done)` action.
   - Milestone notes textarea.
   - Toggle: `★ Set as The One (Pareto Filter)`.
   - Actions: **Delete / Archive**, **Cancel**, **Save Adjustments**.

---

## 6. Technical Stack & State Management

### 6.1 Architecture & Libraries
- **Framework**: React 18 + TypeScript + Vite.
- **Styling**: Tailwind CSS v4 utilizing OKLCH design tokens.
- **State**: Zustand with `persist` middleware saving directly to `localStorage`.
- **Clock Hook**: `useNow()` running on a 30-second interval, resynchronizing automatically on `document.visibilitychange`.

### 6.2 Data Schema

```ts
export type Scale = 'd' | 'w' | 'm' | 'y';
export type Area = 0 | 1 | 2; // 0: Career, 1: Life & Vitality, 2: Money

export interface Win {
  id: string;
  title: string;
  area: Area;
  parentId?: string;
  progressPercent: number; // 0 to 100
  milestoneNotes?: string;
  done: boolean;
  one: boolean; // "The One" Pareto star
  createdAt: number;
  completedAt?: number;
}

export interface PeriodWinsState {
  byPeriod: Record<string, Win[]>; // Keyed by 'd:2026-10-16', 'w:2026-10-12', etc.
  addWin: (periodKey: string, win: Omit<Win, 'id' | 'createdAt'>) => boolean;
  updateWin: (periodKey: string, id: string, updates: Partial<Win>) => void;
  removeWin: (periodKey: string, id: string) => void;
  toggleDone: (periodKey: string, id: string) => void;
  setOne: (periodKey: string, id: string) => void;
}
```

---

## 7. Design System & Accessibility (WCAG AA)

### 7.1 Visual Tokens
- **Neutrals**:
  - Light Mode: Canvas `--bg: #f6f5f2`, Surface Panels `--panel: #ffffff`, Text Primary `--fg: #1b1b1f`, Secondary `--mut: #6c6c74`, Lines `--line: #dcdad4`.
  - Dark Mode: Canvas `--bg: #121214`, Surface Panels `--panel: #19191d`, Text Primary `--fg: #ececf0`.
- **Typography**: Instrument Sans / DM Sans. Numeric tabular alignment (`font-variant-numeric: tabular-nums`) applied to all percentages and clocks to eliminate layout jitter.
- **Touch Targets**: Minimum $44 \times 44\text{px}$ clickable/tappable area on mobile.
- **Motion**: Adherence to `prefers-reduced-motion` to disable the ambient breathing pulse.

---

## 8. Rollout Plan & Acceptance Criteria

### 8.1 Acceptance Criteria
1. **Temporal Fidelity**: Changing system date/time accurately recalculates dot fills and percentages across all 4 scales without page refresh.
2. **Hard Cap Integrity**: An attempt to add a 4th goal in any category must be blocked with the message: *"Three is the limit. Complete or archive one to add another."*
3. **Pareto Exclusivity**: Star marking a goal as **The One** automatically clears the star from any other goal in that category.
4. **Offline Persistence**: All edits, progress adjustments, and category toggles survive hard browser reloads and offline usage.

---
*Authored for the Dots of Time Engineering, Product, and Design teams.*