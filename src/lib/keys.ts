import type { Scale } from '../types'
import { mondayOf } from './time'

const pad = (n: number) => String(n).padStart(2, '0')

const isoDay = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

/**
 * Period keys group wins by period:
 * - Day: `d:2026-10-16` (local date)
 * - Week: `w:2026-10-12` (date of the Monday)
 * - Month: `m:2026-10`
 * - Year: `y:2026`
 */
export function periodKey(scale: Scale, now: Date): string {
  switch (scale) {
    case 'd':
      return `d:${isoDay(now)}`
    case 'w':
      return `w:${isoDay(mondayOf(now))}`
    case 'm':
      return `m:${now.getFullYear()}-${pad(now.getMonth() + 1)}`
    case 'y':
      return `y:${now.getFullYear()}`
  }
}

const PARENT: Record<Exclude<Scale, 'y'>, Scale> = { d: 'w', w: 'm', m: 'y' }

export function parentScale(scale: Scale): Scale | null {
  return scale === 'y' ? null : PARENT[scale]
}

export function parentKey(scale: Scale, now: Date): string | null {
  const p = parentScale(scale)
  return p ? periodKey(p, now) : null
}

/** Display name of the next larger scale, e.g. day wins link to "Week". */
export function parentScaleName(scale: Scale): string | null {
  const names: Record<Exclude<Scale, 'y'>, string> = { d: 'Week', w: 'Month', m: 'Year' }
  return scale === 'y' ? null : names[scale]
}
