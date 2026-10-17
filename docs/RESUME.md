# Dots of Time — Executive Product & Design Resume

**A Systematic Blueprint of Cadence Pacing, Liquid Reservoir Indicators, and Rule of Three Architecture**

---

## 1. Executive Summary & Vision

**Dots of Time** is an intentional, calm time-awareness and goal architecture application. It bridges the philosophical reality of finite time with actionable daily execution by marrying two complementary paradigms:

1. **Cadence Matrix (Finite Time Horizon)**: Visualizing temporal progression strictly as dots and elapsed percentages across four scales (**Day, Week, Month, Year**), avoiding anxiety-driven countdowns in favor of mindful pacing.
2. **Liquid Reservoir Dimensions (Rule of Three)**: Translating life commitments into bounded fluid containers across three foundational domains (**Career, Life & Vitality, Money**), capped strictly at three active commitments per cycle to enforce singular focus, eliminate backlog bloat, and maintain human balance.

This document serves as the formal specification and comparative design breakdown across the core 4 cadence pages:
- **Day View** (`SCREEN_5`)
- **Week View** (`SCREEN_6`)
- **Month View** (`SCREEN_7`)
- **Year View** (`SCREEN_13`)

---

## 2. High-Level Comparative Architecture

| Horizon Scale | Unit of 1 Dot | Total Dot Matrix | Time Progression Formula | Key Metric Shown | Core Visual Anchor |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Day View** | 1 Hour | 24 dots (12 cols × 2 rows) | `(Timestamp - 00:00) / 24h` | **60.4%** (14:30 · Hour 14 active) | Circadian Focus Window (Afternoon Focus) |
| **Week View** | 1 Day | 7 dots (7 columns, Mon–Sun) | `(Days elapsed + day fraction) / 7` | **68.5%** (Day 5 of 7 · Friday) | Work Cycle Wrap & Weekend Buffer |
| **Month View** | 1 Calendar Day | 28–31 dots (7 cols, Monday-aligned) | `(Days elapsed in Month) / Total Days` | **51.6%** (Day 16 of 31 · Friday) | Monthly Horizon & Mid-Cycle Balance |
| **Year View** | 1 Calendar Day | 365 / 366 dots (24 rows × 15–16 cols) | `(Day of year elapsed) / 365` | **79.2%** (Day 289 of 365 · Q4 Autumn) | Macro Trajectory & Annual Equilibrium |

---

## 3. Systematic Breakdown by Screen

### 3.1 Day View (`SCREEN_5`): Circadian Focus & Hourly Rhythm

* **Macro Header & Context**:
  - Breadcrumb: `Dots of Time · Friday, October 16, 2026`.
  - Tab Navigation: **Day** actively highlighted; Week, Month, Year secondary.
  - Quick utility actions: Calendar toggle, Settings, and Profile Avatar (`FD`).
* **Elapsed Progress Metric**:
  - Primary Display: **60.4% day elapsed** (14.5 of 24h).
  - Contextual Note: *Afternoon focus window · Natural circadian pacing*.
* **The 24-Hour Cadence Matrix**:
  - Geometry: 2 rows of 12 dots representing hours `00` through `23`.
  - Status Indicators:
    - **Passed (Hours 00–13)**: Solid filled accent blue (`oklch` hue 250).
    - **Current (Hour 14 · 14:00–15:00)**: Proportional ~50% vertical split fill with a concentric focus pulse ring.
    - **Remaining (Hours 15–23)**: 9 open unfilled circles with subtle 1.5px border outline.
* **Daily Dimensions (Liquid Reservoirs)**:
  - **Career (66% volume · 2 of 3 units)**:
    - Starred Primary Anchor (**★ The One**): *Finalize SOC 2 audit remediations & submit report*.
    - Cascading Parent Link: `Linked: SOC 2 Stage 4 security audit`.
  - **Life & Vitality (33% volume · 1 of 3 units)**:
    - Primary Anchor: *5 km tempo run & 20m breathwork stillness*.
    - Cascading Parent Link: `Linked: 30 km run & mobility`.
  - **Money (100% capacity · 3 of 3 units)**:
    - Primary Anchor: *Review angel distribution schedule & sign approvals*.
    - Visual State: Full warm amber fill with `Capacity reached` badge.
