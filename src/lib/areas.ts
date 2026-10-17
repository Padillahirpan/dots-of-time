import type { Area, Win } from '../types'

/** Rule of Three: each dimension holds at most 3 wins. */
export const AREA_CAP = 3

export interface AreaStat {
  wins: Win[]
  done: number
  /** completed units over the 3-unit capacity, 0..100 */
  pct: number
  /** the starred win, if any */
  one?: Win
  /** the win shown as anchor: the one, else the first */
  primary?: Win
}

const emptyStat = (): AreaStat => ({ wins: [], done: 0, pct: 0 })

export function areaStats(list: Win[]): Record<Area, AreaStat> {
  const stats: Record<Area, AreaStat> = { 0: emptyStat(), 1: emptyStat(), 2: emptyStat() }
  for (const w of list) stats[w.area].wins.push(w)
  for (const a of [0, 1, 2] as const) {
    const s = stats[a]
    s.done = s.wins.filter((w) => w.done).length
    s.pct = Math.round((s.done / AREA_CAP) * 100)
    s.one = s.wins.find((w) => w.one)
    s.primary = s.one ?? s.wins[0]
  }
  return stats
}

/** Material Symbols icon per area. */
export const AREA_ICON: Record<Area, string> = {
  0: 'work',
  1: 'eco',
  2: 'savings',
}

/** CSS color value per area, used for inline done-circle styling. */
export const AREA_VAR: Record<Area, string> = {
  0: 'var(--area-career)',
  1: 'var(--area-life)',
  2: 'var(--area-money)',
}

/**
 * Static Tailwind class maps per area. Full class strings keep the
 * Tailwind compiler happy (no dynamic concatenation).
 */
export const AREA_THEME: Record<
  Area,
  {
    dot: string
    text: string
    chipBg: string
    chipBorder: string
    waveFill: string
    liquidBg: string
    liquidBgStrong: string
    liquidBorder: string
    strongBorder: string
    hoverBorder: string
    bar: string
    ring: string
  }
> = {
  0: {
    dot: 'bg-area-career',
    text: 'text-area-career',
    chipBg: 'bg-area-career/10',
    chipBorder: 'border-area-career/20',
    waveFill: 'fill-area-career',
    liquidBg: 'bg-area-career/[0.08]',
    liquidBgStrong: 'bg-area-career/15',
    liquidBorder: 'border-area-career/25',
    strongBorder: 'border-area-career',
    hoverBorder: 'hover:border-area-career/60',
    bar: 'bg-area-career',
    ring: 'ring-area-career/30',
  },
  1: {
    dot: 'bg-area-life',
    text: 'text-area-life',
    chipBg: 'bg-area-life/10',
    chipBorder: 'border-area-life/20',
    waveFill: 'fill-area-life',
    liquidBg: 'bg-area-life/[0.08]',
    liquidBgStrong: 'bg-area-life/15',
    liquidBorder: 'border-area-life/25',
    strongBorder: 'border-area-life',
    hoverBorder: 'hover:border-area-life/60',
    bar: 'bg-area-life',
    ring: 'ring-area-life/30',
  },
  2: {
    dot: 'bg-area-money',
    text: 'text-area-money',
    chipBg: 'bg-area-money/10',
    chipBorder: 'border-area-money/30',
    waveFill: 'fill-area-money',
    liquidBg: 'bg-area-money/[0.08]',
    liquidBgStrong: 'bg-area-money/20',
    liquidBorder: 'border-area-money/25',
    strongBorder: 'border-area-money',
    hoverBorder: 'hover:border-area-money/60',
    bar: 'bg-area-money',
    ring: 'ring-area-money/30',
  },
}
