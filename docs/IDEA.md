# Dots of Time — The Idea

**One line**: Time as dots you watch fill — and at most three goals worth having per horizon.

---

## 1. The Feeling

You open the app and see today as 24 circles. Fourteen of them are already filled.
No countdown. No "3 hours left!". Just the quiet fact that most of the day has passed,
and a soft pulse on the dot that is passing right now.

Below the dots sit your goals — at most three for the day, each a small card with a
slow wave of water rising as it moves from *To do* to *Doing* to *Done*. One of them
carries a star: **The One**, the thing that actually matters today.

The same picture repeats at four scales — Day, Week, Month, Year — so an idle moment
in the afternoon can remind you that 68% of the week is gone, 51% of the month,
79% of the year. Not to scare you. To return you to the present.

## 2. Why

Traditional productivity tools are built on urgency: red deadlines, infinite backlogs,
streak guilt. They answer "what's left?" Dots of Time answers "where am I?" — and
insists the answer be small:

- **Elapsed, not remaining.** Percentages only count what has passed. The future stays
  open and uncolored.
- **Three is the limit.** Per day, per week, per month, per year: three goals. If you
  want a fourth, something must be finished or let go. Scarcity is the feature.
- **Every goal serves a bigger one.** A day goal must hang off a week goal, a week goal
  off a month goal, a month goal off a year goal. Busyness that serves nothing has
  nowhere to attach.
- **Categories carry the color, not the goals.** Life, Career, Money by default — or
  your own. The app tells you where your focus actually went ("Focus: Career, Money")
  instead of where you promised it would go.

## 3. The Object Model (Mental Model)

```
Year   ─── 365 dots, up to 3 anchors ("SaaS independence")
 └─ Month ─ 28–31 dots, up to 3 bridges ("Ship Q4 launch")
     └─ Week ─ 7 dots Mon–Sun, up to 3 milestones ("Finish audit")
         └─ Day ── 24 dots, up to 3 actions ("Submit remediation report")
```

- Each dot = one unit of time (hour / day / day / day).
- Fill is proportional and continuous — the current dot is partially filled to the
  exact fraction of time elapsed within it, breathing gently.
- Goals are not tasks with percentages. They are three-state: **To do → Doing → Done**,
  rendered as water level 0% / 50% / 100%. No slider perfectionism.
- **★ The One** is exclusive per period: the Pareto flag for the single goal that
  would make the period a success.

## 4. The Experience Principles

1. **Calm surface.** Warm paper light theme, deep charcoal dark theme, one accent hue
   of your choosing from twelve. Everything else is dots, whitespace, and typography.
2. **Local and private.** No account, no server, no telemetry. Everything lives in
   `localStorage`; the file works offline.
3. **Alive, not noisy.** The clock ticks silently every 30 seconds; dots fill without
   animation fanfare; the water waves slowly (and stops entirely if you prefer
   reduced motion). Periods roll over by themselves when the day changes.
4. **One hand, one thumb.** Single column, ~720px, safe-area aware, tab-based,
   tap-sized targets. It is a pocket object, not a dashboard.

## 5. What It Is Not

- Not a task manager (no due dates, priorities, subtasks, reminders).
- Not a habit tracker (no streaks, no history charts beyond the year grid).
- Not social, syncable, or shareable — by design.
- Not anxious. There is no notification, no badge, no red.

## 6. The Whole Product in One Sentence

A quiet, single-file web app that shows your day, week, month, and year as dots
filling in real time, and holds exactly three cascading goals per horizon — so that
time becomes something you inhabit, not something you owe.
