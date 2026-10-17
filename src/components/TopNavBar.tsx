import type { Scale } from '../types'
import { navContext } from '../lib/format'
import { Icon } from './Icon'
import { ScaleTabs } from './ScaleTabs'

interface TopNavBarProps {
  view: Scale
  now: Date
  onView: (v: Scale) => void
  settingsOpen: boolean
  onToggleSettings: () => void
}

/** Sticky top bar: brand + scale tabs + settings action. */
export function TopNavBar({ view, now, onView, settingsOpen, onToggleSettings }: TopNavBarProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-bg-canvas">
      <div className="mx-auto flex h-14 max-w-[720px] items-center justify-between px-margin">
        <div className="flex min-w-0 items-center gap-2">
          <span className="text-title-section font-medium tracking-tight whitespace-nowrap text-fg-primary">
            Dots of Time
          </span>
          <span className="hidden text-caption whitespace-nowrap text-fg-muted sm:inline">
            · {navContext(view, now)}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <ScaleTabs value={view} onChange={onView} className="hidden sm:flex" />
          <div className="flex items-center border-l border-border-line pl-3">
            <button
              type="button"
              onClick={onToggleSettings}
              aria-label="Settings"
              aria-expanded={settingsOpen}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-surface-container-high hover:text-fg-primary"
            >
              <Icon name="settings" />
            </button>
          </div>
        </div>
      </div>

      {/* mobile tab row */}
      <div className="border-t border-border-line px-margin py-2 sm:hidden">
        <ScaleTabs value={view} onChange={onView} className="w-full justify-around" />
      </div>
    </header>
  )
}
