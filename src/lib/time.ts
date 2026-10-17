import type { Scale } from '../types'

/**
 * All progress is computed from timestamps, not from counting hours.
 * This keeps daylight saving days (23 or 25 hours) and leap years correct.
 */

export function bounds(scale: Scale, now: Date): [Date, Date] {
  const y = now.getFullYear()
  const m = now.getMonth()
  const d = now.getDate()
  switch (scale) {
    case 'd':
      return [new Date(y, m, d), new Date(y, m, d + 1)]
    case 'w': {
      const monday = (now.getDay() + 6) % 7 // Monday = 0
      return [new Date(y, m, d - monday), new Date(y, m, d - monday + 7)]
    }
    case 'm':
      return [new Date(y, m, 1), new Date(y, m + 1, 1)]
    case 'y':
      return [new Date(y, 0, 1), new Date(y + 1, 0, 1)]
  }
}

/** fraction of the period that has passed, 0..1 */
export function progress(scale: Scale, now: Date): number {
  const [a, b] = bounds(scale, now)
  return (+now - +a) / (+b - +a)
}

/** fraction of dot i that has passed (0..1). Drives the partial fill. */
export function dotFraction(p: number, count: number, i: number): number {
  return Math.min(1, Math.max(0, p * count - i))
}

/**
 * For month and year grids a dot is one calendar day, so use the day's own
 * start and end instead of `p * count`. This avoids drift on DST days.
 */
export function dayFraction(now: Date, y: number, m: number, day: number): number {
  const a = new Date(y, m, day)
  const b = new Date(y, m, day + 1)
  return Math.min(1, Math.max(0, (+now - +a) / (+b - +a)))
}

export function daysInMonth(y: number, m: number): number {
  return new Date(y, m + 1, 0).getDate()
}

export function isLeapYear(y: number): boolean {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0
}

export function daysInYear(y: number): number {
  return isLeapYear(y) ? 366 : 365
}

/** Monday of `now`'s week, at midnight local time. */
export function mondayOf(now: Date): Date {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const back = (d.getDay() + 6) % 7
  d.setDate(d.getDate() - back)
  return d
}

/** Column of day 1 in a 7-column month grid that starts on Monday. */
export function monthPadStart(y: number, m: number): number {
  return (new Date(y, m, 1).getDay() + 6) % 7
}

/** 1-based day of the year. */
export function dayOfYear(now: Date): number {
  const start = new Date(now.getFullYear(), 0, 1)
  return Math.floor((+now - +start) / 86_400_000) + 1
}

/** ISO-ish week number of the year (Monday start), 1-based. */
export function weekOfYear(now: Date): number {
  const monday = mondayOf(now)
  const firstMonday = mondayOf(new Date(monday.getFullYear(), 0, 1))
  const week1Start = firstMonday.getTime() <= new Date(monday.getFullYear(), 0, 1).getTime()
    ? firstMonday
    : new Date(firstMonday.getFullYear(), firstMonday.getMonth(), firstMonday.getDate() + 7)
  return Math.floor((+monday - +week1Start) / (7 * 86_400_000)) + 1
}

/** Number of ISO-ish weeks in the year (52 or 53). */
export function weeksInYear(y: number): number {
  return weekOfYear(new Date(y, 11, 28))
}

/** Days in the same week row of a month grid, e.g. October 2026 spans 5 rows. */
export function monthWeekRows(y: number, m: number): number {
  return Math.ceil((monthPadStart(y, m) + daysInMonth(y, m)) / 7)
}
