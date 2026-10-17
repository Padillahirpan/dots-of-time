import { beforeEach, describe, expect, it } from 'vitest'
import { useWinsStore } from './useWinsStore'

const key = 'd:2026-10-16'

beforeEach(() => {
  localStorage.clear()
  useWinsStore.setState({ byPeriod: {} })
})

describe('useWinsStore', () => {
  it('caps a period at three goals total', () => {
    const s = useWinsStore.getState()
    s.add(key, { title: 'A', category: 'health' })
    s.add(key, { title: 'B', category: 'family' })
    s.add(key, { title: 'C', category: 'money' })
    expect(s.add(key, { title: 'D', category: 'career' })).toBe(false)
    expect(useWinsStore.getState().byPeriod[key]).toHaveLength(3)
  })

  it('blocks a second goal in the same category', () => {
    const s = useWinsStore.getState()
    s.add(key, { title: 'Gym', category: 'health' })
    expect(s.add(key, { title: 'Sleep', category: 'health' })).toBe(false)
    expect(useWinsStore.getState().byPeriod[key]).toHaveLength(1)
  })

  it('accepts different categories until the cap', () => {
    const s = useWinsStore.getState()
    expect(s.add(key, { title: 'Gym', category: 'health' })).toBe(true)
    expect(s.add(key, { title: 'PR review', category: 'career' })).toBe(true)
    expect(s.add(key, { title: 'Save $2', category: 'money' })).toBe(true)
  })

  it('rejects empty titles', () => {
    expect(useWinsStore.getState().add(key, { title: '   ', category: 'health' })).toBe(false)
    expect(useWinsStore.getState().byPeriod[key]).toBeUndefined()
  })

  it('keeps lists per period separate', () => {
    useWinsStore.getState().add(key, { title: 'A', category: 'health' })
    useWinsStore.getState().add('w:2026-10-12', { title: 'B', category: 'family' })
    expect(useWinsStore.getState().byPeriod[key]).toHaveLength(1)
    expect(useWinsStore.getState().byPeriod['w:2026-10-12']).toHaveLength(1)
  })

  it('toggles done', () => {
    useWinsStore.getState().add(key, { title: 'A', category: 'health' })
    const id = useWinsStore.getState().byPeriod[key][0].id
    useWinsStore.getState().toggleDone(key, id)
    expect(useWinsStore.getState().byPeriod[key][0].done).toBe(true)
    useWinsStore.getState().toggleDone(key, id)
    expect(useWinsStore.getState().byPeriod[key][0].done).toBe(false)
  })

  it('allows only one "the one" per list', () => {
    useWinsStore.getState().add(key, { title: 'A', category: 'health' })
    useWinsStore.getState().add(key, { title: 'B', category: 'family' })
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
    useWinsStore.getState().add(key, { title: 'A', category: 'health' })
    const id = useWinsStore.getState().byPeriod[key][0].id
    useWinsStore.getState().remove(key, id)
    expect(useWinsStore.getState().byPeriod[key]).toHaveLength(0)
  })

  it('re-inserts a win at its old index (undo)', () => {
    useWinsStore.getState().add(key, { title: 'A', category: 'health' })
    useWinsStore.getState().add(key, { title: 'B', category: 'family' })
    const [a, b] = useWinsStore.getState().byPeriod[key]
    useWinsStore.getState().remove(key, a.id)
    useWinsStore.getState().insert(key, 0, a)
    const list = useWinsStore.getState().byPeriod[key]
    expect(list.map((w) => w.title)).toEqual(['A', 'B'])
    expect(list[0].id).toBe(a.id)
    expect(list[1].id).toBe(b.id)
  })

  it('patches a win (title, category, progress, note, done)', () => {
    useWinsStore.getState().add(key, { title: 'A', category: 'health' })
    const id = useWinsStore.getState().byPeriod[key][0].id
    useWinsStore.getState().update(key, id, {
      title: 'A revised',
      category: 'play',
      progress: 45,
      note: 'Drafting section 2',
      done: false,
    })
    const w = useWinsStore.getState().byPeriod[key][0]
    expect(w.title).toBe('A revised')
    expect(w.category).toBe('play')
    expect(w.progress).toBe(45)
    expect(w.note).toBe('Drafting section 2')
    expect(w.done).toBe(false)
  })

  it('persists under the dots-wins key', () => {
    useWinsStore.getState().add(key, { title: 'A', category: 'health' })
    expect(localStorage.getItem('dots-wins')).toBeTruthy()
  })
})
