import { CATEGORY_META, CATEGORY_THEME, type PeriodStats } from '../lib/categories'
import { Icon } from './Icon'

const COPY = {
  d: {
    title: 'Liquid Pacing & Daily Rhythm',
    body: 'The daily three translates weekly intent into calm, singular focus blocks. When a slot is done, its reservoir rises by a third — protect your evening for stillness without anxious overplanning.',
  },
  w: {
    title: 'Liquid Pacing & Weekly Cadence',
    body: 'The weekly three turns monthly vision into manageable bursts of deliberate attention. Once a reservoir touches capacity, protect Saturday and Sunday for rejuvenation without anxious overplanning.',
  },
  m: {
    title: 'Liquid Pacing & Monthly Horizon',
    body: 'The monthly three bridges daily execution and your annual vision. Once your reservoir fills to equilibrium, protect mental bandwidth and let remaining days flow without hurried overextension.',
  },
  y: {
    title: 'Liquid Pacing & Capacity',
    body: 'Reservoirs represent finite energetic capacity rather than hurried checklists. When a reservoir fills, the year has found its balance; outlined dots ahead mark open space, quiet rest, and seasonal possibility.',
  },
} as const

interface GuidanceCardProps {
  scale: keyof typeof COPY
  stats: PeriodStats
}

/** Unobtrusive liquid-pacing guidance with per-category status chips. */
export function GuidanceCard({ scale, stats }: GuidanceCardProps) {
  const copy = COPY[scale]
  const filled = stats.slots.filter((w) => w !== null)

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-border-line bg-surface-panel p-5">
      <div className="flex items-start gap-3.5">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border-line bg-surface-container-low text-cat-career">
          <Icon name="water_drop" fill />
        </div>
        <div>
          <h3 className="text-title-section font-medium text-fg-primary">{copy.title}</h3>
          <p className="mt-1 text-body-md leading-relaxed text-pretty text-fg-muted">
            {copy.body}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-border-line pt-3">
        {filled.length === 0 && (
          <span className="text-caption text-fg-muted">
            No goals yet — {stats.pct}% · 0 of 3 done
          </span>
        )}
        {filled.map((w) => {
          const t = CATEGORY_THEME[w.category]
          return (
            <span
              key={w.id}
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-caption ${t.chipBg} ${t.chipBorder} ${t.text}`}
            >
              <Icon name={CATEGORY_META[w.category].icon} size={13} />
              {CATEGORY_META[w.category].label} · {w.done ? 'done' : 'open'}
            </span>
          )
        })}
        <span className="ml-auto text-caption text-fg-muted tabular-nums">
          {stats.done} of 3 · {stats.pct}%
        </span>
      </div>
    </section>
  )
}
