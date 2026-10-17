import { describe, expect, it } from 'vitest'
import {
  bounds,
  dayFraction,
  daysInMonth,
  daysInYear,
  dotFraction,
  monthPadStart,
  progress,
} from './time'

describe('bounds', () => {
  it('day spans midnight to midnight', () => {
    const [a, b] = bounds('d', new Date(2026, 9, 16, 15, 30))
    expect(a).toEqual(new Date(2026, 9, 16))
    expect(b).toEqual(new Date(2026, 9, 17))
  })

  it('week starts on Monday', () => {
    const friday = new Date(2026, 9, 16, 10) // 2026-10-16 is a Friday
    const [a, b] = bounds('w', friday)
    expect(a).toEqual(new Date(2026, 9, 12)) // Monday
    expect(b).toEqual(new Date(2026, 9, 19)) // next Monday
  })

  it('week starting on a Sunday rolls back to the previous Monday', () => {
    const sunday = new Date(2026, 9, 18, 10)
    const [a] = bounds('w', sunday)
    expect(a).toEqual(new Date(2026, 9, 12))
  })

  it('month spans first to first', () => {
    const [a, b] = bounds('m', new Date(2026, 1, 10))
    expect(a).toEqual(new Date(2026, 1, 1))
    expect(b).toEqual(new Date(2026, 2, 1))
  })

  it('year handles leap years', () => {
    const [a, b] = bounds('y', new Date(2024, 5, 1))
    expect((+b - +a) / 86_400_000).toBe(366)
    const [a2, b2] = bounds('y', new Date(2026, 5, 1))
    expect((+b2 - +a2) / 86_400_000).toBe(365)
  })
})

describe('progress', () => {
  it('is half at noon', () => {
    expect(progress('d', new Date(2026, 9, 16, 12))).toBeCloseTo(0.5)
  })

  it('is within 0..1', () => {
    const p = progress('y', new Date(2026, 0, 1, 0, 0, 1))
    expect(p).toBeGreaterThanOrEqual(0)
    expect(p).toBeLessThanOrEqual(1)
  })
})

describe('dotFraction', () => {
  it('fills the current dot partially', () => {
    // half a day passed, 24 dots: 12 full, dot 12 empty
    expect(dotFraction(0.5, 24, 11)).toBe(1)
    expect(dotFraction(0.5, 24, 12)).toBe(0)
  })

  it('clamps to 0..1', () => {
    expect(dotFraction(0.9, 10, 0)).toBe(1)
    expect(dotFraction(0.1, 10, 9)).toBe(0)
  })
})

describe('dayFraction', () => {
  it('is half at noon', () => {
    expect(dayFraction(new Date(2026, 9, 16, 12), 2026, 9, 16)).toBeCloseTo(0.5)
  })

  it('is 0 before and 1 after the day', () => {
    expect(dayFraction(new Date(2026, 9, 15, 12), 2026, 9, 16)).toBe(0)
    expect(dayFraction(new Date(2026, 9, 17, 12), 2026, 9, 16)).toBe(1)
  })
})

describe('calendar helpers', () => {
  it('daysInMonth handles varying lengths and leap Februaries', () => {
    expect(daysInMonth(2026, 1)).toBe(28)
    expect(daysInMonth(2024, 1)).toBe(29)
    expect(daysInMonth(2026, 9)).toBe(31)
    expect(daysInMonth(2026, 3)).toBe(30)
  })

  it('daysInYear matches leap rules', () => {
    expect(daysInYear(2024)).toBe(366)
    expect(daysInYear(2000)).toBe(366)
    expect(daysInYear(1900)).toBe(365)
    expect(daysInYear(2026)).toBe(365)
  })

  it('monthPadStart aligns day 1 to the Monday column', () => {
    // 2026-10-01 is a Thursday -> column 3 (Mon=0)
    expect(monthPadStart(2026, 9)).toBe(3)
    // 2026-09-01 was a Tuesday -> column 1
    expect(monthPadStart(2026, 8)).toBe(1)
  })
})
