import { useRef } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent } from 'react'
import type { Scale } from '../types'

const TABS: readonly { id: Scale; label: string }[] = [
  { id: 'd', label: 'Day' },
  { id: 'w', label: 'Week' },
  { id: 'm', label: 'Month' },
  { id: 'y', label: 'Year' },
]

interface ScaleTabsProps {
  value: Scale
  onChange: (v: Scale) => void
  className?: string
}

/** Underlined scale switcher with ARIA tabs pattern and roving tabindex. */
export function ScaleTabs({ value, onChange, className = '' }: ScaleTabsProps) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  const onKeyDown = (e: ReactKeyboardEvent) => {
    const idx = TABS.findIndex((t) => t.id === value)
    let next: number | null = null
    if (e.key === 'ArrowRight') next = (idx + 1) % TABS.length
    else if (e.key === 'ArrowLeft') next = (idx - 1 + TABS.length) % TABS.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = TABS.length - 1
    if (next === null) return
    e.preventDefault()
    onChange(TABS[next].id)
    refs.current[next]?.focus()
  }

  return (
    <div
      role="tablist"
      aria-label="Time scale"
      onKeyDown={onKeyDown}
      className={`flex items-center gap-5 text-label-sm ${className}`}
    >
      {TABS.map(({ id, label }, i) => {
        const selected = value === id
        return (
          <button
            key={id}
            ref={(el) => {
              refs.current[i] = el
            }}
            type="button"
            role="tab"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(id)}
            className={`pb-1 transition-colors ${
              selected
                ? 'border-b-2 border-primary font-medium text-fg-primary'
                : 'text-fg-muted hover:text-fg-primary'
            }`}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