* **Philosophical Insight Footer**:
  - Focus statement reminding users that daily reservoirs translate overarching weekly intent into calm singular blocks, encouraging evening rest once capacity is reached.

---

### 3.2 Week View (`SCREEN_6`): Natural Work Cycle & Weekend Recovery

* **Macro Header & Context**:
  - Header: `Dots of Time · Week 42`.
  - Active Tab: **Week** with solid bottom indicator.
* **Elapsed Progress Metric**:
  - Primary Display: **68.5% week elapsed**.
  - Subtitle: `Friday, Oct 16 · Day 5 of 7 · Natural work cycle pacing · Friday focus wrap & weekend buffer`.
* **7-Day Cadence Matrix**:
  - Alignment: Monday through Sunday (European ISO standard).
  - Dot Treatment: Larger touch/view targets labeled with weekday initials (`Mo, Tu, We, Th, Fr, Sa, Su`) and calendar day numbers (`12, 13, 14, 15, 16, 17, 18`).
  - Status:
    - Monday–Thursday (Days 12–15): Solid passed.
    - Friday (Day 16): Active day with partial fill and `today` indicator.
    - Saturday & Sunday (Days 17–18): Open weekend buffer (2 days remaining).
* **Weekly Dimensions (Liquid Reservoirs)**:
  - **Career (66% volume · 2 of 3 completed)**:
    - Primary Anchor (**★ The One**): *Complete SOC 2 Stage 4 security audit & documentation*.
    - Horizon Link: `Linked to Month: Deliver Q4 Product Launch`.
  - **Life & Vitality (66% volume · 2 of 3 completed)**:
    - Primary Anchor: *30 km long run & 3 mobility recovery sessions* (`22 km logged`).
    - Horizon Link: `Linked to Month: 100 km & Strength`.
  - **Money (100% volume · 3 of 3 completed)**:
    - Primary Anchor: *Finalize quarterly angel distribution & tax reserve transfer*.
    - Horizon Link: `Linked to Month: Wealth Buffer Allocation`.
* **Cadence Insight**:
  - Guides the transition from intense weekly sprints to deliberate weekend rest without anxious overplanning.

---

### 3.3 Month View (`SCREEN_7`): The Bridge Between Daily Execution & Annual Vision

* **Macro Header & Context**:
  - Header: `Dots of Time · October 2026 · 31 days`.
  - Active Tab: **Month**.
* **Elapsed Progress Metric**:
  - Primary Display: **51.6% time elapsed**.
  - Subtitle: `Day 16 of 31 · Friday · 5 weeks horizon`.
* **Calendar Dot Matrix**:
  - Structure: 7-column calendar grid starting Monday.
  - Padding: Hidden/muted inactive cells for leading September days (`28, 29, 30`) and trailing November padding (`1`).
  - Active Pacing: 15 passed dots (solid), Day 16 half-filled (today), and 15 open remaining dots.
* **Monthly Dimensions (Liquid Reservoirs)**:
  - **Career (66% volume · 2 of 3 completed)**:
    - Primary Anchor: *Deliver Q4 Product Launch & v1.0 beta*.
    - Horizon Link: `Linked to Year: SaaS Independence`.
  - **Life & Vitality (33% volume · 1 of 3 completed)**:
    - Primary Anchor: *Run 100 km & 12 strength sessions* (`64 km / 100 km logged`).
    - Horizon Link: `Linked to Year: Marathon Base`.
  - **Money (66% volume · 2 of 3 completed)**:
    - Primary Anchor: *Allocate $2,500 to Wealth Buffer*.
    - Horizon Link: `Linked to Year: Financial Freedom`.
* **Cadence Insight**:
  - Articulates that monthly reservoirs prevent mid-range fatigue by keeping annual goals grounded in realistic monthly horizons.

---

### 3.4 Year View (`SCREEN_13`): Macro Trajectory & Annual Equilibrium

* **Macro Header & Context**:
  - Header: `Dots of Time · 2026 · 365 days · Non-leap year`.
  - Active Tab: **Year**.
  - Milestone Badges: `2026` + `Q4 · Autumn`.
* **Elapsed Progress Metric**:
  - Primary Display: **79.2% annual duration elapsed**.
  - Subtitle: `Day 289 of 365 · Friday, October 16 · 52 Weeks Completed`.
