import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Scale } from '../types'

interface AppState {
  view: Scale
  theme: 'system' | 'light' | 'dark'
  setView: (v: Scale) => void
  setTheme: (t: AppState['theme']) => void
}

export const THEME_ORDER = ['system', 'light', 'dark'] as const

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      view: 'd',
      theme: 'system',
      setView: (view) => set({ view }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'dots-app',
      version: 2,
      // v1 also stored hue/areaHues (old accent picker); they were dropped in v2
      migrate: (persisted) => {
        const s = persisted as Partial<Pick<AppState, 'view' | 'theme'>>
        return { view: s.view ?? 'd', theme: s.theme ?? 'system' }
      },
    },
  ),
)
