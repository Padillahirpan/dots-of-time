import { useAppStore } from '../store/useAppStore'

const THEMES = ['system', 'light', 'dark'] as const

/** Lightweight appearance panel: theme choice. */
export function SettingsPanel() {
  const theme = useAppStore((s) => s.theme)
  const setTheme = useAppStore((s) => s.setTheme)

  return (
    <section
      aria-label="Appearance"
      className="flex items-center justify-between gap-4 rounded-xl border border-border-line bg-surface-panel p-5"
    >
      <div>
        <h2 className="text-title-section font-medium text-fg-primary">Appearance</h2>
        <p className="text-caption text-fg-muted">Theme follows the system by default.</p>
      </div>
      <div
        role="group"
        aria-label="Theme"
        className="inline-flex rounded-lg border border-border-line"
      >
        {THEMES.map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={theme === t}
            onClick={() => setTheme(t)}
            className={`px-3 py-1 text-caption capitalize transition-colors ${
              theme === t ? 'bg-fg-primary text-bg-canvas' : 'text-fg-muted hover:text-fg-primary'
            }`}
          >
            {t}
          </button>
        ))}
      </div>
    </section>
  )
}
