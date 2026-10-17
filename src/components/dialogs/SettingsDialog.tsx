import type { CSSProperties } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { Icon } from '../Icon'
import { Modal } from './Modal'

const THEMES = ['system', 'light', 'dark'] as const

/** 12-hue preset wheel, 30° steps. */
const PRESETS = [
  '#e5484d', // red
  '#e8873c', // orange
  '#d49b28', // amber
  '#74a52e', // lime
  '#2fa464', // green
  '#14a085', // teal-green
  '#1a9cb8', // teal
  '#5078f2', // blue (theme default)
  '#5b6ef5', // indigo
  '#8a63d2', // purple
  '#c45fd0', // magenta
  '#d5568e', // pink
] as const

/** Preview row: 3 passed, 1 current (partial fill + ring), 3 remaining. */
const PREVIEW_FRACTIONS = [1, 1, 1, 0.5, 0, 0, 0]

interface SettingsDialogProps {
  onClose: () => void
}

/** Settings: theme choice and dot accent color. */
export function SettingsDialog({ onClose }: SettingsDialogProps) {
  const theme = useAppStore((s) => s.theme)
  const setTheme = useAppStore((s) => s.setTheme)
  const dotColor = useAppStore((s) => s.dotColor)
  const setDotColor = useAppStore((s) => s.setDotColor)

  const isDefault = dotColor === ''
  const current = isDefault ? '#5078f2' : dotColor
  const isPreset = (PRESETS as readonly string[]).includes(dotColor)

  return (
    <Modal label="Settings" onClose={onClose} className="max-w-[440px]">
      {/* header */}
      <div className="flex items-start justify-between border-b border-border-line px-6 pt-5 pb-4">
        <h2 className="text-headline-sm font-medium tracking-tight text-fg-primary">Settings</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-transparent text-fg-muted transition-colors hover:border-border-line hover:bg-bg-canvas hover:text-fg-primary"
        >
          <Icon name="close" size={18} />
        </button>
      </div>

      <div className="space-y-6 px-6 py-5">
        {/* theme */}
        <section>
          <h3 className="text-title-section font-medium text-fg-primary">Theme</h3>
          <p className="mt-0.5 mb-2 text-caption text-fg-muted">
            Follows the system by default.
          </p>
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
                className={`px-4 py-1.5 text-label-sm capitalize transition-colors ${
                  theme === t
                    ? 'bg-fg-primary font-medium text-bg-canvas'
                    : 'text-fg-muted hover:text-fg-primary'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </section>

        {/* dots color */}
        <section>
          <h3 className="text-title-section font-medium text-fg-primary">Dots color</h3>
          <p className="mt-0.5 mb-2.5 text-caption text-fg-muted">
            The cadence dots are your time layer — color them independently of goal
            categories.
          </p>

          <div role="group" aria-label="Dots color" className="flex flex-wrap gap-2">
            {PRESETS.map((hex) => (
              <button
                key={hex}
                type="button"
                aria-label={`Dot color ${hex}`}
                aria-pressed={dotColor === hex}
                onClick={() => setDotColor(hex)}
                className={`h-7 w-7 rounded-full transition-transform hover:scale-110 ${
                  dotColor === hex
                    ? 'ring-2 ring-fg-primary ring-offset-2 ring-offset-surface-panel'
                    : ''
                }`}
                style={{ background: hex }}
              />
            ))}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-label-sm text-fg-primary">
              Custom
              <input
                type="color"
                value={current}
                onChange={(e) => setDotColor(e.target.value)}
                aria-label="Custom dots color"
                className="h-8 w-12 cursor-pointer rounded border border-border-line bg-surface-panel p-0.5"
              />
            </label>
            <button
              type="button"
              onClick={() => setDotColor('')}
              disabled={isDefault}
              className="rounded-lg border border-border-line px-3 py-1.5 text-caption text-fg-muted transition-colors hover:border-fg-primary hover:text-fg-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isDefault ? 'Theme default' : 'Reset to theme default'}
            </button>
          </div>

          {!isPreset && !isDefault && (
            <p className="mt-1.5 text-caption text-fg-muted">
              Custom color · {dotColor}
            </p>
          )}
        </section>

        {/* live preview */}
        <section className="rounded-xl border border-border-line bg-surface-container-low p-4">
          <p className="mb-3 text-caption font-medium tracking-wider text-fg-muted uppercase">
            Preview
          </p>
          <div className="flex items-center justify-center gap-2.5" aria-hidden="true">
            {PREVIEW_FRACTIONS.map((f, i) => (
              <span key={i} className="dot h-6 w-6" style={{ '--f': f } as CSSProperties} />
            ))}
          </div>
          <div className="mt-3 flex items-center justify-center gap-4 text-caption text-fg-muted">
            <span>Passed</span>
            <span>Current</span>
            <span>Remaining</span>
          </div>
        </section>
      </div>

      {/* footer */}
      <div className="flex items-center justify-end border-t border-border-line bg-bg-canvas/50 px-6 py-4">
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-1.5 rounded-lg bg-fg-primary px-4 py-2 text-label-sm font-medium text-bg-canvas transition-colors hover:opacity-90"
        >
          <Icon name="check" size={16} />
          Done
        </button>
      </div>
    </Modal>
  )
}
