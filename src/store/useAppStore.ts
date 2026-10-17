import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Scale } from '../types'

interface AppState {
  view: Scale
  theme: 'system' | 'light' | 'dark'
  /** dot accent color; '' follows the theme default, otherwise any CSS color */
  dotColor: string
  setView: (v: Scale) => void
  setTheme: (t: AppState['theme']) => void
  setDotColor: (c: string) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      view: 'd',
      theme: 'system',
      dotColor: '',
      setView: (view) => set({ view }),
      setTheme: (theme) => set({ theme }),
      setDotColor: (dotColor) => set({ dotColor }),
    }),
    {
      name: 'dots-app',
      version: 3,
      // v1 stored hue/areaHues; v2 added nothing new; v3 adds dotColor
      migrate: (persisted) => {
        const s = persisted as Partial<Pick<AppState, 'view' | 'theme'>>
        return { view: s.view ?? 'd', theme: s.theme ?? 'system', dotColor: '' }
      },
    },
  ),
)
