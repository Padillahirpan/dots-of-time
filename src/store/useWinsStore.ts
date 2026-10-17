import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AREA_CAP } from '../lib/areas'
import type { Win } from '../types'

interface WinsState {
  byPeriod: Record<string, Win[]>
  add: (key: string, w: Omit<Win, 'id' | 'done' | 'one'>) => boolean
  toggleDone: (key: string, id: string) => void
  setOne: (key: string, id: string) => void
  remove: (key: string, id: string) => void
  /** patches a win (title, area, progress, note, done, …) */
  update: (key: string, id: string, patch: Partial<Omit<Win, 'id'>>) => void
  /** re-inserts a win at its old index (undo) */
  insert: (key: string, index: number, win: Win) => void
}

export const MAX_PER_AREA = AREA_CAP

export const useWinsStore = create<WinsState>()(
  persist(
    (set, get) => ({
      byPeriod: {},
      add: (key, w) => {
        const list = get().byPeriod[key] ?? []
        const inArea = list.filter((x) => x.area === w.area).length
        if (inArea >= AREA_CAP || !w.title.trim()) return false
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
    { name: 'dots-wins', version: 1 },
  ),
)
