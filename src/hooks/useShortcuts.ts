import { useEffect } from 'react'
import type { Scale } from '../types'

/**
 * Global keyboard shortcuts: d/w/m/y switch scales, "?" shows the help toast.
 * Ignored while typing in form controls or with modifier keys held.
 */
export function useShortcuts(onView: (s: Scale) => void, onHelp: () => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const t = e.target as HTMLElement | null
      if (
        t &&
        (t.tagName === 'INPUT' || t.tagName === 'SELECT' || t.tagName === 'TEXTAREA' || t.isContentEditable)
      ) {
        return
      }
      // dialogs own the keyboard while open (Escape closes them)
      if (document.querySelector('[role="dialog"]')) return
      const k = e.key.toLowerCase()
      if (k === 'd') onView('d')
      else if (k === 'w') onView('w')
      else if (k === 'm') onView('m')
      else if (k === 'y') onView('y')
      else if (e.key === '?') onHelp()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onView, onHelp])
}
