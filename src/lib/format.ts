import type { Scale } from '../types'
import {
  dayOfYear,
  daysInMonth,
  daysInYear,
  mondayOf,
  monthWeekRows,
  weekOfYear,
} from './time'

const weekdayShortFmt = new Intl.DateTimeFormat('en', { weekday: 'short' })
const weekdayLong = new Intl.DateTimeFormat('en', { weekday: 'long' })
const weekday2 = (d: Date) => weekdayShortFmt.format(d).slice(0, 2) // Mo, Tu, …
const monthShortFmt = new Intl.DateTimeFormat('en', { month: 'short' })
const monthShort = (d: Date) => monthShortFmt.format(d)
const monthLongYear = new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' })
const monthLong = new Intl.DateTimeFormat('en', { month: 'long' })
const dayNumber = new Intl.DateTimeFormat('en', { day: 'numeric' })
const fullDate = new Intl.DateTimeFormat('en', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})
const timeHM = new Intl.DateTimeFormat('en', { hour: '2-digit', minute: '2-digit', hour12: false })

const weekdayMed = (d: Date) => `${weekdayShortFmt.format(d)}, ${monthShort(d)} ${dayNumber.format(d)}`

/** Percent passed with one decimal, e.g. "60.4%". */
export function percent(p: number): string {
  return `${(p * 100).toFixed(1)}%`
}

/** Adjective per scale: Daily, Weekly, Monthly, Annual. */
export const SCALE_ADJ: Record<Scale, string> = {
  d: 'Daily',
  w: 'Weekly',
  m: 'Monthly',
  y: 'Annual',
}

const DAYPARTS = [
  [5, 'Early morning'],
  [12, 'Morning'],
  [17, 'Afternoon'],
  [21, 'Evening'],
] as const

export function daypart(now: Date): string {
  const h = now.getHours()
  for (const [limit, name] of DAYPARTS) if (h < limit) return name
  return 'Night'
}

export function periodEyebrow(scale: Scale, now: Date): string | null {
  switch (scale) {
    case 'd':
      return 'Today · 24-Hour Cadence'
    case 'w': {
      const a = mondayOf(now)
      const last = new Date(a.getFullYear(), a.getMonth(), a.getDate() + 6)
      return `This week · ${monthShort(a)} ${dayNumber.format(a)}–${dayNumber.format(last)}, ${a.getFullYear()}`
    }
    case 'm':
      return `This month · ${monthLongYear.format(now)}`
    case 'y':
      return null
  }
}

export function periodHeadline(scale: Scale, now: Date): string {
  switch (scale) {
    case 'd':
      return `${weekdayShortFmt.format(now)} ${monthShort(now)} ${dayNumber.format(now)} · ${timeHM.format(now)}`
    case 'w':
      return `${weekdayShortFmt.format(now)} ${monthShort(now)} ${dayNumber.format(now)} · Day ${(now.getDay() + 6) % 7 + 1} of 7`
    case 'm':
      return `Day ${now.getDate()} of ${daysInMonth(now.getFullYear(), now.getMonth())} · ${weekdayShortFmt.format(now)}`
    case 'y':
      return String(now.getFullYear())
  }
}

export function periodSubline(scale: Scale, now: Date): string | null {
  switch (scale) {
    case 'd':
      return `${daypart(now)} focus window · Natural circadian pacing`
    case 'w':
      return 'Natural work cycle pacing · Weekend buffer ahead'
    case 'm':
      return 'Continuous focus window'
    case 'y':
      return `Day ${dayOfYear(now)} of ${daysInYear(now.getFullYear())} · ${weekdayMed(now)}`
  }
}

export function percentLabel(scale: Scale, now: Date): string {
  switch (scale) {
    case 'd': {
      const hours = (now.getHours() * 60 + now.getMinutes()) / 60
      return `day elapsed (${hours.toFixed(1)} of 24h)`
    }
    case 'w':
      return 'week elapsed'
    case 'm':
      return 'time elapsed'
    case 'y':
      return 'annual duration elapsed'
  }
}

/** Quarter + season badge for the year header, e.g. "Q4 · Autumn". */
export function yearBadge(now: Date): string {
  const q = Math.floor(now.getMonth() / 3) + 1
  const seasons = ['Winter', 'Spring', 'Summer', 'Autumn'] as const
  return `Q${q} · ${seasons[Math.floor(((now.getMonth() + 1) % 12) / 3)]}`
}

/** Short context next to the brand, e.g. "· Week 42". */
export function navContext(scale: Scale, now: Date): string {
  switch (scale) {
    case 'd':
      return fullDate.format(now)
    case 'w':
      return `Week ${weekOfYear(now)}`
    case 'm':
      return `${monthLongYear.format(now)} · ${daysInMonth(now.getFullYear(), now.getMonth())} days`
    case 'y':
      return `${now.getFullYear()} · ${daysInYear(now.getFullYear())} days`
  }
}

export function scaleCaption(scale: Scale, now: Date): string {
  switch (scale) {
    case 'd':
      return 'Full 24-hour cycle · 1 dot = 1 hour'
    case 'w':
      return 'Monday start · 7 days cadence'
    case 'm':
      return `Monday start · ${monthWeekRows(now.getFullYear(), now.getMonth())} weeks horizon`
    case 'y':
      return '365-day horizon · 1 dot = 1 day'
  }
}

/** Y-axis label for the year tooltip: "Day 289 · Fri, Oct 16 (Today)". */
export function yearDotLabel(doy: number, date: Date, state: 'Passed' | 'Today' | 'Open'): string {
  return `Day ${doy} · ${weekdayMed(date)} (${state})`
}

/** Accessible label for a calendar day cell, e.g. "October 16 (Today)". */
export function monthDayLabel(now: Date, day: number): string {
  const today = now.getDate() === day
  return `${monthLong.format(now)} ${day}${today ? ' (Today)' : ''}`
}

export function weekDayTitle(d: Date, state: string): string {
  return `${weekdayLong.format(d)}, ${monthShort(d)} ${dayNumber.format(d)} · ${state}`
}

export { weekday2, weekdayShortFmt as weekdayShort, monthShort, fullDate }
