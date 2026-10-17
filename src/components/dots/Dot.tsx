import type { CSSProperties, FocusEvent, MouseEvent, PointerEvent } from 'react'

interface DotProps {
  /** fraction of this dot that has passed, 0..1 */
  fraction: number
  /** accessible name, e.g. "14:00" or "October 16 (Today)" */
  ariaLabel: string
  title?: string
  /** visible number inside the dot, e.g. the day of month */
  label?: string
  sizeClass?: string
  className?: string
  /** stagger delay for the entrance animation, in ms */
  delayMs?: number
  /** renders a <button> instead of a <span> (interactive dots, year grid) */
  interactive?: boolean
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
  onPointerEnter?: (e: PointerEvent<HTMLButtonElement>) => void
  onPointerLeave?: (e: PointerEvent<HTMLButtonElement>) => void
  onFocus?: (e: FocusEvent<HTMLButtonElement>) => void
  onBlur?: (e: FocusEvent<HTMLButtonElement>) => void
}

/**
 * Cadence dot. Fill is driven by the --f custom property:
 * passed dots are solid, the current dot is partially filled with a
 * pulsing ring, remaining dots stay outlined. Color alone never carries
 * meaning — fill versus outline does.
 */
export function Dot({
  fraction,
  ariaLabel,
  title,
  label,
  sizeClass = '',
  className = '',
  delayMs,
  interactive = false,
  onClick,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
}: DotProps) {
  const passed = fraction >= 1
  const current = fraction > 0 && fraction < 1
  const cls = `dot ${sizeClass} ${delayMs !== undefined ? 'dot-in' : ''} ${className}`.trim()
  const style = {
    '--f': fraction,
    ...(delayMs !== undefined ? { '--d': `${delayMs}ms` } : {}),
  } as CSSProperties

  if (interactive) {
    return (
      <button
        type="button"
        className={cls}
        style={style}
        aria-label={ariaLabel}
        title={title}
        data-passed={passed}
        data-current={current}
        onClick={onClick}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    )
  }

  return (
    <span
      role="img"
      aria-label={ariaLabel}
      title={title}
      className={cls}
      style={style}
      data-passed={passed}
      data-current={current}
    >
      {label !== undefined && <span className="relative z-10">{label}</span>}
    </span>
  )
}

/** Dashed cell for days of the adjacent month in the calendar grid. */
export function PadCell({ label }: { label: string }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-9 w-9 items-center justify-center rounded-full border border-dashed border-border-line/60 text-[10px] text-fg-muted opacity-40"
    >
      {label}
    </span>
  )
}