* **365-Day Cadence Matrix**:
  - Geometry: Dense, panoramic matrix of 24 rows × 15–16 columns representing all 365 days of the year.
  - Visual Density: Clean 14px dots with 5px gap, highlighting past days (288 passed), today (Day 289), and open Q4 runway (76 days remaining).
* **Annual Dimensions (Macro Reservoirs)**:
  - **Career (66% volume · 2 of 3 completed)**:
    - Primary Anchor: *The One: $120k ARR Achieved* (Secondary: *Studio Brand Revamp*).
  - **Life & Vitality (33% volume · 1 of 3 completed)**:
    - Primary Anchor: *Marathon Base (840/1200km)* (Daily anchor: *15m Morning stillness*).
  - **Money (66% volume · 2 of 3 completed)**:
    - Primary Anchor: *Retirement Maxed · Vault 80%* (Reserve: *6-Month Liquidity*).
* **Cadence Insight**:
  - Highlights annual equilibrium: open matrix dots ahead represent quiet rest, seasonal rhythm, and spacious unhurried execution.

---

## 4. Design System & Interaction Patterns

### 4.1 Token Specifications
* **Color System (OKLCH Perception Balance)**:
  - Background Neutral: `#f6f5f2` (Light mode canvas), Container Surfaces: `#ffffff`.
  - Text Tokens: `#1b1b1f` (Primary headers, tabular percent), `#6c6c74` (Secondary labels & metadata).
  - Accent Hues:
    - **App Accent / Career**: `Hue 250` (Calm Royal Blue, `oklch(0.62 0.16 250)`).
    - **Life & Vitality**: `Hue 150` (Sage / Mint Green, `oklch(0.62 0.16 150)`).
    - **Money**: `Hue 60` (Warm Amber / Ochre, `oklch(0.62 0.16 60)`).

### 4.2 The Liquid Reservoir Indicator Pattern
* Replaces intimidating, rigid checkbox task lists with serene physical metaphor:
  - **Wavy Water Surface**: Top-bounded translucent SVG wave motion indicating current percentage volume.
  - **Capacity Limit Enforcement**: Max 3 active wins per domain. Reaching 100% displays an amber `Capacity reached` tag, signaling that no more cognitive load should be added.
  - **Inspect & Drill-Down**: Tapping any card triggers the **Category Inspection Dialog** (`SCREEN_4`), and clicking **Adjust** opens the precision editing modal (`SCREEN_2`).

### 4.3 Cascading Goal Hierarchy
* Clear top-down and bottom-up linkage:
  $$\text{Yearly Anchor} \longleftarrow \text{Monthly Bridge} \longleftarrow \text{Weekly Milestone} \longleftarrow \text{Daily Action}$$
* Ensures that every daily task completed directly moves the needle on quarterly and lifetime milestones.

---

## 5. Summary Table: Design Artifacts Matrix

| Artifact ID | View Name | Primary Function | Interaction Triggers |
| :--- | :--- | :--- | :--- |
| `{{DATA:SCREEN:SCREEN_5}}` | Day View | Daily circadian 24h cadence & 3 daily water reservoirs | Tap reservoir $\rightarrow$ Inspect modal (`SCREEN_4`) |
| `{{DATA:SCREEN:SCREEN_6}}` | Week View | Weekly 7-day work cycle pacing & weekly commitments | Tap reservoir $\rightarrow$ Inspect modal |
| `{{DATA:SCREEN:SCREEN_7}}` | Month View | 31-day calendar dot matrix & monthly domain alignment | Tap reservoir $\rightarrow$ Inspect modal |
| `{{DATA:SCREEN:SCREEN_13}}` | Year View | Panoramic 365-day macro trajectory & annual anchors | Tap reservoir $\rightarrow$ Inspect modal |
| `{{DATA:SCREEN:SCREEN_4}}` | Inspect Dialog | Deep inspection of 3 active commitments per category | Click "Adjust" $\rightarrow$ Adjust Modal (`SCREEN_2`) |
| `{{DATA:SCREEN:SCREEN_2}}` | Adjust Modal | Milestone notes, percent slider, "The One" star filter | Save adjustments $\rightarrow$ Updates reservoir fill |

---
*Created for the Dots of Time Design System & Engineering Implementation Team.*
