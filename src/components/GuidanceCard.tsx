import { AREA_THEME, type AreaStat } from '../lib/areas'
import { AREAS } from '../types'
import { Icon } from './Icon'

const COPY = {
  d: {
    title: 'Liquid Pacing & Daily Rhythm',
    body: 'Daily water reservoirs translate overarching weekly intent into calm, singular focus blocks. When your reservoir reaches capacity, protect your evening for stillness and restorative presence without anxious overplanning.',
  },
  w: {
    title: 'Liquid Pacing & Weekly Cadence',
    body: 'Weekly water reservoirs translate overarching monthly vision into manageable bursts of deliberate attention. Once your reservoir touches capacity, protect Saturday and Sunday for rejuvenation without anxious overplanning.',
  },
  m: {
    title: 'Liquid Pacing & Monthly Horizon',
    body: 'Monthly water reservoirs bridge the gap between daily execution and your annual vision. Once your reservoir fills to equilibrium, protect mental bandwidth and allow remaining days to flow without hurried overextension.',
  },
  y: {
    title: 'Liquid Pacing & Capacity',
    body: 'Water reservoirs represent finite energetic capacity rather than hurried checklists. When a reservoir fills, that life domain has achieved annual equilibrium; no further obligations need be forced into it. Outlined dots ahead mark open space, quiet rest, and seasonal possibility.',
  },
} as const

const CHIP_WORDS = ['Career on track', 'Vitality steady', 'Wealth complete'] as const

interface GuidanceCardProps {
  scale: keyof typeof COPY
  stats: Record<number, AreaStat>
}

/** Unobtrusive liquid-pacing guidance with per-area status chips. */
export function GuidanceCard({ scale, stats }: GuidanceCardProps) {
  const copy = COPY[scale]

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-border-line bg-surface-panel p-5">
      <div className="flex items-start gap-3.5">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border-line bg-surface-container-low text-area-career">
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
        {AREAS.map((area, i) => {
          const t = AREA_THEME[area]
          return (
            <span
              key={area}
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-caption ${t.chipBg} ${t.chipBorder} ${t.text}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${t.dot}`} />
              {CHIP_WORDS[i]}: <strong className="font-medium">{stats[area].pct}%</strong>
            </span>
          )
        })}
      </div>
    </section>
  )
}
