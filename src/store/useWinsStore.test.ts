import { beforeEach, describe, expect, it } from 'vitest'
import { useWinsStore } from './useWinsStore'

const key = 'd:2026-10-16'

beforeEach(() => {
  localStorage.clear()
  useWinsStore.setState({ byPeriod: {} })
})

describe('useWinsStore', () => {
  it('caps wins at three per area', () => {
    const s = useWinsStore.getState()
    s.add(key, { title: 'A1', area: 0 })
    s.add(key, { title: 'A2', area: 0 })
    s.add(key, { title: 'A3', area: 0 })
    expect(s.add(key, { title: 'A4', area: 0 })).toBe(false)
    expect(useWinsStore.getState().byPeriod[key]).toHaveLength(3)
  })

  it('other areas still accept wins when one area is full', () => {
    const s = useWinsStore.getState()
    s.add(key, { title: 'C1', area: 0 })
    s.add(key, { title: 'C2', area: 0 })
    s.add(key, { title: 'C3', area: 0 })
    expect(s.add(key, { title: 'L1', area: 1 })).toBe(true)
    expect(useWinsStore.getState().byPeriod[key]).toHaveLength(4)
  })

  it('rejects empty titles', () => {
    expect(useWinsStore.getState().add(key, { title: '   ', area: 0 })).toBe(false)
    expect(useWinsStore.getState().byPeriod[key]).toBeUndefined()
  })

  it('keeps lists per period separate', () => {
    useWinsStore.getState().add(key, { title: 'A', area: 0 })
    useWinsStore.getState().add('w:2026-10-12', { title: 'B', area: 1 })
    expect(useWinsStore.getState().byPeriod[key]).toHaveLength(1)
    expect(useWinsStore.getState().byPeriod['w:2026-10-12']).toHaveLength(1)
  })

  it('toggles done', () => {
    useWinsStore.getState().add(key, { title: 'A', area: 0 })
    const id = useWinsStore.getState().byPeriod[key][0].id
    useWinsStore.getState().toggleDone(key, id)
    expect(useWinsStore.getState().byPeriod[key][0].done).toBe(true)
    useWinsStore.getState().toggleDone(key, id)
    expect(useWinsStore.getState().byPeriod[key][0].done).toBe(false)
  })

  it('allows only one "the one" per list', () => {
    useWinsStore.getState().add(key, { title: 'A', area: 0 })
    useWinsStore.getState().add(key, { title: 'B', area: 1 })
    const [a, b] = useWinsStore.getState().byPeriod[key]

    useWinsStore.getState().setOne(key, a.id)
    expect(useWinsStore.getState().byPeriod[key][0].one).toBe(true)

    useWinsStore.getState().setOne(key, b.id)
    const [a2, b2] = useWinsStore.getState().byPeriod[key]
    expect(a2.one).toBe(false)
    expect(b2.one).toBe(true)

    useWinsStore.getState().setOne(key, b.id) // tap again to clear
    expect(useWinsStore.getState().byPeriod[key][1].one).toBe(false)
  })

  it('removes a win', () => {
    useWinsStore.getState().add(key, { title: 'A', area: 0 })
    const id = useWinsStore.getState().byPeriod[key][0].id
    useWinsStore.getState().remove(key, id)
    expect(useWinsStore.getState().byPeriod[key]).toHaveLength(0)
  })

  it('re-inserts a win at its old index (undo)', () => {
    useWinsStore.getState().add(key, { title: 'A', area: 0 })
    useWinsStore.getState().add(key, { title: 'B', area: 1 })
    const [a, b] = useWinsStore.getState().byPeriod[key]
    useWinsStore.getState().remove(key, a.id)
    useWinsStore.getState().insert(key, 0, a)
    const list = useWinsStore.getState().byPeriod[key]
    expect(list.map((w) => w.title)).toEqual(['A', 'B'])
    expect(list[0].id).toBe(a.id)
    expect(list[1].id).toBe(b.id)
  })

  it('patches a win (title, area, progress, note, done)', () => {
    useWinsStore.getState().add(key, { title: 'A', area: 0 })
    const id = useWinsStore.getState().byPeriod[key][0].id
    useWinsStore.getState().update(key, id, {
      title: 'A revised',
      progress: 45,
      note: 'Drafting section 2',
      done: false,
    })
    const w = useWinsStore.getState().byPeriod[key][0]
    expect(w.title).toBe('A revised')
    expect(w.progress).toBe(45)
    expect(w.note).toBe('Drafting section 2')
    expect(w.done).toBe(false)
  })

  it('moves a win to another area via update', () => {
    useWinsStore.getState().add(key, { title: 'A', area: 0 })
    const id = useWinsStore.getState().byPeriod[key][0].id
    useWinsStore.getState().update(key, id, { area: 2 })
    expect(useWinsStore.getState().byPeriod[key][0].area).toBe(2)
  })

  it('persists under the dots-wins key', () => {
    useWinsStore.getState().add(key, { title: 'A', area: 0 })
    expect(localStorage.getItem('dots-wins')).toBeTruthy()
  })
})
