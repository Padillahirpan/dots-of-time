import { useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'

const THEME_COLORS = { light: '#f6f5f2', dark: '#131318' } as const

/** Applies the theme choice and dot accent to <html>, keeps browser chrome in sync. */
export function useTheme() {
  const theme = useAppStore((s) => s.theme)
  const dotColor = useAppStore((s) => s.dotColor)

  useEffect(() => {
    const r = document.documentElement
    if (theme === 'system') r.removeAttribute('data-theme')
    else r.dataset.theme = theme
  }, [theme])

  // empty string clears the override so the theme default (--cat-career) applies
  useEffect(() => {
    const r = document.documentElement
    r.style.setProperty('--a', dotColor || '')
  }, [dotColor])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    if (!meta) return
    const apply = () => {
      const dark = theme === 'dark' || (theme === 'system' && mq.matches)
      meta.content = dark ? THEME_COLORS.dark : THEME_COLORS.light
    }
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [theme])
}
