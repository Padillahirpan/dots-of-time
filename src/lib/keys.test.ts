import { describe, expect, it } from 'vitest'
import { parentKey, parentScale, periodKey } from './keys'

describe('periodKey', () => {
  const now = new Date(2026, 9, 16, 15) // Friday

  it('uses the local date for a day', () => {
    expect(periodKey('d', now)).toBe('d:2026-10-16')
  })

  it('uses the Monday date for a week', () => {
    expect(periodKey('w', now)).toBe('w:2026-10-12')
  })

  it('uses year-month for a month', () => {
    expect(periodKey('m', now)).toBe('m:2026-10')
  })

  it('uses the year for a year', () => {
    expect(periodKey('y', now)).toBe('y:2026')
  })

  it('pads single digits', () => {
    expect(periodKey('m', new Date(2026, 0, 3))).toBe('m:2026-01')
    expect(periodKey('d', new Date(2026, 0, 3))).toBe('d:2026-01-03')
  })
})

describe('parentKey', () => {
  const now = new Date(2026, 9, 16)

  it('cascades day to week to month to year', () => {
    expect(parentKey('d', now)).toBe('w:2026-10-12')
    expect(parentKey('w', now)).toBe('m:2026-10')
    expect(parentKey('m', now)).toBe('y:2026')
  })

  it('has no parent for the year', () => {
    expect(parentScale('y')).toBeNull()
    expect(parentKey('y', now)).toBeNull()
  })
})
