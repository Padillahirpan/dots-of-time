import { CATEGORIES, type Category, type Win } from '../types'

/** Rule of Three: a period holds at most three wins. */
export const PERIOD_CAP = 3

export const CATEGORY_META: Record<Category, { label: string; icon: string }> = {
  health: { label: 'Health', icon: 'favorite' },
  family: { label: 'Family', icon: 'group' },
  career: { label: 'Career', icon: 'work' },
  money: { label: 'Money', icon: 'savings' },
  growth: { label: 'Growth', icon: 'psychology' },
  play: { label: 'Play', icon: 'celebration' },
}

/** CSS color value per category, used for inline styling. */
export const CATEGORY_VAR: Record<Category, string> = {
  health: 'var(--cat-health)',
  family: 'var(--cat-family)',
  career: 'var(--cat-career)',
  money: 'var(--cat-money)',
  growth: 'var(--cat-growth)',
  play: 'var(--cat-play)',
}

/**
 * Static Tailwind class maps per category. Full class strings keep the
 * Tailwind compiler happy (no dynamic concatenation).
 */
export const CATEGORY_THEME: Record<
  Category,
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
  health: {
    dot: 'bg-cat-health',
    text: 'text-cat-health',
    chipBg: 'bg-cat-health/10',
    chipBorder: 'border-cat-health/20',
    waveFill: 'fill-cat-health',
    liquidBg: 'bg-cat-health/[0.08]',
    liquidBgStrong: 'bg-cat-health/15',
    liquidBorder: 'border-cat-health/25',
    strongBorder: 'border-cat-health',
    hoverBorder: 'hover:border-cat-health/60',
    bar: 'bg-cat-health',
    ring: 'ring-cat-health/30',
  },
  family: {
    dot: 'bg-cat-family',
    text: 'text-cat-family',
    chipBg: 'bg-cat-family/10',
    chipBorder: 'border-cat-family/20',
    waveFill: 'fill-cat-family',
    liquidBg: 'bg-cat-family/[0.08]',
    liquidBgStrong: 'bg-cat-family/15',
    liquidBorder: 'border-cat-family/25',
    strongBorder: 'border-cat-family',
    hoverBorder: 'hover:border-cat-family/60',
    bar: 'bg-cat-family',
    ring: 'ring-cat-family/30',
  },
  career: {
    dot: 'bg-cat-career',
    text: 'text-cat-career',
    chipBg: 'bg-cat-career/10',
    chipBorder: 'border-cat-career/20',
    waveFill: 'fill-cat-career',
    liquidBg: 'bg-cat-career/[0.08]',
    liquidBgStrong: 'bg-cat-career/15',
    liquidBorder: 'border-cat-career/25',
    strongBorder: 'border-cat-career',
    hoverBorder: 'hover:border-cat-career/60',
    bar: 'bg-cat-career',
    ring: 'ring-cat-career/30',
  },
  money: {
    dot: 'bg-cat-money',
    text: 'text-cat-money',
    chipBg: 'bg-cat-money/10',
    chipBorder: 'border-cat-money/20',
    waveFill: 'fill-cat-money',
    liquidBg: 'bg-cat-money/[0.08]',
    liquidBgStrong: 'bg-cat-money/20',
    liquidBorder: 'border-cat-money/25',
    strongBorder: 'border-cat-money',
    hoverBorder: 'hover:border-cat-money/60',
    bar: 'bg-cat-money',
    ring: 'ring-cat-money/30',
  },
  growth: {
    dot: 'bg-cat-growth',
    text: 'text-cat-growth',
    chipBg: 'bg-cat-growth/10',
    chipBorder: 'border-cat-growth/20',
    waveFill: 'fill-cat-growth',
    liquidBg: 'bg-cat-growth/[0.08]',
    liquidBgStrong: 'bg-cat-growth/15',
    liquidBorder: 'border-cat-growth/25',
    strongBorder: 'border-cat-growth',
    hoverBorder: 'hover:border-cat-growth/60',
    bar: 'bg-cat-growth',
    ring: 'ring-cat-growth/30',
  },
  play: {
    dot: 'bg-cat-play',
    text: 'text-cat-play',
    chipBg: 'bg-cat-play/10',
    chipBorder: 'border-cat-play/20',
    waveFill: 'fill-cat-play',
    liquidBg: 'bg-cat-play/[0.08]',
    liquidBgStrong: 'bg-cat-play/15',
    liquidBorder: 'border-cat-play/25',
    strongBorder: 'border-cat-play',
    hoverBorder: 'hover:border-cat-play/60',
    bar: 'bg-cat-play',
    ring: 'ring-cat-play/30',
  },
}

export interface PeriodStats {
  /** the three slots; null = empty */
  slots: (Win | null)[]
  done: number
  /** completed goals over the three slots, 0..100 */
  pct: number
  /** goals beyond the cap, kept from old data */
  overflow: Win[]
  used: Set<Category>
  available: Category[]
}

export function periodStats(list: Win[]): PeriodStats {
  const capped = list.slice(0, PERIOD_CAP)
  const done = capped.filter((w) => w.done).length
  const used = new Set(list.map((w) => w.category))
  return {
    slots: Array.from({ length: PERIOD_CAP }, (_, i) => capped[i] ?? null),
    done,
    pct: Math.round((done / PERIOD_CAP) * 100),
    overflow: list.slice(PERIOD_CAP),
    used,
    available: CATEGORIES.filter((c) => !used.has(c)),
  }
}
