import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { PERIOD_CAP } from '../lib/categories'
import type { Category, Win } from '../types'

interface WinsState {
  byPeriod: Record<string, Win[]>
  /** adds a win; enforces the 3-goal cap and one-per-category rule */
  add: (key: string, w: Omit<Win, 'id' | 'done' | 'one'>) => boolean
  toggleDone: (key: string, id: string) => void
  setOne: (key: string, id: string) => void
  remove: (key: string, id: string) => void
  /** patches a win (title, category, progress, note, …) */
  update: (key: string, id: string, patch: Partial<Omit<Win, 'id'>>) => void
  /** re-inserts a win at its old index (undo) */
  insert: (key: string, index: number, win: Win) => void
}

/** v1 stored `area: 0 | 1 | 2` (Career / Life / Money). */
const LEGACY_AREA: Record<number, Category> = {
  0: 'career',
  1: 'health',
  2: 'money',
}

export const useWinsStore = create<WinsState>()(
  persist(
    (set, get) => ({
      byPeriod: {},
      add: (key, w) => {
        const list = get().byPeriod[key] ?? []
        if (list.length >= PERIOD_CAP) return false
        if (!w.title.trim()) return false
        if (list.some((x) => x.category === w.category)) return false
        const win: Win = { ...w, id: crypto.randomUUID(), done: false, one: false }
        set({ byPeriod: { ...get().byPeriod, [key]: [...list, win] } })
        return true
      },
      toggleDone: (key, id) =>
        set((s) => ({
          byPeriod: {
            ...s.byPeriod,
            [key]: (s.byPeriod[key] ?? []).map((w) =>
              w.id === id ? { ...w, done: !w.done } : w,
            ),
          },
        })),
      setOne: (key, id) =>
        set((s) => ({
          byPeriod: {
            ...s.byPeriod,
            [key]: (s.byPeriod[key] ?? []).map((w) => ({
              ...w,
              one: w.id === id ? !w.one : false,
            })),
          },
        })),
      remove: (key, id) =>
        set((s) => ({
          byPeriod: {
            ...s.byPeriod,
            [key]: (s.byPeriod[key] ?? []).filter((w) => w.id !== id),
          },
        })),
      update: (key, id, patch) =>
        set((s) => ({
          byPeriod: {
            ...s.byPeriod,
            [key]: (s.byPeriod[key] ?? []).map((w) => (w.id === id ? { ...w, ...patch } : w)),
          },
        })),
      insert: (key, index, win) =>
        set((s) => {
          const list = [...(s.byPeriod[key] ?? [])]
          list.splice(Math.min(index, list.length), 0, win)
          return { byPeriod: { ...s.byPeriod, [key]: list } }
        }),
    }),
    {
      name: 'dots-wins',
      version: 2,
      migrate: (persisted) => {
        const byPeriod: Record<string, Win[]> = {}
        for (const [k, wins] of Object.entries((persisted as { byPeriod?: Record<string, unknown> })?.byPeriod ?? {})) {
          byPeriod[k] = (wins as Win[]).map((w) => ({
            ...w,
            category: LEGACY_AREA[w.category as unknown as number] ?? 'career',
          }))
        }
        return { byPeriod }
      },
    },
  ),
)
